import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { Factory } from '../../../models/Factory';
import { FactoryProductionTabsComponent } from './factory-production-tabs/factory-production-tabs.component';
import { FactoryProductionToolbarComponent } from './factory-production-toolbar/factory-production-toolbar.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-factory-production',
  standalone: true,
  imports: [FactoryProductionTabsComponent, FactoryProductionToolbarComponent],
  templateUrl: './factory-production.component.html',
  styleUrl: './factory-production.component.css'
})
export class FactoryProductionComponent implements AfterViewInit, OnDestroy {
    @Input() factory: Factory | undefined = undefined;
    @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;
    @ViewChild(FactoryProductionTabsComponent) tabsComponent!: FactoryProductionTabsComponent;
    @ViewChild(FactoryProductionToolbarComponent) toolbarComponent!: FactoryProductionToolbarComponent;

    private leftPanel!: HTMLElement;
    private rightPanel!: HTMLElement;
    private isResizing: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    
    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            const resizer = this.resizer.nativeElement;
            this.leftPanel = resizer.previousElementSibling as HTMLElement;
            this.rightPanel = resizer.nextElementSibling as HTMLElement;

            this.setUpTabsEventListeners();
            this.setUpToolbarEventListeners();
            this.setUpResizerEventListeners();
        }
    }

    private setUpTabsEventListeners() {
        this.tabsComponent.onNodeClicked.subscribe((node) => {
            this.toolbarComponent.handleNodeClicked(node);
        });
        this.tabsComponent.onEdgeClicked.subscribe((edge) => {
            this.toolbarComponent.handleEdgeClicked(edge);
        });
    }
    
    private setUpToolbarEventListeners() {
        this.toolbarComponent.addFactoryStage.subscribe(() => {
            this.tabsComponent.loadAddStageComponent();
        });
        this.toolbarComponent.updateFactoryStage.subscribe(() => {
            console.log("Update factory stage: ", this.factory);
            if (!this.factory?.id) return;
            this.tabsComponent.loadUpdateStageComponent(this.factory?.id || 0);
        });
        this.toolbarComponent.toggleAddConnectionMode.subscribe(() => {
            this.tabsComponent.toggleAddConnectionMode();
        });
        this.toolbarComponent.displayQuantities.subscribe((display) => {
            this.tabsComponent.displayQuantities(display);
        });
        this.toolbarComponent.displayCapacities.subscribe((display) => {
            this.tabsComponent.displayCapacities(display);
        });
        this.toolbarComponent.displayPriorities.subscribe((display) => {
            this.tabsComponent.displayPriorities(display);
        });
        this.toolbarComponent.viewActivePlan.subscribe(() => {
            this.tabsComponent.loadAllocationPlanComponent({ allocations: [], inventoryBalance: []}, true, this.factory?.id || 0);
        });
        this.toolbarComponent.displayAllocations.subscribe((allocationPlan) => {
            this.tabsComponent.displayAllocations(allocationPlan);
        });
        this.toolbarComponent.openAllocationPlan.subscribe((allocationPlan) => {
            this.tabsComponent.loadAllocationPlanComponent(allocationPlan, false, this.factory?.id || 0);
        });
        this.toolbarComponent.viewProductionHistory.subscribe(() => {
            this.tabsComponent.loadProductionHistoryComponent();
        });
    }

    // Resizing the panels
    private setUpResizerEventListeners() {
        this.resizer.nativeElement.addEventListener('mousedown', this.startResizing);
        document.addEventListener('mouseup', this.stopResizing);
    }
    
    private startResizing = (event: MouseEvent) => {
        this.isResizing = true;
        document.addEventListener('mousemove', this.resize);
    }

    private resize = (event: MouseEvent) => {
        if (!this.isResizing) return;
        const leftWidth = event.clientX - this.leftPanel.getBoundingClientRect().left;
        this.leftPanel.style.width = `${leftWidth}px`;
        const rightWidth = window.innerWidth - event.clientX - this.resizer.nativeElement.offsetWidth;
        this.rightPanel.style.width = `${rightWidth}px`;
    }

    private stopResizing = () => {
        if (this.isResizing) {
            document.removeEventListener('mousemove', this.resize);
            this.isResizing = false;
        }
    }

    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.resizer.nativeElement.removeEventListener('mousedown', this.startResizing);
            document.removeEventListener('mouseup', this.stopResizing);
            document.removeEventListener('mousemove', this.resize);
        }
    }

}
