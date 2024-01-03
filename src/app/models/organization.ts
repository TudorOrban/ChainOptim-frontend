export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    organization: Organization;
}

export interface Organization {
    id: number;
    name: string;
    address?: string;
    contactInfo?: string;
    subscriptionPlan: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
}
  