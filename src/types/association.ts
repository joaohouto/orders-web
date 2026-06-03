export type AssociationPlan = {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
  activeMembers?: number;
  createdAt: string;
  store?: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    banner?: string;
    instagram?: string;
  };
};

export type MembershipStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELED";

export type Membership = {
  id: string;
  userId: string;
  storeId: string;
  planId: string;
  plan: AssociationPlan;
  user?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    document?: string;
  };
  store?: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  };
  status: MembershipStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
};
