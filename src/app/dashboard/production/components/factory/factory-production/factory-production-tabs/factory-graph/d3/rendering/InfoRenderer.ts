import { GraphUIConfig } from "../config/GraphUIConfig";
import { FactoryGraphUI, GenericGraphUI } from "../types/uiTypes";
import { ElementIdentifier } from "../utils/ElementIdentifier";
import { findStageInputPosition, findStageOutputPosition } from "../utils/utils";

export class InfoRenderer {
    private genericGraph: GenericGraphUI;
    private elementIdentifier: ElementIdentifier;

    constructor(private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) {
        this.elementIdentifier = new ElementIdentifier();
        this.genericGraph = { nodes: {}, adjList: [] };
    }


    public renderInfo(infoType: string, isVisible: boolean) {
        switch (infoType) {
            case "capacities":
                this.renderCapacities(isVisible);
                break;
            case "priorities":
                this.renderPriorities(isVisible);
                break;
            case "quantities":
                this.renderQuantities(isVisible);
                break;
            default:
                break;
        }
    }
    
    renderCapacities(isVisible: boolean) {
        const { stageBoxWidth } = GraphUIConfig.node;
        const { infoFontSize, infoColor, infoPaddingX, capacityPaddingY } = GraphUIConfig.info;

        Object.entries(this.genericGraph.nodes).forEach(([nodeId, nodeUI]) => {
            const textId = this.elementIdentifier.encodeCapacityTextId(nodeId);
            const textX = nodeUI.coordinates.x + stageBoxWidth / 2 + infoPaddingX;
            const textY = nodeUI.coordinates.y + capacityPaddingY;
            
            // Attempt selecting or otherwise create the text element
            let textElement = this.svg.select<SVGTextElement>(`#${textId}`);
            if (textElement.empty()) {
                textElement = this.svg.append("text")
                    .attr("id", textId)
                    .attr("x", textX)
                    .attr("y", textY)
                    .style("font-size", infoFontSize)
                    .style("fill", infoColor);
            }
            
            // Set text and visibility
            textElement
                .text("C: " + nodeUI.node.numberOfStepsCapacity)
                .style("visibility", isVisible ? "visible" : "hidden");
        });
    }

    renderPriorities(isVisible: boolean) {
        const { stageBoxWidth } = GraphUIConfig.node;
        const { infoFontSize, infoColor, infoPaddingX, priorityPaddingY } = GraphUIConfig.info;

        Object.entries(this.genericGraph.nodes).forEach(([nodeId, nodeUI]) => {
            const textId = this.elementIdentifier.encodePriorityTextId(nodeId);
            const textX = nodeUI.coordinates.x + stageBoxWidth / 2 + infoPaddingX;
            const textY = nodeUI.coordinates.y + priorityPaddingY;
            
            // Attempt selecting or otherwise create the text element
            let textElement = this.svg.select<SVGTextElement>(`#${textId}`);
            if (textElement.empty()) {
                textElement = this.svg.append("text")
                    .attr("id", textId)
                    .attr("x", textX)
                    .attr("y", textY)
                    .style("font-size", infoFontSize)
                    .style("fill", infoColor);
            }
            
            // Set text and visibility
            textElement
                .text("P: " + nodeUI.node.priority)
                .style("visibility", isVisible ? "visible" : "hidden");
        });
    }

    renderQuantities(isVisible: boolean) {
        const { subnodeRadius } = GraphUIConfig.node;
        const { infoFontSize, infoColor, infoPaddingX, priorityPaddingY } = GraphUIConfig.info;

        Object.entries(this.genericGraph.nodes).forEach(([nodeId, nodeUI]) => {
            // Render stage input quantities
            const stageInputs = nodeUI.node.smallStage.stageInputs;
            stageInputs.forEach((input, index) => {
                const { x: stageInputX, y: stageInputY } = findStageInputPosition(nodeUI.coordinates.x, nodeUI.coordinates.y, stageInputs.length - 1, index);
                
                const textId = this.elementIdentifier.encodeInputQuantityTextId(nodeId, input.id);
                const textX = stageInputX + subnodeRadius + infoPaddingX;
                const textY = stageInputY;

                // Attempt selecting or otherwise create the text element
                let textElement = this.svg.select<SVGTextElement>(`#${textId}`);
                if (textElement.empty()) {
                    textElement = this.svg.append("text")
                        .attr("id", textId)
                        .attr("x", textX)
                        .attr("y", textY)
                        .style("font-size", infoFontSize)
                        .style("fill", infoColor);
                }
                
                // Set text and visibility
                textElement
                    .text("Q: " + input.quantityPerStage)
                    .style("visibility", isVisible ? "visible" : "hidden");
            });

            // Render stage output quantities
            const stageOutputs = nodeUI.node.smallStage.stageOutputs;
            stageOutputs.forEach((output, index) => {
                const { x: stageOutputX, y: stageOutputY } = findStageOutputPosition(nodeUI.coordinates.x, nodeUI.coordinates.y, stageOutputs.length - 1, index);
                
                const textId = this.elementIdentifier.encodeOutputQuantityTextId(nodeId, output.id);
                const textX = stageOutputX + subnodeRadius + infoPaddingX;
                const textY = stageOutputY;

                // Attempt selecting or otherwise create the text element
                let textElement = this.svg.select<SVGTextElement>(`#${textId}`);
                if (textElement.empty()) {
                    textElement = this.svg.append("text")
                        .attr("id", textId)
                        .attr("x", textX)
                        .attr("y", textY)
                        .style("font-size", infoFontSize)
                        .style("fill", infoColor);
                }
                
                // Set text and visibility
                textElement
                    .text("Q: " + output.quantityPerStage)
                    .style("visibility", isVisible ? "visible" : "hidden");
            });
        });   
    }

    public setGenericGraph(genericGraph: GenericGraphUI) {
        this.genericGraph = genericGraph;
    }
}