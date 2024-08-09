import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewContainerRef,
    Type,
    ElementRef,
} from '@angular/core';
import { TabsService } from '../../../../services/productiontabs.service';
import { Tab } from '../../../../models/Production';
import { AddFactoryStageComponent } from './add-factory-stage/add-factory-stage.component';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { UpdateFactoryStageComponent } from './update-factory-stage/update-factory-stage.component';
import { FactoryGraphComponent } from './factory-graph/factory-graph.component';
import { AllocationPlanComponent } from './allocation-plan/allocation-plan.component';
import { Subscription } from 'rxjs';

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
    @ViewChild('dynamicTabContent', { read: ViewContainerRef })
    dynamicTabContent!: ViewContainerRef;

    @ViewChild('tabsScrollContainer')
    tabsScrollContainer!: ElementRef;

    private tabSubscription!: Subscription;

    constructor(public tabsService: TabsService) {}

    ngOnInit(): void {
        this.tabSubscription = this.tabsService.getActiveTabId().subscribe(activeTabId => {
            const tab = this.tabsService.getTabs().find(t => t.id === activeTabId);
            if (tab) {
                this.loadComponent(tab);
            }
        });
    }

    ngAfterViewInit(): void {
        const scrollContainer = this.tabsScrollContainer.nativeElement;

        scrollContainer.addEventListener('wheel', (event: WheelEvent) => {
            if (event.deltaY) {
                event.preventDefault();  // Prevent vertical scroll
                scrollContainer.scrollLeft += event.deltaY + event.deltaX;
            }
        });
    }
   
    loadComponent(tab: Tab<any>): void {
        this.dynamicTabContent.clear();
        const componentRef = this.dynamicTabContent.createComponent(tab.component);
        componentRef.instance.inputData = tab.inputData;
    }

    ngOnDestroy(): void {
        this.dynamicTabContent.clear();
        this.tabSubscription.unsubscribe();
    }

    loadAddStageComponent(): void {
        const tab: Tab<any> = {
            id: 'add-factory-stage',
            title: 'Add Stage',
            component: AddFactoryStageComponent,
            inputData: {},
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    loadUpdateStageComponent(): void {
        const tab: Tab<any> = {
            id: 'update-factory-stage',
            title: 'Update Stage',
            component: UpdateFactoryStageComponent,
            inputData: {},
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    loadFactoryGraphComponent(): void {
        const tab: Tab<any> = {
            id: 'factory-graph',
            title: 'Factory Graph',
            component: FactoryGraphComponent,
            inputData: {},
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    loadAllocationPlanComponent(): void {
        const tab: Tab<any> = {
            id: 'allocation-plan',
            title: 'Allocation Plan',
            component: AllocationPlanComponent,
            inputData: {},
        };
        this.tabsService.openTab(tab);
        this.tabsService.setActiveTab(tab.id);
        this.loadComponent(tab);
    }

    setActiveTab(id: string): void {
        this.tabsService.setActiveTab(id);
    }

    faTimes = faTimes;
}
