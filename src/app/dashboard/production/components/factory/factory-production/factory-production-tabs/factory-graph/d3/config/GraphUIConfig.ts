export const GraphUIConfig = {
    graph: {
        width: 960,
        height: 640,
        spaceBetweenStagesX: 250,
        spaceBetweenStagesY: 250,
        paddingX: 100,
        paddingY: 120,
        backgroundColor: "#eeeeee",
    },
    node: {
        stageWidth: 120,
        stageHeight: 160,
        stageBoxWidth: 90,
        stageBoxHeight: 60,
        subnodeRadius: 14,
        backgroundColor: "#ffffff",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
        fontColor: "black",
        mainNodeFontSize: 14,
        subnodeFontSize: 10,
        subedgeColor: "black",
        subedgeWidth: 1,
        highlightDuration: 200,
        highlightColor: "#d9e2ef",
        highlightWidth: 2,
    },
    edge: {
        color: "#111111",
        width: 1.5,
        markerEnd: "url(#arrowhead)",
    },
    info: {
        infoFontSize: 14,
        infoColor: "black",
        infoPaddingX: 15,
        capacityPaddingY: -10,
        priorityPaddingY: 10
    },
    resourceAllocation: {
        surplusColor: "#4CAF50", 
        aboveRequiredCapacityColor: "#FFEB3B", 
        deficitColor: "#F44336", 
        highlightWidth: 1.3,
    },    
    shadow: {
        id: "drop-shadow",
        dx: 1,
        dy: 2,
        stdDeviation: 3,
    }
}