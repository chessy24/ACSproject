import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ LOGO IMPORT
import logo from "../../assets/about-image.png";

export default function AdminLogin({ setIsAdmin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "123456";

    if (
      form.username === ADMIN_USER &&
      form.password === ADMIN_PASS
    ) {
      localStorage.setItem("admin", "true");
      setIsAdmin(true);
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>

        {/* LOGO */}
        <div style={styles.logoBox}>
          <img src={logo} alt="logo" style={styles.logo} />
        </div>

        <h2 style={{ color: "black" }}>Admin Login</h2>

        {/* USERNAME */}
        <div style={styles.inputWrapper}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* PASSWORD */}
        <div style={styles.inputWrapper}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.toggle}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button style={styles.button}>Login</button>
      </form>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f4f6",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  logoBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },

  logo: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
  },

  /* ✅ FIXED WRAPPER */
  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  /* ✅ FIXED INPUT */
  input: {
    width: "100%",
    padding: "10px",
    paddingRight: "55px", // space for "Show"
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },

  /* ✅ FIXED TOGGLE */
  toggle: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "12px",
    color: "#3b82f6",
    fontWeight: "bold",
  },

  button: {
    padding: "10px",
    background: "#000080",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};