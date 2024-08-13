import { ComponentRef, Injectable } from '@angular/core';
import { FactoryProductionTabType, Tab } from '../models/Production';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FactoryProductionTabsService {
    private tabs: Tab<any>[] = [];
    private activeTabId = new BehaviorSubject<string | null>(null);
    private idCounter = 0; 
    private componentRefs = new Map<string, ComponentRef<FactoryProductionTabType>>();

    getTabs(): Tab<any>[] {
        return this.tabs;
    }
    
    getActiveTabId(): BehaviorSubject<string | null> {
        return this.activeTabId;
    }
    
    openTab(tab: Tab<any>): void {
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
    
    getComponentRef(id: string): ComponentRef<FactoryProductionTabType> | undefined {
        return this.componentRefs.get(id);
    }

    saveComponentRef(id: string, ref: ComponentRef<FactoryProductionTabType>): void {
        this.componentRefs.set(id, ref);
    }
}
