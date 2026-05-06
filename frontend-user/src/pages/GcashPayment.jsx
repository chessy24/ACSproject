import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import qr from "../assets/QRforDisplay.jpg";
import backendUrl from "../../config";

function GcashPayment() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        name: "",
        reference: "",
        proof: null,
    });

    const [loading, setLoading] = useState(false); // 🔥 prevent double submit

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setForm({ ...form, proof: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔥 CONFIRM FIRST
        const confirmSubmit = window.confirm(
            "Are you sure you want to submit this payment proof?"
        );
        if (!confirmSubmit) return;

        if (!user?._id && !user?.id) {
            alert("Please login again");
            return;
        }

        if (!form.proof) {
            alert("Please upload proof of payment");
            return;
        }

        try {
            setLoading(true);

            const userId = user._id || user.id;

            const data = new FormData();
            data.append("name", form.name);
            data.append("reference", form.reference);
            data.append("proof", form.proof);
            data.append("orderId", orderId);
            data.append("userId", userId);

            const res = await fetch(`${backendUrl}/api/payments/gcash`, {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                console.log(result);
                alert("Payment failed");
                setLoading(false);
                return;
            }

            alert("Payment submitted successfully!");
            navigate("/orders");

        } catch (err) {
            console.log(err);
            alert("Error submitting payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={styles.title}>GCash Payment</h2>

                <img
                    src={qr}
                    alt="GCash QR"
                    style={styles.qr}
                />

                <form onSubmit={handleSubmit} style={styles.form}>

                    <input
                        name="name"
                        placeholder="Your Name"
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        name="reference"
                        placeholder="Reference / Serial Number"
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />

                    <input
                        type="file"
                        onChange={handleFile}
                        style={styles.input}
                        required
                    />

                    <button
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Payment Proof"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default GcashPayment;

/* ================= STYLES ================= */
const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        background: "#f3f4f6",
        minHeight: "100vh",
    },

    card: {
        width: "100%",
        maxWidth: "420px", // 🔥 mobile friendly
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    },

    title: {
        color: "black",
        marginBottom: "10px",
    },

    qr: {
        width: "100%",
        height: "auto",
        maxHeight: "350px",
        objectFit: "contain",
        margin: "15px 0",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },

    button: {
        padding: "12px",
        background: "#021150",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontWeight: "bold",
    },
};