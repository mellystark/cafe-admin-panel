import { useParams, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Order Created Successfully!</h1>
        <p className="success-message">
          Thank you for your order. {orderId && `Your order ID is: ${orderId}`}
        </p>
        {orderId && (
          <div className="order-id">
            <strong>Order ID:</strong> {orderId}
          </div>
        )}
        <div className="success-actions">
          <button className="back-to-menu-button" onClick={() => navigate('/menu')}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;





