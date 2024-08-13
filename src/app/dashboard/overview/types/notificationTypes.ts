import { User } from "../../../core/user/model/user";

export interface NotificationUser {
    id: number;
    notification: Notification;
    user: User;
    readStatus: boolean;
}

export interface Notification {
    id: number;
    title: string;
    entityId: number;
    entityType: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    readStatus: boolean;
    type: string;

    extraInfo: NotificationExtraInfo;
}

export interface NotificationExtraInfo {
    extraMessages: string[];
}
