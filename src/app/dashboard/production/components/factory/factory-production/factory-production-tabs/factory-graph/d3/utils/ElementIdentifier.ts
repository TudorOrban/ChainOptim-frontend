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


}