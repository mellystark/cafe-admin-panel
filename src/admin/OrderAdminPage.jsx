import { useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";
import "./OrderAdminPage.css";

/* ===========================
   STATUS MAP (STRING)
=========================== */
const StatusClassMap = {
  Created: "status-pending",
  Pending: "status-pending",
  Preparing: "status-preparing",
  Completed: "status-completed",
  Cancelled: "status-cancelled",
};

export default function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===========================
     FETCH ORDERS (ADMIN LIST)
  =========================== */
  const fetchOrders = async () => {
    console.log("🟡 ADMIN → fetchOrders başladı");
    setLoading(true);
    setError("");

    try {
      const data = await getAllOrders();
      console.log("🟢 ADMIN BACKEND RESPONSE:", data);

      if (!Array.isArray(data)) {
        console.error("❌ Admin orders array değil:", data);
        setOrders([]);
        return;
      }

      setOrders(data);
      console.log("✅ ADMIN orders state set edildi:", data);
    } catch (err) {
      console.error("❌ ADMIN fetchOrders error:", err);
      setError("Siparişler yüklenemedi");
    } finally {
      setLoading(false);
      console.log("🔵 ADMIN → fetchOrders bitti");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===========================
     HELPERS
  =========================== */
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount) => {
    if (typeof amount !== "number" || amount <= 0) {
      console.warn("⚠️ ADMIN totalAmount geçersiz:", amount);
      return "-";
    }

    return `${amount.toFixed(2)} ₺`;
  };

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="admin-container">
      <h2 className="admin-title">Order Management</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading">Yükleniyor...</div>}

      {!loading && orders.length === 0 && (
        <div className="empty-state">Sipariş yok</div>
      )}

      {!loading && orders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              console.log("🧾 ADMIN RENDER ORDER:", {
                id: order?.id,
                totalAmount: order?.totalAmount,
                status: order?.status,
                hasItems: Array.isArray(order?.orderItems),
              });

              if (!order?.orderItems) {
                console.warn(
                  "ℹ️ ADMIN LIST → orderItems bilinçli olarak yok (detail endpoint’te var)"
                );
              }

              return (
                <tr key={order?.id ?? index}>
                  <td>{order?.id ? `${order.id.slice(0, 8)}…` : "N/A"}</td>
                  <td>
                    {order?.customerId
                      ? `${order.customerId.slice(0, 8)}…`
                      : "N/A"}
                  </td>
                  <td>{formatDate(order?.createdAt)}</td>
                  <td>{formatMoney(order?.totalAmount)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        StatusClassMap[order?.status] ?? "status-default"
                      }`}
                    >
                      {order?.status ?? "Unknown"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
