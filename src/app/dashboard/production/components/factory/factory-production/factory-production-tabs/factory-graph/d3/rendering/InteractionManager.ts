import * as d3 from 'd3';
import { NodeRenderer } from './NodeRenderer';

export class InteractionManager {
    constructor(
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
        private nodeRenderer: NodeRenderer
    ) {}

    setupNodeInteractions(handleNodeClick: (nodeId: string) => void) {
        this.svg
            .selectAll<SVGRectElement, unknown>('rect')
            .on('click', (event, d) => {
                const clickedNode = d3.select<SVGRectElement, unknown>(
                    event.currentTarget as SVGRectElement
                );
                const clickedNodeId = clickedNode.attr('id');

                // Assuming highlightNode expects a Selection of SVGRectElement
                if (clickedNode.node()) {
                    // Ensure the node exists
                    this.nodeRenderer.unhighlightAllNodes();
                    this.nodeRenderer.highlightNode(clickedNode);
                    handleNodeClick(clickedNodeId);
                }
            });
    }
}
