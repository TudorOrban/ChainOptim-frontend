import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem("token");
        if (token) {
            const clonedRequest = request.clone({
                headers: request.headers.set("Authorization", "Bearer " + token)
            });
            return next.handle(clonedRequest);
        }
        return next.handle(request);
    }
}