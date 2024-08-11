import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateConnectionDTO, CreateFactoryDTO, CreateFactoryStageDTO, DeleteConnectionDTO, Factory, FactoryStage, FactoryStageConnection, UpdateConnectionDTO, UpdateFactoryDTO, UpdateFactoryStageDTO } from '../models/Factory';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class FactoryStageConnectionService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-stage-connections';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Factory>>
    ) {}


    getConnectionsByFactoryId(factoryId: number): Observable<FactoryStageConnection[]> {
        return this.http
            .get<FactoryStageConnection[]>(`${this.apiUrl}/factory/${factoryId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createConnection(connectionDTO: CreateConnectionDTO): Observable<FactoryStageConnection> {
        return this.http.post<FactoryStageConnection>(`${this.apiUrl}/create`, connectionDTO);
    }
        
    updateConnection(connectionDTO: UpdateConnectionDTO): Observable<FactoryStageConnection> {
        return this.http.put<FactoryStageConnection>(`${this.apiUrl}/update`, connectionDTO);
    }

    deleteConnection(connectionId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${connectionId}`);
    }

    findAndDeleteConnection(connectionDTO: DeleteConnectionDTO): Observable<number> {
        const options = {
            body: connectionDTO,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<number>(`${this.apiUrl}/find-and-delete`, options);
    }
}
