// middleware/uploadClaim.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* =========================
   CLOUDINARY STORAGE CONFIG
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "order_claims",

      // IMPORTANT: ensures images always upload correctly
      resource_type: "image",

      // safer naming (prevents overwrite bugs)
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,

      // allow only images
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage,

  // safety limit (optional but recommended)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;