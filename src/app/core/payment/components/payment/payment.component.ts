import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

    constructor(
        private paymentService: PaymentService,
    ) {}

    
}
