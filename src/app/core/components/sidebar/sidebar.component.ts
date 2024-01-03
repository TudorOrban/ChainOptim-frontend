import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faBars, faBox, faBuilding, faCartShopping, faHouse, faSearch, faWarehouse } from '@fortawesome/free-solid-svg-icons';

type SidebarItem = {
    label: string;
    icon: IconDefinition;
    link?: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    isSidebarOpen = true;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    faHouse = faHouse;
    faBars = faBars;
    faSearch = faSearch;
    faBuilding = faBuilding;
    faBox = faBox;
    faCartShopping = faCartShopping;
    faWarehouse = faWarehouse;

    // Sidebar items
    sidebarItems: SidebarItem[] = [
        { label: 'Organization', icon: this.faBuilding, link: '/dashboard/organization' },
        { label: 'Products', icon: this.faBox },
        { label: 'Orders', icon: this.faCartShopping },
        { label: 'Warehouses', icon: this.faWarehouse },
    ];
}
