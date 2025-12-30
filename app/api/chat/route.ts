import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. 打印日志确认代码已更新
    console.log("🔥 正在执行最新版代码: 使用 gemini-1.5-flash");

    // 2. 检查 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ 严重错误: 没有读到 GEMINI_API_KEY");
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // 3. 强制解析 JSON
    const body = await req.json();
    const { message } = body || {};

    // 4. 初始化模型 (锁定 gemini-1.5-flash)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. 发起调用
    console.log(`🚀 正在发送消息给 Google... 内容: ${message?.slice(0, 10)}...`);
    const result = await model.generateContent(message || "Hello");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ 调用成功，返回结果长度:", text.length);
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("❌ 最终报错:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" }, 
      { status: 500 }
    );
  }
}
