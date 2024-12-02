import { InfoLevel } from "../../../dashboard/settings/models/UserSettings";
import { Feature } from "../../enums/commonEnums";

export interface NavigationItem {
    label: string;
    icon?: string;
    link?: string;
    children?: NavigationItem[];
}

export type FeatureConfiguration = Record<Feature, FeatureInfo>;

export interface FeatureInfo {
    tooltipText: string;
    infoLevel: InfoLevel;
}