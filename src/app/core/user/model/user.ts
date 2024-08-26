import { CustomRole } from "../../../dashboard/organization/models/custom-role";
import { Organization } from "../../../dashboard/organization/models/organization";

export interface User {
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    updatedAt?: Date;
    role: UserRole;
    customRole?: CustomRole;
    organization?: Organization;
    isProfilePublic?: boolean;
    enabled?: boolean;
    imageUrl?: string;
}

export interface UpdateUserProfileDTO {
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
    isProfilePublic?: boolean;
}

export type UserRole = "ADMIN" | "MEMBER" | "NONE";