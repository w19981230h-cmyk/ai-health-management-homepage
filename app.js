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
const homeServiceSection = document.querySelector(".service-section.home-only");
const taskPanel = document.querySelector("#taskPanel");
const addButton = document.querySelector("#addButton");
const tabbarLinks = document.querySelectorAll(".tabbar a");
const homeOnlySections = document.querySelectorAll(".home-only");
const planPage = document.querySelector("#planPage");
const schedulePatientButton = document.querySelector("#schedulePatientButton");
const scheduleAvatar = document.querySelector("#scheduleAvatar");
const schedulePatientName = document.querySelector("#schedulePatientName");
const scheduleMonthLabel = document.querySelector("#scheduleMonthLabel");
const scheduleExpand = document.querySelector("#scheduleExpand");
const scheduleToday = document.querySelector("#scheduleToday");
const scheduleWeek = document.querySelector("#scheduleWeek");
const scheduleMonthPanel = document.querySelector("#scheduleMonthPanel");
const scheduleContent = document.querySelector("#scheduleContent");
const schedulePatientSheet = document.querySelector("#schedulePatientSheet");
const scheduleCheckinSheet = document.querySelector("#scheduleCheckinSheet");
const scheduleAddButton = document.querySelector("#scheduleAddButton");
const allPlansButton = document.querySelector("#allPlansButton");
const servicePage = document.querySelector("#servicePage");
const serviceDetailPage = document.querySelector("#serviceDetailPage");
const detailPatientAvatar = document.querySelector("#detailPatientAvatar");
const detailPatientName = document.querySelector("#detailPatientName");
const detailPatientMeta = document.querySelector("#detailPatientMeta");
const detailProductCover = document.querySelector("#detailProductCover");
const detailServiceTitle = document.querySelector("#detailServiceTitle");
const detailServiceTags = document.querySelector("#detailServiceTags");
const detailServicePrice = document.querySelector("#detailServicePrice");
const detailServiceSales = document.querySelector("#detailServiceSales");
const detailServiceDesc = document.querySelector("#detailServiceDesc");
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
const uploadTypePills = document.querySelector("#uploadTypePills");
const orderStatusTabs = document.querySelector(".order-status-tabs");
const orderPanels = document.querySelectorAll("[data-order-panel]");
const submitUpload = document.querySelector("#submitUpload");
const submitAndParse = document.querySelector("#submitAndParse");
const detailReportName = document.querySelector("#detailReportName");
const detailReportType = document.querySelector("#detailReportType");
const detailReportOrg = document.querySelector("#detailReportOrg");
const detailReportDate = document.querySelector("#detailReportDate");
const detailUploadTime = document.querySelector("#detailUploadTime");
const detailReportTitle = document.querySelector("#detailReportTitle");
const detailOrgText = document.querySelector("#detailOrgText");
const detailTypeText = document.querySelector("#detailTypeText");
const detailDateText = document.querySelector("#detailDateText");
const detailUploadText = document.querySelector("#detailUploadText");
const saveReportInfo = document.querySelector("#saveReportInfo");
const editReportName = document.querySelector("#editReportName");
const editReportType = document.querySelector("#editReportType");
const editReportOrg = document.querySelector("#editReportOrg");
const editReportDate = document.querySelector("#editReportDate");
const saveReportEdit = document.querySelector("#saveReportEdit");
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
const settingsUserName = document.querySelector("#settingsUserName");
const personalNickname = document.querySelector("#personalNickname");
const savePersonalSettings = document.querySelector("#savePersonalSettings");
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
const medicalFab = document.querySelector("#medicalFab");
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
let serviceDetailSource = "service";

const packages = [
  {
    id: "weight",
    title: "90天减重管理服务包",
    tags: "科学减重｜饮食管理｜运动指导",
    desc: "通过个性化饮食和运动方案，帮助您健康减重，塑造理想体型。",
    price: "¥299",
    sales: "月销量 9,860+",
    img: "img-weight"
  },
  {
    id: "sugar",
    title: "90天控糖管理服务包",
    tags: "血糖监测｜饮食干预｜生活管理",
    desc: "科学管理血糖水平，帮助您稳定血糖，降低并发风险。",
    price: "¥299",
    sales: "月销量 7,560+",
    img: "img-sugar"
  },
  {
    id: "pressure",
    title: "90天控压管理服务包",
    tags: "血压监测｜生活干预｜风险评估",
    desc: "个性化血压管理方案，帮助您稳定血压，守护心脑血管健康。",
    price: "¥299",
    sales: "月销量 6,230+",
    img: "img-pressure"
  },
  {
    id: "nutrition",
    title: "90天营养管理服务包",
    tags: "营养评估｜膳食指导｜营养补充",
    desc: "专业营养师定制营养方案，改善饮食结构，提升身体健康。",
    price: "¥199",
    sales: "月销量 5,120+",
    img: "img-nutrition"
  },
  {
    id: "comprehensive",
    title: "90天综合健康管理包",
    tags: "全面评估｜多维管理｜专属服务",
    desc: "全方位健康管理，涵盖多项指标，为您提供一站式健康解决方案。",
    price: "¥399",
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

const scheduleBaseToday = "2025-03-23";
let scheduleSelectedDate = scheduleBaseToday;
let scheduleCurrentWeekStart = formatDate(startOfWeek(parseDate(scheduleSelectedDate)));
let scheduleMonthOpen = false;
let schedulePatientId = "zhang";

const schedulePatients = [
  { id: "zhang", name: "张患者", sex: "男", age: "24", relation: "本人", state: "improving", avatar: "man" },
  { id: "li", name: "李先生", sex: "男", age: "68", relation: "父亲", state: "risk", avatar: "elder" },
  { id: "wang", name: "王女士", sex: "女", age: "35", relation: "本人", state: "improving", avatar: "woman" }
];

const scheduleTasks = {
  zhang: {
    "2025-03-23": {
      reminders: ["复诊提醒", "用药提醒", "报告查看"],
      followups: [
        { type: "随访量表", plan: "高血压服务包", title: "出院随访跟踪量表", range: "2025/05/01 至 2025/05/10", status: "进行中", action: "立即查看" }
      ],
      assessments: [
        { title: "糖尿病风险评估", desc: "健康管理师邀请您完成健康评估，了解健康状况。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "已记录 1 次", value: "早餐 08:10" },
        { type: "sport", title: "运动打卡", desc: "记录每日运动，帮助保持习惯", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 2 次", value: "降压药 12:20" },
        { type: "period", title: "经期打卡", desc: "记录经期状态，辅助周期管理", count: "未开始" },
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "已记录 1 次", value: "128/82 mmHg 08:30" },
        { type: "sugar", title: "血糖打卡", desc: "记录空腹/餐后血糖", count: "待完成" }
      ]
    },
    "2025-03-24": {
      reminders: ["用药提醒"],
      followups: [],
      assessments: [],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" }
      ]
    },
    "2025-03-25": {
      reminders: ["复诊提醒"],
      followups: [
        { type: "随访问卷", plan: "术后康复计划", title: "疼痛与活动能力问卷", range: "2025/03/25 至 2025/03/31", status: "已完成", action: "查看结果" }
      ],
      assessments: [],
      checkins: []
    },
    "2025-03-26": {
      reminders: ["报告查看"],
      followups: [
        { type: "随访量表", plan: "高血压服务包", title: "血压稳定性随访量表", range: "2025/03/20 至 2025/03/26", status: "已逾期", action: "继续填写" }
      ],
      assessments: [
        { title: "睡眠质量评估", desc: "完成评估，了解近期睡眠状态", status: "已完成", action: "查看结果" }
      ],
      checkins: [
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "待完成" }
      ]
    }
  },
  li: {
    "2025-03-23": {
      reminders: ["用药提醒", "血压复测"],
      followups: [
        { type: "随访量表", plan: "控压管理计划", title: "居家血压随访量表", range: "2025/03/21 至 2025/03/27", status: "进行中", action: "继续填写" }
      ],
      assessments: [],
      checkins: [
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "待完成", value: "146/92 mmHg 07:50" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 1 次" }
      ]
    }
  },
  wang: {
    "2025-03-23": {
      reminders: ["经期提醒"],
      followups: [],
      assessments: [
        { title: "女性健康评估", desc: "健康管理师邀请您完成健康评估，了解健康状况。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "period", title: "经期打卡", desc: "记录经期状态，辅助周期管理", count: "第 2 天", value: "轻微腹痛" },
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" }
      ]
    }
  }
};

function startOfWeek(date) {
  const target = new Date(date);
  target.setDate(target.getDate() - target.getDay());
  return target;
}

function schedulePatient() {
  return schedulePatients.find((patient) => patient.id === schedulePatientId) || schedulePatients[0];
}

function scheduleDataFor(date = scheduleSelectedDate) {
  return scheduleTasks[schedulePatientId]?.[date] || { reminders: [], followups: [], assessments: [], checkins: [] };
}

function hasScheduleData(date) {
  const data = scheduleTasks[schedulePatientId]?.[date];
  return Boolean(data && (data.reminders.length || data.followups.length || data.assessments.length || data.checkins.length));
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

function thumbForType(type, fallback = "doc") {
  if (type === "检查报告") return "ct";
  if (type === "门诊病历" || type === "门诊处方" || type === "住院记录") return "medical";
  if (type === "体检报告") return "exam";
  if (type === "检验报告" || type === "报告单") return "doc";
  return fallback;
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

function sexText(sex) {
  if (sex === "female") return "女";
  if (sex === "male") return "男";
  return "未知";
}

function formatYearMonth(value) {
  if (!value) return "日期待补充";
  const date = parseDateTime(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}年${m}月`;
}

function reportCardTypeLabel(report) {
  if (report.type === "门诊病历") return "门(急)诊病历";
  return "报告单";
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

  mainCard.innerHTML = `
    <article class="score-card ${state.className}">
      <div class="score-top">
        <span class="card-label">${state.label}</span>
        <div class="score-line">
          <strong class="score-number">${state.score}</strong>
          <span class="score-unit">分</span>
          <span class="score-status ${state.statusClass}">${state.status}</span>
        </div>
      </div>
      <div class="ai-block">
        <strong>AI建议</strong>
        <p>${state.advice}</p>
      </div>
      <a class="detail-link" href="#">查看档案信息</a>
    </article>
  `;
}

function renderSchedule() {
  if (!scheduleWeek || !scheduleContent) return;
  const patient = schedulePatient();
  const selected = parseDate(scheduleSelectedDate);
  schedulePatientName.textContent = `${patient.name} ${patient.sex} ${patient.age}`;
  scheduleAvatar.className = `schedule-avatar ${patient.avatar}`;
  scheduleMonthLabel.textContent = `${selected.getFullYear()}年${String(selected.getMonth() + 1).padStart(2, "0")}月`;
  renderScheduleWeek();
  renderScheduleMonth();
  renderScheduleTasks();
  renderSchedulePatientSheet();
  renderScheduleCheckinSheet();
}

function renderScheduleWeek() {
  const weekStart = parseDate(scheduleCurrentWeekStart);
  const labels = ["日", "一", "二", "三", "四", "五", "六"];
  scheduleWeek.innerHTML = labels.map((label, index) => {
    const date = addDays(weekStart, index);
    const value = formatDate(date);
    const selected = value === scheduleSelectedDate;
    const today = value === scheduleBaseToday;
    const hasTask = hasScheduleData(value);
    const hasAlert = scheduleDataFor(value).followups.some((task) => task.status === "已逾期");
    return `
      <button class="schedule-day ${selected ? "selected" : ""} ${today ? "today" : ""} ${hasTask ? "has-task" : ""} ${hasAlert ? "has-alert" : ""}" type="button" data-schedule-date="${value}">
        <span>${label}</span>
        <strong>${String(date.getDate()).padStart(2, "0")}</strong>
      </button>
    `;
  }).join("");
}

function renderScheduleMonth() {
  if (!scheduleMonthPanel) return;
  const selected = parseDate(scheduleSelectedDate);
  const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const start = startOfWeek(first);
  scheduleMonthPanel.classList.toggle("open", scheduleMonthOpen);
  scheduleExpand?.setAttribute("aria-expanded", String(scheduleMonthOpen));
  scheduleExpand.textContent = scheduleMonthOpen ? "收起" : "展开";
  scheduleMonthPanel.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const value = formatDate(date);
    const muted = date.getMonth() !== selected.getMonth();
    return `<button class="month-day ${muted ? "muted" : ""} ${value === scheduleSelectedDate ? "selected" : ""}" type="button" data-schedule-date="${value}">${date.getDate()}</button>`;
  }).join("");
}

function renderScheduleTasks() {
  const data = scheduleDataFor();
  const hasAny = data.reminders.length || data.followups.length || data.assessments.length || data.checkins.length;
  if (!hasAny) {
    scheduleContent.innerHTML = `<div class="empty-card"><strong>今天暂无健康任务</strong><span>记得保持良好生活习惯</span></div>`;
    return;
  }
  scheduleContent.innerHTML = `
    ${renderReminderSection(data.reminders)}
    ${renderAssessmentSection(data.assessments)}
    ${renderFollowupSection(data.followups)}
    ${renderCheckinSection(data.checkins)}
  `;
}

function renderSection(title, body, action = "") {
  return `
    <section class="schedule-section">
      <div class="schedule-section-head">
        <h3>${title}</h3>
        ${action}
      </div>
      ${body}
    </section>
  `;
}

function renderReminderSection(reminders) {
  if (!reminders.length) return "";
  const body = `
    <article class="reminder-card registration-reminder" data-schedule-action="registration" role="button" tabindex="0">
      <span>
        <strong>预约就诊：皮肤科-张医生</strong>
        <em>本人&nbsp;&nbsp;张患者｜03-11 12:30</em>
      </span>
      <i aria-hidden="true"></i>
    </article>
  `;
  return renderSection("今日提醒", body);
}

function renderFollowupSection(followups) {
  const body = followups.length ? followups.map((task) => {
    const statusClass = task.status === "已完成" ? "done" : task.status === "已逾期" ? "overdue" : "";
    const buttonClass = task.status === "已完成" ? "done" : "";
    return `
      <article class="schedule-card follow-card" data-schedule-action="follow">
        <div class="follow-head">
          <span class="task-tag-small">${task.type}</span>
          <span class="task-plan-tag">${task.plan}</span>
        </div>
        <strong>${task.title}</strong>
        <p>${task.range} · <span class="task-status ${statusClass}">${task.status}</span></p>
        <button class="task-primary ${buttonClass}" type="button" data-schedule-action="follow">${task.action}</button>
      </article>
    `;
  }).join("") : `<div class="empty-card"><strong>暂无随访任务</strong></div>`;
  return renderSection("健康任务", body, `<button type="button" data-schedule-plans>全部计划 〉</button>`);
}

function renderAssessmentSection(assessments) {
  if (!assessments.length) return "";
  const body = assessments.map((task) => `
    <article class="schedule-card assessment-card" data-schedule-action="assessment">
      <i class="assessment-icon">评</i>
      <div>
        <strong>${task.title}</strong>
        <p>${task.desc}</p>
      </div>
      <button type="button" data-schedule-action="assessment">${task.action}</button>
    </article>
  `).join("");
  return body;
}

function renderCheckinSection(checkins) {
  const visibleCheckins = checkins.filter((item) => item.type !== "pressure" && item.type !== "sugar");
  if (!visibleCheckins.length) return "";
  const body = `<div class="checkin-list">${visibleCheckins.map(renderCheckinCard).join("")}</div>`;
  return renderSection("健康打卡", body);
}

function renderCheckinCard(item) {
  const iconText = { diet: "食", sport: "动", medicine: "药", water: "水", period: "经", pressure: "压", sugar: "糖", weight: "重" }[item.type] || "记";
  const valueHtml = item.value ? `<strong>${item.value}</strong>` : "";
  return `
    <article class="checkin-card" data-type="${item.type}" data-schedule-action="checkin">
      <i class="checkin-icon">${iconText}</i>
      <div class="checkin-copy">
        <strong>${item.title}</strong>
        <p>${item.desc}</p>
      </div>
      <div class="checkin-meta">
        ${valueHtml}
        <span>${item.count || "待完成"}</span>
      </div>
    </article>
  `;
}

function renderSchedulePatientSheet() {
  if (!schedulePatientSheet) return;
  schedulePatientSheet.innerHTML = `
    <h3>切换就诊人</h3>
    ${schedulePatients.map((patient) => `
      <button class="patient-option ${patient.id === schedulePatientId ? "active" : ""}" type="button" data-schedule-patient="${patient.id}">
        <span class="schedule-avatar ${patient.avatar}" aria-hidden="true"></span>
        <b>${patient.name}<span>${patient.sex} · ${patient.age}岁 · ${patient.relation}</span></b>
        <i class="patient-check">✓</i>
      </button>
    `).join("")}
  `;
}

function renderScheduleCheckinSheet() {
  if (!scheduleCheckinSheet) return;
  const options = [
    ["diet", "饮食打卡", "记录每日饮食"],
    ["sport", "运动打卡", "记录每日运动"],
    ["medicine", "用药打卡", "记录每日用药"],
    ["period", "经期打卡", "记录经期状态"]
  ];
  scheduleCheckinSheet.innerHTML = `
    <h3>新增打卡</h3>
    ${options.map(([type, title, desc]) => `
      <button class="checkin-option" type="button" data-add-checkin="${type}">
        <i class="checkin-icon">${title.slice(0, 1)}</i>
        <b>${title}<span>${desc}</span></b>
        <span>添加</span>
      </button>
    `).join("")}
  `;
}

function selectScheduleDate(value) {
  scheduleSelectedDate = value;
  scheduleCurrentWeekStart = formatDate(startOfWeek(parseDate(value)));
  scheduleMonthOpen = false;
  renderSchedule();
}

function openScheduleSheet(sheet) {
  if (!sheet) return;
  closeOverlays();
  sheetMask.classList.add("active");
  sheet.classList.add("active");
}

function showScheduleToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
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
  const groups = reports.reduce((result, report) => {
    const month = formatYearMonth(reportDateValue(report));
    if (!result.has(month)) result.set(month, []);
    result.get(month).push(report);
    return result;
  }, new Map());
  medicalReportList.innerHTML = reports.length ? [...groups.entries()].map(([month, items]) => `
    <section class="report-month-section">
      <h3>${month}</h3>
      ${items.map((report) => `
        <button class="report-card report-row" type="button" data-report-id="${report.id}" data-report-row="${report.id}">
          <span class="report-card-main">
            <span class="report-card-meta">
              <strong>${reportCardTypeLabel(report)}${isNewReport(report) ? '<em class="new-badge">新增</em>' : ""}</strong>
              <em>检查时间：${formatDateTime(report.reportTime).slice(0, 10).replaceAll("-", ".")}</em>
            </span>
            <span class="report-card-title">${report.name}</span>
            <span class="report-card-source">来源：自动上传</span>
          </span>
          <i class="report-thumb ${thumbForType(report.type, report.thumb || "doc")}"></i>
        </button>
      `).join("")}
    </section>
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
  const parsingTasks = parseTasks.filter((task) => task.status === "parsing");
  const groups = [
    ["pending", "待补充"],
    ["completed", "已完成"],
    ["failed", "已失败"]
  ];
  const parsingHtml = parsingTasks.map(renderParseTaskCard).join("");
  const groupedHtml = groups.map(([status, label]) => {
    const tasks = parseTasks.filter((task) => task.status === status);
    if (!tasks.length) return "";
    return `
      <section class="parse-group">
        <h2>${label}</h2>
        ${tasks.map(renderParseTaskCard).join("")}
      </section>
    `;
  }).join("");
  parseTaskList.innerHTML = parsingHtml + groupedHtml || `<p class="period-empty">暂无解析任务</p>`;
  updateParseTaskEntry();
}

function renderParseTaskCard(task) {
  const title = parseTaskTitle(task);
  const thumbClass = parseTaskThumbClass(task);
  const tagClass = {
    parsing: "tag-parsing",
    pending: "tag-pending",
    failed: "tag-failed",
    completed: "tag-completed"
  }[task.status];
  let desc = "模型正在后台识别报告内容，请稍候。";
  let actions = "";
  if (task.status === "pending") {
    desc = "未识别到有效信息，请补充";
    actions = `<div class="task-actions"><button type="button" data-supplement-task="${task.id}">补充</button></div>`;
  } else if (task.status === "failed") {
    desc = "图片清晰度不足或内容不完整，请重新解析。";
    actions = `<div class="task-actions"><button type="button" data-reparse-task="${task.id}">重新解析</button><button class="danger" type="button" data-delete-task="${task.id}">删除</button></div>`;
  } else if (task.status === "completed") {
    desc = `报告时间：${formatDateTime(task.reportTime).slice(0, 10).replaceAll("-", ".")}`;
    actions = `<div class="task-actions"><button type="button" data-completed-task="${task.id}">查看报告</button></div>`;
  } else if (task.status === "parsing") {
    actions = `<div class="task-actions parsing-action"><button type="button" disabled>解析中</button></div>`;
  }
  return `
    <article class="parse-task-card ${task.status === "parsing" ? "is-parsing" : ""}" data-task-card="${task.id}" data-task-status="${task.status}">
      <i class="report-thumb ${thumbClass}"></i>
      <div class="task-body">
        <div class="task-title-line"><strong>${title}</strong></div>
        <p>${desc}</p>
        ${actions}
      </div>
    </article>
  `;
}

function parseTaskTitle(task) {
  const title = task.name || task.reportName || "";
  if (title && title !== "待补充 报告单" && title !== "新上传 检验报告" && title !== "补充归档报告") return title;
  if (task.status === "pending") return "彩色超声检查报告单";
  if (task.status === "completed") return "腹部超声检查报告单";
  return task.fileName || "image1";
}

function parseTaskThumbClass(task) {
  const fileName = task.fileName || "";
  if (task.kind === "image" || task.thumb === "upload-image" || /^image/i.test(fileName)) {
    return "upload-image-thumb";
  }
  return thumbForType(task.type, task.thumb || "doc");
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
  const previewClass = report.thumb === "upload-image" ? "upload-image-thumb" : thumbForType(report.type, report.thumb || "doc");
  document.querySelector("#reportPreview").innerHTML = `<i class="report-thumb ${previewClass} big"></i><span>图片预览</span>`;
  detailReportName.value = report.name;
  detailReportType.value = report.type;
  detailReportOrg.value = report.org;
  detailReportDate.value = report.reportTime;
  detailUploadTime.textContent = `上传时间：${formatDateTime(report.uploadTime)}`;
  detailReportTitle.textContent = report.name || "门(急)诊病历";
  detailOrgText.textContent = report.org || "就诊医院待补充";
  detailTypeText.textContent = report.type || "检验报告";
  detailDateText.textContent = formatDateTime(report.reportTime).slice(0, 10).replaceAll("-", ".");
  detailUploadText.textContent = formatDateTime(report.uploadTime).slice(0, 10).replaceAll("-", ".");
  const ai = aiFallback(report);
  document.querySelector("#aiSummary").innerHTML = `
    <table>
      <thead><tr><th>项目</th><th>结果</th><th>参考 / 说明</th></tr></thead>
      <tbody>
        <tr><td>子宫内膜厚度</td><td>5.8mm</td><td>需结合月经周期判断</td></tr>
        <tr><td>子宫大小</td><td>49×41×48mm</td><td>正常范围</td></tr>
        <tr><td>子宫肌层回声</td><td>欠均匀</td><td>轻度改变，可随访</td></tr>
        <tr><td>双侧卵巢</td><td>未见异常</td><td>正常</td></tr>
        <tr><td>盆腔积液</td><td>未见</td><td>正常</td></tr>
      </tbody>
    </table>
  `;
  document.querySelector("#aiConclusion").textContent = ai.conclusion;
  document.querySelector("#aiFocus").innerHTML = "• 如果是月经刚结束，5.8mm 偏厚，建议进一步排查。<br>• 如果是排卵期或分泌期，这个厚度可以正常。<br>• 需要结合你的临床诊断、月经周期和症状综合判断。";
  document.querySelector("#aiNotice").textContent = ai.notice;
  document.querySelector("#aiAdvice").innerHTML = "1. 确认检查时所处的月经周期阶段。<br>2. 如伴随异常出血或腹痛，建议携报告就医复核。<br>3. 建议保留后续检查报告，便于连续对比。";
  document.querySelector("#aiNext").textContent = ai.next;
  openSubPage("reportDetailPage");
}

function populateReportEditForm() {
  const report = medicalReports.find((item) => item.id === selectedReportId);
  if (!report) return;
  if (editReportName) editReportName.value = report.name || "";
  if (editReportType) editReportType.value = report.type || "检验报告";
  if (editReportOrg) editReportOrg.value = report.org || "";
  if (editReportDate) editReportDate.value = (report.reportTime || "").slice(0, 10);
}

function saveReportEditAndBack() {
  const report = medicalReports.find((item) => item.id === selectedReportId);
  if (!report) return;
  report.name = editReportName?.value || report.name;
  report.type = editReportType?.value || report.type;
  report.org = editReportOrg?.value || report.org;
  if (editReportDate?.value) report.reportTime = `${editReportDate.value}T00:00`;
  saveMedicalStores();
  renderMedicalReports();
  openReportDetail(report.id);
}

function addMockFile(source) {
  if (selectedUploadFiles.length >= 5) {
    toast.textContent = "最多选择 5 张图片";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1500);
    return;
  }
  const next = selectedUploadFiles.length + 1;
  selectedUploadFiles.push({
    name: source === "文件上传" ? `report${next}.pdf` : `image${next}.jpg`,
    sizeMb: 2.4,
    source,
    kind: source === "文件上传" ? "file" : "image"
  });
  renderSelectedFiles();
}

function renderSelectedFiles() {
  if (!selectedFiles) return;
  if (!selectedUploadFiles.length) {
    selectedFiles.className = "selected-files upload-entry-state";
    selectedFiles.innerHTML = `
      <button class="upload-entry-card image-entry" type="button" data-mock-file="图片上传"><i></i><span>图片上传</span></button>
      <button class="upload-entry-card file-entry" type="button" data-mock-file="文件上传"><i></i><span>文件上传</span></button>
    `;
  } else {
    selectedFiles.className = "selected-files upload-grid-state";
    selectedFiles.innerHTML = `
      ${selectedUploadFiles.map((file, index) => `
        <div class="selected-file ${file.kind === "file" ? "file" : "image"}">
          <i aria-hidden="true"></i>
          <button type="button" data-remove-file="${index}" aria-label="删除${file.name}">×</button>
        </div>
      `).join("")}
      ${selectedUploadFiles.length < 5 ? '<button class="upload-add-tile" type="button" data-mock-file="图片上传">+</button>' : ""}
    `;
  }
  submitUpload?.toggleAttribute("disabled", !selectedUploadFiles.length);
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
      thumb: file.kind === "image" ? "upload-image" : "doc",
      kind: file.kind,
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
        current.name = "彩色超声检查报告单";
        current.org = "检测机构待补充";
      } else {
        completeTask(current, {
          name: "腹部超声检查报告单",
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
  task.reportId = report.id;
  task.name = report.name;
  task.type = report.type;
  task.org = report.org;
  task.reportTime = report.reportTime;
  saveMedicalStores();
  renderMedicalReports();
  renderParseTasks();
}

function openCompletedTaskReport(taskId) {
  const task = parseTasks.find((item) => item.id === taskId);
  if (!task) return;
  const report = medicalReports.find((item) => item.id === task.reportId)
    || medicalReports.find((item) => item.name === task.name && item.reportTime === task.reportTime)
    || medicalReports.find((item) => item.name === task.name);
  if (report) {
    openReportDetail(report.id);
    return;
  }
  const fallbackReport = {
    id: `report-${Date.now()}`,
    name: task.name || "腹部超声检查报告单",
    type: normalizeReportType(task.type || "报告单"),
    org: task.org || "就诊医院待补充",
    reportTime: task.reportTime || new Date().toISOString().slice(0, 16),
    uploadTime: task.createdAt || new Date().toISOString().slice(0, 16),
    thumb: task.thumb || "doc",
    ai: aiFallback({})
  };
  medicalReports.unshift(fallbackReport);
  task.reportId = fallbackReport.id;
  saveMedicalStores();
  openReportDetail(fallbackReport.id);
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
  updateHomeServiceState(button.dataset.state);
  const sex = button.dataset.sex || (button.dataset.name?.includes("女士") ? "female" : "unknown");
  currentPatient = {
    id: button.dataset.patientId || button.dataset.name || "unknown",
    name: button.dataset.name,
    sex,
    age: (button.dataset.meta || "").match(/\d+/)?.[0] || ""
  };
  updateCurrentPatientView();
}

function updateHomeServiceState(state) {
  homeServiceSection?.classList.toggle("is-empty", state === "empty");
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
  if (isPlan) renderSchedule();
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

let scheduleTouchX = 0;

scheduleWeek?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-schedule-date]");
  if (button) selectScheduleDate(button.dataset.scheduleDate);
});

scheduleWeek?.addEventListener("touchstart", (event) => {
  scheduleTouchX = event.touches[0]?.clientX || 0;
});

scheduleWeek?.addEventListener("touchend", (event) => {
  const endX = event.changedTouches[0]?.clientX || scheduleTouchX;
  const delta = endX - scheduleTouchX;
  if (Math.abs(delta) < 32) return;
  const nextStart = addDays(scheduleCurrentWeekStart, delta < 0 ? 7 : -7);
  scheduleCurrentWeekStart = formatDate(nextStart);
  scheduleSelectedDate = formatDate(nextStart);
  scheduleMonthOpen = false;
  renderSchedule();
});

scheduleMonthPanel?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-schedule-date]");
  if (button) selectScheduleDate(button.dataset.scheduleDate);
});

scheduleExpand?.addEventListener("click", () => {
  scheduleMonthOpen = !scheduleMonthOpen;
  renderSchedule();
});

scheduleToday?.addEventListener("click", () => selectScheduleDate(scheduleBaseToday));

schedulePatientButton?.addEventListener("click", () => openScheduleSheet(schedulePatientSheet));

schedulePatientSheet?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-schedule-patient]");
  if (!button) return;
  schedulePatientId = button.dataset.schedulePatient;
  scheduleSelectedDate = scheduleBaseToday;
  scheduleCurrentWeekStart = formatDate(startOfWeek(parseDate(scheduleSelectedDate)));
  closeOverlays();
  renderSchedule();
});

scheduleAddButton?.addEventListener("click", () => openScheduleSheet(scheduleCheckinSheet));

scheduleCheckinSheet?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-checkin]");
  if (!button) return;
  const data = scheduleDataFor();
  const label = button.querySelector("b")?.childNodes[0]?.textContent || "健康打卡";
  data.checkins.unshift({
    type: button.dataset.addCheckin,
    title: label,
    desc: "已添加到当前日期，可继续记录",
    count: "待完成"
  });
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  closeOverlays();
  renderSchedule();
  showScheduleToast(`已添加${label}`);
});

allPlansButton?.addEventListener("click", () => showScheduleToast("已进入全部计划"));

scheduleContent?.addEventListener("click", (event) => {
  const target = event.target.closest("[data-schedule-action], [data-schedule-records], [data-schedule-plans]");
  if (!target) return;
  const action = target.dataset.scheduleAction || (target.dataset.schedulePlans !== undefined ? "plans" : "records");
  const text = {
    follow: "进入随访任务",
    assessment: "进入健康评估",
    checkin: "进入打卡记录",
    plans: "进入全部计划",
    registration: "进入挂号详情",
    "registration-remind": "已设置就诊提醒",
    route: "打开路线导航",
    records: "查看全部打卡记录"
  }[action] || "打开任务";
  showScheduleToast(text);
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
  document.body.classList.toggle("detail-page-open", pageId === "reportDetailPage" || pageId === "aiReparsePage");
  homeOnlySections.forEach((item) => item.classList.add("hidden"));
  planPage.classList.remove("active");
  servicePage.classList.remove("active");
  serviceDetailPage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((item) => item.classList.remove("active"));
  page.classList.add("active");
  if (pageId === "reportEditPage") populateReportEditForm();
  medicalFab?.classList.remove("active");
  closeOverlays();
}

function goBackPage() {
  const previous = pageStack.pop() || "minePage";
  document.body.classList.remove("detail-page-open");
  subPages.forEach((item) => item.classList.remove("active"));
  if (previous === "minePage") {
    minePage.classList.add("active");
    setProfileTab([...profileTabs].find((tab) => tab.classList.contains("active"))?.dataset.profileTab || "medical");
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

document.querySelector("#downloadReport")?.addEventListener("click", () => {
  toast.textContent = "报告已保存";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});

document.querySelector("#shareReport")?.addEventListener("click", () => {
  openSubPage("aiReparsePage");
  window.setTimeout(() => {
    document.querySelector("#aiReparsePage")?.classList.remove("active");
    document.querySelector("#reportDetailPage")?.classList.add("active");
    document.body.classList.add("detail-page-open");
  }, 1600);
});
logoutBtn.addEventListener("click", () => {
  closeOverlays();
  sheetMask.classList.add("active");
  logoutDialog.classList.add("active");
});

savePersonalSettings?.addEventListener("click", () => {
  const nickname = personalNickname?.value.trim() || "用户6162";
  if (settingsUserName) settingsUserName.textContent = nickname;
  toast.textContent = "个人设置已保存";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
  goBackPage();
});

document.querySelector("[data-personal-phone]")?.addEventListener("click", () => {
  toast.textContent = "进入手机号绑定";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
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
    profileNameButton.textContent = currentPatient.name;
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
  if (!cycleReminder || !cycleReminderText || !cycleAction) return;
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

cycleAction?.addEventListener("click", () => {
  openCycleSheet("start");
});

cycleClose?.addEventListener("click", () => {
  window.localStorage?.setItem("cycleReminderHiddenDate", todayString());
  cycleReminder?.classList.add("hidden");
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
    if (cycleReminderText && cycleAction && cycleClose && cycleReminder) {
      cycleReminderText.textContent = "已记录，后续我会帮你持续关注周期变化";
      cycleAction.classList.add("hidden");
      cycleClose.classList.add("hidden");
      window.setTimeout(() => cycleReminder.classList.add("hidden"), 3000);
    }
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
        <p class="package-sales"><strong>${item.price}</strong><span>${item.sales}</span></p>
      </div>
      <i class="package-arrow"></i>
    </article>
  `).join("");
}

function serviceTagsHtml(tags) {
  const parts = String(tags || "").split("｜").filter(Boolean);
  if (parts.length <= 1) return tags || "";
  const last = parts.pop();
  return `${parts.join("｜")}｜<span>${last}</span>`;
}

function renderServiceDetail(service, source = "service") {
  if (!service) return;
  serviceDetailSource = source;
  const ageText = currentPatient.age ? `${currentPatient.age}岁` : "年龄待完善";
  if (detailPatientName) detailPatientName.textContent = currentPatient.name || "就诊人";
  if (detailPatientMeta) detailPatientMeta.textContent = `${sexText(currentPatient.sex)}｜${ageText}`;
  if (detailPatientAvatar) {
    detailPatientAvatar.className = `detail-patient-avatar ${currentPatient.sex === "male" ? "male" : currentPatient.sex === "female" ? "female" : ""}`;
  }
  if (detailProductCover) detailProductCover.className = `detail-product service-img ${service.img}`;
  if (detailServiceTitle) detailServiceTitle.textContent = service.title;
  if (detailServiceTags) detailServiceTags.innerHTML = serviceTagsHtml(service.tags);
  if (detailServicePrice) detailServicePrice.textContent = service.price;
  if (detailServiceSales) detailServiceSales.textContent = service.sales;
  if (detailServiceDesc) detailServiceDesc.textContent = service.desc;
  if (buyButton) buyButton.textContent = source === "orders" ? "进入服务" : `立即购买 ${service.price}`;
}

function openServiceDetail(serviceId, source = "service") {
  const service = packages.find((item) => item.id === serviceId) || packages[0];
  renderServiceDetail(service, source);
  servicePage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((page) => page.classList.remove("active"));
  serviceDetailPage.classList.add("active");
  closeOverlays();
}

serviceFilters.forEach((button) => {
  button.addEventListener("click", () => {
    serviceFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderPackages(button.dataset.filter);
  });
});

packageList.addEventListener("click", (event) => {
  const card = event.target.closest(".package-card");
  if (card) openServiceDetail(card.dataset.id, "service");
});

document.querySelector(".orders-panel")?.addEventListener("click", (event) => {
  const card = event.target.closest(".archive-service-card");
  if (!card) return;
  openServiceDetail(card.dataset.serviceId, "orders");
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
  schedulePatientSheet?.classList.remove("active");
  scheduleCheckinSheet?.classList.remove("active");
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
  if (medicalFab) {
    medicalFab.classList.toggle("active", tabName === "medical");
  }
}

if (serviceFab) {
  serviceFab.addEventListener("click", () => openSheet(serviceActionSheet));
}
if (uploadFab) {
  uploadFab.addEventListener("click", () => openSheet(uploadSheet));
}
document.querySelector(".archive-detail-btn")?.addEventListener("click", () => {
  setProfileTab("medical");
  toast.textContent = "已切换到健康档案详情";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
});
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
uploadTypePills?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upload-type]");
  if (!button) return;
  uploadTypePills.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  uploadTypeSelect.value = button.dataset.uploadType;
  renderSelectedFiles();
});
selectedFiles?.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-file]");
  const picker = event.target.closest("[data-mock-file]");
  if (remove) {
    selectedUploadFiles.splice(Number(remove.dataset.removeFile), 1);
    renderSelectedFiles();
  }
  if (picker) {
    addMockFile(picker.dataset.mockFile);
  }
});
submitUpload?.addEventListener("click", () => {
  if (!selectedUploadFiles.length) return;
  if (hasOversizeFile()) {
    toast.textContent = "文件超过50MB，请重新选择";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  createParseTasks("parsing");
  closeOverlays();
  openSubPage("parseTaskPage");
  toast.textContent = "资料正在上传，AI 正在解析";
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
  const completed = event.target.closest("[data-completed-task]");
  const card = event.target.closest("[data-task-card]");
  if (supplement) openSupplementDialog(supplement.dataset.supplementTask);
  if (completed) {
    openCompletedTaskReport(completed.dataset.completedTask);
    return;
  }
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
  if (!supplement && !reparse && !deleteTask && card) {
    if (card.dataset.taskStatus === "pending") {
      openSupplementDialog(card.dataset.taskCard);
    }
    if (card.dataset.taskStatus === "completed") {
      openCompletedTaskReport(card.dataset.taskCard);
    }
  }
});
profileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setProfileTab(tab.dataset.profileTab);
    renderPeriodCard();
  });
});

orderStatusTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order-tab]");
  if (!button) return;
  const tab = button.dataset.orderTab;
  orderStatusTabs.querySelectorAll("[data-order-tab]").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  orderPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.orderPanel === tab);
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

saveReportEdit?.addEventListener("click", saveReportEditAndBack);
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
serviceSupport?.addEventListener("click", () => openSheet(supportSheet));
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

favoriteBtn?.addEventListener("click", () => {
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
  if (serviceDetailSource === "orders") {
    minePage.classList.add("active");
    setProfileTab("orders");
  } else {
    servicePage.classList.add("active");
  }
  closeOverlays();
});

renderMainCard("improving");
updateHomeServiceState("improving");
setProfileTab("medical");
updateCurrentPatientView();
renderMedicalReports();
renderParseTasks();
renderSelectedFiles();
renderPackages();
renderSchedule();
initCycleReminder();

const initialView = window.location.hash.replace("#", "");
if (["home", "plan", "service", "mine"].includes(initialView)) {
  tabbarLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === initialView));
  switchView(initialView);
}
