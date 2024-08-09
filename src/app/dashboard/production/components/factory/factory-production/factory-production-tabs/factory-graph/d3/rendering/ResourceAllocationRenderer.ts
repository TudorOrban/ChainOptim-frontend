import { AllocationPlan } from "../types/dataTypes";
import { FactoryGraphUI, GenericGraphUI } from "../types/uiTypes";
import { ElementIdentifier } from "../utils/ElementIdentifier";
import { GraphUIConfig } from "../config/GraphUIConfig";

export class ResourceAllocationRenderer {
    private genericGraphUI: GenericGraphUI;
    private allocationPlan: AllocationPlan;

    private elementIdentifier: ElementIdentifier;

    constructor(private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) {
        this.elementIdentifier = new ElementIdentifier();
        this.genericGraphUI = { nodes: {}, adjList: [] };
        this.allocationPlan = { factoryGraph: { nodes: {}, adjList: [] }, inventoryBalance: {}, allocations: [] };
    }


    public renderResourceAllocations(jsonData: string) {
        const allocationPlan: AllocationPlan = JSON.parse(jsonData);
        this.allocationPlan = allocationPlan;

        Object.entries(this.allocationPlan.factoryGraph.nodes).forEach(([stageNodeId, node]) => {
            let hasDeficits = false;
            let isAboveRequiredCapacity = true;

            let stageInputs = node.smallStage.stageInputs;
            stageInputs.forEach((stageInput, index) => {
                // Find input and inner edge elements
                const inputId = this.elementIdentifier.encodeStageInputId(stageNodeId, stageInput.id);
                const inputElement = this.svg.select(`#${inputId}`);
                const innerEdgeId = this.elementIdentifier.encodeInnerEdgeId(inputId, stageNodeId);
                const innerEdgeElement = this.svg.select(`#${innerEdgeId}`);

                // Determine color based on allocation
                const hasInputDeficits = stageInput.allocatedQuantity < stageInput.requestedQuantity;
                const ratio = stageInput.requestedQuantity != 0 ? (stageInput.allocatedQuantity / stageInput.requestedQuantity) : 0;
                const isInputAboveRequiredCapacity = ratio > (node.minimumRequiredCapacity ?? 1);

                // Apply styling based on deficits
                this.applyStatusHighlighting(inputElement, hasInputDeficits, isInputAboveRequiredCapacity);
                this.applyStatusHighlighting(innerEdgeElement, hasInputDeficits, isInputAboveRequiredCapacity);

                // Update info texts
                const quantityTextId = this.elementIdentifier.encodeInputQuantityTextId(stageNodeId, stageInput.id);
                const quantityTextElement = this.svg.select(`#${quantityTextId}`);
                if (!quantityTextElement.empty()) {
                    // Display percentage of requested amount that was allocated
                    const ratio = stageInput.requestedQuantity != 0 ? (stageInput.allocatedQuantity / stageInput.requestedQuantity) : 0;
                    const percentage = ratio * 100;
                    const isInteger = percentage % 1 === 0;
                    const updatedText = `Q: ${isInteger ? Number(percentage.toFixed(0)) : percentage.toFixed(2)}%`;
                    quantityTextElement.text(updatedText);
                }

                // Record if any deficits were found and if all inputs are above required capacity
                hasDeficits = hasDeficits || hasInputDeficits;
                isAboveRequiredCapacity = isAboveRequiredCapacity && isInputAboveRequiredCapacity;
            });

            node.smallStage.stageOutputs.forEach((stageOutput) => {
                // Find output and inner edge elements
                const outputId = this.elementIdentifier.encodeStageOutputId(stageNodeId, stageOutput.id);
                const outputElement = this.svg.select(`#${outputId}`);
                const innerEdgeId = this.elementIdentifier.encodeInnerEdgeId(stageNodeId, outputId);
                const innerEdgeElement = this.svg.select(`#${innerEdgeId}`);

                // Apply styling based on whether hasDeficits
                this.applyStatusHighlighting(outputElement, hasDeficits, isAboveRequiredCapacity);
                this.applyStatusHighlighting(innerEdgeElement, hasDeficits, isAboveRequiredCapacity);

                // Update info texts
                const quantityTextId = this.elementIdentifier.encodeOutputQuantityTextId(stageNodeId, stageOutput.id);
                const quantityTextElement = this.svg.select(`#${quantityTextId}`);
                if (!quantityTextElement.empty()) {
                    // Display percentage of requested amount that was allocated
                    const ratio = stageOutput.outputPerRequest != 0 ? (stageOutput.expectedOutputPerAllocation / stageOutput.outputPerRequest) : 0;
                    const percentage = ratio * 100;
                    const isInteger = percentage % 1 === 0;
                    const updatedText = `Q: ${isInteger ? Number(percentage.toFixed(0)) : percentage.toFixed(2)}%`;
                    quantityTextElement.text(updatedText);
                }
            });
            
            // Apply styling to the stage node itself
            const encodedStageNodeId = this.elementIdentifier.encodeStageNodeId(stageNodeId)
            const stageNodeElement = this.svg.select(`#${encodedStageNodeId}`);
            this.applyStatusHighlighting(stageNodeElement, hasDeficits, isAboveRequiredCapacity);

            // Update capacity info text
            const capacityTextId = this.elementIdentifier.encodeCapacityTextId(stageNodeId);
            const capacityTextElement = this.svg.select(`#${capacityTextId}`);
            if (!capacityTextElement.empty()) {
                const percentage = node.allocationCapacityRatio * 100;
                const isInteger = percentage % 1 === 0;
                const updatedText = `C: ${isInteger ? Number(percentage.toFixed(0)) : percentage.toFixed(2)}%`;
                capacityTextElement.text(updatedText);
            }
        });

    }

    private applyStatusHighlighting = (element: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, hasDeficits: boolean, isAboveRequiredCapacity: boolean) => {
        const { surplusColor, aboveRequiredCapacityColor, deficitColor, highlightWidth } = GraphUIConfig.resourceAllocation;
        
        const strokeColor = hasDeficits ? (isAboveRequiredCapacity ? aboveRequiredCapacityColor : deficitColor) : surplusColor;
        element.style("stroke", strokeColor).style("stroke-width", highlightWidth);
    };
    

    public setGenericGraph(genericGraphUI: GenericGraphUI) {
        this.genericGraphUI = genericGraphUI;
    }
}