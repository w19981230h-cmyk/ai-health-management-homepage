const states = {
  empty: {
    type: "empty"
  },
  initial: {
    type: "score",
    className: "initial",
    label: "健康评分",
    score: 78,
    status: "需关注",
    statusClass: "status-warning",
    change: "较上次 ↓ 6 分",
    visual: "illustration-shield",
    middle: `<div class="focus-row"><span>BMI超重</span><span>血压偏高</span><span>血糖偏高</span></div>`,
    advice: "建议控制饮食，规律运动，3个月后重新评估，并持续关注血压变化。",
    link: "查看健康分析报告 〉"
  },
  improving: {
    type: "score",
    className: "improving",
    label: "健康评分",
    score: 86,
    status: "良好",
    statusClass: "status-good",
    change: "较上次 ↑ 8 分",
    visual: "progress",
    middle: `
      <div class="metric-grid">
        <div><span>体重</span><strong>68.5kg</strong><em>↓ 1.6kg</em></div>
        <div><span>BMI</span><strong>24.1</strong><em>正常</em></div>
        <div><span>体脂率</span><strong>27.2%</strong><em>↓ 2.1%</em></div>
      </div>
    `,
    advice: "建议保持下降趋势，继续坚持当前计划；可增加力量训练，帮助提升基础代谢。",
    link: "查看健康趋势 〉"
  },
  risk: {
    type: "score",
    className: "risk",
    label: "健康评分",
    score: 65,
    status: "重点关注",
    statusClass: "status-risk",
    change: "较上次 ↓ 5 分",
    visual: "illustration-risk",
    middle: `
      <div class="risk-list">
        <strong>主要风险</strong>
        <p><i></i>血压连续7天偏高<span>148/95 mmHg</span></p>
        <p><i></i>空腹血糖偏高<span>7.2 mmol/L</span></p>
      </div>
    `,
    advice: "建议减少盐油摄入，规律服药，今日尽快完成血压记录并安排复查。",
    link: "查看风险详情 〉"
  },
  complete: {
    type: "score",
    className: "complete",
    label: "健康评分",
    score: 92,
    status: "优秀",
    statusClass: "status-excellent",
    change: "较上次 ↑ 4 分",
    visual: "illustration-trophy",
    middle: "",
    advice: "太棒了！继续保持良好的生活习惯，巩固健康成果，保持当前节奏。",
    link: "查看健康报告 〉"
  }
};

const mainCard = document.querySelector("#mainCard");
const memberSwitcher = document.querySelector(".member-switcher");
const currentPatientName = document.querySelector("#currentPatientName");
const currentPatientMeta = document.querySelector("#currentPatientMeta");
const taskPanel = document.querySelector("#taskPanel");
const addButton = document.querySelector("#addButton");
const tabbarLinks = document.querySelectorAll(".tabbar a");
const homeOnlySections = document.querySelectorAll(".home-only");
const planPage = document.querySelector("#planPage");
const servicePage = document.querySelector("#servicePage");
const serviceDetailPage = document.querySelector("#serviceDetailPage");
const minePage = document.querySelector("#minePage");
const subPages = document.querySelectorAll(".sub-page");
const packageList = document.querySelector("#packageList");
const serviceFilters = document.querySelectorAll(".service-filter button");
const serviceFab = document.querySelector("#serviceFab");
const sheetMask = document.querySelector("#sheetMask");
const serviceActionSheet = document.querySelector("#serviceActionSheet");
const supportSheet = document.querySelector("#supportSheet");
const shareSheet = document.querySelector("#shareSheet");
const uploadSheet = document.querySelector("#uploadSheet");
const medicalReportList = document.querySelector("#medicalReportList");
const medicalCategoryTabs = document.querySelector("#medicalCategoryTabs");
const parseTaskEntry = document.querySelector("#parseTaskEntry");
const parseTaskList = document.querySelector("#parseTaskList");
const selectedFiles = document.querySelector("#selectedFiles");
const uploadTypeSelect = document.querySelector("#uploadTypeSelect");
const submitUpload = document.querySelector("#submitUpload");
const submitAndParse = document.querySelector("#submitAndParse");
const detailReportName = document.querySelector("#detailReportName");
const detailReportType = document.querySelector("#detailReportType");
const detailReportOrg = document.querySelector("#detailReportOrg");
const detailReportDate = document.querySelector("#detailReportDate");
const detailUploadTime = document.querySelector("#detailUploadTime");
const saveReportInfo = document.querySelector("#saveReportInfo");
const supplementDialog = document.querySelector("#supplementDialog");
const supplementName = document.querySelector("#supplementName");
const supplementType = document.querySelector("#supplementType");
const supplementOrg = document.querySelector("#supplementOrg");
const supplementDate = document.querySelector("#supplementDate");
const supplementError = document.querySelector("#supplementError");
const reportDeleteDialog = document.querySelector("#reportDeleteDialog");
const taskDeleteDialog = document.querySelector("#taskDeleteDialog");
const purchaseDialog = document.querySelector("#purchaseDialog");
const detailBack = document.querySelector("#detailBack");
const detailShare = document.querySelector("#detailShare");
const serviceSupport = document.querySelector("#serviceSupport");
const favoriteBtn = document.querySelector("#favoriteBtn");
const buyButton = document.querySelector("#buyButton");
const toast = document.querySelector("#toast");
const logoutDialog = document.querySelector("#logoutDialog");
const logoutBtn = document.querySelector("#logoutBtn");
const profileNameButton = document.querySelector("#profileNameButton");
const profileGenderAge = document.querySelector("#profileGenderAge");
const cycleReminder = document.querySelector("#cycleReminder");
const cycleReminderText = document.querySelector("#cycleReminderText");
const cycleAction = document.querySelector("#cycleAction");
const cycleClose = document.querySelector("#cycleClose");
const cycleSheet = document.querySelector("#cycleSheet");
const cycleSheetTitle = document.querySelector("#cycleSheetTitle");
const cycleSheetDesc = document.querySelector("#cycleSheetDesc");
const cycleDate = document.querySelector("#cycleDate");
const profileTabs = document.querySelectorAll("[data-profile-tab]");
const profilePanels = document.querySelectorAll("[data-profile-panel]");
const uploadFab = document.querySelector("#uploadFab");
const periodCard = document.querySelector("#periodCard");
const periodStatusLine = document.querySelector("#periodStatusLine");
const periodForecastLine = document.querySelector("#periodForecastLine");
const periodAverageLine = document.querySelector("#periodAverageLine");
const periodActionButton = document.querySelector("#periodActionButton");
const periodDetailCurrent = document.querySelector("#periodDetailCurrent");
const periodAvgCycle = document.querySelector("#periodAvgCycle");
const periodAvgLength = document.querySelector("#periodAvgLength");
const periodHistoryList = document.querySelector("#periodHistoryList");
const periodConfirmDialog = document.querySelector("#periodConfirmDialog");
const periodEditDialog = document.querySelector("#periodEditDialog");
const periodDeleteDialog = document.querySelector("#periodDeleteDialog");
const periodEditStart = document.querySelector("#periodEditStart");
const periodEditEnd = document.querySelector("#periodEditEnd");
const periodEditError = document.querySelector("#periodEditError");
let pageStack = [];
let addedMemberCount = 0;
let currentPatient = { id: "self", name: "张女士", sex: "female", age: "32" };
let cycleSheetMode = "start";
let editingPeriodId = "";
let deletingPeriodId = "";
let selectedMedicalCategory = "全部";
let selectedReportId = "r1";
let selectedTaskId = "";
let selectedUploadFiles = [];
let deletingReportId = "";
let deletingTaskId = "";

const packages = [
  {
    id: "weight",
    title: "90天减重管理服务包",
    tags: "科学减重｜饮食管理｜运动指导",
    desc: "通过个性化饮食和运动方案，帮助您健康减重，塑造理想体型。",
    sales: "月销量 9,860+",
    img: "img-weight"
  },
  {
    id: "sugar",
    title: "90天控糖管理服务包",
    tags: "血糖监测｜饮食干预｜生活管理",
    desc: "科学管理血糖水平，帮助您稳定血糖，降低并发风险。",
    sales: "月销量 7,560+",
    img: "img-sugar"
  },
  {
    id: "pressure",
    title: "90天控压管理服务包",
    tags: "血压监测｜生活干预｜风险评估",
    desc: "个性化血压管理方案，帮助您稳定血压，守护心脑血管健康。",
    sales: "月销量 6,230+",
    img: "img-pressure"
  },
  {
    id: "nutrition",
    title: "90天营养管理服务包",
    tags: "营养评估｜膳食指导｜营养补充",
    desc: "专业营养师定制营养方案，改善饮食结构，提升身体健康。",
    sales: "月销量 5,120+",
    img: "img-nutrition"
  },
  {
    id: "comprehensive",
    title: "90天综合健康管理包",
    tags: "全面评估｜多维管理｜专属服务",
    desc: "全方位健康管理，涵盖多项指标，为您提供一站式健康解决方案。",
    sales: "月销量 3,420+",
    img: "img-comprehensive"
  }
];

const storedPeriodRecords = (() => {
  try {
    return JSON.parse(window.localStorage?.getItem("periodRecordsByPatient") || "{}");
  } catch {
    return {};
  }
})();

const periodRecordsByPatient = {
  self: [],
  mother: [
    { id: "m1", start: "2026-04-05", end: "2026-04-09" },
    { id: "m2", start: "2026-05-03", end: "2026-05-07" }
  ],
  ...storedPeriodRecords
};

function savePeriodRecords() {
  window.localStorage?.setItem("periodRecordsByPatient", JSON.stringify(periodRecordsByPatient));
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayString() {
  return formatDate(new Date());
}

function addDays(value, days) {
  const date = typeof value === "string" ? parseDate(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function daysBetween(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000);
}

function formatMonthDay(value) {
  const date = typeof value === "string" ? parseDate(value) : value;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function currentPeriodRecords() {
  if (!periodRecordsByPatient[currentPatient.id]) {
    periodRecordsByPatient[currentPatient.id] = [];
  }
  return periodRecordsByPatient[currentPatient.id];
}

function sortedPeriodRecords() {
  return [...currentPeriodRecords()].sort((a, b) => parseDate(b.start) - parseDate(a.start));
}

function averageRounded(values, fallback) {
  return values.length ? Math.round(values.reduce((sum, item) => sum + item, 0) / values.length) : fallback;
}

function calculatePeriodSummary() {
  const recordsDesc = sortedPeriodRecords();
  const recordsAsc = [...recordsDesc].reverse();
  const complete = recordsAsc.filter((record) => record.end);
  const cycleValues = [];
  for (let index = 1; index < recordsAsc.length; index += 1) {
    cycleValues.push(daysBetween(recordsAsc[index - 1].start, recordsAsc[index].start));
  }
  const avgCycle = averageRounded(cycleValues, 28);
  const avgLength = averageRounded(complete.map((record) => daysBetween(record.start, record.end) + 1), 5);
  const latest = recordsDesc[0];

  if (!latest) {
    return {
      hasRecords: false,
      inPeriod: false,
      phase: "暂无记录",
      avgCycle,
      avgLength,
      records: recordsDesc,
      action: "经期来了",
      status: "暂未记录经期",
      forecast: "记录后可帮你预测下次经期时间",
      average: ""
    };
  }

  const today = todayString();
  const latestEnd = latest.end || formatDate(addDays(latest.start, avgLength - 1));
  const realInPeriod = !latest.end;

  if (realInPeriod) {
    const remaining = Math.max(0, daysBetween(today, latestEnd));
    return {
      hasRecords: true,
      inPeriod: true,
      phase: "经期",
      avgCycle,
      avgLength,
      records: recordsDesc,
      action: "经期结束",
      activeRecord: latest,
      status: "当前阶段：经期",
      forecast: `预计 ${remaining} 天后经期结束，预计结束日：${formatMonthDay(latestEnd)}`,
      average: `平均周期：${avgCycle}天｜平均经期：${avgLength}天`
    };
  }

  let nextStart = addDays(latest.start, avgCycle);
  while (nextStart < parseDate(today)) {
    nextStart = addDays(nextStart, avgCycle);
  }
  const daysToStart = Math.max(0, daysBetween(today, formatDate(nextStart)));
  const distanceFromLatest = Math.max(0, daysBetween(latest.start, today));
  const cycleDay = (distanceFromLatest % avgCycle) + 1;
  const ovulationDay = Math.max(1, avgCycle - 14);
  let phase = "黄体期";
  if (cycleDay <= avgLength) {
    phase = "经期";
  } else if (cycleDay <= ovulationDay - 3) {
    phase = "卵泡期";
  } else if (cycleDay <= ovulationDay + 1) {
    phase = "排卵期";
  }

  return {
    hasRecords: true,
    inPeriod: false,
    phase,
    avgCycle,
    avgLength,
    records: recordsDesc,
    action: "经期来了",
    status: `当前阶段：${phase}`,
    forecast: `预计 ${daysToStart} 天后经期开始，预计开始日：${formatMonthDay(nextStart)}`,
    average: `平均周期：${avgCycle}天｜平均经期：${avgLength}天`
  };
}

const defaultMedicalReports = [
  {
    id: "r1",
    name: "血常规 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-06-01T09:30",
    uploadTime: "2025-06-01T10:05",
    thumb: "doc",
    ai: {
      summary: "本次血常规结果整体较平稳，个别指标需结合既往报告观察趋势。",
      conclusion: "暂未看到明显急性风险信号，建议按医生要求结合症状和既往病史综合判断。",
      focus: "白细胞和血红蛋白结果建议关注参考范围变化，如近期有发热、乏力等症状需进一步咨询医生。",
      notice: "保持规律作息，近期如有感染症状、用药变化或明显不适，应及时复查。",
      advice: "建议按医生要求定期复查；如出现明显不适，请及时就医。",
      next: "建议补充上传既往血常规报告，便于进行趋势对比。"
    }
  },
  {
    id: "r2",
    name: "肝功能 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-28T14:20",
    uploadTime: "2025-05-28T15:12",
    thumb: "doc",
    ai: {
      summary: "报告提示肝功能部分指标需要关注，建议结合近期饮食、饮酒、用药情况判断。",
      conclusion: "AI未直接给出疾病诊断，建议结合医生意见确认异常指标意义。",
      focus: "肝功能部分指标异常，建议关注近期用药、饮酒、基础疾病等情况。",
      notice: "近期避免饮酒和熬夜，减少高脂饮食，遵医嘱复查相关指标。",
      advice: "建议携带报告咨询专科医生。",
      next: "建议在 1-3 个月内复查肝功能，并补充上传既往同类报告。"
    }
  },
  {
    id: "r3",
    name: "胸部CT 检查报告",
    type: "检查报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-20T10:15",
    uploadTime: "2025-05-20T10:56",
    thumb: "ct",
    ai: {
      summary: "本次胸部CT报告建议结合影像结论和临床症状进行判断。",
      conclusion: "暂未替代医生阅片结论，需以影像科和临床医生意见为准。",
      focus: "如报告出现结节、炎症或阴影描述，建议关注大小、位置及随访建议。",
      notice: "若有咳嗽、胸痛、发热等症状，应及时就医确认。",
      advice: "建议按医生要求定期复查。",
      next: "建议保留并上传既往胸部影像报告，便于趋势对比。"
    }
  },
  {
    id: "r4",
    name: "血糖 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-18T08:45",
    uploadTime: "2025-05-18T09:20",
    thumb: "doc",
    ai: {
      summary: "血糖结果需要结合空腹或餐后时段判断。",
      conclusion: "如血糖高于参考范围，建议结合既往血糖、糖化血红蛋白等指标确认。",
      focus: "血糖结果高于参考范围时需关注饮食、运动和用药情况。",
      notice: "建议保持规律饮食，避免短期高糖摄入，按医嘱监测血糖。",
      advice: "建议按医生要求定期复查。",
      next: "建议补充上传既往血糖或糖化血红蛋白报告，便于趋势对比。"
    }
  },
  {
    id: "r5",
    name: "体检报告",
    type: "体检报告",
    org: "南宁市爱康体检中心",
    reportTime: "2025-05-10T09:00",
    uploadTime: "2025-05-10T11:30",
    thumb: "exam",
    ai: {
      summary: "体检报告包含多项指标，建议重点查看异常项和复查建议。",
      conclusion: "整体健康情况需结合年龄、既往史和医生建议综合判断。",
      focus: "关注血压、血糖、血脂、肝肾功能等异常指标。",
      notice: "保持规律作息、均衡饮食和适量运动，异常指标按建议复查。",
      advice: "暂无明显异常时可继续观察；异常项建议咨询医生。",
      next: "建议加入对应健康管理计划，持续跟踪关键指标。"
    }
  }
];

const defaultParseTasks = [
  { id: "t1", fileName: "image1", status: "parsing", thumb: "doc", createdAt: "2026-06-07T09:20" },
  { id: "t2", fileName: "image2", name: "尿常规 检验报告", type: "检验报告", org: "南宁市第一人民医院", status: "pending", thumb: "doc", createdAt: "2026-06-07T09:10" },
  { id: "t3", fileName: "image3", status: "failed", thumb: "doc", reason: "报告信息识别失败，请重新解析或删除", createdAt: "2026-06-07T08:55" },
  { id: "t4", fileName: "image4", name: "心电图 检查报告", type: "检查报告", org: "南宁市第一人民医院", reportTime: "2025-04-30T11:00", status: "completed", thumb: "doc", createdAt: "2026-06-06T16:20" }
];

function loadJsonStore(key, fallback) {
  try {
    return JSON.parse(window.localStorage?.getItem(key) || "null") || fallback;
  } catch {
    return fallback;
  }
}

let medicalReports = loadJsonStore("medicalReports", defaultMedicalReports);
let parseTasks = loadJsonStore("parseTasks", defaultParseTasks);

function saveMedicalStores() {
  window.localStorage?.setItem("medicalReports", JSON.stringify(medicalReports));
  window.localStorage?.setItem("parseTasks", JSON.stringify(parseTasks));
}

function normalizeReportType(type) {
  if (type === "报告单") return "检验报告";
  return type;
}

function reportDateValue(report) {
  return report.reportTime || "";
}

function isNewReport(report) {
  return Date.now() - parseDateTime(report.uploadTime).getTime() < 86400000;
}

function parseDateTime(value) {
  return value ? new Date(value) : new Date(0);
}

function formatDateTime(value) {
  if (!value) return "待补充";
  const date = parseDateTime(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function renderMainCard(stateKey) {
  const state = states[stateKey];

  if (state.type === "empty") {
    mainCard.innerHTML = `
      <article class="welcome-card">
        <div>
          <h1>欢迎开启<br>健康管理之旅</h1>
          <p>完善档案后，获取个性化<br>健康评估和AI建议</p>
        </div>
        <div class="welcome-illustration" aria-hidden="true"></div>
        <div class="card-actions">
          <button class="primary-action" type="button">完善健康档案</button>
          <button class="secondary-action" type="button">开始健康评估</button>
        </div>
      </article>
    `;
    return;
  }

  const visual = state.visual === "progress"
    ? `<div class="progress-ring" aria-label="膳食遵循36%"><span>膳食遵循</span><strong>36%</strong></div>`
    : `<div class="card-illustration ${state.visual}" aria-hidden="true"></div>`;

  mainCard.innerHTML = `
    <article class="score-card ${state.className}">
      <div class="score-top">
        <span class="card-label">${state.label}</span>
        <div class="score-line">
          <strong class="score-number">${state.score}</strong>
          <span class="score-unit">分</span>
          <span class="score-status ${state.statusClass}">${state.status}</span>
        </div>
        <p class="score-change">${state.change}</p>
        ${visual}
      </div>
      ${state.middle}
      <div class="ai-block">
        <strong>AI建议</strong>
        <p>${state.advice}</p>
      </div>
      <a class="detail-link" href="#">${state.link}</a>
    </article>
  `;
}

function sortedMedicalReports() {
  return [...medicalReports]
    .filter((report) => selectedMedicalCategory === "全部" || report.type === selectedMedicalCategory)
    .sort((a, b) => {
      const dateDiff = parseDateTime(reportDateValue(b)) - parseDateTime(reportDateValue(a));
      if (dateDiff !== 0) return dateDiff;
      return parseDateTime(b.uploadTime) - parseDateTime(a.uploadTime);
    });
}

function renderMedicalReports() {
  if (!medicalReportList) return;
  const reports = sortedMedicalReports();
  medicalReportList.innerHTML = reports.length ? reports.map((report) => `
    <article class="report-row" data-report-row="${report.id}">
      <button class="report-delete-action" type="button" data-delete-report="${report.id}">删除</button>
      <button type="button" data-report-id="${report.id}">
        <i class="report-thumb ${report.thumb || "doc"}"></i>
        <span>
          <strong>${report.name}${isNewReport(report) ? '<em class="new-badge">新增</em>' : ""}</strong>
          <em>${report.org}</em>
          <em>${formatDateTime(report.reportTime)}</em>
        </span>
        <b></b>
      </button>
    </article>
  `).join("") : `<p class="period-empty">暂无就医资料</p>`;
  updateParseTaskEntry();
}

function updateParseTaskEntry() {
  const count = parseTasks.filter((task) => task.status === "pending" || task.status === "failed").length;
  if (!parseTaskEntry) return;
  if (count) parseTaskEntry.setAttribute("data-count", String(count));
  else parseTaskEntry.removeAttribute("data-count");
}

function statusText(status) {
  return {
    parsing: "解析中",
    pending: "待补充",
    failed: "解析失败",
    completed: "已完成"
  }[status] || status;
}

function renderParseTasks() {
  if (!parseTaskList) return;
  const groups = [
    ["parsing", "解析中"],
    ["pending", "待补充"],
    ["failed", "解析失败"],
    ["completed", "已完成"]
  ];
  parseTaskList.innerHTML = groups.map(([status, label]) => {
    const tasks = parseTasks.filter((task) => task.status === status);
    if (!tasks.length) return "";
    return `
      <section class="parse-group">
        <h2>${label}</h2>
        ${tasks.map(renderParseTaskCard).join("")}
      </section>
    `;
  }).join("") || `<p class="period-empty">暂无解析任务</p>`;
  updateParseTaskEntry();
}

function renderParseTaskCard(task) {
  const title = task.name || task.fileName || "image1";
  const tagClass = {
    parsing: "tag-parsing",
    pending: "tag-pending",
    failed: "tag-failed",
    completed: "tag-completed"
  }[task.status];
  let desc = "AI正在识别报告信息，请稍候";
  let actions = "";
  if (task.status === "pending") {
    desc = "缺少报告日期，补充后可归档";
    actions = `<div class="task-actions"><button type="button" data-supplement-task="${task.id}">补充信息</button></div>`;
  } else if (task.status === "failed") {
    desc = task.reason || "报告信息识别失败，请重新解析或删除";
    actions = `<div class="task-actions"><button type="button" data-reparse-task="${task.id}">重新解析</button><button class="danger" type="button" data-delete-task="${task.id}">删除</button></div>`;
  } else if (task.status === "completed") {
    desc = `${task.type || "报告单"}｜${task.org || "检测机构待补充"}｜${formatDateTime(task.reportTime)}`;
  }
  return `
    <article class="parse-task-card">
      <i class="report-thumb ${task.thumb || "doc"}"></i>
      <div class="task-body">
        <strong>${title}</strong>
        <span class="task-tag ${tagClass}">${statusText(task.status)}</span>
        <p>${desc}</p>
        ${actions}
      </div>
    </article>
  `;
}

function aiFallback(report) {
  return report.ai || {
    summary: "AI已识别该报告的主要信息，建议结合医生意见查看。",
    conclusion: "整体结论需结合症状、既往史和医生判断，不直接作为诊断依据。",
    focus: "请关注报告中的异常指标、异常结论及复查建议。",
    notice: "保持良好生活方式，如有不适或指标异常，请及时咨询医生。",
    advice: "建议按医生要求定期复查。",
    next: "建议补充上传既往同类报告，便于趋势对比。"
  };
}

function openReportDetail(reportId) {
  const report = medicalReports.find((item) => item.id === reportId);
  if (!report) return;
  selectedReportId = reportId;
  document.querySelector("#reportPreview").innerHTML = `<i class="report-thumb ${report.thumb || "doc"} big"></i>`;
  detailReportName.value = report.name;
  detailReportType.value = report.type;
  detailReportOrg.value = report.org;
  detailReportDate.value = report.reportTime;
  detailUploadTime.textContent = `上传时间：${formatDateTime(report.uploadTime)}`;
  const ai = aiFallback(report);
  document.querySelector("#aiSummary").textContent = ai.summary;
  document.querySelector("#aiConclusion").textContent = ai.conclusion;
  document.querySelector("#aiFocus").textContent = ai.focus;
  document.querySelector("#aiNotice").textContent = ai.notice;
  document.querySelector("#aiAdvice").textContent = ai.advice;
  document.querySelector("#aiNext").textContent = ai.next;
  openSubPage("reportDetailPage");
}

function addMockFile(source) {
  const next = selectedUploadFiles.length + 1;
  selectedUploadFiles.push({
    name: `image${next}.jpg`,
    sizeMb: next === 3 ? 56 : 2.4,
    source
  });
  renderSelectedFiles();
}

function renderSelectedFiles() {
  if (!selectedFiles) return;
  selectedFiles.innerHTML = selectedUploadFiles.length
    ? selectedUploadFiles.map((file) => `<span>${file.name}　${file.sizeMb}MB</span>`).join("<br>")
    : "暂未选择文件";
}

function hasOversizeFile() {
  return selectedUploadFiles.some((file) => file.sizeMb > 50);
}

function createParseTasks(status = "parsing") {
  const now = new Date().toISOString().slice(0, 16);
  const createdTasks = selectedUploadFiles.map((file, index) => {
    const task = {
      id: `task-${Date.now()}-${index}`,
      fileName: file.name.replace(/\.[^.]+$/, ""),
      type: uploadTypeSelect.value,
      status,
      thumb: "doc",
      createdAt: now
    };
    parseTasks.unshift(task);
    return task;
  });
  saveMedicalStores();
  selectedUploadFiles = [];
  renderSelectedFiles();
  renderParseTasks();
  window.setTimeout(() => {
    createdTasks.forEach((task, index) => {
      const current = parseTasks.find((item) => item.id === task.id);
      if (!current || current.status !== "parsing") return;
      if (index === 1) {
        current.status = "pending";
        current.name = "待补充 报告单";
        current.org = "检测机构待补充";
      } else {
        completeTask(current, {
          name: "新上传 检验报告",
          type: normalizeReportType(current.type),
          org: "南宁市第一人民医院",
          reportTime: now
        });
      }
    });
    saveMedicalStores();
    renderParseTasks();
    renderMedicalReports();
  }, 2200);
}

function completeTask(task, overrides = {}) {
  const report = {
    id: `report-${Date.now()}`,
    name: overrides.name || task.name || "新上传 报告单",
    type: normalizeReportType(overrides.type || task.type || "报告单"),
    org: overrides.org || task.org || "检测机构待补充",
    reportTime: overrides.reportTime || task.reportTime,
    uploadTime: new Date().toISOString().slice(0, 16),
    thumb: task.thumb || "doc",
    ai: aiFallback({})
  };
  medicalReports.unshift(report);
  task.status = "completed";
  task.name = report.name;
  task.type = report.type;
  task.org = report.org;
  task.reportTime = report.reportTime;
  saveMedicalStores();
  renderMedicalReports();
  renderParseTasks();
}

function openSupplementDialog(taskId) {
  const task = parseTasks.find((item) => item.id === taskId);
  if (!task) return;
  selectedTaskId = taskId;
  supplementName.value = task.name || task.fileName || "";
  supplementType.value = task.type || "报告单";
  supplementOrg.value = task.org || "";
  supplementDate.value = task.reportTime || "";
  supplementError.textContent = "";
  closeOverlays();
  sheetMask.classList.add("active");
  supplementDialog.classList.add("active");
}

function saveSupplement() {
  const task = parseTasks.find((item) => item.id === selectedTaskId);
  if (!task) return;
  if (!supplementDate.value) {
    supplementError.textContent = "请补充报告时间";
    return;
  }
  completeTask(task, {
    name: supplementName.value || task.name || "补充归档报告",
    type: supplementType.value,
    org: supplementOrg.value || "检测机构待补充",
    reportTime: supplementDate.value
  });
  closeOverlays();
}

function selectMember(button) {
  memberSwitcher.querySelectorAll(".member-chip").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  currentPatientName.textContent = button.dataset.name;
  currentPatientMeta.textContent = button.dataset.meta;
  renderMainCard(button.dataset.state);
  const sex = button.dataset.sex || (button.dataset.name?.includes("女士") ? "female" : "unknown");
  currentPatient = {
    id: button.dataset.patientId || button.dataset.name || "unknown",
    name: button.dataset.name,
    sex,
    age: (button.dataset.meta || "").match(/\d+/)?.[0] || ""
  };
  updateCurrentPatientView();
}

memberSwitcher.addEventListener("click", (event) => {
  const memberButton = event.target.closest(".member-chip");
  const addMemberButton = event.target.closest(".member-add");

  if (memberButton) {
    selectMember(memberButton);
    return;
  }

  if (addMemberButton) {
    addedMemberCount += 1;
    const newMember = document.createElement("button");
    newMember.className = "member-chip";
    newMember.type = "button";
    newMember.dataset.state = "initial";
    newMember.dataset.name = `新成员${addedMemberCount}`;
    newMember.dataset.meta = "待补充 · 家庭成员";
    newMember.dataset.patientId = `new-${addedMemberCount}`;
    newMember.dataset.sex = "unknown";
    newMember.setAttribute("aria-label", `新成员${addedMemberCount} 待评估`);
    newMember.innerHTML = `
      <span class="member-avatar avatar-new">新</span>
    `;
    memberSwitcher.insertBefore(newMember, addMemberButton);
    selectMember(newMember);
  }
});

addButton.addEventListener("click", () => {
  const isOpen = taskPanel.classList.toggle("open");
  addButton.setAttribute("aria-expanded", String(isOpen));
});

function switchView(view) {
  const isHome = view === "home";
  const isPlan = view === "plan";
  const isService = view === "service";
  const isMine = view === "mine";
  homeOnlySections.forEach((item) => item.classList.toggle("hidden", !isHome));
  planPage.classList.toggle("active", isPlan);
  servicePage.classList.toggle("active", isService);
  serviceDetailPage.classList.remove("active");
  minePage.classList.toggle("active", isMine);
  subPages.forEach((page) => page.classList.remove("active"));
  pageStack = [];
  taskPanel.classList.remove("open");
  addButton.setAttribute("aria-expanded", "false");
  closeOverlays();
}

tabbarLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const view = link.dataset.view;

    if (view === "home" || view === "plan" || view === "service" || view === "mine") {
      tabbarLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      switchView(view);
    }
  });
});

function currentPageId() {
  const activeSub = [...subPages].find((page) => page.classList.contains("active"));
  if (activeSub) return activeSub.id;
  if (minePage.classList.contains("active")) return "minePage";
  if (servicePage.classList.contains("active")) return "servicePage";
  if (planPage.classList.contains("active")) return "planPage";
  return "home";
}

function openSubPage(pageId) {
  const page = document.querySelector(`#${pageId}`);
  if (!page) return;
  pageStack.push(currentPageId());
  homeOnlySections.forEach((item) => item.classList.add("hidden"));
  planPage.classList.remove("active");
  servicePage.classList.remove("active");
  serviceDetailPage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((item) => item.classList.remove("active"));
  page.classList.add("active");
  closeOverlays();
}

function goBackPage() {
  const previous = pageStack.pop() || "minePage";
  subPages.forEach((item) => item.classList.remove("active"));
  if (previous === "minePage") {
    minePage.classList.add("active");
  } else if (previous === "servicePage") {
    servicePage.classList.add("active");
  } else if (previous === "planPage") {
    planPage.classList.add("active");
  } else {
    homeOnlySections.forEach((item) => item.classList.remove("hidden"));
  }
  closeOverlays();
}

document.addEventListener("click", (event) => {
  const reportButton = event.target.closest("[data-report-id]");
  if (reportButton) {
    openReportDetail(reportButton.dataset.reportId);
    return;
  }
  const deleteReportButton = event.target.closest("[data-delete-report]");
  if (deleteReportButton) {
    deletingReportId = deleteReportButton.dataset.deleteReport;
    closeOverlays();
    sheetMask.classList.add("active");
    reportDeleteDialog.classList.add("active");
    return;
  }
  const opener = event.target.closest("[data-open-page]");
  if (opener) {
    openSubPage(opener.dataset.openPage);
    return;
  }
  if (event.target.closest(".back-page")) {
    goBackPage();
  }
});

document.querySelectorAll(".pill-tabs button, .line-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".family-list button:not(.add-family-entry)").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".family-list button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentPatient = {
      id: button.dataset.patientId,
      name: button.dataset.name,
      sex: button.dataset.sex,
      age: button.dataset.age
    };
    updateCurrentPatientView();
    goBackPage();
  });
});

document.querySelector("#saveFamily").addEventListener("click", () => {
  document.querySelectorAll(".sub-page").forEach((page) => page.classList.remove("active"));
  document.querySelector("#familySwitchPage").classList.add("active");
  pageStack = ["minePage"];
});

document.querySelector("#downloadReport").addEventListener("click", () => {
  toast.textContent = "报告已保存";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});

document.querySelector("#shareReport").addEventListener("click", () => openSheet(shareSheet));
logoutBtn.addEventListener("click", () => {
  closeOverlays();
  sheetMask.classList.add("active");
  logoutDialog.classList.add("active");
});

const cycleRules = {
  none: {
    text: "记录经期后，可预测周期",
    action: "去记录"
  },
  soon: {
    text: "月经快来啦，记得记录哦",
    action: "去记录"
  },
  due: {
    text: "今天可能是经期开始日，要不要记录一下？",
    action: "记录经期"
  },
  stale: {
    text: "好久没更新经期啦",
    action: "去更新"
  }
};

function updateCurrentPatientView() {
  if (profileNameButton) {
    profileNameButton.innerHTML = `${currentPatient.name} <i></i>`;
  }
  if (profileGenderAge) {
    const sexLabel = currentPatient.sex === "female" ? "女" : currentPatient.sex === "male" ? "男" : "未知";
    profileGenderAge.textContent = currentPatient.age ? `${sexLabel}｜${currentPatient.age}岁` : `${sexLabel}｜待完善`;
  }
  renderPeriodCard();
  renderPeriodDetail();
  updateCycleReminderVisibility();
}

function updateCycleReminderVisibility() {
  if (!cycleReminder) return;
  cycleReminder.classList.toggle("hidden", currentPatient.sex !== "female");
}

function renderPeriodCard() {
  if (!periodCard) return;
  const isFemale = currentPatient.sex === "female";
  periodCard.classList.toggle("hidden", !isFemale);
  if (!isFemale) return;

  const summary = calculatePeriodSummary();
  periodStatusLine.textContent = summary.status;
  periodForecastLine.textContent = summary.forecast;
  periodAverageLine.textContent = summary.average;
  periodAverageLine.hidden = !summary.average;
  periodActionButton.textContent = summary.action;
}

function renderPeriodDetail() {
  if (!periodDetailCurrent) return;
  const summary = calculatePeriodSummary();
  periodDetailCurrent.innerHTML = `
    <strong>${summary.hasRecords ? summary.status : "暂未记录经期"}</strong>
    <p>${summary.forecast}</p>
    ${summary.average ? `<p>${summary.average}</p>` : ""}
    <button type="button" id="periodDetailAction">${summary.action}</button>
  `;
  periodAvgCycle.textContent = `${summary.avgCycle}天`;
  periodAvgLength.textContent = `${summary.avgLength}天`;
  periodHistoryList.innerHTML = summary.records.length ? summary.records.map((record) => {
    const lengthText = record.end ? `${daysBetween(record.start, record.end) + 1}天` : "经期中";
    const cycleText = getCycleText(record, summary.records);
    return `
      <article class="period-record" data-period-id="${record.id}">
        <div class="period-record-main">
          <strong>${formatMonthDay(record.start)} - ${record.end ? formatMonthDay(record.end) : "未结束"}</strong>
          <span>经期天数：${lengthText}${cycleText ? `｜周期：${cycleText}` : ""}</span>
        </div>
        <div class="period-record-actions">
          <button type="button" data-period-edit="${record.id}">编辑</button>
          <button class="delete" type="button" data-period-delete="${record.id}">删除</button>
        </div>
      </article>
    `;
  }).join("") : `<p class="period-empty">暂无经期记录</p>`;
}

function getCycleText(record, recordsDesc) {
  const recordsAsc = [...recordsDesc].reverse();
  const index = recordsAsc.findIndex((item) => item.id === record.id);
  if (index <= 0) return "";
  return `${daysBetween(recordsAsc[index - 1].start, record.start)}天`;
}

function openCycleSheet(mode) {
  cycleSheetMode = mode;
  cycleDate.value = todayString();
  cycleSheetTitle.textContent = mode === "end" ? "记录经期结束" : "记录经期";
  cycleSheetDesc.textContent = mode === "end" ? "请选择本次月经结束日期" : "请选择本次月经开始日期";
  closeOverlays();
  sheetMask.classList.add("active");
  cycleSheet.classList.add("active");
}

function activePeriodRecord() {
  return sortedPeriodRecords().find((record) => !record.end);
}

function startPeriod(startDate) {
  const records = currentPeriodRecords();
  records.push({
    id: `period-${Date.now()}`,
    start: startDate,
    end: null
  });
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function finishPeriod(endDate) {
  const active = activePeriodRecord();
  if (!active) return;
  active.end = endDate;
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function cancelActivePeriod() {
  const active = activePeriodRecord();
  if (!active) return;
  periodRecordsByPatient[currentPatient.id] = currentPeriodRecords().filter((record) => record.id !== active.id);
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function openPeriodEdit(recordId) {
  const record = currentPeriodRecords().find((item) => item.id === recordId);
  if (!record) return;
  editingPeriodId = recordId;
  periodEditStart.value = record.start;
  periodEditEnd.value = record.end || "";
  periodEditError.textContent = "";
  closeOverlays();
  sheetMask.classList.add("active");
  periodEditDialog.classList.add("active");
}

function hasOverlap(recordId, start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end || start);
  return currentPeriodRecords().some((record) => {
    if (record.id === recordId) return false;
    const otherStart = parseDate(record.start);
    const otherEnd = parseDate(record.end || record.start);
    return startDate <= otherEnd && endDate >= otherStart;
  });
}

function savePeriodEdit() {
  const record = currentPeriodRecords().find((item) => item.id === editingPeriodId);
  if (!record) return;
  const start = periodEditStart.value;
  const end = periodEditEnd.value;
  const today = todayString();
  let error = "";
  if (!start) error = "经期开始时间不能为空";
  else if (start > today) error = "经期开始时间不能晚于今天";
  else if (end && end < start) error = "经期结束时间不能早于经期开始时间";
  else if (end && end > today) error = "经期结束时间不能晚于今天";
  else if (hasOverlap(record.id, start, end)) error = "当前记录时间范围不能与其他记录重叠";
  if (error) {
    periodEditError.textContent = error;
    return;
  }
  record.start = start;
  record.end = end || null;
  savePeriodRecords();
  closeOverlays();
  renderPeriodCard();
  renderPeriodDetail();
}

function requestPeriodDelete(recordId) {
  deletingPeriodId = recordId;
  closeOverlays();
  sheetMask.classList.add("active");
  periodDeleteDialog.classList.add("active");
}

function confirmPeriodDelete() {
  periodRecordsByPatient[currentPatient.id] = currentPeriodRecords().filter((record) => record.id !== deletingPeriodId);
  deletingPeriodId = "";
  savePeriodRecords();
  closeOverlays();
  renderPeriodCard();
  renderPeriodDetail();
}

function initCycleReminder() {
  const hiddenDate = window.localStorage?.getItem("cycleReminderHiddenDate");
  if (hiddenDate === todayString()) {
    cycleReminder.classList.add("hidden");
    return;
  }
  const rule = cycleRules[cycleReminder.dataset.rule] || cycleRules.soon;
  cycleReminderText.textContent = rule.text;
  cycleAction.textContent = rule.action;
  cycleDate.value = todayString();
}

cycleAction.addEventListener("click", () => {
  openCycleSheet("start");
});

cycleClose.addEventListener("click", () => {
  window.localStorage?.setItem("cycleReminderHiddenDate", todayString());
  cycleReminder.classList.add("hidden");
});

document.querySelector(".cycle-cancel").addEventListener("click", closeOverlays);
document.querySelector(".cycle-confirm").addEventListener("click", () => {
  const selectedDate = cycleDate.value || todayString();
  closeOverlays();
  if (cycleSheetMode === "end") {
    const active = activePeriodRecord();
    if (active && selectedDate < active.start) {
      toast.textContent = "结束时间不能早于开始时间";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    if (active && daysBetween(active.start, selectedDate) === 0) {
      sheetMask.classList.add("active");
      periodConfirmDialog.classList.add("active");
      return;
    }
    finishPeriod(selectedDate);
  } else {
    if (selectedDate > todayString()) {
      toast.textContent = "开始时间不能晚于今天";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    if (hasOverlap("", selectedDate, selectedDate)) {
      toast.textContent = "当前记录时间范围不能与其他记录重叠";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    startPeriod(selectedDate);
    cycleReminderText.textContent = "已记录，后续我会帮你持续关注周期变化";
    cycleAction.classList.add("hidden");
    cycleClose.classList.add("hidden");
    window.setTimeout(() => cycleReminder.classList.add("hidden"), 3000);
  }
});

function renderPackages(filter = "all") {
  const visible = filter === "all" ? packages : packages.filter((item) => item.id === filter);
  packageList.innerHTML = visible.map((item) => `
    <article class="package-card" data-id="${item.id}">
      <div class="package-cover service-img ${item.img}" aria-hidden="true"></div>
      <div class="package-info">
        <h3>${item.title}</h3>
        <p class="package-tags">${item.tags}</p>
        <p class="package-desc">${item.desc}</p>
        <p class="package-sales">${item.sales}</p>
      </div>
      <i class="package-arrow"></i>
    </article>
  `).join("");
}

serviceFilters.forEach((button) => {
  button.addEventListener("click", () => {
    serviceFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderPackages(button.dataset.filter);
  });
});

packageList.addEventListener("click", (event) => {
  if (event.target.closest(".package-card")) {
    servicePage.classList.remove("active");
    serviceDetailPage.classList.add("active");
    closeOverlays();
  }
});

function openSheet(sheet) {
  closeOverlays();
  sheetMask.classList.add("active");
  sheet.classList.add("active");
}

function closeOverlays() {
  sheetMask.classList.remove("active");
  serviceActionSheet.classList.remove("active");
  supportSheet.classList.remove("active");
  shareSheet.classList.remove("active");
  uploadSheet.classList.remove("active");
  purchaseDialog.classList.remove("active");
  logoutDialog.classList.remove("active");
  cycleSheet.classList.remove("active");
  periodConfirmDialog.classList.remove("active");
  periodEditDialog.classList.remove("active");
  periodDeleteDialog.classList.remove("active");
  supplementDialog.classList.remove("active");
  reportDeleteDialog.classList.remove("active");
  taskDeleteDialog.classList.remove("active");
}

function setProfileTab(tabName) {
  profileTabs.forEach((tab) => {
    const isActive = tab.dataset.profileTab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  profilePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.profilePanel === tabName);
  });
  if (uploadFab) {
    uploadFab.classList.toggle("active", tabName === "medical");
  }
}

if (serviceFab) {
  serviceFab.addEventListener("click", () => openSheet(serviceActionSheet));
}
if (uploadFab) {
  uploadFab.addEventListener("click", () => openSheet(uploadSheet));
}
medicalCategoryTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedMedicalCategory = button.dataset.category;
  medicalCategoryTabs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderMedicalReports();
});
parseTaskEntry?.addEventListener("click", () => {
  openSubPage("parseTaskPage");
  renderParseTasks();
});
document.querySelectorAll("[data-mock-file]").forEach((button) => {
  button.addEventListener("click", () => addMockFile(button.dataset.mockFile));
});
submitUpload?.addEventListener("click", () => {
  if (!selectedUploadFiles.length) {
    addMockFile("上传文件");
  }
  if (hasOversizeFile()) {
    toast.textContent = "文件超过50MB，请重新选择";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  createParseTasks("parsing");
  closeOverlays();
  toast.textContent = "上传中，可在解析任务中查看进度";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
});
submitAndParse?.addEventListener("click", () => {
  if (!selectedUploadFiles.length) {
    addMockFile("上传文件");
  }
  if (hasOversizeFile()) {
    toast.textContent = "文件超过50MB，请重新选择";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  createParseTasks("parsing");
  closeOverlays();
  openSubPage("parseTaskPage");
});
parseTaskList?.addEventListener("click", (event) => {
  const supplement = event.target.closest("[data-supplement-task]");
  const reparse = event.target.closest("[data-reparse-task]");
  const deleteTask = event.target.closest("[data-delete-task]");
  if (supplement) openSupplementDialog(supplement.dataset.supplementTask);
  if (reparse) {
    const task = parseTasks.find((item) => item.id === reparse.dataset.reparseTask);
    if (task) {
      task.status = "parsing";
      task.reason = "";
      saveMedicalStores();
      renderParseTasks();
    }
  }
  if (deleteTask) {
    deletingTaskId = deleteTask.dataset.deleteTask;
    closeOverlays();
    sheetMask.classList.add("active");
    taskDeleteDialog.classList.add("active");
  }
});
profileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setProfileTab(tab.dataset.profileTab);
    renderPeriodCard();
  });
});
periodCard?.addEventListener("click", (event) => {
  if (event.target.closest("#periodActionButton")) return;
  openSubPage("periodDetailPage");
  renderPeriodDetail();
});
periodActionButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCycleSheet(calculatePeriodSummary().inPeriod ? "end" : "start");
});
periodDetailCurrent?.addEventListener("click", (event) => {
  if (event.target.closest("#periodDetailAction")) {
    openCycleSheet(calculatePeriodSummary().inPeriod ? "end" : "start");
  }
});
periodHistoryList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-period-edit]");
  const deleteButton = event.target.closest("[data-period-delete]");
  if (editButton) openPeriodEdit(editButton.dataset.periodEdit);
  if (deleteButton) requestPeriodDelete(deleteButton.dataset.periodDelete);
});
let periodTouchX = 0;
periodHistoryList?.addEventListener("touchstart", (event) => {
  periodTouchX = event.touches[0]?.clientX || 0;
});
periodHistoryList?.addEventListener("touchend", (event) => {
  const record = event.target.closest(".period-record");
  if (!record) return;
  const endX = event.changedTouches[0]?.clientX || periodTouchX;
  const delta = endX - periodTouchX;
  periodHistoryList.querySelectorAll(".period-record").forEach((item) => {
    if (item !== record) item.classList.remove("swiped");
  });
  if (delta < -30) record.classList.add("swiped");
  if (delta > 30) record.classList.remove("swiped");
});
let reportTouchX = 0;
medicalReportList?.addEventListener("touchstart", (event) => {
  reportTouchX = event.touches[0]?.clientX || 0;
});
medicalReportList?.addEventListener("touchend", (event) => {
  const row = event.target.closest(".report-row");
  if (!row) return;
  const endX = event.changedTouches[0]?.clientX || reportTouchX;
  const delta = endX - reportTouchX;
  medicalReportList.querySelectorAll(".report-row").forEach((item) => {
    if (item !== row) item.classList.remove("swiped");
  });
  if (delta > 30) row.classList.add("swiped");
  if (delta < -30) row.classList.remove("swiped");
});
document.querySelector(".period-end-confirm")?.addEventListener("click", () => {
  cancelActivePeriod();
  closeOverlays();
});
document.querySelector(".period-edit-save")?.addEventListener("click", savePeriodEdit);
document.querySelector(".period-delete-confirm")?.addEventListener("click", confirmPeriodDelete);
saveReportInfo?.addEventListener("click", () => {
  const report = medicalReports.find((item) => item.id === selectedReportId);
  if (!report) return;
  report.name = detailReportName.value || report.name;
  report.type = normalizeReportType(detailReportType.value || report.type);
  report.org = detailReportOrg.value || report.org;
  report.reportTime = detailReportDate.value || report.reportTime;
  saveMedicalStores();
  renderMedicalReports();
  toast.textContent = "资料信息已更新";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});
document.querySelector(".supplement-save")?.addEventListener("click", saveSupplement);
document.querySelector(".report-delete-confirm")?.addEventListener("click", () => {
  medicalReports = medicalReports.filter((report) => report.id !== deletingReportId);
  deletingReportId = "";
  saveMedicalStores();
  closeOverlays();
  renderMedicalReports();
});
document.querySelector(".task-delete-confirm")?.addEventListener("click", () => {
  parseTasks = parseTasks.filter((task) => task.id !== deletingTaskId);
  deletingTaskId = "";
  saveMedicalStores();
  closeOverlays();
  renderParseTasks();
});
serviceSupport.addEventListener("click", () => openSheet(supportSheet));
detailShare.addEventListener("click", () => openSheet(shareSheet));
buyButton.addEventListener("click", () => {
  closeOverlays();
  sheetMask.classList.add("active");
  purchaseDialog.classList.add("active");
});
sheetMask.addEventListener("click", closeOverlays);
document.querySelectorAll(".sheet-cancel, .dialog-cancel, .dialog-confirm").forEach((button) => {
  button.addEventListener("click", closeOverlays);
});

favoriteBtn.addEventListener("click", () => {
  favoriteBtn.classList.toggle("active");
  favoriteBtn.querySelector("i").classList.toggle("active");
  favoriteBtn.lastChild.textContent = favoriteBtn.classList.contains("active") ? "已收藏" : "收藏";
  if (favoriteBtn.classList.contains("active")) {
    favoriteBtn.setAttribute("aria-label", "已加入收藏");
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
  }
});

detailBack.addEventListener("click", () => {
  serviceDetailPage.classList.remove("active");
  servicePage.classList.add("active");
  closeOverlays();
});

renderMainCard("improving");
setProfileTab("medical");
updateCurrentPatientView();
renderMedicalReports();
renderParseTasks();
renderPackages();
initCycleReminder();
