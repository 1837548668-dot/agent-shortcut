const STORAGE_KEY = "agent-shortcut-items-v1";

const iconTemplates = [
  '<path d="m12 3 1.5 4.2L18 9l-4.5 1.8L12 15l-1.5-4.2L6 9l4.5-1.8L12 3Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
  '<path d="m4 20 4.2-1 10.6-10.6a2.8 2.8 0 0 0-4-4L4.2 15 4 20Z"/><path d="m13 6 4 4"/>',
  '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"/>',
  '<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/><path d="M3 21h18"/>',
  '<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m5 17 4-4 3 3 2-2 5 4"/>',
  '<path d="M4 5h7M7.5 3v2c0 5-2 8-5 10M5 9c1.5 2.5 3.5 4.3 6 5.5M14 19l3-9 3 9M15 16h4"/>',
  '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
  '<circle cx="12" cy="12" r="8"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5M8 11h6M11 8v6"/>',
];

const defaultAgents = [
  {
    name: "全能问答",
    description: "日常问题与灵感",
    url: "https://chatgpt.com/",
    color: "#4f7cff",
    glow: "#8eabff",
    shadow: "rgba(79, 124, 255, 0.32)",
  },
  {
    name: "文案助手",
    description: "文章、标题与脚本",
    url: "https://www.doubao.com/chat/",
    color: "#8b67ed",
    glow: "#bba6f8",
    shadow: "rgba(139, 103, 237, 0.3)",
  },
  {
    name: "学习教练",
    description: "解释知识与学习计划",
    url: "https://www.kimi.com/zh",
    color: "#12a594",
    glow: "#7ad9ce",
    shadow: "rgba(18, 165, 148, 0.28)",
  },
  {
    name: "数据分析",
    description: "表格、数据与结论",
    url: "https://www.qianwen.com/",
    color: "#ec7c42",
    glow: "#ffc09c",
    shadow: "rgba(236, 124, 66, 0.28)",
  },
  {
    name: "会议总结",
    description: "整理记录与行动项",
    url: "https://yiyan.baidu.com/",
    color: "#3779c8",
    glow: "#91c5fb",
    shadow: "rgba(55, 121, 200, 0.28)",
  },
  {
    name: "图片创意",
    description: "视觉灵感与提示词",
    url: "https://yuanbao.tencent.com/",
    color: "#e55d83",
    glow: "#f5a5ba",
    shadow: "rgba(229, 93, 131, 0.28)",
  },
  {
    name: "翻译专家",
    description: "多语言翻译与润色",
    url: "https://chat.deepseek.com/",
    color: "#5367cf",
    glow: "#9ba8ee",
    shadow: "rgba(83, 103, 207, 0.28)",
  },
  {
    name: "编程助手",
    description: "代码、排错与技术方案",
    url: "https://claude.ai/",
    color: "#c56b45",
    glow: "#edb092",
    shadow: "rgba(197, 107, 69, 0.28)",
  },
  {
    name: "运营策划",
    description: "活动、增长与执行计划",
    url: "https://gemini.google.com/",
    color: "#3584e4",
    glow: "#8dc0fa",
    shadow: "rgba(53, 132, 228, 0.28)",
  },
  {
    name: "生活顾问",
    description: "日程、清单与生活建议",
    url: "https://copilot.microsoft.com/",
    color: "#1b9a8c",
    glow: "#80d2c8",
    shadow: "rgba(27, 154, 140, 0.28)",
  },
  {
    name: "深度研究",
    description: "搜索资料与整理来源",
    url: "https://www.perplexity.ai/",
    color: "#815ac0",
    glow: "#bca1e7",
    shadow: "rgba(129, 90, 192, 0.28)",
  },
];

const agentGrid = document.querySelector("#agentGrid");
const editButton = document.querySelector("#editButton");
const editDialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const editList = document.querySelector("#editList");
const resetButton = document.querySelector("#resetButton");
const installButton = document.querySelector("#installButton");
const installPanel = document.querySelector("#installPanel");
const installTitle = document.querySelector("#installTitle");
const installDescription = document.querySelector("#installDescription");
const agentCount = document.querySelector("#agentCount");
const toast = document.querySelector("#toast");

let deferredInstallPrompt = null;
let agents = loadAgents();
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(navigator.userAgent);
const isDesktop = !isIOS && !isAndroid && !("ontouchstart" in window);

if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) {
  installPanel.hidden = true;
} else if (isIOS) {
  installTitle.textContent = "添加到 iPad 主屏幕";
  installDescription.textContent = "点击 Safari 分享按钮，再选择“添加到主屏幕”";
  installButton.textContent = "查看方法";
} else if (isAndroid) {
  installTitle.textContent = "添加到安卓桌面";
  installDescription.textContent = "像 App 一样全屏打开，手机和平板通用";
  installButton.textContent = "添加";
} else if (isDesktop) {
  installTitle.textContent = "安装到电脑";
  installDescription.textContent = "固定到桌面或任务栏，随时快速打开";
  installButton.textContent = "安装";
}

function createIcon(index) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = iconTemplates[index % iconTemplates.length];
  return icon;
}

function loadAgents() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) {
      return structuredClone(defaultAgents);
    }

    return defaultAgents.map((defaultAgent, index) => ({
      ...defaultAgent,
      name: stored[index]?.name || defaultAgent.name,
      url: stored[index]?.url || defaultAgent.url,
    }));
  } catch {
    return structuredClone(defaultAgents);
  }
}

function renderAgents() {
  agentCount.textContent = `${agents.length} 个智能体已就绪`;

  agentGrid.replaceChildren(
    ...agents.map((agent, index) => {
      const link = document.createElement("a");
      link.className = index === 0 ? "agent-card agent-card--featured" : "agent-card";
      link.href = agent.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.setProperty("--index", index);
      link.style.setProperty("--accent", agent.color);
      link.style.setProperty("--glow", agent.glow);
      link.style.setProperty("--icon-shadow", agent.shadow);
      link.setAttribute("aria-label", `打开${agent.name}`);

      const top = document.createElement("span");
      top.className = "agent-top";

      const icon = document.createElement("span");
      icon.className = "agent-icon";
      icon.append(createIcon(index));

      const arrow = document.createElement("span");
      arrow.className = "launch-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M8 16 16 8M9 8h7v7"/></svg>';
      top.append(icon, arrow);

      const bottom = document.createElement("span");
      bottom.className = "agent-bottom";

      const text = document.createElement("span");
      text.className = "agent-copy";
      if (index === 0) {
        const featuredLabel = document.createElement("span");
        featuredLabel.className = "featured-label";
        featuredLabel.textContent = "PRIMARY AGENT";
        text.append(featuredLabel);
      }

      const name = document.createElement("span");
      const description = document.createElement("span");
      name.className = "agent-name";
      description.className = "agent-description";
      name.textContent = agent.name;
      description.textContent = agent.description;
      text.append(name, description);

      bottom.append(text);
      link.append(top, bottom);
      return link;
    }),
  );
}

function renderEditor() {
  editList.replaceChildren(
    ...agents.map((agent, index) => {
      const item = document.createElement("section");
      item.className = "edit-item";
      item.style.setProperty("--accent", agent.color);
      item.style.setProperty("--glow", agent.glow);
      item.style.setProperty("--icon-shadow", agent.shadow);

      const itemHeader = document.createElement("div");
      itemHeader.className = "edit-item-header";

      const itemIcon = document.createElement("span");
      itemIcon.className = "edit-item-icon";
      itemIcon.append(createIcon(index));

      const title = document.createElement("p");
      title.className = "edit-item-title";
      title.textContent = `智能体 ${String(index + 1).padStart(2, "0")}`;
      itemHeader.append(itemIcon, title);

      const nameLabel = document.createElement("label");
      nameLabel.className = "field";
      const nameCaption = document.createElement("span");
      nameCaption.textContent = "显示名称";
      const nameInput = document.createElement("input");
      nameInput.name = `name-${index}`;
      nameInput.value = agent.name;
      nameInput.maxLength = 18;
      nameInput.required = true;
      nameLabel.append(nameCaption, nameInput);

      const urlLabel = document.createElement("label");
      urlLabel.className = "field";
      const urlCaption = document.createElement("span");
      urlCaption.textContent = "跳转网址";
      const urlInput = document.createElement("input");
      urlInput.name = `url-${index}`;
      urlInput.type = "url";
      urlInput.inputMode = "url";
      urlInput.value = agent.url;
      urlInput.placeholder = "https://...";
      urlInput.required = true;
      urlLabel.append(urlCaption, urlInput);

      item.append(itemHeader, nameLabel, urlLabel);
      return item;
    }),
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

editButton.addEventListener("click", () => {
  renderEditor();
  editDialog.showModal();
});

editForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") {
    return;
  }

  event.preventDefault();
  const formData = new FormData(editForm);
  const nextAgents = agents.map((agent, index) => ({
    ...agent,
    name: String(formData.get(`name-${index}`) || "").trim(),
    url: String(formData.get(`url-${index}`) || "").trim(),
  }));

  const hasInvalidUrl = nextAgents.some((agent) => {
    try {
      const parsed = new URL(agent.url);
      return !["http:", "https:"].includes(parsed.protocol);
    } catch {
      return true;
    }
  });

  if (hasInvalidUrl) {
    showToast("请填写以 http:// 或 https:// 开头的网址");
    return;
  }

  agents = nextAgents;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(agents.map(({ name, url }) => ({ name, url }))),
  );
  renderAgents();
  editDialog.close();
  showToast("已保存");
});

resetButton.addEventListener("click", () => {
  agents = structuredClone(defaultAgents);
  localStorage.removeItem(STORAGE_KEY);
  renderEditor();
  renderAgents();
  showToast("已恢复示例");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installPanel.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (isIOS) {
    showToast("Safari：点分享按钮，再选“添加到主屏幕”");
    return;
  }

  if (!deferredInstallPrompt) {
    showToast(
      isDesktop
        ? "请在浏览器地址栏或菜单中选择“安装应用”"
        : "请在浏览器菜单中选择“添加到主屏幕”",
    );
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installPanel.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installPanel.hidden = true;
  showToast("已添加到主屏幕");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The page still works as a normal shortcut if service worker registration fails.
    });
  });
}

renderAgents();
