import { NextResponse } from "next/server";

// 强制使用 Edge 模式 (Vercel 推荐)
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key 缺失" }, { status: 500 });
    }

    const body = await req.json();
    const { message } = body || {};

    // ⬇️ 重点：直接拼写 URL，绕过所有 SDK 版本限制
    // 我们显式调用 v1beta 版本，指定 gemini-1.5-flash 模型
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message || "你好" }],
          },
        ],
      }),
    });

    const data = await response.json();

    // 如果 Google 报错，打印出来
    if (!response.ok) {
      console.error("Google API Error:", JSON.stringify(data, null, 2));
      // 如果 Flash 依然不行，代码会自动告诉我们具体原因
      return NextResponse.json(
        { error: data.error?.message || "Google API Error" },
        { status: response.status }
      );
    }

    // 提取回复
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "暂无回复";
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
