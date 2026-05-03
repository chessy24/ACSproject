import { useEffect, useState } from "react";
import backendUrl from "../../config";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${backendUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("AUTH ERROR:", data);
          setUser(null);
          return;
        }

        setUser(data);
      } catch (err) {
        console.log(err);
        setUser(null);
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
        <p>You are not logged in or session expired</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* PROFILE IMAGE / ID BOX */}
        {user.idImage ? (
          <div
            style={styles.idBox}
            onClick={() => setShowImage(true)}
          >
            <p style={{ fontSize: "12px", margin: 0 }}>View ID</p>
          </div>
        ) : (
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

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

      {/* FULL IMAGE MODAL */}
      {showImage && (
        <div style={styles.modal} onClick={() => setShowImage(false)}>
          <img
            src={user.idImage}
            alt="ID"
            style={styles.fullImage}
          />
        </div>
      )}
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
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#021150",
    color: "white",
    fontSize: "30px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
  },

  idBox: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    margin: "0 auto 15px auto",
    fontSize: "12px",
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

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  fullImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "10px",
  },
};