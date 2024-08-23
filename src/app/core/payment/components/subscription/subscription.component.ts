import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PaymentComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

}
