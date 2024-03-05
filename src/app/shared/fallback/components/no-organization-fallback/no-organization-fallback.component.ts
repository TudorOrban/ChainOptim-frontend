import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-no-organization-fallback',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './no-organization-fallback.component.html',
  styleUrl: './no-organization-fallback.component.css'
})
export class NoOrganizationFallbackComponent {
    faBuilding = faBuilding;

}
