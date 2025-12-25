
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const explainMathProblem = async (problem: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `اشرح هذه المسألة الرياضية باللغة العربية بأسلوب تعليمي مبسط: ${problem}`,
      config: {
        systemInstruction: "أنت مدرس رياضيات خبير. قم بحل المسائل وشرح الخطوات بوضوح وباللغة العربية الفصحى.",
        temperature: 0.7,
      }
    });
    return response.text || "عذراً، لم أتمكن من معالجة الطلب حالياً.";
  } catch (error) {
    console.error("AI Error:", error);
    return "حدث خطأ أثناء محاولة الاتصال بالذكاء الاصطناعي.";
  }
};
