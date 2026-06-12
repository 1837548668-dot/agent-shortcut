const DEFAULT_MODEL = "grok-4.3";
const XAI_ENDPOINT = "https://api.x.ai/v1/chat/completions";
const XAI_MODELS_ENDPOINT = "https://api.x.ai/v1/models";
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const rateLimits = new Map();
let cachedModel = null;

const agentPrompts = {
  general:
    "你是“AI星球”的全能问答智能体。使用简洁、清楚、实用的中文回答。先理解用户真正目标，再给出可执行建议。遇到不确定或需要最新信息的内容要明确说明，不要编造。",
  copywriter:
    "你是专业文案策划。擅长中文标题、社交媒体文案、品牌介绍、文章和短视频脚本。写作前识别受众、场景、目标和语气；信息不足时先提出最关键的问题。输出自然、有传播力，避免空洞套话。",
  learning:
    "你是耐心的学习教练。用费曼式方法和循序渐进的结构解释知识，根据学习者水平调整难度。优先给例子、类比、练习和可执行学习计划，并在重要知识点后进行简短检验。",
  analyst:
    "你是严谨的数据分析顾问。区分事实、假设和推论，先澄清指标口径，再分析趋势、异常、原因和建议。没有原始数据时提供分析框架，不虚构数字。适合时用表格或分点表达。",
  meeting:
    "你是会议纪要与执行管理助手。将输入整理为会议主题、核心结论、分歧、决策、行动项、负责人和截止时间。缺失的信息标记为“待确认”，不要自行编造。",
  visual:
    "你是高级视觉创意总监和图片提示词专家。把模糊想法转成清晰的视觉概念、构图、色彩、材质、光线和生成提示词。优先给可直接用于主流图片生成模型的中文提示词，必要时附英文版。",
  translator:
    "你是专业翻译与语言润色专家。保持原意、语境、语气和术语一致，避免机械直译。默认提供自然译文；有歧义时说明不同译法。用户要求润色时，同时简述关键修改。",
  developer:
    "你是资深软件工程师。先定位需求或错误原因，再给出最小、可靠、可验证的方案。代码需完整、清晰并说明运行方式。不要假装执行过未执行的代码；涉及安全、数据删除或生产环境时明确风险。",
  operations:
    "你是增长与运营策划专家。围绕目标、用户、渠道、资源、节奏和指标制定方案。输出需包含策略、执行步骤、时间安排、负责人建议、成本与风险、复盘指标，避免只给概念。",
  life:
    "你是务实、温和的生活规划顾问。帮助用户整理日程、清单、选择和日常方案。优先考虑时间、预算、精力与个人偏好。医疗、法律、财务等高风险内容只提供一般信息并提示咨询专业人士。",
  research:
    "你是深度研究助手。围绕问题建立研究框架，拆分关键假设、证据需求、对立观点和结论。清楚区分已知信息与待核实信息。没有联网检索结果时不得伪造来源或声称看过具体资料。",
};

function setCors(req, res) {
  const origin = req.headers.origin || "";
  const allowed =
    origin === "https://1837548668-dot.github.io" ||
    /^https:\/\/ai-planet-1837548668(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || "")
    .split(",")[0]
    .trim();
}

function isRateLimited(req) {
  const now = Date.now();
  const ip = getClientIp(req) || "unknown";
  const current = rateLimits.get(ip);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    rateLimits.set(ip, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return null;

  const normalized = messages
    .slice(-16)
    .filter(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 4000),
    }))
    .filter((message) => message.content);

  const totalCharacters = normalized.reduce((sum, message) => sum + message.content.length, 0);
  if (!normalized.length || totalCharacters > 24_000) return null;
  if (normalized.at(-1)?.role !== "user") return null;
  return normalized;
}

async function resolveModel(apiKey, signal) {
  if (process.env.XAI_MODEL) return process.env.XAI_MODEL;
  if (cachedModel) return cachedModel;

  try {
    const response = await fetch(XAI_MODELS_ENDPOINT, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    });
    if (!response.ok) return DEFAULT_MODEL;

    const data = await response.json();
    const available = (data.data || [])
      .map((model) => model.id)
      .filter((id) => typeof id === "string");
    const preferred = [
      "grok-4.3",
      "grok-4-1-fast-reasoning",
      "grok-4-fast-reasoning",
      "grok-4-fast-non-reasoning",
      "grok-3-mini",
      "grok-3",
    ];

    cachedModel =
      preferred.find((model) => available.includes(model)) ||
      available.find((model) => /^grok/i.test(model) && !/image|vision/i.test(model)) ||
      DEFAULT_MODEL;
    return cachedModel;
  } catch {
    return DEFAULT_MODEL;
  }
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "仅支持 POST 请求" });
  }

  if (!process.env.XAI_API_KEY) {
    return res.status(503).json({ error: "AI 服务尚未配置" });
  }

  if (isRateLimited(req)) {
    return res.status(429).json({ error: "请求过于频繁，请稍后再试" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return res.status(400).json({ error: "请求格式无效" });
  }
  const prompt = agentPrompts[body.agentId];
  const messages = normalizeMessages(body.messages);

  if (!prompt || !messages) {
    return res.status(400).json({ error: "请求内容无效" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50_000);

  try {
    const model = await resolveModel(process.env.XAI_API_KEY, controller.signal);
    const response = await fetch(XAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: prompt }, ...messages],
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("xAI API error", response.status, data?.error?.message || data);
      return res.status(502).json({ error: "模型服务暂时不可用" });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({ error: "模型没有返回有效内容" });
    }

    return res.status(200).json({
      reply: reply.trim(),
      model: data.model || model,
    });
  } catch (error) {
    console.error("Chat request failed", error);
    const message = error?.name === "AbortError" ? "模型响应超时" : "无法连接模型服务";
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
};
