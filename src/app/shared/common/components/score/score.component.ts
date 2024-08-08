import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent {
    @Input() score: number = 0;

    getDashArray(score: number, radius: number): string {
        const circumference = 2 * Math.PI * radius;
        const pct = (score / 100) * circumference;
        return `${pct} ${circumference - pct}`;
    }

    getDashOffset(score: number, radius: number): number {
        const circumference = 2 * Math.PI * radius;
        return circumference - (score / 100) * circumference;
    }

    
    getColor(score: number): string {
        if (score < 20) {
            return '#d9534f'; 
        } else if (score < 40) {
            return '#f0ad4e'; 
        } else if (score < 60) {
            return '#5bc0de';  
        } else if (score < 80) {
            return '#5cb85c';  
        } else {
            return '#0275d8';  
        }
    }
}
