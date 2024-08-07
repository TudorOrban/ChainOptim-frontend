import { Location } from "../../../shared/common/models/ReusableTypes";

export interface Client {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;
}