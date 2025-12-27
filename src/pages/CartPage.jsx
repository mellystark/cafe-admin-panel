import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { getCart, saveCart, clearCart, getCustomerId } from '../utils/cartStorage';
import CartSummary from '../components/CartSummary';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [addressText, setAddressText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load cart on mount
  useEffect(() => {
    setCart(getCart());
  }, []);

  // Sync with localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setCart(getCart());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleIncrease = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleDecrease = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (cart.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    // Backend tek ürün destekliyor
    const firstItem = cart[0];

    const orderData = {
      customerId: getCustomerId(),
      productId: firstItem.id,
      quantity: firstItem.quantity,
      addressText: addressText || ''
    };

    try {
      const response = await createOrder(orderData);
      clearCart();
      navigate(`/order-success/${response.id}`);
    } catch (err) {
      console.error(err);
      setError('Order could not be created');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <h1>Your Cart</h1>
          <button
          className="back-button"
          onClick={() => navigate('/menu')}
        >
          Back to Menu
        </button>
        </header>

        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            className="back-to-menu-button"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <button
          className="back-button"
          onClick={() => navigate('/menu')}
        >
          Back to Menu
        </button>

      </header>

      {error && <div className="error-message">{error}</div>}

      <CartSummary
        cart={cart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />

      <form className="checkout-form" onSubmit={handleCheckout}>
        <h2>Delivery Information</h2>

        <div className="form-group">
          <label htmlFor="addressText">Delivery Address</label>
          <textarea
            id="addressText"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            placeholder="Enter your delivery address"
            rows="3"
            className="form-textarea"
          />
        </div>

        <button
          type="submit"
          className="checkout-button"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CartPage;
