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
  try {
    if (!hasAny) {
      scheduleContent.innerHTML = renderCheckinSection([]);
      return;
    }
    scheduleContent.innerHTML = `
      ${renderReminderSection(data.reminders)}
      ${renderAssessmentSection(data.assessments)}
      ${renderFollowupSection(data.followups)}
      ${renderCheckinSection(data.checkins)}
    `;
  } catch (error) {
    scheduleContent.innerHTML = renderCheckinSection([]);
  }
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
  const body = followups.length ? followups.map((task, index) => {
    const buttonClass = task.status === "已完成" ? "done" : "";
    const isCheckinTask = task.taskKind === "checkin" || ["饮食记录", "运动记录", "用药记录", "体重记录", "血压记录", "血糖记录", "血脂记录", "尿酸记录", "腰围记录", "心率记录"].includes(task.type);
    const checkinType = isCheckinTask ? scheduleTaskCheckinType(task.type) : "";
    const taskKind = isCheckinTask ? "checkin-task" : "follow-task";
    const isCompletedCheckin = isCheckinTask && task.status === "已完成";
    const scheduleAction = isCheckinTask ? (isCompletedCheckin ? "records" : "checkin") : "follow";
    const action = isCheckinTask ? (isCompletedCheckin ? "查看" : "去打卡") : "填写";
    const taskIdAttr = isCheckinTask ? ` data-task-id="followup-${index}"` : "";
    const completedClass = isCompletedCheckin ? " completed" : "";
    const completedMark = isCompletedCheckin ? `<i class="task-done-mark" aria-hidden="true"></i>` : "";
    return `
      <article class="schedule-card follow-card ${taskKind}${completedClass}" data-schedule-action="${scheduleAction}"${checkinType ? ` data-type="${checkinType}"` : ""}${taskIdAttr}>
        <div class="follow-copy">
          <div class="follow-head">
            <span class="task-tag-small">健康行动</span>
          </div>
          <strong>${completedMark}${task.title}</strong>
        </div>
        <button class="task-primary ${buttonClass}" type="button" data-schedule-action="${scheduleAction}"${checkinType ? ` data-type="${checkinType}"` : ""}${taskIdAttr}>${action}</button>
      </article>
    `;
  }).join("") : `<div class="empty-card"><strong>暂无随访任务</strong></div>`;
  return renderSection("健康任务", body, `<button type="button" data-schedule-plans>全部计划 〉</button>`);
}

function scheduleTaskCheckinType(label) {
  const text = String(label || "");
  if (text.includes("饮食")) return "diet";
  if (text.includes("运动")) return "sport";
  if (text.includes("用药")) return "medicine";
  if (text.includes("体重")) return "weight";
  if (text.includes("血压")) return "pressure";
  if (text.includes("血糖")) return "sugar";
  if (text.includes("血脂")) return "lipid";
  if (text.includes("尿酸")) return "uric";
  if (text.includes("腰围")) return "waist";
  if (text.includes("心率")) return "heart";
  if (text.includes("经期")) return "period";
  return "";
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
  const checkinMap = new Map();
  (checkins || []).forEach((item) => checkinMap.set(item.type, item));
  const wallItems = ["diet", "sport", "medicine", "weight", "pressure", "sugar", "lipid", "uric", "waist", "heart", "period"]
    .map((type) => checkinMap.get(type) || defaultCheckinItem(type));
  const body = `<div class="checkin-wall">${wallItems.map(renderCheckinCard).join("")}</div>`;
  return renderSection("健康打卡", body, `<button type="button" data-schedule-records>全部打卡 〉</button>`);
}

function defaultCheckinItem(type) {
  const defaults = {
    diet: { type: "diet", title: "饮食打卡", count: "暂无记录", desc: "" },
    sport: { type: "sport", title: "运动打卡", count: "暂无记录", desc: "" },
    medicine: { type: "medicine", title: "用药/补充记录", count: "暂无记录", desc: "" },
    weight: { type: "weight", title: "体重打卡", count: "暂无记录", desc: "" },
    pressure: { type: "pressure", title: "血压打卡", count: "暂无记录", desc: "" },
    sugar: { type: "sugar", title: "血糖打卡", count: "暂无记录", desc: "" },
    lipid: { type: "lipid", title: "血脂打卡", count: "暂无记录", desc: "" },
    uric: { type: "uric", title: "尿酸打卡", count: "暂无记录", desc: "" },
    waist: { type: "waist", title: "腰围打卡", count: "暂无记录", desc: "" },
    heart: { type: "heart", title: "心率打卡", count: "暂无记录", desc: "" },
    period: { type: "period", title: "经期打卡", count: "暂无记录", desc: "" }
  };
  return defaults[type] || defaults.diet;
}

function checkinTimeText(value) {
  if (!value) return "";
  const text = String(value).trim();
  const timeMatch = text.match(/(\d{1,2}:\d{2})/);
  if (timeMatch) return timeMatch[1];
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  return text;
}

function checkinRecordTime(item) {
  return checkinTimeText(
    item?.latestRecordTime
      || item?.latestTime
      || item?.recordTime
      || item?.records?.[0]?.time
      || item?.value
      || ""
  );
}

function checkinValueWithoutTime(value) {
  return String(value || "")
    .replace(/\s*\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}\s*$/, "")
    .replace(/\s*\d{1,2}:\d{2}\s*$/, "")
    .trim();
}

function hasCheckinRecord(item) {
  if (!item) return false;
  if (Array.isArray(item.records) && item.records.length) return true;
  if (item.totalCalories || item.totalWater || item.duration || item.calories || item.values) return true;
  if (String(item.value || "").trim()) return true;
  const count = String(item.count || "").trim();
  return Boolean(count && !["暂无记录", "待完成", "未开始"].includes(count));
}

function numericKcal(value) {
  const matched = String(value || "").match(/(\d+(?:\.\d+)?)\s*kcal/i);
  return matched ? Number(matched[1]) : NaN;
}

function metricCheckinValue(item) {
  const values = item.values || {};
  const display = item.display || item.latestValue || checkinValueWithoutTime(item.value);
  if (item.type === "pressure" && (values.systolic || values.diastolic)) {
    const pulse = values.pulse ? ` · 脉搏 ${values.pulse}` : "";
    return `${values.systolic}/${values.diastolic} mmHg${pulse}`;
  }
  if (item.type === "weight") return `${display || values.value} kg`;
  if (item.type === "waist") return `${display || values.value} cm`;
  if (item.type === "heart") return `${display || values.value} 次/分`;
  if (item.type === "sugar") {
    const period = values.period || item.period || "";
    return `${display || values.value} mmol/L${period ? ` · ${period}` : ""}`;
  }
  if (item.type === "lipid") {
    const ldlFromText = String(display || item.value || "").match(/LDL-C\s*[:：]?\s*(\d+(?:\.\d+)?)/i)?.[1];
    const ldl = values.ldl ?? ldlFromText;
    return ldl ? `低密度脂蛋白LDL-C：${formatMetricNumber(ldl)} mmol/L` : "";
  }
  if (item.type === "uric") return `${display || values.value} μmol/L`;
  return display;
}

function checkinDisplay(item) {
  if (!hasCheckinRecord(item)) return { main: "暂无记录", meta: "", empty: true };
  const valueText = checkinValueWithoutTime(item.value);
  const recordTime = checkinRecordTime(item);
  let main = valueText || item.count || "已记录";

  if (item.type === "diet") {
    const calorieValue = Number(item.totalCalories ?? item.calories ?? item.values?.calories);
    const calories = Number.isFinite(calorieValue) && calorieValue > 0 ? calorieValue : numericKcal(item.value);
    main = Number.isFinite(calories) && calories > 0 ? `${Math.round(calories)} kcal` : main;
  }

  if (item.type === "water") {
    const total = Number(item.totalWater ?? item.water ?? item.values?.water);
    main = Number.isFinite(total) && total > 0 ? `${Math.round(total)} ml` : main;
  }

  if (item.type === "sport") {
    const records = Array.isArray(item.records) ? item.records : [];
    const duration = records.reduce((sum, record) => sum + Number(record.duration || 0), 0) || Number(item.duration || 0);
    const calories = records.reduce((sum, record) => sum + Number(record.calories || 0), 0)
      || Number(item.calories || 0)
      || numericKcal(item.value);
    if (duration && calories) main = `总时长 ${duration}分钟 · 消耗 ${Math.round(calories)} kcal`;
    else if (duration) main = `总时长 ${duration}分钟`;
    else if (Number.isFinite(calories) && calories > 0) main = `消耗 ${Math.round(calories)} kcal`;
  }

  if (item.type === "medicine") {
    main = valueText || item.latestMedicineName || item.latestName || item.count || "已记录";
  }

  if (item.type === "sleep") {
    main = valueText || item.sleepDuration || item.duration || item.count || "已记录";
  }

  const metricTypes = new Set(["weight", "waist", "hip", "pressure", "heart", "sugar", "height", "lipid", "uric", "ketone", "psych", "fat", "period"]);
  if (metricTypes.has(item.type)) {
    main = metricCheckinValue(item) || valueText || item.display || item.latestValue || item.count || "已记录";
  }

  return {
    main,
    meta: `${recordTime || "--:--"} 更新`,
    empty: false
  };
}

const scheduleMetricCheckins = {
  bp: { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏" },
  weight: { type: "weight", title: "体重打卡", desc: "记录体重变化，关注健康趋势" },
  waist: { type: "waist", title: "腰围打卡", desc: "记录腰围变化" },
  heart: { type: "heart", title: "心率打卡", desc: "记录静息心率" },
  sugar: { type: "sugar", title: "血糖打卡", desc: "记录血糖值和测量时段" },
  lipid: { type: "lipid", title: "血脂打卡", desc: "记录 TC、TG、HDL-C、LDL-C 等血脂指标" },
  uric: { type: "uric", title: "尿酸打卡", desc: "记录尿酸变化" }
};

function scheduleMetricKey(metricId) {
  const key = String(metricId || "").split("-")[0];
  if (key === "pressure") return "bp";
  return key;
}

function scheduleCheckinTypeForMetric(metricId) {
  return scheduleMetricCheckins[scheduleMetricKey(metricId)]?.type || "";
}

function updateScheduleMetricCheckin(metricId, record) {
  const config = scheduleMetricCheckins[scheduleMetricKey(metricId)];
  if (!config || !record) return;
  const timeText = checkinTimeText(record.time) || "--:--";
  const itemForDisplay = {
    type: config.type,
    display: record.display,
    value: record.display,
    values: record.values || {},
    latestRecordTime: timeText
  };
  const main = metricCheckinValue(itemForDisplay) || record.display || "已记录";
  const data = scheduleDataFor();
  const existing = data.checkins.find((item) => item.type === config.type);
  const payload = {
    type: config.type,
    title: config.title,
    desc: config.desc,
    count: "已记录 1 次",
    value: `${main} ${timeText}`,
    display: record.display,
    values: record.values || {},
    latestRecordTime: timeText,
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function renderCheckinCard(item) {
  const display = checkinDisplay(item);
  const config = {
    diet: {
      title: "饮食记录",
      main: display.main,
      meta: display.meta,
      art: "trend",
      icon: "食"
    },
    sport: {
      title: "运动",
      main: display.main,
      meta: display.meta,
      art: "bars",
      icon: "动"
    },
    medicine: {
      title: "用药/补充",
      main: display.main,
      meta: display.meta,
      art: "pill",
      icon: "药"
    },
    weight: {
      title: "体重",
      main: display.main,
      meta: display.meta,
      art: "scale",
      icon: "重"
    },
    pressure: {
      title: "血压",
      main: display.main,
      meta: display.meta,
      art: "heartline",
      icon: "压"
    },
    sugar: {
      title: "血糖",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "糖"
    },
    lipid: {
      title: "血脂",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "脂"
    },
    uric: {
      title: "尿酸",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "尿"
    },
    waist: {
      title: "腰围",
      main: display.main,
      meta: display.meta,
      art: "tape",
      icon: "围"
    },
    heart: {
      title: "心率",
      main: display.main,
      meta: display.meta,
      art: "heartline",
      icon: "心"
    },
    period: {
      title: "经期管理",
      main: display.main,
      meta: display.meta,
      art: "flower",
      icon: "经"
    }
  }[item.type] || {
    title: item.title,
    main: display.main,
    meta: display.meta,
    art: "trend",
    icon: "记"
  };
  const checkinMainClass = `checkin-main${display.empty ? " empty" : ""}`;
  const largeClass = item.type === "diet" || item.type === "period" ? " large" : "";
  const plusLabel = `新增${config.title}`;
  return `
    <article class="checkin-card${largeClass}" data-type="${item.type}" data-schedule-action="records">
      <div class="checkin-card-head">
        <i class="checkin-symbol" aria-hidden="true">${config.icon}</i>
        <span>
          <strong>${config.title}</strong>
          ${config.meta ? `<em>${config.meta}</em>` : ""}
        </span>
        <button class="checkin-plus" type="button" data-type="${item.type}" data-schedule-action="checkin" aria-label="${plusLabel}">+</button>
      </div>
      <div class="checkin-card-body">
        <span class="${checkinMainClass}">${config.main}</span>
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

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
}

function localDateTimeValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isTodayDate(date) {
  return dateInputValue(date) === dateInputValue(new Date());
}

function formatCheckinTimeDisplay(value, emptyText = "请选择记录时间", dateSeparator = "/") {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return emptyText;
  const timeText = `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
  if (isTodayDate(date)) return timeText;
  return `${dateInputValue(date).replaceAll("-", dateSeparator)} ${timeText}`;
}

function formatDietTime(value) {
  if (!value) return "现在";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function updateDietMealTimeText() {
  if (dietMealTimeText) dietMealTimeText.textContent = formatCheckinTimeDisplay(dietMealTime?.value, "请选择饮食时间");
}

function dietPickerDateLabel(date) {
  const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getFullYear()}年${padDateNumber(date.getMonth() + 1)}月${padDateNumber(date.getDate())}日 周${weekLabels[date.getDay()]}`;
}

function dietPickerBaseValue() {
  const source = dietTimePickerMode === "detail" ? dietEditTimeInput?.value : dietMealTime?.value;
  const selected = source ? new Date(source) : new Date();
  return Number.isNaN(selected.getTime()) ? new Date() : selected;
}

function populateDietTimePicker() {
  if (!dietPickerDate || !dietPickerHour || !dietPickerMinute) return;
  const selected = dietPickerBaseValue();
  dietPickerDate.innerHTML = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const date = addDays(selected, offset);
    return `<option value="${dateInputValue(date)}">${dietPickerDateLabel(date)}</option>`;
  }).join("");
  dietPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}时</option>`;
  }).join("");
  dietPickerMinute.innerHTML = Array.from({ length: 60 }, (_, minute) => {
    const value = padDateNumber(minute);
    return `<option value="${value}">${value}分</option>`;
  }).join("");
  dietPickerDate.value = dateInputValue(selected);
  dietPickerHour.value = padDateNumber(selected.getHours());
  dietPickerMinute.value = padDateNumber(selected.getMinutes());
}

function openDietTimePicker(mode = "checkin") {
  dietTimePickerMode = mode;
  populateDietTimePicker();
  sheetMask.classList.add("active");
  dietTimePicker?.classList.add("active");
}

function closeDietTimePicker() {
  dietTimePicker?.classList.remove("active");
  dietTimePickerMode = "checkin";
  if (!document.querySelector(".diet-upload-sheet.active, .diet-gram-sheet.active")) {
    sheetMask.classList.remove("active");
  }
}

function confirmDietTimePicker() {
  if (!dietPickerDate?.value || !dietPickerHour?.value || !dietPickerMinute?.value) return;
  const value = `${dietPickerDate.value}T${dietPickerHour.value}:${dietPickerMinute.value}`;
  if (dietTimePickerMode === "detail") {
    if (dietEditTimeInput) dietEditTimeInput.value = value;
    if (dietEditTimeText) dietEditTimeText.textContent = formatCheckinTimeDisplay(value, "请选择饮食时间");
    closeDietTimePicker();
    return;
  }
  if (dietMealTime) dietMealTime.value = value;
  const selectedTime = new Date(value);
  if (!Number.isNaN(selectedTime.getTime())) dietSelectedMeal = mealByTime(selectedTime);
  updateDietMealTimeText();
  renderDietMealOptions();
  closeDietTimePicker();
}

function mealByTime(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 9) return "早餐";
  if (hour >= 9 && hour < 11) return "早加餐";
  if (hour >= 11 && hour < 14) return "午餐";
  if (hour >= 14 && hour < 17) return "午加餐";
  if (hour >= 17 && hour < 20) return "晚餐";
  if (hour >= 20 && hour < 23) return "晚加餐";
  return "早餐";
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function checkinLineHtml(line) {
  const label = escapeAttr(line.label || "");
  const value = escapeAttr(line.value || "");
  const unit = escapeAttr(line.unit || "");
  return `<p>${label ? `${label} ` : ""}<strong>${value}</strong>${unit ? `<em> ${unit}</em>` : ""}</p>`;
}

function showUnifiedCheckinSuccess(lines = []) {
  if (unifiedCheckinSuccessBody) {
    unifiedCheckinSuccessBody.innerHTML = lines.length
      ? lines.map(checkinLineHtml).join("")
      : `<p><strong>记录已保存</strong></p>`;
  }
  sheetMask.classList.add("active");
  unifiedCheckinSuccessDialog?.classList.add("active");
}

function resetDietUploadState() {
  dietReturnView = document.querySelector("#dietDetailPage")?.classList.contains("active")
    ? "dietDetail"
    : planPage?.classList.contains("active") ? "plan" : "home";
  dietUploadImages.forEach((image) => {
    if (image.preview?.startsWith("blob:")) URL.revokeObjectURL(image.preview);
  });
  dietUploadImages = [];
  const now = new Date();
  dietSelectedMeal = mealByTime(now);
  dietResults = [];
  dietResultIndex = 0;
  if (dietMealTime) dietMealTime.value = localDateTimeValue(now);
  updateDietMealTimeText();
  if (dietNoteInput) dietNoteInput.value = "";
  renderDietUploadImages();
  renderDietMealOptions();
}

function showDietUploadSheet() {
  sheetMask.classList.add("active");
  dietUploadSheet?.classList.add("active");
}
