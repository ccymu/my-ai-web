import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 🚨 强制使用 Node.js 运行时，解决 Edge 环境下 Google SDK 报错的问题
export const runtime = "nodejs"; 

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 缺失" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body;

    // 初始化 Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    // 使用 flash 模型，如果这次还报错，代码会自动捕捉
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ 
      error: `AI 响应失败: ${error.message}` 
    }, { status: 500 });
  }
}
