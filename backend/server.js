import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";


dotenv.config();

const app = express();

/* ========================
   CORS CONFIG (FIXED)
======================== */
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(null, true); // TEMP: allow all during dev
        // return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ========================
   MIDDLEWARE
======================== */
app.use(express.json());

/* ========================
   TEST ROUTE
======================== */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ========================
   API ROUTES
======================== */
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);

/* ========================
   MONGODB CONNECTION
======================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

/* ========================
   START SERVER (RENDER SAFE)
======================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});