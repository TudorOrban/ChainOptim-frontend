import { Routes } from '@angular/router';
import { DashboardComponent } from './components/overview/overview.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { CreateOrganizationComponent } from './components/organization/create-organization/create-organization.component';
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
