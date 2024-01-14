import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './core/components/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/overview/components/overview/overview.component';
import { OrganizationComponent } from './dashboard/organization/components/organization/organization.component';
import { dashboardRoutes } from './dashboard/dashboard.routes';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
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
