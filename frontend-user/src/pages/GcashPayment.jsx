import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import qr from "../assets/QRforDisplay.jpg";
import backendUrl from "../../config"; // adjust path if needed

function GcashPayment() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        name: "",
        reference: "",
        proof: null,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setForm({ ...form, proof: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ❌ SAFETY CHECK
        if (!user?._id && !user?.id) {
            alert("Please login again");
            return;
        }

        const userId = user._id || user.id;

        const data = new FormData();
        data.append("name", form.name);
        data.append("reference", form.reference);
        data.append("proof", form.proof);
        data.append("orderId", orderId);
        data.append("userId", userId); // ✅ FIXED

        try {
            const res = await fetch(`${backendUrl}/api/payments/gcash`, {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                console.log(result);
                alert("Payment failed");
                return;
            }

            alert("Payment submitted!");
            navigate("/orders");

        } catch (err) {
            console.log(err);
            alert("Error submitting payment");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h2 style={{ color: "black" }}>GCash Payment</h2>

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

                    <button style={styles.button}>
                        Submit Payment Proof
                    </button>

                </form>

            </div>
        </div>
    );
}

export default GcashPayment;

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        padding: "40px",
        background: "#f3f4f6",
        minHeight: "100vh",
    },

    card: {
        width: "400px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    },

    qr: {
        width: "100%",
        height: "auto",
        maxHeight: "400px",
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
        padding: "10px",
        background: "#021150",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};