import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/auth/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight, faGlobe, faMap } from '@fortawesome/free-solid-svg-icons';
import { MapComponent } from '../map/map.component';
import { User } from '../../../../core/user/model/user';
import { NotificationService } from '../../services/notification.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NotificationUser } from '../../types/notificationTypes';
import { CommonModule } from '@angular/common';
import { SearchParams } from '../../../../shared/search/models/Search';
import { PaginatedResults } from '../../../../shared/search/models/PaginatedResults';
import { SCSnapshotService } from '../../services/scsnapshot.service';
import { SupplyChainSnapshot } from '../../types/scSnapshotTypes';
import { UpcomingEventService } from '../../services/upcomingevent.service';
import { UpcomingEvent } from '../../types/upcomingEventTypes';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MapComponent, FontAwesomeModule, CommonModule, FormsModule],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.css',
})
export class DashboardComponent implements OnInit {
    currentUser: User | null = null;
    scSnapshot: SupplyChainSnapshot | undefined = undefined;
    results: PaginatedResults<NotificationUser> | undefined = undefined;
    events: UpcomingEvent[] = [];

    notificationsSearchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'createdAt',
        ascending: false,
        page: 1,
        itemsPerPage: 10,
        filters: {},
    };
    isNextPage: boolean = false;
    eventsSearchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'dateTime',
        ascending: false,
        page: 1,
        itemsPerPage: 10,
        filters: { "dateTimeStart": this.formatDateWithoutTimezone(new Date()) },
    };
    entityTypes: string[] = [
        'None', 'Supplier Order', 'Client Order', 'Supplier Shipment', 'Client Shipment'
    ];
    selectedEntityType: string = 'None';
    periods: string[] = [
        'Today', 'This Week', 'This Month', 'This Year'
    ];
    selectedPeriod: string = 'This Month';

    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
        private scSnapshotService: SCSnapshotService,
        private upcomingEventService: UpcomingEventService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }
    
    private async loadData(): Promise<void> {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUser = user;
                        this.loadNotifications(user?.id ?? "");

                        if (user.organization) {
                            this.loadSCSnapshot(user.organization.id);
                            this.loadUpcomingEvents(user.organization.id);
                        }
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(
                        error.message ?? ''
                    );
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private async loadNotifications(userId: string): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.notificationService
            .getNotificationsByUserIdAdvanced(userId, this.notificationsSearchParams)
            .subscribe({
                next: async (paginatedResults) => {
                    this.fallbackManagerService.updateLoading(false);
                    if (this.results) {
                        this.results.results.push(...paginatedResults.results);
                    } else {
                        this.results = paginatedResults;
                    }
                    this.isNextPage = paginatedResults.results.length + this.notificationsSearchParams.page * this.notificationsSearchParams.itemsPerPage < paginatedResults.totalCount;
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    loadNextPage(): void {
        if (this.isNextPage) {
            this.notificationsSearchParams.page++;
            this.loadNotifications(this.currentUser?.id ?? "");
        }
    }

    private async loadSCSnapshot(organizationId: number): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.scSnapshotService
            .getSCSnapshotByOrganizationId(organizationId)
            .subscribe({
                next: (snapshot) => {
                    this.fallbackManagerService.updateLoading(false);
                    this.scSnapshot = snapshot;
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(error.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private async loadUpcomingEvents(organizationId: number): Promise<void> {
        this.fallbackManagerService.updateLoading(true);

        this.upcomingEventService
            .getUpcomingEventsByOrganizationIdAdvanced(organizationId, this.eventsSearchParams)
            .subscribe({
                next: (events) => {
                    this.fallbackManagerService.updateLoading(false);
                    this.events = events;
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(error.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    onEntityTypeChange(): void {
        if (!this.eventsSearchParams.filters) {
            this.eventsSearchParams.filters = {};
        }
        if (this.selectedEntityType === 'None') {
            delete this.eventsSearchParams.filters["associatedEntityType"];
        } else {    
            this.eventsSearchParams.filters["associatedEntityType"] = this.selectedEntityType;
        }
        this.loadUpcomingEvents(this.currentUser?.organization?.id ?? 0);
    }

    onPeriodChange(): void {
        if (!this.eventsSearchParams.filters) {
            this.eventsSearchParams.filters = {};
        }
        let endDateTime = new Date();
        switch (this.selectedPeriod) {
            case 'Today':
                endDateTime.setDate(endDateTime.getDate() + 1);
                break;
            case 'This Week':
                endDateTime.setDate(endDateTime.getDate() + 7);
                break;
            case 'This Month':
                endDateTime.setMonth(endDateTime.getMonth() + 1);
                break;
            case 'This Year':
                endDateTime.setFullYear(endDateTime.getFullYear() + 1);
                break;
        }
        this.eventsSearchParams.filters["dateTimeEnd"] = this.formatDateWithoutTimezone(endDateTime);
        this.loadUpcomingEvents(this.currentUser?.organization?.id ?? 0);
    }

    refreshEvents(): void {
        this.loadUpcomingEvents(this.currentUser?.organization?.id ?? 0);
    }

    formatFriendlyDate(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions  = {
            month: 'short', 
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    formatDateWithoutTimezone(date: Date): string {
        const pad = (num: number) => (num < 10 ? '0' + num : num.toString());
        
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());
        const millisecond = date.getMilliseconds().toString().padStart(3, '0'); // Ensure milliseconds are three digits
    
        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
    }

    faGlobe = faGlobe;
    faMap = faMap;
    faArrowRotateRight = faArrowRotateRight;
}
