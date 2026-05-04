import { useEffect, useState } from "react";
import backendUrl from "../../config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // 🔥 modal state

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...data } : o))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignCompartment = (order, value) => {
    updateOrder(order._id, {
      compartment: value,
      compartmentPassword: order.compartmentPassword,
    });
  };

  const statusOptions = ["Pending", "Shipped", "Delivered"];
  const compartmentOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Orders</h1>

      {orders.map((order) => (
        <div key={order._id} style={styles.card}>

          <div style={styles.header}>
            <div>
              <p>User: {order.userId?.name || "Unknown"}</p>
              <p>Email: {order.userId?.email || "—"}</p>

              {/* 🔥 VIEW ID BUTTON */}
              {order.userId?.idImage ? (
                <div
                  style={styles.idBox}
                  onClick={() => setSelectedImage(order.userId.idImage)}
                >
                  View ID
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "gray" }}>
                  No ID uploaded
                </p>
              )}

              <p>Order #{order._id.slice(-6)}</p>
              <p>Total: ₱{order.total}</p>

              <p style={styles.password}>
                Password: {order.compartmentPassword || "—"}
              </p>
            </div>

            <div style={styles.badges}>
              <span style={styles.badge}>{order.status}</span>

              <span
                style={{
                  ...styles.badge,
                  background:
                    order.paymentStatus === "Approved"
                      ? "#22c55e"
                      : "#ef4444",
                  color: "white",
                }}
              >
                {order.paymentStatus}
              </span>

              <span style={styles.comp}>
                Compartment #{order.compartment || "—"}
              </span>
            </div>
          </div>

          {/* STATUS */}
          <select
            value={order.status}
            disabled={
              order.status === "Delivered" ||
              order.paymentStatus !== "Approved"
            }
            onChange={(e) => {
              const newStatus = e.target.value;

              if (order.status === "Delivered") {
                alert("⚠️ This order is already delivered and cannot be changed.");
                return;
              }

              if (
                newStatus === "Delivered" &&
                order.paymentStatus !== "Approved"
              ) {
                alert("❌ Cannot mark Delivered without approved payment");
                return;
              }

              if (newStatus === "Delivered") {
                const confirmAction = window.confirm(
                  "⚠️ This action will deduct stock and cannot be undone. Continue?"
                );

                if (!confirmAction) return;
              }

              updateOrder(order._id, { status: newStatus });
            }}
            style={{
              ...styles.select,
              background:
                order.status === "Delivered" ? "#e5e7eb" : "#fff",
              cursor:
                order.status === "Delivered" ? "not-allowed" : "pointer",
            }}
          >
            {statusOptions.map((s) => (
              <option
                key={s}
                value={s}
                disabled={
                  s === "Delivered" &&
                  order.paymentStatus !== "Approved"
                }
              >
                {s}
              </option>
            ))}
          </select>

          {/* COMPARTMENT */}
          <select
            value={order.compartment || ""}
            onChange={(e) =>
              handleAssignCompartment(order, e.target.value)
            }
            style={styles.select}
          >
            <option value="">Select Compartment</option>
            {compartmentOptions.map((c) => (
              <option key={c} value={c}>
                Compartment {c}
              </option>
            ))}
          </select>

          {/* ITEMS */}
          <div>
            {(order.items || []).map((item, i) => (
              <div key={i} style={styles.item}>
                <img src={item.image} style={styles.img} />
                <div>
                  <p>{item.name}</p>
                  <p>₱{item.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}

      {/* 🔥 IMAGE MODAL */}
      {selectedImage && (
        <div
          style={styles.modal}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} style={styles.fullImage} />
        </div>
      )}
    </div>
  );
}

export default Orders;

/* STYLES */
const styles = {
  page: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
  },

  badges: {
    display: "flex",
    gap: "8px",
  },

  badge: {
    background: "#fbbf24",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  comp: {
    background: "#3b82f6",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },

  select: {
  marginTop: "8px",
  padding: "8px",
  width: "200px",

  /* 🔥 FIX VISIBILITY */
  backgroundColor: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
},

option: {
  color: "#111827",
  backgroundColor: "#ffffff",
},

  item: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    background: "#f9fafb",
    padding: "8px",
    borderRadius: "8px",
  },

  password: {
    fontSize: "12px",
    background: "#111827",
    color: "white",
    padding: "4px 8px",
    borderRadius: "10px",
    marginTop: "5px",
    display: "inline-block",
  },

  img: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
  },

  /* 🔥 SMALL CLICKABLE ID BOX */
  idBox: {
    width: "80px",
    height: "40px",
    borderRadius: "8px",
    background: "#021150",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "5px",
    fontSize: "12px",
  },

  /* 🔥 MODAL */
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