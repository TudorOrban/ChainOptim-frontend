import { Component, Input, OnInit } from '@angular/core';
import { PaginatedResults } from '../../../../shared/search/models/PaginatedResults';
import { SupplierOrder } from '../../models/SupplierOrder';
import { SupplierOrderService } from '../../services/supplierorder.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { SearchParams } from '../../../../shared/search/models/Search';
import { SearchMode } from '../../../../shared/enums/commonEnums';
import { TableToolbarComponent } from '../../../../shared/table/table-toolbar/table-toolbar.component';
import { User } from '../../../../core/user/model/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [CommonModule, TableToolbarComponent],
  templateUrl: './supplier-orders.component.html',
  styleUrl: './supplier-orders.component.css'
})
export class SupplierOrdersComponent implements OnInit {
    @Input() searchMode: SearchMode = SearchMode.ORGANIZATION;

    currentUser: User | undefined = undefined;
    supplierOrders: PaginatedResults<SupplierOrder> | undefined = undefined;
    searchParams: SearchParams = {
        searchQuery: "",
        sortOption: "createdAt",
        ascending: false,
        page: 1,
        itemsPerPage: 10,
    };
    sortOptions = [
        { label: 'Created At', value: 'createdAt' },
        { label: 'Updated At', value: 'updatedAt' },
    ];

    constructor(
        private userService: UserService,
        private supplierOrderService: SupplierOrderService
    ) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user?.organization) {
                console.error("User has no organization");
                return;
            }
            this.currentUser = user;
            
            this.loadSupplierOrders();
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


}
