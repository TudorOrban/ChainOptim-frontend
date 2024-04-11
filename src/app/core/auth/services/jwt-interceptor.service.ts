import { isPlatformBrowser } from "@angular/common";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem("token");
            if (token) {
                const clonedRequest = request.clone({
                    headers: request.headers.set("Authorization", "Bearer " + token)
                });
                return next.handle(clonedRequest);
            }
        }
        return next.handle(request);
    }
}