const AGENT_STORAGE_KEY = "ai-planet-agents-v2";
const CHAT_STORAGE_KEY = "ai-planet-chats-v1";
const API_ENDPOINT = window.location.hostname === "1837548668-dot.github.io"
  ? "https://ai-planet-1837548668.vercel.app/api/chat"
  : "/api/chat";

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
    id: "general",
    name: "全能问答",
    description: "日常问题与灵感",
    welcome: "你好，我是全能问答。无论是工作、生活还是突然冒出的想法，都可以直接告诉我。",
    suggestions: ["帮我梳理今天的任务", "解释一个复杂概念", "给我一些新点子"],
    color: "#4f7cff",
    glow: "#8eabff",
    shadow: "rgba(79, 124, 255, 0.32)",
  },
  {
    id: "copywriter",
    name: "文案助手",
    description: "文章、标题与脚本",
    welcome: "把产品、主题和受众告诉我，我可以帮你写标题、文章、短视频脚本和营销文案。",
    suggestions: ["写一条朋友圈文案", "优化这段产品介绍", "生成一个短视频脚本"],
    color: "#8b67ed",
    glow: "#bba6f8",
    shadow: "rgba(139, 103, 237, 0.3)",
  },
  {
    id: "learning",
    name: "学习教练",
    description: "解释知识与学习计划",
    welcome: "我是你的学习教练。我会用容易理解的方式讲清知识，并帮你制定可以执行的学习计划。",
    suggestions: ["用简单的话解释一个知识点", "制定七天学习计划", "帮我出几道练习题"],
    color: "#12a594",
    glow: "#7ad9ce",
    shadow: "rgba(18, 165, 148, 0.28)",
  },
  {
    id: "analyst",
    name: "数据分析",
    description: "表格、数据与结论",
    welcome: "请把数据、指标或业务问题发给我。我会帮你梳理分析思路、发现趋势并给出结论。",
    suggestions: ["设计一套分析指标", "解读一组销售数据", "帮我找出问题原因"],
    color: "#ec7c42",
    glow: "#ffc09c",
    shadow: "rgba(236, 124, 66, 0.28)",
  },
  {
    id: "meeting",
    name: "会议总结",
    description: "整理记录与行动项",
    welcome: "把会议记录粘贴过来，我会整理核心结论、待办事项、负责人和时间节点。",
    suggestions: ["整理这份会议记录", "提取待办事项", "生成会议纪要模板"],
    color: "#3779c8",
    glow: "#91c5fb",
    shadow: "rgba(55, 121, 200, 0.28)",
  },
  {
    id: "visual",
    name: "图片创意",
    description: "视觉灵感与提示词",
    welcome: "告诉我你想制作的画面，我会帮你设计视觉方向，并生成清晰可用的图片提示词。",
    suggestions: ["设计一张高级海报", "生成产品摄影提示词", "给我三个视觉创意"],
    color: "#e55d83",
    glow: "#f5a5ba",
    shadow: "rgba(229, 93, 131, 0.28)",
  },
  {
    id: "translator",
    name: "翻译专家",
    description: "多语言翻译与润色",
    welcome: "把需要翻译的内容和目标语言发给我。我会兼顾准确、自然和具体使用场景。",
    suggestions: ["翻译成自然英文", "润色这段中文", "做中英双语版本"],
    color: "#5367cf",
    glow: "#9ba8ee",
    shadow: "rgba(83, 103, 207, 0.28)",
  },
  {
    id: "developer",
    name: "编程助手",
    description: "代码、排错与技术方案",
    welcome: "把代码、报错或想实现的功能发给我。我会先定位问题，再给出可执行的解决方案。",
    suggestions: ["帮我分析这段报错", "写一个简单程序", "评审一个技术方案"],
    color: "#c56b45",
    glow: "#edb092",
    shadow: "rgba(197, 107, 69, 0.28)",
  },
  {
    id: "operations",
    name: "运营策划",
    description: "活动、增长与执行计划",
    welcome: "告诉我业务目标、用户和资源情况，我会帮你拆解运营策略、活动方案和执行节奏。",
    suggestions: ["策划一次拉新活动", "制定月度运营计划", "分析用户增长问题"],
    color: "#3584e4",
    glow: "#8dc0fa",
    shadow: "rgba(53, 132, 228, 0.28)",
  },
  {
    id: "life",
    name: "生活顾问",
    description: "日程、清单与生活建议",
    welcome: "我可以帮你规划日程、整理清单、比较选择，让日常生活更轻松有序。",
    suggestions: ["规划我的周末", "整理旅行清单", "帮我比较两个选择"],
    color: "#1b9a8c",
    glow: "#80d2c8",
    shadow: "rgba(27, 154, 140, 0.28)",
  },
  {
    id: "research",
    name: "深度研究",
    description: "研究框架与资料整理",
    welcome: "告诉我研究主题和最终用途，我会帮你建立框架、梳理关键问题并形成结构化结论。",
    suggestions: ["建立一个研究框架", "比较两个行业趋势", "整理一份调研提纲"],
    color: "#815ac0",
    glow: "#bca1e7",
    shadow: "rgba(129, 90, 192, 0.28)",
  },
];

const homeView = document.querySelector("#homeView");
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
const chatView = document.querySelector("#chatView");
const chatBackButton = document.querySelector("#chatBackButton");
const clearChatButton = document.querySelector("#clearChatButton");
const chatAgentIcon = document.querySelector("#chatAgentIcon");
const chatAgentName = document.querySelector("#chatAgentName");
const chatMessages = document.querySelector("#chatMessages");
const chatSuggestions = document.querySelector("#chatSuggestions");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const sendButton = document.querySelector("#sendButton");

let deferredInstallPrompt = null;
let agents = loadAgents();
let chatHistories = loadChatHistories();
let activeAgentId = null;
let isSending = false;

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
    const stored = JSON.parse(localStorage.getItem(AGENT_STORAGE_KEY));
    if (!Array.isArray(stored)) {
      return structuredClone(defaultAgents);
    }

    return defaultAgents.map((defaultAgent, index) => ({
      ...defaultAgent,
      name: stored[index]?.name || defaultAgent.name,
    }));
  } catch {
    return structuredClone(defaultAgents);
  }
}

function loadChatHistories() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY));
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function saveChatHistories() {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistories));
}

function getAgentIndex(agentId) {
  return agents.findIndex((agent) => agent.id === agentId);
}

function getActiveAgent() {
  return agents.find((agent) => agent.id === activeAgentId);
}

function renderAgents() {
  agentCount.textContent = `${agents.length} 个智能体已就绪`;

  agentGrid.replaceChildren(
    ...agents.map((agent, index) => {
      const button = document.createElement("button");
      button.className = index === 0 ? "agent-card agent-card--featured" : "agent-card";
      button.type = "button";
      button.style.setProperty("--index", index);
      button.style.setProperty("--accent", agent.color);
      button.style.setProperty("--glow", agent.glow);
      button.style.setProperty("--icon-shadow", agent.shadow);
      button.setAttribute("aria-label", `与${agent.name}对话`);
      button.addEventListener("click", () => openChat(agent.id));

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
      button.append(top, bottom);
      return button;
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

      const heading = document.createElement("span");
      const title = document.createElement("p");
      const description = document.createElement("small");
      title.className = "edit-item-title";
      title.textContent = `智能体 ${String(index + 1).padStart(2, "0")}`;
      description.textContent = agent.description;
      heading.append(title, description);
      itemHeader.append(itemIcon, heading);

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
      item.append(itemHeader, nameLabel);
      return item;
    }),
  );
}

function createMessage(role, content, options = {}) {
  const row = document.createElement("div");
  row.className = `message-row message-row--${role}`;

  if (role === "assistant") {
    const index = getAgentIndex(activeAgentId);
    const avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.append(createIcon(Math.max(index, 0)));
    row.append(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  if (options.loading) {
    bubble.classList.add("message-bubble--loading");
    bubble.innerHTML = "<i></i><i></i><i></i>";
  } else {
    bubble.textContent = content;
  }
  row.append(bubble);
  return row;
}

function renderChat() {
  const agent = getActiveAgent();
  if (!agent) return;

  const index = getAgentIndex(agent.id);
  chatAgentName.textContent = agent.name;
  chatAgentIcon.replaceChildren(createIcon(index));
  chatAgentIcon.style.setProperty("--accent", agent.color);
  chatAgentIcon.style.setProperty("--glow", agent.glow);
  chatAgentIcon.style.setProperty("--icon-shadow", agent.shadow);

  const history = chatHistories[agent.id] || [];
  const nodes = [createMessage("assistant", agent.welcome)];
  history.forEach((message) => nodes.push(createMessage(message.role, message.content)));
  if (isSending) nodes.push(createMessage("assistant", "", { loading: true }));
  chatMessages.replaceChildren(...nodes);

  chatSuggestions.replaceChildren(
    ...agent.suggestions.map((suggestion) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = suggestion;
      button.addEventListener("click", () => {
        chatInput.value = suggestion;
        resizeTextarea();
        chatInput.focus();
      });
      return button;
    }),
  );

  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

function openChat(agentId) {
  activeAgentId = agentId;
  homeView.hidden = true;
  chatView.hidden = false;
  document.body.classList.add("chat-open");
  renderChat();
  window.scrollTo(0, 0);
  window.history.pushState({ chat: agentId }, "", `#${agentId}`);
  setTimeout(() => chatInput.focus(), 150);
}

function closeChat({ updateHistory = true } = {}) {
  activeAgentId = null;
  chatView.hidden = true;
  homeView.hidden = false;
  document.body.classList.remove("chat-open");
  chatInput.value = "";
  resizeTextarea();
  if (updateHistory && window.location.hash) {
    window.history.pushState({}, "", window.location.pathname + window.location.search);
  }
}

function clearActiveChat() {
  const agent = getActiveAgent();
  if (!agent) return;
  chatHistories[agent.id] = [];
  saveChatHistories();
  renderChat();
  showToast("已开始新对话");
}

function resizeTextarea() {
  chatInput.style.height = "auto";
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 140)}px`;
}

async function sendMessage(text) {
  const agent = getActiveAgent();
  if (!agent || isSending) return;

  const history = chatHistories[agent.id] || [];
  history.push({ role: "user", content: text });
  chatHistories[agent.id] = history;
  saveChatHistories();

  isSending = true;
  sendButton.disabled = true;
  chatInput.disabled = true;
  renderChat();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agent.id,
        messages: history.slice(-16).map(({ role, content }) => ({ role, content })),
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "智能体暂时无法回复");
    }

    history.push({ role: "assistant", content: data.reply });
    saveChatHistories();
  } catch (error) {
    history.push({
      role: "assistant",
      content: `连接失败：${error.message || "请稍后再试"}`,
    });
    saveChatHistories();
  } finally {
    isSending = false;
    sendButton.disabled = false;
    chatInput.disabled = false;
    renderChat();
    chatInput.focus();
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

editButton.addEventListener("click", () => {
  renderEditor();
  editDialog.showModal();
});

editForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;

  event.preventDefault();
  const formData = new FormData(editForm);
  agents = agents.map((agent, index) => ({
    ...agent,
    name: String(formData.get(`name-${index}`) || "").trim(),
  }));
  localStorage.setItem(
    AGENT_STORAGE_KEY,
    JSON.stringify(agents.map(({ id, name }) => ({ id, name }))),
  );
  renderAgents();
  editDialog.close();
  showToast("已保存");
});

resetButton.addEventListener("click", () => {
  agents = structuredClone(defaultAgents);
  localStorage.removeItem(AGENT_STORAGE_KEY);
  renderEditor();
  renderAgents();
  showToast("已恢复默认名称");
});

chatBackButton.addEventListener("click", () => closeChat());
clearChatButton.addEventListener("click", clearActiveChat);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";
  resizeTextarea();
  sendMessage(text);
});

chatInput.addEventListener("input", resizeTextarea);
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

window.addEventListener("popstate", () => {
  if (activeAgentId) closeChat({ updateHistory: false });
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
  showToast("AI星球已安装");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

renderAgents();

const initialAgentId = window.location.hash.slice(1);
if (agents.some((agent) => agent.id === initialAgentId)) {
  openChat(initialAgentId);
}
