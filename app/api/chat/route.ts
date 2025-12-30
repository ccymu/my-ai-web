import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        // 1. 权限检查 (修正了 await)
        const { userId } = await auth();
        if (!userId) {
            console.log("❌ 身份验证失败: 未找到 userId");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. 解析数据
        const body = await req.json();
        const { message } = body;

        // 3. 调用 AI
        console.log("🔄 正在尝试连接 Google Gemini...");
        // 👇 把 "gemini-pro" 改成 "gemini-1.5-flash"
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Google Gemini 调用成功");

        return NextResponse.json({ text });

    } catch (error: any) {
        // 👉 关键修改：把详细错误打印到终端
        console.error("❌ Google API 报错详情:", error);

        // 如果是网络连接失败 (常见于国内环境)
        if (error.message && (error.message.includes("fetch failed") || error.message.includes("undici"))) {
            console.error("💡 提示: 看起来是网络连不上 Google。请检查你的终端是否开启了代理 (VPN)。");
        }

        return NextResponse.json(
            { error: `AI 服务报错: ${error.message}` },
            { status: 500 }
        );
    }
}