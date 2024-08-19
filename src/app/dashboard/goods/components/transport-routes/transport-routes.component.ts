import { Component, Input } from '@angular/core';
import { SearchMode } from '../../../../shared/enums/commonEnums';
import { TransportRoutesTableComponent } from './transport-routes-table/transport-routes-table.component';
import { CommonModule } from '@angular/common';
import { TransportRoutesMapComponent } from './transport-routes-map/transport-routes-map.component';

@Component({
  selector: 'app-transport-routes',
  standalone: true,
  imports: [CommonModule, TransportRoutesTableComponent, TransportRoutesMapComponent],
  templateUrl: './transport-routes.component.html',
  styleUrl: './transport-routes.component.css'
})
export class TransportRoutesComponent {
    selectedTab = 'Map';
    s = ''

    

    handleSelectTab(tab: string) {
        this.selectedTab = tab;
    }
}
