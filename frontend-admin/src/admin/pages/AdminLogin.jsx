import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setIsAdmin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 HARDCODED ADMIN ACCOUNT
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "123456";

    if (
      form.username === ADMIN_USER &&
      form.password === ADMIN_PASS
    ) {
      localStorage.setItem("admin", "true");

      setIsAdmin(true); // 🔥 THIS IS THE FIX

      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2>Admin Login</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={styles.input}
          required
        />

        {/* PASSWORD FIELD */}
        <div style={styles.passwordBox}>
          <input
            name="password"
            type={showPassword ? "text" : "password"} // 👈 TOGGLE
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
    gap: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  passwordBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  toggle: {
    position: "absolute",
    right: "10px",
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