const STORAGE_KEY = "agent-shortcut-items-v1";

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
const toast = document.querySelector("#toast");

let deferredInstallPrompt = null;
let agents = loadAgents();

if (window.matchMedia("(display-mode: standalone)").matches) {
  installButton.hidden = true;
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
  agentGrid.replaceChildren(
    ...agents.map((agent, index) => {
      const link = document.createElement("a");
      link.className = "agent-card";
      link.href = agent.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.setProperty("--accent", agent.color);
      link.style.setProperty("--glow", agent.glow);
      link.style.setProperty("--icon-shadow", agent.shadow);
      link.setAttribute("aria-label", `打开${agent.name}`);

      const icon = document.createElement("span");
      icon.className = "agent-icon";
      icon.textContent = agent.name.trim().slice(0, 1) || String(index + 1);

      const bottom = document.createElement("span");
      bottom.className = "agent-bottom";

      const text = document.createElement("span");
      const name = document.createElement("span");
      const description = document.createElement("span");
      name.className = "agent-name";
      description.className = "agent-description";
      name.textContent = agent.name;
      description.textContent = agent.description;
      text.append(name, description);

      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";

      bottom.append(text, arrow);
      link.append(icon, bottom);
      return link;
    }),
  );
}

function renderEditor() {
  editList.replaceChildren(
    ...agents.map((agent, index) => {
      const item = document.createElement("section");
      item.className = "edit-item";

      const title = document.createElement("p");
      title.className = "edit-item-title";
      title.textContent = `智能体 ${index + 1}`;

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

      item.append(title, nameLabel, urlLabel);
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
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    showToast("请在浏览器菜单中选择“添加到主屏幕”");
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
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
