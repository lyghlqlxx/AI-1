import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { UploadedImage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerationResult {
  image: string | null;
  text: string | null;
}

export const generateScene = async (
  productImage: UploadedImage,
  prompt: string
): Promise<GenerationResult> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: productImage.base64,
              mimeType: productImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let resultImage: string | null = null;
    let resultText: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          resultImage = part.inlineData.data;
        } else if (part.text) {
          resultText = part.text;
        }
      }
    }

    if(!resultImage && !resultText) {
        resultText = "未能生成内容。响应可能已被屏蔽。";
    }

    return { image: resultImage, text: resultText };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("因 API 错误导致图片生成失败。");
  }
};