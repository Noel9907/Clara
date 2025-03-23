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
  console.log("Processing image request");
  
  upload.single("image")(req, res, async (err) => {
    try {
      // Log all request body fields for debugging
      console.log("Request body:", req.body);
      
      // Try to get patient name from both possible field names
      const patientName = req.body.name || req.body.patientName;

      console.log("Retrieved patient name:", patientName);

      if (!patientName) {
        return res.status(400).json({ error: "Patient name is required" });
      }

      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Upload failed", details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const imagePath = req.file.path;
      console.log("Image path: " + imagePath);
      const imageBuffer = fs.readFileSync(imagePath);
      const base64String = `data:image/jpeg;base64,${imageBuffer.toString(
        "base64"
      )}`;
      
      const response = await client.chat.completions.create({
        model: "google/gemma-3-27b-it",
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
  "name": "${patientName}", 
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
      console.log("Raw extracted data:", extractedData);

      // Handle different JSON formatting possibilities
      if (extractedData.startsWith("```json")) {
        extractedData = extractedData.slice(7, -3).trim();
      } else if (extractedData.startsWith("```")) {
        extractedData = extractedData.slice(3, -3).trim();
      }

      try {
        const newPatientData = JSON.parse(extractedData);
        console.log("Parsed patient data:", newPatientData);

        // Create data directory if it doesn't exist
        const dataDir = path.resolve(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
          console.log("Creating data directory:", dataDir);
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // Use the provided name from request body for the file
        const patientFilePath = path.join(dataDir, `${patientName}.json`);
        console.log("Patient file path:", patientFilePath);

        let existingData = {};
        if (fs.existsSync(patientFilePath)) {
          console.log("Patient file exists, reading existing data");
          existingData = JSON.parse(fs.readFileSync(patientFilePath, "utf-8"));
        } else {
          console.log("Creating new patient file");
        }

        const updatedData = {
          // Always use the provided patient name
          name: patientName,
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

        console.log("Writing updated data to file");
        fs.writeFileSync(patientFilePath, JSON.stringify(updatedData, null, 2));

        res.status(200).json({
          message: "Text extracted and added successfully",
          data: updatedData,
        });

        // Delete the temporary uploaded file
        fs.unlinkSync(imagePath);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        return res.status(500).json({ 
          error: "Failed to parse extracted data", 
          details: jsonError.message,
          rawData: extractedData 
        });
      }
    } catch (error) {
      console.error("Error in processImage:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });
};