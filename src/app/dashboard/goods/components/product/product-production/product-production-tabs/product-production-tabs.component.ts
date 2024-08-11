import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Input,
    ComponentRef,
    Output,
    EventEmitter,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NodeSelection } from '../../../../../production/models/FactoryGraph';
import { ProductEdge } from '../../../../models/ProductGraph';
import { FactoryProductionTabsService } from '../../../../../production/services/factoryproductiontabs.service';
import { ProductProductionTabType, ProductTab } from '../../../../../production/models/Production';
import { ProductProductionTabsService } from '../../../../services/productproductiontabs.service';

@Component({
    selector: 'app-product-production-tabs',
    templateUrl: './product-production-tabs.component.html',
    styleUrls: ['./product-production-tabs.component.css'],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule
    ],
    standalone: true,
})
export class ProductProductionTabsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() productId: number | undefined = undefined;

    @Output() onNodeClicked = new EventEmitter<NodeSelection>();
    @Output() onEdgeClicked = new EventEmitter<ProductEdge>();

    @ViewChild('dynamicTabContent', { read: ViewContainerRef })
    dynamicTabContent!: ViewContainerRef;
    private activeComponentRef: ComponentRef<ProductProductionTabType> | null = null;

    @ViewChild('tabsScrollContainer')
    tabsScrollContainer!: ElementRef;

    private tabSubscription!: Subscription;

    selectedProductStageId: number | undefined = undefined;
    selectedEdge: ProductEdge | undefined = undefined;

    constructor(
        public tabsService: ProductProductionTabsService
    ) {
    }

    ngOnInit(): void {
        this.tabSubscription = this.tabsService.getActiveTabId().subscribe(activeTabId => {
            const tab = this.tabsService.getTabs().find(t => t.id === activeTabId);
            if (tab) {
                this.loadComponent(tab);
            }
        });
    }

    ngAfterViewInit(): void {
        this.setUpListeners();
        
        // setTimeout(() => {
        //     this.loadFactoryGraphComponent();
        // });
    }

    private setUpListeners() {
        this.setUpScrollListener();
    }

    private setUpScrollListener() {
        const scrollContainer = this.tabsScrollContainer.nativeElement;

        scrollContainer.addEventListener('wheel', (event: WheelEvent) => {
            if (event.deltaY) {
                event.preventDefault();  // Prevent vertical scroll
                scrollContainer.scrollLeft += event.deltaY + event.deltaX;
            }
        });
    }

    // Communication with parent component
    // - Loading Components
    // loadAddStageComponent(): void {
    //     const tab: ProductTab<any> = {
    //         id: 'add-product-stage',
    //         title: 'Add Stage',
    //         component: AddFactorStageComponent,
    //         inputData: { factoryId: this.factoryId },
    //     };
    //     this.tabsService.openTab(tab);
    //     this.tabsService.setActiveTab(tab.id);
    //     this.loadComponent(tab);
    //     this.handleSpecificComponent();
    // }

    // loadUpdateStageComponent(factoryId: number): void {
    //     const tab: Tab<any> = {
    //         id: 'update-factory-stage',
    //         title: 'Update Stage',
    //         component: UpdateFactoryStageComponent,
    //         inputData: { factoryId: factoryId, factoryStageId: this.selectedFactoryStageId },
    //     };
    //     this.tabsService.openTab(tab);
    //     this.tabsService.setActiveTab(tab.id);
    //     this.loadComponent(tab);
    //     this.handleSpecificComponent();
    // }

    // loadFactoryGraphComponent(): void {
    //     const tab: Tab<any> = {
    //         id: 'factory-graph',
    //         title: 'Factory Graph',
    //         component: FactoryGraphComponent,
    //         inputData: { factoryId: this.factoryId },
    //     };
    //     console.log("FactoryProductionTabsComponent: ngOnInit");
    //     this.tabsService.openTab(tab);
    //     this.tabsService.setActiveTab(tab.id);
    //     this.loadComponent(tab);
    //     this.handleSpecificComponent();
    // }

    // loadAllocationPlanComponent(allocationPlan: AllocationPlan, loadActivePlan: boolean, factoryId: number): void {
    //     const tab: Tab<any> = {
    //         id: 'allocation-plan',
    //         title: 'Allocation Plan',
    //         component: AllocationPlanComponent,
    //         inputData: { allocationPlan: allocationPlan, loadActivePlan: loadActivePlan, factoryId: factoryId },
    //     };
    //     this.tabsService.openTab(tab);
    //     this.tabsService.setActiveTab(tab.id);
    //     this.loadComponent(tab);
    // }

    // loadProductionHistoryComponent(): void {
    //     const tab: Tab<any> = {
    //         id: 'production-history',
    //         title: 'Production History',
    //         component: ProductionHistoryComponent,
    //         inputData: { factoryId: this.factoryId },
    //     };
    //     this.tabsService.openTab(tab);
    //     this.tabsService.setActiveTab(tab.id);
    //     this.loadComponent(tab);
    // }

    
    // setActiveTab(id: string): void {
    //     this.tabsService.setActiveTab(id);
    // }

    
    loadComponent(tab: ProductTab<any>): void {
        if (!this.dynamicTabContent) {
            console.log("No dynamic tab content found: ", tab);
            return;
        }

        this.dynamicTabContent.clear();
        console.log("FactoryProductionTabsComponent: loadComponent");
        const componentRef = this.dynamicTabContent.createComponent(tab.component);
        componentRef.instance.inputData = tab.inputData;
        this.activeComponentRef = componentRef;
    }

    // private handleSpecificComponent(): void {
    //     if (!this.activeComponentRef) {
    //         return;
    //     }
    
    //     const instance = this.activeComponentRef.instance;
    
    //     // Subscribe to specific components
    //     if (instance instanceof AddFactoryStageComponent) {
    //         instance.onFactoryStageAdded.subscribe(() => {
    //             this.tabsService.closeAnyTabWithTitle('Add Stage');
    //         });
    //     }
    //     if (instance instanceof UpdateFactoryStageComponent) {
    //         instance.onFactoryStageUpdated.subscribe(() => {
    //             this.tabsService.closeAnyTabWithTitle('Update Stage');
    //         });
    //     }
    //     if (instance instanceof FactoryGraphComponent) {
    //         instance.onNodeClicked.subscribe((nodeSelection) => {
    //             if (nodeSelection.nodeType === NodeType.STAGE) {
    //                 this.selectedFactoryStageId = nodeSelection.nodeId;                    
    //             }
    //             this.onNodeClicked.emit(nodeSelection);
    //         });
    //         instance.onEdgeClicked.subscribe(edge => {
    //             this.selectedEdge = edge;
    //             this.onEdgeClicked.emit(edge);
    //         });
    //     }
    // }

    // - CRUD ops
    // toggleAddConnectionMode(): void {
    //     if (!this.activeComponentRef) {
    //         console.log("No active component reference found.");
    //         return;
    //     }

    //     if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
    //         this.activeComponentRef.instance.toggleAddConnectionMode();
    //     }
    // }

    // - Displaying Info
    // displayQuantities(display: boolean): void {
    //     if (!this.activeComponentRef) {
    //         console.log("No active component reference found.");
    //         return;
    //     }

    //     // Check if the active component is of type FactoryGraphComponent
    //     if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
    //         this.activeComponentRef.instance.displayQuantities(display);
    //     }
    // }
    
    // displayCapacities(display: boolean): void {
    //     if (!this.activeComponentRef) {
    //         console.log("No active component reference found.");
    //         return;
    //     }
        
    //     // Check if the active component is of type FactoryGraphComponent
    //     if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
    //         this.activeComponentRef.instance.displayCapacities(display);
    //     }
    // }

    // displayPriorities(display: boolean): void {
    //     if (!this.activeComponentRef) {
    //         console.log("No active component reference found.");
    //         return;
    //     }
        
    //     // Check if the active component is of type FactoryGraphComponent
    //     if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
    //         this.activeComponentRef.instance.displayPriorities(display);
    //     }
    // }

    ngOnDestroy(): void {
        this.dynamicTabContent.clear();
        this.tabSubscription.unsubscribe();
    }

    faTimes = faTimes;
}
