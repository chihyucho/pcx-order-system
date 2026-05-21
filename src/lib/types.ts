export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: UserRole;
}

export interface OrderRecipient {
  name: string;
  address: string;
  phoneNumber: string;
}

/** Canonical order model used across the app. */
export interface Order {
  id: string;
  orderNumber: string;
  product: string;
  quantity: number;
  status: string;
  userId: string;
  companyName: string;
  recipient: OrderRecipient;
  createdAt: string;
}

export interface RecipientTemplate {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
}
