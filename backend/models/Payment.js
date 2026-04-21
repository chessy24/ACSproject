import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: String,
    reference: String,

    proof: String, // image URL (Cloudinary or file path)

    status: {
      type: String,
      default: "Pending",
    },

    rejectReason: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);