import GoogleGenAI from "@google/genai"
import DocumentChunk from "@google/genai"


export const searchKnowledgeBase = async (query) => {
    try {
        const chunks = await DocumentChunk.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .limit(5)

        return chunks
    } catch (error) {
        console.error("Search Error :", error)
        return []
    }
}


let ai;
const getAIClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
};


export const generateAnswer = async (question, contextChunks) => {
    if (!contextChunks || contextChunks.length === 0) {
        return "I'm sorry, I don't have enough information in my knowledge base to answer that.";
    }
    const contextText = contextChunks.map(c => c.content).join("\n---\n");
    console.log(contextText)

    const prompt = `You are an AI assistant for employee onboarding. 
                    You must answer the user's question using ONLY the provided context snippets below.
                    If the provided context does not contain the answer, explicitly state: "I'm sorry, I don't have that information in my knowledge base."
                    Do not use outside knowledge or hallucinate.
                    Do not mention "context snippets" or "RAG" in your answer to the user.

                    Context:
                    ${contextText}

                    User Question: ${question}`;


    try {
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
        if (!apiKey) {
            return "This is a simulated response (Gemini Mode) because no valid GEMINI_API_KEY was found. (RAG Context Found: " + contextChunks.length + " chunks)";
        }

        const ai = getAIClient();

        const result = await ai.models.generateContent({
            model: "models/gemini-2.5-flash",
            contents: [
                { role: "user", parts: [{ text: prompt }] },
            ],
        })

        console.log(result)

        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content.parts[0].text;
        }

        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
            return result.response.candidates[0].content.parts[0].text;
        }

        return "No response generated.";

    } catch (error) {
        console.error("AI Generation Error Details:", JSON.stringify(error, null, 2));
        return "I encountered an error while processing your request. Please check server logs.";
    }

}