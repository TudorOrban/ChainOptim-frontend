import { Permissions } from "./custom-role";

export interface CreateCustomRoleDTO {
    name: string;
    organizationId: number;
    permissions: Permissions;
}

export interface UpdateCustomRoleDTO {
    id: number;
    name?: string;
    permissions?: Permissions;
}