import mongoose from "mongoose";

const inventoryReportSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    productName: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      enum: ["ADD_PRODUCT", "RESTOCK"],
      required: true,
    },

    quantityAdded: {
      type: Number,
      required: true,
    },

    previousStock: {
      type: Number,
      required: true,
    },

    newStock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "InventoryReport",
  inventoryReportSchema
);