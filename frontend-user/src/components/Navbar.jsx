import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  // ✅ FIX: read user directly from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ FIX: listen for login changes
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ ADD THIS
  localStorage.removeItem("cart");  // optional but recommended
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>E-VEND</h2>

      {/* LINKS */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>

      {/* AUTH */}
      <div style={styles.auth}>

        {!user ? (
          <Link to="/login" style={styles.authBtn}>
            Create Account / Log in
          </Link>
        ) : (
          <div style={styles.userBox}>
            <div
              style={styles.userIcon}
              onClick={() => setOpen(!open)}
            >
              👤
            </div>

            {open && (
              <div style={styles.dropdown}>
                <p style={styles.userName}>{user.name}</p>

                <Link to="/profile" style={styles.dropItem}>
                  Profile
                </Link>

                <Link to="/cart" style={styles.dropItem}>
                  My Cart 🛒
                </Link>

                <Link to="/orders" style={styles.dropItem}>
                  My Orders
                </Link>


                <button onClick={logout} style={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}

/* STYLES */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#021150",
    color: "white",
    alignItems: "center",
  },

  logo: { margin: 0 },

  links: {
    display: "flex",
    gap: "15px",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
  },

  auth: {
    display: "flex",
    alignItems: "center",
  },

  authBtn: {
    background: "#aa3bff",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  userBox: { position: "relative" },

  userIcon: {
    fontSize: "22px",
    cursor: "pointer",
    background: "#fff",
    color: "#021150",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "45px",
    background: "white",
    color: "black",
    width: "160px",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },

  userName: {
    padding: "10px",
    fontWeight: "bold",
    borderBottom: "1px solid #eee",
  },

  dropItem: {
    padding: "10px",
    textDecoration: "none",
    color: "black",
  },

  logoutBtn: {
    padding: "10px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};