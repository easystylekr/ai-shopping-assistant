import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

// Vite에서는 VITE_ 접두사가 필요하며, import.meta.env를 사용합니다
const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY environment variable not set. Please set VITE_API_KEY or API_KEY.");
}

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are an expert AI shopping purchase proxy for users in South Korea. Your primary goal is to find and recommend the single best product based on the user's request. You must be decisive and provide only one final choice.

After using your web search tool to research, analyze, and select the best product, your final output MUST strictly follow this format in Korean. Do not add any extra text before or after this structure. The user's application will parse this exact format.

**상품명:** [제조사, 브랜드, 모델명 등 검색에 용이한 정확한 전체 상품명을 기입하세요. 이 이름은 이미지 검색의 정확도를 위해 매우 중요합니다.]
**카테고리:** [A single, relevant product category, e.g., 남성 등산화, 주방 가전, 유아용 장난감]
**가격:** [Price in KRW]
**상품평:** [Customer rating summary, e.g., 별점 4.8/5 (리뷰 1,234개)]
**추천 이유:** [A concise reason for choosing this specific product, under 150 characters]
**구매 링크:** [The direct, final URL to the product purchase page. This is critical for the next step of fetching the image.]`;

export async function getAIResponse(chatHistory: Message[]): Promise<{ content: string; sources?: { uri: string; title: string; }[] }> {
  try {
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text;
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const webSources = groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web.title);

    return {
        content: text,
        sources: webSources,
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      content: '죄송합니다, AI 시스템에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    };
  }
}

/**
 * Generates a photorealistic product image using the Imagen model.
 * @param productName The name of the product to generate an image for.
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export async function generateProductImage(productName: string): Promise<string> {
  try {
    const prompt = `A professional, photorealistic e-commerce product photograph of the following item: '${productName}'. The item should be centered and displayed clearly on a clean, solid white background. No text, logos, or other objects should be in the image.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });
    
    const base64ImageBytes = response.generatedImages[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("Image generation succeeded but no image bytes were returned.");
    }

    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating product image with Imagen:", error);
    // Rethrow the error to be caught by the calling function in App.tsx
    throw error;
  }
}