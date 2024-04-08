import { Component, Input } from '@angular/core';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-client-shipments',
  standalone: true,
  imports: [],
  templateUrl: './client-shipments.component.html',
  styleUrl: './client-shipments.component.css'
})
export class ClientShipmentsComponent {

    @Input() client: Client | null = null;
}
