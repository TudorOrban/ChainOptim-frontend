import { FactoryEdge, FactoryGraph } from "../../../../../../../models/FactoryGraph";
import { GraphUIConfig } from "../config/GraphUIConfig";
import { GenericEdge, GenericGraph } from "../types/dataTypes";
import { ProductGraph } from "../../../../../../../../goods/models/ProductGraph";
import { ProductEdge } from "../../../../../../../../goods/models/ProductGraph";
import { Coordinates } from "../types/uiTypes";

export const findStageInputPosition = (centerX: number, centerY: number, numberOfInputs: number, index: number): Coordinates => {
    const { stageWidth, stageHeight } = GraphUIConfig.node;
    const stageInputRelativeX =
            numberOfInputs > 0 ? (index - numberOfInputs / 2) * (stageWidth / numberOfInputs) : 0;
    const stageInputX = centerX + stageInputRelativeX;
    const stageInputY = centerY - stageHeight / 2;

    return { x: stageInputX, y: stageInputY };
}

export const findStageOutputPosition = (centerX: number, centerY: number, numberOfOutputs: number, index: number): Coordinates => {
    const { stageWidth, stageHeight } = GraphUIConfig.node;
    const stageOutputRelativeX =
            numberOfOutputs > 0 ? (index - numberOfOutputs / 2) * (stageWidth / numberOfOutputs) : 0;
    const stageOutputX = centerX + stageOutputRelativeX;
    const stageOutputY = centerY + stageHeight / 2;

    return { x: stageOutputX, y: stageOutputY };
}

// Random utils
export const truncateString = (str: string | undefined, maxLength: number): string => {
    if (!str) return "";
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}


// Adjust Factory Edge keys to unify rendering logic
export const transformFactoryToGenericGraph = (productionGraph: FactoryGraph): GenericGraph => {
    return {
        nodes: productionGraph.nodes,
        adjList: adjustBackendFactoryEdgeKeys(productionGraph.adjList),
        type: "factory",
    };
} 

export const transformProductToGenericGraph = (productionGraph: ProductGraph): GenericGraph => {
    return {
        // Wrap smallStage in GenericNode
        nodes: Object.fromEntries(
            Object.entries(productionGraph.nodes).map(([nodeId, smallStage]) => {
                return [
                    nodeId,
                    {
                        smallStage: smallStage,
                    },
                ];
            })
        ),
        adjList: adjustBackendProductEdgeKeys(productionGraph.adjList),
        type: "product",
    }
}

export const adjustBackendFactoryEdgeKeys = (adjList: Record<number, FactoryEdge[]>): Record<number, GenericEdge[]> => {
    return Object.fromEntries(
        Object.entries(adjList).map(([nodeId, edges]) => {
            return [
                nodeId,
                edges.map((edge) => {
                    const genericEdge: GenericEdge = {
                        srcStageId: edge.srcFactoryStageId,
                        srcStageOutputId: edge.srcStageOutputId,
                        destStageId: edge.destFactoryStageId,
                        destStageInputId: edge.destStageInputId,
                    };
                    return genericEdge;
                }),
            ];
        })
    );
}

export const adjustBackendProductEdgeKeys = (adjList: Record<number, ProductEdge[]>): Record<number, GenericEdge[]> => {
    return Object.fromEntries(
        Object.entries(adjList).map(([nodeId, edges]) => {
            return [
                nodeId,
                edges.map((edge) => {
                    const genericEdge: GenericEdge = {
                        srcStageId: edge.srcStageId,
                        srcStageOutputId: edge.srcStageOutputId,
                        destStageId: edge.destStageId,
                        destStageInputId: edge.destStageInputId,
                    };
                    return genericEdge;
                }),
            ];
        })
    );
}