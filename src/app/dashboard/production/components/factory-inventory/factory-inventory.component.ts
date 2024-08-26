import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/searchTypes';
import {
    CreateFactoryInventoryItemDTO,
    FactoryInventoryItem,
    UpdateFactoryInventoryItemDTO,
} from '../../models/FactoryInventoryItem';
import { FactoryInventoryItemService } from '../../services/factoryinventoryitem.service';
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
import { FactoryService } from '../../services/factory.service';
import { Factory } from '../../models/Factory';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchOptionsService } from '../../../../shared/search/services/searchoptions.service';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { ProductSearchDTO } from '../../../goods/models/Product';
import { ProductService } from '../../../goods/services/product.service';

@Component({
    selector: 'app-factory-inventory',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableToolbarComponent,
        PageSelectorComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './factory-inventory.component.html',
    styleUrl: './factory-inventory.component.css',
})
export class FactoryInventoryComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;
    @Input() factoryId: number | undefined = undefined;
    @Input() dontPadHorizontally: boolean = false;

    currentUser: User | undefined = undefined;
    factoryInventoryItems: PaginatedResults<FactoryInventoryItem> | undefined = undefined;
    factories: Factory[] = [];
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
        dialogTitle: 'Delete Factory',
        dialogMessage: 'Are you sure you want to delete this factory?',
    };
    isConfirmDialogOpen = false;

    sortOptions: UIItem[] = [];
    filterOptions: FilterOption[] = [];

    Feature = Feature;
    
    constructor(
        private userService: UserService,
        private factoryInventoryItemService: FactoryInventoryItemService,
        private factoryService: FactoryService,
        private componentService: ComponentService,
        private productService: ProductService,
        private toastService: ToastService,
        private searchOptionsService: SearchOptionsService
    ) {
        this.filterOptions =
            this.searchOptionsService.getSearchOptions(Feature.FACTORY_INVENTORY)
                ?.filterOptions || [];
        this.sortOptions =
            this.searchOptionsService.getSearchOptions(Feature.FACTORY_INVENTORY)
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

            this.loadFactoryInventoryItems();
            this.loadFactories();
            this.loadComponents();
            this.loadProducts();
        });
    }

    private loadFactoryInventoryItems(): void {
        this.factoryInventoryItemService
            .getFactoryInventoryItemsByOrganizationIdAdvanced(
                this.searchMode == SearchMode.SECONDARY
                    ? this.factoryId || 0
                    : this.currentUser?.organization?.id || 0,
                this.searchParams,
                this.searchMode
            )
            .subscribe((factoryInventoryItems) => {
                this.factoryInventoryItems = factoryInventoryItems;
            });
    }

    private loadFactories(): void {
        this.factoryService
            .getFactoriesByOrganizationId(
                this.currentUser?.organization?.id || 0,
                true
            )
            .subscribe((factories) => {
                this.factories = factories;
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
            this.loadFactoryInventoryItems();
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
            this.loadFactoryInventoryItems();
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
        this.loadFactoryInventoryItems();
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadFactoryInventoryItems();
        }
    }

    handleRefresh(): void {
        this.loadFactoryInventoryItems();
    }

    // CRUD ops
    // - Selection
    toggleSelection(item: FactoryInventoryItem): void {
        if (this.selectedItemIds.has(item.id)) {
            this.selectedItemIds.delete(item.id);
        } else {
            this.selectedItemIds.add(item.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.factoryInventoryItems?.results.forEach((item) => {
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
        if (this.factoryInventoryItems && this.factoryInventoryItems.results) {
            this.factoryInventoryItems.results = this.factoryInventoryItems.results.map(
                (item) => {
                    return { ...item, selected: false, isEditing: false };
                }
            );
        }
    }

    // Create
    handleAddItem(): void {
        this.newRawItems.push({
            factoryId: '',
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
        const newItemDTOs: CreateFactoryInventoryItemDTO[] = [];

        for (const rawItem of this.newRawItems) {
            const newItem = this.getValidItemDTO(rawItem);
            if (newItem == null) {
                console.error('Validation failed for new item:', rawItem);
                return;
            }
            newItemDTOs.push(newItem);
        }

        this.factoryInventoryItemService
            .createFactoryInventoryItemsInBulk(newItemDTOs)
            .subscribe({
                next: (items) => {
                    this.newRawItems = [];
                    this.loadFactoryInventoryItems();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Factory Item created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Factory Item creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to create items', err);
                },
            });
    }

    private getValidItemDTO(item: any): CreateFactoryInventoryItemDTO | null {
        // Check for required fields and basic validation
        if (!item.factoryId) {
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
        const dto: CreateFactoryInventoryItemDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            factoryId: Number(item.factoryId),
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
        this.factoryInventoryItems?.results.forEach((item) => {
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

    getComponentId(item: FactoryInventoryItem): number | null {
        return item.component ? item.component.id : null;
    }

    getProductId(item: FactoryInventoryItem): number | null {
        return item.product ? item.product.id : null;
    }

    // Method to set component ID when changed
    setComponentId(item: FactoryInventoryItem, newComponentId: number): void {
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
    setProductId(item: FactoryInventoryItem, newProductId: number): void {
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
        const editedItems = this.factoryInventoryItems?.results.filter(
            (item) => item.isEditing
        );

        const editedItemDTOs = this.getValidUpdateDTO(editedItems || []);

        this.factoryInventoryItemService
            .updateFactoryInventoryItemsInBulk(editedItemDTOs)
            .subscribe({
                next: (items) => {
                    this.loadFactoryInventoryItems();
                    this.handleCancel();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Factory Item updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Factory Item update failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to update items', err);
                },
            });
    }

    private getValidUpdateDTO(
        editedItems: FactoryInventoryItem[]
    ): UpdateFactoryInventoryItemDTO[] {
        const itemDTOs: UpdateFactoryInventoryItemDTO[] = [];

        for (const item of editedItems || []) {
            const itemDTO: UpdateFactoryInventoryItemDTO = {
                id: item.id,
                factoryId: item.factoryId,
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

    handleDeleteFactoryInventoryItems() {
        this.factoryInventoryItemService
            .deleteFactoryInventoryItemsInBulk(Array.from(this.selectedItemIds))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Factory deleted successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.isConfirmDialogOpen = false;
                    this.selectedItemIds.clear();
                    this.loadFactoryInventoryItems();
                },
                error: (error: Error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Factory deletion failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error deleting factory:', error);
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

    getFactoryName(factoryId: number): string {
        const factory = this.factories.find((s) => s.id === factoryId);
        return factory ? factory.name : 'Unknown Factory';
    }
}
