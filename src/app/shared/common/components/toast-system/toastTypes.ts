export interface ToastInfo {
    id: number;
    title: string;
    message: string;
    outcome: OperationOutcome;
}

export enum OperationOutcome {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO'
}