import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, share } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NotificationLiveService {
    private socket$: WebSocketSubject<any> | null = null;

    constructor() {}

    public connect(url: string): Observable<any> {
        console.log('Connecting to WebSocket:', url);
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket(url);
        }
        console.log('Connected to WebSocket:', url);

        return this.socket$.asObservable().pipe(
            tap({
                next: (message) => console.log('Received message:', message),
                error: (error) => console.log('WebSocket error:', error),
                complete: () => console.log('WebSocket connection closed'),
            }),
            catchError((error) => {
                console.log('WebSocket error:', error);
                return EMPTY;
            }),
            share() // Ensure that multiple subscribers share the same WebSocket and do not trigger multiple connections
        );
    }

    private getNewWebSocket(url: string): WebSocketSubject<any> {
        return webSocket({
            url: url,
            openObserver: {
                next: () => {
                    console.log('WebSocket connection opened');
                },
            },
            closeObserver: {
                next: () => {
                    console.log('WebSocket connection closed');
                    this.socket$ = null;
                    this.connect(url); // Attempt to reconnect automatically
                },
            },
            deserializer: msg => JSON.parse(msg.data) 
        });
    }

    sendMessage(msg: any) {
        if (this.socket$) {
            this.socket$.next(msg);
        }
    }

    close() {
        this.socket$?.complete();
        this.socket$ = null;
    }
}
