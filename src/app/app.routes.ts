import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", redirectTo: "/login", pathMatch: "full" }
];

@NgModule({
    imports: [CommonModule, RouterModule.forRoot(routes), LoginComponent],
    exports: [RouterModule]
})
export class AppRoutingModule { }