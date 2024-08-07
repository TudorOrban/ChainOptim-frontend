import { Location } from "../../../shared/common/models/reusableTypes";

export interface Supplier {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;
}
