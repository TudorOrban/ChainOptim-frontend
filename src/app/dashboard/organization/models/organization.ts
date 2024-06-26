import { User, UserRole } from "../../../core/user/model/user";

export interface Organization {
    id: number;
    name: string;
    address?: string;
    contactInfo?: string;
    subscriptionPlanTier: SubscriptionPlan;
    createdAt: Date;
    updatedAt: Date;
    users?: User[];
}

export interface SearchUserDTO {
    id: string;
    username: string;
    email: string;
}

export interface CreateUserDTO {
    username: string;
    password: string;
    email: string;
    organizationId: number;
    role: UserRole;
}

export interface CreateOrganizationDTO {
    name: string;
    address?: string;
    contactInfo?: string;
    creatorId: string;
    existingUserIds?: string[];
    createdUsers?: CreateUserDTO[];
    subscriptionPlan: SubscriptionPlan;
}

export type SubscriptionPlan = "NONE" | "BASIC" | "PRO";

export interface OrganizationInvite {
    id: number;
    organizationId: number;
    inviterId: string;
    inviteeId: string;
    status: InviteStatus;
    createdAt: string;
}

export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface OrganizationRequests {
    id: number;
    organizationId: number;
    requesterId: string;
    status: RequestStatus;
    createdAt: string;
}

export type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";