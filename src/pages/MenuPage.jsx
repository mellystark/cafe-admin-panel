import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, fetchProductsByCategory } from '../services/menuService';
import { getCart, saveCart } from '../utils/cartStorage';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import './MenuPage.css';

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState('');

  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  // ------------------------------
  // INITIAL LOAD
  // ------------------------------
  useEffect(() => {
    setCartCount(getCart().length);

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
  const handleAddToCart = (product) => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    saveCart(updatedCart);
    setCartCount(updatedCart.length);
  };

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>Cafe Menu</h1>

        <button
          className="cart-button"
          onClick={() => navigate('/cart')}
        >
          🛒 Cart ({cartCount})
        </button>
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
