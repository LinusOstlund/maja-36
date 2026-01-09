/**
 * Icon Cloud Component - Reusable force-directed layout
 *
 * Creates a physics-based "cloud" of emoji icons using D3 force simulation.
 * Used for the "Ideas" slide with ~100 floating emojis.
 */

export class IconCloud {
    constructor(container, icons, options = {}) {
        this.container = container;
        this.icons = icons;
        this.options = {
            width: options.width || window.innerWidth,
            height: options.height || window.innerHeight,
            iconSize: options.iconSize || 40,
            iconCount: options.iconCount || 100,
            ...options
        };
    }

    render() {
        // Create SVG
        const svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.options.width)
            .attr('height', this.options.height);

        // Prepare data (repeat icons to reach target count)
        const nodes = this.prepareNodes();

        // Force simulation
        this.simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
            .force('collision', d3.forceCollide().radius(this.options.iconSize / 2 + 5))
            .alphaDecay(0.02);

        // Render icons as text elements
        const iconElements = svg.selectAll('.icon')
            .data(nodes)
            .enter()
            .append('text')
            .attr('class', 'icon')
            .attr('font-size', d => d.size)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.emoji)
            .attr('opacity', 0)
            .transition()
            .delay((d, i) => i * 10)
            .duration(800)
            .attr('opacity', d => d.opacity);

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            iconElements
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // Add subtle drift animation
        this.driftInterval = setInterval(() => {
            nodes.forEach(node => {
                node.vx += (Math.random() - 0.5) * 0.5;
                node.vy += (Math.random() - 0.5) * 0.5;
            });
        }, 2000);
    }

    stop() {
        if (this.simulation) {
            this.simulation.stop();
        }
        if (this.driftInterval) {
            clearInterval(this.driftInterval);
        }
    }

    prepareNodes() {
        const nodes = [];
        const targetCount = this.options.iconCount;

        // Repeat icons until we reach target count
        while (nodes.length < targetCount) {
            this.icons.forEach(emoji => {
                if (nodes.length < targetCount) {
                    nodes.push({
                        emoji,
                        size: this.options.iconSize + (Math.random() - 0.5) * 20,
                        opacity: 0.5 + Math.random() * 0.5,
                        x: Math.random() * this.options.width,
                        y: Math.random() * this.options.height
                    });
                }
            });
        }

        return nodes;
    }
}
