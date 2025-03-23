import express from "express";
import { getlifestyle } from "../controllers/getinfo.controller.js";

const router = express.Router();
router.get("/getLifestyle", getlifestyle);
export default router;
