import { Component, EventEmitter, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/user/model/user';
import { CreateRouteDTO, Pair, ResourceTransportRoute, SelectLocationModeType, TransportType } from '../../../models/TransportRoute';
import { UserService } from '../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ToastService } from '../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../shared/common/components/toast-system/toastTypes';
import { ShipmentStatus } from '../../../../supply/models/SupplierShipment';
import { SelectEnumComponent } from '../../../../../shared/common/components/select/select-enum/select-enum.component';

@Component({
    selector: 'app-add-transport-route',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectEnumComponent],
    templateUrl: './add-transport-route.component.html',
    styleUrl: './add-transport-route.component.css',
})
export class AddTransportRouteComponent {
    @Output() onRouteAdded = new EventEmitter<ResourceTransportRoute>();
    @Output() onSelectLocationModeChanged = new EventEmitter<boolean>();
    @Output() onDrawRoute = new EventEmitter<Pair<number, number>[]>();
    @Output() onConfirmSelectedLocations = new EventEmitter<Pair<number, number>[]>();
    @Output() onCancelSelectedLocations = new EventEmitter<void>();
    @Output() onCancelConfirmedLocations = new EventEmitter<void>();

    currentUser: User | undefined = undefined;
    routeForm: FormGroup = new FormGroup({});

    clickedLocations: Pair<number, number>[] = [];
    isSelectLocationModeOn: boolean = false;
    areLocationsSelected: boolean = false;
    confirmedLocations: Pair<number, number>[] = [];
    areLocationsConfirmed: boolean = false;
    sourceLocationLatitude: number | undefined = undefined;
    sourceLocationLongitude: number | undefined = undefined;
    destLocationLatitude: number | undefined = undefined;
    destLocationLongitude: number | undefined = undefined;
    isSelectCurrentLocationModeOn: boolean = false;
    currentLocationLatitude: number | undefined = undefined;
    currentLocationLongitude: number | undefined = undefined;

    selectedTransportType: TransportType | undefined = undefined;
    selectedStatus: ShipmentStatus | undefined = undefined;

    SelectLocationModeType = SelectLocationModeType;
    ShipmentStatus = ShipmentStatus;
    TransportType = TransportType;

    constructor(
        private fb: FormBuilder,
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
            companyId: ['', [Validators.maxLength(200)]],
            sourceLocationLatitude: new FormControl(null),
            sourceLocationLongitude: new FormControl(null),
            destLocationLatitude: new FormControl(null),
            destLocationLongitude: new FormControl(null),
            departureDateTime: new FormControl(null),
            arrivalDateTime: new FormControl(null),
            estimatedArrivalDateTime: new FormControl(null),
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

        if (this.isSelectLocationModeOn) {
            const selectedLocations = this.clickedLocations.length;

            if (selectedLocations == 1) {
                this.routeForm.controls['sourceLocationLatitude'].setValue(this.clickedLocations[0].first);
                this.routeForm.controls['sourceLocationLongitude'].setValue(this.clickedLocations[0].second);
            }
            if (selectedLocations >= 2) {
                this.routeForm.controls['sourceLocationLatitude'].setValue(this.clickedLocations[selectedLocations - 2].first);
                this.routeForm.controls['sourceLocationLongitude'].setValue(this.clickedLocations[selectedLocations - 2].second);
                this.routeForm.controls['destLocationLatitude'].setValue(this.clickedLocations[selectedLocations - 1].first);
                this.routeForm.controls['destLocationLongitude'].setValue(this.clickedLocations[selectedLocations - 1].second);
    
                this.onDrawRoute.emit([
                    this.clickedLocations[selectedLocations - 2],
                    this.clickedLocations[selectedLocations - 1]
                ]);
                this.areLocationsSelected = true;
            }
            
        }
    }

    handleToggleSelectLocationMode(): void {
        this.isSelectLocationModeOn = !this.isSelectLocationModeOn;
        this.clickedLocations = [];
        if (this.confirmedLocations.length != 2) {
            this.routeForm.patchValue({
                sourceLocationLatitude: null,
                sourceLocationLongitude: null,
                destLocationLatitude: null,
                destLocationLongitude: null
            });
        }
        this.areLocationsSelected = !this.isSelectLocationModeOn ? false : this.areLocationsSelected;
        console.log("Select location mode: ", this.isSelectLocationModeOn);
        this.onSelectLocationModeChanged.emit(this.isSelectLocationModeOn);
    }

    // Internal handlers
    handleConfirmRouteLocations(): void {
        const selectedLocations = this.clickedLocations.length;
        this.confirmedLocations.push(
            this.clickedLocations[selectedLocations - 2],
            this.clickedLocations[selectedLocations - 1]
        );
        this.areLocationsConfirmed = true;
        this.onConfirmSelectedLocations.emit(this.confirmedLocations);
        this.handleToggleSelectLocationMode();
    }

    handleCancelRouteLocations(): void {
        this.areLocationsSelected = false;
        this.onCancelSelectedLocations.emit();
    }

    handleCancelConfirmedLocations(): void {
        this.routeForm.patchValue({
            sourceLocationLatitude: null,
            sourceLocationLongitude: null,
            destLocationLatitude: null,
            destLocationLongitude: null
        });
        this.confirmedLocations = [];
        this.areLocationsConfirmed = false;
        this.onCancelConfirmedLocations.emit();
    }

    onTransportTypeSelectionChanged(selectedValue: string) {
        console.log("Selected value for tr type: ", selectedValue);
        this.selectedTransportType = selectedValue as TransportType;
    }

    onStatusSelectionChanged(selectedValue: string) {
        console.log("Selected value for status: ", selectedValue);
        this.selectedStatus = selectedValue as ShipmentStatus;
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
        console.log("Route DTO: ", routeDTO);
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
        if (!this.isRouteDTOValid()) {
            console.log("Route invalid");
            throw new Error('Route DTO is not valid');
        }

        console.log("Route valid");
        const routeDTO: CreateRouteDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            transportRoute: {
                status: this.selectedStatus ?? ShipmentStatus.PLANNED,
                transportType: this.selectedTransportType ?? TransportType.ROAD,
                departureDateTime: this.routeForm.get('departureDateTime')?.value,
                arrivalDateTime: this.routeForm.get('arrivalDateTime')?.value,
                estimatedArrivalDateTime: this.routeForm.get('estimatedArrivalDateTime')?.value,
                srcLocation: this.confirmedLocations[0],
                destLocation: this.confirmedLocations[1]
            },
            companyId: this.routeForm.get('companyId')?.value,
        };

        return routeDTO;
    }

    private isRouteDTOValid(): boolean {
        if (this.confirmedLocations?.length != 2 || !this.confirmedLocations[0].first || !this.confirmedLocations[0].second || !this.confirmedLocations[1].first || !this.confirmedLocations[1].second) {
            return false;
        }
        if (this.selectedStatus == undefined || this.selectedTransportType == undefined) {
            return false;
        }
        return true;
    }
}
