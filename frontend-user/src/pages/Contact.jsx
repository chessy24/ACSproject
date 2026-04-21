import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import backendUrl from "../../config";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // SCREEN DETECT
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
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
      style={{
        ...styles.container,
        padding: isMobile ? "30px 20px" : "40px",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h1
        style={{
          ...styles.title,
          fontSize: isMobile ? "28px" : "40px",
        }}
      >
        Contact Us
      </h1>

      <div
        style={{
          ...styles.content,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "25px" : "40px",
        }}
      >

        {/* LEFT INFO */}
        <div style={styles.left}>
          <div style={styles.item}><span style={styles.icon}>📍</span><p>Boni Ave, Mandaluyong City</p></div>
          <div style={styles.item}><span style={styles.icon}>📧</span><p>aces.boni@rtu.edu.ph</p></div>
          <div style={styles.item}><span style={styles.icon}>📞</span><p>(02) 8534 8267</p></div>
          <div style={styles.item}><span style={styles.icon}>🕒</span><p>Mon-Sat: 8AM - 5PM</p></div>
          <div style={styles.item}><span style={styles.icon}>🌐</span><p>rtu.edu.ph</p></div>
        </div>

        {/* FORM */}
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

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    marginBottom: "30px",
    color: "#000",
    fontWeight: "700",
    textAlign: "center",
  },

  content: {
    display: "flex",
    width: "100%",
    maxWidth: "1000px",
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    color: "#555",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #000",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    height: "120px",
    border: "1px solid #000",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    resize: "none",
  },

  button: {
    padding: "12px",
    background: "#aa3bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
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