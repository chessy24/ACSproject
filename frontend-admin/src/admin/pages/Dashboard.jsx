import { useEffect, useState } from "react";
import backendUrl from "../../config";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statusStats, setStatusStats] = useState({
    Pending: 0,
    Shipped: 0,
    Delivered: 0,
    Compartment: 0,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // SCREEN DETECT
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/orders`);
        const data = await res.json();

        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);

        const total = ordersArray.reduce(
          (sum, o) => sum + (o.total || 0),
          0
        );
        setTotalRevenue(total);

        const stats = {
          Pending: 0,
          Shipped: 0,
          Delivered: 0,
          Compartment: 0,
        };

        ordersArray.forEach((o) => {
          if (o.status === "Pending") stats.Pending++;
          else if (o.status === "Shipped") stats.Shipped++;
          else if (o.status === "Delivered") stats.Delivered++;

          if (o.compartment) stats.Compartment++;
        });

        setStatusStats(stats);
      } catch (err) {
        console.log(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      style={{
        ...styles.page,
        padding: isMobile ? "20px" : "30px",
      }}
    >
      <h1
        style={{
          ...styles.title,
          fontSize: isMobile ? "22px" : "28px",
        }}
      >
        Admin Dashboard
      </h1>

      {/* SUMMARY */}
      <div
        style={{
          ...styles.summary,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={styles.card}>
          <h3>Total Orders</h3>
          <p style={styles.big}>{orders.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Revenue</h3>
          <p style={styles.big}>₱{totalRevenue}</p>
        </div>
      </div>

      {/* STATUS */}
      <div style={styles.statusSection}>
        <h2>Status Overview</h2>

        <div
          style={{
            ...styles.statusGrid,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...styles.statusCard, background: "#fbbf24" }}>
            <h4>Pending</h4>
            <p>{statusStats.Pending}</p>
          </div>

          <div style={{ ...styles.statusCard, background: "#3b82f6", color: "white" }}>
            <h4>Shipped</h4>
            <p>{statusStats.Shipped}</p>
          </div>

          <div style={{ ...styles.statusCard, background: "#22c55e", color: "white" }}>
            <h4>Delivered</h4>
            <p>{statusStats.Delivered}</p>
          </div>

          <div style={{ ...styles.statusCard, background: "#6366f1", color: "white" }}>
            <h4>With Compartment</h4>
            <p>{statusStats.Compartment}</p>
          </div>
        </div>
      </div>

      {/* ORDERS */}
      <div style={styles.list}>
        <h2>Recent Orders</h2>

        {orders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            style={{
              ...styles.orderCard,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? "8px" : "0",
            }}
          >
            <div>
              <p><b>Order:</b> #{order._id.slice(-6)}</p>
              <p>₱{order.total}</p>
            </div>

            <div>
              <span style={styles.status}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    fontWeight: "700",
    marginBottom: "20px",
  },

  summary: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    flex: 1,
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  big: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px",
  },

  statusSection: {
    marginBottom: "30px",
  },

  statusGrid: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
  },

  statusCard: {
    flex: "1 1 45%", // 👈 auto wrap on mobile
    padding: "15px",
    borderRadius: "10px",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "16px",
  },

  list: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },

  orderCard: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  status: {
    background: "#3b82f6",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },
};