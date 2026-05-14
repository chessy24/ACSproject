import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  MessageSquare,
  CreditCard,
  BarChart3,
} from "lucide-react";
import png from "../../assets/about-image.png";

const SIDEBAR_WIDTH = 150;

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    setOpen(false);
  };

  // 🔥 FULL SCROLL LOCK FIX (mobile safe)
  useEffect(() => {
    const root = document.getElementById("root");

    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      if (root) {
        root.style.overflow = "hidden";
        root.style.height = "100vh";
      }
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      if (root) {
        root.style.overflow = "auto";
        root.style.height = "auto";
      }
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      if (root) {
        root.style.overflow = "auto";
        root.style.height = "auto";
      }
    };
  }, [open]);

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={styles.overlay}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* TOGGLE */}
        <div onClick={() => setOpen(!open)} style={styles.toggleTab}>
          {open ? "❮" : "❯"}
        </div>

        <div style={styles.logoContainer}>
          <img src={png} alt="image" style={styles.image} />
        </div>

        <h2 style={styles.title}>Admin</h2>

        <Link to="/admin" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin") ? styles.active : {}) }}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/admin/orders" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin/orders") ? styles.active : {}) }}>
          <ShoppingCart size={18} />
          Orders
        </Link>

        <Link to="/admin/products" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin/products") ? styles.active : {}) }}>
          <Package size={18} />
          Products
        </Link>

        <Link to="/admin/concerns" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin/concerns") ? styles.active : {}) }}>
          <MessageSquare size={18} />
          Concerns
        </Link>

        <Link to="/admin/payments" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin/payments") ? styles.active : {}) }}>
          <CreditCard size={18} />
          Payments
        </Link>

        <Link to="/admin/sales-report" onClick={handleNavClick} style={{ ...styles.item, ...(isActive("/admin/sales-report") ? styles.active : {}) }}>
          <BarChart3 size={18} />
          Sales Report
        </Link>

        <Link
          to="/admin/inventory-report"
          onClick={handleNavClick}
          style={{
            ...styles.item,
            ...(isActive("/admin/inventory-report")
              ? styles.active
              : {}),
          }}
        >
          <BarChart3 size={18} />
          Inventory Report
        </Link>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.4)",
    zIndex: 999,
  },

  sidebar: {
    width: "150px",
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
    boxShadow: "2px 0 15px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },

  title: {
    color: "white",
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
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
    position: "absolute",
    right: "-18px",
    top: "20px",
    width: "18px",
    height: "38px",
    background: "#444",
    borderRadius: "0 6px 6px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "12px",
    color: "white",
    zIndex: 1100,
  },

  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },

  image: {
    width: "70px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "8px",
  },
};