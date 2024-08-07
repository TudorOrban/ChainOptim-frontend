import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/auth/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faMap } from '@fortawesome/free-solid-svg-icons';
import { MapComponent } from '../map/map.component';
import { User } from '../../../../core/user/model/user';
import { NotificationService } from '../../services/notification.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NotificationUser } from '../../types/notificationTypes';
import { CommonModule } from '@angular/common';
import { SearchParams } from '../../../../shared/search/models/Search';
import { PaginatedResults } from '../../../../shared/search/models/PaginatedResults';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MapComponent, FontAwesomeModule, CommonModule],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.css',
})
export class DashboardComponent implements OnInit {
    currentUser: User | null = null;
    results: PaginatedResults<NotificationUser> | undefined = undefined;
    searchParams: SearchParams = {
        searchQuery: '',
        sortOption: 'createdAt',
        ascending: false,
        page: 1,
        itemsPerPage: 10,
    };
    isNextPage: boolean = false;

    constructor(
        private userService: UserService,
        private notificationService: NotificationService,
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
            .getNotificationsByUserIdAdvanced(userId, this.searchParams)
            .subscribe({
                next: async (paginatedResults) => {
                    this.fallbackManagerService.updateLoading(false);
                    this.results = paginatedResults;
                    this.isNextPage = paginatedResults.results.length + this.searchParams.page * this.searchParams.itemsPerPage < paginatedResults.totalCount;
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    loadNextPage(): void {
        this.searchParams.page++;
        this.loadNotifications(this.currentUser?.id ?? "");
    }

    faGlobe = faGlobe;
    faMap = faMap;
}
