# 匿名树洞 PWA

一个极简的匿名心情分享平台，支持发布和浏览匿名内容，无任何互动功能。

## 功能特点

- **首页**：按时间倒序显示所有公开树洞内容
- **发表页**：输入框 + 发布按钮，提交后返回首页
- **私密日记**：内容仅存储在本地 localStorage，加密保存
- **PWA 支持**：可添加到桌面、离线访问、全屏启动

## 技术栈

- **前端**：原生 HTML/CSS/JavaScript（PWA）
- **后端**：Node.js + Express
- **数据库**：SQLite
- **部署**：Vercel

## 项目结构

```
├── public/
│   ├── index.html          # 主页面
│   ├── manifest.json       # PWA 配置
│   ├── service-worker.js   # 服务工作者
│   └── icons/              # 应用图标
├── server.js               # Express 服务器
├── package.json            # 项目配置
├── vercel.json             # Vercel 配置
└── treeholes.db            # SQLite 数据库（运行后自动生成）
```

## API 接口

### POST /api/submit
提交树洞内容

**请求体**：
```json
{
  "content": "要发布的内容"
}
```

**响应**：
```json
{
  "success": true,
  "id": 1
}
```

### GET /api/list
获取树洞列表（按时间倒序）

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "content": "内容",
      "created_at": 1699999999999
    }
  ]
}
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 访问 http://localhost:3000
```

## 部署到 Vercel

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 部署：
```bash
vercel
```

## 安全特性

- 敏感词过滤：自动过滤常见违规词汇
- 跨域处理：允许前端跨域访问
- 本地加密：私密日记使用简单加密存储在 localStorage

## 禁止功能

本项目禁止以下功能：
- 用户注册、登录
- 评论、点赞、关注、分享
- 收集用户信息
- 广告、推荐、第三方统计