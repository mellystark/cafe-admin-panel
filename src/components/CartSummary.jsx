import './CartSummary.css';

const CartSummary = ({ cart, onIncrease, onDecrease, onRemove }) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.fiyat !== undefined ? item.fiyat : (item.price || 0);
      return total + price * item.quantity;
    }, 0);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-summary empty">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => {
          const price = item.fiyat !== undefined ? item.fiyat : (item.price || 0);
          const name = item.ad || item.name || item.urunAdi || 'Product';
          
          return (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-price">₺{price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => onDecrease(item.id)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => onIncrease(item.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-total">₺{(price * item.quantity).toFixed(2)}</p>
                <button
                  className="remove-button"
                  onClick={() => onRemove(item.id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        <p className="total-label">Total:</p>
        <p className="total-amount">₺{calculateTotal().toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartSummary;




