import { useEffect, useState } from "react";
import backendUrl from "../../config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [openStatus, setOpenStatus] = useState(null);

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
      const res = await fetch(`${backendUrl}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

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

  const statusOptions = ["Pending", "Shipped", "Delivered"];
  const compartmentOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const filteredOrders = orders
    .filter((o) =>
      filter === "All" ? true : o.status === filter
    )
    .filter((o) => {
      const k = search.toLowerCase();
      return (
        o.userId?.name?.toLowerCase().includes(k) ||
        o.userId?.email?.toLowerCase().includes(k) ||
        o._id?.toLowerCase().includes(k)
      );
    });

  const getCount = (status) =>
    status === "All"
      ? orders.length
      : orders.filter((o) => o.status === status).length;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Orders</h1>

      {/* SEARCH */}
      <input
        placeholder="Search name, email, order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* TABS */}
      <div style={styles.tabs}>
        {["All", "Pending", "Shipped", "Delivered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.tab,
              background: filter === tab ? "#111827" : "#e5e7eb",
              color: filter === tab ? "#fff" : "#111827",
            }}
          >
            {tab} ({getCount(tab)})
          </button>
        ))}
      </div>

      {/* ORDERS */}
      {filteredOrders.map((order) => (
        <div key={order._id} style={styles.card}>
          
          {/* HEADER */}
          <div style={styles.header}>
            
            {/* LEFT SIDE */}
            <div style={styles.left}>
              <p style={styles.name}>
                {order.userId?.name || "Unknown"}
              </p>

              <p style={styles.small}>
                {order.userId?.email || "—"}
              </p>

              <p style={styles.small}>
                Order #{order._id.slice(-6)}
              </p>

              <p style={styles.total}>₱{order.total}</p>

              <p style={styles.password}>
                Password: {order.compartmentPassword || "—"}
              </p>

              {order.userId?.idImage ? (
                <div
                  style={styles.idBox}
                  onClick={() => setSelectedImage(order.userId.idImage)}
                >
                  View ID
                </div>
              ) : (
                <p style={styles.noId}>No ID uploaded</p>
              )}
            </div>

            {/* RIGHT BADGES */}
            <div style={styles.badges}>
              
              {/* STATUS */}
              <div style={{ position: "relative" }}>
                <div
                  onClick={() =>
                    setOpenStatus(
                      openStatus === order._id ? null : order._id
                    )
                  }
                  style={{
                    ...styles.statusPill,
                    background:
                      order.status === "Delivered"
                        ? "#22c55e"
                        : order.status === "Shipped"
                        ? "#3b82f6"
                        : "#f59e0b",
                  }}
                >
                  {order.status}
                </div>

                {openStatus === order._id && (
                  <div style={styles.dropdown}>
                    {statusOptions.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          updateOrder(order._id, { status: s });
                          setOpenStatus(null);
                        }}
                        style={styles.dropdownItem}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PAYMENT */}
              <span
                style={{
                  ...styles.badge,
                  background:
                    order.paymentStatus === "Approved"
                      ? "#22c55e"
                      : order.paymentStatus === "Rejected"
                      ? "#ef4444"
                      : "#f59e0b",
                }}
              >
                {order.paymentStatus}
              </span>

              {/* COMP */}
              <span style={styles.comp}>
                Comp #{order.compartment || "—"}
              </span>
            </div>
          </div>

          {/* COMPARTMENT SELECT */}
          <select
            value={order.compartment || ""}
            onChange={(e) =>
              updateOrder(order._id, {
                compartment: e.target.value,
                compartmentPassword: order.compartmentPassword,
              })
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

      {/* MODAL */}
      {selectedImage && (
        <div style={styles.modal} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} style={styles.fullImage} />
        </div>
      )}
    </div>
  );
}

export default Orders;

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "20px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  search: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginBottom: "15px",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  tab: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
  },

  left: {
    minWidth: "220px",
  },

  name: {
    fontSize: "15px",
    fontWeight: "700",
  },

  small: {
    fontSize: "12px",
    color: "#6b7280",
  },

  total: {
    fontSize: "15px",
    fontWeight: "700",
    marginTop: "4px",
  },

  password: {
    fontSize: "12px",
    background: "#111827",
    color: "white",
    padding: "4px 8px",
    borderRadius: "8px",
    display: "inline-block",
    marginTop: "5px",
  },

  badges: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },

  statusPill: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    color: "white",
    fontWeight: "600",
  },

  comp: {
    background: "#6366f1",
    color: "white",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "11px",
  },

  dropdown: {
    position: "absolute",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    width: "120px",
    marginTop: "5px",
    zIndex: 10,
  },

  dropdownItem: {
    padding: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  select: {
    marginTop: "8px",
    padding: "8px",
    width: "100%",
    maxWidth: "220px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },

  item: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    background: "#f9fafb",
    padding: "8px",
    borderRadius: "8px",
  },

  img: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
  },

  idBox: {
    width: "80px",
    height: "34px",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginTop: "6px",
    fontSize: "12px",
  },

  noId: {
    fontSize: "12px",
    color: "gray",
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