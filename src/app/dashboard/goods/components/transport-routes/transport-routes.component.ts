import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/searchTypes';
import { UserService } from '../../../../core/auth/services/user.service';
import {
    FilterOption,
    SearchParams,
    UIItem,
} from '../../../../shared/search/models/searchTypes';
import { Feature, SearchMode } from '../../../../shared/enums/commonEnums';
import { TableToolbarComponent } from '../../../../shared/table/table-toolbar/table-toolbar.component';
import { User } from '../../../../core/user/model/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ComponentService } from '../../../goods/services/component.service';
import { ComponentSearchDTO } from '../../../goods/models/Component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchOptionsService } from '../../../../shared/search/services/searchoptions.service';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { CreateRouteDTO, ResourceTransportRoute, UpdateRouteDTO } from '../../models/TransportRoute';
import { TransportRouteService } from '../../services/transportroute.service';
import { ShipmentStatus } from '../../../supply/models/SupplierShipment';

@Component({
    selector: 'app-transport-routes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableToolbarComponent,
        PageSelectorComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './transport-routes.component.html',
    styleUrl: './transport-routes.component.css',
})
export class TransportRoutesComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;
    @Input() supplierId: number | undefined = undefined;
    @Input() dontPadHorizontally: boolean = false;

    currentUser: User | undefined = undefined;
    routes: PaginatedResults<ResourceTransportRoute> | undefined = undefined;
    components: ComponentSearchDTO[] = [];

    searchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'createdAt',
        ascending: false,
        page: 1,
        itemsPerPage: 20,
    };
    SearchMode = SearchMode;
    ShipmentStatus = ShipmentStatus;

    selectedRouteIds = new Set<number>();
    newRawRoutes: any[] = [];
    isEditing: boolean = false;
    selectedComponentId: { [routeId: number]: number | null } = {};

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Transport Route',
        dialogMessage: 'Are you sure you want to delete this transport route?',
    };
    isConfirmDialogOpen = false;

    sortOptions: UIItem[] = [];
    filterOptions: FilterOption[] = [];

    constructor(
        private userService: UserService,
        private resourceTransportRouteService: TransportRouteService,
        private componentService: ComponentService,
        private toastService: ToastService,
        private searchOptionsService: SearchOptionsService
    ) {
        this.filterOptions =
            this.searchOptionsService.getSearchOptions(Feature.SUPPLIER_SHIPMENT)
                ?.filterOptions || [];
        this.sortOptions =
            this.searchOptionsService.getSearchOptions(Feature.SUPPLIER_SHIPMENT)
                ?.sortOptions || [];
    }

    ngOnInit(): void {
        this.loadData();
    }

    // Data loading
    private loadData(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user?.organization) {
                return;
            }
            this.currentUser = user;

            this.loadResourceTransportRoutes();
            this.loadComponents();
        });
    }

    private loadResourceTransportRoutes(): void {
        this.resourceTransportRouteService
            .getResourceTransportRoutesByOrganizationIdAdvanced(
                this.searchMode == SearchMode.SECONDARY
                    ? this.supplierId || 0
                    : this.currentUser?.organization?.id || 0,
                this.searchParams,
            )
            .subscribe((routes) => {
                this.routes = routes;
            });
    }

    private loadComponents(): void {
        this.componentService
            .getComponentsByOrganizationId(
                this.currentUser?.organization?.id || 0,
                true
            )
            .subscribe((components) => {
                this.components = components;
            });
    }

    // Searching
    handleSearch(query: string): void {
        if (this.searchParams.searchQuery !== query) {
            this.searchParams.searchQuery = query;
            this.searchParams.page = 1;
            this.loadResourceTransportRoutes();
        }
    }

    handleSortChange(sortChange: { value: string; ascending: boolean }): void {
        if (
            this.searchParams.sortOption !== sortChange.value ||
            this.searchParams.ascending !== sortChange.ascending
        ) {
            this.searchParams.sortOption = this.sortOptions.find(
                (option) => option.value === sortChange.value
            )!.value;
            this.searchParams.ascending = sortChange.ascending;
            this.searchParams.page = 1;
            this.loadResourceTransportRoutes();
        }
    }

    handleFilterChange(filterChange: { key: string; value: string }): void {
        if (!filterChange?.value) {
            this.searchParams.filters = {};
        } else {
            this.searchParams.filters = {
                [filterChange.key]: filterChange.value,
            };
        }
        this.loadResourceTransportRoutes();
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadResourceTransportRoutes();
        }
    }

    handleRefresh(): void {
        this.loadResourceTransportRoutes();
    }

    // CRUD ops
    // - Selection
    toggleSelection(route: ResourceTransportRoute): void {
        if (this.selectedRouteIds.has(route.id)) {
            this.selectedRouteIds.delete(route.id);
        } else {
            this.selectedRouteIds.add(route.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.routes?.results.forEach((route) => {
            route.selected = checked;
            if (checked) {
                this.selectedRouteIds.add(route.id);
            } else {
                this.selectedRouteIds.delete(route.id);
            }
        });
    }

    handleCancel(): void {
        this.newRawRoutes = [];
        this.selectedRouteIds.clear();
        this.isEditing = false;
        if (this.routes && this.routes.results) {
            this.routes.results = this.routes.results.map(
                (route) => {
                    return { ...route, selected: false, isEditing: false };
                }
            );
        }
    }

    // Create
    handleAddRoute(): void {
        this.newRawRoutes.push({
            supplierId: '',
            component: { id: 0, name: '' },
            quantity: 0,
            deliveredQuantity: 0,
            arrivalDate: new Date(),
            estimatedArrivalDate: new Date(),
            routeStartingDate: null,
            companyId: '',
            status: '',
        });
    }

    handleCreateRoutes(): void {
        const newRouteDTOs: CreateRouteDTO[] = [];

        for (const rawRoute of this.newRawRoutes) {
            const newRoute = this.getValidRouteDTO(rawRoute);
            if (newRoute == null) {
                console.error('Validation failed for new route:', rawRoute);
                return;
            }
            newRouteDTOs.push(newRoute);
        }
        console.log('Creating routes:', newRouteDTOs);
        // this.resourceTransportRouteService
        //     .createResourceTransportRoutesInBulk(newRouteDTOs)
        //     .subscribe({
        //         next: (routes) => {
        //             this.newRawRoutes = [];
        //             this.loadResourceTransportRoutes();
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Success',
        //                 message: 'Supplier Route created successfully.',
        //                 outcome: OperationOutcome.SUCCESS,
        //             });
        //         },
        //         error: (err) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Error',
        //                 message: 'Supplier Route creation failed.',
        //                 outcome: OperationOutcome.ERROR,
        //             });
        //             console.error('Failed to create routes', err);
        //         },
        //     });
    }

    private getValidRouteDTO(route: any): CreateRouteDTO | null {
        // Check for required fields and basic validation
        if (!route.supplierId) {
            console.error('Validation failed, missing required route fields.');
            return null;
        }

        // Ensure dates are actual Date objects or valid date strings
        const arrivalDate = this.ensureValidDate(route.arrivalDate);
        const estimatedArrivalDate = this.ensureValidDate(
            route.estimatedArrivalDate
        );
        const routeStartingDate = this.ensureValidDate(route.routeStartingDate);

        if (
            !arrivalDate ||
            !estimatedArrivalDate ||
            (route.routeStartingDate && !routeStartingDate)
        ) {
            console.error('Validation failed, invalid date format.');
            return null;
        }

        // Construct DTO
        const dto: CreateRouteDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            companyId: route.companyId,
            transportRoute: {
                departureDateTime: new Date(),
                arrivalDateTime: arrivalDate,
                estimatedArrivalDateTime: estimatedArrivalDate,
                status: route.status || ShipmentStatus.IN_TRANSIT,

            }
        };

        return dto;
    }

    private ensureValidDate(date: any): Date | null {
        if (date instanceof Date) return date;
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Update
    editSelectedRoutes(): void {
        this.routes?.results.forEach((route) => {
            if (this.selectedRouteIds.has(route.id)) {
                route.isEditing = !route.isEditing;
            }
        });
        this.isEditing = true;
    }

    saveEditedRoutes(): void {
        const editedRoutes = this.routes?.results.filter(
            (route) => route.isEditing
        );

        const editedRouteDTOs = this.getValidUpdateDTO(editedRoutes || []);
        console.log('Updating routes:', editedRouteDTOs);
        // this.resourceTransportRouteService
        //     .updateResourceTransportRoutesInBulk(editedRouteDTOs)
        //     .subscribe({
        //         next: (routes) => {
        //             this.loadResourceTransportRoutes();
        //             this.handleCancel();
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Success',
        //                 message: 'Supplier Route updated successfully.',
        //                 outcome: OperationOutcome.SUCCESS,
        //             });
        //         },
        //         error: (err) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Error',
        //                 message: 'Supplier Route update failed.',
        //                 outcome: OperationOutcome.ERROR,
        //             });
        //             console.error('Failed to update routes', err);
        //         },
        //     });
    }

    private getValidUpdateDTO(
        editedRoutes: ResourceTransportRoute[]
    ): UpdateRouteDTO[] {
        const routeDTOs: UpdateRouteDTO[] = [];

        for (const route of editedRoutes || []) {
            const routeDTO: UpdateRouteDTO = {
                id: route.id,
                organizationId: this.currentUser?.organization?.id ?? 0,
                companyId: route.companyId,
                transportRoute: {
                    departureDateTime: route.transportRoute.departureDateTime,
                    arrivalDateTime: route.transportRoute.arrivalDateTime,
                    estimatedArrivalDateTime: route.transportRoute.estimatedArrivalDateTime,
                    status: route.transportRoute?.status || ShipmentStatus.IN_TRANSIT,
                }
            };

            routeDTOs.push(routeDTO);
        }

        return routeDTOs;
    }

    // - Delete
    openConfirmDeleteDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteRoutes() {
        // this.resourceTransportRouteService
        //     .deleteResourceTransportRoutesInBulk(Array.from(this.selectedRouteIds))
        //     .subscribe({
        //         next: (success) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Success',
        //                 message: 'Supplier deleted successfully.',
        //                 outcome: OperationOutcome.SUCCESS,
        //             });
        //             this.isConfirmDialogOpen = false;
        //             this.selectedRouteIds.clear();
        //             this.loadResourceTransportRoutes();
        //         },
        //         error: (error: Error) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Error',
        //                 message: 'Supplier deletion failed.',
        //                 outcome: OperationOutcome.ERROR,
        //             });
        //             console.error('Error deleting supplier:', error);
        //         },
        //     });
    }

    handleCancelDeletion() {
        this.isConfirmDialogOpen = false;
    }

    // Utils
    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }
}
