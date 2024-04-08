import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationItem } from '../../models/UITypes';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {

    @Input() tabs: NavigationItem[] = [];
    @Input() activeTab: string = '';

    @Output() tabSelected = new EventEmitter<string>();

    selectTab(label: string) {
        this.tabSelected.emit(label);
      }      
}
