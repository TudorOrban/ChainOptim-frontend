import { Injectable } from "@angular/core";
import { CreatePricingDTO, Pricing, UpdatePricingDTO } from "../models/Product";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PricingService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/pricings';

    constructor(
        private readonly http: HttpClient,
    ) { }

    getPricingByProductId(productId: number): Observable<Pricing> {
        return this.http.get<Pricing>(`${this.apiUrl}/product/${productId}`);
    }

    createPricing(createPricingDTO: CreatePricingDTO): Observable<Pricing> {
        return this.http.post<Pricing>(`${this.apiUrl}/create`, createPricingDTO);
    }

    updatePricing(updatePricingDTO: UpdatePricingDTO): Observable<Pricing> {
        return this.http.put<Pricing>(`${this.apiUrl}/update`, updatePricingDTO);
    }

    deletePricing(pricingId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${pricingId}`);
    }
}