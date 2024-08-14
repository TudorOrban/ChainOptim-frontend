import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    IconDefinition,
    faBars,
    faBox,
    faBuilding,
    faCaretDown,
    faCaretUp,
    faCartShopping,
    faGear,
    faGlobe,
    faHouse,
    faIndustry,
    faQuestion,
    faSearch,
    faTruckArrowRight,
    faUniversalAccess,
    faWarehouse,
} from '@fortawesome/free-solid-svg-icons';

type SidebarItem = {
    label: string;
    icon?: IconDefinition;
    link?: string;
    isExpanded?: boolean;
    isSelected?: boolean;
    subItems?: SidebarItem[];
};

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    isSidebarOpen = true;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    faGlobe = faGlobe;
    faHouse = faHouse;
    faBars = faBars;
    faSearch = faSearch;
    faBuilding = faBuilding;
    faBox = faBox;
    faCartShopping = faCartShopping;
    faIndustry = faIndustry;
    faWarehouse = faWarehouse;
    faTruckArrowRight = faTruckArrowRight;
    faUniversalAccess = faUniversalAccess;
    faGear = faGear;

    // Sidebar items
    sidebarItems: SidebarItem[] = [
        { label: 'Overview', icon: this.faGlobe, link: '/dashboard' },
        {
            label: 'Organization',
            icon: this.faBuilding,
            link: '/dashboard/organization',
        },
        { label: 'Goods', icon: this.faBox, link: '/dashboard/products',
            subItems: [
                { label: 'Products', link: '/dashboard/products' },
                { label: 'Components', link: '/dashboard/components' },
                { label: 'Transport Routes', link: '/dashboard/transport-routes' },
            ]
        },
        { label: 'Supply', icon: this.faTruckArrowRight, link: '/dashboard/suppliers',
            subItems: [
                { label: 'Suppliers', link: '/dashboard/suppliers' },
                { label: 'Supplier Orders', link: '/dashboard/supplier-orders' },
                { label: 'Supplier Shipments', link: '/dashboard/supplier-shipments' },
                { label: 'Performances', link: '/dashboard/supplier-performances' },
            ]
        },
        { label: 'Production', icon: this.faIndustry, link: '/dashboard/factories',
            subItems: [
                { label: 'Factories', link: '/dashboard/factories' },
                { label: 'Factory Inventory', link: '/dashboard/factory-inventory' },
                { label: 'Performances', link: '/dashboard/factory-performances' },
            ]
        },
        { label: 'Storage', icon: this.faWarehouse, link: '/dashboard/warehouses',
            subItems: [
                { label: 'Warehouses', link: '/dashboard/warehouses' },
                { label: 'Warehouse Inventory', link: '/dashboard/warehouse-inventory' },
                { label: 'Evaluations', link: '/dashboard/warehouse-evaluations' },
            ]
        },
        
        { label: 'Demand', icon: this.faUniversalAccess, link: '/dashboard/clients',
            subItems: [
                { label: 'Clients', link: '/dashboard/clients' },
                { label: 'Client Orders', link: '/dashboard/client-orders' },
                { label: 'Client Shipments', link: '/dashboard/client-shipments' },
                { label: 'Performances', link: '/dashboard/client-performances' },
            ]
        },
        { label: 'Settings', icon: this.faGear, link: '/dashboard/settings' },
    ];

    expandItem(item: SidebarItem): void {
        console.log("Expanding: ", item);
        item.isExpanded = !item.isExpanded;
        if (!item.subItems) {
            return;
        }
        this.selectItem(item.subItems[0]);
    }
    
    selectItem(item: SidebarItem): void {
        console.log("Selecting: ", item);
        item.isSelected = true;

        for (let otherItem of this.sidebarItems) {
            if (otherItem.label !== item.label) {
                otherItem.isSelected = false;
            }
            if (!otherItem.subItems) {
                continue;
            }
            for (let subItem of otherItem.subItems) {
                if (subItem.label !== item.label) {
                    subItem.isSelected = false;
                }
            }
        }
    }

    faCaretDown = faCaretDown;
    faCaretUp = faCaretUp;
    faQuestion = faQuestion;
}
