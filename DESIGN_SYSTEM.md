# Guyaga Design System — Image Generation Guidelines

## Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Black** | `#111111` | Primary dark backgrounds, text |
| **Signal Red** | `#E63B2E` | Accent, CTAs, highlights, connection lines |
| **Paper/Beige** | `#E8E4DD` | Secondary shapes, warm neutral |
| **Off-White** | `#F5F3EE` | Light backgrounds, cards |

## Visual Style
- **Aesthetic**: Architectural, Swiss-design inspired, minimal, editorial
- **Grid**: Thin subtle grid lines in background (40px spacing on web, faint white/grey on images)
- **Shapes**: Geometric primitives — circles, rectangles, triangles. Clean edges, no gradients
- **Composition**: Centered or asymmetric grid-based layouts. Breathing room. No clutter
- **Feel**: Precise, technical, strategic — like an architect's blueprint for digital products

## Image Generation Prompts (Gemini 3 Pro)

### Dark Background Template
```
Create a minimalist, editorial image. Black background (#111111). [SUBJECT DESCRIPTION using geometric shapes]. Use signal-red (#E63B2E) as the primary accent color for 2-3 key elements, and beige/paper (#E8E4DD) for secondary geometric elements. Thin white grid lines barely visible in background. No text. Style: architectural, Swiss design inspired, very clean and modern.
```

### Light Background Template
```
Create a minimalist image. Off-white/light background (#F5F3EE). [SUBJECT DESCRIPTION using geometric shapes]. Use black (#111111) for main shapes and signal-red (#E63B2E) for accent dots and connection lines. A very subtle architectural grid pattern in the background. No text. Style: clean, minimal, editorial, geometric and modern.
```

### Blueprint/Technical Template
```
Create a minimalist image. Black background (#111111). [SUBJECT DESCRIPTION with wireframe/schematic aesthetic]. Thin circuit-like line patterns and engineering geometric shapes. Use signal-red (#E63B2E) for key lines and connection points. Use beige/paper (#E8E4DD) for secondary wireframe elements. Style: like an architect's blueprint but for digital products — precise, technical, strategic. No text. Clean and editorial.
```

## Configuration
```javascript
config: {
  responseModalities: ['TEXT', 'IMAGE'],
  imageConfig: {
    aspectRatio: '16:9',  // Blog covers
    imageSize: '2K',
  },
}
```

## Aspect Ratios by Use Case
| Use Case | Ratio | Size |
|----------|-------|------|
| Blog covers | `16:9` | `2K` |
| Social media (square) | `1:1` | `2K` |
| Social stories | `9:16` | `2K` |
| OG/preview images | `16:9` | `2K` |
| Portfolio thumbnails | `4:3` | `2K` |

## Key Principles
1. **No text in generated images** — text is handled by the web layer
2. **Limited palette** — only use the 4 brand colors, no extras
3. **Signal red is the hero** — use sparingly for maximum impact (2-3 elements)
4. **Beige for warmth** — secondary shapes, softens the black/red contrast
5. **Grid always present** — even if barely visible, it ties to the architectural theme
6. **Geometric, not organic** — circles, rectangles, triangles, lines. No blobs or gradients
7. **Flat, not 3D** — paper-cutout or vector aesthetic, subtle shadows at most

## Example Results
- `public/blog/ai-tools-cover.jpg` — Dark bg, geometric shapes on grid (Swiss poster style)
- `public/blog/ai-education-cover.jpg` — Light bg, silhouettes + neural network nodes
- `public/blog/building-ai-cover.jpg` — Dark bg, wireframe devices + circuit patterns
