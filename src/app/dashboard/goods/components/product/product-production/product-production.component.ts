import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { Product } from '../../../models/Product';
import { ProductProductionTabsComponent } from './product-production-tabs/product-production-tabs.component';
import { ProductProductionToolbarComponent } from './product-production-toolbar/product-production-toolbar.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-production',
  standalone: true,
  imports: [ProductProductionTabsComponent, ProductProductionToolbarComponent],
  templateUrl: './product-production.component.html',
  styleUrl: './product-production.component.css'
})
export class ProductProductionComponent implements AfterViewInit, OnDestroy {
    @Input() product: Product | null = null;
    @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;
    @ViewChild(ProductProductionTabsComponent) tabsComponent!: ProductProductionTabsComponent;
    @ViewChild(ProductProductionToolbarComponent) toolbarComponent!: ProductProductionToolbarComponent;

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
        this.toolbarComponent.addStage.subscribe(() => {
            this.tabsComponent.loadAddStageComponent();
        });
        this.toolbarComponent.updateStage.subscribe(() => {
            console.log("Update factory stage: ", this.product);
            if (!this.product?.id) return;
            this.tabsComponent.loadUpdateStageComponent(this.product?.id || 0);
        });
        // this.toolbarComponent.toggleAddConnectionMode.subscribe(() => {
        //     this.tabsComponent.toggleAddConnectionMode();
        // });
        // this.toolbarComponent.displayQuantities.subscribe((display) => {
        //     this.tabsComponent.displayQuantities(display);
        // });
        // this.toolbarComponent.displayCapacities.subscribe((display) => {
        //     this.tabsComponent.displayCapacities(display);
        // });
        // this.toolbarComponent.displayPriorities.subscribe((display) => {
        //     this.tabsComponent.displayPriorities(display);
        // });
        // this.toolbarComponent.viewActivePlan.subscribe(() => {
        //     this.tabsComponent.loadAllocationPlanComponent({ allocations: [], inventoryBalance: []}, true, this.factory?.id || 0);
        // });
        // this.toolbarComponent.displayAllocations.subscribe((allocationPlan) => {
        //     this.tabsComponent.displayAllocations(allocationPlan);
        // });
        // this.toolbarComponent.openAllocationPlan.subscribe((allocationPlan) => {
        //     this.tabsComponent.loadAllocationPlanComponent(allocationPlan, false, this.factory?.id || 0);
        // });
        // this.toolbarComponent.viewProductionHistory.subscribe(() => {
        //     this.tabsComponent.loadProductionHistoryComponent();
        // });
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
