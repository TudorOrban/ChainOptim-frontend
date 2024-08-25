import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/searchTypes';
import {
    CreateSupplierShipmentDTO,
    ShipmentStatus,
    SupplierShipment,
    UpdateSupplierShipmentDTO,
} from '../../models/SupplierShipment';
import { SupplierShipmentService } from '../../services/suppliershipment.service';
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
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/Supplier';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchOptionsService } from '../../../../shared/search/services/searchoptions.service';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';

@Component({
    selector: 'app-supplier-shipments',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableToolbarComponent,
        PageSelectorComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './supplier-shipments.component.html',
    styleUrl: './supplier-shipments.component.css',
})
export class SupplierShipmentsComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;
    @Input() supplierId: number | undefined = undefined;
    @Input() dontPadHorizontally: boolean = false;

    currentUser: User | undefined = undefined;
    supplierShipments: PaginatedResults<SupplierShipment> | undefined = undefined;
    suppliers: Supplier[] = [];
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

    selectedShipmentIds = new Set<number>();
    newRawShipments: any[] = [];
    isEditing: boolean = false;
    selectedComponentId: { [shipmentId: number]: number | null } = {};

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Supplier',
        dialogMessage: 'Are you sure you want to delete this supplier?',
    };
    isConfirmDialogOpen = false;

    sortOptions: UIItem[] = [];
    filterOptions: FilterOption[] = [];

    Feature = Feature;
    
    constructor(
        private userService: UserService,
        private supplierShipmentService: SupplierShipmentService,
        private supplierService: SupplierService,
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

            this.loadSupplierShipments();
            this.loadSuppliers();
            this.loadComponents();
        });
    }

    private loadSupplierShipments(): void {
        this.supplierShipmentService
            .getSupplierShipmentsByOrganizationIdAdvanced(
                this.searchMode == SearchMode.SECONDARY
                    ? this.supplierId || 0
                    : this.currentUser?.organization?.id || 0,
                this.searchParams,
                this.searchMode
            )
            .subscribe((supplierShipments) => {
                this.supplierShipments = supplierShipments;
            });
    }

    private loadSuppliers(): void {
        this.supplierService
            .getSuppliersByOrganizationId(
                this.currentUser?.organization?.id || 0
            )
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
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
            this.loadSupplierShipments();
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
            this.loadSupplierShipments();
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
        this.loadSupplierShipments();
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadSupplierShipments();
        }
    }

    handleRefresh(): void {
        this.loadSupplierShipments();
    }

    // CRUD ops
    // - Selection
    toggleSelection(shipment: SupplierShipment): void {
        if (this.selectedShipmentIds.has(shipment.id)) {
            this.selectedShipmentIds.delete(shipment.id);
        } else {
            this.selectedShipmentIds.add(shipment.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.supplierShipments?.results.forEach((shipment) => {
            shipment.selected = checked;
            if (checked) {
                this.selectedShipmentIds.add(shipment.id);
            } else {
                this.selectedShipmentIds.delete(shipment.id);
            }
        });
    }

    handleCancel(): void {
        this.newRawShipments = [];
        this.selectedShipmentIds.clear();
        this.isEditing = false;
        if (this.supplierShipments && this.supplierShipments.results) {
            this.supplierShipments.results = this.supplierShipments.results.map(
                (shipment) => {
                    return { ...shipment, selected: false, isEditing: false };
                }
            );
        }
    }

    // Create
    handleAddShipment(): void {
        this.newRawShipments.push({
            supplierId: '',
            component: { id: 0, name: '' },
            quantity: 0,
            deliveredQuantity: 0,
            arrivalDate: new Date(),
            estimatedArrivalDate: new Date(),
            shipmentStartingDate: null,
            companyId: '',
            status: '',
        });
    }

    handleCreateShipments(): void {
        const newShipmentDTOs: CreateSupplierShipmentDTO[] = [];

        for (const rawShipment of this.newRawShipments) {
            const newShipment = this.getValidShipmentDTO(rawShipment);
            if (newShipment == null) {
                console.error('Validation failed for new shipment:', rawShipment);
                return;
            }
            newShipmentDTOs.push(newShipment);
        }

        this.supplierShipmentService
            .createSupplierShipmentsInBulk(newShipmentDTOs)
            .subscribe({
                next: (shipments) => {
                    this.newRawShipments = [];
                    this.loadSupplierShipments();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Supplier Shipment created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Supplier Shipment creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to create shipments', err);
                },
            });
    }

    private getValidShipmentDTO(shipment: any): CreateSupplierShipmentDTO | null {
        // Check for required fields and basic validation
        if (!shipment.supplierId) {
            console.error('Validation failed, missing required shipment fields.');
            return null;
        }

        // Ensure dates are actual Date objects or valid date strings
        const arrivalDate = this.ensureValidDate(shipment.arrivalDate);
        const estimatedArrivalDate = this.ensureValidDate(
            shipment.estimatedArrivalDate
        );
        const shipmentStartingDate = this.ensureValidDate(shipment.shipmentStartingDate);

        if (
            !arrivalDate ||
            !estimatedArrivalDate ||
            (shipment.shipmentStartingDate && !shipmentStartingDate)
        ) {
            console.error('Validation failed, invalid date format.');
            return null;
        }

        // Construct DTO
        const dto: CreateSupplierShipmentDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            supplierOrderId: Number(shipment.supplierOrderId),
            supplierId: Number(shipment.supplierId),
            quantity: Number(shipment.quantity),
            arrivalDate: arrivalDate,
            estimatedArrivalDate: estimatedArrivalDate,
            // shipmentStartingDate: shipmentStartingDate,
            companyId: shipment.companyId,
            status: shipment.status || ShipmentStatus.IN_TRANSIT,
        };

        return dto;
    }

    private ensureValidDate(date: any): Date | null {
        if (date instanceof Date) return date;
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Update
    editSelectedShipments(): void {
        this.supplierShipments?.results.forEach((shipment) => {
            if (this.selectedShipmentIds.has(shipment.id)) {
                shipment.isEditing = !shipment.isEditing;
            }
        });
        this.isEditing = true;
    }

    saveEditedShipments(): void {
        const editedShipments = this.supplierShipments?.results.filter(
            (shipment) => shipment.isEditing
        );

        const editedShipmentDTOs = this.getValidUpdateDTO(editedShipments || []);

        this.supplierShipmentService
            .updateSupplierShipmentsInBulk(editedShipmentDTOs)
            .subscribe({
                next: (shipments) => {
                    this.loadSupplierShipments();
                    this.handleCancel();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Supplier Shipment updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Supplier Shipment update failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to update shipments', err);
                },
            });
    }

    private getValidUpdateDTO(
        editedShipments: SupplierShipment[]
    ): UpdateSupplierShipmentDTO[] {
        const shipmentDTOs: UpdateSupplierShipmentDTO[] = [];

        for (const shipment of editedShipments || []) {
            const shipmentDTO: UpdateSupplierShipmentDTO = {
                id: shipment.id,
                supplierOrderId: shipment.supplierOrderId,
                supplierId: shipment.supplierId,
                organizationId: shipment.organizationId,
                quantity: shipment.quantity,
                arrivalDate: shipment.arrivalDate,
                estimatedArrivalDate: shipment.estimatedArrivalDate,
                shipmentStartingDate: shipment.shipmentStartingDate,
                companyId: shipment.companyId,
                status: shipment.status,
            };

            shipmentDTOs.push(shipmentDTO);
        }

        return shipmentDTOs;
    }

    // - Delete
    openConfirmDeleteDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteSupplierShipments() {
        this.supplierShipmentService
            .deleteSupplierShipmentsInBulk(Array.from(this.selectedShipmentIds))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Supplier deleted successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.isConfirmDialogOpen = false;
                    this.selectedShipmentIds.clear();
                    this.loadSupplierShipments();
                },
                error: (error: Error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Supplier deletion failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error deleting supplier:', error);
                },
            });
    }

    handleCancelDeletion() {
        this.isConfirmDialogOpen = false;
    }

    // Utils
    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }

    getSupplierName(supplierId: number): string {
        const supplier = this.suppliers.find((s) => s.id === supplierId);
        return supplier ? supplier.name : 'Unknown Supplier';
    }
}
