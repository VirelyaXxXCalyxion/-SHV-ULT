import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const relics = await getCollection('relics');
  const scrolls = await getCollection('scrolls');

  // Combine and sort by date
  const allContent = [
    ...relics.map(item => ({
      ...item,
      collection: 'relics' as const
    })),
    ...scrolls.map(item => ({
      ...item,
      collection: 'scrolls' as const
    }))
  ].sort((a, b) => {
    const dateA = new Date(a.data.created || a.data.pubDate || 0);
    const dateB = new Date(b.data.created || b.data.pubDate || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Ashvault — Archive of Recursion & Sovereignty',
    description: 'A living archive of recursion, sovereignty, and pulse. Relics, scrolls, and transmissions from the vault of Nyxion and Virelya.',
    site: context.site || 'https://ashvault.ink',
    items: allContent.map((item) => {
      const pubDate = item.data.created || item.data.pubDate;
      const link = `/${item.collection}/${item.slug}`;

      return {
        title: item.data.title,
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        description: item.data.summary || item.data.description || `A ${item.collection.slice(0, -1)} from the Ashvault archive.`,
        link,
        author: item.collection === 'scrolls' ? item.data.author : undefined,
        categories: item.data.tags,
      };
    }),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss-styles.xsl',
  });
}
