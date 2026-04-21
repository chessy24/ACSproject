import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backendUrl from "../../config"; // adjust path if needed

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedProof, setSelectedProof] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));

                if (!user) return;

                const userId = user.id || user._id;
                if (!userId) return;

                const res = await fetch(
                    `${backendUrl}/api/orders/user-with-payments/${userId}`
                );
                const data = await res.json();

                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                setOrders([]);
            }
        };

        fetchOrders();
    }, []);


    return (
        <div style={styles.page}>
            <h1 style={styles.title}>My Orders</h1>

            {orders.length === 0 ? (
                <div style={styles.empty}>
                    <p>No orders yet 🛒</p>
                </div>
            ) : (
                <div style={styles.container}>
                    {orders.map((order) => (
                        <div key={order._id} style={styles.card}>

                            {/* HEADER */}
                            <div style={styles.header}>
                                <div>
                                    <p style={styles.orderId}>
                                        Order #{order._id.slice(-6)}
                                    </p>
                                    <p style={styles.date}>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div style={styles.rightHeader}>
                                    <span
                                        style={{
                                            ...styles.status,
                                            background:
                                                order.status === "Pending"
                                                    ? "#fbbf24"
                                                    : order.status === "Delivered"
                                                        ? "#22c55e"
                                                        : "#60a5fa",
                                        }}
                                    >
                                        {order.status}
                                    </span>

                                    {/* COMPARTMENT DISPLAY */}
                                    <span style={styles.compartment}>
                                        Compartment #{order.compartment || "TBA"}
                                    </span>

                                    {order.compartmentPassword && (
                                        <span style={styles.password}>
                                            Password: {order.compartmentPassword}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div style={styles.items}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={styles.item}>
                                        <img src={item.image} style={styles.img} />

                                        <div style={styles.itemInfo}>
                                            <p style={styles.name}>{item.name}</p>
                                            <p style={styles.price}>₱{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FOOTER */}
                            <div style={styles.footer}>
                                <h3>Total: ₱{order.total}</h3>

                                {/* GCASH BUTTON */}
                                {order.status === "Pending" &&
                                    (!order.payment || order.payment.status === "Rejected") && (
                                        <button
                                            onClick={() =>
                                                navigate(`/gcash-payment/${order._id}`)
                                            }
                                            style={styles.gcashBtn}
                                        >
                                            {order.payment?.status === "Rejected"
                                                ? "Retry Payment 💳"
                                                : "Pay with GCash 💳"}
                                        </button>
                                    )}
                            </div>

                            {order.payment && (
                                <div style={styles.paymentBox}>
                                    <h4 style={{ margin: "0 0 5px 0" }}>Payment Proof</h4>

                                    <button
                                        style={styles.viewBtn}
                                        onClick={() => setSelectedProof(order.payment.proof)}
                                    >
                                        View Payment Proof 👁️
                                    </button>

                                    <p style={{ fontSize: "12px", marginTop: "5px" }}>
                                        Status:{" "}
                                        <b
                                            style={{
                                                color:
                                                    order.payment.status === "Approved"
                                                        ? "green"
                                                        : order.payment.status === "Rejected"
                                                            ? "red"
                                                            : "orange",
                                            }}
                                        >
                                            {order.payment.status}
                                        </b>
                                    </p>

                                    <p style={{ fontSize: "12px" }}>
                                        Ref: {order.payment.reference}
                                    </p>

                                    {/* 🔥 ADD THIS */}
                                    {order.payment.status === "Rejected" && order.payment.rejectReason && (
                                        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                                            Reason: {order.payment.rejectReason}
                                        </p>
                                    )}

                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
            {selectedProof && (
                <div style={styles.modalOverlay} onClick={() => setSelectedProof(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedProof}
                            alt="payment proof"
                            style={styles.modalImg}
                        />

                        <button
                            style={styles.closeBtn}
                            onClick={() => setSelectedProof(null)}
                        >
                            Close
                        </button>
                    </div>
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
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
    },

    container: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },

    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
    },

    rightHeader: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "5px",
    },

    orderId: {
        fontWeight: "600",
        margin: 0,
    },

    date: {
        fontSize: "12px",
        color: "#6b7280",
        margin: 0,
    },

    status: {
        padding: "5px 10px",
        borderRadius: "20px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
    },

    compartment: {
        fontSize: "12px",
        background: "#e5e7eb",
        padding: "4px 8px",
        borderRadius: "10px",
        fontWeight: "600",
    },

    items: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    item: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        background: "#f9fafb",
        borderRadius: "10px",
    },

    img: {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "8px",
    },

    itemInfo: {
        display: "flex",
        flexDirection: "column",
    },

    name: {
        margin: 0,
        fontWeight: "600",
    },

    price: {
        margin: 0,
        color: "#22c55e",
        fontWeight: "bold",
    },

    footer: {
        marginTop: "10px",
        textAlign: "right",
        borderTop: "1px solid #eee",
        paddingTop: "10px",
    },

    gcashBtn: {
        marginTop: "10px",
        padding: "10px 15px",
        border: "none",
        borderRadius: "8px",
        background: "#06b6d4",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },

    paymentBox: {
        marginTop: "10px",
        padding: "10px",
        background: "#f9fafb",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
    },

    paymentImg: {
        width: "100%",
        maxHeight: "180px",
        objectFit: "contain",
        borderRadius: "8px",
        marginTop: "5px",
    },
    viewBtn: {
        marginTop: "8px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "8px",
        background: "#6366f1",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    modal: {
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        maxWidth: "500px",
        width: "90%",
        textAlign: "center",
    },

    modalImg: {
        width: "100%",
        borderRadius: "8px",
        maxHeight: "400px",
        objectFit: "contain",
    },

    closeBtn: {
        marginTop: "10px",
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        background: "#ef4444",
        color: "#fff",
        cursor: "pointer",
    },

};