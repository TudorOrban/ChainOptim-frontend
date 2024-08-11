import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateStageDTO, Stage, UpdateStageDTO } from '../models/Product';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class StageService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-stages';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getStagesByProductId(productId: number): Observable<Stage[]> {
        return this.http
            .get<Stage[]>(`${this.apiUrl}/product/${productId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getStageById(stageId: number): Observable<Stage> {
        return this.http
            .get<Stage>(`${this.apiUrl}/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createStage(stageDTO: CreateStageDTO, refreshGraph: boolean): Observable<Stage> {
        return this.http.post<Stage>(`${this.apiUrl}/create/${refreshGraph}`, stageDTO);
    }
        
    updateStage(stageDTO: UpdateStageDTO, refreshGraph: boolean): Observable<Stage> {
        return this.http.put<Stage>(`${this.apiUrl}/update/${refreshGraph}`, stageDTO);
    }

    deleteStage(stageId: number, refreshGraph: boolean): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${refreshGraph}/${stageId}`);
    }
}
