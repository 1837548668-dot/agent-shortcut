# AI星球

这是一个包含 10 个固定 OPC 智能体入口的响应式 PWA 导航页，适合电脑、安卓手机、安卓平板和 iPad 使用。通过浏览器安装或添加到主屏幕后，可以像普通 App 一样打开。

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

## 智能体入口

10 个智能体的名称和跳转链接固定写在 `app.js` 的 `agents` 数组中，页面不提供编辑入口，避免使用者误改。
