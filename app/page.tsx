"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, User, MessageSquare } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

// 定义消息结构
type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
};

export default function Home() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: '你好！我是你的 AI 助手。有什么可以帮你的吗？' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 自动滚动到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 发送处理
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");

    // 1. 立即显示用户消息
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. 请求后端 API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 3. 显示 AI 回复
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: data.text };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "⚠️ 抱歉，出错了，请稍后再试。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">

      {/* --- 顶部导航栏 --- */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Gemini Chat
          </h1>
        </div>

        {/* 用户区域 */}
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                登录 / 注册
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* --- 主内容区 --- */}
      <main className="flex-1 overflow-hidden relative flex flex-col">

        {/* === 未登录状态展示 === */}
        <SignedOut>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-12 h-12 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">欢迎使用智能助手</h2>
            <p className="text-gray-500 max-w-md text-lg mb-8 leading-relaxed">
              这就基于 Google Gemini Pro 的强大的 AI 问答系统。<br />请登录后开始体验无限可能的对话。
            </p>
            <SignInButton mode="modal">
              <button className="group relative bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                立即开始使用
                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* === 已登录状态展示 (聊天界面) === */}
        <SignedIn>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {/* AI 头像 */}
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                      <Bot size={18} className="text-indigo-600" />
                    </div>
                  )}

                  {/* 消息气泡 */}
                  <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                    }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* 用户头像 */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 shadow-sm border border-gray-200">
                      <img src={user?.imageUrl} alt="Me" className="w-full h-full" />
                    </div>
                  )}
                </div>
              ))}

              {/* AI 思考中动画 */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Bot size={18} className="text-indigo-600" />
                  </div>
                  <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* 底部输入框 */}
          <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200">
            <div className="max-w-3xl mx-auto relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="发送消息给 Gemini..."
                className="w-full bg-gray-100 hover:bg-white focus:bg-white text-gray-900 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:shadow-md transition-all border border-transparent focus:border-indigo-100"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              AI 模型生成内容可能存在误差，请核实重要信息。
            </p>
          </div>
        </SignedIn>

      </main>
    </div>
  );
}