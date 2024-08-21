import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { UserSettingsService } from '../../../../dashboard/settings/services/user-settings.service';
import { InfoLevel } from '../../../../dashboard/settings/models/UserSettings';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './info.component.html',
    styleUrl: './info.component.css',
})
export class InfoComponent implements OnInit {
    @Input() tooltipText: string = 'More information';
    @Input() infoLevel?: InfoLevel = InfoLevel.ALL;

    isVisible: boolean = false;
    show: boolean = false;
    tooltipPosition: string = 'above';

    faInfo = faInfo;

    @ViewChild('iconWrapper', { static: false }) iconWrapper!: ElementRef;

    constructor(
        private userSettingsService: UserSettingsService,
    ) {}

    @HostListener('mouseenter')
    onMouseEnter() {
        const elementRect =
            this.iconWrapper.nativeElement.getBoundingClientRect();
        const elementTop = elementRect.top;

        // Check if there's enough space above the icon
        if (elementTop < 50) {
            // adjust 50 based on the size of your tooltip
            this.tooltipPosition = 'below';
        } else {
            this.tooltipPosition = 'above';
        }

        this.show = true;
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.show = false;
    }

    ngOnInit() {
        this.userSettingsService.getCurrentSettings().subscribe(
            (settings) => {
                console.log('Fetched user settings:', settings);
                const desiredInfoLevel = settings?.generalSettings.infoLevel;
                console.log('Info level:', this.infoLevel, 'desired:', desiredInfoLevel);
                if (desiredInfoLevel && this.infoLevel) {
                    this.isVisible = desiredInfoLevel >= this.infoLevel;
                    console.log('Is visible:', this.isVisible);
                }
            }
        );
    }
    
}
