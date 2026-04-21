import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [open, setOpen] = useState(false); // profile dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // sync user
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // detect screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false); // reset menu on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");

    setUser(null);
    setOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>E-VEND</h2>

      {/* HAMBURGER */}
      {isMobile && (
        <div
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      )}

      {/* DESKTOP LINKS */}
      {!isMobile && (
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </div>
      )}

      {/* DESKTOP AUTH */}
      {!isMobile && (
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
      )}

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/about" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Contact</Link>

          {!user ? (
            <Link
              to="/login"
              style={styles.authBtnMobile}
              onClick={() => setMenuOpen(false)}
            >
              Create Account / Log in
            </Link>
          ) : (
            <>
              <p style={styles.mobileUser}>{user.name}</p>

              <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Profile
              </Link>

              <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                My Cart 🛒
              </Link>

              <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>

              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

/* STYLES */
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
    background: "#021150",
    color: "white",
    alignItems: "center",
    position: "relative",
  },

  logo: {
    margin: 0,
    color: "white",
  },

  hamburger: {
    fontSize: "26px",
    cursor: "pointer",
  },

  links: {
    display: "flex",
    gap: "20px",
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

  userBox: {
    position: "relative",
  },

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
    width: "100%",
  },

  /* MOBILE */
  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    width: "100%",
    background: "#021150",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    gap: "10px",
    zIndex: 999,
  },

  mobileLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  authBtnMobile: {
    background: "#aa3bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "10px",
  },

  mobileUser: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: "10px",
  },
};