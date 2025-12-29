import { useEffect, useState } from "react";
import apiClient from "../axios";
import "./ProductAdminPage.css";

export default function ProductAdminPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    ad: "",
    fiyat: "",
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
    if (!kategoriId) return;
    setLoading(true);

    try {
      const res = await apiClient.get(`/menu/api/Urun/${kategoriId}`);
      setProducts(res.data || []);
    } catch {
      setError("Ürünler alınamadı");
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

  /* -------------------- FORM -------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ ad: "", fiyat: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  /* -------------------- CRUD -------------------- */
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/menu/api/Urun", {
        ...formData,
        kategoriId: selectedCategoryId,
      });
      setSuccess("Ürün eklendi");
      resetForm();
      fetchProducts(selectedCategoryId);
    } catch {
      setError("Ürün eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put("/menu/api/Urun", {
        ...formData,
        id: editingId,
        kategoriId: selectedCategoryId,
      });
      setSuccess("Ürün güncellendi");
      resetForm();
      fetchProducts(selectedCategoryId);
    } catch {
      setError("Ürün güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ürün silinsin mi?")) return;

    setLoading(true);
    try {
      await apiClient.delete(`/menu/api/Urun?id=${id}`);
      setSuccess("Ürün silindi");
      fetchProducts(selectedCategoryId);
    } catch {
      setError("Ürün silinemedi");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setFormData({ ad: product.ad, fiyat: product.fiyat });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Product Management</h2>

      {/* CATEGORY SELECT */}
      <div className="product-toolbar">
        <select
          className="category-select"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Kategori seç</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.ad}
            </option>
          ))}
        </select>

        {selectedCategoryId && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Yeni Ürün Ekle
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* FORM */}
      {showForm && (
        <div className="form-container">
          <h3>{editingId ? "Ürün Güncelle" : "Ürün Ekle"}</h3>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label>Ürün Adı</label>
              <input
                name="ad"
                value={formData.ad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fiyat</label>
              <input
                type="number"
                name="fiyat"
                value={formData.fiyat}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Güncelle" : "Oluştur"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Fiyat</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.ad}</td>
              <td>{p.fiyat}</td>
              <td className="actions">
                <button
                  className="btn btn-small btn-edit"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}
