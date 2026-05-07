import { useEffect, useState } from "react";
import backendUrl from "../../config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [openStatus, setOpenStatus] = useState(null);
  const [openComp, setOpenComp] = useState(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
              ...o,
              ...data,
            }
            : o
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
     CLAIM APPROVE / REJECT
  ========================= */

  const updateClaimStatus = async (id, claimStatus) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/orders/${id}/claim-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ claimStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      alert(`Claim ${claimStatus}`);

      fetchOrders();
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const statusOptions = [
    "Pending",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const compartmentOptions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#22c55e";

      case "Shipped":
        return "#3b82f6";

      case "Cancelled":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

  const getClaimColor = (status) => {
    switch (status) {
      case "Approved":
        return "#22c55e";

      case "Rejected":
        return "#ef4444";

      default:
        return "#f59e0b";
    }
  };

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
        {[
          "All",
          "Pending",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              ...styles.tab,
              background:
                filter === tab ? "#111827" : "#e5e7eb",
              color:
                filter === tab ? "#fff" : "#111827",
            }}
          >
            {tab} ({getCount(tab)})
          </button>
        ))}
      </div>

      {/* ORDERS */}
      {filteredOrders.map((order) => (
        <div key={order._id} style={styles.card}>
          <div style={styles.header}>

            {/* LEFT */}
            <div style={styles.left}>

              <div style={styles.field}>
                <span style={styles.label}>Name</span>

                <span style={styles.value}>
                  {order.userId?.name || "Unknown"}
                </span>
              </div>

              <div style={styles.field}>
                <span style={styles.label}>Email</span>

                <span style={styles.value}>
                  {order.userId?.email || "—"}
                </span>
              </div>

              <div style={styles.field}>
                <span style={styles.label}>Order</span>

                <span style={styles.value}>
                  #{order._id.slice(-6)}
                </span>
              </div>

              <div style={styles.field}>
                <span style={styles.label}>Total</span>

                <span style={styles.price}>
                  ₱{order.total}
                </span>
              </div>

              <div style={styles.field}>
                <span style={styles.label}>Password</span>

                <span style={styles.password}>
                  {order.compartmentPassword || "—"}
                </span>
              </div>

              {/* TIMESTAMP */}
              <div style={styles.field}>
                <span style={styles.label}>Created</span>

                <span style={styles.value}>
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </span>
              </div>

              {/* USER ID */}
              {order.userId?.idImage ? (
                <div
                  style={styles.idBox}
                  onClick={() =>
                    setSelectedImage(
                      order.userId.idImage
                    )
                  }
                >
                  View ID
                </div>
              ) : (
                <p style={styles.noId}>
                  No ID uploaded
                </p>
              )}

              {/* CLAIM PHOTO */}
              {order.claimProof && (
                <div style={styles.claimSection}>
                  <p style={styles.claimTitle}>
                    Customer Claim Proof
                  </p>

                  <img
                    src={order.claimProof}
                    alt="claim"
                    style={styles.claimImage}
                    onClick={() =>
                      setSelectedImage(
                        order.claimPhoto
                      )
                    }
                  />

                  <div
                    style={{
                      ...styles.claimStatus,
                      background: getClaimColor(
                        order.claimStatus
                      ),
                    }}
                  >
                    {order.claimStatus || "Pending"}
                  </div>

                  {/* CLAIM TIMESTAMP */}
                  <p style={styles.claimTime}>
                    {order.claimSubmittedAt
                      ? new Date(order.claimSubmittedAt).toLocaleString()
                      : ""}
                  </p>

                  {/* BUTTONS */}
                  {order.claimStatus !== "Approved" && (
                    <div style={styles.claimBtns}>
                      <button
                        style={styles.approveBtn}
                        onClick={() =>
                          updateClaimStatus(
                            order._id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        style={styles.rejectBtn}
                        onClick={() =>
                          updateClaimStatus(
                            order._id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div style={styles.statusGroup}>

              {/* ORDER STATUS */}
              <div style={styles.statusBlock}>
                <p style={styles.smallLabel}>
                  Order
                </p>

                <div
                  onClick={() =>
                    setOpenStatus(
                      openStatus === order._id
                        ? null
                        : order._id
                    )
                  }
                  style={{
                    ...styles.pill,
                    background: getStatusColor(
                      order.status
                    ),
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
                          updateOrder(order._id, {
                            status: s,
                          });

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
              <div style={styles.statusBlock}>
                <p style={styles.smallLabel}>
                  Payment
                </p>

                <div
                  style={{
                    ...styles.pill,
                    cursor: "default",

                    background:
                      order.paymentStatus ===
                        "Approved"
                        ? "#22c55e"
                        : order.paymentStatus ===
                          "Rejected"
                          ? "#ef4444"
                          : "#f59e0b",
                  }}
                >
                  {order.paymentStatus}
                </div>
              </div>

              {/* COMPARTMENT */}
              <div style={styles.statusBlock}>
                <p style={styles.smallLabel}>
                  Comp
                </p>

                <div
                  onClick={() =>
                    setOpenComp(
                      openComp === order._id
                        ? null
                        : order._id
                    )
                  }
                  style={styles.compPill}
                >
                  #{order.compartment || "—"}
                </div>

                {openComp === order._id && (
                  <div style={styles.compDropdown}>
                    {compartmentOptions.map(
                      (c) => (
                        <div
                          key={c}
                          onClick={() => {
                            updateOrder(
                              order._id,
                              {
                                compartment:
                                  c,

                                compartmentPassword:
                                  order.compartmentPassword,
                              }
                            );

                            setOpenComp(null);
                          }}
                          style={
                            styles.dropdownItem
                          }
                        >
                          Compartment {c}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div>
            {(order.items || []).map((item, i) => (
              <div key={i} style={styles.item}>
                <img
                  src={item.image}
                  style={styles.img}
                />

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
        <div
          style={styles.modal}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            style={styles.fullImage}
          />
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
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "12px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "200px",
    flex: 1,
  },

  field: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  label: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600",
    minWidth: "70px",
  },

  value: {
    fontSize: "13px",
    fontWeight: "500",
  },

  price: {
    fontSize: "14px",
    fontWeight: "700",
  },

  password: {
    fontSize: "12px",
    background: "#111827",
    color: "white",
    padding: "2px 8px",
    borderRadius: "6px",
  },

  statusGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  statusBlock: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  smallLabel: {
    fontSize: "10px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  pill: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  compPill: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    background: "#6366f1",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    top: "55px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    width: "130px",
    zIndex: 10,
  },

  compDropdown: {
    position: "absolute",
    top: "55px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    width: "150px",
    zIndex: 10,
  },

  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    fontSize: "13px",
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

  claimSection: {
    marginTop: "15px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    maxWidth: "250px",
  },

  claimTitle: {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  claimImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
  },

  claimStatus: {
    marginTop: "10px",
    padding: "6px 12px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    textAlign: "center",
  },

  claimTime: {
    marginTop: "8px",
    fontSize: "11px",
    color: "#6b7280",
  },

  claimBtns: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  approveBtn: {
    flex: 1,
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  rejectBtn: {
    flex: 1,
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
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
    zIndex: 999,
  },

  fullImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "10px",
  },
};