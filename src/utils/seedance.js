import { supabase } from '../lib/supabase';

export async function getSeedancePrompts({ page = 1, pageSize = 24, search = '' } = {}) {
  let query = supabase
    .from('seedance_prompts')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false });

  if (search.trim()) {
    const s = search.trim();
    query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,author.ilike.%${s}%`);
  }

  const start = (page - 1) * pageSize;
  const { data, error, count } = await query.range(start, start + pageSize - 1);

  return { prompts: data || [], total: count || 0, error };
}
