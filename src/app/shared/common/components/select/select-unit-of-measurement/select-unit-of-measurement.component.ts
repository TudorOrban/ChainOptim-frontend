import { Component, EventEmitter, Output } from '@angular/core';
import { StandardUnit, UnitMagnitude } from '../../../../enums/unitEnums';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-unit-of-measurement',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select-unit-of-measurement.component.html',
  styleUrl: './select-unit-of-measurement.component.css'
})
export class SelectUnitOfMeasurementComponent {
    standardUnits = Object.values(StandardUnit);
    unitMagnitudes = Object.values(UnitMagnitude);
    selectedStandardUnit: StandardUnit =  StandardUnit.KILOGRAM;
    selectedUnitMagnitude: UnitMagnitude = UnitMagnitude.BASE;
  
    @Output() unitChange = new EventEmitter<{ standardUnit: StandardUnit, unitMagnitude: UnitMagnitude }>();

    constructor() {}
  
    ngOnInit(): void {}
  
    initialize(unit: StandardUnit, magnitude: UnitMagnitude): void {
        this.selectedStandardUnit = unit;
        this.selectedUnitMagnitude = magnitude;
    }

    onSelectionChange(): void {
        this.unitChange.emit({
            standardUnit: this.selectedStandardUnit,
            unitMagnitude: this.selectedUnitMagnitude
        });
    }
}
