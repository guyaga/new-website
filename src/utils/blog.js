import { supabase } from '../lib/supabase';

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, date, excerpt, tags, cover_image, body, status')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data;
}
