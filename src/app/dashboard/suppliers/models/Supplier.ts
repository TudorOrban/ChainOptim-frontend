import { Location } from "../../../shared/common/models/ReusableTypes";

export interface Supplier {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;
}
