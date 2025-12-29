import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchProductsByCategory } from '../services/menuService';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import './MenuPage.css';
import { getCustomerId } from "../utils/customer";
import { useCartStore } from "../store/cartStore";


const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');

  const cartCount = useCartStore((s) => s.items.length);


  const navigate = useNavigate();

  console.log("CUSTOMER ID:", getCustomerId());

  // ------------------------------
  // INITIAL LOAD
  // ------------------------------
  useEffect(() => {


    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ------------------------------
  // LOAD PRODUCTS BY CATEGORY
  // ------------------------------
  const handleSelectCategory = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setProductsLoading(true);
    setError('');

    try {
      const data = await fetchProductsByCategory(categoryId);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // ------------------------------
  // ADD TO CART
  // ------------------------------
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAddToCart = (product) => {
    console.log("CART PAYLOAD:", {
      id: product.id,
      name: product.ad,
      price: product.fiyat,
    });


    addToCart({
      id: product.id,          // ⚠️ MUTLAKA id
      name: product.ad,
      price: product.fiyat,
    });
  };


  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>Cafe Menu</h1>

        <div className="menu-header-actions">
          <button
            className="cart-button"
            onClick={() => navigate('/orders')}
          >
            📦 Siparişlerim
          </button>

          <button
            className="cart-button"
            onClick={() => navigate('/cart')}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="menu-content">
        <CategoryList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          loading={categoriesLoading}
        />

        {selectedCategoryId && (
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            loading={productsLoading}
          />
        )}

        {!selectedCategoryId && !categoriesLoading && (
          <div className="select-category-message">
            Please select a category to view products
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;



