import { GoogleGenAI } from '@google/genai';
import { useAppStore } from '../store';

export async function generateText(prompt: string, systemInstruction?: string, modelOverride?: string, temperatureOverride?: number, maxTokensOverride?: number) {
  const state = useAppStore.getState();
  const apiKey = state.apiKey || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API Key is missing. Please provide it in settings or environment.');
  }

  const model = modelOverride || state.defaultModel;
  const temperature = temperatureOverride ?? state.temperature;
  const maxTokens = maxTokensOverride ?? state.maxTokens;

  // For now, we only implement Gemini properly. Other models would need their respective SDKs.
  if (model.startsWith('gemini')) {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        maxOutputTokens: maxTokens,
      }
    });
    return response.text;
  } else {
    // Mock for other models if SDK not available, or just throw
    throw new Error(`Model ${model} is not fully supported in this demo without its specific SDK. Please use a Gemini model.`);
  }
}
