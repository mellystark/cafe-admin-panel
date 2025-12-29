// src/utils/customer.js

import { v4 as uuidv4 } from "uuid";

const CUSTOMER_ID_KEY = "cafe_customer_id";

/**
 * Get existing customerId or create a new one
 */
export function getCustomerId() {
  let customerId = localStorage.getItem(CUSTOMER_ID_KEY);

  if (!customerId) {
    customerId = uuidv4();
    localStorage.setItem(CUSTOMER_ID_KEY, customerId);
  }

  return customerId;
}

/**
 * Clear customerId (future use: logout, reset, etc.)
 */
export function clearCustomerId() {
  localStorage.removeItem(CUSTOMER_ID_KEY);
}
