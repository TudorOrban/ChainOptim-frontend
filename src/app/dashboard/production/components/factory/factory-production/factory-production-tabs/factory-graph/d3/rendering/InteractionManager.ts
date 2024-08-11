import * as d3 from 'd3';
import { NodeRenderer } from './NodeRenderer';
import { EventEmitter } from '@angular/core';
import { EdgeRenderer } from './EdgeRenderer';

export class InteractionManager {
    constructor(
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
        private nodeRenderer: NodeRenderer,
        private edgeRenderer: EdgeRenderer,
        private nodeClickEmitter: EventEmitter<string>,
        private edgeClickEmitter: EventEmitter<string>
    ) {}

    setupNodeInteractions() {
        this.svg
            .selectAll<SVGRectElement, unknown>('rect')
            .on('click', (event) => {
                const clickedNode = d3.select<SVGRectElement, unknown>(
                    event.currentTarget as SVGRectElement
                );
                const clickedNodeId = clickedNode.attr('id');

                if (clickedNode.node()) {
                    console.log('Clicked node:', clickedNodeId);
                    this.nodeRenderer.unhighlightAllNodes();
                    this.nodeRenderer.highlightNode(clickedNode);
                    this.nodeClickEmitter.emit(clickedNodeId);
                }
            });
        
        this.svg
            .selectAll('line')
            .on('click', (event) => {
                const clickedEdge = d3.select<SVGLineElement, unknown>(
                    event.currentTarget as SVGLineElement
                );
                const clickedEdgeId = clickedEdge.attr('id');
                
                if (clickedEdge.node()) {
                    console.log('Clicked edge:', clickedEdgeId);
                    this.edgeRenderer.unhighlightAllEdges();
                    this.edgeRenderer.highlightEdge(clickedEdge);
                    this.edgeClickEmitter.emit(clickedEdgeId);
                }
            });
    }
}
