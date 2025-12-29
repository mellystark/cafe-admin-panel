import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // --------------------------------
      // STATE
      // --------------------------------
      items: [],

      // --------------------------------
      // ADD TO CART
      // --------------------------------
      addToCart: (product) =>
        set((state) => {
          console.log("🛒 ADD TO CART CALLED WITH:", product);

          if (!product?.id) {
            console.error("❌ addToCart: product.id missing", product);
            return state;
          }

          const price = Number(product.price);

          if (Number.isNaN(price)) {
            console.error("❌ addToCart: invalid price", product.price);
            return state;
          }

          const existing = state.items.find(
            (i) => i.id === product.id
          );

          if (existing) {
            console.log("➕ Product already in cart, increasing quantity");

            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          console.log("✅ New product added to cart");

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: price, // 🔥 price ASLA değişmez
                quantity: 1,
              },
            ],
          };
        }),

      // --------------------------------
      // INCREASE QUANTITY
      // --------------------------------
      increase: (productId) =>
        set((state) => {
          console.log("➕ INCREASE:", productId);

          return {
            items: state.items.map((i) =>
              i.id === productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }),

      // --------------------------------
      // DECREASE QUANTITY
      // --------------------------------
      decrease: (productId) =>
        set((state) => {
          console.log("➖ DECREASE:", productId);

          return {
            items: state.items
              .map((i) =>
                i.id === productId
                  ? { ...i, quantity: i.quantity - 1 }
                  : i
              )
              .filter((i) => i.quantity > 0),
          };
        }),

      // --------------------------------
      // REMOVE ITEM
      // --------------------------------
      remove: (productId) =>
        set((state) => {
          console.log("🗑 REMOVE:", productId);

          return {
            items: state.items.filter(
              (i) => i.id !== productId
            ),
          };
        }),

      // --------------------------------
      // CLEAR CART
      // --------------------------------
      clear: () => {
        console.log("🧹 CART CLEARED");
        set({ items: [] });
      },

      // --------------------------------
      // DEBUG HELPER
      // --------------------------------
      logCart: () => {
        console.log("📦 CURRENT CART STATE:", get().items);
      },
    }),
    {
      name: "cart",

      // 🔥 Persist güvenliği
      version: 1,

      migrate: (persistedState) => {
        console.warn(
          "♻️ Migrating old cart state, resetting items"
        );

        return {
          ...persistedState,
          items: [], // eski price=0 datalarını temizler
        };
      },
    }
  )
);
