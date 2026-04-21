import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../../config"; // adjust path if needed

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT LOGIN / REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? `${backendUrl}/api/auth/login`
      : `${backendUrl}/api/auth/register`;

    const payload = isLogin
      ? {
        email: form.email,
        password: form.password,
      }
      : form;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Error");
      }

      // ✅ SAVE TOKEN + USER (THIS FIXES YOUR NAVBAR ISSUE)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert(data.message || "Success");
      navigate("/");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* TOGGLE */}
        <div style={styles.toggle}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              ...styles.toggleBtn,
              background: isLogin ? "#021150" : "#eee",
              color: isLogin ? "white" : "black",
            }}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            style={{
              ...styles.toggleBtn,
              background: !isLogin ? "#021150" : "#eee",
              color: !isLogin ? "white" : "black",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* NAME (ONLY SIGNUP) */}
          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
          )}

          {/* EMAIL */}
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          {/* PASSWORD */}
          <div style={styles.passwordBox}>
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* SUBMIT */}
          <button style={styles.button}>
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p
            onClick={() => window.location.href = "https://admin.acsonline.shop/admin-login"}
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: "#021150",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            Are you an admin?
          </p>

        </form>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },

  card: {
    width: "350px",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },

  toggle: {
    display: "flex",
    marginBottom: "15px",
  },

  toggleBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  passwordBox: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  eye: {
    position: "absolute",
    right: "10px",
    cursor: "pointer",
    fontSize: "18px",
    userSelect: "none",
  },

  button: {
    padding: "10px",
    background: "#021150",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  adminBtn: {
    marginTop: "5px",
    padding: "10px",
    background: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};