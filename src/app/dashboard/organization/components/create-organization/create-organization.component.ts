import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CreateOrganizationDTO,
    SearchUserDTO,
    SubscriptionPlan,
    User,
} from '../../models/organization';
import { OrganizationService } from '../../services/OrganizationService';
import { UserService } from '../../../../core/services/UserService';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

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
    subscriptionPlan: SubscriptionPlan = 'NONE';
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
        });
    }

    onSubmit() {
        if (this.currentUser?.id) {
            const newOrganization: CreateOrganizationDTO = {
                name: this.name,
                address: this.address,
                contactInfo: this.contactInfo,
                subscriptionPlan: this.subscriptionPlan,
                creatorId: this.currentUser?.id,
                createdUsers: [],
                existingUserIds: this.selectedUsers.map(user => user.id),
            };
            console.log("EWQEQ", newOrganization);

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
