import multer from "multer";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: NEBIUS_API_KEY,
});

const storage = multer.diskStorage({
  destination: "backend/files",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const processImage = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    try {
      if (err) {
        return res.status(500).json({ error: "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imagePath = req.file.path;
      const imageBuffer = fs.readFileSync(imagePath);
      const base64String = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;

      const response = await client.chat.completions.create({
        model: "google/gemma-3-27b-it-fast",
        max_tokens: 512,
        temperature: 0.5,
        top_p: 0.9,
        extra_body: { top_k: 50 },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract the text from this image and return it strictly in JSON format:
{
  "name": "John Doe",
  "dob": "YYYY-MM-DD",
  "conditions": ["Condition1", "Condition2"],
  "medications": [
    { "name": "Medication1", "dosage": "Xmg", "frequency": "Once a day" },
    { "name": "Medication2", "dosage": "Ymg", "frequency": "Twice a day" }
  ],
  "allergies": ["Allergy1", "Allergy2"],
  "lab_results": {
    "test1": "Value1",
    "test2": "Value2"
  },
  "doctor_notes": [
    {
      "date": "YYYY-MM-DD",
      "note": "Doctor's observation here."
    }
  ]
}`,
              },
              {
                type: "image_url",
                image_url: { url: base64String },
              },
            ],
          },
        ],
      });

      let extractedData = response.choices[0].message.content.trim();

      if (extractedData.startsWith("```json")) {
        extractedData = extractedData.slice(7, -3).trim();
      } else if (extractedData.startsWith("```")) {
        extractedData = extractedData.slice(3, -3).trim();
      }

      const newPatientData = JSON.parse(extractedData);
      const patientFilePath = `data/${newPatientData.name}.json`;

      let existingData = {};
      if (fs.existsSync(patientFilePath)) {
        existingData = JSON.parse(fs.readFileSync(patientFilePath, "utf-8"));
      }

      const updatedData = {
        name: existingData.name || newPatientData.name,
        dob: existingData.hasOwnProperty("dob")
          ? existingData.dob
          : newPatientData.dob,
        conditions: Array.from(
          new Set([
            ...(existingData.conditions || []),
            ...(newPatientData.conditions || []),
          ])
        ),
        medications: [
          ...(existingData.medications || []),
          ...(newPatientData.medications || []),
        ],
        allergies: Array.from(
          new Set([
            ...(existingData.allergies || []),
            ...(newPatientData.allergies || []),
          ])
        ),
        lab_results: {
          ...(existingData.lab_results || {}),
          ...(newPatientData.lab_results || {}),
        },
        doctor_notes: [
          ...(existingData.doctor_notes || []),
          ...(newPatientData.doctor_notes || []),
        ],
      };

      fs.writeFileSync(patientFilePath, JSON.stringify(updatedData, null, 2));

      res.status(200).json({
        message: "Text extracted and added successfully",
        data: updatedData,
      });

      fs.unlinkSync(imagePath);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
