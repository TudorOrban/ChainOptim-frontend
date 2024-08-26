import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/searchTypes';
import {
    CreateClientOrderDTO,
    ClientOrder,
    UpdateClientOrderDTO,
} from '../../models/ClientOrder';
import { ClientOrderService } from '../../services/clientorder.service';
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
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchOptionsService } from '../../../../shared/search/services/searchoptions.service';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { OrderStatus } from '../../../supply/models/SupplierOrder';
import { ProductService } from '../../../goods/services/product.service';
import { ProductSearchDTO } from '../../../goods/models/Product';

@Component({
    selector: 'app-client-orders',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableToolbarComponent,
        PageSelectorComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './client-orders.component.html',
    styleUrl: './client-orders.component.css',
})
export class ClientOrdersComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;
    @Input() clientId: number | undefined = undefined;
    @Input() dontPadHorizontally: boolean = false;

    currentUser: User | undefined = undefined;
    clientOrders: PaginatedResults<ClientOrder> | undefined = undefined;
    clients: Client[] = [];
    products: ProductSearchDTO[] = [];

    searchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'createdAt',
        ascending: false,
        page: 1,
        itemsPerPage: 20,
    };
    SearchMode = SearchMode;
    OrderStatus = OrderStatus;

    selectedOrderIds = new Set<number>();
    newRawOrders: any[] = [];
    isEditing: boolean = false;
    selectedProductId: { [orderId: number]: number | null } = {};

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Client',
        dialogMessage: 'Are you sure you want to delete this client?',
    };
    isConfirmDialogOpen = false;

    sortOptions: UIItem[] = [];
    filterOptions: FilterOption[] = [];

    Feature = Feature;
    
    constructor(
        private userService: UserService,
        private clientOrderService: ClientOrderService,
        private clientService: ClientService,
        private productService: ProductService,
        private toastService: ToastService,
        private searchOptionsService: SearchOptionsService
    ) {
        this.filterOptions =
            this.searchOptionsService.getSearchOptions(Feature.CLIENT_ORDER)
                ?.filterOptions || [];
        this.sortOptions =
            this.searchOptionsService.getSearchOptions(Feature.CLIENT_ORDER)
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

            this.loadClientOrders();
            this.loadClients();
            this.loadProducts();
        });
    }

    private loadClientOrders(): void {
        this.clientOrderService
            .getClientOrdersByOrganizationIdAdvanced(
                this.searchMode == SearchMode.SECONDARY
                    ? this.clientId || 0
                    : this.currentUser?.organization?.id || 0,
                this.searchParams,
                this.searchMode
            )
            .subscribe((clientOrders) => {
                this.clientOrders = clientOrders;
            });
    }

    private loadClients(): void {
        this.clientService
            .getClientsByOrganizationId(
                this.currentUser?.organization?.id || 0
            )
            .subscribe((clients) => {
                this.clients = clients;
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
            this.loadClientOrders();
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
            this.loadClientOrders();
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
        this.loadClientOrders();
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadClientOrders();
        }
    }

    handleRefresh(): void {
        this.loadClientOrders();
    }

    // CRUD ops
    // - Selection
    toggleSelection(order: ClientOrder): void {
        if (this.selectedOrderIds.has(order.id)) {
            this.selectedOrderIds.delete(order.id);
        } else {
            this.selectedOrderIds.add(order.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.clientOrders?.results.forEach((order) => {
            order.selected = checked;
            if (checked) {
                this.selectedOrderIds.add(order.id);
            } else {
                this.selectedOrderIds.delete(order.id);
            }
        });
    }

    handleCancel(): void {
        this.newRawOrders = [];
        this.selectedOrderIds.clear();
        this.isEditing = false;
        if (this.clientOrders && this.clientOrders.results) {
            this.clientOrders.results = this.clientOrders.results.map(
                (order) => {
                    return { ...order, selected: false, isEditing: false };
                }
            );
        }
    }

    // Create
    handleAddOrder(): void {
        this.newRawOrders.push({
            clientId: '',
            component: { id: 0, name: '' },
            quantity: 0,
            deliveredQuantity: 0,
            orderDate: new Date(),
            estimatedDeliveryDate: new Date(),
            deliveryDate: null,
            companyId: '',
            status: '',
        });
    }

    handleCreateOrders(): void {
        const newOrderDTOs: CreateClientOrderDTO[] = [];

        for (const rawOrder of this.newRawOrders) {
            const newOrder = this.getValidOrderDTO(rawOrder);
            if (newOrder == null) {
                console.error('Validation failed for new order:', rawOrder);
                return;
            }
            newOrderDTOs.push(newOrder);
        }

        this.clientOrderService
            .createClientOrdersInBulk(newOrderDTOs)
            .subscribe({
                next: (orders) => {
                    this.newRawOrders = [];
                    this.loadClientOrders();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Client Order created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Client Order creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to create orders', err);
                },
            });
    }

    private getValidOrderDTO(order: any): CreateClientOrderDTO | null {
        // Check for required fields and basic validation
        if (!order.clientId) {
            console.error('Validation failed, missing required order fields.');
            return null;
        }

        // Ensure dates are actual Date objects or valid date strings
        const orderDate = this.ensureValidDate(order.orderDate);
        const estimatedDeliveryDate = this.ensureValidDate(
            order.estimatedDeliveryDate
        );
        const deliveryDate = this.ensureValidDate(order.deliveryDate);

        if (
            !orderDate ||
            !estimatedDeliveryDate ||
            (order.deliveryDate && !deliveryDate)
        ) {
            console.error('Validation failed, invalid date format.');
            return null;
        }

        // Construct DTO
        const dto: CreateClientOrderDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            clientId: Number(order.clientId),
            productId: Number(order.productId),
            quantity: Number(order.quantity),
            orderDate: orderDate,
            estimatedDeliveryDate: estimatedDeliveryDate,
            // deliveryDate: deliveryDate,
            companyId: order.companyId,
            status: order.status || OrderStatus.INITIATED,
        };

        return dto;
    }

    private ensureValidDate(date: any): Date | null {
        if (date instanceof Date) return date;
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Update
    editSelectedOrders(): void {
        this.clientOrders?.results.forEach((order) => {
            if (this.selectedOrderIds.has(order.id)) {
                order.isEditing = !order.isEditing;
                if (order.isEditing) {
                    this.selectedProductId[order.id] =
                        this.getProductId(order); // Ensure the current product ID is set
                }
            }
        });
        this.isEditing = true;
    }

    getProductId(order: ClientOrder): number | null {
        return order.product ? order.product.id : null;
    }

    // Method to set product ID when changed
    setProductId(order: ClientOrder, newProductId: number): void {
        if (!order.product && newProductId !== null) {
            order.product = {
                id: newProductId,
                name: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            }; // Initialize with a default or lookup name
        } else if (order.product) {
            order.product.id = newProductId;
        }
    }

    saveEditedOrders(): void {
        const editedOrders = this.clientOrders?.results.filter(
            (order) => order.isEditing
        );

        const editedOrderDTOs = this.getValidUpdateDTO(editedOrders || []);

        this.clientOrderService
            .updateClientOrdersInBulk(editedOrderDTOs)
            .subscribe({
                next: (orders) => {
                    this.loadClientOrders();
                    this.handleCancel();
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Client Order updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                },
                error: (err) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Client Order update failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Failed to update orders', err);
                },
            });
    }

    private getValidUpdateDTO(
        editedOrders: ClientOrder[]
    ): UpdateClientOrderDTO[] {
        const orderDTOs: UpdateClientOrderDTO[] = [];

        for (const order of editedOrders || []) {
            const orderDTO: UpdateClientOrderDTO = {
                id: order.id,
                clientId: order.clientId,
                productId: order.product?.id,
                organizationId: order.organizationId,
                quantity: order.quantity,
                orderDate: order.orderDate,
                estimatedDeliveryDate: order.estimatedDeliveryDate,
                deliveryDate: order.deliveryDate,
                companyId: order.companyId,
                status: order.status,
            };

            orderDTOs.push(orderDTO);
        }

        return orderDTOs;
    }

    // - Delete
    openConfirmDeleteDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteClientOrders() {
        this.clientOrderService
            .deleteClientOrdersInBulk(Array.from(this.selectedOrderIds))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Client deleted successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.isConfirmDialogOpen = false;
                    this.selectedOrderIds.clear();
                    this.loadClientOrders();
                },
                error: (error: Error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Client deletion failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error deleting client:', error);
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

    getClientName(clientId: number): string {
        const client = this.clients.find((s) => s.id === clientId);
        return client ? client.name : 'Unknown Client';
    }
}
