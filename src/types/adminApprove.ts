export interface ProviderDetail {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  status: string;
}

export type ApprovalStatus = "APPROVED" | "REJECTED";