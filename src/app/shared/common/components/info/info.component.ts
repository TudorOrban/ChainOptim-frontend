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
import { InfoLevel, UserSettings } from '../../../../dashboard/settings/models/UserSettings';
import { InfoService } from '../../services/info.service';
import { Feature } from '../../../enums/commonEnums';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './info.component.html',
    styleUrl: './info.component.css',
})
export class InfoComponent implements OnInit {
    @Input() feature?: Feature;

    userSettings: UserSettings | undefined = undefined;
    isVisible: boolean = false;
    tooltipText: string = '';
    infoLevel: InfoLevel | undefined = undefined;
    showTooltip: boolean = false;
    tooltipPosition: string = 'above';

    faInfo = faInfo;

    @ViewChild('iconWrapper', { static: false }) iconWrapper!: ElementRef;

    constructor(
        private userSettingsService: UserSettingsService,
        private infoService: InfoService
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

        this.showTooltip = true;
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.showTooltip = false;
    }

    ngOnInit() {
        this.userSettingsService.getCurrentSettings().subscribe(
            (settings) => {
                if (!settings) {
                    return;
                }
                this.userSettings = settings;
                console.log('Fetched user settings:', settings);
                
                this.decideVisibility();
            }
        );
    }

    private decideVisibility(): void {
        if (!this.feature) {
            console.error('No feature provided');
            return;
        }
        const featureInfo = this.infoService.getFeatureInfo(this.feature);
        this.tooltipText = featureInfo.tooltipText;
        this.infoLevel = featureInfo.infoLevel;

        const desiredInfoLevel = this.userSettings?.generalSettings.infoLevel;
        if (desiredInfoLevel && this.infoLevel) {
            this.isVisible = desiredInfoLevel >= this.infoLevel;
        }
    }
}
