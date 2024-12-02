import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../../core/user/model/user';
import { CreateRouteDTO, Pair, ResourceTransportRoute, SelectLocationModeType, TransportedEntity, TransportedEntityType, TransportType } from '../../../../models/TransportRoute';
import { UserService } from '../../../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ToastService } from '../../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../../shared/common/components/toast-system/toastTypes';
import { ShipmentStatus } from '../../../../../supply/models/SupplierShipment';
import { SelectEnumComponent } from '../../../../../../shared/common/components/select/select-enum/select-enum.component';
import { TransportRouteService } from '../../../../services/transportroute.service';
import { ComponentSearchDTO } from '../../../../models/Component';
import { ProductSearchDTO } from "../../../../models/Product";
import { SelectProductComponent } from '../../../../../../shared/common/components/select/select-product/select-product.component';
import { SelectComponentComponent } from '../../../../../../shared/common/components/select/select-component/select-component.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Facility } from '../../../../../overview/types/supplyChainMapTypes';

@Component({
    selector: 'app-add-transport-route',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, FormsModule, SelectProductComponent, SelectComponentComponent, SelectEnumComponent],
    templateUrl: './add-transport-route.component.html',
    styleUrl: './add-transport-route.component.css',
})
export class AddTransportRouteComponent {
    @Input() facilities?: Facility[] = [];

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
    @Output() onRouteAdded = new EventEmitter<ResourceTransportRoute>();

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

    // - Current location
    isSelectCurrentLocationModeOn: boolean = false;
    isCurrentLocationSelected: boolean = false;
    confirmedCurrentLocation: Pair<number, number> | undefined = undefined;
    isCurrentLocationConfirmed: boolean = false;
    currentLocationLatitude: number | undefined = undefined;
    currentLocationLongitude: number | undefined = undefined;

    // - Component and Product selection
    transportedComponents: TransportedEntity[] = [];
    transportedProducts: TransportedEntity[] = [];

    // - Enum selections
    selectedTransportType: TransportType | undefined = undefined;
    selectedStatus: ShipmentStatus | undefined = undefined;

    SelectLocationModeType = SelectLocationModeType;
    ShipmentStatus = ShipmentStatus;
    TransportType = TransportType;

    faTimes = faTimes;

    constructor(
        private readonly fb: FormBuilder,
        private readonly userService: UserService,
        private readonly routeService: TransportRouteService,
        private readonly fallbackManagerService: FallbackManagerService,
        private readonly toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadData();
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
            srcFacility: this.fb.group({
                id: new FormControl(null),
                name: new FormControl(null),
                latitude: new FormControl(null),
                longitude: new FormControl(null),
                type: new FormControl(null),
            }),
            destFacility: this.fb.group({
                id: new FormControl(null),
                name: new FormControl(null),
                latitude: new FormControl(null),
                longitude: new FormControl(null),
                type: new FormControl(null),
            }),
            departureDateTime: new FormControl(null),
            arrivalDateTime: new FormControl(null),
            estimatedArrivalDateTime: new FormControl(null),
        });
    }

    private loadData() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.fallbackManagerService.updateLoading(false);

                if (!user?.organization) {
                    this.fallbackManagerService.updateNoOrganization(true);
                    return;
                }
                
                this.currentUser = user;
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
            this.handleSrcDestLocationClicked();
        }
        if (this.isSelectCurrentLocationModeOn) {
            this.handleCurrentLocationClicked(location);
        }
    }

    // - Src and Dest location handlers
    private handleSrcDestLocationClicked(): void {
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
    
    // - Components and Products
    handleComponentChange(component: ComponentSearchDTO): void {
        this.transportedComponents.push({
            entityId: component.id,
            entityName: component.name,
            entityType: TransportedEntityType.COMPONENT,
            quantity: 0
        });
    }

    handleRemoveTransportedComponent(componentId: number): void {
        this.transportedComponents = this.transportedComponents.filter((c) => c.entityId != componentId);
    }

    handleProductChange(product: ProductSearchDTO): void {
        this.transportedProducts.push({
            entityId: product.id,
            entityName: product.name,
            entityType: TransportedEntityType.PRODUCT,
            quantity: 0
        });
    }

    handleRemoveTransportedProduct(productId: number): void {
        this.transportedProducts = this.transportedProducts.filter((c) => c.entityId != productId);
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

        const routeDTO: CreateRouteDTO = {
            organizationId: this.currentUser?.organization?.id ?? 0,
            transportRoute: {
                srcLocation: this.confirmedSrcDestLocations[0],
                destLocation: this.confirmedSrcDestLocations[1],
                srcFacilityId: this.routeForm.get('srcFacility')?.get('id')?.value,
                srcFacilityName: this.routeForm.get('srcFacility')?.get('name')?.value,
                srcFacilityType: this.routeForm.get('srcFacility')?.get('type')?.value,
                destFacilityId: this.routeForm.get('destFacility')?.get('id')?.value,
                destFacilityName: this.routeForm.get('destFacility')?.get('name')?.value,
                destFacilityType: this.routeForm.get('destFacility')?.get('type')?.value,
                waypoints: [],
                liveLocation: this.confirmedCurrentLocation,
                departureDateTime: this.formatDate(this.routeForm.get('departureDateTime')?.value),
                arrivalDateTime: this.formatDate(this.routeForm.get('arrivalDateTime')?.value),
                estimatedArrivalDateTime: this.formatDate(this.routeForm.get('estimatedArrivalDateTime')?.value),
                transportedEntities: [...this.transportedComponents, ...this.transportedProducts],
                status: this.selectedStatus ?? ShipmentStatus.PLANNED,
                transportType: this.selectedTransportType ?? TransportType.ROAD,
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

    // Utils
    sortFacilitiesByCloseness(location?: Pair<number, number>) {
        if (!location) return this.facilities;
        return this.facilities?.sort((a, b) => {
            const aDistance = this.calculateDistance(location, { first: a.latitude, second: a.longitude });
            const bDistance = this.calculateDistance(location, { first: b.latitude, second: b.longitude });
            return aDistance - bDistance;
        });
    }

    calculateDistance(location1: Pair<number, number>, location2: Pair<number, number>): number {
        const lat1 = location1.first;
        const lon1 = location1.second;
        const lat2 = location2.first;
        const lon2 = location2.second;

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in
    }

    formatDate(dateStr: string | null): Date {
        if (!dateStr) return new Date();
        return new Date(`${dateStr}T00:00`);
    }
      
}
