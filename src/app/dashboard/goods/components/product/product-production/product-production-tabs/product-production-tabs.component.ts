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
import { AddStageInputComponent } from './add-stage-input/add-stage-input.component';
import { UpdateStageInputComponent } from './update-stage-input/update-stage-input.component';
import { AddStageOutputComponent } from './add-stage-output/add-stage-output.component';
import { UpdateStageOutputComponent } from './update-stage-output/update-stage-output.component';

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
    selectedStageInputId: number | undefined = undefined;
    selectedStageOutputId: number | undefined = undefined;
    selectedStageInputStageId: number | undefined = undefined;
    selectedStageOutputStageId: number | undefined = undefined;
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
    // -- Stages
    loadAddStageComponent(): void {
        const tab: ProductTab<any> = {
            id: 'add-product-stage',
            title: 'Add Stage',
            component: AddStageComponent,
            inputData: { productId: this.productId },
        };
        this.loadTab(tab);
    }

    loadUpdateStageComponent(productId: number): void {
        const tab: ProductTab<any> = {
            id: 'update-product-stage',
            title: 'Update Stage',
            component: UpdateStageComponent,
            inputData: { productId: productId, stageId: this.selectedProductStageId },
        };
        this.loadTab(tab);
    }

    // -- Stage Inputs
    loadAddStageInputComponent(): void {
        const tab: ProductTab<any> = {
            id: 'add-stage-input',
            title: 'Add Stage Input',
            component: AddStageInputComponent,
            inputData: { productId: this.productId, initialStageId: this.selectedProductStageId },
        };
        this.loadTab(tab);
    }

    loadUpdateStageInputComponent(productId: number): void {
        const tab: ProductTab<any> = {
            id: 'update-stage-input',
            title: 'Update Stage Input',
            component: UpdateStageInputComponent,
            inputData: { productId: productId, initialStageId: this.selectedStageInputStageId, initialStageInputId: this.selectedStageInputId },
        };
        this.loadTab(tab);
    }

    // -- Stage Outputs
    loadAddStageOutputComponent(): void {
        const tab: ProductTab<any> = {
            id: 'add-stage-output',
            title: 'Add Stage Output',
            component: AddStageOutputComponent,
            inputData: { productId: this.productId, initialStageId: this.selectedProductStageId },
        };
        this.loadTab(tab);
    }

    loadUpdateStageOutputComponent(productId: number): void {
        const tab: ProductTab<any> = {
            id: 'update-stage-output',
            title: 'Update Stage Output',
            component: UpdateStageOutputComponent,
            inputData: { productId: productId, initialStageId: this.selectedStageOutputStageId, initialStageOutputId: this.selectedStageOutputId },
        };
        this.loadTab(tab);
    }

    // -- Graph
    loadProductGraphComponent(): void {
        const tab: ProductTab<any> = {
            id: 'product-graph',
            title: 'Product Graph',
            component: ProductGraphComponent,
            inputData: { productId: this.productId },
        };
        this.loadTab(tab);
    }

    loadTab(tab: ProductTab<any>): void {
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }
    
    loadComponent(tab: ProductTab<any>): void {
        if (!this.dynamicTabContent) {
            console.log("No dynamic tab content found: ", tab);
            return;
        }

        this.dynamicTabContent.detach();
        let componentRef = this.tabsService.getComponentRef(tab.id);

        if (!componentRef) {
            componentRef = this.dynamicTabContent.createComponent(tab.component);
            componentRef.instance.inputData = tab.inputData;
            this.tabsService.saveComponentRef(tab.id, componentRef);
        } else {
            this.dynamicTabContent.insert(componentRef.hostView);
        }

        this.activeComponentRef = componentRef;
    }

    setActiveTab(id: string): void {
        this.tabsService.setActiveTab(id);
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
        if (instance instanceof AddStageInputComponent) {
            instance.onStageInputAdded.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Add Stage Input');
            });
        }
        if (instance instanceof UpdateStageInputComponent) {
            instance.onStageInputUpdated.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Update Stage Input');
            });
        }
        if (instance instanceof AddStageOutputComponent) {
            instance.onStageOutputAdded.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Add Stage Output');
            });
        }
        if (instance instanceof UpdateStageOutputComponent) {
            instance.onStageOutputUpdated.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Update Stage Output');
            });
        }
        if (instance instanceof ProductGraphComponent) {
            this.handleGraphClicks(instance);
        }
    }

    handleGraphClicks(instance: ProductGraphComponent) {
        instance.onNodeClicked.subscribe((nodeSelection) => {
            if (nodeSelection.nodeType === NodeType.STAGE) {
                this.selectedProductStageId = nodeSelection.nodeId;                    
            }
            if (nodeSelection.nodeType === NodeType.INPUT) {
                this.selectedStageInputId = nodeSelection.subNodeId;
                this.selectedStageInputStageId = nodeSelection.nodeId;
            }
            if (nodeSelection.nodeType === NodeType.OUTPUT) {
                this.selectedStageOutputId = nodeSelection.subNodeId;
                this.selectedStageOutputStageId = nodeSelection.nodeId;
            }
            this.onNodeClicked.emit(nodeSelection);
        });
        instance.onEdgeClicked.subscribe(edge => {
            this.selectedEdge = edge;
            this.onEdgeClicked.emit(edge);
        });
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
    displayQuantities(display: boolean): void {
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }

        // Check if the active component is of type FactoryGraphComponent
        if (this.activeComponentRef.instance instanceof ProductGraphComponent) {
            this.activeComponentRef.instance.displayQuantities(display);
        }
    }

    ngOnDestroy(): void {
        this.dynamicTabContent.clear();
        this.tabSubscription.unsubscribe();
    }

    faTimes = faTimes;
}
