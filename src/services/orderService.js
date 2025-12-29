// src/services/orderService.js
import { publicHttp } from "../api/publicHttp";
import { useCustomerStore } from "../store/customerStore";

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

