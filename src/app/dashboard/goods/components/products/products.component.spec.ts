import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductsComponent } from './products.component';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { OrganizationService } from '../../../organization/services/organization.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProductsComponent', () => {
    let component: ProductsComponent;
    let fixture: ComponentFixture<ProductsComponent>;
    let productServiceMock: any;
    let organizationServiceMock: any;
    let fallbackManagerServiceMock: any;

    beforeEach(async () => {
        // Setup mocks
        productServiceMock = jasmine.createSpyObj('ProductService', [
            'getProductsByOrganizationIdAdvanced',
        ]);
        organizationServiceMock = jasmine.createSpyObj('OrganizationService', [
            'getCurrentOrganization',
        ]);
        fallbackManagerServiceMock = jasmine.createSpyObj(
            'FallbackManagerService',
            [
                'updateLoading',
                'fallbackManagerState$',
                'updateNoOrganization',
                'updateNoResults',
                'updateError',
            ]
        );

        // Provide mock data
        organizationServiceMock.getCurrentOrganization.and.returnValue(
            of({ id: 1, name: 'Test Organization' })
        );
        productServiceMock.getProductsByOrganizationIdAdvanced.and.returnValue(
            of({
                results: [
                    { id: 1, name: 'Test Product 1' },
                    { id: 2, name: 'Test Product 2' },
                ],
                totalCount: 3,
            })
        );
        fallbackManagerServiceMock.fallbackManagerState$ = of({});

        await TestBed.configureTestingModule({
    imports: [ProductsComponent, RouterTestingModule],
    providers: [
        { provide: ProductService, useValue: productServiceMock },
        {
            provide: OrganizationService,
            useValue: organizationServiceMock,
        },
        {
            provide: FallbackManagerService,
            useValue: fallbackManagerServiceMock,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

        fixture = TestBed.createComponent(ProductsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should load products on initialization', () => {
        expect(
            organizationServiceMock.getCurrentOrganization
        ).toHaveBeenCalled();
        expect(
            productServiceMock.getProductsByOrganizationIdAdvanced
        ).toHaveBeenCalledWith(1, '', 'createdAt', false, 1, 3);
        expect(component.products.length).toBe(2);
    });

    it('should reset page and load products with new search query', () => {
        const newSearchQuery = 'new search query';
        component.handleSearch(newSearchQuery);
        expect(component.searchQuery).toEqual(newSearchQuery);
        expect(component.page).toEqual(1);
        expect(
            productServiceMock.getProductsByOrganizationIdAdvanced
        ).toHaveBeenCalledWith(1, newSearchQuery, 'createdAt', false, 1, 3);
    });

    it('should request to update no results state when no products are found', async () => {
        productServiceMock.getProductsByOrganizationIdAdvanced.and.returnValue(of({ results: [], totalCount: 0 }));
    
        component.loadProducts(1);
        fixture.detectChanges();
        
        expect(fallbackManagerServiceMock.updateNoResults).toHaveBeenCalledWith(true);
    });
    
    
});
