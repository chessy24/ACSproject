import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    price: Number,
    image: String,
    quantity: {
      type: Number,
      default: 1,
    },
  },
],
    total: Number,
    status: {
      type: String,
      default: "Pending",
    },
    compartment: {
  type: String,
  default: ""
},
compartmentPassword: {
  type: String, 
  default: ""
},
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);