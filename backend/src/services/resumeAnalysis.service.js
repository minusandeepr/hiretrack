import fs from "fs/promises";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import ai from "../config/gemini.js";

export const analyzeResume = async (resumePath) => {
  // Read uploaded PDF
  const pdfBuffer = await fs.readFile(resumePath);

  // Extract text
  const pdfData = await pdfParse(pdfBuffer);

  const resumeText = pdfData.text;

  // Send to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are an AI resume parser.

Extract the following information from this resume.

Return ONLY valid JSON.

{
  "name":"",
  "email":"",
  "phone":"",
  "skills":[],
  "experience":"",
  "education":[],
  "projects":[],
  "summary":""
}

Resume:

${resumeText}
`,
  });

  const text = response.text.trim();

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
};