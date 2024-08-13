declare global {
    interface Window {
        // Production Graphs
        renderProductGraph: (jsonData: string) => void;
        renderFactoryGraph: (jsonData: string) => void;
        renderInfo: (infoType: string, isVisible: boolean) => void;
        renderResourceAllocations: (jsonData: string) => void;
        javaConnector: {
            handleNodeClick: (nodeId: string) => void;
            log: (message: string) => void;
        }

        // Maps
        renderMap: (jsonData: string) => void;
    }
}

export {};