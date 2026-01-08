import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder, getOrderById } from "../services/orderService";
import "./OrderAdminPage.css";

/* ===========================
   STATUS ENUM MAPPING
=========================== */
const OrderStatus = {
  Created: 0,
  Preparing: 1,
  Ready: 2,
  Delivered: 3,
  Cancelled: 4,
};

const StatusLabels = {
  0: "Created",
  1: "Preparing",
  2: "Ready",
  3: "Delivered",
  4: "Cancelled",
};

const StatusColors = {
  0: "status-created", // Gray
  1: "status-preparing", // Orange
  2: "status-ready", // Blue
  3: "status-delivered", // Green
  4: "status-cancelled", // Red
};

export default function OrderAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  /* ===========================
     FETCH ORDERS
  =========================== */
  const fetchOrders = async (silent = false) => {
    // silent=true ise sadece background refresh, loading gösterme
    if (!silent) {
      setLoading(true);
    }
    setError("");

    try {
      const data = await getAllOrders();
      if (!Array.isArray(data)) {
        setOrders([]);
        return;
      }
      setOrders(data);
    } catch (err) {
      console.error("❌ ADMIN fetchOrders error:", err);
      setError("Siparişler yüklenemedi");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===========================
     STATUS UPDATE
  =========================== */
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    try {
      // Backend'e status update gönder
      await updateOrderStatus(orderId, newStatus);
      
      // Backend'e kaydedildi, şimdi güncel veriyi backend'den çek (silent mode - sadece background refresh)
      await fetchOrders(true);
    } catch (err) {
      console.error("❌ Status update error:", err);
      setError("Durum güncellenemedi");
      // Hata durumunda da listeyi yeniden fetch et (eski haline dönsün)
      await fetchOrders(true);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  /* ===========================
     DELETE ORDER
  =========================== */
  const handleDelete = async (orderId) => {
    if (!window.confirm("Bu siparişi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteOrder(orderId);
      await fetchOrders();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Sipariş silinemedi");
    }
  };

  /* ===========================
     VIEW ORDER DETAIL
  =========================== */
  const handleViewOrder = async (orderId) => {
    // Önce listeden order'ı bul
    const orderFromList = orders.find((o) => o.id === orderId);
    
    if (orderFromList && orderFromList.orderItems && orderFromList.orderItems.length > 0) {
      // Liste'de orderItems varsa direkt kullan
      setSelectedOrderId(orderId);
      setShowModal(true);
    } else {
      // Liste'de detay yoksa fetch et (orderItems eksik olabilir)
      try {
        const order = await getOrderById(orderId);
        // Fetch edilen order'ı listeye ekle/güncelle
        setOrders((prevOrders) => {
          const existingIndex = prevOrders.findIndex((o) => o.id === orderId);
          if (existingIndex >= 0) {
            // Mevcut order'ı güncelle
            return prevOrders.map((o) => (o.id === orderId ? order : o));
          } else {
            // Yeni order ekle
            return [...prevOrders, order];
          }
        });
        setSelectedOrderId(orderId);
        setShowModal(true);
      } catch (err) {
        console.error("❌ Get order detail error:", err);
        setError("Sipariş detayları yüklenemedi");
      }
    }
  };

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
      return "-";
    }
    return `${amount.toFixed(2)} ₺`;
  };

  const formatOrderSummary = (orderItems) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return "Ürün bilgisi yok";
    }
    return orderItems
      .map((item) => `${item.quantity}x ${item.productName}`)
      .join(", ");
  };

  const formatOrderNo = (orderId) => {
    if (!orderId) return "N/A";
    return orderId.slice(0, 8).toUpperCase();
  };

  const formatCustomerId = (customerId) => {
    if (!customerId) return "N/A";
    return customerId.slice(0, 8).toUpperCase();
  };

  // Modal için order'ı bul (TEK SOURCE OF TRUTH)
  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;

  // Order bulunamazsa modal'ı kapat
  useEffect(() => {
    if (showModal && selectedOrderId && !selectedOrder) {
      setShowModal(false);
      setSelectedOrderId(null);
    }
  }, [showModal, selectedOrderId, selectedOrder]);

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Sipariş Yönetimi</h2>
        <button className="btn btn-refresh" onClick={fetchOrders} disabled={loading}>
          {loading ? "Yükleniyor..." : "Yenile"}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" onClick={() => setError("")}>
          {error}
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="loading">Siparişler yükleniyor...</div>
      )}

      {!loading && orders.length === 0 && (
        <div className="empty-state">Henüz sipariş bulunmuyor</div>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Tarih</th>
                <th>Müşteri</th>
                <th>Sipariş Özeti</th>
                <th>Toplam</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const orderNo = formatOrderNo(order.id);
                const customerId = formatCustomerId(order.customerId);
                const summary = formatOrderSummary(order.orderItems);
                const status = order.status ?? 0;
                const statusLabel = StatusLabels[status] || "Unknown";
                const statusColorClass = StatusColors[status] || "status-default";
                const isUpdating = updatingStatus[order.id] || false;

                return (
                  <tr key={order.id}>
                    <td className="order-id-cell">{orderNo}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="customer-id-cell">{customerId}</td>
                    <td className="order-summary-cell">{summary}</td>
                    <td className="amount-cell">{formatMoney(order.totalAmount)}</td>
                    <td className="status-cell">
                      <select
                        className={`status-select ${statusColorClass}`}
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(order.id, parseInt(e.target.value))
                        }
                        disabled={isUpdating}
                      >
                        <option value={OrderStatus.Created}>Created</option>
                        <option value={OrderStatus.Preparing}>Preparing</option>
                        <option value={OrderStatus.Ready}>Ready</option>
                        <option value={OrderStatus.Delivered}>Delivered</option>
                        <option value={OrderStatus.Cancelled}>Cancelled</option>
                      </select>
                    </td>
                    <td className="actions-cell">
                      <div className="actions">
                        <button
                          className="btn btn-small btn-view"
                          onClick={() => handleViewOrder(order.id)}
                          title="Detayları Görüntüle"
                        >
                          Görüntüle
                        </button>
                        <button
                          className="btn btn-small btn-delete"
                          onClick={() => handleDelete(order.id)}
                          title="Sil"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ORDER DETAIL MODAL */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setSelectedOrderId(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sipariş Detayları</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrderId(null);
                }}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Sipariş ID:</span>
                  <span className="detail-value">{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tarih:</span>
                  <span className="detail-value">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Müşteri ID:</span>
                  <span className="detail-value">{selectedOrder.customerId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Durum:</span>
                  <span className="detail-value">
                    <span
                      className={`status-badge ${
                        StatusColors[selectedOrder.status] || "status-default"
                      }`}
                    >
                      {StatusLabels[selectedOrder.status] || "Unknown"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Sipariş Ürünleri</h4>
                {selectedOrder.orderItems &&
                Array.isArray(selectedOrder.orderItems) &&
                selectedOrder.orderItems.length > 0 ? (
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Ürün Adı</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.orderItems.map((item, idx) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={idx}>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{formatMoney(item.unitPrice)}</td>
                            <td className="amount-cell">{formatMoney(lineTotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-items">Ürün bilgisi bulunamadı</div>
                )}
              </div>

              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label amount-large">Genel Toplam:</span>
                  <span className="detail-value amount-large">
                    {formatMoney(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrderId(null);
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
