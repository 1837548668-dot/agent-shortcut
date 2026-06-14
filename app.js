const agents = [
  {
    tag: "OPC1",
    name: "百万IP操盘手智能体",
    description: "找准百万IP定位，打造可持续增长影响力",
    url: "https://chatgpt.com/g/g-69f767ff809881918aea505d58b45317-aixing-qiu-opc1-bai-mo-ipding-wei-cao-pan-shou-zhi-neng-ti",
  },
  {
    tag: "OPC2",
    name: "企业商学院搭建智能体",
    description: "搭好企业商学院，把经验变成组织能力",
    url: "https://chatgpt.com/g/g-6a02e94e160081918197709ebd5f5d81-aixing-qiu-opc2-qi-ye-shang-xue-yuan-da-jian-zhi-neng-ti",
  },
  {
    tag: "OPC3",
    name: "世界级品牌专家智能体",
    description: "升级品牌战略，让客户一眼记住并信任",
    url: "https://chatgpt.com/g/g-69f5b2420c888191b3868c862918c5d9-aixing-qiu-opc3-pin-pai-sheng-ji-quan-an-zhi-neng-ti",
  },
  {
    tag: "OPC4",
    name: "百业销冠智能体",
    description: "看懂客户需求，帮助团队更快成交",
    url: "https://chatgpt.com/g/g-6983629d77048191be72c235965d25c1-aixing-qiu-opc4-bai-ye-xiao-guan-zhi-neng-ti-2-0",
  },
  {
    tag: "OPC5",
    name: "造课大师智能体",
    description: "从定位到交付搭好课程，让知识变现",
    url: "https://chatgpt.com/g/g-6983655688a48191951f60175611b24e-aixing-qiu-opc5-zao-ke-da-shi-zhi-neng-3-0",
  },
  {
    tag: "OPC6",
    name: "中桥决策机智能体",
    description: "梳理关键变量，辅助你做出更稳决策",
    url: "https://chatgpt.com/g/g-69f7d1e530f081919e18c4ca91ca9e94-aixing-qiu-opc6-zong-cai-jue-ce-ji",
  },
  {
    tag: "OPC7",
    name: "个体企业转型智能体",
    description: "找到个体转型路径，把能力变成持续收入",
    url: "https://chatgpt.com/g/g-69c21baa450481918c05bfb9e5c8b956-aixing-qiu-opc7-ge-ti-zhuan-xing-jiao-lian",
  },
  {
    tag: "OPC8",
    name: "不命理八字易经智能体",
    description: "看懂八字易经脉络，梳理人生选择方向",
    url: "https://chatgpt.com/g/g-699b2471c03c819198678ae2addb11ea-aixing-qiu-opc8-ming-li-ba-zi-yi-jing-zhi-neng-ti",
  },
  {
    tag: "OPC9",
    name: "企业增长顾问智能体",
    description: "找到企业增长抓手，给你能落地的方案",
    url: "https://chatgpt.com/g/g-69b7716c60908191a28af09d1e25f629-aixing-qiu-opc9-qi-ye-zeng-chang-gu-wen",
  },
  {
    tag: "OPC10",
    name: "百业法务万能智能体",
    description: "提前识别经营法务风险，让决策更安心",
    url: "https://chatgpt.com/g/g-6a0347aea3148191a86495472f673fbb-ixing-qiu-opc10-bai-ye-fa-wu-mo-neng-zhi-neng-ti-v3-0",
  },
];

const coreList = document.querySelector("#coreList");
const coreCount = document.querySelector("#coreCount");
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
const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(navigator.userAgent);
const isDesktop = !isIOS && !isAndroid && !("ontouchstart" in window);
const isIOSInAppBrowser =
  isIOS && /MicroMessenger|Weibo|DingTalk|Lark|Feishu|QQ\//i.test(navigator.userAgent);

function createAgentRow(agent, index) {
  const link = document.createElement("a");
  link.className = "agent-row agent-row--core";
  link.href = agent.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.setProperty("--index", index);
  link.setAttribute("aria-label", `打开${agent.name}`);

  const badge = document.createElement("span");
  badge.className = "agent-badge";
  badge.textContent = agent.tag;

  const copy = document.createElement("span");
  copy.className = "agent-copy";

  const name = document.createElement("strong");
  name.textContent = agent.name;

  const description = document.createElement("span");
  description.textContent = agent.description;
  description.title = agent.description;

  const arrow = document.createElement("span");
  arrow.className = "agent-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "›";

  copy.append(name, description);
  link.append(badge, copy, arrow);
  return link;
}

function renderAgents() {
  coreCount.textContent = `${agents.length} 位`;
  coreList.replaceChildren(...agents.map(createAgentRow));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

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
