import { Component, Input } from '@angular/core';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-client-evaluation',
  standalone: true,
  imports: [],
  templateUrl: './client-evaluation.component.html',
  styleUrl: './client-evaluation.component.css'
})
export class ClientEvaluationComponent {

    @Input() client: Client | null = null;
}
