import { useEffect, useState } from "react";
import backendUrl from "../../config"; // adjust path if needed

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await fetch(`${backendUrl}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to DELETE this product?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      // remove from UI instantly
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE SELECT
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // SUBMIT (🔥 REAL CLOUDINARY FLOW)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    formData.append("image", imageFile); // 🔥 real file

    await fetch(`${backendUrl}/api/products`, {
      method: "POST",
      body: formData
    });

    // reset
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: ""
    });

    setImageFile(null);
    setPreview("");

    fetchProducts();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={{ fontSize: "34px", color: "#0f172a", fontWeight: "700" }}>
          Admin Product Management
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            style={styles.input}
            name="name"
            placeholder="Product Name (e.g. 9V Battery)"
            value={form.name}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>

            <option value="Battery">Battery</option>
            <option value="LED">LED</option>
            <option value="IC">IC</option>
            <option value="Resistor">Resistor</option>

            {/* NEW */}
            <option value="Breadboard">Breadboard</option>
            <option value="Wires">Wires</option>
            <option value="Voltage Regulator">Voltage Regulator</option>
            <option value="Diode">Diode</option>
            <option value="Transistor">Transistor</option>
          </select>

          <input
            style={styles.input}
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <textarea
            style={styles.textarea}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, stock: onlyNumbers });
            }}
            style={styles.input}
          />

          <input
            style={styles.file}
            type="file"
            onChange={handleImageChange}
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={styles.preview}
            />
          )}

          <button type="submit" style={styles.button}>
            Add Product
          </button>
        </form>

        {/* PRODUCT LIST */}
        <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#0f172a", marginTop: "30px", marginBottom: "10px" }}>
          Products
        </h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p._id} style={styles.card}>
              <img src={p.image} style={styles.cardImg} />
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                <p style={styles.cardPrice}>₱{p.price}</p>
                <p style={styles.cardCategory}>{p.category}</p>
                <p style={styles.cardDescription}>
                  {p.description}
                </p>
                <p>Stock: {p.stock}</p>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminProducts;

const styles = {
  page: {
    background: "#ffffff",
    minHeight: "100vh",
    padding: "20px",
    color: "white",
    fontFamily: "Arial"
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto"
  },

  title: {
    marginBottom: "20px"
  },

  form: {
    background: "#4c4c4c",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    minHeight: "80px"
  },

  file: {
    color: "white"
  },

  button: {
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  preview: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px"
  },

  subtitle: {
    marginTop: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "15px"
  },

  card: {
    background: "#b4b4b4",
    padding: "10px",
    borderRadius: "10px"
  },

  cardImg: {
    width: "100%",
    borderRadius: "8px",
    height: "120px",
    objectFit: "cover"
  },

  cardBody: {
    marginTop: "10px"
  },

  cardTitle: {
    fontSize: "16px",
    margin: "0"
  },

  cardPrice: {
    color: "#22c55e",
    margin: "5px 0"
  },

  cardCategory: {
    fontSize: "12px",
    opacity: 0.7
  },

  deleteBtn: {
    marginTop: "8px",
    width: "100%",
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};