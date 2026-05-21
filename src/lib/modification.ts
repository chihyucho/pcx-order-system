import { DESIGN_TEAM_EMAIL } from "@/lib/orders/constants";
import type { Order } from "./types";

export function buildModificationEmail(order: Order): {
  to: string;
  subject: string;
  body: string;
  fullText: string;
} {
  const subject = `Order Modification Request - ${order.orderNumber}`;
  const body = [
    "Hello Goodyear Team,",
    "",
    "I would like to get help for the following order:",
    "",
    `Order #: ${order.orderNumber}`,
    `Product: ${order.product}`,
    `Quantity: ${order.quantity}`,
    `Status: ${order.status}`,
    "",
    "Recipient:",
    `  Name: ${order.recipient.name}`,
    `  Address: ${order.recipient.address}`,
    `  Phone #: ${order.recipient.phoneNumber}`,
    "",
    "Requested changes:",
    "[Please describe the changes needed here]",
    "",
    "Thank you.",
  ].join("\n");

  const fullText = `To: ${DESIGN_TEAM_EMAIL}\nSubject: ${subject}\n\n${body}`;

  return {
    to: DESIGN_TEAM_EMAIL,
    subject,
    body,
    fullText,
  };
}
