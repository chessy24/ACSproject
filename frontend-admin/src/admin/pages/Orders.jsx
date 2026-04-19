import { useEffect, useState } from "react";
import backendUrl from "../../config"; // adjust path if needed

function Orders() {
  const [orders, setOrders] = useState([]);
  const [passwordInputs, setPasswordInputs] = useState({});

  useEffect(() => {
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

    fetchOrders();
  }, []);

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

      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated : o))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const statusOptions = ["Pending", "Shipped", "Delivered"];
  const compartmentOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Orders</h1>

      {orders.map((order) => (
        <div key={order?._id || index} style={styles.card}>

          <div style={styles.header}>
            <div>
              <p>Order #{order?._id?.slice(-6) || "N/A"}</p>
              <p>Total: ₱{order.total}</p>
            </div>

            <div style={styles.badges}>
              <span style={styles.badge}>
                {order.status}
              </span>
              <span style={styles.comp}>
                Compartment #{order.compartment || "—"}
              </span>
            </div>
          </div>

          {/* STATUS */}
          <select
            value={order.status}
            onChange={(e) =>
              updateOrder(order._id, { status: e.target.value })
            }
            style={styles.select}
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* COMPARTMENT */}
          <select
            value={order.compartment || ""}
            onChange={(e) =>
              updateOrder(order._id, { compartment: e.target.value })
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

          {/* COMPARTMENT PASSWORD */}
          <input
            type="text"
            placeholder="Compartment Password"
            value={passwordInputs[order._id] ?? order.compartmentPassword ?? ""}
            onChange={(e) =>
              setPasswordInputs((prev) => ({
                ...prev,
                [order._id]: e.target.value,
              }))
            }
            onBlur={() => {
  const password = passwordInputs[order._id] ?? "";

  if (password.trim() === "") return;

  updateOrder(order._id, {
    compartmentPassword: password,
  });

  // 🔥 keep UI in sync
  setOrders((prev) =>
    prev.map((o) =>
      o._id === order._id
        ? { ...o, compartmentPassword: password }
        : o
    )
  );
}}
          />

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
    </div>
  );
}

export default Orders;

const styles = {
  page: { padding: "30px", background: "#f3f4f6", minHeight: "100vh" },

  title: { fontSize: "28px", fontWeight: "700" },

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
  },

  item: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    background: "#f9fafb",
    padding: "8px",
    borderRadius: "8px",
  },

  input: {
    marginTop: "8px",
    padding: "8px",
    width: "200px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  password: {
    fontSize: "12px",
    background: "#111827",
    color: "white",
    padding: "4px 8px",
    borderRadius: "10px",
  },

  img: { width: "40px", height: "40px", borderRadius: "6px" },
};