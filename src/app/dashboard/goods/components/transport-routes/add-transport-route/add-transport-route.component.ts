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
import { TransportRouteService } from '../../../services/transportroute.service';

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

    @Output() onSelectCurrentLocationModeChanged = new EventEmitter<boolean>();
    @Output() onDrawCurrentLocation = new EventEmitter<Pair<number, number>>();
    @Output() onConfirmCurrentLocation = new EventEmitter<Pair<number, number>>();
    @Output() onCancelCurrentLocation = new EventEmitter<void>();
    @Output() onCancelConfirmedCurrentLocation = new EventEmitter<void>();

    // State
    // - Base
    currentUser: User | undefined = undefined;
    routeForm: FormGroup = new FormGroup({});

    clickedLocations: Pair<number, number>[] = [];

    // - Src and dest locations
    isSelectSrcDestLocationModeOn: boolean = false;
    areSrcDestLocationsSelected: boolean = false;
    confirmedSrcDestLocations: Pair<number, number>[] = [];
    areSrcDestLocationsConfirmed: boolean = false;
    sourceLocationLatitude: number | undefined = undefined;
    sourceLocationLongitude: number | undefined = undefined;
    destLocationLatitude: number | undefined = undefined;
    destLocationLongitude: number | undefined = undefined;

    // - Current location
    isSelectCurrentLocationModeOn: boolean = false;
    isCurrentLocationSelected: boolean = false;
    confirmedCurrentLocation: Pair<number, number> | undefined = undefined;
    isCurrentLocationConfirmed: boolean = false;
    currentLocationLatitude: number | undefined = undefined;
    currentLocationLongitude: number | undefined = undefined;

    // - Enum selections
    selectedTransportType: TransportType | undefined = undefined;
    selectedStatus: ShipmentStatus | undefined = undefined;

    SelectLocationModeType = SelectLocationModeType;
    ShipmentStatus = ShipmentStatus;
    TransportType = TransportType;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private routeService: TransportRouteService,
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
            currentLocationLatitude: new FormControl(null),
            currentLocationLongitude: new FormControl(null),
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

    // Handlers
    onLocationClicked(location: Pair<number, number>): void {
        this.clickedLocations.push(location);

        if (this.isSelectSrcDestLocationModeOn) {
            this.handleSrcDestLocationClicked(location);
        }
        if (this.isSelectCurrentLocationModeOn) {
            this.handleCurrentLocationClicked(location);
        }
    }

    // - Src and Dest location handlers
    private handleSrcDestLocationClicked(location: Pair<number, number>): void {
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
            this.areSrcDestLocationsSelected = true;
        }
    }

    handleToggleSelectSrcDestLocationMode(): void {
        this.isSelectSrcDestLocationModeOn = !this.isSelectSrcDestLocationModeOn;
        if (this.isSelectSrcDestLocationModeOn && this.isSelectCurrentLocationModeOn) {
            this.handleToggleSelectCurrentLocationMode();
        }

        this.clickedLocations = [];
        if (this.confirmedSrcDestLocations.length != 2) {
            this.handleResetSrcDestFormLocations();
        }

        this.areSrcDestLocationsSelected = !this.isSelectSrcDestLocationModeOn ? false : this.areSrcDestLocationsSelected;
        this.onSelectLocationModeChanged.emit(this.isSelectSrcDestLocationModeOn);
    }

    // Current location handlers
    private handleCurrentLocationClicked(location: Pair<number, number>): void {
        this.routeForm.controls['currentLocationLatitude'].setValue(location.first);
        this.routeForm.controls['currentLocationLongitude'].setValue(location.second);
        this.confirmedCurrentLocation = location;
        this.isCurrentLocationSelected = true;
    }
    
    handleToggleSelectCurrentLocationMode(): void {
        this.isSelectCurrentLocationModeOn = !this.isSelectCurrentLocationModeOn;
        if (this.isSelectCurrentLocationModeOn && this.isSelectSrcDestLocationModeOn) {
            this.handleToggleSelectSrcDestLocationMode();
        }

        this.clickedLocations = [];
        if (!this.confirmedCurrentLocation) {
            this.handleResetCurrentLocationForm();
        }

        this.isCurrentLocationSelected = !this.isSelectCurrentLocationModeOn ? false : this.isCurrentLocationSelected;
        this.onSelectCurrentLocationModeChanged.emit(this.isSelectCurrentLocationModeOn);
    }

    // Internal handlers
    // - Src and dest locations
    handleConfirmRouteSrcDestLocations(): void {
        const selectedLocations = this.clickedLocations.length;
        this.confirmedSrcDestLocations.push(
            this.clickedLocations[selectedLocations - 2],
            this.clickedLocations[selectedLocations - 1]
        );
        this.areSrcDestLocationsConfirmed = true;
        this.onConfirmSelectedLocations.emit(this.confirmedSrcDestLocations);
        this.handleToggleSelectSrcDestLocationMode();
    }

    handleCancelRouteSrcDestLocations(): void {
        this.handleResetSrcDestFormLocations();
        this.areSrcDestLocationsSelected = false;
        this.onCancelSelectedLocations.emit();
    }

    handleCancelConfirmedSrcDestLocations(): void {
        this.handleResetSrcDestFormLocations();
        this.confirmedSrcDestLocations = [];
        this.areSrcDestLocationsConfirmed = false;
        this.onCancelConfirmedLocations.emit();
    }

    handleResetSrcDestFormLocations(): void {
        this.routeForm.patchValue({
            sourceLocationLatitude: null,
            sourceLocationLongitude: null,
            destLocationLatitude: null,
            destLocationLongitude: null
        });
    }

    // - Current location
    handleConfirmCurrentLocation(): void {
        this.isCurrentLocationConfirmed = true;
        this.confirmedCurrentLocation = this.clickedLocations?.[this.clickedLocations?.length - 1];
        this.onConfirmCurrentLocation.emit(this.confirmedCurrentLocation);
        this.handleToggleSelectCurrentLocationMode();
    }

    handleCancelCurrentLocation(): void {
        this.handleResetCurrentLocationForm();
        this.isCurrentLocationSelected = false;
        this.onCancelCurrentLocation.emit();
    }

    handleCancelConfirmedCurrentLocation(): void {
        this.handleResetCurrentLocationForm();
        this.confirmedCurrentLocation = undefined;
        this.isCurrentLocationConfirmed = false;
        this.onCancelConfirmedCurrentLocation.emit();
    }

    handleResetCurrentLocationForm(): void {
        this.routeForm.patchValue({
            currentLocationLatitude: null,
            currentLocationLongitude: null
        });
    }

    // Enums
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
        this.routeService
            .createRoute(routeDTO)
            .subscribe(
                (route) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Product route created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onRouteAdded.emit(route);
                },
                (error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Product route creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error creating product route:', error);
                }
            );
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
                departureDateTime: this.formatDate(this.routeForm.get('departureDateTime')?.value),
                arrivalDateTime: this.formatDate(this.routeForm.get('arrivalDateTime')?.value),
                estimatedArrivalDateTime: this.formatDate(this.routeForm.get('estimatedArrivalDateTime')?.value),
                srcLocation: this.confirmedSrcDestLocations[0],
                destLocation: this.confirmedSrcDestLocations[1]
            },
            companyId: this.routeForm.get('companyId')?.value,
        };

        return routeDTO;
    }

    private isRouteDTOValid(): boolean {
        if (this.confirmedSrcDestLocations?.length != 2 || !this.confirmedSrcDestLocations[0].first || !this.confirmedSrcDestLocations[0].second || !this.confirmedSrcDestLocations[1].first || !this.confirmedSrcDestLocations[1].second) {
            return false;
        }
        if (this.selectedStatus == undefined || this.selectedTransportType == undefined) {
            return false;
        }
        return true;
    }

    formatDate(dateStr: string | null): Date {
        if (!dateStr) return new Date();
        return new Date(`${dateStr}T00:00`);
    }
      
}
