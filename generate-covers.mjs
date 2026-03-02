import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const projects = [
  {
    slug: 'ai-ecommerce-campaign',
    prompt: 'Create a minimalist editorial cover image. Black background (#111111). Abstract representation of a DJ / music video — geometric sound waves, vinyl record circles, and musical frequency bars made of clean geometric shapes. Use signal-red (#E63B2E) for the main wave/frequency elements, beige (#E8E4DD) for secondary circles and shapes. Thin grid lines faintly in background. No text. Style: architectural Swiss design, clean, cinematic.',
  },
  {
    slug: 'evlv-studio-ai-ads-saas',
    prompt: 'Create a minimalist editorial cover image. Black background (#111111). Abstract representation of an AI-powered ad design platform — floating rectangular banner shapes, layered card elements, and a central dashboard wireframe outline. Use signal-red (#E63B2E) for 2-3 key banner shapes, beige (#E8E4DD) for secondary card outlines and UI wireframe elements. Thin grid lines in background. No text. Style: architectural Swiss design, SaaS product feel.',
  },
  {
    slug: 'brand-identity-redesign',
    prompt: 'Create a minimalist editorial cover image. Off-white background (#F5F3EE). Abstract representation of AI inpainting / image transformation — a geometric building outline on the left transforming into colorful brand elements on the right, with a dividing line between old and new. Use black (#111111) for the building wireframe, signal-red (#E63B2E) for transformation elements and accent points. Subtle grid in background. No text. Style: architectural, editorial.',
  },
  {
    slug: 'social-media-growth',
    prompt: 'Create a minimalist editorial cover image. Black background (#111111). Abstract cinematic representation of a wolf / short film — geometric angular shapes forming an abstract wolf silhouette, with film strip elements and frame borders. Use signal-red (#E63B2E) for the wolf eyes/accent points and film frame lines, beige (#E8E4DD) for secondary geometric shapes. No text. Style: architectural Swiss design, dramatic, cinematic.',
  },
  {
    slug: 'video-marketing-series',
    prompt: 'Create a minimalist editorial cover image. Black background (#111111). Abstract representation of cybersecurity — geometric shield shapes, lock icons made of clean lines, circuit board patterns, and a central hexagonal security emblem. Use signal-red (#E63B2E) for the shield/lock accents and alert dots, beige (#E8E4DD) for circuit lines and secondary geometric elements. Thin grid in background. No text. Style: architectural, technical, editorial.',
  },
  {
    slug: 'Petpix-saas',
    prompt: 'Create a minimalist editorial cover image. Off-white background (#F5F3EE). Abstract representation of a pet portrait AI app — geometric shapes suggesting a pet silhouette (dog/cat) made of clean circles and triangles, surrounded by UI card elements and image frame rectangles. Use black (#111111) for the pet shape, signal-red (#E63B2E) for accent dots and AI sparkle elements. Subtle grid in background. No text. Style: clean, minimal, playful but sophisticated.',
  },
  {
    slug: 'notifications-podcast',
    prompt: 'Create a minimalist editorial cover image. Black background (#111111). Abstract representation of an AI podcast — geometric microphone outline, sound wave visualizations made of dots and lines, and the Google "G" suggested by 4 colored geometric circles. Use signal-red (#E63B2E) for sound wave accents, beige (#E8E4DD) for microphone wireframe and secondary shapes. No text. Style: architectural Swiss design, editorial.',
  },
  {
    slug: 'live-streaming',
    prompt: 'Create a minimalist editorial cover image. Off-white background (#F5F3EE). Abstract representation of live streaming — a central screen/monitor outline with broadcast signal waves emanating outward, connected viewer dots forming a network pattern, and a "LIVE" indicator circle. Use black (#111111) for the screen and network lines, signal-red (#E63B2E) for the live indicator, broadcast waves, and engagement dots. Subtle grid in background. No text. Style: architectural, editorial, dynamic.',
  },
];

async function generateCover(project, index) {
  const num = index + 1;
  console.log(`[${num}/8] Generating: ${project.slug}...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: project.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: { aspectRatio: '4:3', imageSize: '2K' },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && !part.thought) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync(`public/portfolio/${project.slug}.jpg`, buffer);
        console.log(`[${num}/8] Saved: ${project.slug}.jpg (${(buffer.length / 1024).toFixed(0)}KB)`);
        return true;
      }
    }
    console.log(`[${num}/8] No image in response for ${project.slug}`);
    return false;
  } catch (err) {
    console.error(`[${num}/8] FAILED: ${project.slug} — ${err.message}`);
    return false;
  }
}

// Run 2 at a time to avoid rate limits
async function run() {
  for (let i = 0; i < projects.length; i += 2) {
    const batch = projects.slice(i, i + 2);
    const results = await Promise.all(
      batch.map((p, j) => generateCover(p, i + j))
    );
    const failed = results.filter((r) => !r).length;
    if (failed > 0) {
      console.log(`Retrying ${failed} failed items...`);
      for (let j = 0; j < batch.length; j++) {
        if (!results[j]) await generateCover(batch[j], i + j);
      }
    }
  }
  console.log('\nDone! All covers generated.');
}

run();
