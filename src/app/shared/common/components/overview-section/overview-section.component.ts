import { Component, Input } from '@angular/core';
import { SmallEntityDTO } from '../../models/reusableTypes';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './overview-section.component.html',
  styleUrl: './overview-section.component.css'
})
export class OverviewSectionComponent {
    @Input() label: string = '';
    @Input() feature: string = '';
    @Input() entities: SmallEntityDTO[] | undefined = [];
}
