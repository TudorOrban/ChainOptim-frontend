import { GraphUIConfig } from "../config/GraphUIConfig";
import { GenericGraph } from "../types/dataTypes";
import { GenericGraphUI } from "../types/uiTypes";

export class GraphPreprocessor {
    
    public preprocessGraph = (genericGraph: GenericGraph): GenericGraphUI => {
        const startingNodeIds = this.findStartingNodes(genericGraph);
        const factoryGraphUI = this.assignPositionsToNodes(startingNodeIds, genericGraph);
        return factoryGraphUI;
    }

    /*
    * Function for finding the nodes that have no incoming edges.
    */
    findStartingNodes = (genericGraph: GenericGraph): number[] => {
        const allNodeIds = new Set<number>(Object.keys(genericGraph.nodes).map(Number));

        // Identify target nodes
        const targetNodeIds = new Set<number>();
        Object.values(genericGraph.adjList).forEach((edges) => {
            edges.forEach((edge) => {
                targetNodeIds.add(edge.outgoingStageId);
            });
        });

        // Find starting nodes
        const startingNodeIds = Array.from(allNodeIds).filter((nodeId) => !targetNodeIds.has(nodeId));

        return startingNodeIds;
    }

    /*
    * Function for transforming data types in UI types
    * and recursively assigning positions to nodes in the graph based on their edges.
    */
    assignPositionsToNodes(
        startingNodeIds: number[],
        genericGraph: GenericGraph
    ): GenericGraphUI {
        // Transform to UI types
        const nodesUI = Object.fromEntries(
            Object.entries(genericGraph.nodes).map(([nodeId, node]) => {
                return [
                    nodeId,
                    {
                        node: node,
                        coordinates: { x: 0, y: 0 },
                        visited: false,
                    },
                ];
            })
        );
        const adjListUI = Object.fromEntries(
            Object.entries(genericGraph.adjList).map(([nodeId, edges]) => {
                return [
                    nodeId,
                    edges.map((edge) => {
                        return {
                            edge: edge,
                        };
                    }),
                ];
            })
        );
    
        let genericGraphUI: GenericGraphUI = {
            nodes: nodesUI,
            adjList: adjListUI,
        };
    

        // Assign positions to nodes
        for (let i = 0; i < startingNodeIds.length; i++) {
            let depth = 0;
            genericGraphUI = this.assignPositionsRecursively(startingNodeIds[i], i, genericGraphUI, depth);
        }
    
        return genericGraphUI;
    }
    
    assignPositionsRecursively(
        startingNodeId: number,
        startingNodeIndex: number,
        genericGraphUI: GenericGraphUI,
        depth: number,
    ): GenericGraphUI {
        const { spaceBetweenStagesX, spaceBetweenStagesY, paddingX, paddingY } = GraphUIConfig.graph;

        genericGraphUI.nodes[startingNodeId].coordinates = { 
            x: paddingX + startingNodeIndex * spaceBetweenStagesX, 
            y: paddingY + depth * spaceBetweenStagesY 
        };
        genericGraphUI.nodes[startingNodeId].visited = true;
    
        let adjNodes = genericGraphUI.adjList[startingNodeId];
    
        for (let j = 0; j < adjNodes.length; j++) {
            const targetNodeId = adjNodes[j].edge.outgoingStageId;
            if (!genericGraphUI.nodes[targetNodeId].visited) {
                genericGraphUI = this.assignPositionsRecursively(
                    targetNodeId,
                    startingNodeIndex,
                    genericGraphUI,
                    depth + 1 // Just go down for now. In the future, find a middle point with siblings.
                );
            }
        }
    
        return genericGraphUI;
    }    
}