import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductTab } from '../../production/models/Production';

@Injectable({
    providedIn: 'root',
})
export class ProductProductionTabsService {
    private tabs: ProductTab<any>[] = [];
    private activeTabId = new BehaviorSubject<string | null>(null);
    private idCounter = 0; 

    getTabs(): ProductTab<any>[] {
        return this.tabs;
    }
    
    getActiveTabId(): BehaviorSubject<string | null> {
        return this.activeTabId;
    }
    
    openTab(tab: ProductTab<any>): void {
        tab.id += `-${this.idCounter++}`;
        this.tabs.push(tab);
        this.setActiveTab(tab.id);
    }

    closeAnyTabWithTitle(title: string): void {
        console.log("Closing tab with title: ", title);
        const tabs = this.tabs.filter((t) => t.title === title);
        console.log("Tabs: ", tabs);
        tabs.forEach((t) => this.closeTab(t.id));
    }

    closeTab(id: string): void {
        const index = this.tabs.findIndex((t) => t.id === id);
        if (index !== -1) {
            this.tabs.splice(index, 1);
            this.activeTabId.next(this.tabs.length > 0 ? this.tabs[0].id : null);
        }
    }

    setActiveTab(id: string): void {
        const exists = this.tabs.some((t) => t.id === id);
        if (exists) {
            this.activeTabId.next(id);
        }
    }
}
