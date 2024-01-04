import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { CreateOrganizationComponent } from './components/organization/create-organization/create-organization.component';

export const dashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'dashboard/organization',
        component: OrganizationComponent,
    },
    {
        path: 'dashboard/organization/create-organization',
        component: CreateOrganizationComponent,
    }
];
