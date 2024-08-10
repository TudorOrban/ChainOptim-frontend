import * as d3 from 'd3';
import { NodeRenderer } from './NodeRenderer';
import { EventEmitter } from '@angular/core';

export class InteractionManager {
    constructor(
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
        private nodeRenderer: NodeRenderer,
        private nodeClickEmitter: EventEmitter<string> // EventEmitter to notify the parent component
    ) {}

    setupNodeInteractions() {
        this.svg
            .selectAll<SVGRectElement, unknown>('rect')
            .on('click', (event) => {
                const clickedNode = d3.select<SVGRectElement, unknown>(
                    event.currentTarget as SVGRectElement
                );
                const clickedNodeId = clickedNode.attr('id');

                // Assuming highlightNode expects a Selection of SVGRectElement
                if (clickedNode.node()) {
                    console.log('Clicked node:', clickedNodeId);
                    // Ensure the node exists
                    this.nodeRenderer.unhighlightAllNodes();
                    this.nodeRenderer.highlightNode(clickedNode);
                    this.nodeClickEmitter.emit(clickedNodeId); // Emit the clicked node ID to the parent component
                }
            });
    }
}
