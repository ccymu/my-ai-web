import { NextResponse } from "next/server";

// 强制使用 Edge 环境，速度快且原生支持 fetch
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 缺失" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body || {};

    // 🔥 绝杀方案：直接请求 Google API URL，绕过所有 SDK 版本问题
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message || "Hello" }],
          },
        ],
      }),
    });

    const data = await response.json();

    // 如果 Google 报错，把错误吐出来
    if (!response.ok) {
      console.error("Google API Error:", data);
      return NextResponse.json({ error: data.error?.message || "Google API Error" }, { status: response.status });
    }

    // 提取回复内容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
