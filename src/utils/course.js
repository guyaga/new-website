import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ── Public ──

export async function getSessions() {
  const { data, error } = await supabase
    .from('course_sessions')
    .select('*')
    .order('day', { ascending: true });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return data || [];
}

export async function getSessionByDay(day) {
  const { data, error } = await supabase
    .from('course_sessions')
    .select('*')
    .eq('day', day)
    .single();

  if (error) return null;
  return data;
}

export async function checkMemberEmail(email) {
  const { data, error } = await supabase
    .from('course_members')
    .select('id, name, email')
    .eq('email', email.trim().toLowerCase())
    .single();

  if (error || !data) return null;
  return data;
}

// ── Admin ──

export async function getMembers() {
  const { data, error } = await supabase
    .from('course_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data || [];
}

export async function addMember(name, email, phone = '') {
  const { data, error } = await supabase
    .from('course_members')
    .insert({ name, email, phone })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMember(id, updates) {
  const { data, error } = await supabase
    .from('course_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function sendWelcomeEmail(member) {
  return callEmailFunction({ type: 'welcome', member });
}

export async function removeMember(id) {
  const { error } = await supabase
    .from('course_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function unlockSession(id) {
  const { data, error } = await supabase
    .from('course_sessions')
    .update({ is_unlocked: true, unlocked_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function lockSession(id) {
  const { data, error } = await supabase
    .from('course_sessions')
    .update({ is_unlocked: false, unlocked_at: null })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSession(id, updates) {
  const { data, error } = await supabase
    .from('course_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Email via Supabase Edge Function ──

async function callEmailFunction(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-course-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send email');
  return data;
}

export async function sendUnlockEmail(session) {
  const members = await getMembers();
  if (members.length === 0) return { sent: 0 };

  return callEmailFunction({ type: 'unlock', session, members });
}
