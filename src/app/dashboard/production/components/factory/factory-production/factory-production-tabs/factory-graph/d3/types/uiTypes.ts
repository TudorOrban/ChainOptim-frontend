import { FactoryEdge, FactoryStageNode } from "../../../../../../../models/FactoryGraph";
import { GenericNode, GenericEdge } from "./dataTypes";

export interface GenericGraphUI {
    nodes: Record<number, GenericNodeUI>;
    adjList: Record<number, GenericEdgeUI[]>;
}

export interface GenericNodeUI {
    node: GenericNode;
    coordinates: Coordinates;
    visited?: boolean;
}

export interface GenericEdgeUI {
    edge: GenericEdge;

}

export interface FactoryGraphUI {
    nodes: Record<number, FactoryStageNodeUI>;
    adjList: Record<number, FactoryEdgeUI[]>;
    pipelinePriority: number;
}

export interface FactoryStageNodeUI {
    node: FactoryStageNode;
    coordinates?: Coordinates; // Center of the node's stage box
    visited?: boolean;
}

export interface FactoryEdgeUI {
    edge: FactoryEdge;

}





// Utils
export interface Coordinates {
    x: number;
    y: number;
}
