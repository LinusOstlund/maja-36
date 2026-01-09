/**
 * Visualization Manager - Switch/case for all 6 visualizations
 *
 * Manages D3.js visualizations for each scroll step:
 * - Step 0: Hero (emoji floaters + confetti)
 * - Step 1: Wishlist (animated checklist)
 * - Step 2: Icon Cloud (force simulation)
 * - Step 3: Transition (loading spinner)
 * - Step 4: Budget KPIs (counter animation)
 * - Step 5: Line Chart (historical + projection)
 */

import { IconCloud } from './icon-cloud.js';

export class VisualizationManager {
    constructor(data) {
        this.data = data;
        this.currentStep = -1;
        this.iconCloud = null;
        this.isUpdating = false;
        this.activeAnimations = []; // Track active timeouts/intervals
    }

    clearActiveAnimations() {
        // Cancel all active timeouts and intervals
        this.activeAnimations.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
        });
        this.activeAnimations = [];
    }

    updateVisualization(step) {
        if (step === this.currentStep) {
            return;
        }

        if (this.isUpdating) {
            return;
        }

        this.isUpdating = true;
        console.log(`🎨 Rendering step ${step}`);

        // Cancel any active animations (timeouts, intervals) from previous step
        this.clearActiveAnimations();

        // Stop icon cloud if exists
        if (this.iconCloud) {
            this.iconCloud.stop();
        }

        this.currentStep = step;

        // Cancel all active D3 transitions globally (safe way)
        d3.selectAll('.viz-step').selectAll('*').each(function() {
            try {
                d3.select(this).interrupt();
            } catch (e) {
                // Ignore errors from elements without transitions
            }
        });

        // Get container for this step
        const container = d3.select(`#viz-step-${step}`);

        // Clear container
        container.selectAll('*').remove();

        // Get slide data
        const slide = this.data.slides.find(s => s.step === step);
        if (!slide) {
            this.isUpdating = false;
            return;
        }

        // Render new viz based on type
        switch (step) {
            case 0:
                this.createHeroViz(container, slide);
                break;
            case 1:
                this.createWishlistViz(container, slide);
                break;
            case 2:
                this.createIconCloudViz(container, slide);
                break;
            case 3:
                this.createTransitionViz(container, slide);
                break;
            case 4:
                this.createBudgetKPIsViz(container, slide);
                break;
            case 5:
                this.createProjectionChartViz(container, slide);
                break;
        }

        // Release update lock after rendering completes
        setTimeout(() => {
            this.isUpdating = false;
        }, 500);
    }

    createHeroViz(container, slide) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create floating birthday emojis
        const emojis = ['🎉', '🎂', '🎁', '✨', '🎈', '🎊', '💝', '🌟'];
        const emojiData = Array(20).fill(null).map((_, i) => ({
            emoji: emojis[i % emojis.length],
            x: Math.random() * width,
            y: Math.random() * height,
            size: 30 + Math.random() * 40,
            delay: Math.random() * 2000
        }));

        svg.selectAll('.floating-emoji')
            .data(emojiData)
            .enter()
            .append('text')
            .attr('class', 'floating-emoji')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('font-size', d => d.size)
            .attr('text-anchor', 'middle')
            .attr('opacity', 0)
            .text(d => d.emoji)
            .transition('emoji-fade')
            .delay(d => d.delay)
            .duration(1000)
            .attr('opacity', 0.6)
            .transition('emoji-float')
            .duration(3000)
            .attr('y', d => d.y + (Math.random() - 0.5) * 100)
            .attr('x', d => d.x + (Math.random() - 0.5) * 50);
    }

    createWishlistViz(container, slide) {
        // Simple background pattern for wishlist
        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Subtle checkmark pattern
        const checkmarks = Array(15).fill(null).map((_, i) => ({
            x: 100 + (i % 5) * 200,
            y: 100 + Math.floor(i / 5) * 250,
            delay: i * 100
        }));

        svg.selectAll('.checkmark')
            .data(checkmarks)
            .enter()
            .append('text')
            .attr('class', 'checkmark')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('font-size', 60)
            .attr('fill', '#E8B4B8')
            .attr('opacity', 0)
            .text('✓')
            .transition()
            .delay(d => d.delay)
            .duration(800)
            .attr('opacity', 0.15);
    }

    createIconCloudViz(container, slide) {
        // Use icon-cloud.js force simulation component
        this.iconCloud = new IconCloud(
            container.node(),
            slide.content.icons,
            {
                width: window.innerWidth,
                height: window.innerHeight,
                iconSize: 40
            }
        );
        this.iconCloud.render();
    }

    createTransitionViz(container, slide) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Simple animated dots
        const dots = [0, 1, 2].map(i => ({
            x: width / 2 - 40 + i * 40,
            y: height / 2,
            delay: i * 300
        }));

        svg.selectAll('.loading-dot')
            .data(dots)
            .enter()
            .append('circle')
            .attr('class', 'loading-dot')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 8)
            .attr('fill', '#D4A574')
            .attr('opacity', 0.3)
            .transition('dot-pulse-1')
            .duration(600)
            .delay((d, i) => i * 200)
            .attr('opacity', 1)
            .transition('dot-pulse-2')
            .duration(600)
            .attr('opacity', 0.3)
            .transition('dot-pulse-3')
            .duration(600)
            .delay((d, i) => i * 200)
            .attr('opacity', 1)
            .transition('dot-pulse-4')
            .duration(600)
            .attr('opacity', 0.3);
    }

    createBudgetKPIsViz(container, slide) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const { kpis } = slide.content;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Position KPI cards
        const cardWidth = 350;
        const spacing = 50;
        const totalWidth = cardWidth * 2 + spacing;
        const startX = (width - totalWidth) / 2;

        kpis.forEach((kpi, i) => {
            const x = startX + i * (cardWidth + spacing);
            const y = height / 2;

            // Card background
            svg.append('rect')
                .attr('x', x)
                .attr('y', y - 100)
                .attr('width', cardWidth)
                .attr('height', 200)
                .attr('rx', 10)
                .attr('fill', 'white')
                .attr('stroke', kpi.color)
                .attr('stroke-width', 3)
                .attr('opacity', 0)
                .transition()
                .delay(500 + i * 300)
                .duration(600)
                .attr('opacity', 1);

            // Label
            svg.append('text')
                .attr('x', x + cardWidth / 2)
                .attr('y', y - 60)
                .attr('text-anchor', 'middle')
                .attr('font-size', 18)
                .attr('font-family', 'Crimson Text, serif')
                .attr('fill', '#6B7280')
                .text(kpi.label)
                .attr('opacity', 0)
                .transition()
                .delay(600 + i * 300)
                .duration(600)
                .attr('opacity', 1);

            // Animated value
            const valueText = svg.append('text')
                .attr('x', x + cardWidth / 2)
                .attr('y', y + 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', kpi.emphasis ? 56 : 48)
                .attr('font-family', 'IBM Plex Mono, monospace')
                .attr('font-weight', kpi.emphasis ? '600' : '400')
                .attr('fill', kpi.color)
                .text((kpi.prefix || '') + '0 ' + kpi.unit);

            // Number tween animation with unique transition name
            valueText
                .transition(`kpi-${i}`)
                .delay(700 + i * 300)
                .duration(2000)
                .tween('text', function() {
                    const interpolator = d3.interpolateNumber(0, kpi.value);
                    const prefix = kpi.prefix || '';
                    const unit = kpi.unit;
                    return function(t) {
                        const val = Math.round(interpolator(t));
                        this.textContent = prefix + val.toLocaleString('sv-SE') + ' ' + unit;
                    };
                });
        });
    }

    createProjectionChartViz(container, slide) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const margin = { top: 100, right: 100, bottom: 100, left: 100 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const { historical, projection } = slide.content.chart;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const allData = [...historical, ...projection.slice(1)]; // Exclude duplicate 2025
        const xScale = d3.scaleLinear()
            .domain([2016, 2035])
            .range([0, chartWidth]);

        // Limit Y-axis to 100,000 kr so early years are visible
        const yScale = d3.scaleLinear()
            .domain([0, 100000])
            .range([chartHeight, 0]);

        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(yScale)
                .tickSize(-chartWidth)
                .tickFormat(''));

        // Axes
        const xAxis = g.append('g')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

        xAxis.selectAll('text')
            .attr('font-size', 14)
            .attr('font-family', 'IBM Plex Mono, monospace');

        const yAxis = g.append('g')
            .call(d3.axisLeft(yScale)
                .tickFormat(d => d.toLocaleString('sv-SE') + ' kr'));

        yAxis.selectAll('text')
            .attr('font-size', 14)
            .attr('font-family', 'IBM Plex Mono, monospace');

        // Line generator
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.value));

        // Historical line (black solid)
        const historicalPath = g.append('path')
            .datum(historical)
            .attr('fill', 'none')
            .attr('stroke', '#1a1a1a')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Animate historical line
        const historicalLength = historicalPath.node().getTotalLength();
        historicalPath
            .attr('stroke-dasharray', historicalLength)
            .attr('stroke-dashoffset', historicalLength)
            .transition('historical-line')
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        // Projection line (red dashed) - appears after historical
        setTimeout(() => {
            const projectionPath = g.append('path')
                .datum(projection)
                .attr('fill', 'none')
                .attr('stroke', '#C84B4B')
                .attr('stroke-width', 3)
                .attr('stroke-dasharray', '10,5')
                .attr('d', line);

            const projectionLength = projectionPath.node().getTotalLength();
            projectionPath
                .attr('stroke-dasharray', `10,5,${projectionLength}`)
                .attr('stroke-dashoffset', projectionLength)
                .transition('projection-line')
                .duration(2000)
                .attr('stroke-dashoffset', 0);
        }, 2000);

        // Data points (historical only)
        g.selectAll('.data-point')
            .data(historical)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.value))
            .attr('r', 5)
            .attr('fill', '#1a1a1a')
            .attr('opacity', 0)
            .transition()
            .delay((d, i) => i * 200)
            .duration(600)
            .attr('opacity', 1);

        // Projection data points (with clamping for values > 100k)
        setTimeout(() => {
            g.selectAll('.projection-point')
                .data(projection)
                .enter()
                .append('circle')
                .attr('class', 'projection-point')
                .attr('cx', d => xScale(d.year))
                .attr('cy', d => yScale(Math.min(d.value, 100000)))
                .attr('r', 5)
                .attr('fill', '#C84B4B')
                .attr('opacity', 0)
                .transition()
                .delay((d, i) => i * 200)
                .duration(600)
                .attr('opacity', 1);

            // Add annotation for off-chart values
            const finalPoint = projection[projection.length - 1];
            g.append('text')
                .attr('x', xScale(finalPoint.year))
                .attr('y', yScale(100000) - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', 14)
                .attr('font-family', 'IBM Plex Mono, monospace')
                .attr('fill', '#C84B4B')
                .attr('font-weight', '600')
                .text(`${(finalPoint.value / 1000).toFixed(0)}k kr ↑`)
                .attr('opacity', 0)
                .transition()
                .delay(1000)
                .duration(800)
                .attr('opacity', 1);
        }, 2200);

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', 24)
            .attr('font-family', 'Crimson Text, serif')
            .attr('font-weight', '600')
            .attr('fill', '#8B4513')
            .text(slide.content.chart.title)
            .attr('opacity', 0)
            .transition()
            .duration(800)
            .attr('opacity', 1);
    }
}
