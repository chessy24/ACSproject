import { useEffect, useState } from "react";
import backendUrl from "../../config";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [hasID, setHasID] = useState(false);

  // LOAD CART + CHECK USER ID
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const user = JSON.parse(localStorage.getItem("user"));

    const fixedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      stock: Number(item.stock) || 999,
    }));

    setCart(fixedCart);

    // 🔥 CHECK IF USER HAS ID IMAGE
    setHasID(!!user?.idImage);
  }, []);

  // REMOVE ITEM
  const removeItem = (indexToRemove) => {
    const updated = cart.filter((_, index) => index !== indexToRemove);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // UPDATE QUANTITY
  const updateQuantity = (id, action) => {
    const updated = cart.map((item) => {
      if (item.productId === id) {
        if (action === "inc") {
          if (item.quantity < item.stock) {
            item.quantity += 1;
          } else {
            alert("Only " + item.stock + " stock available");
          }
        }

        if (action === "dec" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }

      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // TOTAL PRICE
  const totalPrice = cart.reduce((sum, item) => {
    return sum + Number(item.price || 0) * (item.quantity || 1);
  }, 0);

  // CHECKOUT
  const handleCheckout = async () => {
    // 🚫 BLOCK IF NO ID
    if (!hasID) {
      alert("⚠️ You must upload a valid ID before checkout.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        return;
      }

      const userId = user.id || user._id;

      const res = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          total: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return alert("Checkout failed");
      }

      alert("Order placed successfully!");

      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Cart</h1>

      {cart.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty 🛒</p>
        </div>
      ) : (
        <>
          {/* CART ITEMS */}
          <div style={styles.grid}>
            {cart.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.left}>
                  <img src={item.image} style={styles.img} />

                  <div style={styles.info}>
                    <h3 style={styles.name}>{item.name}</h3>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <button onClick={() => updateQuantity(item.productId, "dec")}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, "inc")}>+</button>
                    </div>
                  </div>
                </div>

                <div style={styles.right}>
                  <p style={styles.itemPrice}>₱{item.price * item.quantity}</p>

                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div style={styles.summary}>
            <div style={styles.summaryRight}>
              <div style={{ textAlign: "right" }}>
                <p style={styles.label}>Total Price</p>
                <h2 style={styles.totalPrice}>₱{totalPrice}</h2>

                {/* ⚠️ WARNING */}
                {!hasID && (
                  <p style={styles.warning}>
                    ⚠️ Upload a valid ID during registration to enable checkout
                  </p>
                )}
              </div>

              <button
                style={{
                  ...styles.checkoutBtn,
                  background: hasID ? "#021150" : "#ccc",
                  cursor: hasID ? "pointer" : "not-allowed",
                }}
                onClick={handleCheckout}
                disabled={!hasID}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    padding: "30px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#111827",
  },

  empty: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    textAlign: "center",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  img: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  info: {
    display: "flex",
    flexDirection: "column",
  },

  name: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  itemPrice: {
    fontWeight: "bold",
    color: "#22c55e",
    fontSize: "16px",
  },

  removeBtn: {
    padding: "8px 12px",
    border: "none",
    background: "#ef4444",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  summary: {
    marginTop: "20px",
    padding: "15px 20px",
    background: "#fff",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "flex-end",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  summaryRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  label: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
  },

  totalPrice: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  checkoutBtn: {
    padding: "10px 18px",
    border: "none",
    color: "white",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  warning: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },
};