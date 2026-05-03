import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    // Cloudinary image URL
    idImage: {
      type: String,
      default: "",
      required: false, // 🔥 FIXED
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);