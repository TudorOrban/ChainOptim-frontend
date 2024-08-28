import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/searchTypes';
import {
    CreateWarehouseInventoryItemDTO,
    WarehouseInventoryItem,
    UpdateWarehouseInventoryItemDTO,
} from '../../models/WarehouseInventoryItem';
import { WarehouseInventoryItemService } from '../../services/warehouseinventoryitem.service';
import { UserService } from '../../../../core/user/services/user.service';
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
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/Warehouse';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchOptionsService } from '../../../../shared/search/services/searchoptions.service';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { ProductSearchDTO } from "../../../goods/models/Product";
import { ProductService } from '../../../goods/services/product.service';

@Component({
    selector: 'app-warehouse-inventory',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableToolbarComponent,
        PageSelectorComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './warehouse-inventory.component.html',
    styleUrl: './warehouse-inventory.component.css',
})
export class WarehouseInventoryComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;
    @Input() warehouseId: number | undefined = undefined;
    @Input() dontPadHorizontally: boolean = false;

    currentUser: User | undefined = undefined;
    warehouseInventoryItems: PaginatedResults<WarehouseInventoryItem> | undefined = undefined;
    warehouses: Warehouse[] = [];
    components: ComponentSearchDTO[] = [];
    products: ProductSearchDTO[] = [];

    searchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'createdAt',
        ascending: false,
        page: 1,
        itemsPerPage: 20,
    };
    SearchMode = SearchMode;

    selectedItemIds = new Set<number>();
    newRawItems: any[] = [];
    isEditing: boolean = false;
    selectedComponentId: { [itemId: number]: number | null } = {};
    selectedProductId: { [itemId: number]: number | null } = {};

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Warehouse',
        dialogMessage: 'Are you sure you want to delete this warehouse?',
    };
    isConfirmDialogOpen = false;

    sortOptions: UIItem[] = [];
    filterOptions: FilterOption[] = [];

    Feature = Feature;
    
    constructor(
        private userService: UserService,
        private warehouseInventoryItemService: WarehouseInventoryItemService,
        private warehouseService: WarehouseService,
        private componentService: ComponentService,
        private productService: ProductService,
        private toastService: ToastService,
        private searchOptionsService: SearchOptionsService
    ) {
        this.filterOptions =
            this.searchOptionsService.getSearchOptions(Feature.WAREHOUSE_INVENTORY)
                ?.filterOptions || [];
        this.sortOptions =
            this.searchOptionsService.getSearchOptions(Feature.WAREHOUSE_INVENTORY)
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

            this.loadWarehouseInventoryItems();
            this.loadWarehouses();
            this.loadComponents();
            this.loadProducts();
        });
    }

    private loadWarehouseInventoryItems(): void {
        this.warehouseInventoryItemService
            .getWarehouseInventoryItemsByOrganizationIdAdvanced(
                this.searchMode == SearchMode.SECONDARY
                    ? this.warehouseId || 0
                    : this.currentUser?.organization?.id || 0,
                this.searchParams,
                this.searchMode
            )
            .subscribe((warehouseInventoryItems) => {
                this.warehouseInventoryItems = warehouseInventoryItems;
            });
    }

    private loadWarehouses(): void {
        this.warehouseService
            .getWarehousesByOrganizationId(
                this.currentUser?.organization?.id || 0,
                true
            )
            .subscribe((warehouses) => {
                this.warehouses = warehouses;
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

    private loadProducts(): void {
        this.productService
            .getProductsByOrganizationId(
                this.currentUser?.organization?.id || 0,
                true
            )
            .subscribe((products) => {
                this.products = products;
            });
    }

    // Searching
    handleSearch(query: string): void {
        if (this.searchParams.searchQuery !== query) {
            this.searchParams.searchQuery = query;
            this.searchParams.page = 1;
            this.loadWarehouseInventoryItems();
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
            this.loadWarehouseInventoryItems();
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
        this.loadWarehouseInventoryItems();
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadWarehouseInventoryItems();
        }
    }

    handleRefresh(): void {
        this.loadWarehouseInventoryItems();
    }

    // CRUD ops
    // - Selection
    toggleSelection(item: WarehouseInventoryItem): void {
        if (this.selectedItemIds.has(item.id)) {
            this.selectedItemIds.delete(item.id);
        } else {
            this.selectedItemIds.add(item.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.warehouseInventoryItems?.results.forEach((item) => {
            item.selected = checked;
            if (checked) {
                this.selectedItemIds.add(item.id);
            } else {
                this.selectedItemIds.delete(item.id);
            }
        });
    }

    handleCancel(): void {
        this.newRawItems = [];
        this.selectedItemIds.clear();
        this.isEditing = false;
        if (this.warehouseInventoryItems && this.warehouseInventoryItems.results) {
            this.warehouseInventoryItems.results = this.warehouseInventoryItems.results.map(
                (item) => {
                    return { ...item, selected: false, isEditing: false };
                }
            );
        }
    }

    // Create
    handleAddItem(): void {
        this.newRawItems.push({
            warehouseId: '',
            component: { id: 0, name: '' },
            product: { id: 0, name: '' },
            quantity: 0,
            deliveredQuantity: 0,
            itemDate: new Date(),
            estimatedDeliveryDate: new Date(),
            deliveryDate: null,
            companyId: '',
            status: '',
        });
    }

    handleCreateItems(): void {
        const newItemDTOs: CreateWarehouseInventoryItemDTO[] = [];

        for (const rawItem of this.newRawItems) {
            const newItem = this.getValidItemDTO(rawItem);
            if (newItem == null) {
                console.error('Validation failed for new item:', rawItem);
                return;
            }
            newItemDTOs.push(newItem);
        }

        this.warehouseInventoryItemService
            .createWarehouseInventoryItemsInBulk(newItemDTOs)
            .subscribe({
                next: (items) => {
                    this.newRawItems = [];
                    this.loadWarehouseInventoryItems();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Warehouse Item created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Warehouse Item creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to create items', err);
                },
            });
    }

    private getValidItemDTO(item: any): CreateWarehouseInventoryItemDTO | null {
        // Check for required fields and basic validation
        if (!item.warehouseId) {
            console.error('Validation failed, missing required item fields.');
            return null;
        }

        // Ensure dates are actual Date objects or valid date strings
        const itemDate = this.ensureValidDate(item.itemDate);
        const estimatedDeliveryDate = this.ensureValidDate(
            item.estimatedDeliveryDate
        );
        const deliveryDate = this.ensureValidDate(item.deliveryDate);

        if (
            !itemDate ||
            !estimatedDeliveryDate ||
            (item.deliveryDate && !deliveryDate)
        ) {
            console.error('Validation failed, invalid date format.');
            return null;
        }

        // Construct DTO
        const dto: CreateWarehouseInventoryItemDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            warehouseId: Number(item.warehouseId),
            componentId: Number(item.componentId),
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            minimumRequiredQuantity: Number(item.minimumRequiredQuantity),
            companyId: item.companyId,
        };

        return dto;
    }

    private ensureValidDate(date: any): Date | null {
        if (date instanceof Date) return date;
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Update
    editSelectedItems(): void {
        this.warehouseInventoryItems?.results.forEach((item) => {
            if (this.selectedItemIds.has(item.id)) {
                item.isEditing = !item.isEditing;
                // Ensure the current component and product ID is set
                if (item.isEditing) {
                    this.selectedComponentId[item.id] = this.getComponentId(item); 
                    this.selectedProductId[item.id] = this.getProductId(item);
                }
            }
        });
        this.isEditing = true;
    }

    getComponentId(item: WarehouseInventoryItem): number | null {
        return item.component ? item.component.id : null;
    }

    getProductId(item: WarehouseInventoryItem): number | null {
        return item.product ? item.product.id : null;
    }

    // Method to set component ID when changed
    setComponentId(item: WarehouseInventoryItem, newComponentId: number): void {
        if (!item.component && newComponentId !== null) {
            item.component = {
                id: newComponentId,
                name: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            }; // Initialize with a default or lookup name
        } else if (item.component) {
            item.component.id = newComponentId;
        }
    }

    // Method to set product ID when changed
    setProductId(item: WarehouseInventoryItem, newProductId: number): void {
        if (!item.product && newProductId !== null) {
            item.product = {
                id: newProductId,
                name: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            }; // Initialize with a default or lookup name
        } else if (item.product) {
            item.product.id = newProductId;
        }
    }

    saveEditedItems(): void {
        const editedItems = this.warehouseInventoryItems?.results.filter(
            (item) => item.isEditing
        );

        const editedItemDTOs = this.getValidUpdateDTO(editedItems || []);

        this.warehouseInventoryItemService
            .updateWarehouseInventoryItemsInBulk(editedItemDTOs)
            .subscribe({
                next: (items) => {
                    this.loadWarehouseInventoryItems();
                    this.handleCancel();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Warehouse Item updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Warehouse Item update failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to update items', err);
                },
            });
    }

    private getValidUpdateDTO(
        editedItems: WarehouseInventoryItem[]
    ): UpdateWarehouseInventoryItemDTO[] {
        const itemDTOs: UpdateWarehouseInventoryItemDTO[] = [];

        for (const item of editedItems || []) {
            const itemDTO: UpdateWarehouseInventoryItemDTO = {
                id: item.id,
                warehouseId: item.warehouseId,
                componentId: item.component?.id,
                productId: item.product?.id,
                organizationId: item.organizationId,
                quantity: item.quantity,
                minimumRequiredQuantity: item.minimumRequiredQuantity,
                companyId: item.companyId,
            };

            itemDTOs.push(itemDTO);
        }

        return itemDTOs;
    }

    // - Delete
    openConfirmDeleteDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteWarehouseInventoryItems() {
        this.warehouseInventoryItemService
            .deleteWarehouseInventoryItemsInBulk(Array.from(this.selectedItemIds))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Warehouse deleted successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.isConfirmDialogOpen = false;
                    this.selectedItemIds.clear();
                    this.loadWarehouseInventoryItems();
                },
                error: (error: Error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Warehouse deletion failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error deleting warehouse:', error);
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

    getWarehouseName(warehouseId: number): string {
        const warehouse = this.warehouses.find((s) => s.id === warehouseId);
        return warehouse ? warehouse.name : 'Unknown Warehouse';
    }
}
