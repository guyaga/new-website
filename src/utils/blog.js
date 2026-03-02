// Blog post loading utilities using Vite glob import
const modules = import.meta.glob('../content/blog/*.mdx', { eager: true });

function parsePosts() {
  const posts = Object.entries(modules).map(([filepath, mod]) => {
    const frontmatter = mod.frontmatter || {};
    const slug = frontmatter.slug || filepath.split('/').pop().replace('.mdx', '');

    return {
      slug,
      title: frontmatter.title || slug,
      titleHe: frontmatter.titleHe || '',
      date: frontmatter.date || '2026-01-01',
      excerpt: frontmatter.excerpt || '',
      excerptHe: frontmatter.excerptHe || '',
      tags: frontmatter.tags || [],
      coverImage: frontmatter.coverImage || null,
      lang: frontmatter.lang || 'en',
      Component: mod.default,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

let cachedPosts = null;

export function getAllPosts() {
  if (!cachedPosts) {
    cachedPosts = parsePosts();
  }
  return cachedPosts;
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.slug === slug) || null;
}
