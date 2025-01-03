import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CreateStageOutputDTO, DeleteStageOutputDTO, StageOutput, UpdateStageOutputDTO } from '../models/Stage';

@Injectable({
    providedIn: 'root',
})
export class StageOutputService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/stage-outputs';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
    ) {}

    getStageOutputsByStageId(stageId: number): Observable<StageOutput[]> {
        return this.http
            .get<StageOutput[]>(`${this.apiUrl}/stage/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getStageOutputsByProductId(productId: number): Observable<StageOutput[]> {
        return this.http
            .get<StageOutput[]>(`${this.apiUrl}/product/${productId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getStageOutputById(stageId: number): Observable<StageOutput> {
        return this.http
            .get<StageOutput>(`${this.apiUrl}/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createStageOutput(stageDTO: CreateStageOutputDTO, refreshGraph: boolean): Observable<StageOutput> {
        return this.http.post<StageOutput>(`${this.apiUrl}/create`, stageDTO);
    }
        
    updateStageOutput(stageDTO: UpdateStageOutputDTO, refreshGraph: boolean): Observable<StageOutput> {
        return this.http.put<StageOutput>(`${this.apiUrl}/update`, stageDTO);
    }

    deleteStageOutput(stageDTO: DeleteStageOutputDTO): Observable<number> {
        const options = {
            body: stageDTO,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<number>(`${this.apiUrl}/delete`, options);
    }
}
