const sportTypes = {
  walk: { label: "步行", kcal: 4 },
  run: { label: "跑步", kcal: 8 },
  cycle: { label: "骑行", kcal: 6 },
  rope: { label: "跳绳", kcal: 10 },
  swim: { label: "游泳", kcal: 9 },
  fitness: { label: "健身", kcal: 7 },
  other: { label: "其他", kcal: 4 }
};

const sportIntensities = {
  low: "低强度",
  medium: "中强度",
  high: "高强度"
};

const focusPlanDashboards = {
  weight90: {
    name: "90天减肥计划",
    metrics: [
      { id: "sugar", name: "血糖", value: 5.0, display: "5.0", unit: "mmol/L", status: "正常", values: [5.4, 5.2, 5.1, 5.3, 5.0, 4.9, 5.0] },
      { id: "bp", name: "血压", value: 130, display: "130/85", unit: "mmHg", status: "正常", values: [134, 132, 131, 129, 133, 128, 130] },
      { id: "weight", name: "体重", value: 68.5, display: "68.5", unit: "kg", status: "下降 1.6kg", values: [70.1, 69.8, 69.6, 69.3, 69.0, 68.8, 68.5] },
      { id: "waist", name: "腰围", value: 82.5, display: "82.5", unit: "cm", status: "正常", values: [84.2, 83.9, 83.6, 83.2, 82.9, 82.7, 82.5] },
      { id: "height", name: "身高", value: 165, display: "165", unit: "cm", status: "稳定", values: [165, 165, 165, 165, 165, 165, 165] },
      { id: "heart", name: "心率", value: 76, display: "76", unit: "次/分", status: "正常", values: [78, 75, 77, 74, 76, 73, 76] },
      { id: "lipid", name: "血脂", value: 1.6, display: "1.6", unit: "mmol/L", status: "正常", values: [1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.6] },
      { id: "uric", name: "尿酸", value: 368, display: "368", unit: "μmol/L", status: "正常", values: [354, 360, 365, 358, 370, 372, 368] },
      { id: "fat", name: "体脂", value: 28.4, display: "28.4", unit: "%", status: "下降 2.1%", values: [30.5, 30.1, 29.8, 29.4, 29.0, 28.7, 28.4] },
      { id: "bmi", name: "BMI", value: 25.2, display: "25.2", unit: "", status: "较上次下降 0.6", values: [25.8, 25.7, 25.6, 25.5, 25.4, 25.3, 25.2] }
    ]
  },
  kidney: {
    name: "慢性肾病管理",
    metrics: [
      { id: "bp-kidney", name: "血压", value: 132, display: "132/86", unit: "mmHg", status: "需关注", attention: true, values: [136, 134, 138, 132, 130, 135, 132] },
      { id: "sugar-kidney", name: "血糖", value: 6.2, display: "6.2", unit: "mmol/L", status: "正常", values: [6.5, 6.3, 6.4, 6.1, 6.0, 6.3, 6.2] },
      { id: "egfr", name: "肾小球过滤率", value: 58, display: "58", unit: "mL/min", status: "偏低", attention: true, values: [62, 61, 60, 59, 60, 58, 58] },
      { id: "kidney-size", name: "肾脏大小", value: 10.4, display: "10.4", unit: "cm", status: "左肾纵径", values: [10.5, 10.5, 10.4, 10.4, 10.4, 10.4, 10.4] },
      { id: "creatinine", name: "肌酐", value: 92, display: "92", unit: "μmol/L", status: "正常", values: [88, 90, 91, 89, 93, 94, 92] },
      { id: "serum-creatinine", name: "血肌酐", value: 98.7, display: "98.7", unit: "μmol/L", status: "需关注", attention: true, values: [94, 95, 96, 97, 99, 100, 98.7] },
      { id: "uric", name: "尿酸", value: 368, display: "368", unit: "μmol/L", status: "正常高值", values: [354, 360, 365, 358, 370, 372, 368] }
    ]
  },
  cardiovascular: {
    name: "心血管风险看板",
    metrics: [
      { id: "bp-cardio", name: "血压", value: 138, display: "138/88", unit: "mmHg", status: "偏高", attention: true, values: [142, 139, 141, 136, 140, 137, 138] },
      { id: "sugar-cardio", name: "血糖", value: 6.0, display: "6.0", unit: "mmol/L", status: "正常", values: [6.3, 6.1, 6.2, 5.9, 6.0, 5.8, 6.0] },
      { id: "heart-cardio", name: "心率", value: 82, display: "82", unit: "次/分", status: "正常", values: [80, 84, 81, 79, 83, 85, 82] }
    ]
  },
  diabetes: {
    name: "糖尿病管理",
    metrics: [
      { id: "bp-diabetes", name: "血压", value: 128, display: "128/82", unit: "mmHg", status: "正常", values: [130, 128, 132, 127, 129, 126, 128] },
      { id: "sugar-diabetes", name: "血糖", value: 7.1, display: "7.1", unit: "mmol/L", status: "偏高", attention: true, values: [7.6, 7.4, 7.2, 7.5, 7.0, 6.9, 7.1] }
    ]
  }
};

const extendedHealthMetrics = [
  { id: "waist-hip", name: "腰臀比", value: 0.84, display: "0.84", unit: "", status: "正常", values: [0.87, 0.86, 0.86, 0.85, 0.85, 0.84, 0.84] },
  { id: "hip", name: "臀围", value: 98.0, display: "98.0", unit: "cm", status: "稳定", values: [99.4, 99.1, 98.8, 98.6, 98.4, 98.2, 98.0] },
  { id: "tc", name: "总胆固醇 TC", value: 4.82, display: "4.82", unit: "mmol/L", status: "正常", values: [5.08, 5.0, 4.96, 4.9, 4.88, 4.85, 4.82] },
  { id: "tg", name: "甘油三酯 TG", value: 1.36, display: "1.36", unit: "mmol/L", status: "正常", values: [1.58, 1.5, 1.46, 1.42, 1.39, 1.38, 1.36] },
  { id: "hdl", name: "高密度脂蛋白 HDL-C", value: 1.28, display: "1.28", unit: "mmol/L", status: "正常", values: [1.18, 1.2, 1.22, 1.23, 1.25, 1.26, 1.28] },
  { id: "ldl", name: "低密度脂蛋白 LDL-C", value: 2.72, display: "2.72", unit: "mmol/L", status: "正常", values: [3.1, 3.0, 2.94, 2.88, 2.82, 2.78, 2.72] },
  { id: "hba1c", name: "糖化血红蛋白 HbA1c", value: 5.8, display: "5.8", unit: "%", status: "正常", values: [6.1, 6.0, 5.9, 5.9, 5.8, 5.8, 5.8] },
  { id: "tgab", name: "抗甲状腺球蛋白抗体 TgAb", value: 32, display: "32", unit: "IU/mL", status: "正常", values: [35, 34, 34, 33, 33, 32, 32] },
  { id: "tpoab", name: "抗甲状腺过氧化物酶抗体 TPOAb", value: 18, display: "18", unit: "IU/mL", status: "正常", values: [20, 20, 19, 19, 18, 18, 18] },
  { id: "ebv-igg", name: "EB病毒核抗原IgG", value: 86, display: "86", unit: "U/mL", status: "既往感染", values: [86, 86, 86, 86, 86, 86, 86] },
  { id: "beta2-gp1", name: "抗β2糖蛋白1抗体", value: 6.2, display: "6.2", unit: "RU/mL", status: "正常", values: [6.8, 6.6, 6.5, 6.4, 6.3, 6.2, 6.2] }
];

Object.values(focusPlanDashboards).forEach((dashboard) => {
  extendedHealthMetrics.forEach((metric) => {
    if (!dashboard.metrics.some((item) => item.id === metric.id)) {
      dashboard.metrics.push({ ...metric, values: [...metric.values] });
    }
  });
});

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
        { type: "随访量表", plan: "高血压服务包", title: "出院随访跟踪量表", range: "2025/05/01 至 2025/05/10", status: "进行中", action: "立即查看" },
        { type: "血压记录", plan: "", title: "完成血压打卡", range: "", status: "进行中", action: "去打卡", taskKind: "checkin" },
        { type: "饮食记录", plan: "", title: "完成饮食打卡", range: "", status: "进行中", action: "去打卡", taskKind: "checkin" },
        { type: "用药记录", plan: "", title: "完成用药打卡", range: "", status: "进行中", action: "去打卡", taskKind: "checkin" }
      ],
      assessments: [
        { title: "糖尿病风险评估", desc: "健康管理师邀请您完成健康评估，了解健康状况。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "当日摄入 430 kcal", count: "已记录 1 次", value: "430 kcal", totalCalories: 430, latestRecordTime: "08:10" },
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
    },
    "2025-03-27": {
      reminders: ["用药提醒", "饮食记录"],
      followups: [
        { type: "随访量表", plan: "减重管理计划", title: "本周饮食与运动执行反馈", range: "2025/03/27 至 2025/03/30", status: "进行中", action: "立即查看" }
      ],
      assessments: [
        { title: "心血管风险自评", desc: "结合近期血压、饮食和运动记录，生成风险建议。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录今日饮食，获取饮食建议", count: "待完成" },
        { type: "sport", title: "运动打卡", desc: "今日建议快走 30 分钟", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 1 次", value: "降压药 08:10" },
        { type: "weight", title: "体重打卡", desc: "记录体重变化，关注健康趋势", count: "待完成" },
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "已记录 1 次", value: "126/80 mmHg 07:40" },
        { type: "sugar", title: "血糖打卡", desc: "记录空腹/餐后血糖", count: "待完成" }
      ]
    },
    "2025-03-28": {
      reminders: ["复诊提醒"],
      followups: [
        { type: "随访问卷", plan: "控压管理计划", title: "居家血压监测问卷", range: "2025/03/28 至 2025/04/02", status: "进行中", action: "继续填写" }
      ],
      assessments: [],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" },
        { type: "waist", title: "腰围打卡", desc: "记录腰围变化", count: "待完成" },
        { type: "heart", title: "心率打卡", desc: "记录静息心率", count: "待完成" }
      ]
    },
    "2025-03-29": {
      reminders: ["运动提醒", "用药提醒"],
      followups: [],
      assessments: [
        { title: "睡眠质量评估", desc: "记录最近一周睡眠情况，获取睡眠建议。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录周末饮食，避免热量超标", count: "待完成" },
        { type: "sport", title: "运动打卡", desc: "记录每日运动，帮助保持习惯", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" }
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

const dietMockImages = [
  "linear-gradient(135deg, #f8b26a 0 35%, #f4d5a1 35% 58%, #67c99a 58% 100%)",
  "linear-gradient(135deg, #cf6f52 0 32%, #f7d275 32% 54%, #83d2ff 54% 100%)",
  "linear-gradient(135deg, #7ccf8e 0 30%, #fff1a6 30% 60%, #f08a94 60% 100%)",
  "linear-gradient(135deg, #b36d43 0 38%, #f5e4c0 38% 62%, #a4d879 62% 100%)"
];

const dietFoodTemplates = [
  [
    { name: "香煎三文鱼配轻食沙拉", calories: 155, protein: 18, fat: 3.2, carb: 9, image: "fish" },
    { name: "水煮西兰花", calories: 64, protein: 4, fat: 0.6, carb: 10, image: "green" }
  ],
  [
    { name: "鸡胸肉全麦三明治", calories: 360, protein: 28, fat: 8, carb: 42, image: "sandwich" },
    { name: "无糖酸奶", calories: 120, protein: 9, fat: 3, carb: 12, image: "yogurt" }
  ],
  [
    { name: "番茄牛肉意面", calories: 520, protein: 32, fat: 12, carb: 68, image: "pasta" },
    { name: "时令水果杯", calories: 95, protein: 1, fat: 0.3, carb: 23, image: "fruit" }
  ]
];

const medicineMockImages = [
  "radial-gradient(ellipse at 34% 44%, rgba(255,255,255,.92) 0 12px, transparent 13px), radial-gradient(ellipse at 68% 60%, rgba(255,255,255,.9) 0 10px, transparent 11px), linear-gradient(145deg, #dff0ff 0%, #8ab9ff 100%)",
  "linear-gradient(135deg, rgba(255,255,255,.95) 0 33%, transparent 34% 100%), radial-gradient(circle at 64% 34%, #77daa4 0 11px, transparent 12px), radial-gradient(circle at 38% 67%, #37b978 0 9px, transparent 10px), linear-gradient(145deg, #e9fff3 0%, #94e3b8 100%)",
  "radial-gradient(ellipse at 34% 38%, #ffcf6d 0 10px, transparent 11px), radial-gradient(ellipse at 64% 62%, #7fd7ff 0 12px, transparent 13px), linear-gradient(145deg, #fff7e8 0%, #eaf2ff 100%)"
];

const defaultMedicineRecords = {
  zhang: [
    {
      id: "med-20260617-1705",
      time: "2026-06-17T17:05",
      note: "饭后服用，温水送服",
      items: [
        { id: "med-i-1", type: "medicine", name: "二甲双胍片", images: [medicineMockImages[0], medicineMockImages[1]] },
        { id: "med-i-2", type: "medicine", name: "阿托伐他汀钙片", images: [medicineMockImages[2]] },
        { id: "med-i-3", type: "nutrition", name: "维生素D3软胶囊", images: [] }
      ]
    },
    {
      id: "med-20260616-2030",
      time: "2026-06-16T20:30",
      note: "",
      items: [
        { id: "med-i-4", type: "medicine", name: "缬沙坦胶囊", images: [medicineMockImages[1]] },
        { id: "med-i-5", type: "nutrition", name: "钙片", images: [] }
      ]
    },
    {
      id: "med-20260615-0800",
      time: "2026-06-15T08:00",
      note: "早餐后",
      items: [
        { id: "med-i-6", type: "nutrition", name: "多种维生素片", images: [medicineMockImages[2]] }
      ]
    }
  ]
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
metricRecordsByPatient = loadJsonStore("metricRecordsByPatient", {});
deletedMetricRecordIdsByPatient = loadJsonStore("deletedMetricRecordIdsByPatient", {});
medicineRecordsByPatient = loadJsonStore("medicineRecordsByPatient", defaultMedicineRecords);

function saveMetricRecords() {
  window.localStorage?.setItem("metricRecordsByPatient", JSON.stringify(metricRecordsByPatient));
  window.localStorage?.setItem("deletedMetricRecordIdsByPatient", JSON.stringify(deletedMetricRecordIdsByPatient));
}

function saveMedicineRecords() {
  window.localStorage?.setItem("medicineRecordsByPatient", JSON.stringify(medicineRecordsByPatient));
}

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
