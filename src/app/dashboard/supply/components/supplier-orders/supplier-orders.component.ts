import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/PaginatedResults';
import { CreateSupplierOrderDTO, OrderStatus, SupplierOrder, UpdateSupplierOrderDTO } from '../../models/SupplierOrder';
import { SupplierOrderService } from '../../services/supplierorder.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { SearchParams } from '../../../../shared/search/models/Search';
import { SearchMode } from '../../../../shared/enums/commonEnums';
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

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableToolbarComponent, GenericConfirmDialogComponent],
  templateUrl: './supplier-orders.component.html',
  styleUrl: './supplier-orders.component.css'
})
export class SupplierOrdersComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;

    currentUser: User | undefined = undefined;
    supplierOrders: PaginatedResults<SupplierOrder> | undefined = undefined;
    suppliers: Supplier[] = [];
    components: ComponentSearchDTO[] = [];
    OrderStatus = OrderStatus;  

    searchParams: SearchParams = {
        searchQuery: "",
        sortOption: "createdAt",
        ascending: false,
        page: 1,
        itemsPerPage: 20,
    };
    selectedOrderIds = new Set<number>(); 
    newRawOrders: any[] = [];
    isEditing: boolean = false;
    selectedComponentId: {[orderId: number]: number | null} = {};

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Supplier",
        dialogMessage: "Are you sure you want to delete this supplier?",
    };
    isConfirmDialogOpen = false;
    
    sortOptions = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];

    constructor(
        private userService: UserService,
        private supplierOrderService: SupplierOrderService,
        private supplierService: SupplierService,
        private componentService: ComponentService,
        private toastService: ToastService,
    ) {
        
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
            
            this.loadSupplierOrders();
            this.loadSuppliers();
            this.loadComponents();
        });
    }

    private loadSupplierOrders(): void {
        this.supplierOrderService
            .getSupplierOrdersByOrganizationIdAdvanced(this.currentUser?.organization?.id || 0, this.searchParams, this.searchMode)
            .subscribe((supplierOrders) => {
                this.supplierOrders = supplierOrders;
                console.log("Supplier orders:", supplierOrders);
            });
    }

    private loadSuppliers(): void {
        this.supplierService.getSuppliersByOrganizationId(this.currentUser?.organization?.id || 0).subscribe((suppliers) => {
            console.log("Suppliers:", suppliers);
            this.suppliers = suppliers;
        });
    }

    private loadComponents(): void {
        this.componentService.getComponentsByOrganizationId(this.currentUser?.organization?.id || 0, true).subscribe((components) => {
            console.log("Components:", components);
            this.components = components;
        });
    }

    // Searching
    handleSearch(query: string): void {
        if (this.searchParams.searchQuery !== query) {
            this.searchParams.searchQuery = query;
            this.searchParams.page = 1;
            this.loadSupplierOrders();
        }
    }

    handleSortChange(sortChange: { value: string, ascending: boolean }): void {
        if (this.searchParams.sortOption !== sortChange.value || this.searchParams.ascending !== sortChange.ascending) {
            this.searchParams.sortOption = this.sortOptions.find((option) => option.value === sortChange.value)!.value;
            this.searchParams.ascending = sortChange.ascending;
            this.searchParams.page = 1; 
            this.loadSupplierOrders()
        }
    }

    changePage(page: number): void {
        if (this.searchParams.page !== page) {
            this.searchParams.page = page;
            this.loadSupplierOrders();
        }
    }

    handleRefresh(): void {
        this.loadSupplierOrders();
    }

    // CRUD ops
    // - Selection
    toggleSelection(order: SupplierOrder): void {
        if (this.selectedOrderIds.has(order.id)) {
            this.selectedOrderIds.delete(order.id);
        } else {
            this.selectedOrderIds.add(order.id);
        }
    }

    toggleAllSelections(event: any): void {
        const checked = event.target.checked;
        this.supplierOrders?.results.forEach(order => {
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
        if (this.supplierOrders && this.supplierOrders.results) {
            this.supplierOrders.results = this.supplierOrders.results.map(order => {
                return { ...order, selected: false, isEditing: false };
            });
        }
    }
    
    // Create
    handleAddOrder(): void {
        this.newRawOrders.push({
            supplierId: '',
            component: { id: 0, name: '' },
            quantity: 0,
            deliveredQuantity: 0,
            orderDate: new Date(),
            estimatedDeliveryDate: new Date(),
            deliveryDate: null,
            companyId: '',
            status: ''
        });
    }

    handleCreateOrders(): void {
        console.log('Creating order:', this.newRawOrders);
        const newOrderDTOs: CreateSupplierOrderDTO[] = [];

        for (const rawOrder of this.newRawOrders) {
            const newOrder = this.getValidOrderDTO(rawOrder);
            if (newOrder == null) {
                console.error('Validation failed for new order:', rawOrder);
                return;
            }
            newOrderDTOs.push(newOrder);
        }

        console.log('Creating orders:', newOrderDTOs);

        this.supplierOrderService.createSupplierOrdersInBulk(newOrderDTOs).subscribe({
            next: (orders) => {
                console.log('Created orders:', orders);
                this.newRawOrders = [];
                this.loadSupplierOrders();
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Supplier Order created successfully.', outcome: OperationOutcome.SUCCESS });
                
            },
            error: (err) => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Supplier Order creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Failed to create orders', err);
            }
        });

    }

    private getValidOrderDTO(order: any): CreateSupplierOrderDTO | null {
        // Check for required fields and basic validation
        if (!order.supplierId) {
            console.error('Validation failed, missing required order fields.');
            return null;
        }
    
        // Ensure dates are actual Date objects or valid date strings
        const orderDate = this.ensureValidDate(order.orderDate);
        const estimatedDeliveryDate = this.ensureValidDate(order.estimatedDeliveryDate);
        const deliveryDate = this.ensureValidDate(order.deliveryDate);
    
        if (!orderDate || !estimatedDeliveryDate || (order.deliveryDate && !deliveryDate)) {
            console.error('Validation failed, invalid date format.');
            return null;
        }
    
        // Construct DTO
        const dto: CreateSupplierOrderDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            supplierId: Number(order.supplierId),
            componentId: Number(order.componentId),
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
        this.supplierOrders?.results.forEach(order => {
            if (this.selectedOrderIds.has(order.id)) {
                order.isEditing = !order.isEditing;
                if (order.isEditing) {
                    this.selectedComponentId[order.id] = this.getComponentId(order); // Ensure the current component ID is set
                }
            }
        });
        this.isEditing = true;
    }

    getComponentId(order: SupplierOrder): number | null {
        return order.component ? order.component.id : null;
    }
    
    // Method to set component ID when changed
    setComponentId(order: SupplierOrder, newComponentId: number): void {
        if (!order.component && newComponentId !== null) {
            order.component = { id: newComponentId, name: '', createdAt: new Date(), updatedAt: new Date() }; // Initialize with a default or lookup name
        } else if (order.component) {
            order.component.id = newComponentId;
        }
    }

    saveEditedOrders(): void {
        const editedOrders = this.supplierOrders?.results.filter(order => order.isEditing);
        
        const editedOrderDTOs = this.getValidUpdateDTO(editedOrders || []);

        this.supplierOrderService.updateSupplierOrdersInBulk(editedOrderDTOs).subscribe({
            next: (orders) => {
                this.loadSupplierOrders();
                this.handleCancel();
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Supplier Order updated successfully.', outcome: OperationOutcome.SUCCESS });
            },
            error: (err) => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Supplier Order update failed.', outcome: OperationOutcome.ERROR });
                console.error('Failed to update orders', err);
            }
        });
    }

    private getValidUpdateDTO(editedOrders: SupplierOrder[]): UpdateSupplierOrderDTO[] {
        const orderDTOs: UpdateSupplierOrderDTO[] = [];    

        for (const order of editedOrders || []) {
            const orderDTO: UpdateSupplierOrderDTO = {
                id: order.id,
                supplierId: order.supplierId,
                componentId: order.component?.id,
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

    handleDeleteSupplierOrders() {
        this.supplierOrderService
            .deleteSupplierOrdersInBulk(Array.from(this.selectedOrderIds))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Supplier deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.isConfirmDialogOpen = false;
                    this.selectedOrderIds.clear();
                    this.loadSupplierOrders();
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Supplier deletion failed.', outcome: OperationOutcome.ERROR });
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
        const supplier = this.suppliers.find(s => s.id === supplierId);
        return supplier ? supplier.name : "Unknown Supplier";
    }
}
