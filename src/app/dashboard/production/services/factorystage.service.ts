import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateFactoryDTO, CreateFactoryStageDTO, Factory, FactoryStage, FactoryStageSearchDTO, UpdateFactoryDTO, UpdateFactoryStageDTO } from '../models/Factory';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class FactoryStageService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-stages';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getFactoryStagesByOrganizationId(organizationId: number): Observable<FactoryStageSearchDTO[]> {
        return this.http
            .get<FactoryStageSearchDTO[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getFactoryStagesByFactoryId(factoryId: number): Observable<FactoryStageSearchDTO[]> {
        return this.http
            .get<FactoryStageSearchDTO[]>(`${this.apiUrl}/factory/${factoryId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getFactoryStageById(stageId: number): Observable<FactoryStage> {
        return this.http
            .get<FactoryStage>(`${this.apiUrl}/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createFactoryStage(factoryStageDTO: CreateFactoryStageDTO, refreshGraph: boolean): Observable<FactoryStage> {
        return this.http.post<FactoryStage>(`${this.apiUrl}/create/${refreshGraph}`, factoryStageDTO);
    }
        
    updateFactoryStage(factoryStageDTO: UpdateFactoryStageDTO, refreshGraph: boolean): Observable<FactoryStage> {
        return this.http.put<FactoryStage>(`${this.apiUrl}/update/${refreshGraph}`, factoryStageDTO);
    }

    deleteFactoryStage(factoryStageId: number, refreshGraph: boolean): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${factoryStageId}/${refreshGraph}`);
    }
}
