import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backendUrl from "../../config"; // adjust path if needed

function Products() {
  const [products, setProducts] = useState([]);
  const [added, setAdded] = useState({}); // feedback state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {

      try {
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();

        console.log("PRODUCT DATA:", data); // 👈 ADD THIS

        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  // ADD TO CART
  const addToCart = (product) => {
    const token = localStorage.getItem("token"); // or userId

    // ❌ NOT LOGGED IN CHECK
    if (!token) {
      alert("Please log in first to add items to cart.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find(item => item.productId === product._id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setAdded(prev => ({
      ...prev,
      [product._id]: true
    }));

    setTimeout(() => {
      setAdded(prev => ({
        ...prev,
        [product._id]: false
      }));
    }, 1200);
  };
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h1 style={styles.title}>Products</h1>

      <div style={styles.filterBox}>
        {["All", "Battery", "LED", "IC", "Resistor"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.filterBtn,
              background: selectedCategory === cat ? "#021150" : "#e5e7eb",
              color: selectedCategory === cat ? "white" : "black"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredProducts.map((p) => (
          <div key={p._id} style={styles.card}>

            {/* IMAGE */}
            <img src={p.image} alt={p.name} style={styles.image} />

            {/* INFO */}
            <h3 style={styles.name}>{p.name}</h3>
            <p style={styles.price}>₱{p.price}</p>
            <p style={styles.category}>{p.category}</p>

            {/* ADD THIS */}
            <p style={styles.description}>{p.description}</p>

            {/* STOCK */}
            <p style={styles.stock}>
              Stock: {p.stock}
            </p>

            {/* BUTTON */}
            <button
              disabled={p.stock === 0}
              onClick={() => addToCart(p)}
              style={{
                ...styles.button,
                background: p.stock === 0
                  ? "#9ca3af"
                  : added[p._id]
                    ? "#2563eb"
                    : "#22c55e",
                cursor: p.stock === 0 ? "not-allowed" : "pointer"
              }}
            >
              {p.stock === 0
                ? "Out of Stock"
                : added[p._id]
                  ? "Added ✔"
                  : "Add to Cart"
              }
            </button>

          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Products;

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f3f4f6",
    color: "#111827"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px"
  },

  name: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px"
  },

  price: {
    color: "#22c55e",
    fontWeight: "bold"
  },

  category: {
    fontSize: "12px",
    opacity: 0.6
  },

  stock: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "10px"
  },

  button: {
    marginTop: "10px",
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold"
  },
  description: {
    fontSize: "12px",
    color: "#4b5563",
    marginTop: "5px",
    lineHeight: "1.4",
  },
  filterBox: {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
},

filterBtn: {
  padding: "8px 12px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold"
},
};