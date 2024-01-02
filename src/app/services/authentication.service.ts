import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    public isAuthenticated(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem("token");
            return !!token;
        }
        return false;
    }

    public getToken(): string | null {
        return localStorage.getItem("token");
    }

    public login(token: string): void {
        localStorage.setItem("token", token);
    }

    public logout(): void {
        localStorage.removeItem("token");
    }
}