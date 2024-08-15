import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/user/model/user';
import { CreateRouteDTO, Pair, ResourceTransportRoute, SelectLocationModeType } from '../../../models/TransportRoute';
import { TransportRouteService } from '../../../services/transportroute.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ToastService } from '../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../shared/common/components/toast-system/toastTypes';

@Component({
    selector: 'app-add-transport-route',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-transport-route.component.html',
    styleUrl: './add-transport-route.component.css',
})
export class AddTransportRouteComponent {
    @Input() inputData: { productId: number } | undefined = undefined;

    @Output() onRouteAdded = new EventEmitter<ResourceTransportRoute>();
    @Output() onSelectLocationModeChanged = new EventEmitter<SelectLocationModeType>;
    @Output() onDrawRoute = new EventEmitter<Pair<number, number>[]>();

    currentUser: User | undefined = undefined;
    routeForm: FormGroup = new FormGroup({});
    clickedLocations: Pair<number, number>[] = [];
    selectLocationModeType: SelectLocationModeType | undefined = undefined; // Undefined means select location mode is off

    SelectLocationModeType = SelectLocationModeType;

    constructor(
        private fb: FormBuilder,
        private routeService: TransportRouteService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadCurrentUser();
    }

    private initializeForm() {
        this.routeForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            companyId: ['', [Validators.maxLength(200)]]
        });
    }

    private loadCurrentUser() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (user) {
                    this.currentUser = user;
                }
                this.fallbackManagerService.updateLoading(false);
            },
            error: (error: Error) => {
                this.fallbackManagerService.updateError(error.message ?? '');
                this.fallbackManagerService.updateLoading(false);
            },
        });
    }


    // Communication with parent component
    onLocationClicked(location: Pair<number, number>): void {
        this.clickedLocations.push(location);
        console.log('Clicked locations:', this.clickedLocations);
        console.log('Selection type: ', this.selectLocationModeType);

        if (this.selectLocationModeType === SelectLocationModeType.SOURCE) {
            console.log("Handling source selection");
            const selectedLocations = this.clickedLocations.length;
            if (selectedLocations >= 2) {
                console.log("Handling draw route");
                this.onDrawRoute.emit([
                    this.clickedLocations[selectedLocations - 2],
                    this.clickedLocations[selectedLocations - 1]
                ]);
            }
            
        }
    }

    handleToggleSelectLocationMode(type: SelectLocationModeType): void {
        this.selectLocationModeType = type;
        this.onSelectLocationModeChanged.emit(type);
    }

    // Form
    hasError(controlName: string, errorName: string): boolean {
        const control = this.routeForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error('Missing user');
            return;
        }
        const isFormInvalid = this.isFormInvalid();
        if (isFormInvalid) {
            this.toastService.addToast({
                id: 123,
                title: 'Error',
                message: 'Some of the inputs are not valid.',
                outcome: OperationOutcome.ERROR,
            });
            return;
        }

        const routeDTO = this.getRouteDTO();

        // this.routeService
        //     .createRoute(routeDTO, true)
        //     .subscribe(
        //         (route) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Success',
        //                 message: 'Product route created successfully.',
        //                 outcome: OperationOutcome.SUCCESS,
        //             });
        //             this.onRouteAdded.emit(route);
        //         },
        //         (error) => {
        //             this.toastService.addToast({
        //                 id: 123,
        //                 title: 'Error',
        //                 message: 'Product route creation failed.',
        //                 outcome: OperationOutcome.ERROR,
        //             });
        //             console.error('Error creating product route:', error);
        //         }
        //     );
    }

    private isFormInvalid(): boolean {
        return this.routeForm.invalid;
    }

    private getRouteDTO(): CreateRouteDTO {
        if (!this.inputData?.productId) {
            throw new Error('Missing product ID');
        }

        const routeDTO: CreateRouteDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            transportRoute: this.routeForm.get('name')?.value,
            companyId: this.routeForm.get('companyId')?.value,
        };

        return routeDTO;
    }
}
