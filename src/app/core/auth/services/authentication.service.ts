import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import * as jwt_decoder from "jwt-decode";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object, private userService: UserService) {}

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
        this.userService.setCurrentUser(null);
    }

    public getUsernameFromToken(): string | null {
        const token = this.getToken();
        if (token) {
            const decodedToken = jwt_decoder.jwtDecode<{ sub: string}>(token);
            return decodedToken.sub;
        }
        return null;
    }
}