import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../../config";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    idImage: null,
  });

  const [idWarning, setIdWarning] = useState(false);

  const navigate = useNavigate();

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "idImage") {
      setForm({ ...form, idImage: files[0] });
      setIdWarning(false);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* =========================
     SUBMIT LOGIN / REGISTER
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && !form.email.endsWith("@rtu.edu.ph")) {
      return alert("Only @rtu.edu.ph emails are allowed");
    }

    const url = isLogin
      ? `${backendUrl}/api/auth/login`
      : `${backendUrl}/api/auth/register`;

    try {
      let options;

      /* =========================
         LOGIN
      ========================= */
      if (isLogin) {
        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        };
      }

      /* =========================
         REGISTER
      ========================= */
      else {
        const formData = new FormData();
        formData.append("name", form.name.trim());
        formData.append("email", form.email.trim());
        formData.append("password", form.password);

        if (form.idImage) {
          formData.append("idImage", form.idImage);
        } else {
          setIdWarning(true);
        }

        options = {
          method: "POST",
          body: formData,
        };
      }

      const res = await fetch(url, options);
      const data = await res.json();

      console.log("AUTH RESPONSE:", data);

      /* =========================
         HANDLE ERROR
      ========================= */
      if (!res.ok) {
        return alert(data.message || "Authentication failed");
      }

      /* =========================
         SAVE TOKEN (IMPORTANT FIX)
      ========================= */
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      /* =========================
         SAVE USER
      ========================= */
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      /* =========================
         CONFIRM STORAGE
      ========================= */
      console.log("TOKEN STORED:", localStorage.getItem("token"));

      alert(data.message || "Success");

      navigate("/");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Server error");
    }
  };

  /* =========================
     UI
  ========================= */
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

          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
            />
          )}

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.inputWrapper}>
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

          {!isLogin && (
            <>
              <input
                type="file"
                name="idImage"
                accept="image/*"
                onChange={handleChange}
              />

              {idWarning && (
                <p style={styles.warning}>
                  ⚠️ Please upload ID (required for checkout)
                </p>
              )}
            </>
          )}

          <button style={styles.button}>
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p
            onClick={() =>
              (window.location.href =
                "https://admin.acsonline.shop/admin-login")
            }
            style={styles.adminText}
          >
            Are you an admin?
          </p>

        </form>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
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

  inputWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  button: {
    padding: "10px",
    background: "#021150",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  warning: {
    fontSize: "12px",
    color: "red",
  },

  adminText: {
    marginTop: "10px",
    textAlign: "center",
    color: "#021150",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
};