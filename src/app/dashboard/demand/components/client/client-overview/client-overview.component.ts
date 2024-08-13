import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Client, ClientOverviewDTO } from '../../../models/Client';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.css'
})
export class ClientOverviewComponent implements OnInit, OnChanges {
    @Input() client: Client | undefined = undefined;

    clientOverview: ClientOverviewDTO | undefined = undefined;
    hasLoadedOverview: boolean = false;

    constructor(
        private clientService: ClientService
    ) { }


    ngOnInit(): void {
        if (!this.client) {
            return;
        }

        this.clientService.getClientOverview(this.client!.id).subscribe((overview) => {
            this.clientOverview = overview
            this.hasLoadedOverview = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.client || this.hasLoadedOverview) {
            return;
        }
        if (changes['client'] && this.client) {
            this.clientService.getClientOverview(this.client.id).subscribe((overview) => {
                this.clientOverview = overview;
            });
        }
    }
}
