import { Component, Input } from '@angular/core';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-client-overview',
  standalone: true,
  imports: [],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.css'
})
export class ClientOverviewComponent {

    @Input() client: Client | null = null;
}
