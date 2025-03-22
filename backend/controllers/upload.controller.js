import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "backend/files",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Error in file upload:", err);
        return res.status(500).json({ error: "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      res.status(201).json({
        message: "File uploaded successfully",
        filename: req.file.filename,
      });
    });
  } catch (error) {
    console.error("Error in uploadFile controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
