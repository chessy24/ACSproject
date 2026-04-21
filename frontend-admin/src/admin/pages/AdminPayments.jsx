import { useEffect, useState } from "react";
import backendUrl from "../../config"; // adjust path if needed

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/payments`);
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setPayments([]);
      }
    };

    fetchPayments();
  }, []);
  const updateStatus = async (id, status, rejectReason = "") => {
    try {
      const res = await fetch(`${backendUrl}/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status, rejectReason,
        }),
      });

      const updated = await res.json();

      // update UI instantly
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? updated : p))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Payment Proofs</h1>

      {payments.length === 0 ? (
        <div style={styles.empty}>
          No payments found
        </div>
      ) : (
        <div style={styles.grid}>
          {payments.map((p) => (
            <div key={p._id} style={styles.card}>

              {/* HEADER */}
              <div style={styles.header}>
                <div>
                  <h3 style={styles.name}>{p.name}</h3>
                  <p style={styles.ref}>Ref: {p.reference}</p>
                </div>

                <span
                  style={{
                    ...styles.badge,
                    background:
                      p.status === "Approved"
                        ? "#10b981"   // green
                        : p.status === "Rejected"
                          ? "#ef4444"   // red
                          : "#fbbf24",  // yellow (pending)
                    color: p.status === "Pending" ? "#111" : "#fff",
                  }}
                >
                  {p.status || "Pending"}
                </span>
              </div>

              {/* REJECTION REASON */}
              {p.status === "Rejected" && p.rejectReason && (
                <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "5px" }}>
                  Reason: {p.rejectReason}
                </p>
              )}

              {/* IMAGE */}
              <div style={styles.imageBox}>
                <img
                  src={p.proof}
                  alt="proof"
                  style={{ ...styles.image, cursor: "pointer" }}
                  onClick={() => setSelectedImage(p.proof)}
                />
              </div>

              {/* FOOTER */}

              <div style={styles.footer}>
                <small>
                  Order ID: {
                    typeof p.orderId === "string"
                      ? p.orderId.slice(-6)
                      : p.orderId?._id?.slice(-6)
                  }
                </small>

                <div style={styles.actions}>
                  <button
                    style={{
                      ...styles.approveBtn,
                      opacity: p.status === "Approved" ? 0.5 : 1,
                      cursor: p.status === "Approved" ? "not-allowed" : "pointer",
                    }}
                    disabled={p.status === "Approved"}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to APPROVE this payment?")) {
                        updateStatus(p._id, "Approved");
                      }
                    }}
                  >
                    Approve
                  </button>

                  <button
                    style={{
                      ...styles.rejectBtn,
                      opacity: p.status === "Rejected" ? 0.5 : 1,
                      cursor: p.status === "Rejected" ? "not-allowed" : "pointer",
                    }}
                    disabled={p.status === "Rejected"}
                    onClick={() => {
                      const reason = prompt("Enter reason for rejection:");

                      if (!reason) return;

                      if (window.confirm("Confirm rejection?")) {
                        updateStatus(p._id, "Rejected", reason);
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={styles.modal}
        >
          <img
            src={selectedImage}
            alt="Full View"
            style={styles.modalImg}
          />
        </div>
      )}
    </div>
  );
}

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
    marginBottom: "20px",
    color: "#111827",
  },

  empty: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },

  ref: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#fbbf24",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#111",
  },

  imageBox: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    borderRadius: "10px",
    border: "1px solid #eee",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  footer: {
    fontSize: "12px",
    color: "#6b7280",
    borderTop: "1px solid #eee",
    paddingTop: "8px",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    cursor: "zoom-out",
  },

  modalImg: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  }
};