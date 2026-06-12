# AI星球

这是一个适合电脑、安卓手机、安卓平板和 iPad 使用的响应式多智能体聊天 PWA。11 个智能体在应用内直接对话，通过安全后端调用 xAI API。

## API 配置

后端部署在 Vercel，API Key 只保存在服务器环境变量中：

- `XAI_API_KEY`：必填
- `XAI_MODEL`：选填，默认 `grok-4.3`

## 本地预览

在本目录运行：

```powershell
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

## 安装到设备

1. 把本目录发布到任意支持 HTTPS 的静态网站服务，例如 GitHub Pages、Cloudflare Pages 或 Netlify。
2. 电脑和安卓设备：使用 Chrome 或 Edge 打开网址，选择“安装应用”或“添加到主屏幕”。
3. iPad：使用 Safari 打开网址，点击分享按钮，再选择“添加到主屏幕”。
4. 桌面或主屏幕会出现“AI星球”图标。

## 修改智能体

打开页面后点击右上角编辑按钮，可直接修改 11 个智能体名称和网址。修改结果保存在当前手机的浏览器中。

默认示例链接写在 `app.js` 的 `defaultAgents` 数组中，也可以直接在代码中替换。
