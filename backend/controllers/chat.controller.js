import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import fs from "fs/promises";

const TEMPLATE = `You are a medical AI assistant that provides accurate information based only on the patient's medical history. You answer in a point wise manner
==============================
Patient Data: {context}
==============================
Conversation History: {chat_history}

User: {question}
Assistant:`;

function formatMessage(msg) {
  return `${msg.role}: ${msg.content}`;
}

async function loadPatientData(patientName) {
  const filePath = `data/${patientName.toLowerCase()}.json`;

  try {
    await fs.access(filePath);
    const fileData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Medical record for ${patientName} not found.`);
  }
}

export async function chat(req, res) {
  try {
    const { messages, patientName } = req.body;
    console.log("Received request:", messages, patientName);

    if (!patientName) {
      return res.status(400).json({ error: "Patient name is required" });
    }

    const docs = await loadPatientData(patientName);
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1]?.content || "";

    const prompt = await PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash",
      temperature: 0,
    });

    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([prompt, model, parser]);

    const response = await chain.invoke({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
      context: JSON.stringify(docs, null, 2),
    });
    const text = Object.keys(response)
      .map((key) => String.fromCharCode(response[key]))
      .join("");

    res.json({ answer: text });
  } catch (e) {
    console.error("Error in chat function:", e);
    res.status(500).json({ error: e.message });
  }
}
