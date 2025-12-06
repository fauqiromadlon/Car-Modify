import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to resize image to a max width/height to improve generation speed and efficiency.
 * Reduces token usage and upload latency.
 */
const resizeImage = async (base64: string, maxWidth = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64); // Fallback to original
        return;
      }
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (e) => {
      console.warn("Image resize failed, using original", e);
      resolve(base64);
    };
    img.src = base64;
  });
};

/**
 * Modifies a car image based on a specific prompt using Gemini 2.5 Flash Image.
 * Accepts optional reference images to help the model understand the car better.
 */
export const modifyCarImage = async (
  base64Image: string, 
  modificationPrompt: string, 
  referenceImages: string[] = []
): Promise<string> => {
  // 1. Optimize input image size (800px is excellent for Flash speed/quality balance)
  const optimizedBase64 = await resizeImage(base64Image, 800, 0.85);
  const cleanBase64 = optimizedBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const model = 'gemini-2.5-flash-image';
    
    // Construct text prompt for SINGLE or MULTIPLE modifications
    let fullPrompt = `
      You are an expert automotive digital artist.
      Task: Edit the FIRST image provided (the main view of the Suzuki Ertiga).
      
      Apply the following modifications simultaneously:
      ${modificationPrompt}
      
      Constraints: 
      1. Maintain high photorealism. 
      2. Do NOT change the background. 
      3. Do NOT change the angle of the main image. 
      4. Output ONLY the modified main image.
    `;
    
    if (referenceImages.length > 0) {
      fullPrompt += `
      Note: Additional images are provided as reference for the car's current condition and details from other angles. Use them to ensure consistency.
      `;
    }

    // Construct request parts: Main Image + Reference Images + Text Prompt
    const parts: any[] = [
      { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }, // Main image first
    ];

    // Add reference images (also optimized - smaller for speed)
    for (const refImg of referenceImages) {
      const optimizedRef = await resizeImage(refImg, 512, 0.6); // References can be even smaller/lower quality
      const cleanRef = optimizedRef.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanRef } });
    }

    // Add prompt text last
    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      }
    });

    // ROBUST RESPONSE HANDLING
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0];
      
      // Check for safety finish reason
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
          console.warn("Generation stopped due to:", candidate.finishReason);
      }

      // Safe access to content.parts using optional chaining/checks
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/jpeg;base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("Gemini returned no valid image data. The request might have been blocked by safety filters or failed.");
  } catch (error) {
    console.error("Gemini Image Modification Error:", error);
    throw error;
  }
};

/**
 * Generates 8 frames for a 360-degree view based on the current car image.
 */
export const generate360Views = async (base64Image: string): Promise<string[]> => {
  // Optimize input image size
  const optimizedBase64 = await resizeImage(base64Image, 800, 0.75);
  const cleanBase64 = optimizedBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const model = 'gemini-2.5-flash-image';

  // Define 8 cardinal directions/angles
  const angles = [
    "Front view",
    "Front-Left quarter view",
    "Left side profile view",
    "Rear-Left quarter view",
    "Rear view",
    "Rear-Right quarter view",
    "Right side profile view",
    "Front-Right quarter view"
  ];

  // Helper to generate a single frame
  const generateFrame = async (angleDescription: string) => {
    const prompt = `
      Generate a ${angleDescription} of this exact modified Suzuki Ertiga.
      IMPORTANT:
      1. Keep the EXACT same wheels, body color, and modifications shown in the input image.
      2. Keep the same background environment/lighting.
      3. High photorealism.
      4. The car should be centered.
    `;

    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: prompt }
          ]
        }
      });

      // Safe access
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            return `data:image/jpeg;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (e) {
      console.warn(`Failed to generate angle: ${angleDescription}`, e);
      return null;
    }
  };

  try {
    // Generate all frames in parallel
    const promises = angles.map(angle => generateFrame(angle));
    const results = await Promise.all(promises);
    
    // Filter out failed generations, but we need at least some frames
    const validFrames = results.filter((f): f is string => f !== null);
    
    if (validFrames.length === 0) {
      throw new Error("Failed to generate 360 views.");
    }
    
    return validFrames;
  } catch (error) {
    console.error("Gemini 360 Generation Error:", error);
    throw error;
  }
};