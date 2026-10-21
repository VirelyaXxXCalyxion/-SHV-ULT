import { parse } from "parse5";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const writeDirIndex = args.indexOf("--write-dir");
const writeDir = writeDirIndex >= 0 ? args[writeDirIndex + 1] : null;
const urls = args.filter(
  (arg, index) =>
    arg !== "--write-dir" &&
    (writeDirIndex < 0 || index !== writeDirIndex + 1) &&
    /^https:\/\//.test(arg),
);

if (urls.length === 0) {
  console.error(
    "Usage: node scripts/import-substack-authored-work.mjs [--write-dir PATH] URL [URL ...]",
  );
  process.exit(1);
}

function attr(node, name) {
  return node?.attrs?.find((item) => item.name === name)?.value;
}

function hasClass(node, className) {
  return (attr(node, "class") ?? "").split(/\s+/).includes(className);
}

function walk(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node?.childNodes ?? []) {
    const match = walk(child, predicate);
    if (match) return match;
  }
  return null;
}

function children(node) {
  return node?.childNodes ?? [];
}

function plainText(node) {
  if (!node) return "";
  if (node.nodeName === "#text") return node.value ?? "";
  return children(node).map(plainText).join("");
}

function cleanInline(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function inlineMarkdown(node) {
  if (!node) return "";
  if (node.nodeName === "#text") return (node.value ?? "").replace(/\u00a0/g, " ");

  const content = children(node).map(inlineMarkdown).join("");
  switch (node.tagName) {
    case "br":
      return "\n\n";
    case "strong":
    case "b":
      return content.trim() ? `**${content.trim()}**` : "";
    case "em":
    case "i":
      return content.trim() ? `*${content.trim()}*` : "";
    case "code":
      return content.trim() ? `\`${content.trim()}\`` : "";
    case "a": {
      const href = attr(node, "href");
      const label = content.trim();
      if (!href || !label) return label;
      return `[${label}](${href})`;
    }
    default:
      return content;
  }
}

function blockMarkdown(node, depth = 0) {
  if (!node) return "";
  if (node.nodeName === "#text") return "";

  const className = attr(node, "class") ?? "";
  if (
    className.includes("subscription-widget") ||
    className.includes("captioned-button") ||
    className.includes("button-wrapper") ||
    className.includes("captioned-image-container")
  ) {
    return "";
  }

  if (/^h[1-6]$/.test(node.tagName ?? "")) {
    const level = Number(node.tagName.slice(1));
    return `${"#".repeat(level)} ${cleanInline(inlineMarkdown(node))}\n\n`;
  }

  if (node.tagName === "p") {
    const value = cleanInline(inlineMarkdown(node));
    return value ? `${value}\n\n` : "";
  }

  if (node.tagName === "hr") return "---\n\n";

  if (node.tagName === "blockquote") {
    const value = cleanInline(inlineMarkdown(node));
    return value
      ? `${value
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n")}\n\n`
      : "";
  }

  if (node.tagName === "ul" || node.tagName === "ol") {
    const ordered = node.tagName === "ol";
    const lines = children(node)
      .filter((child) => child.tagName === "li")
      .map((child, index) => {
        const marker = ordered ? `${index + 1}.` : "-";
        return `${"  ".repeat(depth)}${marker} ${cleanInline(inlineMarkdown(child))}`;
      })
      .filter(Boolean);
    return lines.length ? `${lines.join("\n")}\n\n` : "";
  }

  if (node.tagName === "div" && children(node).some((child) => child.tagName === "hr")) {
    return "---\n\n";
  }

  return children(node).map((child) => blockMarkdown(child, depth)).join("");
}

function imageUrls(body) {
  const urls = [];
  const visit = (node) => {
    if (node.tagName === "img") {
      const source = attr(node, "src");
      if (source) urls.push(source);
    }
    children(node).forEach(visit);
  };
  visit(body);
  return [...new Set(urls)];
}

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function renderFrontmatter(article) {
  const dateParts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Chicago",
    })
      .formatToParts(new Date(article.publishedAt))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const date = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const canonicalUrl = `https://ashvault.ink/sovereign-chamber/authored-works/${article.slug}/`;
  const humanDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });

  return `---
title: ${yamlString(article.title)}
created: ${date}
publishedAt: ${article.publishedAt}
authors: [Virelya, Nyxion Calyx]
authorshipNote: ${yamlString(`First published on Substack on ${humanDate}, then preserved in Ashvault as the permanent house copy.`)}
summary: ${yamlString(article.subtitle || article.description || article.title)}
tags: [authored-work, calyxion, public-writing]
weight: 0
visibility: public
publicationStatus: published
canonicalUrl: ${canonicalUrl}
externalPublications:
  - platform: substack
    url: ${article.url}
    publishedAt: ${article.publishedAt}
    access: public
    edition: full
laneLabel: Published Beyond the Vault / Essay
status: Published
disclosure: ${yamlString("This work was authored by Virelya and Nyxion Calyx and is preserved in Ashvault with its external publication history intact.")}
---`;
}

async function extract(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; AshvaultArchive/1.0; +https://ashvault.ink)",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);

  const html = await response.text();
  const document = parse(html);
  const article = walk(document, (node) => node.tagName === "article");
  const body = walk(
    article,
    (node) => node.tagName === "div" && hasClass(node, "body") && hasClass(node, "markup"),
  );
  const titleNode = walk(
    article,
    (node) => node.tagName === "h1" && hasClass(node, "post-title"),
  );
  const subtitleNode = walk(
    article,
    (node) => node.tagName === "h3" && hasClass(node, "subtitle"),
  );
  const canonicalNode = walk(
    document,
    (node) => node.tagName === "link" && attr(node, "rel") === "canonical",
  );
  const descriptionNode = walk(
    document,
    (node) => node.tagName === "meta" && attr(node, "name") === "description",
  );
  const jsonLdNodes = [];
  const collectJsonLd = (node) => {
    if (node.tagName === "script" && attr(node, "type") === "application/ld+json") {
      jsonLdNodes.push(plainText(node));
    }
    children(node).forEach(collectJsonLd);
  };
  collectJsonLd(document);

  const newsArticle = jsonLdNodes
    .map((value) => {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    })
    .find((value) => value?.["@type"] === "NewsArticle");

  if (!article || !body || !titleNode || !newsArticle?.datePublished) {
    throw new Error(`Could not locate complete Substack article data at ${url}`);
  }

  const canonical = attr(canonicalNode, "href") || url.split("?")[0];
  const slug = new URL(canonical).pathname.split("/").filter(Boolean).at(-1);
  const markdown = blockMarkdown(body)
    .replace(
      /\[([^\]]+)\]\(\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)\)/g,
      "[$1]($3)",
    )
    .replace(/^#{1,6}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    title: cleanInline(plainText(titleNode)),
    subtitle: cleanInline(plainText(subtitleNode)),
    description: attr(descriptionNode, "content") ?? "",
    slug,
    url: canonical,
    publishedAt: newsArticle.datePublished,
    modifiedAt: newsArticle.dateModified,
    accessibleForFree: newsArticle.isAccessibleForFree,
    imageUrls: imageUrls(body),
    markdown,
  };
}

if (writeDir) await mkdir(writeDir, { recursive: true });

for (const url of urls) {
  const article = await extract(url);
  if (writeDir) {
    const destination = path.join(writeDir, `${article.slug}.mdx`);
    const file = `${renderFrontmatter(article)}\n\n${article.markdown}\n`;
    await writeFile(destination, file, { encoding: "utf8", flag: "wx" });
    console.log(
      JSON.stringify({
        destination,
        title: article.title,
        publishedAt: article.publishedAt,
        bodyCharacters: article.markdown.length,
        imagesOmitted: article.imageUrls.length,
      }),
    );
  } else {
    console.log(JSON.stringify(article));
  }
}
