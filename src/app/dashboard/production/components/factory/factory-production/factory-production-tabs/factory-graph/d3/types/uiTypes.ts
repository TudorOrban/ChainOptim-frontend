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
    state?: EdgeState;
    type?: EdgeType;
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
    state?: EdgeState;
    type?: EdgeType;
}

export enum EdgeType {
    INPUT_STAGE = "INPUT_STAGE",
    STAGE_OUTPUT = "STAGE_OUTPUT",
    OUTPUT_INPUT = "OUTPUT_INPUT",
}

export enum EdgeState {
    NORMAL = "NORMAL",
    HIGHLIGHTED = "HIGHLIGHTED",
    SELECTED = "SELECTED",
    INVISIBLE = "INVISIBLE",
    INVISIBLE_HIGHLIGHTED = "INVISIBLE_HIGHLIGHTED",
    INVISIBLE_SELECTED = "INVISIBLE_SELECTED",
    TEMPORARY = "TEMPORARY",
}



// Utils
export interface Coordinates {
    x: number;
    y: number;
}
