import about from "../assets/about-image.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function About() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      style={{
        ...styles.container,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "30px 20px" : "40px",
        textAlign: isMobile ? "center" : "left",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* IMAGE */}
      <div
        style={{
          ...styles.left,
          marginBottom: isMobile ? "20px" : "0",
        }}
      >
        <img
          src={about}
          alt="About"
          style={{
            ...styles.image,
            maxWidth: isMobile ? "250px" : "320px",
          }}
        />
      </div>

      {/* TEXT */}
      <div style={styles.right}>
        <h1
          style={{
            ...styles.title,
            fontSize: isMobile ? "26px" : "36px",
          }}
        >
          About Us
        </h1>

        <p
          style={{
            ...styles.text,
            fontSize: isMobile ? "15px" : "18px",
            margin: isMobile ? "10px auto" : "0",
          }}
        >
          We are the association of computer students (ACS) of Rizal Technological University,
          committed to supporting the academic and laboratory needs of computer engineering students.
          Through E-VEND, we provide a secure and efficient platform for the organized distribution
          of laboratory materials within the department.
        </p>
      </div>

    </motion.div>
  );
}

export default About;

/* STYLES */
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "40px",
  },

  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  right: {
    flex: 1,
    color: "#333",
  },

  image: {
    width: "100%",
  },

  title: {
    color: "#000",
    fontWeight: "700",
    marginBottom: "15px",
  },

  text: {
    lineHeight: "1.6",
    maxWidth: "500px",
    color: "#4b5563",
  },
};