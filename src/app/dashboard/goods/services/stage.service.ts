import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { UpdateStageDTO } from "../models/Stage";
import { CreateStageDTO } from "../models/Stage";
import { Stage } from "../models/Stage";
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class StageService {
    private apiUrl = 'http://localhost:8080/api/v1/stages';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getStagesByOrganizationId(organizationId: number): Observable<Stage[]> {
        return this.http
            .get<Stage[]>(`${this.apiUrl}/organization/${organizationId}/small`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

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
        return this.http.post<Stage>(`${this.apiUrl}/create`, stageDTO);
    }
        
    updateStage(stageDTO: UpdateStageDTO, refreshGraph: boolean): Observable<Stage> {
        return this.http.put<Stage>(`${this.apiUrl}/update`, stageDTO);
    }

    deleteStage(stageId: number, refreshGraph: boolean): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${stageId}`);
    }
}
