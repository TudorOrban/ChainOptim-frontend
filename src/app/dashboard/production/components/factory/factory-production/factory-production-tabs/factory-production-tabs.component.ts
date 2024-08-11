import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    Type,
    ElementRef,
    Input,
    ComponentRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { TabsService } from '../../../../services/productiontabs.service';
import { FactoryProductionTabType, Tab } from '../../../../models/Production';
import { AddFactoryStageComponent } from './add-factory-stage/add-factory-stage.component';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { UpdateFactoryStageComponent } from './update-factory-stage/update-factory-stage.component';
import { FactoryGraphComponent } from './factory-graph/factory-graph.component';
import { AllocationPlanComponent } from './allocation-plan/allocation-plan.component';
import { Subscription } from 'rxjs';
import { ProductionHistoryComponent } from './production-history/production-history.component';
import { AllocationPlan } from '../../../../models/ResourceAllocation';
import { FactoryEdge } from '../../../../models/FactoryGraph';
import { Pair } from '../../../../../overview/types/supplyChainMapTypes';

@Component({
    selector: 'app-factory-production-tabs',
    templateUrl: './factory-production-tabs.component.html',
    styleUrls: ['./factory-production-tabs.component.css'],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule
    ],
    standalone: true,
})
export class FactoryProductionTabsComponent implements OnInit, OnDestroy {
    @Input() factoryId: number | undefined = undefined;

    @Output() onNodeClicked = new EventEmitter<Pair<string, number>>();
    @Output() onEdgeClicked = new EventEmitter<FactoryEdge>();

    @ViewChild('dynamicTabContent', { read: ViewContainerRef })
    dynamicTabContent!: ViewContainerRef;
    private activeComponentRef: ComponentRef<FactoryProductionTabType> | null = null;

    @ViewChild('tabsScrollContainer')
    tabsScrollContainer!: ElementRef;

    private tabSubscription!: Subscription;

    selectedFactoryStageId: number | undefined = undefined;
    selectedEdge: FactoryEdge | undefined = undefined;

    constructor(public tabsService: TabsService) {}

    ngOnInit(): void {
        this.tabSubscription = this.tabsService.getActiveTabId().subscribe(activeTabId => {
            const tab = this.tabsService.getTabs().find(t => t.id === activeTabId);
            if (tab) {
                this.loadComponent(tab);
            }
        });

        // this.loadFactoryGraphComponent();
    }

    ngAfterViewInit(): void {
        this.setUpListeners();
        
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
        const tab: Tab<any> = {
            id: 'add-factory-stage',
            title: 'Add Stage',
            component: AddFactoryStageComponent,
            inputData: { factoryId: this.factoryId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }

    loadUpdateStageComponent(factoryId: number): void {
        const tab: Tab<any> = {
            id: 'update-factory-stage',
            title: 'Update Stage',
            component: UpdateFactoryStageComponent,
            inputData: { factoryId: factoryId, factoryStageId: this.selectedFactoryStageId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }

    loadFactoryGraphComponent(): void {
        const tab: Tab<any> = {
            id: 'factory-graph',
            title: 'Factory Graph',
            component: FactoryGraphComponent,
            inputData: { factoryId: this.factoryId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
        this.handleSpecificComponent();
    }

    loadAllocationPlanComponent(allocationPlan: AllocationPlan, loadActivePlan: boolean, factoryId: number): void {
        const tab: Tab<any> = {
            id: 'allocation-plan',
            title: 'Allocation Plan',
            component: AllocationPlanComponent,
            inputData: { allocationPlan: allocationPlan, loadActivePlan: loadActivePlan, factoryId: factoryId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    loadProductionHistoryComponent(): void {
        const tab: Tab<any> = {
            id: 'production-history',
            title: 'Production History',
            component: ProductionHistoryComponent,
            inputData: { factoryId: this.factoryId },
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    
    setActiveTab(id: string): void {
        this.tabsService.setActiveTab(id);
    }

    
    loadComponent(tab: Tab<any>): void {
        this.dynamicTabContent.clear();
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
        if (instance instanceof AddFactoryStageComponent) {
            instance.onFactoryStageAdded.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Add Stage');
            });
        }
        if (instance instanceof UpdateFactoryStageComponent) {
            instance.onFactoryStageUpdated.subscribe(() => {
                this.tabsService.closeAnyTabWithTitle('Update Stage');
            });
        }
        if (instance instanceof FactoryGraphComponent) {
            instance.onNodeClicked.subscribe(({ first, second }) => {
                this.selectedFactoryStageId = second;
                console.log("Node clicked in tabs: ", first, second);
                this.onNodeClicked.emit({ first: first, second: second });
            });
            instance.onEdgeClicked.subscribe(edge => {
                this.selectedEdge = edge;
                console.log("Edge clicked in tabs: ", edge);
                this.onEdgeClicked.emit(edge);
            });
        }
    }

    // - Displaying Info
    displayQuantities(display: boolean): void {
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }

        // Check if the active component is of type FactoryGraphComponent
        if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
            this.activeComponentRef.instance.displayQuantities(display);
        }
    }
    
    displayCapacities(display: boolean): void {
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }
        
        // Check if the active component is of type FactoryGraphComponent
        if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
            this.activeComponentRef.instance.displayCapacities(display);
        }
    }

    displayPriorities(display: boolean): void {
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }
        
        // Check if the active component is of type FactoryGraphComponent
        if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
            this.activeComponentRef.instance.displayPriorities(display);
        }
    }

    displayAllocations(allocationPlan: AllocationPlan): void {    
        if (!this.activeComponentRef) {
            console.log("No active component reference found.");
            return;
        }
        
        // Check if the active component is of type FactoryGraphComponent
        if (this.activeComponentRef.instance instanceof FactoryGraphComponent) {
            this.activeComponentRef.instance.displayAllocations(allocationPlan);
        }
    }

    openAllocationPlan(allocationPlan: AllocationPlan, loadActivePlan: boolean, factoryId: number): void {
        this.loadAllocationPlanComponent(allocationPlan, loadActivePlan, factoryId);
    }

    ngOnDestroy(): void {
        this.dynamicTabContent.clear();
        this.tabSubscription.unsubscribe();
    }

    faTimes = faTimes;
}
