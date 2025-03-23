import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { chat } from "../controllers/chat.controller.js";
import { processImage } from "../controllers/hand.controller.js";

const router = express.Router();

router.post("/upload", uploadFile);
router.post("/notes", processImage);
router.post("/chat", chat);

export default router;
