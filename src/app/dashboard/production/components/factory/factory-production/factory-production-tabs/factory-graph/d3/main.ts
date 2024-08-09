import { FactoryProductionGraph, GenericGraph, ProductProductionGraph } from "./types/dataTypes";
import { GraphRenderer } from "./rendering/GraphRenderer";
import { transformFactoryToGenericGraph, transformProductToGenericGraph } from "./utils/utils";
import { SupplyChainMap } from "./maps/types/dataTypes";
import { MapRenderer } from "./maps/rendering/MapRenderer";
export {};

// Production Graphs
let factoryGraphRenderer: GraphRenderer | null = null;
let productGraphRenderer: GraphRenderer | null = null;

function renderFactoryGraph(jsonData: string) {
    const data: FactoryProductionGraph = JSON.parse(jsonData);

    if (factoryGraphRenderer !== null) {
        factoryGraphRenderer.clearGraph();
    } else {
        factoryGraphRenderer = new GraphRenderer("#viz");
    }

    // Use GenericGraph type to unify rendering logic
    const genericGraph: GenericGraph = transformFactoryToGenericGraph(data.factoryGraph);
    
    factoryGraphRenderer.renderGraph(genericGraph);
}

function renderProductGraph(jsonData: string) {
    const data: ProductProductionGraph = JSON.parse(jsonData);

    if (productGraphRenderer !== null) {
        productGraphRenderer.clearGraph();
    } else {
        productGraphRenderer = new GraphRenderer("#viz");
    }

    // Use GenericGraph type to unify rendering logic
    const genericGraph: GenericGraph = transformProductToGenericGraph(data.productGraph);
    
    productGraphRenderer.renderGraph(genericGraph);
}

// Maps
let mapRenderer: MapRenderer | null = null;
function renderMap(jsonData: string) {
    const data: SupplyChainMap = JSON.parse(jsonData);

    mapRenderer = mapRenderer ?? new MapRenderer();
    mapRenderer.renderMap(data.mapData);
}


// Bind functions to window for JavaFX access
window.renderProductGraph = renderProductGraph;
window.renderFactoryGraph = renderFactoryGraph;
window.renderMap = renderMap;