import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 缺失" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body || {};

    // 🔥 修正点：将 v1beta 改为 v1 (正式版)，确保模型存在
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
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

    if (!response.ok) {
      console.error("Google API Error:", data);
      // 如果 flash 也不行，代码会自动降级提示
      return NextResponse.json({ error: data.error?.message || "Google API Error" }, { status: response.status });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "暂无回复";
    return NextResponse.json({ text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
