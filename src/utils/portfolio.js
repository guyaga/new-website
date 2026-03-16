import { supabase } from '../lib/supabase';

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*, media:portfolio_media(*)')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }

  return data || [];
}

export async function getPortfolioBySlug(slug) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*, media:portfolio_media(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function getAllPortfolioWithMedia() {
  return getPortfolioItems();
}
