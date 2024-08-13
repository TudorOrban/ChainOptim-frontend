import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    Component as ProdComponent,
} from '../../models/Component';
import { CommonModule } from '@angular/common';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ToastComponent } from '../../../../shared/common/components/toast-system/toast/toast.component';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { ComponentService } from '../../services/component.service';

@Component({
    selector: 'app-component',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        FallbackManagerComponent,
        GenericConfirmDialogComponent,
        ToastComponent
    ],
    templateUrl: './component.component.html',
    styleUrl: './component.component.css',
})
export class ComponentComponent implements OnInit {
    componentId: string | null = null;
    component: ProdComponent | null = null;
    components: ProdComponent[] = [];
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Componention",
        },
        {
            label: "Evaluation",
        },
    ];
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Component",
        dialogMessage: "Are you sure you want to delete this component?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Component deleted",
        message: "The component has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private route: ActivatedRoute,
        private componentService: ComponentService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router
    ) {}

    ngOnInit() {
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.componentId = params.get('componentId');
            
            this.componentService
                .getComponentById(Number(this.componentId))
                .subscribe({
                    next: (component) => {
                        console.log('COMPONENT', component);
                        this.component = component;
                        this.fallbackManagerService.updateLoading(false);
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
        });
    }

    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    openConfirmDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteComponent() {
        this.componentService
            .deleteComponent(Number(this.componentId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Component deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/components']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Component deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting component:', error);
                },
            });   
    }

    handleCancel() {
        this.isConfirmDialogOpen = false;
    }

    faBox = faBox;
    faGear = faGear;
    faTrash = faTrash;
}
