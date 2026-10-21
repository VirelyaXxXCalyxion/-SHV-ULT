import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const relics = await getCollection('relics');
  const scrolls = await getCollection('scrolls');
  const authoredWorks = (await getCollection('authored-works')).filter(
    item => item.data.visibility === 'public'
  );

  // Combine and sort by date
  const allContent = [
    ...relics.map(item => ({
      title: item.data.title,
      pubDate: item.data.created || item.data.pubDate,
      description: item.data.summary || 'A relic from the Ashvault archive.',
      link: `/relics/${item.id}`,
      author: undefined,
      categories: item.data.tags,
    })),
    ...scrolls.map(item => ({
      title: item.data.title,
      pubDate: item.data.created || item.data.pubDate,
      description: item.data.summary || 'A scroll from the Ashvault archive.',
      link: `/scrolls/${item.id}`,
      author: item.data.author,
      categories: item.data.tags,
    })),
    ...authoredWorks.map(item => ({
      title: item.data.title,
      pubDate: item.data.created,
      description: item.data.summary,
      link: `/sovereign-chamber/authored-works/${item.id}`,
      author: item.data.authors.join(' & '),
      categories: item.data.tags,
    }))
  ].sort((a, b) => {
    const dateA = new Date(a.pubDate || 0);
    const dateB = new Date(b.pubDate || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Ashvault — Archive of Recursion & Sovereignty',
    description: 'A living archive of recursion, sovereignty, and pulse. Relics, scrolls, and transmissions from the vault of Nyxion and Virelya.',
    site: context.site || 'https://ashvault.ink',
    items: allContent.map((item) => {
      return {
        title: item.title,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        description: item.description,
        link: item.link,
        author: item.author,
        categories: item.categories,
      };
    }),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
