// src/services/orderService.js
import { publicHttp } from "../api/publicHttp";
import { adminHttp } from "../api/adminHttp";
import { useCustomerStore } from "../store/customerStore";

// ==================== CUSTOMER ORDER FUNCTIONS ====================

export const createOrder = async (payload) => {
  const backendCustomerId =
    useCustomerStore.getState().backendCustomerId;

  const res = await publicHttp.post("/order/api/Order", {
    ...payload,
    customerId: backendCustomerId, // 🔥 kritik düzeltme
  });

  return res.data;
};

export const createOrderFromCart = (cartItems, addressText) => {
  console.log("🔥 createOrderFromCart CALLED");
  const backendCustomerId =
    useCustomerStore.getState().backendCustomerId;

  const firstItem = cartItems[0];

  const payload = {
    customerId: backendCustomerId,
    productId: firstItem.id,
    productName: firstItem.name,
    quantity: firstItem.quantity,
    unitPrice: firstItem.price,
    addressText,
  };

  console.log("🟢 CREATE ORDER PAYLOAD:", payload);

  return publicHttp.post("/order/api/Order", payload);
};

export const fetchOrdersByCustomer = async () => {
  const backendCustomerId =
    useCustomerStore.getState().backendCustomerId;

  const res = await publicHttp.get(
    `/order/api/Order/customer/${backendCustomerId}`
  );

  return res.data;
};

// ==================== ADMIN ORDER FUNCTIONS ====================

/**
 * Get all orders (ADMIN only)
 * GET /api/Order
 */
export const getAllOrders = async () => {
  const res = await adminHttp.get("/order/api/Order");
  return res.data;
};

/**
 * Get order by ID
 * GET /api/Order/{orderId}
 */
export const getOrderById = async (orderId) => {
  const res = await adminHttp.get(`/order/api/Order/${orderId}`);
  return res.data;
};

/**
 * Update order status
 * PUT /api/Order/{orderId}/status
 * @param {string} orderId - Order ID
 * @param {number} status - OrderStatus enum: 0=Pending, 1=Preparing, 2=Completed, 3=Cancelled
 */
export const updateOrderStatus = async (orderId, status) => {
  const res = await adminHttp.put(`/order/api/Order/${orderId}/status`, {
    status,
  });
  return res.data;
};

/**
 * Delete order (ADMIN only)
 * DELETE /api/Order/{orderId}
 */
export const deleteOrder = async (orderId) => {
  const res = await adminHttp.delete(`/order/api/Order/${orderId}`);
  return res.data;
};

