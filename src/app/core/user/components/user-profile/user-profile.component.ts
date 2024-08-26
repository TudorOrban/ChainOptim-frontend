import { Component, OnInit } from '@angular/core';
import { UpdateUserProfileDTO, User } from '../../model/user';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSave, faTimes, faTrash, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { UIUtilService } from '../../../../shared/common/services/uiutil.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, FontAwesomeModule, UserAvatarComponent, GenericConfirmDialogComponent],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    currentUser: User | undefined = undefined;
    accessedUser: User | undefined = undefined;
    updatedUser: User = {
        id: "",
        username: "",
        role: "NONE",
        email: "",
        isProfilePublic: false,
    };

    isEditing = false;
    
    deleteAccountDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Account',
        dialogMessage: 'Are you sure you want to delete this account? All associated data will be lost.',
    };
    isDeleteAccountConfirmDialogOpen = false;
    exitOrganizationDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Exit Organization',
        dialogMessage: 'Are you sure you want to exit this organization? You will lose access to all organization resources.',
    };
    isExitOrganizationConfirmDialogOpen = false;

    faUser = faUser;
    faTrash = faTrash;
    faEdit = faEdit;
    faXmark = faXmark;
    faSave = faSave;
    faTimes = faTimes;

    uiUtilService: UIUtilService;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        uiUtilService: UIUtilService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.uiUtilService = uiUtilService;
    }

    ngOnInit(): void {
        this.loadAccessedUser();
        this.loadCurrentUser();
    }

    private async loadCurrentUser(): Promise<void> {
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    private async loadAccessedUser(): Promise<void> {
        this.route.paramMap.subscribe(params => {
            const username = params.get('username');
            if (!username) {
                console.error('No username provided');
                return;
            }

            this.userService.getUserByUsername(username).subscribe(user => {
                if (!user) {
                    console.error('User not found');
                    return;
                }
                this.accessedUser = user;
            });
        });
        
    }

    // Handlers
    handleDisplayConfirmDeleteDialog(): void {
        this.isDeleteAccountConfirmDialogOpen = true;
    }

    handleDeleteAccount(): void {
        console.log('Deleting account');
    }

    handleCancelDeletion(): void {
        this.isDeleteAccountConfirmDialogOpen = false;
    }

    handleEditProfile(): void {
        if (this.isEditing) {
            return;
        }

        if (!this.accessedUser || !this.currentUser || this.accessedUser.id !== this.currentUser.id) {
            console.error('User does not have permission to edit this profile');
            return;
        }
        
        this.isEditing = true;
        this.updatedUser = { ...this.accessedUser };
    }

    handleSaveProfile(): void {
        const updateUserDTO = this.getUpdateUserDTO(); // TODO: Add validation
        console.log('Updating profile', updateUserDTO);
        
        this.userService.updateUser(updateUserDTO).subscribe({
            next: user => {
                console.log('Profile updated', user);
                this.toastService.addToast({
                    id: 0,
                    title: 'Profile Updated',
                    message: 'Your profile has been successfully updated',
                    outcome: OperationOutcome.SUCCESS,
                });

                if (this.updatedUser.username !== this.accessedUser?.username) {
                    this.authService.logout();
                    this.router.navigate([`login`]); // Prompt user to login again to refresh JWT token
                    return;
                }
                
                this.isEditing = false;
                this.accessedUser = user;
            },
            error: error => {
                console.error('Error updating profile', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error Updating Profile',
                    message: 'There was an error updating your profile',
                    outcome: OperationOutcome.ERROR,
                });
            }
        });
    }

    handleCancelEditProfile(): void {
        this.isEditing = false;
        if (this.accessedUser) {
            this.updatedUser = { ...this.accessedUser };   
        }
    }

    handleOpenExitOrganizationConfirmDialog(): void {
        this.isExitOrganizationConfirmDialogOpen = true;
    }

    handleConfirmExitOrganization(): void {
        console.log('Confirming exit organization');
    }

    handleCancelExitOrganization(): void {
        this.isExitOrganizationConfirmDialogOpen = false;
    }

    private getUpdateUserDTO(): UpdateUserProfileDTO {
        return {
            id: this.updatedUser.id,
            username: this.updatedUser.username,
            fullName: this.updatedUser?.fullName,
            email: this.updatedUser.email,
            phone: this.updatedUser?.phone,
            imageUrl: this.updatedUser?.imageUrl,
            isProfilePublic: this.updatedUser?.isProfilePublic,
        };
    }
}
