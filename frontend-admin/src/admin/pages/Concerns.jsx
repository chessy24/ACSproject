import { useEffect, useState } from "react";
import backendUrl from "../../config"; // adjust path if needed

export default function Concerns() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contact`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading messages...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Customer Concerns</h1>
        <span style={styles.badge}>
          {messages.length} Messages
        </span>
      </div>

      {/* EMPTY STATE */}
      {messages.length === 0 ? (
        <div style={styles.empty}>
          No messages yet
        </div>
      ) : (
        <div style={styles.list}>
          {messages.map((msg) => (
            <div key={msg._id} style={styles.card}>

              {/* TOP */}
              <div style={styles.top}>
                <div>
                  <h3 style={styles.name}>{msg.name}</h3>
                  <p style={styles.email}>{msg.email}</p>
                </div>

                <span style={styles.time}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* MESSAGE */}
              <div style={styles.messageBox}>
                {msg.message}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f1f5f9",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },

  badge: {
    background: "#021150",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  card: {
    background: "white",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  name: {
    margin: 0,
    fontSize: "16px",
    color: "#0f172a",
  },

  email: {
    fontSize: "12px",
    color: "#64748b",
  },

  time: {
    fontSize: "11px",
    color: "#94a3b8",
  },

  messageBox: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1e293b",
    lineHeight: "1.5",
    borderLeft: "4px solid #021150",
  },

  loading: {
    padding: "30px",
    fontSize: "16px",
    color: "#64748b",
  },

  empty: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
};