import express from "express";
import {
  getRecords,
  getMedications,
} from "../controllers/getinfo.controller.js";
import { getlifestyle } from '../controllers/lifestyle.controller.js'

const router = express.Router();
router.post("/getLifestyle", getlifestyle);
router.post("/getrecords", getRecords);
router.post("/meds", getMedications);

export default router;