import { FactoryEdge, NodeSelection, NodeType } from "../../../../../../../models/FactoryGraph";

export class ElementIdentifier {

    // Nodes
    encodeStageNodeId(stageNodeId: number | string) {
        return `s_${stageNodeId}`;
    }

    encodeStageInputId(stageId: number | string, inputId: number | string) {
        return `s_${stageId}_si_${inputId}`;
    }
    
    encodeStageOutputId(stageId: number | string, outputId: number | string) {
        return `s_${stageId}_so_${outputId}`;
    }

    // Edges
    encodeInnerEdgeId(nodeId1: number | string, nodeId2: number | string) {
        return `ie_${nodeId1}_${nodeId2}`;
    }

    encodeOuterEdgeId(srcNodeId: number | string, srcSubNodeId: number | string, destNodeId: number | string, destSubNodeId: number | string) {
        return `oe_${srcNodeId}_${srcSubNodeId}_c_${destNodeId}_${destSubNodeId}`;
    }

    // Info texts
    encodeInputQuantityTextId(nodeId: number | string, inputId: number | string) {
        return `quantity-text-i-${nodeId}-${inputId}`;
    }

    encodeOutputQuantityTextId(nodeId: number | string, inputId: number | string) {
        return `quantity-text-o-${nodeId}-${inputId}`;
    }

    encodeCapacityTextId(nodeId: number | string) {
        return `capacity-text-${nodeId}`;
    }

    encodePriorityTextId(nodeId: number | string) {
        return `priority-text-${nodeId}`;
    }


    // Deencoding
    getEdgeFromOuterEdgeId(outerEdgeId: string): FactoryEdge {
        const [_, srcNodeId, srcSubNodeId, conn, destNodeId, destSubNodeId] = outerEdgeId.split("_");
        return { srcFactoryStageId: Number(srcNodeId), srcStageOutputId: Number(srcSubNodeId), destFactoryStageId: Number(destNodeId), destStageInputId: Number(destSubNodeId) };
    }

    getStageNodeId(stageNodeId: string): NodeSelection {
        const splitNodeId = stageNodeId.split("_");
        if (splitNodeId.length != 2) {
            console.error("Error: Node id is not valid: ", stageNodeId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), nodeType: NodeType.STAGE };
    }

    getStageInputId(encodedStageInputId: string): NodeSelection {
        const splitNodeId = encodedStageInputId.split("_");
        if (splitNodeId.length != 4) {
            console.error("Error: Node id is not valid: ", encodedStageInputId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), subNodeId: Number(splitNodeId[3]), nodeType: NodeType.INPUT };
    }

    getStageOutputId(encodedStageOutputId: string): NodeSelection {
        const splitNodeId = encodedStageOutputId.split("_");
        if (splitNodeId.length != 4) {
            console.error("Error: Node id is not valid: ", encodedStageOutputId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), subNodeId: Number(splitNodeId[3]), nodeType: NodeType.OUTPUT };
    }
}