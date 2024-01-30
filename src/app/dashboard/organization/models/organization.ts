export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    organization?: Organization;
}

export interface Organization {
    id: number;
    name: string;
    address?: string;
    contactInfo?: string;
    subscriptionPlan: SubscriptionPlan;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
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

export type UserRole = "ADMIN" | "MEMBER" | "NONE";
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