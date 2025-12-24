import { chunktext, txtfromPdf, store, processQuery } from '../../services/pdf.js';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY});

export const handleResume = async (req, res) => {
  const filepath=req.file.path;
  console.log("Received file:", req.file);
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded"});
  }

  try {
    const pdf_name = req.file.filename;
    const filebuffer = fs.readFileSync(req.file.path); 

    const text = await txtfromPdf(filebuffer);
    const chunks = await chunktext(text);

    await store(chunks, pdf_name);
    fs.unlinkSync(filepath);

    console.log("PDF processed and stored successfully.");
    res.status(200).json({ success: true, message: "PDF processed and stored successfully." });
        
  } catch (error) {
    console.log("Error in controller func:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const analyzeResume = async (req, res) => {
  try {
    // 🔹 ONE similarity search
    const retrievedContext = await processQuery(
      "Extract skills, projects, experience level"
    );

    const prompt = `
You are a resume analyzer.

Using ONLY the following resume content:
${retrievedContext}
Return ONLY raw JSON.
Do NOT use markdown.
Do NOT include backticks.
Do NOT add explanations.
{
  "skills": [],
  "projects": [{ "name": "", "description": "", "tech": [] }],
  "experience_level": "fresher | junior | mid | senior"
}

Do NOT guess.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
const validJSON=extractJSON(response.text);
req.session.resumeProfile = validJSON;
    return res.status(200).json({
      success: true,
      resumeJSON: validJSON
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
function extractJSON(text) {
  // Remove markdown fences if present
  text = text.replace(/```json|```/g, "").trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No valid JSON object found");
  }

  const jsonString = text.slice(start, end + 1);
  return JSON.parse(jsonString);
}

export {analyzeResume};