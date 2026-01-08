import { NavLink, Outlet } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">☕</div>
          <h2 className="logo-text">Cafe Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">📁</span>
            <span className="nav-text">Categories</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Products</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">🧾</span>
            <span className="nav-text">Orders</span>
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
