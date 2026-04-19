import { useEffect, useState } from "react";
import backendUrl from "../../config"; // adjust path if needed

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

         const res = await fetch(`${backendUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <p>Failed to load user</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* AVATAR */}
        <div style={styles.avatar}>
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* INFO */}
        <h1 style={styles.title}>My Profile</h1>

        <div style={styles.infoBox}>
          <label style={styles.label}>Name</label>
          <p style={styles.value}>{user.name}</p>
        </div>

        <div style={styles.infoBox}>
          <label style={styles.label}>Email</label>
          <p style={styles.value}>{user.email}</p>
        </div>

      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    padding: "20px",
  },

  card: {
    width: "350px",
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#021150",
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
  },

  title: {
    marginBottom: "20px",
    color: "#0f172a",
  },

  infoBox: {
    textAlign: "left",
    marginBottom: "15px",
    padding: "10px",
    background: "#f9fafb",
    borderRadius: "10px",
  },

  label: {
    fontSize: "12px",
    color: "#6b7280",
  },

  value: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "5px 0 0 0",
  },

  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    color: "#6b7280",
  },
};