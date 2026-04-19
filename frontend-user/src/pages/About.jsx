import about from "../assets/about-image.png";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* LEFT: IMAGE */}
      <div style={styles.left}>
        <img src={about} alt="About" style={styles.image} />
      </div>

      {/* RIGHT: TEXT */}
      <div style={styles.right}>
        <h1 style={styles.title}>About Us</h1>
        <p>
          We are the association of computer students (acs) of rizal technological university, commited to supporting the academic and laboratory needs of computer engineering students. through E-VEND, we provide a secure and efficient platform for the organized distribution of laboratory materials within the department. 
        </p>
      </div>

     </motion.div>
  );
}

export default About;

// 👇 ADD IT HERE (outside the component)
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "40px",
    gap: "40px",
  },
  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  right: {
    flex: 1,
    color: "#333" // 👈 add this
  },
  image: {
    width: "100%",
    maxWidth: "320px",
  },
  title: {
  color: "#000",   // 👈 dark black
  fontWeight: "700"
},
};