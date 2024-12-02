import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ComponentService } from '../../../../../dashboard/goods/services/component.service';
import { UserService } from '../../../../../core/user/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentSearchDTO, Component as ProdComponent } from '../../../../../dashboard/goods/models/Component';

@Component({
  selector: 'app-select-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-component.component.html',
  styleUrl: './select-component.component.css'
})
export class SelectComponentComponent implements OnChanges {    
    @Input() initialData: { component?: ProdComponent, componentId?: number, initialComponents?: ProdComponent[] | ComponentSearchDTO[], preventComponentLoading?: boolean } | undefined = undefined;

    components: ProdComponent[] | ComponentSearchDTO[] = [];
    selectedComponentId: number | undefined = undefined;

    @Output() componentSelected = new EventEmitter<ComponentSearchDTO>();

    constructor(
        private readonly componentService: ComponentService,
        private readonly userService: UserService,
    ) {}

    ngOnInit(): void {
        this.handleInitialData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.handleInitialData(changes);
    }
    
    private handleInitialData(changes?: SimpleChanges): void {
        if (this.initialData?.preventComponentLoading) {
            this.components = this.initialData?.initialComponents ?? [];
            this.selectedComponentId = this.initialData?.componentId;
        } else {
            this.loadComponents();
            this.handleInputData(changes);
        }
    }
    
    private handleInputData(changes?: SimpleChanges): void {
        if (!changes) return;
        if (changes['initialData'] && this.initialData && this.components.length > 0) {
            if (this.initialData?.component) {
                this.selectComponent(this.initialData.component.id);
            } else if (this.initialData?.componentId) {
                this.selectComponent(this.initialData.componentId);
            }
        }
    }
    
    private loadComponents(): void {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (!user?.organization) {
                    return;
                }
                this.loadComponentsByOrganizationId(user.organization?.id ?? 0);
            },
            error: (error: Error) => {
                console.error('Error loading current user', error);
            }
        });
    }

    private loadComponentsByOrganizationId(organizationId: number): void {
        this.componentService.getComponentsByOrganizationId(organizationId, true)
            .subscribe(components => {
                if (components?.length == 0) {
                    console.error("Error: Components data is not valid.: ", components);
                    return;
                }

                console.log("Components: ", components);
                this.components = components;

                if (this.initialData?.component) {
                    this.selectComponent(this.initialData.component.id);
                }
            });
    }

    selectComponent(componentId: number | undefined): void {
        console.log("Selected component: ", componentId);
        this.selectedComponentId = componentId;
        const selectedComponent = this.components.find(component => component.id === componentId);
        if (!selectedComponent) {
            console.error("Error: Selected component not found: ", componentId);
            return;
        }
        this.componentSelected.emit(selectedComponent);
    }
}
