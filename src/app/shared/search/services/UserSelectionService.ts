import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserSelectionService {
    selectedUserIds: string[] = [];

    onSelectUser(userId: string): void {
        if (!this.selectedUserIds.includes(userId)) {
            this.selectedUserIds.push(userId);
        }
    }

    onDeselectUser(userId: string): void {
        this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    }

    getSelectedUserIds(): string[] {
        return this.selectedUserIds;
    }
}