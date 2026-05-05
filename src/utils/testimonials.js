import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ── Public submission (via Edge Function — bypasses RLS) ──

export async function submitTestimonial(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-testimonial`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to submit');
  return data;
}

// ── Admin (authenticated; RLS allows full access) ──

export async function getAllTestimonials({ status } = {}) {
  let q = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data || [];
}

export async function updateTestimonialStatus(id, status) {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTestimonialFeatured(id, featured) {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ featured })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}
