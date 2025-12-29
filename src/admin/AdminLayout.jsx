import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, padding: 16, borderRight: "1px solid #ddd" }}>
        <h3>Admin Panel</h3>

        <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <NavLink
            to="/admin/categories"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "700" : "400",
            })}
          >
            Categories
          </NavLink>

          <NavLink
            to="/admin/products"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "700" : "400",
            })}
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            style={({ isActive }) => ({
              textDecoration: "none",
              fontWeight: isActive ? "700" : "400",
            })}
          >
            Orders
          </NavLink>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
