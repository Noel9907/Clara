import fs from "fs/promises"; // Use Promises API for async handling
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: NEBIUS_API_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Fixed variable name from _dirname

// export const getlifestyle = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) {
//       return res.status(400).json({ error: "Patient name is required" });
//     }

//     // Fixed path construction
//     const filePath = path.join(__dirname, "../../data", `${name}.json`);
    
//     try {
//       await fs.access(filePath); // Check if file exists using fs.promises
//     } catch (error) {
//       return res.status(404).json({ error: "Patient data not found" });
//     }

//     // Changed to async file reading
//     const fileData = await fs.readFile(filePath, "utf-8");
//     const patientData = JSON.parse(fileData);

//     const formattedData = `
// User Profile:
// - Date of Birth: ${patientData.dob}
// - Medical Conditions: ${patientData.conditions.join(", ")}
// - Medications:
//   ${patientData.medications
//     .map(m => `- ${m.name} (${m.dosage}, ${m.frequency})`)
//     .join("\n")}
// - Allergies: ${patientData.allergies.join(", ")}
// - Lab Results:
//   ${Object.entries(patientData.lab_results)
//     .map(([key, value]) => `- ${key}: ${value}`)
//     .join("\n")}
// - Doctor Notes:
//   ${patientData.doctor_notes
//     .map(note => `- [${note.date}] ${note.note}`)
//     .join("\n")}

// *Strict Response Format:*

// 1. *Exercise Plan*
//    - *Recommended Activities:* 
//      - [List suitable exercises]
//    - *Exercise Precautions:* 
//      - [List necessary precautions]
//    - *Weekly Exercise Plan:* 
//      - [Detailed weekly schedule]

// 2. *Sleep Schedule*
//    - *Sleep Recommendations:* 
//      - [Optimal sleep duration and habits]
//    - *Sleep Improvement Techniques:* 
//      - [Strategies for better sleep]

// 3. *Mental Health*
//    - *Stress Management:* 
//      - [Ways to manage stress]
//    - *Mental Health Resources:* 
//      - [List of useful resources]

// 4. *Diet Plan*
//    - *Recommended Foods:* 
//      - [Healthy foods to consume]
//    - *Foods to Avoid:* 
//      - [Unhealthy foods to limit or avoid]
//    - *Sample Meal Plan:* 
//      - *Breakfast:* [List items]
//      - *Lunch:* [List items]
//      - *Dinner:* [List items]
//      - *Snacks:* [List items]
// `;

//     const response = await client.chat.completions.create({
//       model: "meta-llama/Llama-3.3-70B-Instruct-fast",
//       max_tokens: 512,
//       temperature: 0.6,
//       top_p: 0.9,
//       extra_body: { top_k: 50 },
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a health assistant. Follow the strict response format below.",
//         },
//         { role: "user", content: formattedData },
//       ],
//     });

//     res.json({ lifestylePlan: response.choices[0].message.content });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export async function getRecords(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Patient name is required" });
    }

    // Fixed path construction
    const filePath = path.join(__dirname, "../../data", `${name}.json`);

    try {
      // Check if file exists
      await fs.access(filePath);
    } catch (error) {
      return res
        .status(404)
        .json({ error: `Medical record for ${name} not found.` });
    }

    // Read and parse the file
    const fileData = await fs.readFile(filePath, "utf-8");
    const patientData = JSON.parse(fileData);

    res.json({ medicalHistory: patientData });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getMedications(req, res) {
  try {
    const { name } = req.body;
    console.log("adfadsf")
    if (!name) {
      return res.status(400).json({ error: "Patient name is required" });
    }

    // Fixed path construction
    const filePath = path.join(__dirname, "../../data", `${name}.json`);

    try {
      await fs.access(filePath); // Check if file exists
    } catch (error) {
      return res
        .status(404)
        .json({ error: `Medical record for ${name} not found.` });
    }

    // Read and parse the file
    const fileData = await fs.readFile(filePath, "utf-8");
    const patientData = JSON.parse(fileData);

    // Extract only the medications array
    const medications = patientData.medications || [];

    res.json({ medications });
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}