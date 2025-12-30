# AI 问答助手

基于 Next.js 14 (App Router) + Tailwind CSS + Google Gemini + Clerk 认证的现代化 AI 问答网页应用。

## 功能特性

- 🤖 **智能对话**: 集成 Google Gemini Pro 模型，提供智能问答服务
- 🔐 **用户认证**: 使用 Clerk 进行安全的用户认证管理
- 💬 **现代化界面**: 类似 ChatGPT 的聊天界面设计
- 📱 **响应式设计**: 支持手机和电脑端完美显示
- ⚡ **实时交互**: 支持流式响应和实时消息显示
- 🎨 **美观 UI**: 使用 Tailwind CSS 构建的现代化界面

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式框架**: Tailwind CSS
- **AI 服务**: Google Generative AI (Gemini Pro)
- **用户认证**: Clerk
- **图标库**: Lucide React
- **开发语言**: TypeScript

## 快速开始

### 1. 环境准备

确保你的系统已安装：
- Node.js 18+ 
- npm 或 yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量配置

复制 `.env.local` 文件并配置以下环境变量：

```bash
# Clerk 配置（需要到 https://clerk.com 注册获取）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini API 配置（需要到 https://makersuite.google.com/app/apikey 获取）
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Next.js 配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 获取 API Keys

#### Google Gemini API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的 Google 账号
3. 创建新的 API Key
4. 将 API Key 填入 `GEMINI_API_KEY` 环境变量

#### Clerk 配置
1. 访问 [Clerk](https://clerk.com) 注册账号
2. 创建新的应用程序
3. 在 Clerk Dashboard 中获取 Publishable Key 和 Secret Key
4. 配置回调 URL: `http://localhost:3000`

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
my-ai-web/
├── app/
│   ├── api/chat/route.ts      # AI 聊天 API 路由
│   ├── layout.tsx             # 根布局（集成 Clerk）
│   ├── page.tsx               # 主聊天界面
│   └── globals.css            # 全局样式
├── middleware.ts              # Clerk 中间件
├── .env.local                 # 环境变量配置
├── next.config.ts             # Next.js 配置
└── package.json              # 项目依赖
```

## 核心功能说明

### AI 聊天 API (`/api/chat`)
- **方法**: POST
- **请求体**: `{ "message": "用户输入的内容" }`
- **响应**: `{ "reply": "AI 回复内容", "timestamp": "时间戳" }`
- **安全**: API Key 通过环境变量安全存储

### 用户认证流程
1. 未登录用户看到登录界面
2. 点击登录按钮弹出 Clerk 认证模态框
3. 登录成功后显示完整的聊天界面
4. 支持用户头像和登出功能

### 聊天界面特性
- 消息气泡区分用户和 AI
- 实时消息滚动
- 加载状态指示器
- 支持回车键发送
- 响应式消息布局

## 部署说明

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台部署

确保配置正确的环境变量和构建命令：

```bash
npm run build
npm start
```

## 开发指南

### 添加新功能

1. **修改聊天界面**: 编辑 `app/page.tsx`
2. **调整 AI 行为**: 修改 `app/api/chat/route.ts`
3. **自定义样式**: 编辑 `app/globals.css`
4. **扩展认证**: 参考 [Clerk 文档](https://clerk.com/docs)

### 自定义提示词

在 API 路由中可以修改提示词来调整 AI 行为：

```typescript
const prompt = `你是一个专业的 AI 助手。请用中文回答用户的问题。

用户问题: ${message}

AI 回复:`;
```

## 故障排除

### 常见问题

1. **API Key 错误**: 检查环境变量是否正确配置
2. **CORS 问题**: 确保中间件配置正确
3. **样式不显示**: 检查 Tailwind CSS 配置
4. **认证失败**: 验证 Clerk 配置和回调 URL

### 调试技巧

1. 检查浏览器控制台错误信息
2. 查看 Next.js 开发服务器日志
3. 验证环境变量是否加载成功
4. 测试 API 端点是否正常工作

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License