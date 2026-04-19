import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, MessageSquare, CreditCard } from "lucide-react";
import png from "../../assets/about-image.png";


const SIDEBAR_WIDTH = 150;

export default function Sidebar({ open, setOpen }) {

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        ...styles.sidebar,
        transform: open ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      {/* TOGGLE (NOW INSIDE SIDEBAR = PERFECT ALIGNMENT) */}
      <div
        onClick={() => setOpen(!open)}
        style={styles.toggleTab}
      >
        {open ? "❮" : "❯"}
      </div>

      <div style={styles.logoContainer}>
        <img src={png} alt="image" style={styles.image} />
      </div>

      <h2 style={styles.title}>Admin</h2>

      <Link
        to="/admin"
        style={{
          ...styles.item,
          ...(isActive("/admin") ? styles.active : {}),
        }}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        to="/admin/orders"
        style={{
          ...styles.item,
          ...(isActive("/admin/orders") ? styles.active : {}),
        }}
      >
        <ShoppingCart size={18} />
        Orders
      </Link>

      <Link
        to="/admin/products"
        style={{
          ...styles.item,
          ...(isActive("/admin/products") ? styles.active : {}),
        }}
      >
        <Package size={18} />
        Products
      </Link>

      <Link
        to="/admin/concerns"
        style={{
          ...styles.item,
          ...(isActive("/admin/concerns") ? styles.active : {}),
        }}
      >
        <MessageSquare size={18} />
        Concerns
      </Link>

      <Link
        to="/admin/payments"
        style={{
          ...styles.item,
          ...(isActive("/admin/payments") ? styles.active : {}),
        }}
      >
        <CreditCard size={18} />
        Payments
      </Link>

    </div>
  );
}

const styles = {
  sidebar: {
    width: `${SIDEBAR_WIDTH}px`,
    height: "100vh",
    background: "#6D8196",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "transform 0.3s ease",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },

  title: {
    color: "white",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "600",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    color: "white",
    textDecoration: "none",
    background: "rgba(255,255,255,0.08)",
  },

  active: {
    background: "white",
    color: "#6D8196",
    fontWeight: "600",
  },

  toggleTab: {
    position: "absolute",   // 👈 KEY FIX
    right: "-18px",        // 👈 ALWAYS STICKS TO EDGE
    top: "20px",
    width: "18px",
    height: "38px",
    background: "#555353",
    borderRadius: "0 6px 6px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
    color: "white",
    zIndex: 1100,
  },
  image: {
    width: "70px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
  },
};