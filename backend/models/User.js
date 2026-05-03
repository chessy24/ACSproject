import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    // 🔥 ADD THIS
    idImage: {
      type: String, // will store Cloudinary URL
      default: "",
      required: true, // if you want to force ID upload
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);