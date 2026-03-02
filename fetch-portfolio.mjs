import https from 'https';
import fs from 'fs';

const SUPABASE_URL = 'https://lvwewkpytqwlxxcefqdw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2d2V3a3B5dHF3bHh4Y2VmcWR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI1MzEzNywiZXhwIjoyMDY4ODI5MTM3fQ.fe0wwYmNc0rW-G3ofZGtPPfSGWUDxLqD5a1gdHOAvE8';

function fetchJSON(path) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const items = await fetchJSON('portfolio_items?status=eq.published&order=sort_order.asc');
const media = await fetchJSON('portfolio_media?order=sort_order.asc');

const mediaByProject = {};
for (const m of media) {
  if (!mediaByProject[m.portfolio_id]) mediaByProject[m.portfolio_id] = [];
  mediaByProject[m.portfolio_id].push({
    id: m.id,
    media_url: m.media_url,
    media_type: m.media_type,
    caption: m.caption,
    sort_order: m.sort_order,
  });
}

const merged = items.map(item => ({
  id: item.id,
  title: item.title,
  description: item.description,
  short_description: item.short_description,
  long_description: item.long_description,
  type: item.type,
  slug: item.slug,
  featured_image: item.featured_image,
  categories: item.categories,
  technologies: item.technologies,
  client_name: item.client_name,
  project_url: item.project_url,
  content: item.content,
  sort_order: item.sort_order,
  media: mediaByProject[item.id] || [],
}));

fs.writeFileSync('src/data/portfolio.json', JSON.stringify(merged, null, 2));
console.log(`Saved ${merged.length} projects:`);
merged.forEach((p, i) => console.log(`  ${i + 1}. ${p.title} (${p.media.length} media)`));
