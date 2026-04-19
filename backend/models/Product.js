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
}
  
}, { timestamps: true });

export default mongoose.model("Product", productSchema);