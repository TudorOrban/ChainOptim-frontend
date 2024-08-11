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

    encodeOuterEdgeId(nodeId1: number | string, nodeId2: number | string, stageOutputId1: number | string, stageInputId2: number | string) {
        return `oe_${nodeId1}_${stageOutputId1}_c_${nodeId2}_${stageInputId2}`;
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
        const [_, nodeId1, stageOutputId1, conn, nodeId2, stageInputId2] = outerEdgeId.split("_");
        return { incomingFactoryStageId: Number(nodeId1), incomingStageOutputId: Number(stageOutputId1), outgoingFactoryStageId: Number(nodeId2), outgoingStageInputId: Number(stageInputId2) };
    }

    getStageNodeId(stageNodeId: string): NodeSelection {
        const splitNodeId = stageNodeId.split("_");
        if (splitNodeId.length != 2) {
            console.error("Error: Node id is not valid: ", stageNodeId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), nodeType: NodeType.STAGE };
    }

    getStageInputId(stageInputId: string): NodeSelection {
        const splitNodeId = stageInputId.split("_");
        if (splitNodeId.length != 4) {
            console.error("Error: Node id is not valid: ", stageInputId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), subNodeId: Number(splitNodeId[3]), nodeType: NodeType.INPUT };
    }

    getStageOutputId(stageOutputId: string): NodeSelection {
        const splitNodeId = stageOutputId.split("_");
        if (splitNodeId.length != 4) {
            console.error("Error: Node id is not valid: ", stageOutputId);
            throw new Error("Node id is not valid.");
        }
        return { nodeId: Number(splitNodeId[1]), subNodeId: Number(splitNodeId[3]), nodeType: NodeType.OUTPUT };
    }
}