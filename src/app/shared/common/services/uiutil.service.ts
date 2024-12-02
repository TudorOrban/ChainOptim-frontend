import { Injectable } from "@angular/core";
import { UnitOfMeasurement } from "../../../dashboard/goods/models/UnitOfMeasurement";
import { UnitService } from "./unit.service";

@Injectable({
    providedIn: 'root',
})
export class UIUtilService {

    constructor(
        private readonly unitService: UnitService
    ) {}

    formatTimePeriod(days: number | undefined): string {
        if (!days) {
            return '0 days';
        }
        if (days >= 30) {
            const months = Math.floor(days / 30);
            return `${months} month${months > 1 ? 's' : ''}`;
        } else if (days >= 7) {
            const weeks = Math.floor(days / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
            return `${Math.floor(days)} day${days > 1 ? 's' : ''}`;
        }
    }
    
    formatPercentage(value: number | undefined): string {
        if (value === undefined) return '0%';
        return `${(value * 100).toFixed(2)}%`;
    }

    formatNumber(value: number | null | undefined): string {
        if (!value) return '0';
        if (value == -1) return 'Unlimited';
        return value.toFixed(2).replace(/\.?0+$/, '');
    }
    
    formatEnum(text: string | undefined): string {
        if (!text) return '';
        return text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/_/g, ' ');
    }

    formatDate(dateStr: Date | string | null | undefined): Date {
        if (!dateStr) return new Date();
        return new Date(`${dateStr}T00:00`);
    }

    formatUnitOfMeasurement(unit?: UnitOfMeasurement, fullName?: boolean, abbreviation?: boolean): string {
        if (!unit) return '';
        
        let formattedUnit = "";

        if (fullName) {
            formattedUnit = this.formatUnitFullName(unit);
        }

        if (abbreviation) {
            formattedUnit += formattedUnit ? ` (${this.formatUnitAbbreviation(unit)})` : this.formatUnitAbbreviation(unit);
        };

        return formattedUnit;
    }

    private formatUnitFullName(unit: UnitOfMeasurement): string {
        const stdUnitStr = this.formatEnum(unit.standardUnit);
        const magnitudeStr = this.formatEnum(unit.unitMagnitude);
        if (!stdUnitStr || !magnitudeStr) return '';
        if (magnitudeStr === 'Base') return stdUnitStr;
        return `${magnitudeStr}${stdUnitStr.toLowerCase()}(s)`;
    }

    private formatUnitAbbreviation(unit: UnitOfMeasurement): string {
        const stdUnitAbbreviationStr = this.unitService.getUnitAbbreviation(unit.standardUnit);
        const magnitudeAbbreviationStr = this.unitService.getMagnitudeAbbreviation(unit.unitMagnitude);
        if (!stdUnitAbbreviationStr || !magnitudeAbbreviationStr) return '';
        return `${stdUnitAbbreviationStr}${magnitudeAbbreviationStr.toLowerCase()}`;
    }

    decapitalize(text?: string): string {
        if (!text) return '';
        return text.charAt(0).toLowerCase() + text.slice(1);
    }
}