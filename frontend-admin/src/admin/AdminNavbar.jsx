import { useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 150;

export default function AdminNavbar({ open, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("admin");

  if (setIsAdmin) {
    setIsAdmin(false); // update React state if available
  }

  window.location.href = "/admin-login"; // 🔥 force redirect
};

  return (
    <div
      style={{
        ...styles.nav,
        paddingLeft: open ? `${SIDEBAR_WIDTH + 20}px` : "20px",
      }}
    >
      <h3>Admin Panel</h3>

      <div style={styles.right}>

        {/* 👤 ADMIN NAME */}
        <div style={styles.profile}>
          <div style={styles.avatar}>A</div>
          <span>Admin</span>
        </div>

        {/* 🚪 LOGOUT */}
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>

      </div>
    </div>
  );
}

const styles = {
  nav: {
    height: "60px",
    background: "#000080",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  logout: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};