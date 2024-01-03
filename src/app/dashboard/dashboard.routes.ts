import { Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { OrganizationComponent } from "./components/organization/organization.component";

export const dashboardRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "organization", component: OrganizationComponent },
    ]
  }
];
