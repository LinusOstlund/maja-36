/**
 * Main Entry Point - Maja's Birthday Scrollytelling
 *
 * Coordinates:
 * - Data loading from JSON
 * - Narrative content population
 * - ScrollTrigger setup for step changes
 * - Visualization updates via VisualizationManager
 */

import { VisualizationManager } from './visualizations.js';

class BirthdayScrollytelling {
    constructor() {
        this.data = null;
        this.vizManager = null;
        this.currentStep = -1;
    }

    async init() {
        try {
            console.log('🎉 Initializing birthday scrollytelling...');

            // 1. Load JSON data
            this.data = await this.loadData();
            console.log(`📊 Loaded ${this.data.slides.length} slides`);

            // 2. Populate narrative content
            this.populateNarrative();
            console.log('✍️  Narrative content populated');

            // 3. Initialize visualization manager
            this.vizManager = new VisualizationManager(this.data);
            console.log('🎨 Visualization manager initialized');

            // 4. Setup ScrollTrigger
            this.setupScrollTriggers();
            console.log('📜 ScrollTrigger configured');

            // 5. Render first step
            this.onStepEnter(0);
            console.log('✅ Ready!');

        } catch (error) {
            console.error('❌ Error initializing:', error);
            this.showError(error);
        }
    }

    async loadData() {
        const response = await fetch('data/birthday_data.json');
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }
        return response.json();
    }

    populateNarrative() {
        this.data.slides.forEach(slide => {
            const step = slide.step;
            const narrativeStep = document.querySelector(`.narrative-step[data-step="${step}"]`);
            if (!narrativeStep) return;

            const content = narrativeStep.querySelector('.narrative-content');
            if (!content) return;

            switch (slide.type) {
                case 'hero':
                    this.populateHero(content, slide);
                    break;
                case 'list':
                    this.populateWishlist(content, slide);
                    break;
                case 'icon-cloud':
                    this.populateIconCloud(content, slide);
                    break;
                case 'text':
                    this.populateText(content, slide);
                    break;
                case 'kpi-cards':
                    this.populateKPIs(content, slide);
                    break;
                case 'line-chart':
                    this.populateChart(content, slide);
                    break;
            }
        });
    }

    populateHero(content, slide) {
        const { title, subtitle, emojis } = slide.content;
        content.innerHTML = `
            <h1>${title}<br>${subtitle}</h1>
            <div class="emojis">${emojis}</div>
        `;
    }

    populateWishlist(content, slide) {
        const { intro, items } = slide.content;

        const itemsHTML = items.map(item => {
            const textClass = item.strikethrough ? 'wishlist-item-text strikethrough' : 'wishlist-item-text';
            const noteHTML = item.note ? `<span class="wishlist-item-note">${item.note}</span>` : '';
            return `
                <li class="wishlist-item">
                    <span class="${textClass}">${item.text}</span>
                    ${noteHTML}
                </li>
            `;
        }).join('');

        content.innerHTML = `
            <p class="wishlist-intro">${intro}</p>
            <ul class="wishlist-items">
                ${itemsHTML}
            </ul>
        `;
    }

    populateIconCloud(content, slide) {
        content.innerHTML = `
            <p>${slide.content.text}</p>
        `;
    }

    populateText(content, slide) {
        content.innerHTML = `
            <p>${slide.content.text}</p>
        `;
    }

    populateKPIs(content, slide) {
        const { intro, highlight } = slide.content;
        content.innerHTML = `
            <p>${intro} <em>${highlight}</em></p>
        `;
    }

    populateChart(content, slide) {
        content.innerHTML = `
            <p>${slide.content.intro}</p>
        `;
    }

    setupScrollTriggers() {
        gsap.registerPlugin(ScrollTrigger);

        // Create ScrollTrigger for each narrative step
        document.querySelectorAll('.narrative-step').forEach((step, index) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => this.onStepEnter(index),
                onEnterBack: () => this.onStepEnter(index),
                once: false,  // Allow re-triggering when scrolling back
                // markers: true,  // Uncomment for debugging
            });
        });

        console.log(`✅ Created ${document.querySelectorAll('.narrative-step').length} ScrollTriggers`);
    }

    onStepEnter(stepIndex) {
        if (this.currentStep === stepIndex) return;

        // Debounce: prevent rapid-fire calls
        if (this.stepChangeTimeout) {
            clearTimeout(this.stepChangeTimeout);
        }

        this.stepChangeTimeout = setTimeout(() => {
            console.log(`🔄 Step ${stepIndex} entered`);
            this.currentStep = stepIndex;

            // Update active viz panel
            document.querySelectorAll('.viz-step').forEach(viz => {
                viz.classList.remove('active');
            });
            const activeViz = document.querySelector(`[data-viz-step="${stepIndex}"]`);
            if (activeViz) {
                activeViz.classList.add('active');
            }

            // Trigger visualization update
            this.vizManager.updateVisualization(stepIndex);
        }, 100);
    }

    showError(error) {
        document.body.innerHTML = `
            <div class="loading">
                <p>❌ Error loading birthday present: ${error.message}</p>
            </div>
        `;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const app = new BirthdayScrollytelling();
    app.init();
});
