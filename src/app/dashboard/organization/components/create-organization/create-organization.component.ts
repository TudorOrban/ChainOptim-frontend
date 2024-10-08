import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CreateOrganizationDTO,
    SearchUserDTO,
} from '../../models/organization';
import { OrganizationService } from '../../services/organization.service';
import { UserService } from '../../../../core/user/services/user.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../../core/user/model/user';
import { PlanTier } from '../../models/SubscriptionPlan';

@Component({
    selector: 'app-create-organization',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule],
    templateUrl: './create-organization.component.html',
    styleUrl: './create-organization.component.css',
})
export class CreateOrganizationComponent {
    // Form elements
    name: string = '';
    address: string = '';
    contactInfo: string = '';
    planTier: PlanTier = PlanTier.NONE;
    currentUser: User | null = null;

    // Other
    searchUsername: string = '';
    searchResults: SearchUserDTO[] = [];
    selectedUsers: SearchUserDTO[] = [];

    // Icons
    faSearch = faSearch;
    faXmark = faXmark;
    faUser = faUser;

    constructor(
        private userService: UserService,
        private organizationService: OrganizationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((data) => {
            this.currentUser = data;

            if (!this.currentUser) {
                console.error('No current user found');
            }
            if (this.currentUser?.organization) {
                this.router.navigate(['/dashboard/organization']);
            }
        });
    }

    onSubmit() {
        if (this.currentUser?.id) {
            const newOrganization: CreateOrganizationDTO = {
                name: this.name,
                address: this.address,
                contactInfo: this.contactInfo,
                planTier: this.planTier,
                creatorId: this.currentUser?.id,
                createdUsers: [],
                existingUserIds: this.selectedUsers.map(user => user.id),
            };

            this.organizationService.createOrganization(newOrganization).subscribe({
                next: (organization) => {
                    this.router.navigate(['/dashboard/organization']);
                },
                error: (error) => {
                    console.log("An error occured while creating organization: ", error);
                }
            })
        }
    }

    // User searching and selection
    onSearch() {
        this.userService.searchUserByUsername(this.searchUsername).subscribe({
            next: (results) => {
                this.searchResults = results;
            },
            error: (error) => {
                console.log("An error occurred during the user search: ", error);
            }
        });
    }

    onSelectUser(user: SearchUserDTO) {
        // Add the selected user to the array (avoiding duplicates)
        if (!this.selectedUsers.map(user => user.id).includes(user.id)) {
            this.selectedUsers.push(user);
        }
    }

    onRemoveUser(removedUser: SearchUserDTO) {
        // Remove the selected user from the array
        this.selectedUsers = this.selectedUsers.filter((user) => user.id !== removedUser.id);
    }

}
