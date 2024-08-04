import { Routes } from '@angular/router';
import { DashboardComponent } from './overview/components/overview/overview.component';
import { OrganizationComponent } from './organization/components/organization/organization.component';
import { CreateOrganizationComponent } from './organization/components/create-organization/create-organization.component';
import { ProductsComponent } from './products/components/products/products.component';
import { FactoriesComponent } from './factories/components/factories/factories.component';
import { FactoryComponent } from './factories/components/factory/factory.component';
import { SuppliersComponent } from './suppliers/components/suppliers/suppliers.component';
import { SupplierComponent } from './suppliers/components/supplier/supplier.component';
import { WarehousesComponent } from './warehouses/components/warehouses/warehouses.component';
import { WarehouseComponent } from './warehouses/components/warehouse/warehouse.component';
import { ClientsComponent } from './clients/components/clients/clients.component';
import { SettingsComponent } from './settings/components/settings/settings.component';
import { ProductComponent } from './products/components/product/product/product.component';
import { ClientComponent } from './clients/components/client/client.component';

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
    },
    {
        path: 'dashboard/factories',
        component: FactoriesComponent,
    },
    {
        path: 'dashboard/factories/:factoryId', component: FactoryComponent,
    },
    {
        path: 'dashboard/suppliers',
        component: SuppliersComponent,
    },
    {
        path: 'dashboard/suppliers/:supplierId', component: SupplierComponent,
    },
    {
        path: 'dashboard/warehouses',
        component: WarehousesComponent,
    },
    {
        path: 'dashboard/warehouses/:warehouseId', component: WarehouseComponent,
    },
    {
        path: 'dashboard/clients',
        component: ClientsComponent,
    },
    {
        path: 'dashboard/clients/:clientId', component: ClientComponent,
    },
    {
        path: 'dashboard/settings',
        component: SettingsComponent,
    }
];
