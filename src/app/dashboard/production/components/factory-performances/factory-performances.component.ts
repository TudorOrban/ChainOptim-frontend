import { Component } from '@angular/core';
import { ScoreComponent } from '../../../../shared/common/components/score/score.component';

@Component({
  selector: 'app-factory-performances',
  standalone: true,
  imports: [ScoreComponent],
  templateUrl: './factory-performances.component.html',
  styleUrl: './factory-performances.component.css'
})
export class FactoryPerformancesComponent {

}
