import React, { useEffect, useState } from "react";
import { fetchOrdersByCustomer } from "../services/orderService";
import { useCustomerStore } from "../store/customerStore";
import "./MyOrdersPage.css";
import { useNavigate } from "react-router-dom";


const MyOrdersPage = () => {
  const navigate = useNavigate();
  /* ===========================
     STORE & CUSTOMER ID
  =========================== */
  const { customerId, backendCustomerId } = useCustomerStore();
  const effectiveCustomerId = backendCustomerId ?? customerId;

  console.log("🟡 STORE IDS:", {
    customerId,
    backendCustomerId,
    effectiveCustomerId,
  });

  /* ===========================
     STATE
  =========================== */
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ===========================
     FETCH ORDERS
  =========================== */
  useEffect(() => {
    if (!effectiveCustomerId) {
      console.warn("⚠️ effectiveCustomerId yok, fetch iptal");
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      console.log("🟢 loadOrders başladı");
      try {
        setIsLoading(true);
        setError(null);

        console.log(
          "➡️ fetchOrdersByCustomer çağrılıyor:",
          effectiveCustomerId
        );

        const data = await fetchOrdersByCustomer(effectiveCustomerId);

        console.log("🟢 BACKEND RESPONSE (RAW):", data);

        if (!Array.isArray(data)) {
          console.error("❌ Backend array dönmedi:", data);
          return;
        }

        if (isMounted) {
          setOrders(data);
          console.log("✅ orders state set edildi:", data);
        }
      } catch (err) {
        console.error("❌ Orders fetch error:", err);
        if (isMounted) {
          setError("Siparişler yüklenirken bir hata oluştu.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("🔵 loadOrders bitti");
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [effectiveCustomerId]);

  /* ===========================
     HELPERS
  =========================== */
  const formatDate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderItems = (order) => {
    console.log("📦 ORDER RAW:", order);

    if (Array.isArray(order?.items)) {
      console.log("📦 items kullanılıyor:", order.items);
      return order.items;
    }

    if (Array.isArray(order?.products)) {
      console.log("📦 products kullanılıyor:", order.products);
      return order.products;
    }

    console.warn("⚠️ Order içinde items/products yok");
    return [];
  };

  const getItemName = (item) => {
    const name = item?.productName || item?.name || "Ürün adı belirtilmemiş";
    if (!item?.productName && !item?.name) {
      console.warn("⚠️ Ürün adı yok:", item);
    }
    return name;
  };

  const getItemPrice = (item) => {
    const price =
      item?.price ??
      item?.unitPrice ??
      item?.unit_price ??
      0;

    if (price === 0) {
      console.warn("⚠️ Fiyat 0 veya undefined:", item);
    }

    return price;
  };

  const getItemQuantity = (item) => {
    const quantity = item?.quantity ?? 1;

    if (item?.quantity == null) {
      console.warn("⚠️ Quantity yok, default 1 alındı:", item);
    }

    return quantity;
  };

  const calculateTotal = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      console.warn("⚠️ Total hesaplanamadı, items boş");
      return null;
    }

    const total = items.reduce((sum, item) => {
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);
      return sum + price * quantity;
    }, 0);

    console.log("🧮 Calculated total:", total);
    return total > 0 ? total : null;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      0: "Created",
      1: "Preparing",
      2: "Ready",
      3: "Delivered",
      4: "Cancelled",
    };
    return statusMap[status] || "Created";
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      0: "status-created",
      1: "status-preparing",
      2: "status-ready",
      3: "status-delivered",
      4: "status-cancelled",
    };
    return statusClassMap[status] || "status-created";
  };

  /* ===========================
     RENDER
  =========================== */
  return (
    <div className="my-orders-page">
      <div className="my-orders-header">
        <h1 className="my-orders-title">Geçmiş Siparişlerim</h1>

        <button
          className="back-button"
          onClick={() => navigate("/menu")}
        >
          Back to Menu
        </button>
      </div>


      {isLoading && (
        <div className="orders-loading">
          <div className="loading-text">Siparişleriniz yükleniyor...</div>
        </div>
      )}

      {!isLoading && error && (
        <div className="orders-error">{error}</div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="orders-empty-state">
          <div className="empty-icon">🛒</div>
          <h2 className="empty-title">Henüz siparişiniz yok</h2>
          <p className="empty-description">
            Verdiğiniz siparişler burada listelenecek.
          </p>
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order, index) => {
            const id = order?.id ?? `order-${index}`;
            const createdAtLabel = formatDate(order?.createdAt);
            const items = getOrderItems(order);
            const total = calculateTotal(items);

            console.log("🧾 RENDER ORDER:", {
              id,
              createdAtLabel,
              items,
              total,
            });

            const orderStatus = order?.status ?? 0;
            const statusLabel = getStatusLabel(orderStatus);
            const statusClass = getStatusClass(orderStatus);

            return (
              <div key={id} className="order-card">
                <div className="order-header">
                  {createdAtLabel && (
                    <div className="order-date-header">
                      {createdAtLabel}
                    </div>
                  )}
                  <span className={`order-status-badge ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="order-products">
                  {items.length > 0 ? (
                    items.map((item, idx) => {
                      const name = getItemName(item);
                      const price = getItemPrice(item);
                      const quantity = getItemQuantity(item);

                      console.log("📌 ITEM:", {
                        name,
                        price,
                        quantity,
                        raw: item,
                      });

                      return (
                        <div key={idx} className="order-product-row">
                          <div className="product-main">
                            <span className="product-name">{name}</span>
                            <span className="product-meta">
                              {quantity} × {price.toFixed(2)} ₺
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="order-product-row muted">
                      Ürün bilgisi bulunamadı
                    </div>
                  )}
                </div>

                {total !== null && (
                  <div className="order-total">
                    <span className="total-label">Toplam</span>
                    <span className="total-amount">
                      {total.toFixed(2)} ₺
                    </span>
                  </div>
                )}

                {order?.id && (
                  <div className="order-meta">
                    <span className="order-id">
                      Sipariş No: {order.id.slice(0, 8).toUpperCase()}…
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
