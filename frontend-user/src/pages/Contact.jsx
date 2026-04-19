import { useState } from "react";
import { motion } from "framer-motion";
import backendUrl from "../../config"; // adjust path if needed

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send message");
        return;
      }

      alert("Message sent successfully!");

      // RESET FORM
      setForm({
        name: "",
        email: "",
        message: "",
      });

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >

      {/* TITLE */}
      <h1 style={styles.title}>Contact Us</h1>

      <div style={styles.content}>

        {/* LEFT SIDE INFO */}
        <div style={styles.left}>
          <div style={styles.item}><span style={styles.icon}>📍</span><p>Boni ave, Mandaluyong City</p></div>
          <div style={styles.item}><span style={styles.icon}>📧</span><p>aces.boni@rtu.edu.ph</p></div>
          <div style={styles.item}><span style={styles.icon}>📞</span><p>(02) 8534 8267</p></div>
          <div style={styles.item}><span style={styles.icon}>🕒</span><p>Mon-Sat: 8AM - 5PM</p></div>
          <div style={styles.item}><span style={styles.icon}>🌐</span><p>rtu.edu.ph</p></div>
        </div>

        {/* RIGHT FORM */}
        <form style={styles.right} onSubmit={handleSubmit}>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            style={styles.input}
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            style={styles.input}
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            style={styles.textarea}
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>

      </div>
    </motion.div>
  );
}

export default Contact;

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    fontSize: "40px",
    marginBottom: "30px",
    color: "#000",
    fontWeight: "700",
  },

  content: {
    display: "flex",
    gap: "40px",
    width: "100%",
    maxWidth: "1000px",
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    color: "#555",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border: "1px solid #000",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
  },

  textarea: {
    padding: "12px",
    height: "100px",
    border: "1px solid #000",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
  },

  button: {
    padding: "12px",
    background: "#aa3bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  icon: {
    fontSize: "20px",
  },
};