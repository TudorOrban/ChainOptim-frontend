import { GraphUIConfig } from "../config/GraphUIConfig";
import { GenericGraph } from "../types/dataTypes";
import { GenericGraphUI } from "../types/uiTypes";

export class GraphPreprocessor {
    
    public preprocessGraph = (genericGraph: GenericGraph): GenericGraphUI => {
        const layerMap = this.assignLayers(genericGraph);
        const factoryGraphUI = this.assignLayeredPositions(layerMap, genericGraph);
        return factoryGraphUI;
    }

    // Identify starting nodes (nodes with no incoming edges)
    findStartingNodes = (genericGraph: GenericGraph): string[] => {
        const allNodeIds = new Set<string>(Object.keys(genericGraph.nodes));

        // Identify target nodes that have incoming edges
        const targetNodeIds = new Set<string>();
        Object.values(genericGraph.adjList).forEach(edges => {
            edges.forEach(edge => {
                targetNodeIds.add(edge.destStageId.toString());
            });
        });

        // Find starting nodes by determining which nodes are not in targetNodeIds
        return Array.from(allNodeIds).filter(nodeId => !targetNodeIds.has(nodeId));
    }

    // Assign layers to nodes based on their distance from starting nodes
    assignLayers = (genericGraph: GenericGraph): Map<string, number> => {
        const startingNodeIds = this.findStartingNodes(genericGraph);
        const layerMap = new Map<string, number>();
        const queue: { nodeId: string, layer: number }[] = [];

        // Initialize layer for starting nodes
        startingNodeIds.forEach(nodeId => {
            queue.push({ nodeId: nodeId, layer: 0 });
            layerMap.set(nodeId, 0);
        });

        // BFS to assign layers to each node
        while (queue.length > 0) {
            const { nodeId, layer } = queue.shift()!;
            const adjNodes = genericGraph.adjList[Number(nodeId)] || [];
            adjNodes.forEach(edge => {
                const targetNodeId = edge.destStageId.toString();
                if (!layerMap.has(targetNodeId)) {
                    queue.push({ nodeId: targetNodeId, layer: layer + 1 });
                    layerMap.set(targetNodeId, layer + 1);
                }
            });
        }

        return layerMap;
    }

    // Assign positions to nodes based on the layers
    assignLayeredPositions = (layerMap: Map<string, number>, genericGraph: GenericGraph): GenericGraphUI => {
        const { spaceBetweenStagesX, spaceBetweenStagesY, paddingX, paddingY } = GraphUIConfig.graph;
        
        let graphUI: GenericGraphUI = { nodes: {}, adjList: {} };
        let layerWidths = new Map<number, number>(); // Track the width of each layer

        // Assign coordinates to nodes based on their layers
        Object.keys(genericGraph.nodes).forEach(nodeId => {
            const layer = layerMap.get(nodeId)!;
            const xPosition = (layerWidths.get(layer) || 0) * spaceBetweenStagesX + paddingX;
            const nodeIdInt = parseInt(nodeId);
            graphUI.nodes[nodeIdInt] = {
                node: genericGraph.nodes[nodeIdInt],
                coordinates: { x: xPosition, y: layer * spaceBetweenStagesY + paddingY },
                visited: false
            };
            graphUI.adjList[nodeIdInt] = genericGraph.adjList[nodeIdInt]?.map(edge => ({ edge }));
            layerWidths.set(layer, (layerWidths.get(layer) || 0) + 1);
        });

        return graphUI;
    }
    
//     public preprocessGraph = (genericGraph: GenericGraph): GenericGraphUI => {
//         const startingNodeIds = this.findStartingNodes(genericGraph);
//         const factoryGraphUI = this.assignPositionsToNodes(startingNodeIds, genericGraph);
//         return factoryGraphUI;
//     }

//     /*
//     * Function for finding the nodes that have no incoming edges.
//     */
//     findStartingNodes = (genericGraph: GenericGraph): number[] => {
//         const allNodeIds = new Set<number>(Object.keys(genericGraph.nodes).map(Number));

//         // Identify target nodes
//         const targetNodeIds = new Set<number>();
//         Object.values(genericGraph.adjList).forEach((edges) => {
//             edges.forEach((edge) => {
//                 targetNodeIds.add(edge.srcStageId);
//             });
//         });

//         // Find starting nodes
//         const startingNodeIds = Array.from(allNodeIds).filter((nodeId) => !targetNodeIds.has(nodeId));
//         console.log("Starting nodes: ", startingNodeIds);
//         return startingNodeIds;
//     }

//     /*
//     * Function for transforming data types in UI types
//     * and recursively assigning positions to nodes in the graph based on their edges.
//     */
//     assignPositionsToNodes(
//         startingNodeIds: number[],
//         genericGraph: GenericGraph
//     ): GenericGraphUI {
//         // Transform to UI types
//         const nodesUI = Object.fromEntries(
//             Object.entries(genericGraph.nodes).map(([nodeId, node]) => {
//                 return [
//                     nodeId,
//                     {
//                         node: node,
//                         coordinates: { x: 0, y: 0 },
//                         visited: false,
//                     },
//                 ];
//             })
//         );
//         const adjListUI = Object.fromEntries(
//             Object.entries(genericGraph.adjList).map(([nodeId, edges]) => {
//                 return [
//                     nodeId,
//                     edges.map((edge) => {
//                         return {
//                             edge: edge,
//                         };
//                     }),
//                 ];
//             })
//         );
    
//         let genericGraphUI: GenericGraphUI = {
//             nodes: nodesUI,
//             adjList: adjListUI,
//         };
    

//         // Assign positions to nodes
//         for (let i = 0; i < startingNodeIds.length; i++) {
//             let depth = 0;
//             genericGraphUI = this.assignPositionsRecursively(startingNodeIds[i], i, genericGraphUI, depth);
//         }
    
//         return genericGraphUI;
//     }
    
//     assignPositionsRecursively(
//         startingNodeId: number,
//         startingNodeIndex: number,
//         genericGraphUI: GenericGraphUI,
//         depth: number,
//     ): GenericGraphUI {
//         const { spaceBetweenStagesX, spaceBetweenStagesY, paddingX, paddingY } = GraphUIConfig.graph;

//         if (!genericGraphUI.nodes[startingNodeId]) {
//             console.error("Error: Node is not defined in the graph.");
//             return genericGraphUI;
//         }
//         if (genericGraphUI.nodes[startingNodeId].visited) return genericGraphUI;
//         genericGraphUI.nodes[startingNodeId].coordinates = { 
//             x: paddingX + startingNodeIndex * spaceBetweenStagesX, 
//             y: paddingY + depth * spaceBetweenStagesY 
//         };
//         genericGraphUI.nodes[startingNodeId].visited = true;
    
//         let adjNodes = genericGraphUI.adjList[startingNodeId];
    
//         for (let j = 0; j < adjNodes.length; j++) {
//             const targetNodeId = adjNodes[j].edge.srcStageId;
//             if (!genericGraphUI.nodes[targetNodeId]?.visited ?? false) {
//                 genericGraphUI = this.assignPositionsRecursively(
//                     targetNodeId,
//                     startingNodeIndex,
//                     genericGraphUI,
//                     depth + 1 // Just go down for now. In the future, find a middle point with siblings.
//                 );
//             }
//         }
    
//         return genericGraphUI;
//     }    
}