import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image: String,

  stock: {
    type: Number,
    default: 0
  },

  // 🔥 ADD THIS (VERY IMPORTANT)
  archived: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);