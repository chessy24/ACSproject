// middleware/uploadClaim.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/* =========================
   CLEAN FILE NAME HELPER
========================= */
const cleanFileName = (name = "file") => {
  return name
    .split(".")[0]
    .toString()
    .trim()                    // remove leading/trailing spaces
    .replace(/\s+/g, "_")     // spaces → underscore
    .replace(/[^\w-]/g, "");   // remove special characters
};

/* =========================
   CLOUDINARY STORAGE CONFIG
========================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "order_claims",
      resource_type: "image",

      // ✅ SAFE public_id (NO whitespace / invalid chars)
      public_id: `${Date.now()}-${cleanFileName(file.originalname)}`,

      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage,

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