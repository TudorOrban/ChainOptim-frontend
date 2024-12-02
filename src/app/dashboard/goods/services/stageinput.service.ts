import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CreateStageInputDTO, DeleteStageInputDTO, StageInput, UpdateStageInputDTO } from '../models/Stage';

@Injectable({
    providedIn: 'root',
})
export class StageInputService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/stage-inputs';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
    ) {}

    getStageInputsByStageId(stageId: number): Observable<StageInput[]> {
        return this.http
            .get<StageInput[]>(`${this.apiUrl}/stage/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getStageInputsByProductId(productId: number): Observable<StageInput[]> {
        return this.http
            .get<StageInput[]>(`${this.apiUrl}/product/${productId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getStageInputById(stageId: number): Observable<StageInput> {
        return this.http
            .get<StageInput>(`${this.apiUrl}/${stageId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createStageInput(stageDTO: CreateStageInputDTO, refreshGraph: boolean): Observable<StageInput> {
        return this.http.post<StageInput>(`${this.apiUrl}/create`, stageDTO);
    }
        
    updateStageInput(stageDTO: UpdateStageInputDTO, refreshGraph: boolean): Observable<StageInput> {
        return this.http.put<StageInput>(`${this.apiUrl}/update`, stageDTO);
    }

    deleteStageInput(stageDTO: DeleteStageInputDTO): Observable<number> {
        const options = {
            body: stageDTO,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<number>(`${this.apiUrl}/delete`, options);
    }
}
