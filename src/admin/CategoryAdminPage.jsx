import { useState, useEffect } from 'react';
import apiClient from '../axios';
import './AdminPage.css';

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ad: '' });
  const [showForm, setShowForm] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/menu/api/Kategori');
      setCategories(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSuccess('');
  };

  // Handle create
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.post('/menu/api/Kategori', formData);
      setSuccess('Category created successfully');
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.put('/menu/api/Kategori', {
        ...formData,
        id: editingId,
      });
      setSuccess('Category updated successfully');
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiClient.delete(`/menu/api/Kategori?id=${id}`);
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (category) => {
    setFormData({ ad: category.ad || '' });
    setEditingId(category.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Cafe Admin Panel</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
          disabled={loading}
        >
          Add New Category
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Category' : 'Create Category'}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="ad"
                value={formData.ad}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="categories-container">
        <h2>Categories</h2>
        {loading && !categories.length && <div className="loading">Loading...</div>}
        
        {!loading && categories.length === 0 && (
          <div className="empty-state">No categories found</div>
        )}

        {categories.length > 0 && (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.ad}</td>
                  <td>
                    <button
                      onClick={() => startEdit(category)}
                      className="btn btn-small btn-edit"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn btn-small btn-delete"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryAdminPage;




