import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Profile from "./admin/pages/Profile";
import Orders from "./admin/pages/Orders";
import AdminProducts from "./admin/pages/Products";
import Concerns from "./admin/pages/Concerns";
import Payments from "./admin/pages/AdminPayments";
import AdminLogin from "./admin/pages/AdminLogin";

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
  return localStorage.getItem("admin") === "true";
});

  useEffect(() => {
    const admin = localStorage.getItem("admin") === "true";
    setIsAdmin(admin);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin setIsAdmin={setIsAdmin} />}
        />

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            isAdmin
              ? <Navigate to="/admin" />
              : <Navigate to="/admin-login" />
          }
        />

        {/* PROTECTED */}
        <Route
          path="/admin"
          element={
            isAdmin
              ? <AdminLayout setIsAdmin={setIsAdmin} />
              : <Navigate to="/admin-login" />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="concerns" element={<Concerns />} />
          <Route path="payments" element={<Payments />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;