const STORAGE_KEY = "agent-shortcut-items-v1";
const CORE_AGENT_COUNT = 15;
const SPECIAL_TAGS = ["PLUS", "VIDEO", "知识库", "顾问", "创作"];

const defaultAgents = [
  { name: "全能问答", description: "日常问题与灵感", url: "https://chatgpt.com/" },
  { name: "文案助手", description: "文章、标题与脚本", url: "https://www.doubao.com/chat/" },
  { name: "学习教练", description: "解释知识与学习计划", url: "https://www.kimi.com/zh" },
  { name: "数据分析", description: "表格、数据与结论", url: "https://www.qianwen.com/" },
  { name: "会议总结", description: "整理记录与行动项", url: "https://yiyan.baidu.com/" },
  { name: "图片创意", description: "视觉灵感与提示词", url: "https://yuanbao.tencent.com/" },
  { name: "翻译专家", description: "多语言翻译与润色", url: "https://chat.deepseek.com/" },
  { name: "编程助手", description: "代码、排错与技术方案", url: "https://claude.ai/" },
  { name: "运营策划", description: "活动、增长与执行计划", url: "https://gemini.google.com/" },
  { name: "生活顾问", description: "日程、清单与生活建议", url: "https://copilot.microsoft.com/" },
  { name: "深度研究", description: "搜索资料与整理来源", url: "https://www.perplexity.ai/" },
  { name: "PPT 大师", description: "演示结构与视觉表达", url: "https://gamma.app/" },
  { name: "财务助手", description: "预算、测算与经营分析", url: "https://chatgpt.com/" },
  { name: "法务顾问", description: "合同审阅与风险提示", url: "https://chat.deepseek.com/" },
  { name: "人才教练", description: "招聘、绩效与团队发展", url: "https://www.doubao.com/chat/" },
  { name: "短视频导演", description: "选题、脚本与分镜创作", url: "https://www.capcut.cn/" },
  { name: "视频生成", description: "创意视频与动态内容", url: "https://klingai.kuaishou.com/" },
  { name: "企业知识库", description: "资料整理与知识问答", url: "https://notebooklm.google.com/" },
  { name: "增长顾问", description: "商业增长与营销策略", url: "https://gemini.google.com/" },
  { name: "品牌创作", description: "品牌视觉与传播创意", url: "https://www.canva.com/" },
];

const coreList = document.querySelector("#coreList");
const specialList = document.querySelector("#specialList");
const coreCount = document.querySelector("#coreCount");
const specialCount = document.querySelector("#specialCount");
const editButtons = document.querySelectorAll("[data-edit-agents]");
const editDialog = document.querySelector("#editDialog");
const editForm = document.querySelector("#editForm");
const editList = document.querySelector("#editList");
const resetButton = document.querySelector("#resetButton");
const installButton = document.querySelector("#installButton");
const installPanel = document.querySelector("#installPanel");
const installTitle = document.querySelector("#installTitle");
const installDescription = document.querySelector("#installDescription");
const iosQuickInstall = document.querySelector("#iosQuickInstall");
const iosInstallDialog = document.querySelector("#iosInstallDialog");
const iosBrowserNotice = document.querySelector("#iosBrowserNotice");
const copyInstallLink = document.querySelector("#copyInstallLink");
const toast = document.querySelector("#toast");

let deferredInstallPrompt = null;
let agents = loadAgents();
const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(navigator.userAgent);
const isDesktop = !isIOS && !isAndroid && !("ontouchstart" in window);
const isIOSInAppBrowser =
  isIOS && /MicroMessenger|Weibo|DingTalk|Lark|Feishu|QQ\//i.test(navigator.userAgent);

if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) {
  installPanel.hidden = true;
} else if (isIOS) {
  iosQuickInstall.hidden = false;
  installPanel.classList.add("install-panel--ios");
  installTitle.textContent = "在苹果手机上安装 AI星球";
  installDescription.textContent = "无需 App Store，3 步添加到主屏幕";
  installButton.textContent = "安装教程";
} else if (isAndroid) {
  installTitle.textContent = "添加到安卓桌面";
  installDescription.textContent = "手机和平板均可像 App 一样打开";
} else if (isDesktop) {
  installTitle.textContent = "安装到电脑";
  installDescription.textContent = "固定到桌面或任务栏，快速打开";
  installButton.textContent = "安装";
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

function createAgentRow(agent, index) {
  const isCore = index < CORE_AGENT_COUNT;
  const link = document.createElement("a");
  link.className = `agent-row agent-row--${isCore ? "core" : "special"}`;
  link.href = agent.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.setProperty("--index", index);
  link.setAttribute("aria-label", `打开${agent.name}`);

  const badge = document.createElement("span");
  badge.className = "agent-badge";
  badge.textContent = isCore ? `OPC${index + 1}` : SPECIAL_TAGS[index - CORE_AGENT_COUNT];

  const copy = document.createElement("span");
  copy.className = "agent-copy";

  const name = document.createElement("strong");
  name.textContent = agent.name;

  const description = document.createElement("span");
  description.textContent = agent.description;

  copy.append(name, description);

  const arrow = document.createElement("span");
  arrow.className = "agent-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "›";

  link.append(badge, copy, arrow);
  return link;
}

function renderAgents() {
  const coreAgents = agents.slice(0, CORE_AGENT_COUNT);
  const specialAgents = agents.slice(CORE_AGENT_COUNT);

  coreCount.textContent = `${coreAgents.length} 位`;
  specialCount.textContent = `${specialAgents.length} 位`;
  coreList.replaceChildren(...coreAgents.map(createAgentRow));
  specialList.replaceChildren(
    ...specialAgents.map((agent, index) => createAgentRow(agent, index + CORE_AGENT_COUNT)),
  );
}

function renderEditor() {
  editList.replaceChildren(
    ...agents.map((agent, index) => {
      const item = document.createElement("section");
      item.className = "edit-item";

      const header = document.createElement("div");
      header.className = "edit-item-header";

      const tag = document.createElement("span");
      tag.className = index < CORE_AGENT_COUNT ? "edit-tag" : "edit-tag edit-tag--special";
      tag.textContent =
        index < CORE_AGENT_COUNT ? `OPC${index + 1}` : SPECIAL_TAGS[index - CORE_AGENT_COUNT];

      const title = document.createElement("strong");
      title.textContent = agent.name;
      header.append(tag, title);

      const nameLabel = document.createElement("label");
      nameLabel.className = "field";
      nameLabel.innerHTML = "<span>显示名称</span>";
      const nameInput = document.createElement("input");
      nameInput.name = `name-${index}`;
      nameInput.value = agent.name;
      nameInput.maxLength = 18;
      nameInput.required = true;
      nameLabel.append(nameInput);

      const urlLabel = document.createElement("label");
      urlLabel.className = "field";
      urlLabel.innerHTML = "<span>跳转网址</span>";
      const urlInput = document.createElement("input");
      urlInput.name = `url-${index}`;
      urlInput.type = "url";
      urlInput.inputMode = "url";
      urlInput.autocapitalize = "off";
      urlInput.autocomplete = "url";
      urlInput.spellcheck = false;
      urlInput.value = agent.url;
      urlInput.placeholder = "https://...";
      urlInput.required = true;
      urlLabel.append(urlInput);

      item.append(header, nameLabel, urlLabel);
      return item;
    }),
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

editButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderEditor();
    editDialog.showModal();
  });
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
  showToast("网址已保存，点击卡片即可打开");
});

resetButton.addEventListener("click", () => {
  agents = structuredClone(defaultAgents);
  localStorage.removeItem(STORAGE_KEY);
  renderEditor();
  renderAgents();
  showToast("已恢复默认");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installPanel.hidden = false;
});

function openIOSInstallGuide() {
  iosBrowserNotice.hidden = !isIOSInAppBrowser;
  iosInstallDialog.showModal();
}

iosQuickInstall.addEventListener("click", openIOSInstallGuide);

installButton.addEventListener("click", async () => {
  if (isIOS) {
    openIOSInstallGuide();
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

copyInstallLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("网址已复制，请在 Safari 中打开");
  } catch {
    showToast("请复制浏览器地址栏中的网址");
  }
});

window.addEventListener("appinstalled", () => {
  installPanel.hidden = true;
  showToast("已添加到桌面");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The shortcut remains usable if service worker registration fails.
    });
  });
}

renderAgents();
