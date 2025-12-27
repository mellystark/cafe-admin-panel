import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer routes (public) */}
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-success/:orderId?" element={<OrderSuccess />} />
        
        {/* Admin routes (protected) */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
        {/* Default route - redirect to menu for customers */}
        <Route path="/" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


