import { Routes } from '@angular/router';
import { DashboardComponent } from './overview/components/overview/overview.component';
import { OrganizationComponent } from './organization/components/organization/organization.component';
import { CreateOrganizationComponent } from './organization/components/create-organization/create-organization.component';
import { ProductsComponent } from './goods/components/products/products.component';
import { FactoriesComponent } from './production/components/factories/factories.component';
import { FactoryComponent } from './production/components/factory/factory.component';
import { WarehousesComponent } from './storage/components/warehouses/warehouses.component';
import { WarehouseComponent } from './storage/components/warehouse/warehouse.component';
import { ClientsComponent } from './demand/components/clients/clients.component';
import { SettingsComponent } from './settings/components/settings/settings.component';
import { ProductComponent } from './goods/components/product/product/product.component';
import { ClientComponent } from './demand/components/client/client.component';
import { CreateProductComponent } from './goods/components/create-product/create-product.component';
import { SupplierComponent } from './supply/components/supplier/supplier.component';
import { SuppliersComponent } from './supply/components/suppliers/suppliers.component';
import { ComponentsComponent } from './goods/components/components/components.component';
import { StagesComponent } from './goods/components/stages/stages.component';
import { FactoryInventoryComponent } from './production/components/factory-inventory/factory-inventory.component';
import { FactoryPerformancesComponent } from './production/components/factory-performances/factory-performances.component';
import { SupplierOrdersComponent } from './supply/components/supplier-orders/supplier-orders.component';
import { SupplierShipmentsComponent } from './supply/components/supplier-shipments/supplier-shipments.component';
import { WarehouseInventoryComponent } from './storage/components/warehouse-inventory/warehouse-inventory.component';
import { WarehouseEvaluationsComponent } from './storage/components/warehouse-evaluations/warehouse-evaluations.component';
import { ClientOrdersComponent } from './demand/components/client-orders/client-orders.component';
import { ClientShipmentsComponent } from './demand/components/client-shipments/client-shipments.component';
import { SupplierPerformancesComponent } from './supply/components/supplier-performances/supplier-performances.component';
import { ClientPerformancesComponent } from './demand/components/client-performances/client-performances.component';
import { UpdateProductComponent } from './goods/components/update-product/update-product.component';
import { CreateFactoryComponent } from './production/components/create-factory/create-factory.component';
import { CreateWarehouseComponent } from './storage/components/create-warehouse/create-warehouse.component';
import { UpdateFactoryComponent } from './production/components/update-factory/update-factory.component';
import { UpdateWarehouseComponent } from './storage/components/update-warehouse/update-warehouse.component';
import { CreateSupplierComponent } from './supply/components/create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from './supply/components/update-supplier/update-supplier.component';
import { CreateClientComponent } from './demand/components/create-client/create-client.component';
import { UpdateClientComponent } from './demand/components/update-client/update-client.component';

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
        path: 'dashboard/products/create-product',
        component: CreateProductComponent,
    },
    {
        path: 'dashboard/components',
        component: ComponentsComponent,
    },
    {
        path: 'dashboard/stages',
        component: StagesComponent,
    },
    {
        path: 'dashboard/products/:productId', 
        component: ProductComponent,
    },
    {
        path: 'dashboard/products/:productId/update', 
        component: UpdateProductComponent,
    },
    {
        path: 'dashboard/factories',
        component: FactoriesComponent,
    },
    {
        path: 'dashboard/factory-inventory',
        component: FactoryInventoryComponent,
    },
    {
        path: 'dashboard/factory-performances',
        component: FactoryPerformancesComponent,
    },
    {
        path: 'dashboard/factories/create-factory',
        component: CreateFactoryComponent,
    },
    {
        path: 'dashboard/factories/:factoryId', 
        component: FactoryComponent,
    },
    {
        path: 'dashboard/factories/:factoryId/update', 
        component: UpdateFactoryComponent,
    },
    {
        path: 'dashboard/suppliers',
        component: SuppliersComponent,
    },
    {
        path: 'dashboard/supplier-orders',
        component: SupplierOrdersComponent,
    },
    {
        path: 'dashboard/supplier-shipments',
        component: SupplierShipmentsComponent,
    },
    {
        path: 'dashboard/supplier-performances',
        component: SupplierPerformancesComponent,
    },
    {
        path: 'dashboard/suppliers/create-supplier',
        component: CreateSupplierComponent,
    },
    {
        path: 'dashboard/suppliers/:supplierId', 
        component: SupplierComponent,
    },
    {
        path: 'dashboard/suppliers/:supplierId/update', 
        component: UpdateSupplierComponent,
    },
    {
        path: 'dashboard/warehouses',
        component: WarehousesComponent,
    },
    {
        path: 'dashboard/warehouse-inventory',
        component: WarehouseInventoryComponent,
    },
    {
        path: 'dashboard/warehouse-evaluations',
        component: WarehouseEvaluationsComponent,
    },
    {
        path: 'dashboard/warehouses/create-warehouse',
        component: CreateWarehouseComponent,
    },
    {
        path: 'dashboard/warehouses/:warehouseId', 
        component: WarehouseComponent,
    },
    {
        path: 'dashboard/warehouses/:warehouseId/update', 
        component: UpdateWarehouseComponent,
    },
    {
        path: 'dashboard/clients',
        component: ClientsComponent,
    },
    {
        path: 'dashboard/client-orders',
        component: ClientOrdersComponent,
    },
    {
        path: 'dashboard/client-shipments',
        component: ClientShipmentsComponent,
    },
    {
        path: 'dashboard/client-performances',
        component: ClientPerformancesComponent,
    },
    {
        path: 'dashboard/clients/create-client',
        component: CreateClientComponent,
    },
    {
        path: 'dashboard/clients/:clientId', 
        component: ClientComponent,
    },
    {
        path: 'dashboard/clients/:clientId/update',
        component: UpdateClientComponent,
    },
    {
        path: 'dashboard/settings',
        component: SettingsComponent,
    }
];
