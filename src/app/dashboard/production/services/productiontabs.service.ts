import { Injectable } from '@angular/core';
import { Tab } from '../models/Production';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TabsService {
    private tabs: Tab<any>[] = [];
    private activeTabId = new BehaviorSubject<string | null>(null);
    private idCounter = 0; 

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