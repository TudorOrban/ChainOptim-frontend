import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { UIUtilService } from '../../../../shared/common/services/uiutil.service';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, UserAvatarComponent, GenericConfirmDialogComponent],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    currentUser: User | undefined = undefined;
    accessedUser: User | undefined = undefined;

    isEditing = false;
    
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Account',
        dialogMessage: 'Are you sure you want to delete this account? All associated data will be lost.',
    };
    isConfirmDialogOpen = false;

    faUser = faUser;
    faTrash = faTrash;
    faEdit = faEdit;

    uiUtilService: UIUtilService;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        uiUtilService: UIUtilService,
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
        this.isConfirmDialogOpen = true;
    }

    handleDeleteAccount(): void {
        console.log('Deleting account');
    }

    handleCancelDeletion(): void {
        this.isConfirmDialogOpen = false;
    }

    handleEditProfile(): void {
        this.isEditing = true;
        console.log('Editing profile');
    }
}
