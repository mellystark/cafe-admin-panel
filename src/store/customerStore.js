// src/store/customerStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const generateCustomerId = () =>
  `customer-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const generateBackendCustomerId = () =>
  crypto.randomUUID(); // 🔥 backend uyumlu GUID

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      // 🔵 ESKİ (bozulmadı)
      customerId: null,

      // 🟢 YENİ (backend için)
      backendCustomerId: null,

      initCustomer: () => {
        // ---- ESKİ DAVRANIŞ ----
        let id = get().customerId;
        if (!id) {
          id = generateCustomerId();
          set({ customerId: id });
        }

        // ---- YENİ EK ----
        let backendId = get().backendCustomerId;
        if (!backendId) {
          backendId = generateBackendCustomerId();
          set({ backendCustomerId: backendId });
        }

        return id;
      },
    }),
    {
      name: "cafe_customer",
    }
  )
);
