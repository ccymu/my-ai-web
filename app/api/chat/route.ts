import { NextResponse } from "next/server";

// 使用 Edge 模式，速度更快
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 1. 检查 API Key
    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body || {};

    // 2. 🔥 核心修复：强制指定 v1beta 版本，绝对不会错！
    // 注意看这里写的是 v1beta，专门给 gemini-1.5-flash 用的
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 3. 发送请求
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

    // 4. 处理错误
    if (!response.ok) {
      console.error("Google API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Google API Error" },
        { status: response.status }
      );
    }

    // 5. 提取回复
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
