# Maja's 36th Birthday Present

A lightweight, interactive scrollytelling birthday present built with Vanilla JS, D3.js, and GSAP ScrollTrigger.

## Overview

This project is a personal, data-driven scrollytelling experience celebrating Maja's 36th birthday. It features 6 interactive slides with custom D3.js visualizations, including:

- Hero intro with floating emojis
- Wishlist with animated items
- Icon cloud with 100+ emojis in force-directed layout
- Budget KPIs with animated counters
- Future projection chart showing the absurd (but sweet) trajectory

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Visualizations**: D3.js v7
- **Animations**: GSAP 3.12 + ScrollTrigger
- **Data Pipeline**: Python 3.12 + PyYAML
- **Architecture**: NYTimes-style scrollytelling overlay pattern

## Project Structure

```
majas-present/
├── data/
│   └── raw/
│       └── birthday_data.yaml          # Master content (Swedish)
├── scripts/
│   └── export_from_yaml.py             # YAML → JSON pipeline
└── web/                                 # Frontend (deploy this)
    ├── index.html
    ├── css/
    │   ├── reset.css
    │   ├── variables.css
    │   └── scrollytelling.css
    ├── js/
    │   ├── main.js                     # Entry point
    │   ├── visualizations.js           # D3 viz manager
    │   └── icon-cloud.js               # Force simulation
    └── data/
        └── birthday_data.json          # Generated from YAML
```

## Development

### Prerequisites

- Python 3.12+
- Modern web browser (Chrome, Firefox, Safari)

### Setup

1. **Install Python dependencies:**
   ```bash
   pip install pyyaml
   ```

2. **Generate JSON data:**
   ```bash
   python3 scripts/export_from_yaml.py
   ```

3. **Start development server:**
   ```bash
   cd web
   python3 -m http.server 8000
   ```

4. **Open in browser:**
   ```bash
   open http://localhost:8000
   ```

### Development Workflow

```bash
# Edit content
vim data/raw/birthday_data.yaml

# Regenerate JSON
python3 scripts/export_from_yaml.py

# Refresh browser to see changes
```

## Features

### Slide 0: Hero
- Floating birthday emojis with random drift animation
- Warm, welcoming introduction

### Slide 1: Wishlist
- Animated checklist from Maja's actual wishlist
- Includes the mysterious "Sumting juicy" (strikethrough)

### Slide 2: Ideas Cloud
- 100+ emoji icons in force-directed physics simulation
- Represents the creative chaos of gift ideas

### Slide 3: Transition
- Simple loading animation
- Sets up the data-driven narrative

### Slide 4: Budget KPIs
- Two animated counter cards
- Compares savings budget (18,000 kr) vs. present budget (>20,000 kr)

### Slide 5: Future Projection
- D3 line chart with dual lines
- Historical data (2016-2025) in black solid line
- Absurd projection (2025-2035) in red dashed line reaching 1.85M kr

## Design System

### Colors
- Background: `#FFF9F5` (warm off-white)
- Accent: `#D4A574` (warm gold)
- Love: `#E8B4B8` (soft pink)
- Projection: `#C84B4B` (red)

### Typography
- Serif: Crimson Text (warm, elegant)
- Mono: IBM Plex Mono (technical details)

## Deployment

The `web/` directory is a static site ready for deployment to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

No build step required!

## Credits

Built with Claude Code following the Tufte-inspired design principles from CLAUDE.md.

**Built with love for Maja** ❤️

## License

This is a personal birthday present. Feel free to use the code structure for your own projects!
