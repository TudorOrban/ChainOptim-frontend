export interface NavigationItem {
    label: string;
    icon?: string;
    link?: string;
    children?: NavigationItem[];
}