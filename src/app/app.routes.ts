import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './core/auth/components/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { PricingComponent } from './core/main/components/pricing/pricing.component';
import { ResourcesComponent } from './core/main/components/resources/resources.component';
import { ProductComponent } from './core/main/components/product/product.component';
import { SubscriptionComponent } from './dashboard/organization/components/organization/organization-subscription-plan/subscription/subscription.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'product', component: ProductComponent },
    { path: 'pricing', component: PricingComponent },
    { path: 'subscribe/success', redirectTo: '/subscribe', pathMatch: 'full' },
    { path: 'subscribe/cancel', redirectTo: '/subscribe', pathMatch: 'full' },
    { path: 'resources', component: ResourcesComponent },
    { path: '', component: HomeComponent },
    ...dashboardRoutes,
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes),
        LoginComponent,
        SignupComponent,
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
