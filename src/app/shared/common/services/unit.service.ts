import { Injectable } from "@angular/core";
import { StandardUnit } from "../../enums/unitEnums";

@Injectable({
    providedIn: 'root',
})
export class UnitService {

    getUnitAbbreviation(unit: StandardUnit): string {
        return this.unitAbbreviations[unit];
    }

    getMagnitudeAbbreviation(magnitude: string): string {
        return this.magnitudeAbbreviations[magnitude];
    }

    getUnitCategory(unit: StandardUnit): string {
        return this.unitCategories[unit];
    }

    getMagnitudeMagnitude(magnitude: string): number {
        return this.magnitudeMagnitudes[magnitude];
    }
    
    unitAbbreviations: Record<StandardUnit, string> = {
        [StandardUnit.METER]: 'm',
        [StandardUnit.INCH]: 'in',
        [StandardUnit.KILOGRAM]: 'kg',
        [StandardUnit.POUND]: 'lb',
        [StandardUnit.LITER]: 'L',
    };

    magnitudeAbbreviations: Record<string, string> = {
        'MILLI': 'm',
        'CENTI': 'c',
        'DECI': 'd',
        'BASE': '',
        'DECA': 'da',
        'HECTO': 'h',
        'KILO': 'k',
    };

    unitCategories: Record<StandardUnit, string> = {
        [StandardUnit.METER]: 'Length',
        [StandardUnit.INCH]: 'Length',
        [StandardUnit.KILOGRAM]: 'Mass',
        [StandardUnit.POUND]: 'Mass',
        [StandardUnit.LITER]: 'Volume',
    };

    magnitudeMagnitudes: Record<string, number> = {
        'MILLI': 0.001,
        'CENTI': 0.01,
        'DECI': 0.1,
        'BASE': 1,
        'DECA': 10,
        'HECTO': 100,
        'KILO': 1000,
    };

}