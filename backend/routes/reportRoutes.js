import express from "express";
import { getSalesReport } from "../controller/reportController";

const router = express.Router();

router.get("/sales", getSalesReport);

export default router;