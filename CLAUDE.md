# Tech Stack: Interactive Scrollytelling with Data Pipeline

This document describes the complete tech stack used to build this interactive CV. Use this as a reference for building similar data-driven scrollytelling projects.

## Overview

A lightweight, data-driven scrollytelling website with YAML → JSON → D3.js visualization pipeline. No build tools, no frameworks, just vanilla JS + CDN libraries.

## Frontend Stack

### Core Technologies
- **Vanilla JavaScript (ES6 modules)** - No framework overhead
- **HTML5 + CSS3** - Semantic markup, modern CSS
- **D3.js v7** - Data-driven visualizations
- **GSAP 3.12 + ScrollTrigger** - Scroll-based animations

### Why This Stack?
- Zero build step (instant reload)
- CDN-hosted libraries (no npm/node_modules)
- Small bundle size (~10KB custom JS)
- Works offline after first load
- Easy to debug (no transpilation)

### Frontend File Structure
```
web/
├── index.html              # Single-page scrollytelling layout
├── css/
│   ├── reset.css          # CSS reset
│   ├── variables.css      # Design tokens (colors, fonts)
│   └── scrollytelling.css # Layout + narrative styling
├── js/
│   ├── main.js            # Entry point, scroll controller
│   ├── visualizations.js  # D3.js viz manager (switch/case)
│   └── icon-cloud.js      # Reusable icon cloud component
└── data/
    └── cv_data.json       # Generated from YAML (single source)
```

## Data Pipeline Stack

### Core Technologies
- **Python 3.10+** - Data processing
- **PyYAML** - YAML parsing
- **JSON** - Frontend data format

### Pipeline Flow
```
1. Edit YAML (human-friendly)
   ↓
2. Python export script
   ↓
3. Generate JSON (machine-optimized)
   ↓
4. Frontend loads JSON
   ↓
5. D3.js renders visualizations
```

### Data File Structure
```
data/
├── raw/
│   ├── cv.yaml                  # Master CV (source of truth)
│   ├── skills_ontology.yaml     # Skill definitions + logos
│   └── company_logos.yaml       # Company metadata + logos
└── processed/
    └── (optional intermediate files)

scripts/
└── export_from_yaml.py          # YAML → JSON export script

web/data/
└── cv_data.json                 # Generated output for frontend
```

## Scrollytelling Architecture

### NYTimes-Style Overlay Pattern
```
Fixed visualization background (full screen)
  +
Scrolling narrative overlay (left side)
  =
Step-based animations triggered by scroll position
```

### Key Components

**HTML Structure:**
```html
<div class="scrollytelling-container">
  <!-- Fixed background viz -->
  <div class="visualization-panel">
    <div class="viz-step" data-viz-step="0"></div>
    <div class="viz-step" data-viz-step="1"></div>
    <!-- ... -->
  </div>

  <!-- Scrolling narrative -->
  <div class="narrative-panel">
    <div class="narrative-step" data-step="0"></div>
    <div class="narrative-step" data-step="1"></div>
    <!-- ... -->
  </div>
</div>
```

**JavaScript Pattern:**
```javascript
// 1. ScrollTrigger watches narrative steps
ScrollTrigger.create({
  trigger: narrativeStep,
  onEnter: () => updateVisualization(step)
});

// 2. Switch/case updates viz
updateVisualization(step) {
  switch(step) {
    case 0: this.createIntroViz(); break;
    case 1: this.createStep1Viz(); break;
    // ...
  }
}

// 3. D3.js renders each viz
createIntroViz() {
  const svg = d3.select('#viz-intro').append('svg');
  // ... D3 magic
}
```

## Design System

### Tufte-Inspired Principles
- Maximize data-ink ratio (minimal chrome)
- Light backgrounds (#FAFAF8)
- Muted accents (burgundy #8B4513)
- Serif fonts (Crimson Text) for warmth
- Monospace (#whoami) for technical flex

### Color Palette
```css
--color-bg: #FAFAF8;           /* Warm off-white */
--color-surface: #FFFFFF;       /* Pure white cards */
--color-text: #1a1a1a;         /* Near black */
--color-text-muted: #6B7280;   /* Gray */
--color-accent: #8B4513;       /* Saddle brown */
--color-border: #E5E5E5;       /* Light gray */
```

### Typography
```css
--font-serif: 'Crimson Text', Georgia, serif;
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

## Development Setup

### Requirements
- Python 3.10+
- Node.js (for live-server only, not for app)
- Modern browser (Chrome/Firefox/Safari)

### Installation
```bash
# Python dependencies
pip install pyyaml python-dateutil

# Dev server (optional, any HTTP server works)
npm install -g live-server

# Or use Python's built-in server
python3 -m http.server 8000 --directory web
```

### Development Workflow
```bash
# 1. Edit YAML data
vim data/raw/cv.yaml

# 2. Regenerate JSON
python3 scripts/export_from_yaml.py

# 3. Start dev server (auto-reload)
npx live-server web --port=8000

# 4. Open browser
open http://localhost:8000
```

## Key Libraries (CDN)

### D3.js v7
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```
**Used for:**
- SVG manipulation
- Data binding
- Force simulations (icon cloud)
- Transitions/animations

### GSAP + ScrollTrigger
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```
**Used for:**
- Scroll-based triggers
- Step-based animations
- CSS class toggling
- Smooth transitions

## Visualization Patterns

### 1. Icon Cloud (Force-Directed Layout)
```javascript
const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(5))
  .force('center', d3.forceCenter(width/2, height/2))
  .force('collision', d3.forceCollide().radius(d => d.radius + 5));
```

### 2. Grid Layout (Soft Skills, Books)
```javascript
books.forEach((book, i) => {
  const x = 100 + Math.random() * (width - 300);
  const y = 50 + Math.random() * (height - 250);
  const rotation = -25 + Math.random() * 50;
  // ... render with rotation
});
```

### 3. Stats Display (The Numbers)
```javascript
svg.append('text')
  .attr('opacity', 0)
  .text('13')
  .transition()
  .delay(i * 300)
  .duration(800)
  .attr('opacity', 1);
```

## Performance Optimizations

1. **Lazy rendering** - Only render current step
2. **CSS transitions** - Hardware-accelerated
3. **SVG viewBox** - Responsive without JS
4. **Debounced scroll** - GSAP handles this
5. **Image preloading** - Browser does this automatically

## Deployment Options

### Static Hosting (Recommended)
- GitHub Pages
- Netlify
- Vercel
- Any CDN

### Build Command
```bash
# Generate latest JSON
python3 scripts/export_from_yaml.py

# Deploy web/ directory
# (No build step needed!)
```

## Project Structure (Full)

```
interactive-cv/
├── .git/
├── .gitignore
├── README.md
├── TECH_STACK.md           # This file
├── Makefile                # make validate, make export
├── requirements.txt        # Python deps
│
├── data/
│   ├── raw/
│   │   ├── cv.yaml                    # Master CV data
│   │   ├── skills_ontology.yaml       # Skills + logos
│   │   └── company_logos.yaml         # Companies + logos
│   └── processed/
│       └── (optional intermediate)
│
├── scripts/
│   └── export_from_yaml.py            # YAML → JSON pipeline
│
└── web/                               # Frontend (deploy this)
    ├── index.html
    ├── css/
    │   ├── reset.css
    │   ├── variables.css
    │   └── scrollytelling.css
    ├── js/
    │   ├── main.js
    │   ├── visualizations.js
    │   └── icon-cloud.js
    └── data/
        └── cv_data.json               # Generated output
```

## Tips for Your Project

### 1. Start Simple
- Begin with 3 steps (intro, middle, outro)
- Add one viz at a time
- Test scroll behavior early

### 2. Data First
- Design YAML schema before coding
- Keep data separate from presentation
- Use descriptive field names

### 3. Modular Vizualizations
- One function per viz type
- Clear switch/case in updateVisualization()
- Reusable components (like icon-cloud.js)

### 4. Test Across Devices
- Mobile scrolling behaves differently
- Test viewport sizes
- Check image loading

### 5. Version Control
- Commit YAML separately from generated JSON
- Use meaningful commit messages
- Tag releases (v1.0, v2.0)

## Common Pitfalls

1. **Don't mix concerns** - Keep viz logic separate from data loading
2. **Clear previous viz** - Always `.selectAll('*').remove()` before rendering
3. **Preserve aspect ratio** - Use `preserveAspectRatio="xMidYMid meet"` for images
4. **Test scroll direction** - Users scroll up AND down
5. **Handle missing data** - Check for null/undefined before rendering

## Resources

- **D3.js Gallery**: https://observablehq.com/@d3/gallery
- **GSAP ScrollTrigger Docs**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Tufte CSS**: https://edwardtufte.github.io/tufte-css/
- **NYT Scrollytelling Examples**: https://www.nytimes.com/interactive/

## License

This tech stack is MIT licensed. Use it for personal or commercial projects.

---

**Built with Claude Code** - https://claude.com/claude-code
