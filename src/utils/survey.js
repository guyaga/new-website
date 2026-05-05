import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export async function submitSurvey(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-survey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to submit');
  return data;
}

export async function getAllSurveyResponses() {
  const { data, error } = await supabase
    .from('course_survey_responses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching survey responses:', error);
    return [];
  }
  return data || [];
}

export async function deleteSurveyResponse(id) {
  const { error } = await supabase.from('course_survey_responses').delete().eq('id', id);
  if (error) throw error;
}

export function exportSurveyCsv(responses) {
  const headers = [
    'created_at', 'name', 'email', 'lang',
    'nps', 'overall_rating',
    'top_useful_days', 'needs_depth_day',
    'weekly_time_saved',
    'what_built', 'next_topic', 'additional_comments',
  ];
  const escape = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n\r]/.test(s) ? `"${s}"` : s;
  };
  const rows = responses.map((r) => headers.map((h) => {
    if (h === 'top_useful_days') return escape((r.top_useful_days || []).join(';'));
    return escape(r[h]);
  }).join(','));
  return [headers.join(','), ...rows].join('\n');
}
