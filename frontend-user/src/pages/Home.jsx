import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// IMAGES
import img1 from "../assets/ic-hero-section.png";
import img2 from "../assets/resistor.png";
import img3 from "../assets/breadboard.png";
import img4 from "../assets/nand-gate.png";
import img5 from "../assets/or-gate.png";

function Home() {
  const images = [img1, img2, img3, img4, img5];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const startX = useRef(0);
  const endX = useRef(0);

  // AUTO SLIDE
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, images.length]);

  // NEXT / PREV
  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  // SWIPE HANDLERS
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    endX.current = e.clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = startX.current - endX.current;

    if (diff > 50) next();
    if (diff < -50) prev();
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1 style={styles.title}>Electronic Vending Machine</h1>

        <p style={styles.text}>
          Welcome to <span style={{ color: "white", fontWeight: "700" }}>E-VEND</span>,, your convenient online platform for
          pre-ordering and securely claiming laboratory materials
          in the Computer Engineering Department.
        </p>

        <div style={styles.buttons}>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <button style={styles.primaryBtn}>
              Order Now
            </button>
          </Link>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            <button style={styles.secondaryBtn}>
              Contact Us
            </button>
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE (SLIDESHOW) */}
      <div
        style={styles.right}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          style={styles.sliderBox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <img
            src={images[index]}
            alt="slide"
            style={styles.image}
          />

          {/* DOTS */}
          <div style={styles.dots}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  ...styles.dot,
                  background: i === index ? "white" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;

/* STYLES */
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
    padding: "60px",
    background: "#021150",
    color: "white",
    gap: "40px",
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: "50px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  text: {
    fontSize: "20px",
    lineHeight: "1.6",
    maxWidth: "500px",
    marginBottom: "30px",
    color: "#d1d5ff",
  },

  buttons: {
    display: "flex",
    gap: "15px",
  },

  primaryBtn: {
    padding: "12px 20px",
    background: "#ffffff",
    color: "#021150",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryBtn: {
    padding: "12px 20px",
    background: "transparent",
    color: "white",
    border: "1px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  sliderBox: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
  },

  image: {
    width: "100%",
    borderRadius: "12px",
    transition: "opacity 0.6s ease-in-out",
    opacity: 1,
  },

  dots: {
    display: "flex",
    justifyContent: "center",
    marginTop: "12px",
    gap: "8px",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    cursor: "pointer",
  },
};