import { Routes } from '@angular/router';
import { DashboardComponent } from './overview/components/overview/overview.component';
import { OrganizationComponent } from './organization/components/organization/organization.component';
import { CreateOrganizationComponent } from './organization/components/create-organization/create-organization.component';
import { ProductsComponent } from './products/components/products/products.component';
import { ProductComponent } from './products/components/product/product.component';

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
    },
    {
        path: 'dashboard/products',
        component: ProductsComponent,
    },
    {
        path: 'dashboard/products/:productId', component: ProductComponent,
    }
];
