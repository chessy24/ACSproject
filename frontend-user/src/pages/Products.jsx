import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import backendUrl from "../../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [added, setAdded] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState(""); // ✅ NEW
  const [selectedImage, setSelectedImage] = useState(null);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  // ADD TO CART
  const addToCart = (product) => {
    const token = localStorage.getItem("token");

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

  // ✅ FILTER LOGIC (CATEGORY + SEARCH)
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h1 style={styles.title}>Products</h1>

      {/* 🔍 SEARCH BOX */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* CATEGORY FILTER */}
      <div style={styles.filterBox}>
        {["All", "Battery", "LED", "IC", "Resistor", "Breadboard", "Wires", "Voltage Regulator", "Diode", "Transistor"].map((cat) => (
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

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {filteredProducts.map((p) => (
          <div key={p._id} style={styles.card}>
            <img
              src={p.image}
              alt={p.name}
              style={{ ...styles.image, cursor: "pointer" }}
              onClick={() => setSelectedImage(p.image)}
            />

            <h3 style={styles.name}>{p.name}</h3>
            <p style={styles.price}>₱{p.price}</p>
            <p style={styles.category}>{p.category}</p>

            <p style={styles.description}>{p.description}</p>

            <p style={styles.stock}>Stock: {p.stock}</p>

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
                  : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Product"
              style={styles.modalImg}
            />

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
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

  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    outline: "none"
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

  description: {
    fontSize: "12px",
    color: "#4b5563",
    marginTop: "5px",
    lineHeight: "1.4",
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