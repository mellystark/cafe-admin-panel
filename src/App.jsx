import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrdersPage from "./pages/MyOrdersPage";

import { AuthProvider } from "./auth/AuthProvider";
import { RequireAdmin } from "./auth/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import CategoryAdminPage from "./admin/CategoryAdminPage";
import ProductAdminPage from "./admin/ProductAdminPage";
import OrderAdminPage from "./admin/OrderAdminPage";

import { useCustomerStore } from "./store/customerStore";

function App() {
  const initCustomer = useCustomerStore((s) => s.initCustomer);

  // 🔥 CUSTOMER INIT (ÇOK ÖNEMLİ)
  useEffect(() => {
    initCustomer();
  }, [initCustomer]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ===================== */}
          {/* PUBLIC (CUSTOMER) */}
          {/* ===================== */}
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route
            path="/order-success/:orderId?"
            element={<OrderSuccess />}
          />

          {/* ===================== */}
          {/* ADMIN AUTH */}
          {/* ===================== */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* ===================== */}
          {/* ADMIN (PROTECTED) */}
          {/* ===================== */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="/admin/categories" replace />} />
            <Route path="categories" element={<CategoryAdminPage />} />
            <Route path="products" element={<ProductAdminPage />} />
            <Route path="orders" element={<OrderAdminPage />} />
          </Route>

          {/* ===================== */}
          {/* DEFAULT */}
          {/* ===================== */}
          <Route path="/" element={<Navigate to="/menu" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
