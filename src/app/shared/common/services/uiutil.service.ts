import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UIUtilService {

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
        return value.toFixed(2).replace(/\.?0+$/, '');
    }
    
    formatEnum(text: string): string {
        return text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/_/g, ' ');
    }
}