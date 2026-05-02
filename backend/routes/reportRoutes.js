import express from "express";
import { getSalesReport } from "../controller/reportController.js";

const router = express.Router();

router.get("/sales", getSalesReport);

export default router;