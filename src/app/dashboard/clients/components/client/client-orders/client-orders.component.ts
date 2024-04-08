import { Component, Input } from '@angular/core';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [],
  templateUrl: './client-orders.component.html',
  styleUrl: './client-orders.component.css'
})
export class ClientOrdersComponent {

    @Input() client: Client | null = null;
}
