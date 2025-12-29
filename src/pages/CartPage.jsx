import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { createOrderFromCart } from "../services/orderService";
import { useCustomerStore } from "../store/customerStore";
import { useCartStore } from "../store/cartStore";
import CartSummary from "../components/CartSummary";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();

  // 🟢 ZUSTAND STATE
  const cart = useCartStore((s) => s.items);
  const increase = useCartStore((s) => s.increase);
  const decrease = useCartStore((s) => s.decrease);
  const remove = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);
  const customerId = useCustomerStore((s) => s.customerId);


  // LOCAL UI STATE
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!customerId) {
      setError("Customer information is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🧨 HANDLE CHECKOUT CALLED");
      console.log("🛒 CART ITEMS:", cart);

      const response = await createOrderFromCart(cart, addressText);

      clearCart();
      navigate(`/order-success/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError("Order could not be created");
    } finally {
      setLoading(false);
    }
  };



  // EMPTY STATE
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <header className="cart-header">
          <h1>Your Cart</h1>
          <button
            className="back-button"
            onClick={() => navigate("/menu")}
          >
            Back to Menu
          </button>
        </header>

        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            className="back-to-menu-button"
            onClick={() => navigate("/menu")}
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
          onClick={() => navigate("/menu")}
        >
          Back to Menu
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <CartSummary
        cart={cart}
        onIncrease={increase}
        onDecrease={decrease}
        onRemove={remove}
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
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default CartPage;

