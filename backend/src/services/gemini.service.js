import ai from "../config/gemini.js";

export const testGemini = async () => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Say hello from Gemini in one sentence.",
    });

    return response.text;
};