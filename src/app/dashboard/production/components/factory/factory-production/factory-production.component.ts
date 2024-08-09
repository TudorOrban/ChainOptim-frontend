import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Factory } from '../../../models/Factory';
import { FactoryService } from '../../../services/factory.service';
import { FactoryProductionTabsComponent } from './factory-production-tabs/factory-production-tabs.component';
import { FactoryProductionToolbarComponent } from './factory-production-toolbar/factory-production-toolbar.component';

@Component({
  selector: 'app-factory-production',
  standalone: true,
  imports: [FactoryProductionTabsComponent, FactoryProductionToolbarComponent],
  templateUrl: './factory-production.component.html',
  styleUrl: './factory-production.component.css'
})
export class FactoryProductionComponent implements AfterViewInit, OnDestroy {
    @Input() factory: Factory | null = null;
    @ViewChild('resizer') resizer!: ElementRef<HTMLDivElement>;

    private leftPanel!: HTMLElement;
    private rightPanel!: HTMLElement;
    private isResizing: boolean = false;

    constructor(
        private factoryService: FactoryService
    ) {}

    
    ngAfterViewInit(): void {
        const resizer = this.resizer.nativeElement;
        this.leftPanel = resizer.previousElementSibling as HTMLElement;
        this.rightPanel = resizer.nextElementSibling as HTMLElement;

        resizer.addEventListener('mousedown', this.startResizing);
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
        // Clean up the event listeners when the component is destroyed
        this.resizer.nativeElement.removeEventListener('mousedown', this.startResizing);
        document.removeEventListener('mouseup', this.stopResizing);
        document.removeEventListener('mousemove', this.resize);
    }


}
