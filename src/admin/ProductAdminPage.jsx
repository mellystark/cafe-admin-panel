import { useEffect, useState } from "react";
import apiClient from "../axios";
import { deleteProduct } from "../services/productService";
import "./ProductAdminPage.css";

export default function ProductAdminPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  const [formData, setFormData] = useState({
    ad: "",
    fiyat: "",
    resimUrl: "",
  });

  /* -------------------- FETCH -------------------- */
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/menu/api/Kategori");
      setCategories(res.data || []);
    } catch {
      setError("Kategori listesi alınamadı");
    }
  };

  const fetchProducts = async (kategoriId) => {
    if (!kategoriId) {
      setProducts([]);
      setFilteredProducts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient.get(`/menu/api/Urun/${kategoriId}`);
      const productsData = res.data || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch {
      setError("Ürünler alınamadı");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategoryId);
  }, [selectedCategoryId]);

  /* -------------------- SEARCH & FILTER -------------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.ad?.toLowerCase().includes(query) ||
        p.fiyat?.toString().includes(query)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  /* -------------------- FORM -------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ ad: "", fiyat: "", resimUrl: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  /* -------------------- CRUD -------------------- */
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/menu/api/Urun", {
        ...formData,
        kategoriId: selectedCategoryId,
      });
      setSuccess("Ürün başarıyla eklendi");
      resetForm();
      fetchProducts(selectedCategoryId);
    } catch (err) {
      setError(err.response?.data?.message || "Ürün eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.put("/menu/api/Urun", {
        ...formData,
        id: editingId,
        kategoriId: selectedCategoryId,
      });
      setSuccess("Ürün başarıyla güncellendi");
      resetForm();
      fetchProducts(selectedCategoryId);
    } catch (err) {
      setError(err.response?.data?.message || "Ürün güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Ürün başarıyla silindi");
      fetchProducts(selectedCategoryId);
    } catch (err) {
      setError(err.response?.data?.message || "Ürün silinemedi");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setFormData({ 
      ad: product.ad || "", 
      fiyat: product.fiyat || "", 
      resimUrl: product.resimUrl || "" 
    });
    setEditingId(product.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.ad || "Bilinmeyen Kategori";
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" && typeof price !== "string") return "-";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `${numPrice.toFixed(2)} ₺`;
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Ürün Yönetimi</h2>
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Tablo Görünümü"
          >
            📊
          </button>
          <button
            className={`view-mode-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
            title="Kart Görünümü"
          >
            🎴
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="product-toolbar">
        <div className="toolbar-left">
          <select
            className="category-select"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSearchQuery("");
            }}
          >
            <option value="">Kategori Seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ad}
              </option>
            ))}
          </select>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedCategoryId}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="toolbar-right">
          {selectedCategoryId && (
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              disabled={loading}
            >
              + Yeni Ürün Ekle
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" onClick={() => setError("")}>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" onClick={() => setSuccess("")}>
          {success}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="form-container">
          <div className="form-header">
            <h3>{editingId ? "Ürün Güncelle" : "Yeni Ürün Ekle"}</h3>
            <button className="form-close" onClick={resetForm}>
              ×
            </button>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                name="ad"
                value={formData.ad}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Örn: Latte"
              />
            </div>

            <div className="form-group">
              <label>Fiyat (₺)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="fiyat"
                value={formData.fiyat}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Örn: 25.50"
              />
            </div>

            <div className="form-group">
              <label>Resim URL</label>
              <input
                type="url"
                name="resimUrl"
                value={formData.resimUrl}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/image.jpg"
              />
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Ürün resminin URL adresini giriniz
              </small>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Kaydediliyor..."
                  : editingId
                  ? "Güncelle"
                  : "Oluştur"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={loading}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONTENT */}
      {!selectedCategoryId && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>Lütfen bir kategori seçin</p>
        </div>
      )}

      {selectedCategoryId && loading && filteredProducts.length === 0 && (
        <div className="loading">Ürünler yükleniyor...</div>
      )}

      {selectedCategoryId &&
        !loading &&
        filteredProducts.length === 0 &&
        searchQuery && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>"{searchQuery}" için sonuç bulunamadı</p>
          </div>
        )}

      {selectedCategoryId &&
        !loading &&
        filteredProducts.length === 0 &&
        !searchQuery && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>Bu kategoride henüz ürün yok</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              İlk Ürünü Ekle
            </button>
          </div>
        )}

      {/* TABLE VIEW */}
      {selectedCategoryId &&
        !loading &&
        filteredProducts.length > 0 &&
        viewMode === "table" && (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Ürün Adı</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="product-image-cell">
                      <div className="product-image-wrapper">
                        {p.resimUrl ? (
                          <img
                            src={p.resimUrl}
                            alt={p.ad}
                            className="product-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}
                        <div className="product-image-placeholder">
                          📦
                        </div>
                      </div>
                    </td>
                    <td className="product-name-cell">
                      <strong>{p.ad}</strong>
                    </td>
                    <td>{getCategoryName(selectedCategoryId)}</td>
                    <td className="product-price-cell">
                      {formatPrice(p.fiyat)}
                    </td>
                    <td>
                      <span className="status-badge status-active">Aktif</span>
                    </td>
                    <td className="actions-cell">
                      <div className="actions">
                        <button
                          className="btn btn-small btn-edit"
                          onClick={() => startEdit(p)}
                          title="Düzenle"
                        >
                          ✏️ Düzenle
                        </button>
                        <button
                          className="btn btn-small btn-delete"
                          onClick={() => handleDelete(p.id)}
                          title="Sil"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {/* CARD VIEW */}
      {selectedCategoryId &&
        !loading &&
        filteredProducts.length > 0 &&
        viewMode === "card" && (
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-card-image">
                  <div className="product-card-image-wrapper">
                    {p.resimUrl ? (
                      <img
                        src={p.resimUrl}
                        alt={p.ad}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="product-card-image-placeholder">📦</div>
                  </div>
                </div>
                <div className="product-card-body">
                  <h3 className="product-card-name">{p.ad}</h3>
                  <div className="product-card-meta">
                    <span className="product-card-category">
                      {getCategoryName(selectedCategoryId)}
                    </span>
                    <span className="product-card-price">
                      {formatPrice(p.fiyat)}
                    </span>
                  </div>
                  <div className="product-card-status">
                    <span className="status-badge status-active">Aktif</span>
                  </div>
                  <div className="product-card-actions">
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => startEdit(p)}
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
