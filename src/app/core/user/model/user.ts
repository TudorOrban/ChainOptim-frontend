import { CustomRole } from "../../../dashboard/organization/models/custom-role";
import { Organization } from "../../../dashboard/organization/models/organization";

export interface User {
    id: string;
    username: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    role: UserRole;
    customRole?: CustomRole;
    organization?: Organization;
    isProfilePublic?: boolean;
    enabled?: boolean;
    imageUrl?: string;
}

export type UserRole = "ADMIN" | "MEMBER" | "NONE";