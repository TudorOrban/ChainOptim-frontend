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
import { NodeSelection, NodeType } from '../../../../../production/models/FactoryGraph';
import { ProductEdge } from '../../../../models/ProductGraph';
import { ProductProductionTabType, ProductTab } from '../../../../../production/models/Production';
import { ProductProductionTabsService } from '../../../../services/productproductiontabs.service';
import { ProductGraphComponent } from './product-graph/product-graph.component';
import { AddStageComponent } from './add-stage/add-stage.component';
import { UpdateStageComponent } from './update-stage/update-stage.component';

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
        
        setTimeout(() => {
            this.loadProductGraphComponent();
        });
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
    loadAddStageComponent(): void {
        const tab: ProductTab<any> = {
            id: 'add-product-stage',
            title: 'Add Stage',
            component: AddStageComponent,
            inputData: { productId: this.productId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }

    loadUpdateStageComponent(productId: number): void {
        const tab: ProductTab<any> = {
            id: 'update-product-stage',
            title: 'Update Stage',
            component: UpdateStageComponent,
            inputData: { productId: productId, stageId: this.selectedProductStageId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }

    loadProductGraphComponent(): void {
        const tab: ProductTab<any> = {
            id: 'product-graph',
            title: 'Product Graph',
            component: ProductGraphComponent,
            inputData: { productId: this.productId },
        };
        console.log("ProductProductionTabsComponent: ngOnInit");
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }
    
    setActiveTab(id: string): void {
        this.tabsService.setActiveTab(id);
    }
    
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

    private handleSpecificComponent(): void {
        if (!this.activeComponentRef) {
            return;
        }
    
        const instance = this.activeComponentRef.instance;
    
        // Subscribe to specific components
        if (instance instanceof AddStageComponent) {
            instance.onStageAdded.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Add Stage');
            });
        }
        if (instance instanceof UpdateStageComponent) {
            instance.onStageUpdated.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Update Stage');
            });
        }
        if (instance instanceof ProductGraphComponent) {
            instance.onNodeClicked.subscribe((nodeSelection) => {
                if (nodeSelection.nodeType === NodeType.STAGE) {
                    this.selectedProductStageId = nodeSelection.nodeId;                    
                }
                this.onNodeClicked.emit(nodeSelection);
            });
            instance.onEdgeClicked.subscribe(edge => {
                this.selectedEdge = edge;
                this.onEdgeClicked.emit(edge);
            });
        }
    }

    // - CRUD ops
    toggleAddConnectionMode(): void {
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }

        if (this.activeComponentRef.instance instanceof ProductGraphComponent) {
            this.activeComponentRef.instance.toggleAddConnectionMode();
        }
    }

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
