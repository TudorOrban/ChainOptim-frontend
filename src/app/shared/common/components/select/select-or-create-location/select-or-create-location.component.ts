import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { CreateLocationDTO, Location } from '../../../models/reusableTypes';
import { User } from '../../../../../core/user/model/user';

@Component({
  selector: 'app-select-or-create-location',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './select-or-create-location.component.html',
  styleUrl: './select-or-create-location.component.css'
})
export class SelectOrCreateLocationComponent implements OnInit, OnChanges {
    @Input() initialLocationData: Location | undefined = undefined;
    @Output() locationChoiceChange = new EventEmitter<string>();
    @Output() selectedLocationChange = new EventEmitter<number>();
    @Output() newLocationData = new EventEmitter<CreateLocationDTO>();
    @Output() isFormValid = new EventEmitter<boolean>();

    locationChoice: string = '';
    selectedLocationId: number = 0;

    locations: Location[] = [];
    locationForm: FormGroup = new FormGroup({});
    currentUser: User | undefined = undefined;

    constructor(
        private fb: FormBuilder,
        private locationService: LocationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.initializeForm();

        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (!user?.organization) {
                    return;
                }
                this.currentUser = user;

                this.locationService.getLocationsByOrganizationId(user.organization?.id ?? 0).subscribe({
                    next: (locations) => {
                        this.locations = locations;
                    },
                    error: (error: Error) => {
                        console.error('Error loading locations', error);
                    }
                });
            },
            error: (error: Error) => {
                console.error('Error loading current user', error);
            }
        });
    }

    private initializeForm() {
        this.locationForm = this.fb.group({
            address: ['', [Validators.maxLength(200)]],
            city: ['', [Validators.maxLength(200)]],
            state: ['', [Validators.maxLength(200)]],
            country: ['', [Validators.maxLength(200)]],
            zipCode: ['', [Validators.maxLength(200)]],
            latitude: ['', [   
                Validators.min(-90),
                Validators.max(90),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]],
            longitude: ['', [
                Validators.min(-90),
                Validators.max(90),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]]
        });
        
        this.locationForm.valueChanges.subscribe(values => {
            this.createNewLocation(this.getCreateLocationDTO()); 
            this.validateForm();
        });
    }

    formatLocation(location: Location): string {
        let parts = [];
        if (location.address) {
          parts.push(location.address);
        }
        if (location.city) {
          parts.push(location.city);
        }
        if (location.country) {
          parts.push(location.country);
        }
        return parts.join(', ');
    }

    getCreateLocationDTO(): CreateLocationDTO {
        return {
            organizationId: this.currentUser?.organization?.id ?? 0,
            address: this.locationForm.get('address')?.value,
            city: this.locationForm.get('city')?.value,
            state: this.locationForm.get('state')?.value,
            country: this.locationForm.get('country')?.value,
            zipCode: this.locationForm.get('zipCode')?.value,
            latitude: this.locationForm.get('latitude')?.value,
            longitude: this.locationForm.get('longitude')?.value,
        };
    }

    
    updateLocationChoice(value: string): void {
        this.locationChoiceChange.emit(value);
    }

    selectLocation(id: number): void {
        this.selectedLocationChange.emit(id);
    }

    createNewLocation(data: CreateLocationDTO): void {
        this.newLocationData.emit(data);
    }

    validateForm(): void {
        this.isFormValid.emit(this.locationForm.valid);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['initialLocationData']) {
            const locationData = changes['initialLocationData'].currentValue;
            if (locationData && locationData.id) {
                this.locationChoice = 'select';
                this.locationChoiceChange.emit(this.locationChoice);
                this.selectedLocationId = locationData.id; 
                this.selectedLocationChange.emit(this.selectedLocationId);
            }
        }
    }
}
