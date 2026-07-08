function renderFocusPlans() {
  if (!focusMetricGrid) return;
  const plan = focusPlanDashboards[selectedFocusPlan] || focusPlanDashboards.weight90;
  if (!focusPlanDashboards[selectedFocusPlan]) selectedFocusPlan = "weight90";
  applyLatestMetricRecords(plan);
  focusPlanSwitch?.querySelectorAll("[data-focus-plan]").forEach((button) => {
    const active = button.dataset.focusPlan === selectedFocusPlan;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  focusMetricGrid.innerHTML = plan.metrics.map((metric) => `
    <button class="focus-metric-card${metric.attention ? " attention" : ""}" type="button" data-focus-metric="${metric.id}" data-metric-kind="${metricBaseId(metric.id)}" data-metric-icon="${metricIconSymbol(metricBaseId(metric.id))}">
      <span>${metric.name}</span>
      <strong>${metric.display}<em>${metric.unit}</em></strong>
    </button>
  `).join("");
}

function metricIconSymbol(kind) {
  return {
    sugar: "糖",
    bp: "压",
    heart: "心",
    weight: "重",
    waist: "围",
    hip: "臀",
    height: "高",
    lipid: "脂",
    tc: "脂",
    tg: "脂",
    hdl: "脂",
    ldl: "脂",
    uric: "酸",
    fat: "脂",
    bmi: "BMI",
    "waist-hip": "比",
    hba1c: "糖",
    tgab: "抗",
    tpoab: "抗",
    "ebv-igg": "Ig",
    "beta2-gp1": "β2"
  }[kind] || "数";
}

const metricFieldRules = {
  bp: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "systolic", label: "收缩压", unit: "mmHg", step: "1", min: "40", max: "260", required: true },
    { key: "diastolic", label: "舒张压", unit: "mmHg", step: "1", min: "30", max: "180", required: true }
  ] },
  sugar: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "value", label: "血糖值", unit: "mmol/L", step: "0.1", min: "0.1", max: "40", decimals: 1, required: true }
  ] },
  heart: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "value", label: "心率值", unit: "次/分", step: "1", min: "20", max: "200", decimals: 0, required: true }
  ] },
  weight: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "value", label: "体重值", unit: "kg", step: "0.1", min: "1", max: "500", decimals: 1, required: true }
  ] },
  height: { supportsInput: true, inputType: "档案补录", allowCreate: true, fields: [
    { key: "value", label: "身高值", unit: "cm", step: "0.1", min: "0", max: "300", decimals: 1, required: true }
  ] },
  waist: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "value", label: "腰围值", unit: "cm", step: "0.1", min: "40", max: "200", decimals: 1, required: true }
  ] },
  hip: { supportsInput: true, inputType: "日常监测", allowCreate: true, fields: [
    { key: "value", label: "臀围值", unit: "cm", step: "0.1", min: "40", max: "200", decimals: 1, required: true }
  ] },
  bmi: { supportsInput: false, inputType: "系统计算", autoCalculate: true, allowCreate: true, fields: [] },
  "waist-hip": { supportsInput: false, inputType: "系统计算", autoCalculate: true, allowCreate: true, fields: [] },
  lipid: { supportsInput: true, inputType: "检验补录", fields: [
    { key: "tc", label: "总胆固醇 TC", unit: "mmol/L", step: "0.01", min: "0.1", max: "20", decimals: 2, required: true, ownTime: true, group: "basic" },
    { key: "tg", label: "甘油三酯 TG", unit: "mmol/L", step: "0.01", min: "0.1", max: "50", decimals: 2, required: true, ownTime: true, group: "basic" },
    { key: "hdl", label: "高密度脂蛋白胆固醇 HDL-C", unit: "mmol/L", step: "0.01", min: "0.1", max: "5", decimals: 2, required: true, ownTime: true, group: "basic" },
    { key: "ldl", label: "低密度脂蛋白胆固醇 LDL-C", unit: "mmol/L", step: "0.01", min: "0.1", max: "15", decimals: 2, required: true, ownTime: true, group: "basic" },
    { key: "sdldl", label: "小而密低密度脂蛋白胆固醇 sdLDL-C", unit: "mmol/L", step: "0.01", min: "0", max: "5", decimals: 2, ownTime: true, group: "sdldl" },
    { key: "oxldl", label: "氧化低密度脂蛋白胆固醇 oxLDL-C", unit: "ng/ml", step: "0.01", min: "0", max: "200", decimals: 2, ownTime: true, group: "oxldl" }
  ] },
  tc: { aliasOf: "lipid" },
  tg: { aliasOf: "lipid" },
  hdl: { aliasOf: "lipid" },
  ldl: { aliasOf: "lipid" },
  hba1c: { supportsInput: true, inputType: "检验补录", allowCreate: true, fields: [
    { key: "value", label: "糖化血红蛋白 HbA1c", unit: "%", step: "0.1", min: "3.0", max: "20.0", decimals: 1, required: true }
  ] },
  tgab: { supportsInput: true, inputType: "检验补录", allowCreate: true, fields: [
    { key: "value", label: "甲状腺球蛋白抗体 TgAb", unit: "IU/mL", step: "0.01", min: "0", max: "4000", decimals: 2, required: true }
  ] },
  tpoab: { supportsInput: true, inputType: "检验补录", allowCreate: true, fields: [
    { key: "value", label: "甲状腺过氧化物酶抗体 TPOAb", unit: "IU/mL", step: "0.01", min: "0", max: "4000", decimals: 2, required: true }
  ] },
  "ebv-igg": { supportsInput: true, inputType: "结果补录", allowCreate: true, fields: [
    { key: "value", label: "EB病毒核抗原 IgG", unit: "", type: "select", options: ["阴性", "阳性", "弱阳性"], required: true }
  ] },
  "beta2-gp1": { supportsInput: true, inputType: "结果补录", allowCreate: true, fields: [
    { key: "value", label: "抗β2糖蛋白1抗体", unit: "U/mL", step: "0.01", min: "0", max: "200", decimals: 2, required: true }
  ] },
  uric: { supportsInput: true, inputType: "检验补录", fields: [
    { key: "value", label: "血尿酸", unit: "μmol/L", step: "0.01", min: "0", max: "1200", decimals: 2, required: true }
  ] },
  fat: { supportsInput: true, inputType: "日常监测", fields: [
    { key: "value", label: "体脂率", unit: "%", step: "0.1", min: "1", max: "70", decimals: 1, required: true }
  ] },
  egfr: { supportsInput: true, inputType: "检验补录", fields: [
    { key: "value", label: "肾小球过滤率", unit: "mL/min", step: "1", min: "1", max: "200", decimals: 0, required: true }
  ] },
  "kidney-size": { supportsInput: true, inputType: "检验补录", fields: [
    { key: "value", label: "肾脏大小", unit: "cm", step: "0.1", min: "5", max: "20", decimals: 1, required: true }
  ] },
  creatinine: { supportsInput: true, inputType: "检验补录", fields: [
    { key: "value", label: "肌酐", unit: "μmol/L", step: "0.1", min: "10", max: "2000", decimals: 1, required: true }
  ] },
  "serum-creatinine": { supportsInput: true, inputType: "检验补录", fields: [
    { key: "value", label: "血肌酐", unit: "μmol/L", step: "0.1", min: "10", max: "2000", decimals: 1, required: true }
  ] }
};

function metricFieldRuleFor(metricId) {
  const baseId = metricBaseId(metricId);
  const rule = metricFieldRules[metricId] || metricFieldRules[baseId];
  if (rule?.aliasOf) return metricFieldRules[rule.aliasOf];
  return rule;
}

const metricRecordConfigs = Object.fromEntries(
  Object.entries(metricFieldRules)
    .filter(([, rule]) => !rule.aliasOf && Array.isArray(rule.fields) && rule.fields.length)
    .map(([key, rule]) => [key, rule.fields])
);

function metricRecordConfigId(metricId) {
  const baseId = metricBaseId(metricId);
  const rule = metricFieldRules[metricId] || metricFieldRules[baseId];
  if (rule?.aliasOf) return rule.aliasOf;
  if (metricRecordConfigs[metricId]) return metricId;
  if (metricRecordConfigs[baseId]) return baseId;
  return metricId;
}

function metricRecordFieldsFor(metric) {
  const rule = metricFieldRuleFor(metric.id);
  if (rule && !rule.supportsInput) return [];
  return metricRecordConfigs[metricRecordConfigId(metric.id)] || [{
    key: "value",
    label: `${metric.name}值`,
    unit: metric.unit || "",
    step: Number(metric.value) >= 100 ? "1" : "0.1",
    min: "0",
    max: "9999",
    required: true
  }];
}

function metricInputUnsupportedMessage(metric) {
  const rule = metricFieldRuleFor(metric?.id);
  return rule && !rule.supportsInput ? `${metric.name}由系统自动计算，暂不支持手动填写` : "";
}

function metricFieldRequired(field) {
  return Boolean(field.required);
}

function metricFieldIsNumeric(field) {
  return field.type !== "select";
}

function metricRecordFieldInputHtml(metric, field) {
  const value = metricRecordEditValue(metric, field);
  if (field.type === "select") {
    return `
      <select data-metric-input="${field.key}" aria-label="${field.label}">
        ${(field.options || []).map((option) => `<option value="${option}"${String(value || field.options?.[0] || "") === option ? " selected" : ""}>${option}</option>`).join("")}
      </select>
    `;
  }
  return `
    <input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" value="${value}" aria-label="${field.label}">
    ${field.unit ? `<span>${field.unit}</span>` : ""}
  `;
}

function getMetricNameById(metricId) {
  for (const dashboard of Object.values(focusPlanDashboards)) {
    const metric = dashboard.metrics.find((item) => item.id === metricId);
    if (metric) return metric.name;
  }
  return "";
}

function metricRecordTimeLabelFor(metricId) {
  const baseId = metricBaseId(metricId);
  return {
    sugar: "血糖测量时间",
    bp: "血压测量时间",
    weight: "称重时间",
    waist: "腰围测量时间",
    hip: "臀围测量时间",
    height: "身高测量时间",
    heart: "心率测量时间",
    lipid: "血脂记录时间",
    uric: "检查时间",
    fat: "体脂测量时间",
    hba1c: "检查时间",
    tgab: "检查时间",
    tpoab: "检查时间",
    "ebv-igg": "检查时间",
    "beta2-gp1": "检查时间",
    bmi: "BMI测量时间",
    egfr: "检测时间",
    "kidney-size": "检查时间",
    creatinine: "检测时间",
    "serum-creatinine": "检测时间"
  }[metricId] || {
    sugar: "血糖测量时间",
    bp: "血压测量时间",
    heart: "心率测量时间"
  }[baseId] || `${getMetricNameById(metricId) || "指标"}记录时间`;
}

function metricRecordsFor(metricId) {
  const patientRecords = metricRecordsByPatient[currentPatient.id] || {};
  return patientRecords[metricId] || [];
}

function deletedMetricRecordIdsFor(metricId) {
  const patientRecords = deletedMetricRecordIdsByPatient[currentPatient.id] || {};
  return patientRecords[metricId] || [];
}

function applyLatestMetricRecords(plan) {
  plan.metrics.forEach((metric) => {
    if (!metric.initialState) {
      metric.initialState = {
        value: metric.value,
        display: metric.display,
        status: metric.status,
        attention: Boolean(metric.attention),
        values: [...metric.values]
      };
    }
    metric.value = metric.initialState.value;
    metric.display = metric.initialState.display;
    metric.status = metric.initialState.status;
    metric.attention = metric.initialState.attention;
    metric.values = [...metric.initialState.values];
    const latest = allMetricRecords(metric)[0];
    if (!latest) return;
    metric.value = latest.chartValue;
    metric.display = latest.display;
    metric.status = latest.status;
    metric.attention = latest.attention;
    if (metric.values.at(-1) !== latest.chartValue) {
      metric.values = [...metric.values, latest.chartValue].slice(-7);
    }
  });
}

function localDateTimeInputValue(date = new Date()) {
  return `${dateInputValue(date)}T${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function displayMetricRecordTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace("T", " ").replaceAll("-", "/");
  return formatCheckinTimeDisplay(value);
}

function formatMetricRecordInputTime(value) {
  return formatCheckinTimeDisplay(value);
}

function updateMetricRecordTimeText() {
  if (metricRecordTimeText) metricRecordTimeText.textContent = formatMetricRecordInputTime(metricRecordTime?.value);
}

function updateMetricRecordNoteCount() {
  if (metricRecordNoteCount) metricRecordNoteCount.textContent = `${metricRecordNote?.value.length || 0}/100`;
}

function populateMetricRecordTimePicker() {
  if (!metricRecordPickerDate || !metricRecordPickerHour || !metricRecordPickerMinute) return;
  const selected = metricRecordTime?.value ? new Date(metricRecordTime.value) : new Date();
  metricRecordPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const label = `${date.getFullYear()}年${padDateNumber(date.getMonth() + 1)}月${padDateNumber(date.getDate())}日`;
    return `<option value="${dateInputValue(date)}">${label}</option>`;
  }).join("");
  metricRecordPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}时</option>`;
  }).join("");
  metricRecordPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}分</option>`;
  }).join("");
  metricRecordPickerDate.value = dateInputValue(selected);
  metricRecordPickerHour.value = padDateNumber(selected.getHours());
  metricRecordPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openMetricRecordTimePicker() {
  const title = metricRecordTimePicker?.querySelector(".weight-picker-head strong");
  const metric = getSelectedMetric();
  if (title) title.textContent = `选择${metricRecordTimeLabelFor(metric?.id)}`;
  populateMetricRecordTimePicker();
  metricRecordTimePicker?.classList.add("active");
}

function closeMetricRecordTimePicker() {
  metricRecordTimePicker?.classList.remove("active");
}

function confirmMetricRecordTimePicker() {
  if (!metricRecordPickerDate?.value || !metricRecordPickerHour?.value || !metricRecordPickerMinute?.value) return;
  metricRecordTime.value = `${metricRecordPickerDate.value}T${metricRecordPickerHour.value}:${metricRecordPickerMinute.value}`;
  updateMetricRecordTimeText();
  closeMetricRecordTimePicker();
}

function baselineMetricRecords(metric) {
  const baseDate = new Date();
  baseDate.setHours(8, 20, 0, 0);
  return [...metric.initialState.values].reverse().map((value, index) => {
    const time = new Date(baseDate);
    time.setDate(baseDate.getDate() - index);
    const display = metric.id === "bp"
      ? `${formatMetricNumber(value)}/${Math.round(value * 0.65)}`
      : formatMetricNumber(value);
    return {
      id: `baseline-${metric.id}-${index}`,
      time: localDateTimeInputValue(time),
      display,
      chartValue: value,
      unit: metric.unit,
      status: "正常",
      attention: false,
      baseline: true
    };
  });
}

function allMetricRecords(metric) {
  const deletedIds = new Set(deletedMetricRecordIdsFor(metric.id));
  return [...metricRecordsFor(metric.id), ...baselineMetricRecords(metric)]
    .filter((record) => !deletedIds.has(record.id))
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

function metricRecordDateParts(value) {
  const date = new Date(value);
  return {
    key: dateInputValue(date),
    label: `${date.getFullYear()}年${padDateNumber(date.getMonth() + 1)}月${padDateNumber(date.getDate())}日`,
    time: `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`
  };
}

function normalizeRecordDate(value) {
  const parsed = value ? new Date(value) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
  const fallback = new Date();
  const matched = String(value || "").match(/(\d{1,2}):(\d{2})/);
  if (matched) fallback.setHours(Number(matched[1]), Number(matched[2]), 0, 0);
  return fallback;
}

function recordDateGroupParts(value) {
  const date = normalizeRecordDate(value);
  return {
    key: dateInputValue(date),
    label: `${date.getFullYear()}年${padDateNumber(date.getMonth() + 1)}月${padDateNumber(date.getDate())}日`,
    time: `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`,
    sort: date.getTime()
  };
}

function groupRecordsByDate(records, timeGetter) {
  const groups = new Map();
  records.forEach((record) => {
    const parts = recordDateGroupParts(timeGetter(record));
    if (!groups.has(parts.key)) {
      groups.set(parts.key, {
        key: parts.key,
        label: parts.label,
        sort: new Date(`${parts.key}T00:00`).getTime(),
        records: []
      });
    }
    groups.get(parts.key).records.push({ record, parts });
  });
  return [...groups.values()]
    .sort((a, b) => b.sort - a.sort)
    .map((group) => ({
      ...group,
      records: group.records.sort((a, b) => b.parts.sort - a.parts.sort)
    }));
}

const allCheckinFilterOptions = [
  { type: "all", label: "全部" },
  { type: "diet", label: "饮食" },
  { type: "sport", label: "运动" },
  { type: "medicine", label: "用药/补充" },
  { type: "weight", label: "体重" },
  { type: "pressure", label: "血压" },
  { type: "sugar", label: "血糖" },
  { type: "lipid", label: "血脂" },
  { type: "uric", label: "尿酸" },
  { type: "waist", label: "腰围" },
  { type: "heart", label: "心率" },
  { type: "period", label: "经期" }
];

const allCheckinTypeMeta = {
  diet: { label: "饮食记录", icon: "食", tone: "orange" },
  sport: { label: "运动", icon: "动", tone: "green" },
  medicine: { label: "用药/补充", icon: "药", tone: "purple" },
  weight: { label: "体重", icon: "重", tone: "blue" },
  pressure: { label: "血压", icon: "压", tone: "pink" },
  sugar: { label: "血糖", icon: "糖", tone: "orange" },
  lipid: { label: "血脂", icon: "脂", tone: "blue" },
  uric: { label: "尿酸", icon: "尿", tone: "purple" },
  waist: { label: "腰围", icon: "围", tone: "orange" },
  heart: { label: "心率", icon: "心", tone: "pink" },
  period: { label: "经期管理", icon: "经", tone: "pink" },
  water: { label: "饮水", icon: "水", tone: "blue" },
  sleep: { label: "睡眠", icon: "眠", tone: "purple" }
};

const allCheckinDemoRecords = {
  diet: { title: "饮食记录", value: "摄入 430 kcal", time: "08:10", sort: 810 },
  sport: { title: "运动", value: "快走 · 45分钟 · 180 kcal", time: "19:20", sort: 1920 },
  medicine: { title: "用药/补充", value: "药品 1次 · 营养素 1次", time: "22:00", sort: 2200 },
  weight: { title: "体重", value: "68.5 kg", time: "10:18", sort: 1018 },
  pressure: { title: "血压", value: "血压 128/82 mmHg", time: "08:30", sort: 830 },
  sugar: { title: "血糖", value: "血糖 5.0 mmol/L · 午餐后2h", time: "13:42", sort: 1342 },
  lipid: { title: "血脂", value: "低密度脂蛋白LDL-C：3.1 mmol/L", time: "18:07", sort: 1807 },
  uric: { title: "尿酸", value: "尿酸 362 μmol/L", time: "08:30", sort: 831 },
  waist: { title: "腰围", value: "腰围 82 cm", time: "10:20", sort: 1020 },
  heart: { title: "心率", value: "心率 72 bpm", time: "14:40", sort: 1440 },
  period: { title: "经期管理", value: "经期第 2 天", time: "09:10", sort: 910 }
};

function setMetricRecordsPageMode(mode) {
  const page = metricRecordsGroups?.closest(".metric-records-page");
  const title = page?.querySelector(".sub-nav h1");
  const isCheckinMode = mode === "checkin";
  page?.classList.toggle("checkin-records-mode", isCheckinMode);
  if (allCheckinFilters) allCheckinFilters.hidden = !isCheckinMode;
  if (title) title.textContent = isCheckinMode ? "全部打卡记录" : "全部记录";
}

function allCheckinTimeValue(value) {
  const date = value ? new Date(value) : null;
  if (date && !Number.isNaN(date.getTime())) return date.getTime();
  const matched = String(value || "").match(/(\d{1,2}):(\d{2})/);
  return matched ? Number(matched[1]) * 60 + Number(matched[2]) : 0;
}

function allCheckinRecordTime(item, record) {
  return record?.time || record?.recordTime || item?.latestRecordTime || item?.latestTime || item?.recordTime || item?.records?.[0]?.time || item?.value || "";
}

function allCheckinRawTime(item, record) {
  const raw = allCheckinRecordTime(item, record);
  const date = raw ? new Date(raw) : null;
  if (date && !Number.isNaN(date.getTime())) return raw;
  if (/^\d{1,2}:\d{2}$/.test(String(raw || ""))) {
    return `${scheduleSelectedDate || dateInputValue(new Date())}T${raw}`;
  }
  return raw;
}

function allCheckinDisplayTime(item, record) {
  const raw = allCheckinRecordTime(item, record);
  return checkinTimeText(raw) || formatCheckinTimeDisplay(raw, "--:--");
}

function allCheckinValueText(item, record) {
  const type = item?.type || "";
  if (type === "sport" && record) {
    const duration = Number(record.duration || 0);
    const calories = Number(record.calories || 0);
    return `${record.name || "运动"} · ${duration ? `${Math.round(duration)}分钟` : "未填时长"} · ${Math.round(calories)} kcal`;
  }
  if (type === "medicine" && record?.items) {
    const medicines = record.items.filter((entry) => entry.type !== "nutrition").length;
    const nutrition = record.items.length - medicines;
    return `药品 ${medicines}次 · 营养素 ${nutrition}次`;
  }
  if (type === "diet") {
    const display = checkinDisplay(item);
    return display.empty ? "暂无记录" : `摄入 ${display.main}`;
  }
  if (type === "water") {
    const display = checkinDisplay(item);
    return display.empty ? "暂无记录" : `饮水 ${display.main}`;
  }
  if (type === "medicine") {
    const display = checkinDisplay(item);
    return display.empty ? "暂无记录" : display.main;
  }
  if (type === "pressure") {
    const value = metricCheckinValue(item) || checkinValueWithoutTime(item.value);
    return value ? `血压 ${value}` : "暂无记录";
  }
  if (type === "sugar") {
    const value = metricCheckinValue(item) || checkinValueWithoutTime(item.value);
    return value ? `血糖 ${value}` : "暂无记录";
  }
  if (type === "lipid") {
    return metricCheckinValue(item) || checkinValueWithoutTime(item.value) || "暂无记录";
  }
  if (type === "uric") {
    const value = metricCheckinValue(item) || checkinValueWithoutTime(item.value);
    return value ? `尿酸 ${value}` : "暂无记录";
  }
  if (["weight", "waist", "heart", "period"].includes(type)) {
    return metricCheckinValue(item) || checkinDisplay(item).main || "暂无记录";
  }
  return checkinDisplay(item).main || "暂无记录";
}

function allCheckinRecordCards() {
  const data = scheduleDataFor();
  const cards = [];
  (data.checkins || []).forEach((item) => {
    if (!hasCheckinRecord(item)) return;
    if (item.type === "sport" && Array.isArray(item.records) && item.records.length) {
      item.records.forEach((record, index) => {
        const rawTime = allCheckinRawTime(item, record);
        cards.push({
          id: record.id || `${item.type}-${index}`,
          type: item.type,
          title: record.name || allCheckinTypeMeta[item.type]?.label || item.title,
          value: allCheckinValueText(item, record),
          time: allCheckinDisplayTime(item, record),
          rawTime,
          sort: allCheckinTimeValue(rawTime)
        });
      });
      return;
    }
    if (item.type === "medicine" && typeof sortedMedicineRecords === "function" && typeof medicineRecordDateKey === "function") {
      const medicineRecords = sortedMedicineRecords().filter((record) => medicineRecordDateKey(record) === scheduleSelectedDate);
      if (medicineRecords.length) {
        medicineRecords.forEach((record) => {
          cards.push({
            id: record.id,
            type: item.type,
            title: allCheckinTypeMeta[item.type]?.label || item.title,
            value: allCheckinValueText(item, record),
            time: allCheckinDisplayTime(item, record),
            rawTime: allCheckinRawTime(item, record),
            sort: allCheckinTimeValue(record.time)
          });
        });
        return;
      }
    }
    cards.push({
      id: item.type,
      type: item.type,
      title: allCheckinTypeMeta[item.type]?.label || item.title || "打卡记录",
      value: allCheckinValueText(item),
      time: allCheckinDisplayTime(item),
      rawTime: allCheckinRawTime(item),
      sort: allCheckinTimeValue(allCheckinRecordTime(item))
    });
  });
  const existingTypes = new Set(cards.map((card) => card.type));
  allCheckinFilterOptions
    .filter((option) => option.type !== "all" && !existingTypes.has(option.type))
    .forEach((option) => {
      const demo = allCheckinDemoRecords[option.type];
      if (!demo) return;
      cards.push({
        id: `demo-${option.type}`,
        type: option.type,
        title: demo.title,
        value: demo.value,
        time: demo.time,
        rawTime: `${scheduleSelectedDate || dateInputValue(new Date())}T${demo.time}`,
        sort: demo.sort,
        demo: true
      });
    });
  return cards.sort((a, b) => b.sort - a.sort);
}

function renderAllCheckinFilters() {
  if (!allCheckinFilters) return;
  allCheckinFilters.innerHTML = allCheckinFilterOptions.map((option) => `
    <button type="button" role="tab" aria-selected="${option.type === allCheckinFilter}" class="${option.type === allCheckinFilter ? "active" : ""}" data-all-checkin-filter="${option.type}">
      ${escapeAttr(option.label)}
    </button>
  `).join("");
}

function renderAllCheckinRecords(filter = "all") {
  allCheckinFilter = filter || "all";
  setMetricRecordsPageMode("checkin");
  renderAllCheckinFilters();
  const records = allCheckinRecordCards().filter((record) => allCheckinFilter === "all" || record.type === allCheckinFilter);
  const groups = groupRecordsByDate(records, (record) => record.rawTime || record.recordTime || record.time);
  metricRecordsGroups.innerHTML = groups.length ? groups.map((group) => `
    <section class="records-date-group">
      <h2>${escapeAttr(group.label)}</h2>
      <div>
        ${group.records.map(({ record, parts }) => {
          const meta = allCheckinTypeMeta[record.type] || { label: record.title, icon: "记", tone: "blue" };
          return `
            <article class="all-checkin-record-card" data-checkin-record-type="${escapeAttr(record.type)}" data-checkin-record-id="${escapeAttr(record.id)}" role="button" tabindex="0" aria-label="鏌ョ湅${escapeAttr(record.title)}璇︽儏">
              <i class="checkin-symbol ${escapeAttr(meta.tone || "blue")}" aria-hidden="true">${escapeAttr(meta.icon)}</i>
              <div>
                <span>${escapeAttr(record.title || meta.label)}</span>
                <strong>${escapeAttr(record.value)}</strong>
              </div>
              <time>${escapeAttr(parts.time)}</time>
              <b aria-hidden="true"></b>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("") : `
    <div class="all-checkin-empty">
      <strong>暂无打卡记录</strong>
      <span>切换类型或点击卡片右上角新增打卡。</span>
    </div>
  `;
  return;
  metricRecordsGroups.innerHTML = records.length ? records.map((record) => {
    const meta = allCheckinTypeMeta[record.type] || { label: record.title, icon: "记", tone: "blue" };
    return `
      <article class="all-checkin-record-card" data-checkin-record-type="${escapeAttr(record.type)}" data-checkin-record-id="${escapeAttr(record.id)}" role="button" tabindex="0" aria-label="查看${escapeAttr(record.title)}详情">
        <i class="checkin-symbol ${escapeAttr(meta.tone || "blue")}" aria-hidden="true">${escapeAttr(meta.icon)}</i>
        <div>
          <span>${escapeAttr(record.title || meta.label)}</span>
          <strong>${escapeAttr(record.value)}</strong>
        </div>
        <time>${escapeAttr(record.time)}</time>
        <b aria-hidden="true"></b>
      </article>
    `;
  }).join("") : `
    <div class="all-checkin-empty">
      <strong>暂无打卡记录</strong>
      <span>切换类型或点击卡片右上角新增打卡。</span>
    </div>
  `;
}

function openAllCheckinRecordDetail(type, recordId) {
  if (type === "diet") {
    openDietDetailPage();
    return;
  }
  if (type === "sport") {
    openSportDetailPage();
    if (recordId) openSportRecordEditor(recordId);
    return;
  }
  if (type === "medicine") {
    if (recordId && typeof openMedicineDetailPage === "function") openMedicineDetailPage(recordId);
    else openMedicineRecordsPage();
    return;
  }
  if (type === "period") {
    openSubPage("periodDetailPage");
    renderPeriodDetail();
    return;
  }
  const metricMap = { pressure: "bp", sugar: "sugar", weight: "weight", waist: "waist", heart: "heart", lipid: "lipid", uric: "uric" };
  if (metricMap[type]) {
    openMetricDetail(metricMap[type]);
    return;
  }
  showToast("已进入打卡记录");
}

function renderAllMetricRecords() {
  setMetricRecordsPageMode("metric");
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
  const groups = groupRecordsByDate(allMetricRecords(metric), (record) => record.time);
  metricRecordsGroups.innerHTML = groups.map((group) => `
    <section class="records-date-group">
      <h2>${escapeAttr(group.label)}</h2>
      <div>
        ${group.records.map(({ record, parts }) => `
          <article class="metric-record-item">
            <div class="metric-record-date"><strong>${parts.time}</strong><span>${escapeAttr(metric.name)}</span></div>
            <div class="metric-record-value"><strong>${record.display}</strong><em>${record.unit}</em></div>
            <button class="metric-record-delete" type="button" data-delete-metric-record="${record.id}" aria-label="鍒犻櫎${group.label}${parts.time}鐨?{metric.name}璁板綍"></button>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
  return;
  metricRecordsGroups.innerHTML = allMetricRecords(metric).map((record) => {
    const date = metricRecordDateParts(record.time);
    return `
      <article class="metric-record-item">
        <div class="metric-record-date"><strong>${date.label}</strong><span>${date.time}</span></div>
        <div class="metric-record-value"><strong>${record.display}</strong><em>${record.unit}</em></div>
        <button class="metric-record-delete" type="button" data-delete-metric-record="${record.id}" aria-label="删除${date.label}${date.time}的${metric.name}记录"></button>
      </article>
    `;
  }).join("");
}

function openMetricDeleteDialog(recordId) {
  deletingMetricRecordId = recordId;
  closeOverlays();
  sheetMask.classList.add("active");
  metricDeleteDialog.classList.add("active");
}

function confirmMetricRecordDelete() {
  if (!deletingMetricRecordId) return;
  const metric = getSelectedMetric();
  if (deletingMetricRecordId.startsWith("baseline-")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id][metric.id]) deletedMetricRecordIdsByPatient[currentPatient.id][metric.id] = [];
    deletedMetricRecordIdsByPatient[currentPatient.id][metric.id].push(deletingMetricRecordId);
  } else if (metricRecordsByPatient[currentPatient.id]?.[metric.id]) {
    metricRecordsByPatient[currentPatient.id][metric.id] = metricRecordsByPatient[currentPatient.id][metric.id]
      .filter((record) => record.id !== deletingMetricRecordId);
  }
  deletingMetricRecordId = "";
  saveMetricRecords();
  closeOverlays();
  renderFocusPlans();
  renderMetricDetail();
  renderAllMetricRecords();
  toast.textContent = "指标记录已删除";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function metricStatus(metricId, values) {
  const baseId = metricBaseId(metricId);
  const primary = values.value ?? values.systolic;
  const attention = (
    (baseId === "sugar" && primary > 6.1) ||
    (baseId === "bp" && (values.systolic >= 140 || values.diastolic >= 90)) ||
    (baseId === "heart" && (primary < 60 || primary > 100)) ||
    (metricId === "fat" && primary > 30) ||
    (metricId === "bmi" && primary >= 24) ||
    (metricId === "egfr" && primary < 60) ||
    (metricId === "kidney-size" && (primary < 9 || primary > 12)) ||
    ((metricId === "creatinine" || metricId === "serum-creatinine") && primary > 97)
  );
  return { text: attention ? "需关注" : "正常", attention };
}

function metricRecordById(metricId, recordId) {
  if (!recordId) return null;
  const saved = metricRecordsFor(metricId).find((record) => record.id === recordId);
  if (saved) return saved;
  if (metricId === "lipid") return lipidSampleRecords().find((record) => record.id === recordId) || null;
  return null;
}

function metricRecordEditValue(metric, field) {
  const editingRecord = metricRecordById(metric.id, editingMetricRecordId);
  if (editingRecord?.values?.[field.key] != null) return formatMetricFieldValue(editingRecord.values[field.key], field);
  return metricRecordDefaultValue(metric, field);
}

function metricFieldDecimals(field) {
  if (Number.isInteger(field.decimals)) return field.decimals;
  return Number(field.step) < 1 ? 1 : 0;
}

function formatMetricFieldValue(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  const decimals = metricFieldDecimals(field);
  return decimals > 0 ? number.toFixed(decimals) : String(Math.round(number));
}

function sanitizeIntegerInputValue(input) {
  if (!input) return;
  const normalized = String(input.value || "").replace(/[^\d].*$/, "");
  if (input.value !== normalized) input.value = normalized;
}

function lipidRecordField(key) {
  return metricRecordConfigs.lipid.find((field) => field.key === key);
}

function formatLipidMetricValue(key, value) {
  return formatMetricFieldValue(value, lipidRecordField(key) || { step: "0.01", decimals: 2 });
}

function metricRecordEditTime(metric, key = "") {
  const editingRecord = metricRecordById(metric.id, editingMetricRecordId);
  return editingRecord?.values?.[`${key}Time`] || editingRecord?.time || localDateTimeValue();
}

function ensureMetricRecordInlineDelete(metric) {
  document.querySelector("#metricRecordInlineDelete")?.remove();
  const actions = document.querySelector("#metricRecordActions");
  actions?.classList.remove("has-delete");
  if (!editingMetricRecordId || metric.id !== "lipid") return;
  const button = document.createElement("button");
  button.id = "metricRecordInlineDelete";
  button.className = "metric-record-inline-delete";
  button.type = "button";
  button.textContent = "删除";
  button.addEventListener("click", deleteEditingMetricRecord);
  actions?.classList.add("has-delete");
  actions?.insertBefore(button, metricRecordConfirm || null);
}

function openMetricRecordSheet(recordId = "") {
  closeOverlays();
  const metric = getSelectedMetric();
  const unsupportedMessage = metricInputUnsupportedMessage(metric);
  if (unsupportedMessage) {
    showToast(unsupportedMessage);
    return;
  }
  editingMetricRecordId = recordId || "";
  const editingRecord = metricRecordById(metric.id, editingMetricRecordId);
  const fields = metricRecordFieldsFor(metric);
  const configId = metricRecordConfigId(metric.id);
  const isUric = configId === "uric";
  metricRecordSheet.classList.toggle("metric-record-sheet-lipid", configId === "lipid");
  metricRecordSheet.classList.toggle("metric-record-sheet-combined-note", ["heart", "uric"].includes(configId));
  metricRecordSheetTitle.textContent = editingMetricRecordId ? `编辑${metric.name}记录` : `记录${metric.name}`;
  metricRecordFields.innerHTML = configId === "heart" ? `
    <section class="metric-heart-field">
      <span>心率值 <b class="metric-required">*</b></span>
      <div class="weight-stepper">
        <button class="weight-step-btn" type="button" data-metric-step="value" data-delta="-1" aria-label="减少心率值">−</button>
        <div class="weight-number-field">
          <input type="number" inputmode="numeric" pattern="[0-9]*" data-metric-input="value" min="20" max="200" step="1" value="72" aria-label="心率值">
          <span>次/分</span>
        </div>
        <button class="weight-step-btn" type="button" data-metric-step="value" data-delta="1" aria-label="增加心率值">+</button>
      </div>
    </section>
  ` : fields.map((field) => `
      <label>
        <span>${field.label}</span>
        <div><input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" placeholder="请输入"><em>${field.unit}</em></div>
      </label>
    `).join("");
  metricRecordFields.innerHTML = fields.map((field) => `
    <section class="metric-value-field">
      <h4><span>${field.label}</span>${metricFieldRequired(field) ? `<b class="metric-required">*</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>` : ""}
        <label class="metric-value-number-field">
          ${metricRecordFieldInputHtml(metric, field)}
        </label>
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>` : ""}
      </div>
    </section>
  `).join("");
  metricRecordFields.innerHTML = fields.map((field) => `
    <section class="metric-value-field">
      <h4><span>${field.label}</span>${metricFieldRequired(field) ? `<b class="metric-required">*</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>` : ""}
        <label class="metric-value-number-field">
          ${metricRecordFieldInputHtml(metric, field)}
        </label>
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>` : ""}
      </div>
      ${field.ownTime ? `
        <label class="metric-extra-time">
          <span>检查时间</span>
          <input type="datetime-local" data-metric-time="${field.key}" value="${localDateTimeValue()}">
        </label>
      ` : ""}
    </section>
  `).join("");
  metricRecordFields.innerHTML = fields.map((field) => `
    <section class="metric-value-field">
      <h4><span>${field.label}</span>${metricFieldRequired(field) ? `<b class="metric-required">*</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>` : ""}
        <label class="metric-value-number-field">
          ${metricRecordFieldInputHtml(metric, field)}
        </label>
        ${metricFieldIsNumeric(field) ? `<button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>` : ""}
      </div>
      ${field.ownTime ? `
        <label class="metric-extra-time">
          <span>检查时间</span>
          <input type="datetime-local" data-metric-time="${field.key}" value="${localDateTimeValue()}">
        </label>
      ` : ""}
    </section>
  `).join("");
  if (configId === "lipid") {
    const renderMetricValueField = (field) => `
      <section class="metric-value-field">
        <h4><span>${field.label}</span>${metricFieldRequired(field) ? `<b class="metric-required">*</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
        <div class="metric-value-stepper">
          <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>
          <label class="metric-value-number-field">
          <input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" value="${metricRecordEditValue(metric, field)}" placeholder="请输入数值" aria-label="${field.label}">
            ${field.unit ? `<span>${field.unit}</span>` : ""}
          </label>
          <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>
        </div>
      </section>
    `;
    const renderMetricExtraTime = (key) => {
      const value = metricRecordEditTime(metric, key);
      return `
        <label class="metric-extra-time">
          <span>检查时间</span>
          <div class="metric-extra-time-control">
            <strong data-metric-time-text="${key}">${formatMetricRecordInputTime(value)}</strong>
            <i aria-hidden="true"></i>
            <input type="datetime-local" data-metric-time="${key}" value="${value}" aria-label="检查时间">
          </div>
        </label>
      `;
    };
    const renderLipidMetricGroup = (field) => `
      <section class="lipid-metric-group">
        ${renderMetricValueField(field)}
        ${renderMetricExtraTime(field.key)}
      </section>
    `;
    const basicFields = fields.filter((field) => field.group === "basic");
    const sdldlField = fields.find((field) => field.key === "sdldl");
    const oxldlField = fields.find((field) => field.key === "oxldl");
    metricRecordFields.innerHTML = `
      <section class="lipid-level lipid-level-basic">
        ${basicFields.map(renderLipidMetricGroup).join("")}
      </section>
      <section class="lipid-level lipid-level-extra">
        ${renderLipidMetricGroup(sdldlField)}
      </section>
      <section class="lipid-level lipid-level-extra">
        ${renderLipidMetricGroup(oxldlField)}
      </section>
      <section class="lipid-level lipid-level-global"></section>
    `;
  } else {
    metricRecordFields.after(metricRecordTimeField);
  }
  metricRecordTime.value = editingRecord?.time || localDateTimeInputValue();
  if (metricRecordTimeLabel) metricRecordTimeLabel.textContent = metricRecordTimeLabelFor(metric.id);
  updateMetricRecordTimeText();
  metricRecordNoteField.hidden = !["heart", "uric", "lipid"].includes(configId);
  metricRecordNoteField.querySelector("span").textContent = configId === "lipid" ? "备注（全局）" : "备注";
  metricRecordNote.placeholder = configId === "heart" ? "记录运动后、静息、心慌、服药后等情况" : isUric ? "可记录饮酒、饮食、痛风发作、用药变化等" : "请输入备注";
  if (configId === "lipid") {
    const globalLevel = metricRecordFields.querySelector(".lipid-level-global");
    if (metricRecordTimeLabel) metricRecordTimeLabel.textContent = "血脂记录时间";
    metricRecordNoteField.querySelector("span").textContent = "备注（全局）";
    metricRecordNote.placeholder = "请输入备注";
    globalLevel?.append(metricRecordTimeField);
    globalLevel?.append(metricRecordNoteField);
  }
  metricRecordNote.value = editingRecord?.note || "";
  updateMetricRecordNoteCount();
  metricRecordError.textContent = "";
  if (metricRecordConfirm) metricRecordConfirm.textContent = editingMetricRecordId ? "确定" : "打卡";
  ensureMetricRecordInlineDelete(metric);
  sheetMask.classList.add("active");
  metricRecordSheet.classList.add("active");
  metricRecordFields.querySelector("input")?.focus();
}

function metricRecordDefaultValue(metric, field) {
  const latest = metricRecordsFor(metric.id)[0];
  if (!field.required && latest?.values?.[field.key] == null) return "";
  if (field.type === "select") {
    return latest?.values?.[field.key] ?? field.options?.[0] ?? "";
  }
  const raw = latest?.values?.[field.key]
    ?? (field.key === "value" ? latest?.chartValue : undefined)
    ?? (field.key === "value" ? metric.value : undefined)
    ?? Number(field.min);
  const value = Number(raw);
  if (!Number.isFinite(value)) return field.min;
  return formatMetricFieldValue(value, field);
}

function stepMetricRecordValue(key, delta) {
  const metric = getSelectedMetric();
  const field = metricRecordFieldsFor(metric).find((item) => item.key === key);
  const input = metricRecordFields?.querySelector(`[data-metric-input="${key}"]`);
  if (!field || !input) return;
  const fallback = metricRecordConfigId(metric.id) === "heart" ? 72 : Number(field.min);
  const current = normalizeDecimal(input.value, fallback);
  const decimals = metricFieldDecimals(field);
  const factor = 10 ** decimals;
  const next = Math.min(Number(field.max), Math.max(Number(field.min), Math.round((current + delta) * factor) / factor));
  input.value = formatMetricFieldValue(next, field);
}

function clampMetricValueInput(input, field, shouldFormat = false) {
  if (!input || !field) return;
  const rawValue = input.value.trim();
  if (!rawValue) return;
  const value = Number(rawValue);
  if (!Number.isFinite(value)) return;
  const min = Number(field.min);
  const max = Number(field.max);
  const clamped = Math.min(max, Math.max(min, value));
  if (clamped !== value || shouldFormat) {
    input.value = formatMetricFieldValue(clamped, field);
  }
}

function clampMetricRecordValueInput(input, shouldFormat = false) {
  const metric = getSelectedMetric();
  const key = input?.dataset?.metricInput;
  const field = metricRecordFieldsFor(metric).find((item) => item.key === key);
  clampMetricValueInput(input, field, shouldFormat);
}

function clampMetricRecordInputEvent(event, shouldFormat = false) {
  const input = event.target.closest("[data-metric-input]");
  if (!input) return;
  clampMetricRecordValueInput(input, shouldFormat);
}

function metricRecordSuccessLines(metric, record) {
  const configId = metricRecordConfigId(metric.id);
  if (configId === "lipid") {
    const lipidLine = (key, label) => {
      const field = lipidRecordField(key);
      return { label, value: formatMetricFieldValue(record.values[key], field), unit: field?.unit || "mmol/L" };
    };
    const lipidLines = [
      lipidLine("tc", "总胆固醇 TC"),
      lipidLine("tg", "甘油三酯 TG"),
      lipidLine("hdl", "HDL-C"),
      lipidLine("ldl", "LDL-C")
    ];
    if (record.values.sdldl != null) lipidLines.push(lipidLine("sdldl", "sdLDL-C"));
    if (record.values.oxldl != null) lipidLines.push(lipidLine("oxldl", "oxLDL-C"));
    return lipidLines;
  }
  if (configId === "heart") return [{ label: "当前心率", value: record.display, unit: record.unit }];
  if (configId === "uric") return [{ label: "当前尿酸", value: record.display, unit: record.unit }];
  if (metric.id === "fat") return [{ label: "当前体脂率", value: record.display, unit: record.unit }];
  return [{ label: `当前${metric.name}`, value: record.display, unit: record.unit }];
}

function saveMetricRecord() {
  const metric = getSelectedMetric();
  const config = metricRecordFieldsFor(metric);
  const configId = metricRecordConfigId(metric.id);
  const values = {};
  for (const field of config) {
    const input = metricRecordFields.querySelector(`[data-metric-input="${field.key}"]`);
    const rawValue = input?.value.trim() || "";
    if (field.type === "select") {
      if (!rawValue && field.required) {
        metricRecordError.textContent = `请选择${field.label}`;
        input?.focus();
        return;
      }
      values[field.key] = rawValue;
      continue;
    }
    if (!rawValue && !field.required) {
      values[field.key] = null;
      continue;
    }
    const value = Number(input?.value);
    if (!rawValue || !Number.isFinite(value) || value < Number(field.min) || value > Number(field.max) || (configId === "heart" && !Number.isInteger(value))) {
      metricRecordError.textContent = configId === "heart"
        ? "请输入 20 ~ 200 次/分范围内的整数心率"
        : `请填写${field.label}，范围 ${field.min}-${field.max}${field.unit}`;
      input?.focus();
      return;
    }
    values[field.key] = Number.isInteger(field.decimals) ? Number(formatMetricFieldValue(value, field)) : value;
    if (field.ownTime) {
      const timeInput = metricRecordFields.querySelector(`[data-metric-time="${field.key}"]`);
      if (!timeInput?.value) {
        metricRecordError.textContent = `请选择${field.label}检查时间`;
        timeInput?.focus();
        return;
      }
      values[`${field.key}Time`] = timeInput.value;
    }
  }
  if (!metricRecordTime.value) {
    metricRecordError.textContent = `请选择${metricRecordTimeLabelFor(metric.id)}`;
    return;
  }
  if (configId === "sugar" && !values.period) values.period = "空腹";
  const display = configId === "bp"
    ? `${values.systolic}/${values.diastolic}`
    : configId === "lipid"
      ? `TC ${formatLipidMetricValue("tc", values.tc)} / TG ${formatLipidMetricValue("tg", values.tg)} / LDL-C ${formatLipidMetricValue("ldl", values.ldl)}`
      : configId === "uric"
        ? formatUricValue(values.value)
      : typeof values.value === "number" ? formatMetricNumber(values.value) : String(values.value || "");
  const chartValue = configId === "bp" ? values.systolic : configId === "lipid" ? values.tg : typeof values.value === "number" ? values.value : metric.value;
  const status = metricStatus(metric.id, values);
  const record = {
    id: editingMetricRecordId && !editingMetricRecordId.startsWith("lipid-sample-") ? editingMetricRecordId : `metric-${Date.now()}`,
    time: metricRecordTime.value,
    display,
    chartValue,
    unit: metric.unit,
    status: status.text,
    attention: status.attention,
    values,
    note: ["heart", "uric", "lipid"].includes(configId) ? metricRecordNote.value.trim() : ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id][metric.id]) metricRecordsByPatient[currentPatient.id][metric.id] = [];
  const records = metricRecordsByPatient[currentPatient.id][metric.id];
  const editingIndex = records.findIndex((item) => item.id === editingMetricRecordId);
  if (editingIndex >= 0) records[editingIndex] = record;
  else records.unshift(record);
  editingMetricRecordId = "";
  if (metricRecordConfirm) metricRecordConfirm.textContent = "打卡";
  document.querySelector("#metricRecordInlineDelete")?.remove();
  updateScheduleMetricCheckin(metric.id, record);
  saveMetricRecords();
  metric.value = chartValue;
  metric.display = display;
  metric.status = status.text;
  metric.attention = status.attention;
  metric.values = [...metric.values, chartValue].slice(-7);
  selectedMetricDate = new Date(metricRecordTime.value);
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  showUnifiedCheckinSuccess(metricRecordSuccessLines(metric, record));
}

function deleteEditingMetricRecord() {
  const metric = getSelectedMetric();
  if (!editingMetricRecordId) return;
  if (editingMetricRecordId.startsWith("lipid-sample-")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id][metric.id]) deletedMetricRecordIdsByPatient[currentPatient.id][metric.id] = [];
    deletedMetricRecordIdsByPatient[currentPatient.id][metric.id].push(editingMetricRecordId);
  } else {
    removeMetricRecordById(metric.id, editingMetricRecordId);
  }
  editingMetricRecordId = "";
  selectedLipidRecordId = "";
  if (metricRecordConfirm) metricRecordConfirm.textContent = "打卡";
  document.querySelector("#metricRecordInlineDelete")?.remove();
  saveMetricRecords();
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  showToast("血脂记录已删除");
}

function getSelectedMetric() {
  const plan = focusPlanDashboards[selectedFocusPlan];
  return plan.metrics.find((metric) => metric.id === selectedFocusMetric) || plan.metrics[0];
}

function rangeMetricValues(metric, range) {
  const base = metric.values;
  if (range === "day") return base;
  const offsets = range === "week" ? [-0.8, 0.4, -0.2, 0.7, -0.4, 0.3, 0] : [1.1, 0.7, 0.3, -0.1, -0.4, 0];
  return offsets.map((offset, index) => {
    const source = base[Math.min(index, base.length - 1)];
    const value = source + offset * Math.max(Math.abs(source) * 0.012, 0.2);
    return Number(value.toFixed(source >= 100 ? 0 : 1));
  });
}

function metricRangeLabels(range, length) {
  const labels = {
    day: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "今天"],
    month: ["1日", "6日", "12日", "18日", "24日", "30日"]
  };
  return labels[range].slice(0, length);
}

function formatMetricNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function padDateNumber(value) {
  return String(value).padStart(2, "0");
}

function dateInputValue(date) {
  return `${date.getFullYear()}-${padDateNumber(date.getMonth() + 1)}-${padDateNumber(date.getDate())}`;
}

function metricDateLabel() {
  const year = selectedMetricDate.getFullYear();
  const month = selectedMetricDate.getMonth() + 1;
  const day = selectedMetricDate.getDate();
  if (selectedMetricRange === "day") return `${year}年${month}月${day}日`;
  if (selectedMetricRange === "month") return `${year}年${month}月`;
  const end = new Date(selectedMetricDate);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  const startText = start.getFullYear() === year
    ? `${start.getMonth() + 1}月${start.getDate()}日`
    : `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`;
  return `${startText} - ${month}月${day}日`;
}

function metricById(metricId) {
  return focusPlanDashboards[selectedFocusPlan]?.metrics.find((metric) => metric.id === metricId);
}

function metricBaseId(metricId) {
  if (metricId === "bp" || metricId.startsWith("bp-")) return "bp";
  if (metricId === "sugar" || metricId.startsWith("sugar-")) return "sugar";
  if (metricId === "heart" || metricId.startsWith("heart-")) return "heart";
  return metricId;
}

function weightRecordKey(time) {
  return String(time || "").replace(/[^0-9A-Za-z]/g, "");
}

function combinedWeightRecords() {
  const weightMetric = metricById("weight");
  const fatMetric = metricById("fat");
  if (!weightMetric) return [];
  const combined = new Map();
  allMetricRecords(weightMetric).forEach((record) => {
    const key = weightRecordKey(record.time);
    combined.set(key, {
      key,
      time: record.time,
      weight: record,
      fat: null,
      note: record.note || ""
    });
  });
  if (fatMetric) {
    allMetricRecords(fatMetric).forEach((record) => {
      const key = weightRecordKey(record.time);
      const current = combined.get(key);
      if (current) {
        current.fat = record;
        if (!current.note && record.note) current.note = record.note;
      }
    });
  }
  return [...combined.values()].sort((a, b) => new Date(b.time) - new Date(a.time));
}

function weightDefaultDayRecords() {
  const dateKey = dateInputValue(selectedMetricDate);
  const items = [
    { time: "07:20", weight: 68.7, fat: 24.8, note: "晨起测量" },
    { time: "08:20", weight: 68.5, fat: 28.4, note: "早餐前测量" },
    { time: "10:07", weight: 68.5, fat: 24.5, note: "上午测量" },
    { time: "14:30", weight: 68.8, fat: 25.1, note: "午后测量" },
    { time: "20:10", weight: 69.0, fat: 25.6, note: "晚间测量" }
  ];
  const deletedWeightIds = new Set(deletedMetricRecordIdsFor("weight"));
  const deletedFatIds = new Set(deletedMetricRecordIdsFor("fat"));
  return items.map((item, index) => {
    const time = `${dateKey}T${item.time}`;
    const weightId = `baseline-weight-day-${dateKey}-${index}`;
    const fatId = `baseline-fat-day-${dateKey}-${index}`;
    return {
      key: weightRecordKey(time),
      time,
      weight: deletedWeightIds.has(weightId) ? null : {
        id: weightId,
        time,
        display: formatMetricNumber(item.weight),
        chartValue: item.weight,
        unit: "kg",
        status: "正常",
        attention: false,
        note: item.note,
        baseline: true
      },
      fat: deletedFatIds.has(fatId) ? null : {
        id: fatId,
        time,
        display: formatMetricNumber(item.fat),
        chartValue: item.fat,
        unit: "%",
        status: "正常",
        attention: false,
        note: item.note,
        baseline: true
      },
      note: item.note
    };
  }).filter((record) => record.weight);
}

function currentDayWeightRecords() {
  const selectedKey = dateInputValue(selectedMetricDate);
  const saved = combinedWeightRecords().filter((record) => dateInputValue(new Date(record.time)) === selectedKey);
  const savedTimes = new Set(saved.map((record) => metricRecordDateParts(record.time).time));
  return [
    ...saved,
    ...weightDefaultDayRecords().filter((record) => !savedTimes.has(metricRecordDateParts(record.time).time))
  ].sort((a, b) => new Date(b.time) - new Date(a.time));
}

function weightRecordChangeText(record) {
  const records = combinedWeightRecords();
  const index = records.findIndex((item) => item.key === record.key);
  const previous = records[index + 1];
  const currentValue = Number(record.weight?.chartValue ?? record.weight?.display);
  const previousValue = Number(previous?.weight?.chartValue ?? previous?.weight?.display);
  if (!previous || !Number.isFinite(currentValue) || !Number.isFinite(previousValue)) return "暂无上次体重对比";
  const diff = currentValue - previousValue;
  if (Math.abs(diff) < 0.05) return "较上次体重持平";
  return `较上次体重${diff < 0 ? "下降" : "上升"} ${Math.abs(diff).toFixed(1)} kg`;
}

function weightDetailRecordByKey(recordKey) {
  return [...combinedWeightRecords(), ...weightDefaultDayRecords()].find((record) => record.key === recordKey);
}

function weightRecordInputTime(value) {
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return localDateTimeInputValue(date);
  return String(value || "").slice(0, 16);
}

function renderWeightMetricDetail(metric) {
  const records = combinedWeightRecords();
  const dayRecords = currentDayWeightRecords();
  const latest = dayRecords[0] || records[0];
  metricDetailPage?.classList.add("weight-detail-mode");
  metricDetailTitle.textContent = "体重详情";
  metricDetailValue.textContent = latest?.weight?.display || metric.display;
  metricDetailUnit.textContent = "kg";
  metricDetailStatus.textContent = "";
  metricDetailStatus.classList.remove("attention");
  const fatText = latest?.fat ? `体脂 ${latest.fat.display}%` : "体脂 --";
  const timeText = latest ? `最近记录 ${displayMetricRecordTime(latest.time)}` : "暂无记录";
  metricDetailTime.textContent = `${fatText} · ${timeText}`;
  if (weightDetailRecords) {
    weightDetailRecords.innerHTML = dayRecords.length ? dayRecords.map((record) => {
      const time = metricRecordDateParts(record.time).time;
      const fat = record.fat?.display ? `${record.fat.display}%` : "--";
      return `
        <article class="weight-detail-record-card" data-weight-record-key="${escapeAttr(record.key)}" role="button" tabindex="0" aria-label="查看${time}体重记录详情">
          <div>
            <strong>${escapeAttr(record.weight.display)}<em>kg</em></strong>
            <span>体脂率 ${escapeAttr(fat)}</span>
          </div>
          <time>${escapeAttr(time)}</time>
        </article>
      `;
    }).join("") : `
      <div class="weight-detail-empty">
        <strong>暂无当日记录</strong>
        <span>点击底部按钮记录体重和体脂。</span>
      </div>
    `;
  }
}

function openWeightRecordDetail(recordKey) {
  const record = weightDetailRecordByKey(recordKey);
  if (!record || !weightRecordDetailBody) return;
  selectedWeightRecordKey = record.key;
  const title = weightRecordDetailDialog?.querySelector("header h3");
  if (title) title.textContent = "记录详情";
  if (weightRecordSaveAction) weightRecordSaveAction.textContent = "保存修改";
  const fat = record.fat?.display || "";
  weightRecordDetailBody.innerHTML = `
    <label>
      <span>体重</span>
      <div><input id="weightRecordEditWeight" type="number" inputmode="decimal" min="1" max="500" step="0.1" value="${escapeAttr(record.weight.display)}"><em>kg</em></div>
    </label>
    <label>
      <span>体脂</span>
      <div><input id="weightRecordEditFat" type="number" inputmode="decimal" min="1" max="70" step="0.1" value="${escapeAttr(fat)}" placeholder="选填"><em>%</em></div>
    </label>
    <label>
      <span>称重时间</span>
      <input id="weightRecordEditTime" type="datetime-local" value="${escapeAttr(weightRecordInputTime(record.time))}">
    </label>
    <label class="weight-record-note-field">
      <span>备注</span>
      <textarea id="weightRecordEditNote" maxlength="100" placeholder="例如：晨起空腹、饭后、运动后等">${escapeAttr(record.note || "")}</textarea>
    </label>
    <p class="weight-record-edit-error" id="weightRecordEditError"></p>
  `;
  sheetMask.classList.add("active");
  weightRecordDetailDialog?.classList.add("active");
}

function upsertMetricRecord(metricId, oldRecord, nextRecord) {
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id][metricId]) metricRecordsByPatient[currentPatient.id][metricId] = [];
  if (oldRecord?.id?.startsWith("baseline-")) {
    removeMetricRecordById(metricId, oldRecord.id);
    metricRecordsByPatient[currentPatient.id][metricId].unshift(nextRecord);
    return;
  }
  const records = metricRecordsByPatient[currentPatient.id][metricId];
  const index = records.findIndex((item) => item.id === oldRecord?.id);
  if (index >= 0) records[index] = nextRecord;
  else records.unshift(nextRecord);
}

function saveSelectedWeightRecord() {
  if (selectedFocusMetric === "uric") {
    saveSelectedUricRecord();
    return;
  }
  const record = weightDetailRecordByKey(selectedWeightRecordKey);
  if (!record) return;
  const weightInput = document.querySelector("#weightRecordEditWeight");
  const fatInput = document.querySelector("#weightRecordEditFat");
  const timeInput = document.querySelector("#weightRecordEditTime");
  const noteInput = document.querySelector("#weightRecordEditNote");
  const error = document.querySelector("#weightRecordEditError");
  const weightValue = Number(weightInput?.value);
  const fatRaw = String(fatInput?.value || "").trim();
  const fatValue = fatRaw ? Number(fatRaw) : NaN;
  const time = timeInput?.value || "";
  if (!Number.isFinite(weightValue) || weightValue < 1 || weightValue > 500) {
    if (error) error.textContent = "请输入 1.0 ~ 500.0 kg 范围内的体重";
    weightInput?.focus();
    return;
  }
  if (fatRaw && (!Number.isFinite(fatValue) || fatValue < 1 || fatValue > 70)) {
    if (error) error.textContent = "请输入 1.0 ~ 70.0 % 范围内的体脂率";
    fatInput?.focus();
    return;
  }
  if (!time) {
    if (error) error.textContent = "请选择称重时间";
    timeInput?.focus();
    return;
  }
  const note = noteInput?.value.trim() || "";
  const weightStatus = metricStatus("weight", { value: weightValue });
  const nextWeightRecord = {
    ...(record.weight || {}),
    id: record.weight?.id?.startsWith("baseline-") ? `metric-weight-${Date.now()}` : record.weight?.id || `metric-weight-${Date.now()}`,
    time,
    display: formatMetricNumber(weightValue),
    chartValue: weightValue,
    unit: "kg",
    status: weightStatus.text,
    attention: weightStatus.attention,
    values: { value: weightValue },
    note
  };
  upsertMetricRecord("weight", record.weight, nextWeightRecord);
  if (fatRaw) {
    const fatStatus = metricStatus("fat", { value: fatValue });
    const nextFatRecord = {
      ...(record.fat || {}),
      id: record.fat?.id?.startsWith("baseline-") ? `metric-fat-${Date.now()}` : record.fat?.id || `metric-fat-${Date.now()}`,
      time,
      display: formatMetricNumber(fatValue),
      chartValue: fatValue,
      unit: "%",
      status: fatStatus.text,
      attention: fatStatus.attention,
      values: { value: fatValue },
      note
    };
    upsertMetricRecord("fat", record.fat, nextFatRecord);
  } else if (record.fat) {
    removeMetricRecordById("fat", record.fat.id);
  }
  saveMetricRecords();
  selectedMetricDate = new Date(time);
  selectedWeightRecordKey = weightRecordKey(time);
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  closeOverlays();
  showToast("体重记录已更新");
}

function removeMetricRecordById(metricId, recordId) {
  if (!recordId) return;
  if (recordId.startsWith("baseline-")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id][metricId]) deletedMetricRecordIdsByPatient[currentPatient.id][metricId] = [];
    deletedMetricRecordIdsByPatient[currentPatient.id][metricId].push(recordId);
    return;
  }
  if (metricRecordsByPatient[currentPatient.id]?.[metricId]) {
    metricRecordsByPatient[currentPatient.id][metricId] = metricRecordsByPatient[currentPatient.id][metricId]
      .filter((record) => record.id !== recordId);
  }
}

function deleteSelectedWeightRecord() {
  if (selectedFocusMetric === "uric") {
    deleteSelectedUricRecord();
    return;
  }
  const record = weightDetailRecordByKey(selectedWeightRecordKey);
  if (!record) return;
  removeMetricRecordById("weight", record.weight?.id);
  removeMetricRecordById("fat", record.fat?.id);
  saveMetricRecords();
  selectedWeightRecordKey = "";
  closeOverlays();
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  showToast("已删除该体重记录");
}

function heartDefaultDayRecords() {
  const dateKey = dateInputValue(selectedMetricDate);
  const items = [
    { time: "07:00", value: 72, note: "起床后测量" },
    { time: "08:30", value: 64, note: "晨起测量" },
    { time: "10:40", value: 69, note: "上午静息测量" },
    { time: "12:00", value: 76, note: "午餐前测量" },
    { time: "14:20", value: 78, note: "午休后测量" },
    { time: "15:00", value: 82, note: "下午测量" },
    { time: "18:10", value: 74, note: "晚餐前测量" },
    { time: "21:30", value: 70, note: "睡前测量" }
  ];
  const deletedIds = new Set(deletedMetricRecordIdsFor("heart"));
  return items.map((item, index) => ({
    id: `baseline-heart-day-${dateKey}-${index}`,
    time: `${dateKey}T${item.time}`,
    display: String(item.value),
    chartValue: item.value,
    unit: "bpm",
    status: "正常",
    attention: false,
    values: { value: item.value },
    note: item.note,
    baseline: true
  })).filter((record) => !deletedIds.has(record.id));
}

function heartDayRecords(metric) {
  const selectedKey = dateInputValue(selectedMetricDate);
  const saved = allMetricRecords(metric)
    .filter((record) => dateInputValue(new Date(record.time)) === selectedKey);
  const customSaved = saved.filter((record) => !record.id?.startsWith("baseline-"));
  const customTimes = new Set(customSaved.map((record) => metricRecordDateParts(record.time).time));
  const records = [
    ...customSaved,
    ...heartDefaultDayRecords().filter((record) => !customTimes.has(metricRecordDateParts(record.time).time))
  ];
  return records.sort((a, b) => new Date(b.time) - new Date(a.time));
}

function heartRecordById(recordId) {
  const metric = focusPlanDashboards[selectedFocusPlan].metrics.find((item) => item.id === "heart");
  if (!metric) return null;
  return heartDayRecords(metric).find((record) => record.id === recordId) || null;
}

function renderHeartMetricDetail(metric) {
  resetMetricDetailExtras("heart");
  metricDetailTitle.textContent = "心率打卡详情";
  const records = heartDayRecords(metric);
  const values = records.map((record) => Number(record.chartValue ?? record.values?.value ?? record.display)).filter(Number.isFinite);
  const average = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : "--";
  const minRecord = records.reduce((min, record) => Number(record.chartValue) < Number(min?.chartValue ?? Infinity) ? record : min, null);
  const maxRecord = records.reduce((max, record) => Number(record.chartValue) > Number(max?.chartValue ?? -Infinity) ? record : max, null);
  if (heartOverviewCard) {
    heartOverviewCard.hidden = false;
    heartOverviewCard.innerHTML = `
      <div class="heart-overview-grid">
        <article><span>平均心率</span><strong>${escapeAttr(String(average))}</strong><em>bpm</em><small>${escapeAttr(records[0] ? metricRecordDateParts(records[0].time).time : "--:--")}</small></article>
        <article><span>最低心率</span><strong>${escapeAttr(minRecord?.display || "--")}</strong><em>bpm</em><small>${escapeAttr(minRecord ? metricRecordDateParts(minRecord.time).time : "--:--")}</small></article>
        <article><span>最高心率</span><strong>${escapeAttr(maxRecord?.display || "--")}</strong><em>bpm</em><small>${escapeAttr(maxRecord ? metricRecordDateParts(maxRecord.time).time : "--:--")}</small></article>
      </div>
    `;
  }
  if (heartRecordsSection) heartRecordsSection.hidden = false;
  if (heartRecordsList) {
    heartRecordsList.innerHTML = records.length ? records.map((record) => {
      const parts = metricRecordDateParts(record.time);
      return `
        <button class="heart-record-card" type="button" data-heart-record-id="${escapeAttr(record.id)}">
          <i class="heart-record-icon" aria-hidden="true"></i>
          <div class="heart-record-main">
            <strong>${escapeAttr(record.display)}<em>bpm</em></strong>
            <span>${escapeAttr(parts.time)}</span>
          </div>
        </button>
      `;
    }).join("") : `<div class="weight-detail-empty"><strong>暂无心率记录</strong><span>点击底部按钮记录心率。</span></div>`;
  }
}

function openHeartRecordDetail(recordId) {
  const record = heartRecordById(recordId);
  if (!record || !heartRecordDetailBody) return;
  selectedHeartRecordId = record.id;
  heartRecordDetailBody.innerHTML = `
    <label>
      <span>心率</span>
      <div><input id="heartRecordEditValue" type="number" inputmode="numeric" pattern="[0-9]*" min="20" max="200" step="1" value="${escapeAttr(record.display)}"><em>bpm</em></div>
    </label>
    <label>
      <span>心率测量时间</span>
      <input id="heartRecordEditTime" type="time" value="${escapeAttr(metricRecordDateParts(record.time).time)}">
    </label>
    <label class="weight-record-note-field">
      <span>备注</span>
      <textarea id="heartRecordEditNote" maxlength="100" placeholder="记录运动后、静息、心慌、服药后等情况">${escapeAttr(record.note || "")}</textarea>
    </label>
    <p class="weight-record-edit-error" id="heartRecordEditError"></p>
  `;
  sheetMask.classList.add("active");
  heartRecordDetailDialog?.classList.add("active");
}

function saveSelectedHeartRecord() {
  const record = heartRecordById(selectedHeartRecordId);
  if (!record) return;
  const valueInput = document.querySelector("#heartRecordEditValue");
  const timeInput = document.querySelector("#heartRecordEditTime");
  const noteInput = document.querySelector("#heartRecordEditNote");
  const error = document.querySelector("#heartRecordEditError");
  const value = Number(valueInput?.value);
  const time = timeInput?.value || "";
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 20 || value > 200) {
    if (error) error.textContent = "请输入 20 ~ 200 bpm 范围内的整数心率";
    valueInput?.focus();
    return;
  }
  if (!time) {
    if (error) error.textContent = "请选择心率测量时间";
    timeInput?.focus();
    return;
  }
  const recordDate = new Date(record.time);
  const baseDate = Number.isNaN(recordDate.getTime()) ? dateInputValue(new Date()) : dateInputValue(recordDate);
  const nextTime = time.length === 5 ? `${baseDate}T${time}` : time;
  const status = metricStatus("heart", { value });
  const nextRecord = {
    ...record,
    id: record.id?.startsWith("baseline-") ? `metric-heart-${Date.now()}` : record.id || `metric-heart-${Date.now()}`,
    time: nextTime,
    display: String(Math.round(value)),
    chartValue: Math.round(value),
    unit: "bpm",
    status: status.text,
    attention: status.attention,
    values: { value: Math.round(value) },
    note: noteInput?.value.trim() || ""
  };
  upsertMetricRecord("heart", record, nextRecord);
  saveMetricRecords();
  selectedMetricDate = new Date(nextTime);
  selectedHeartRecordId = nextRecord.id;
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const heartMetric = focusPlanDashboards[selectedFocusPlan].metrics.find((item) => item.id === "heart");
  const latestHeartRecord = heartMetric ? allMetricRecords(heartMetric)[0] : null;
  if (latestHeartRecord) updateScheduleMetricCheckin("heart", latestHeartRecord);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  closeOverlays();
  showToast("心率记录已更新");
}

function deleteSelectedHeartRecord() {
  const record = heartRecordById(selectedHeartRecordId);
  if (!record) return;
  removeMetricRecordById("heart", record.id);
  saveMetricRecords();
  selectedHeartRecordId = "";
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const heartMetric = focusPlanDashboards[selectedFocusPlan].metrics.find((item) => item.id === "heart");
  const latestHeartRecord = heartMetric ? allMetricRecords(heartMetric)[0] : null;
  if (latestHeartRecord) updateScheduleMetricCheckin("heart", latestHeartRecord);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  closeOverlays();
  showToast("已删除该心率记录");
}

function shiftMetricDate(step) {
  const next = new Date(selectedMetricDate);
  if (selectedMetricRange === "day") next.setDate(next.getDate() + step);
  if (selectedMetricRange === "week") next.setDate(next.getDate() + step * 7);
  if (selectedMetricRange === "month") next.setMonth(next.getMonth() + step);
  selectedMetricDate = next;
  renderMetricDetail();
}

function ensurePressureDetailExtras() {
  let pulseAverage = document.querySelector("#metricPulseAverageBlock");
  if (!pulseAverage && metricAverageCard && metricAllRecords) {
    pulseAverage = document.createElement("div");
    pulseAverage.id = "metricPulseAverageBlock";
    pulseAverage.className = "metric-pulse-average";
    pulseAverage.innerHTML = `<span>平均脉搏 bpm</span><strong id="metricStatPulseAverage">--</strong>`;
    metricAverageCard.insertBefore(pulseAverage, metricAllRecords);
  }

  let averageHead = document.querySelector("#pressureAverageHead");
  if (!averageHead && metricAverageCard) {
    averageHead = document.createElement("div");
    averageHead.id = "pressureAverageHead";
    averageHead.className = "pressure-average-head";
    averageHead.innerHTML = `<span id="pressureAverageDate"></span>`;
    metricAverageCard.prepend(averageHead);
  }

  let addDevice = document.querySelector("#pressureAddDevice");
  if (!addDevice && metricDetailActions && metricRecordEntry) {
    addDevice = document.createElement("button");
    addDevice.id = "pressureAddDevice";
    addDevice.className = "pressure-add-device";
    addDevice.type = "button";
    addDevice.textContent = "添加设备";
    addDevice.addEventListener("click", () => showToast("设备绑定功能待接入"));
    metricDetailActions.insertBefore(addDevice, metricRecordEntry);
  }
}

function applyPressureDetailLayout(isDataDetail) {
  if (!metricDetailPage || !metricRangeTabs || !metricDateNav || !metricDetailSummary || !metricTrendCard || !metricAverageCard) return;
  let panel = document.querySelector("#pressureDataPanel");
  if (isDataDetail) {
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "pressureDataPanel";
      panel.className = "pressure-data-panel";
      const nav = metricDetailPage.querySelector(".sub-nav");
      metricDetailPage.insertBefore(panel, nav?.nextSibling || metricDetailPage.firstChild);
    }
    panel.hidden = false;
    panel.append(metricRangeTabs, metricDateNav, metricDetailSummary, metricTrendCard, metricAverageCard);
    return;
  }
  if (panel) panel.hidden = true;
  const anchor = weightDetailRecordsSection || metricDetailActions;
  metricDetailPage.insertBefore(metricDetailSummary, anchor);
  metricDetailPage.insertBefore(metricRangeTabs, anchor);
  metricDetailPage.insertBefore(metricDateNav, anchor);
  metricDetailPage.insertBefore(metricTrendCard, anchor);
  metricDetailPage.insertBefore(metricAverageCard, anchor);
}

function resetMetricDetailExtras(metricId) {
  const isPressure = metricId === "bp";
  const isSugar = metricId === "sugar";
  const isWeight = metricId === "weight";
  const isHeart = metricId === "heart";
  const isWaist = metricId === "waist";
  document.querySelector("#metricPulseAverageBlock")?.toggleAttribute("hidden", !isPressure);
  document.querySelector("#pressureAverageHead")?.toggleAttribute("hidden", !(isPressure || isSugar));
  document.querySelector("#pressureAddDevice")?.toggleAttribute("hidden", !(isPressure || isSugar));
  if (heartOverviewCard) heartOverviewCard.hidden = !isHeart;
  if (heartRecordsSection) heartRecordsSection.hidden = !isHeart;
  metricAllRecords && (metricAllRecords.textContent = (isPressure || isSugar) ? "全部数据" : "全部记录");
  metricRecordEntry && (metricRecordEntry.textContent = isWeight ? "记体重" : isWaist ? "记录腰围" : isHeart ? "＋ 记录心率" : (isPressure || isSugar) ? "记录数据" : "记录指标");
  const averageLabel = metricAverageCard?.querySelector(":scope > div:not(.pressure-average-head):not(.metric-pulse-average) span");
  if (averageLabel) averageLabel.textContent = isPressure ? "平均血压值 mmHg" : isSugar ? "最高血糖" : "平均值";
  applyPressureDetailLayout(isPressure || isSugar);
}

function pressureRecordParts(record) {
  if (!record) return null;
  const values = record.values || {};
  let systolic = Number(values.systolic);
  let diastolic = Number(values.diastolic);
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    const match = String(record.display || "").match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    systolic = Number(match?.[1]);
    diastolic = Number(match?.[2]);
  }
  const pulse = Number(values.pulse);
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) return null;
  return {
    systolic,
    diastolic,
    pulse: Number.isFinite(pulse) ? pulse : null,
    time: record.time
  };
}

function pressureAverage(parts, key) {
  const values = parts.map((item) => item[key]).filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function pressurePairText(systolic, diastolic) {
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) return "";
  return `${Math.round(systolic)}/${Math.round(diastolic)}`;
}

function pressureRangeValue(parts, type) {
  if (!parts.length) return "";
  const systolicValues = parts.map((item) => item.systolic).filter((value) => Number.isFinite(value));
  const diastolicValues = parts.map((item) => item.diastolic).filter((value) => Number.isFinite(value));
  if (!systolicValues.length || !diastolicValues.length) return "";
  if (type === "min") return pressurePairText(Math.min(...systolicValues), Math.min(...diastolicValues));
  if (type === "max") return pressurePairText(Math.max(...systolicValues), Math.max(...diastolicValues));
  return pressurePairText(pressureAverage(parts, "systolic"), pressureAverage(parts, "diastolic"));
}

function renderPressureStatSummary(parts) {
  if (!metricAverageCard || !metricAllRecords) return;
  metricAverageCard.querySelectorAll(":scope > div:not(.pressure-average-head)").forEach((node) => node.remove());
  const items = [
    { label: "最低血压", value: pressureRangeValue(parts, "min") },
    { label: "最高血压", value: pressureRangeValue(parts, "max") },
    { label: "平均血压", value: pressureRangeValue(parts, "avg") }
  ].filter((item) => item.value);
  const grid = document.createElement("div");
  grid.className = "pressure-stat-grid";
  grid.innerHTML = items.map((item) => `
    <article>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
  metricAverageCard.insertBefore(grid, metricAllRecords);
}

function pressurePartsForSelectedRange(records) {
  const selected = new Date(selectedMetricDate);
  let start = new Date(selected);
  let end = new Date(selected);
  if (selectedMetricRange === "day") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (selectedMetricRange === "week") {
    start.setDate(selected.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    start = new Date(selected.getFullYear(), selected.getMonth(), 1);
    end = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 23, 59, 59, 999);
  }
  return records
    .filter((record) => {
      const date = new Date(record.time);
      return !Number.isNaN(date.getTime()) && date >= start && date <= end;
    })
    .map(pressureRecordParts)
    .filter(Boolean)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
}

function renderPressureChart(parts) {
  const minValue = 60;
  const maxValue = 160;
  const chartTop = 28;
  const chartHeight = 128;
  const selected = new Date(selectedMetricDate);
  const weekStart = new Date(selected);
  weekStart.setDate(selected.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const monthDays = new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate();
  const xForTime = (time) => {
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return 42;
    if (selectedMetricRange === "week") {
      const dayOffset = Math.max(0, Math.min(6, Math.floor((date - weekStart) / 86400000)));
      return 42 + (dayOffset / 6) * 266;
    }
    if (selectedMetricRange === "month") {
      return 42 + ((date.getDate() - 1) / Math.max(monthDays - 1, 1)) * 266;
    }
    return 42 + ((date.getHours() + date.getMinutes() / 60) / 24) * 266;
  };
  const axisLabels = selectedMetricRange === "day"
    ? ["00:00", "06:00", "12:00", "18:00", "24:00"]
    : selectedMetricRange === "week"
      ? Array.from({ length: 7 }, (_, index) => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + index);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        })
      : ["1日", "7日", "14日", "21日", `${monthDays}日`];
  const axisXs = selectedMetricRange === "week"
    ? [42, 86, 130, 174, 218, 262, 308]
    : [48, 114, 180, 246, 304];
  const yForValue = (value) => chartTop + ((maxValue - value) / (maxValue - minValue)) * chartHeight;
  const systolicPoints = parts.map((item) => ({ x: xForTime(item.time), y: yForValue(item.systolic) }));
  const diastolicPoints = parts.map((item) => ({ x: xForTime(item.time), y: yForValue(item.diastolic) }));
  const linePath = (points) => points.length > 1 ? points.map((point) => `${point.x},${point.y}`).join(" ") : "";
  const dotList = (points, color) => points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="${color}"/>`).join("");
  return `
    <svg viewBox="0 0 340 210" role="img" aria-label="血压数据趋势">
      <path d="M42 28H310M42 60H310M42 92H310M42 124H310M42 156H310" stroke="#d8dee9" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="14" y="32">160</text><text x="14" y="64">140</text><text x="14" y="96">120</text><text x="18" y="128">100</text><text x="22" y="160">80</text>
      <line x1="42" x2="310" y1="${yForValue(140)}" y2="${yForValue(140)}" stroke="#ff8a00" stroke-width="1.2" stroke-dasharray="4 3"/>
      <line x1="42" x2="310" y1="${yForValue(90)}" y2="${yForValue(90)}" stroke="#00957f" stroke-width="1.2" stroke-dasharray="4 3"/>
      <text x="314" y="${yForValue(140) + 4}" fill="#ff8a00">140</text>
      <text x="314" y="${yForValue(90) + 4}" fill="#00957f">90</text>
      ${systolicPoints.length > 1 ? `<polyline points="${linePath(systolicPoints)}" fill="none" stroke="#ff8a00" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
      ${diastolicPoints.length > 1 ? `<polyline points="${linePath(diastolicPoints)}" fill="none" stroke="#00957f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
      ${dotList(systolicPoints, "#ff8a00")}
      ${dotList(diastolicPoints, "#00957f")}
      <path d="M42 156H310" stroke="#cfd6e2" stroke-width="1"/>
      ${axisLabels.map((label, index) => `<text x="${axisXs[index]}" y="180">${label}</text>`).join("")}
      <circle cx="112" cy="198" r="4" fill="#ff8a00"/><text x="124" y="202" fill="#ff8a00">高压值</text>
      <circle cx="202" cy="198" r="4" fill="#00957f"/><text x="214" y="202" fill="#00957f">低压值</text>
    </svg>
  `;
}

function renderPressureMetricDetail(metric) {
  ensurePressureDetailExtras();
  resetMetricDetailExtras("bp");
  const records = allMetricRecords(metric);
  const rangeParts = pressurePartsForSelectedRange(records);
  const latest = rangeParts.at(-1) || pressureRecordParts(records[0]);
  const chartParts = rangeParts.length ? rangeParts : latest ? [latest] : [];
  const avgSystolic = pressureAverage(chartParts, "systolic");
  const avgDiastolic = pressureAverage(chartParts, "diastolic");

  metricDetailTitle.textContent = "全部数据";
  metricDetailValue.textContent = latest ? `${latest.systolic}/${latest.diastolic}` : "--/--";
  metricDetailUnit.textContent = "mmHg";
  metricDetailStatus.textContent = "";
  metricDetailStatus.classList.remove("attention");
  metricDetailTime.textContent = latest?.pulse ? `脉搏 ${latest.pulse} bpm` : "";
  metricDateCurrent.textContent = metricDateLabel();
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = "";
  metricStatAverage.textContent = avgSystolic && avgDiastolic ? `${avgSystolic}/${avgDiastolic}` : "--/--";
  document.querySelector("#pressureAverageDate") && (document.querySelector("#pressureAverageDate").textContent = metricDateCurrent.textContent);
  document.querySelector("#metricPulseAverageBlock")?.setAttribute("hidden", "");
  renderPressureStatSummary(chartParts);
  metricLineChart.innerHTML = renderPressureChart(chartParts);
}

function sugarRecordParts(record) {
  if (!record) return null;
  const value = Number(record.values?.value ?? record.chartValue ?? record.display);
  if (!Number.isFinite(value)) return null;
  return { value, time: record.time };
}

function renderSugarStatSummary(parts) {
  if (!metricAverageCard || !metricAllRecords) return;
  metricAverageCard.querySelectorAll(":scope > div:not(.pressure-average-head)").forEach((node) => node.remove());
  const values = parts.map((item) => item.value).filter((value) => Number.isFinite(value));
  const max = values.length ? Math.max(...values) : null;
  const min = values.length ? Math.min(...values) : null;
  const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const items = [
    { label: "最高血糖", value: Number.isFinite(max) ? formatMetricNumber(max) : "" },
    { label: "最低血糖", value: Number.isFinite(min) ? formatMetricNumber(min) : "" },
    { label: "平均血糖", value: Number.isFinite(avg) ? formatMetricNumber(avg) : "" }
  ].filter((item) => item.value);
  const grid = document.createElement("div");
  grid.className = "metric-stat-grid sugar-stat-grid";
  grid.innerHTML = items.map((item) => `
    <article>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
  metricAverageCard.insertBefore(grid, metricAllRecords);
}

function renderSugarChart(parts) {
  const maxValue = 35;
  const chartTop = 20;
  const chartHeight = 168;
  const xForTime = (time) => {
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return 208;
    return 42 + ((date.getHours() + date.getMinutes() / 60) / 24) * 284;
  };
  const yForValue = (value) => chartTop + ((maxValue - value) / maxValue) * chartHeight;
  return `
    <svg viewBox="0 0 360 250" role="img" aria-label="血糖值趋势">
      <path d="M42 20H326M42 44H326M42 68H326M42 92H326M42 116H326M42 140H326M42 164H326M42 188H326" stroke="#d8dee9" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="18" y="24">35</text><text x="18" y="48">30</text><text x="18" y="72">25</text><text x="18" y="96">20</text><text x="18" y="120">15</text><text x="18" y="144">10</text><text x="22" y="168">5</text><text x="22" y="192">0</text>
      ${parts.map((item) => `<circle cx="${xForTime(item.time)}" cy="${yForValue(item.value)}" r="3.5" fill="#00957f"/>`).join("")}
      <text x="52" y="210">00:00</text><text x="126" y="210">06:00</text><text x="202" y="210">12:00</text><text x="276" y="210">18:00</text><text x="320" y="210">24:00</text>
      <circle cx="166" cy="232" r="4" fill="#00957f"/><text x="178" y="236" fill="#00957f">血糖值</text>
    </svg>
  `;
}

function renderSugarMetricDetail(metric) {
  ensurePressureDetailExtras();
  resetMetricDetailExtras("sugar");
  const records = allMetricRecords(metric);
  const selectedKey = dateInputValue(selectedMetricDate);
  let dayParts = records
    .filter((record) => dateInputValue(new Date(record.time)) === selectedKey)
    .map(sugarRecordParts)
    .filter(Boolean)
    .sort((a, b) => new Date(a.time) - new Date(b.time));
  if (!dayParts.length) {
    const fallback = records.map(sugarRecordParts).filter(Boolean)[0] || { value: Number(metric.value || 5), time: localDateTimeInputValue(selectedMetricDate) };
    dayParts = [fallback];
  }
  const latest = dayParts.at(-1);
  const dateLabel = `${selectedMetricDate.getFullYear()}?${padDateNumber(selectedMetricDate.getMonth() + 1)}?${padDateNumber(selectedMetricDate.getDate())}?`;

  metricDetailTitle.textContent = "????";
  metricDetailValue.textContent = formatMetricNumber(latest.value);
  metricDetailUnit.textContent = "mmol/L";
  metricDetailStatus.textContent = "";
  metricDetailStatus.classList.remove("attention");
  metricDetailTime.textContent = "";
  metricDateCurrent.textContent = dateLabel;
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = "";
  document.querySelector("#pressureAverageDate") && (document.querySelector("#pressureAverageDate").textContent = dateLabel);
  document.querySelector("#metricPulseAverageBlock")?.setAttribute("hidden", "");
  renderSugarStatSummary(dayParts);
  metricLineChart.innerHTML = renderSugarChart(dayParts);
}

function sampleWaistRecords() {
  return [
    { id: "waist-sample-0", time: "2026-06-22T08:30", display: "82", chartValue: 82, unit: "cm", note: "晨起空腹" },
    { id: "waist-sample-1", time: "2026-06-20T21:10", display: "83", chartValue: 83, unit: "cm", note: "晚饭后" },
    { id: "waist-sample-2", time: "2026-06-18T07:50", display: "81", chartValue: 81, unit: "cm", note: "空腹" }
  ];
}

function waistRecordEntries() {
  const deletedIds = new Set(deletedMetricRecordIdsFor("waist"));
  const saved = metricRecordsFor("waist").map((record) => ({
    id: record.id,
    time: record.time,
    display: record.display || formatMetricNumber(Number(record.values?.value ?? record.chartValue)),
    chartValue: Number(record.values?.value ?? record.chartValue ?? record.display),
    unit: record.unit || "cm",
    note: record.note || ""
  })).filter((record) => Number.isFinite(record.chartValue) && !deletedIds.has(record.id));
  return (saved.length ? saved : sampleWaistRecords().filter((record) => !deletedIds.has(record.id)))
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

function waistRecordById(recordId) {
  return waistRecordEntries().find((record) => record.id === recordId);
}

function waistFullTimeText(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "").replace("T", " ");
  return `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function waistRecordCard(record) {
  return `
    <button class="waist-record-card" type="button" data-waist-record="${escapeAttr(record.id)}" aria-label="查看${escapeAttr(record.display)}厘米腰围记录详情">
      <strong>${escapeAttr(record.display)} <em>cm</em></strong>
      <span>${escapeAttr(waistFullTimeText(record.time))}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function ensureWaistDetailPanel() {
  let panel = document.querySelector("#waistDetailPanel");
  if (!panel && metricDetailPage) {
    panel = document.createElement("section");
    panel.id = "waistDetailPanel";
    panel.className = "waist-detail-panel";
    const nav = metricDetailPage.querySelector(".sub-nav");
    metricDetailPage.insertBefore(panel, nav?.nextSibling || metricDetailPage.firstChild);
  }
  let trendButton = document.querySelector("#waistTrendButton");
  const nav = metricDetailPage?.querySelector(".sub-nav");
  if (!trendButton && nav) {
    trendButton = document.createElement("button");
    trendButton.id = "waistTrendButton";
    trendButton.className = "waist-trend-button";
    trendButton.type = "button";
    trendButton.setAttribute("aria-label", "查看腰围趋势");
    trendButton.addEventListener("click", () => showToast("腰围趋势功能待接入"));
    nav.append(trendButton);
  }
  return panel;
}

function renderWaistListDetail(metric) {
  const records = waistRecordEntries();
  const latest = records[0] || sampleWaistRecords()[0];
  selectedWaistRecordId = latest.id;
  metricDetailTitle.textContent = "腰围详情";
  const panel = ensureWaistDetailPanel();
  if (!panel) return;
  document.querySelector("#waistTrendButton")?.removeAttribute("hidden");
  panel.innerHTML = `
    <section class="waist-current-card">
      <p>当前腰围</p>
      <strong>${escapeAttr(latest.display)} <em>cm</em></strong>
      <span>腰围测量时间：${escapeAttr(waistFullTimeText(latest.time))}</span>
    </section>
    <section class="waist-record-list">
      <h2>腰围记录</h2>
      <div>${records.map(waistRecordCard).join("")}</div>
    </section>
    <button class="waist-record-add" type="button" id="waistRecordAdd">＋ 记录腰围</button>
  `;
  panel.querySelectorAll("[data-waist-record]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedWaistRecordId = button.dataset.waistRecord;
      openWaistCheckinSheet(selectedWaistRecordId);
    });
  });
  panel.querySelector("#waistRecordAdd")?.addEventListener("click", () => openWaistCheckinSheet());
}

function renderWaistRecordDetail(metric) {
  const records = waistRecordEntries();
  const record = records.find((item) => item.id === selectedWaistRecordId) || records[0] || sampleWaistRecords()[0];
  selectedWaistRecordId = record.id;
  metricDetailTitle.textContent = "腰围记录详情";
  const panel = ensureWaistDetailPanel();
  if (!panel) return;
  document.querySelector("#waistTrendButton")?.setAttribute("hidden", "");
  panel.innerHTML = `
    <section class="waist-single-card">
      <div>
        <p>腰围</p>
        <strong>${escapeAttr(record.display)} <em>cm</em></strong>
      </div>
      <div>
        <p>腰围测量时间</p>
        <span>${escapeAttr(waistFullTimeText(record.time))}</span>
      </div>
      <div>
        <p>备注</p>
        <span>${escapeAttr(record.note || "暂无备注")}</span>
      </div>
    </section>
    <footer class="waist-record-actions">
      <button class="waist-record-edit" type="button" id="waistRecordEdit">编辑</button>
      <button class="waist-record-delete" type="button" id="waistRecordDelete">删除</button>
    </footer>
  `;
  panel.querySelector("#waistRecordEdit")?.addEventListener("click", () => openWaistCheckinSheet(record.id));
  panel.querySelector("#waistRecordDelete")?.addEventListener("click", deleteSelectedWaistRecord);
}

function renderWaistMetricDetail(metric) {
  resetMetricDetailExtras("waist");
  if (waistDetailMode === "record") renderWaistRecordDetail(metric);
  else renderWaistListDetail(metric);
}

function deleteSelectedWaistRecord() {
  if (!selectedWaistRecordId) {
    showToast("暂无可删除的腰围记录");
    return;
  }
  if (selectedWaistRecordId.startsWith("waist-sample")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id].waist) deletedMetricRecordIdsByPatient[currentPatient.id].waist = [];
    deletedMetricRecordIdsByPatient[currentPatient.id].waist.push(selectedWaistRecordId);
  } else {
    removeMetricRecordById("waist", selectedWaistRecordId);
  }
  selectedWaistRecordId = "";
  waistDetailMode = "list";
  saveMetricRecords();
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  showToast("腰围记录已删除");
}

function formatLipidValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "--";
}

function lipidStatusText(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? "偏高" : "";
}

function lipidDetailRecord(metric) {
  const saved = metricRecordsFor(metric.id)[0];
  if (saved?.values) return saved;
  return {
    id: "lipid-sample-record",
    time: "2026-06-22T08:30",
    values: {
      tc: 5.2,
      tg: 1.8,
      hdl: 1.2,
      ldl: 3.1,
      sdldl: 0.85,
      sdldlTime: "2026-06-22T08:30",
      oxldl: 0.45,
      oxldlTime: "2026-06-18T07:40"
    },
    note: "空腹抽血，早上8点左右检查。"
  };
}

function lipidSampleRecords() {
  return [
    {
      id: "lipid-sample-six-indicators",
      time: "2026-06-23T18:07",
      values: { tc: 5.2, tg: 1.8, hdl: 1.2, ldl: 3.1, sdldl: 0.85, oxldl: 0.45 },
      note: "六项血脂指标示例"
    },
    {
      id: "lipid-sample-0830",
      time: "2026-06-23T08:30",
      values: { tc: 4.8, tg: 1.6, hdl: 1.3, ldl: 2.8 },
      note: ""
    }
  ];
}

function lipidDetailRecords(metric) {
  const deletedIds = new Set(deletedMetricRecordIdsFor(metric.id));
  const saved = metricRecordsFor(metric.id).filter((record) => record?.values);
  const samples = lipidSampleRecords();
  const sixIndicatorSample = samples.find((record) => record.id === "lipid-sample-six-indicators");
  const sixIndicatorTime = sixIndicatorSample ? lipidShortTimeText(sixIndicatorSample.time) : "";
  const savedTimes = new Set(saved.map((record) => lipidShortTimeText(record.time)));
  const records = [
    ...(sixIndicatorSample ? [sixIndicatorSample] : []),
    ...saved.filter((record) => !sixIndicatorTime || lipidShortTimeText(record.time) !== sixIndicatorTime),
    ...samples.filter((record) => record.id !== "lipid-sample-six-indicators" && !savedTimes.has(lipidShortTimeText(record.time)))
  ];
  return records
    .filter((record) => !deletedIds.has(record.id))
    .map((record) => ({
      ...record,
      values: { ...record.values },
      sortTime: new Date(record.time).getTime()
    }))
    .sort((a, b) => (Number.isFinite(b.sortTime) ? b.sortTime : 0) - (Number.isFinite(a.sortTime) ? a.sortTime : 0))
    .slice(0, 4);
}

function lipidShortTimeText(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function lipidResultValue(value, digits = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits).replace(/\.0$/, "") : "--";
}

function lipidBasicCell(code, value) {
  return `
    <div class="lipid-result-cell">
      <span>${code}</span>
      <strong>${lipidResultValue(value, 2)}</strong>
      <em>mmol/L</em>
    </div>
  `;
}

function lipidExtraCell(code, value, unit = "mmol/L") {
  const hasValue = value != null && value !== "";
  if (!hasValue) return "";
  return `
    <div class="lipid-extra-cell">
      <span>${code}</span>
      <strong>${unit === "U/L" ? lipidResultValue(value, 0) : lipidResultValue(value, 2)} <em>${unit}</em></strong>
    </div>
  `;
}

function lipidRecordCard(record, index) {
  const values = record.values || {};
  const extraItems = [
    lipidExtraCell("sdLDL-C", values.sdldl),
    lipidExtraCell("oxLDL-C", values.oxldl, "ng/ml")
  ].filter(Boolean);
  return `
    <article class="lipid-today-card" data-lipid-record="${escapeAttr(record.id)}" role="button" tabindex="0">
      <header>
        <div><i aria-hidden="true"></i><strong>${lipidShortTimeText(record.time)}</strong></div>
        <b aria-hidden="true"></b>
      </header>
      <section class="lipid-basic-result">
        <h3>基础血脂 <span>（4项）</span></h3>
        <div>
          ${lipidBasicCell("TC", values.tc)}
          ${lipidBasicCell("TG", values.tg)}
          ${lipidBasicCell("HDL-C", values.hdl)}
          ${lipidBasicCell("LDL-C", values.ldl)}
        </div>
      </section>
      ${extraItems.length ? `
        <section class="lipid-extra-result">
          <h3>扩展血脂 <span>（${extraItems.length}项）</span></h3>
          <div>${extraItems.join("")}</div>
        </section>
      ` : ""}
    </article>
  `;
}

function ensureLipidDetailPanel() {
  let panel = document.querySelector("#lipidDetailPanel");
  if (!panel && metricDetailPage) {
    panel = document.createElement("section");
    panel.id = "lipidDetailPanel";
    panel.className = "lipid-detail-panel";
    const nav = metricDetailPage.querySelector(".sub-nav");
    metricDetailPage.insertBefore(panel, nav?.nextSibling || metricDetailPage.firstChild);
  }
  let headerDelete = document.querySelector("#lipidHeaderDelete");
  const nav = metricDetailPage?.querySelector(".sub-nav");
  if (!headerDelete && nav) {
    headerDelete = document.createElement("button");
    headerDelete.id = "lipidHeaderDelete";
    headerDelete.className = "lipid-header-more";
    headerDelete.type = "button";
    headerDelete.textContent = "...";
    headerDelete.setAttribute("aria-label", "更多");
    nav.append(headerDelete);
  }
  headerDelete?.setAttribute("hidden", "");
  return panel;
}

function renderLipidMetricDetail(metric) {
  resetMetricDetailExtras("lipid");
  const records = lipidDetailRecords(metric);
  const latest = records[0] || lipidSampleRecords()[0];
  selectedLipidRecordId = latest.id;
  const panel = ensureLipidDetailPanel();
  if (!panel) return;
  metricDetailTitle.textContent = "血脂详情";
  panel.innerHTML = `
    <section class="lipid-today-section">
      <div class="lipid-today-list">${records.map(lipidRecordCard).join("")}</div>
    </section>
    <button class="lipid-detail-entry" type="button" id="lipidDetailEntry">＋ 记血脂</button>
  `;
  panel.querySelector("#lipidDetailEntry")?.addEventListener("click", () => {
    selectedFocusMetric = "lipid";
    openMetricRecordSheet();
  });
  panel.querySelectorAll(".lipid-today-card").forEach((card) => {
    const selectRecord = () => {
      selectedLipidRecordId = card.dataset.lipidRecord || selectedLipidRecordId;
      selectedFocusMetric = "lipid";
      openMetricRecordSheet(selectedLipidRecordId);
    };
    card.addEventListener("click", selectRecord);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRecord();
      }
    });
  });
}

function deleteSelectedLipidRecord() {
  if (!selectedLipidRecordId || selectedLipidRecordId === "lipid-sample-record") {
    showToast("暂无可删除的血脂记录");
    return;
  }
  removeMetricRecordById("lipid", selectedLipidRecordId);
  selectedLipidRecordId = "";
  saveMetricRecords();
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  showToast("血脂打卡记录已删除");
}

function formatUricValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2).replace(/\.?0+$/, "") : "--";
}

function sampleUricRecords() {
  return [
    { id: "uric-sample-0", time: "2026-06-22T08:30", value: 362, note: "空腹检测" },
    { id: "uric-sample-1", time: "2026-06-20T16:00", value: 355, note: "复测" },
    { id: "uric-sample-2", time: "2026-06-15T09:00", value: 378, note: "体检" }
  ];
}

function uricRecordEntries() {
  const deletedIds = new Set(deletedMetricRecordIdsFor("uric"));
  const saved = metricRecordsFor("uric").map((record) => ({
    id: record.id,
    time: record.time,
    value: Number(record.values?.value ?? record.chartValue ?? record.display),
    note: record.note || ""
  })).filter((record) => Number.isFinite(record.value) && !deletedIds.has(record.id));
  const records = saved.length ? saved : sampleUricRecords().filter((record) => !deletedIds.has(record.id));
  if (!records.length) return [];
  const selectedKey = dateInputValue(selectedMetricDate);
  const dayRecords = records.filter((record) => dateInputValue(new Date(record.time)) === selectedKey);
  return (dayRecords.length ? dayRecords : records)
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

function uricFullTimeText(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "").replace("T", " ");
  return `${dateInputValue(date)} ${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function uricTimeText(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return dietDetailTimeOnly(value);
  return `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function uricRecordById(recordId) {
  return uricRecordEntries().find((record) => record.id === recordId) || null;
}

function ensureUricDetailPanel() {
  let panel = document.querySelector("#uricDetailPanel");
  if (!panel && metricDetailPage) {
    panel = document.createElement("section");
    panel.id = "uricDetailPanel";
    panel.className = "uric-detail-panel";
    const nav = metricDetailPage.querySelector(".sub-nav");
    metricDetailPage.insertBefore(panel, nav?.nextSibling || metricDetailPage.firstChild);
  }
  let headerDelete = document.querySelector("#uricHeaderDelete");
  const nav = metricDetailPage?.querySelector(".sub-nav");
  if (!headerDelete && nav) {
    headerDelete = document.createElement("button");
    headerDelete.id = "uricHeaderDelete";
    headerDelete.className = "uric-header-delete";
    headerDelete.type = "button";
    headerDelete.setAttribute("aria-label", "删除当前尿酸记录");
    headerDelete.addEventListener("click", deleteSelectedUricRecord);
    nav.append(headerDelete);
  }
  return panel;
}

function uricRecordCard(record) {
  return `
    <button class="uric-record-card" type="button" data-uric-record="${escapeAttr(record.id)}">
      <div class="uric-record-main">
        <strong>${formatUricValue(record.value)} <em>μmol/L</em></strong>
        <span>${escapeAttr(uricTimeText(record.time))}</span>
      </div>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderUricListDetail(metric) {
  const records = uricRecordEntries();
  const latest = records[0] || sampleUricRecords()[0];
  selectedUricRecordId = latest?.id || "";
  metricDetailTitle.textContent = "尿酸打卡详情";
  const panel = ensureUricDetailPanel();
  if (!panel) return;
  document.querySelector("#uricHeaderDelete")?.setAttribute("hidden", "");
  panel.innerHTML = `
    <section class="uric-current-card">
      <strong>${formatUricValue(latest?.value || metric.value || 0)} <em>μmol/L</em></strong>
      <span>${escapeAttr(uricTimeText(latest?.time || new Date()))}</span>
      <i aria-hidden="true"></i>
    </section>
    <section class="uric-record-list">
      <h2>尿酸记录</h2>
      <div>${records.length ? records.map(uricRecordCard).join("") : `<p class="uric-empty">暂无尿酸记录</p>`}</div>
    </section>
    <button class="uric-record-add" type="button" id="uricRecordAdd">＋ 记录尿酸</button>
  `;
  panel.querySelectorAll("[data-uric-record]").forEach((button) => {
    button.addEventListener("click", () => {
      openUricRecordDetail(button.dataset.uricRecord);
    });
  });
  panel.querySelector("#uricRecordAdd")?.addEventListener("click", () => {
    selectedFocusMetric = "uric";
    openMetricRecordSheet();
  });
}

function renderUricRecordDetail(metric) {
  const records = uricRecordEntries();
  const record = records.find((item) => item.id === selectedUricRecordId) || records[0] || sampleUricRecords()[0];
  selectedUricRecordId = record.id;
  metricDetailTitle.textContent = "尿酸记录详情";
  const panel = ensureUricDetailPanel();
  if (!panel) return;
  document.querySelector("#uricHeaderDelete")?.setAttribute("hidden", "");
  panel.innerHTML = `
    <section class="uric-single-card">
      <div>
        <p>尿酸值</p>
        <strong>${formatUricValue(record.value)} <em>μmol/L</em></strong>
      </div>
      <div>
        <p>检查时间</p>
        <span>${uricTimeText(record.time)}</span>
      </div>
      <div>
        <p>备注</p>
        <span>${escapeAttr(record.note || "暂无备注")}</span>
      </div>
    </section>
    <button class="uric-delete-record" type="button" id="uricDeleteRecord">删除这条记录</button>
  `;
  panel.querySelector("#uricDeleteRecord")?.addEventListener("click", deleteSelectedUricRecord);
}

function renderUricMetricDetail(metric) {
  resetMetricDetailExtras("uric");
  renderUricListDetail(metric);
}

function openUricRecordDetail(recordId) {
  const record = uricRecordById(recordId);
  if (!record || !weightRecordDetailBody) return;
  selectedUricRecordId = record.id;
  const title = weightRecordDetailDialog?.querySelector("header h3");
  if (title) title.textContent = "编辑尿酸记录";
  if (weightRecordSaveAction) weightRecordSaveAction.textContent = "保存修改";
  weightRecordDetailBody.innerHTML = `
    <label>
      <span>尿酸值 <b class="metric-required">*</b></span>
      <div><input id="uricRecordEditValue" type="number" inputmode="decimal" min="0" max="1200" step="0.01" value="${escapeAttr(String(formatUricValue(record.value)))}"><em>μmol/L</em></div>
    </label>
    <label>
      <span>检查时间 <b class="metric-required">*</b></span>
      <input id="uricRecordEditTime" type="datetime-local" value="${escapeAttr(weightRecordInputTime(record.time))}">
    </label>
    <label class="weight-record-note-field">
      <span>备注</span>
      <textarea id="uricRecordEditNote" maxlength="100" placeholder="请输入备注">${escapeAttr(record.note || "")}</textarea>
    </label>
    <p class="weight-record-edit-error" id="uricRecordEditError"></p>
  `;
  const valueInput = document.querySelector("#uricRecordEditValue");
  const uricField = metricRecordConfigs.uric?.[0];
  valueInput?.addEventListener("input", () => clampMetricValueInput(valueInput, uricField));
  valueInput?.addEventListener("change", () => clampMetricValueInput(valueInput, uricField, true));
  sheetMask.classList.add("active");
  weightRecordDetailDialog?.classList.add("active");
}

function saveSelectedUricRecord() {
  const record = uricRecordById(selectedUricRecordId);
  if (!record) return;
  const valueInput = document.querySelector("#uricRecordEditValue");
  const timeInput = document.querySelector("#uricRecordEditTime");
  const noteInput = document.querySelector("#uricRecordEditNote");
  const error = document.querySelector("#uricRecordEditError");
  const value = Number(valueInput?.value);
  const time = timeInput?.value || "";
  if (!Number.isFinite(value) || value < 0 || value > 1200) {
    if (error) error.textContent = "请输入 0 ~ 1200 μmol/L 范围内的尿酸值";
    valueInput?.focus();
    return;
  }
  if (!time) {
    if (error) error.textContent = "请选择检查时间";
    timeInput?.focus();
    return;
  }
  const status = metricStatus("uric", { value });
  const nextRecord = {
    id: selectedUricRecordId?.startsWith("uric-sample") ? `metric-uric-${Date.now()}` : selectedUricRecordId || `metric-uric-${Date.now()}`,
    time,
    display: formatUricValue(value),
    chartValue: value,
    unit: "μmol/L",
    status: status.text,
    attention: status.attention,
    values: { value },
    note: noteInput?.value.trim() || ""
  };
  if (selectedUricRecordId?.startsWith("uric-sample")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id].uric) deletedMetricRecordIdsByPatient[currentPatient.id].uric = [];
    deletedMetricRecordIdsByPatient[currentPatient.id].uric.push(selectedUricRecordId);
  }
  upsertMetricRecord("uric", record.id?.startsWith("uric-sample") ? null : record, nextRecord);
  saveMetricRecords();
  selectedMetricDate = new Date(time);
  selectedUricRecordId = nextRecord.id;
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  updateScheduleMetricCheckin("uric", nextRecord);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  closeOverlays();
  showToast("尿酸记录已更新");
}

function deleteSelectedUricRecord() {
  if (!selectedUricRecordId || selectedUricRecordId.startsWith("uric-sample")) {
    if (!selectedUricRecordId) return;
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id].uric) deletedMetricRecordIdsByPatient[currentPatient.id].uric = [];
    deletedMetricRecordIdsByPatient[currentPatient.id].uric.push(selectedUricRecordId);
  } else {
    removeMetricRecordById("uric", selectedUricRecordId);
  }
  selectedUricRecordId = "";
  uricDetailMode = "list";
  saveMetricRecords();
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  closeOverlays();
  showToast("尿酸记录已删除");
}

function renderStandardMetricTrend(metric, values, labels) {
  const safeValues = values.length ? values : [Number(metric.value || 0)];
  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const spread = max - min || Math.max(Math.abs(max) * 0.08, 1);
  const topValue = max + spread * 0.2;
  const bottomValue = min - spread * 0.2;
  const yForValue = (value) => 132 - ((value - bottomValue) / (topValue - bottomValue || 1)) * 82;
  const points = safeValues.map((value, index) => {
    const x = 24 + index * (272 / Math.max(safeValues.length - 1, 1));
    return { x, y: yForValue(value), value, label: labels[index] || "" };
  });
  return `
    <svg viewBox="0 0 320 170" role="img" aria-label="${escapeAttr(metric.name)}趋势图">
      <defs><linearGradient id="metricAreaStandard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3671ff" stop-opacity=".22"/><stop offset="1" stop-color="#3671ff" stop-opacity="0"/></linearGradient></defs>
      <path d="M24 50H296M24 91H296M24 132H296" stroke="#e7edf7" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="24" y="38">${escapeAttr(formatMetricNumber(max))}</text>
      <text x="24" y="146">${escapeAttr(formatMetricNumber(min))}</text>
      <path d="M${points.map((point) => `${point.x} ${point.y}`).join(" L")} L296 140 L24 140 Z" fill="url(#metricAreaStandard)"/>
      <polyline points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" fill="none" stroke="#3671ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#fff" stroke="#3671ff" stroke-width="2"/><text x="${point.x}" y="158" text-anchor="middle">${escapeAttr(point.label)}</text>`).join("")}
    </svg>`;
}

const metricStatConfig = {
  sugar: ["最高血糖", "最低血糖", "平均血糖"],
  bp: ["最高血压", "最低血压", "平均血压"],
  heart: ["最高心率", "最低心率", "平均心率"],
  weight: ["较上次变化", "近30天变化", "--"],
  waist: ["较上次变化", "近30天变化", "---"],
  hip: ["较上次变化", "近30天变化", "--"],
  "waist-hip": ["较上次变化", "当前腰围", "当前臀围"],
  bmi: ["当前体重", "当前身高", "-"],
  height: ["-", "-", "-"],
  tc: ["较上次变化", "-", "-"],
  tg: ["较上次变化", "-", "-"],
  hdl: ["较上次变化", "-", "-"],
  ldl: ["较上次变化", "-", "-"],
  hba1c: ["较上次变化", "-", "-"],
  tgab: ["较上次变化", "-", "-"],
  tpoab: ["较上次变化", "-", "-"],
  uric: ["较上次变化", "-", "-"],
  "ebv-igg": ["-", "-", "-"],
  "beta2-gp1": ["-", "-", "-"]
};

function metricStatLabels(metric) {
  const baseId = metricBaseId(metric.id);
  return metricStatConfig[metric.id] || metricStatConfig[baseId] || ["较上次变化", "检查时间", "数据来源"];
}

function signedMetricChange(value) {
  if (!Number.isFinite(value)) return "--";
  if (value === 0) return "持平";
  return `${value > 0 ? "+" : ""}${formatMetricNumber(value)}`;
}

function metricCheckTimeText(metric) {
  const latestRecord = allMetricRecords(metric)[0];
  const date = latestRecord?.time ? new Date(latestRecord.time) : selectedMetricDate;
  if (Number.isNaN(date.getTime())) return "--";
  return `${date.getFullYear()}/${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())} ${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function metricStatValue(metric, label, values) {
  if (/^-+$/.test(label)) return label;
  const latest = values.at(-1);
  const previous = values.at(-2);
  const first = values[0];
  const unit = metric.unit || "";
  if (label === "最高心率" || label === "最高血糖") return `${formatMetricNumber(Math.max(...values))}${unit ? ` ${unit}` : ""}`;
  if (label === "最低心率" || label === "最低血糖") return `${formatMetricNumber(Math.min(...values))}${unit ? ` ${unit}` : ""}`;
  if (label === "平均心率" || label === "平均血糖") {
    const avg = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
    return `${formatMetricNumber(avg)}${unit ? ` ${unit}` : ""}`;
  }
  if (label === "较上次变化") return previous == null ? "--" : `${signedMetricChange(latest - previous)}${unit ? ` ${unit}` : ""}`;
  if (label === "近30天变化") return first == null ? "--" : `${signedMetricChange(latest - first)}${unit ? ` ${unit}` : ""}`;
  if (label === "当前腰围") return "82.5 cm";
  if (label === "当前臀围") return "98.0 cm";
  if (label === "当前体重") return "68.5 kg";
  if (label === "当前身高") return "178 cm";
  if (label === "检查时间") return metricCheckTimeText(metric);
  if (label === "数据来源") return ["tc", "tg", "hdl", "ldl", "hba1c", "tgab", "tpoab", "uric"].includes(metric.id) ? "检验报告" : "手动录入";
  return "--";
}

function renderMetricStatCards(metric, values) {
  if (!metricAverageCard || !metricAllRecords) return;
  metricAverageCard.querySelectorAll(":scope > div").forEach((node) => node.remove());
  const statItems = metricStatLabels(metric)
    .map((label) => ({ label, value: metricStatValue(metric, label, values) }))
    .filter((item) => item.label && item.value && !/^-+$/.test(item.label) && !/^-+$/.test(item.value));
  const statGrid = document.createElement("div");
  statGrid.className = "metric-stat-grid";
  statGrid.innerHTML = statItems.map((item) => `
    <article>
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
  metricAverageCard.insertBefore(statGrid, metricAllRecords);
}

function renderStandardMetricDetail(metric) {
  resetMetricDetailExtras("standard");
  const values = rangeMetricValues(metric, selectedMetricRange);
  const labels = metricRangeLabels(selectedMetricRange, values.length);
  const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  const latestRecord = allMetricRecords(metric)[0];
  const latestValue = latestRecord?.display || metric.display || formatMetricNumber(metric.value);
  const latestUnit = latestRecord?.unit ?? metric.unit ?? "";
  metricDetailTitle.textContent = `${metric.name}详情`;
  metricDetailValue.textContent = latestValue;
  metricDetailUnit.textContent = latestUnit;
  metricDetailStatus.textContent = metric.status || "正常";
  metricDetailStatus.classList.toggle("attention", Boolean(metric.attention));
  metricDetailTime.textContent = latestRecord
    ? `最近记录 ${displayMetricRecordTime(latestRecord.time)}`
    : `最近记录 ${dateInputValue(selectedMetricDate).replaceAll("-", "/")} 08:20`;
  metricDateCurrent.textContent = metricDateLabel();
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = selectedMetricRange === "day" ? "近24小时" : selectedMetricRange === "week" ? "近7天" : "近30天";
  renderMetricStatCards(metric, values);
  metricLineChart.innerHTML = renderStandardMetricTrend(metric, values, labels);
}

function renderMetricDetail() {
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
  const baseMetricId = metricBaseId(metric.id);
  selectedFocusMetric = metric.id;
  metricDetailPage?.classList.toggle("weight-detail-mode", false);
  metricDetailPage?.classList.toggle("pressure-detail-mode", baseMetricId === "bp");
  metricDetailPage?.classList.toggle("sugar-detail-mode", baseMetricId === "sugar");
  metricDetailPage?.classList.toggle("heart-detail-mode", false);
  metricDetailPage?.classList.toggle("lipid-detail-mode", false);
  metricDetailPage?.classList.toggle("uric-detail-mode", false);
  metricDetailPage?.classList.toggle("waist-detail-mode", false);
  const lipidPanel = document.querySelector("#lipidDetailPanel");
  if (lipidPanel) lipidPanel.hidden = true;
  document.querySelector("#lipidHeaderDelete")?.setAttribute("hidden", "");
  const uricPanel = document.querySelector("#uricDetailPanel");
  if (uricPanel) uricPanel.hidden = true;
  document.querySelector("#uricHeaderDelete")?.setAttribute("hidden", "");
  const waistPanel = document.querySelector("#waistDetailPanel");
  if (waistPanel) waistPanel.hidden = true;
  document.querySelector("#waistTrendButton")?.setAttribute("hidden", "");
  ensurePressureDetailExtras();
  document.querySelector("#metricSugarLowBlock")?.toggleAttribute("hidden", baseMetricId !== "sugar");
  if (baseMetricId === "bp") {
    resetMetricDetailExtras("bp");
    renderPressureMetricDetail(metric);
    return;
  }
  if (baseMetricId === "sugar") {
    resetMetricDetailExtras("sugar");
    renderSugarMetricDetail(metric);
    return;
  }
  renderStandardMetricDetail(metric);
}

function openMetricDetail(metricId) {
  selectedFocusMetric = metricId;
  selectedMetricRange = "day";
  uricDetailMode = "list";
  selectedUricRecordId = "";
  waistDetailMode = "list";
  selectedWaistRecordId = "";
  const latest = metricRecordsFor(metricId)[0];
  selectedMetricDate = latest ? new Date(latest.time) : new Date();
  metricRangeTabs?.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.metricRange === "day"));
  renderMetricDetail();
  openSubPage("metricDetailPage");
}

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
  document.body.classList.toggle(
    "detail-page-open",
    pageId === "reportDetailPage" || pageId === "aiReparsePage" || pageId === "metricDetailPage" || pageId === "metricRecordsPage" || pageId === "dietRecognizePage" || pageId === "dietResultPage" || pageId === "dietDetailPage" || pageId === "sportDetailPage" || pageId === "medicineRecordsPage" || pageId === "medicineDetailPage" || pageId === "medicineImagePage" || pageId === "portraitBiomarkerDetailPage"
  );
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
  const previousSubPage = document.querySelector(`#${previous}.sub-page`);
  if (previousSubPage) {
    previousSubPage.classList.add("active");
    document.body.classList.toggle(
      "detail-page-open",
      previous === "reportDetailPage" || previous === "aiReparsePage" || previous === "metricDetailPage" || previous === "metricRecordsPage" || previous === "dietRecognizePage" || previous === "dietResultPage" || previous === "dietDetailPage" || previous === "sportDetailPage" || previous === "medicineRecordsPage" || previous === "medicineDetailPage" || previous === "medicineImagePage" || previous === "portraitBiomarkerDetailPage"
    );
  } else if (previous === "minePage") {
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
