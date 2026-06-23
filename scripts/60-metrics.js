function renderFocusPlans() {
  if (!focusMetricGrid) return;
  selectedFocusPlan = "weight90";
  const plan = focusPlanDashboards.weight90;
  applyLatestMetricRecords(plan);
  focusMetricGrid.innerHTML = plan.metrics.map((metric) => `
    <button class="focus-metric-card${metric.attention ? " attention" : ""}" type="button" data-focus-metric="${metric.id}">
      <span>${metric.name}</span>
      <strong>${metric.display}<em>${metric.unit}</em></strong>
    </button>
  `).join("");
}

const metricRecordConfigs = {
  sugar: [{ key: "value", label: "血糖值", unit: "mmol/L", step: "0.1", min: "0.1", max: "40" }],
  bp: [
    { key: "systolic", label: "收缩压", unit: "mmHg", step: "1", min: "40", max: "260" },
    { key: "diastolic", label: "舒张压", unit: "mmHg", step: "1", min: "30", max: "180" }
  ],
  weight: [{ key: "value", label: "体重", unit: "kg", step: "0.1", min: "1", max: "500" }],
  waist: [{ key: "value", label: "腰围", unit: "cm", step: "0.1", min: "40", max: "200" }],
  height: [{ key: "value", label: "身高", unit: "cm", step: "0.1", min: "30", max: "250" }],
  heart: [{ key: "value", label: "心率值", unit: "bpm/次/分", step: "1", min: "20", max: "250", required: true }],
  lipid: [
    { key: "tc", label: "总胆固醇 TC", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", required: true, ownTime: true, group: "basic" },
    { key: "tg", label: "甘油三酯 TG", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", required: true, ownTime: true, group: "basic" },
    { key: "hdl", label: "高密度脂蛋白胆固醇 HDL-C", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", required: true, ownTime: true, group: "basic" },
    { key: "ldl", label: "低密度脂蛋白胆固醇 LDL-C", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", required: true, ownTime: true, group: "basic" },
    { key: "sdldl", label: "小而密低密度脂蛋白胆固醇 sdLDL-C", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", ownTime: true, group: "sdldl" },
    { key: "oxldl", label: "氧化低密度脂蛋白胆固醇 oxLDL-C", unit: "mmol/L", step: "0.1", min: "0.1", max: "20", ownTime: true, group: "oxldl" }
  ],
  uric: [{ key: "value", label: "尿酸值", unit: "μmol/L", step: "1", min: "1", max: "1500" }],
  fat: [{ key: "value", label: "体脂", unit: "%", step: "0.1", min: "1", max: "70" }],
  bmi: [{ key: "value", label: "BMI", unit: "", step: "0.1", min: "5", max: "80" }]
};

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
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${dateInputValue(date)}">${label}</option>`;
  }).join("");
  metricRecordPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  metricRecordPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  metricRecordPickerDate.value = dateInputValue(selected);
  metricRecordPickerHour.value = padDateNumber(selected.getHours());
  metricRecordPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openMetricRecordTimePicker() {
  const title = metricRecordTimePicker?.querySelector(".weight-picker-head strong");
  if (title) title.textContent = "选择记录时间";
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

function renderAllMetricRecords() {
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
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
  const primary = values.value ?? values.systolic;
  const attention = (
    (metricId === "sugar" && primary > 6.1) ||
    (metricId === "bp" && (values.systolic >= 140 || values.diastolic >= 90)) ||
    (metricId === "heart" && (primary < 60 || primary > 100)) ||
    (metricId === "fat" && primary > 30) ||
    (metricId === "bmi" && primary >= 24)
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
  if (editingRecord?.values?.[field.key] != null) return editingRecord.values[field.key];
  return metricRecordDefaultValue(metric, field);
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
  editingMetricRecordId = recordId || "";
  const editingRecord = metricRecordById(metric.id, editingMetricRecordId);
  const fields = metricRecordConfigs[metric.id] || metricRecordConfigs.weight;
  const isUric = metric.id === "uric";
  metricRecordSheet.classList.toggle("metric-record-sheet-lipid", metric.id === "lipid");
  metricRecordSheet.classList.toggle("metric-record-sheet-combined-note", ["heart", "uric"].includes(metric.id));
  metricRecordSheetTitle.textContent = editingMetricRecordId ? `编辑${metric.name}记录` : `记录${metric.name}`;
  metricRecordFields.innerHTML = metric.id === "heart" ? `
    <section class="metric-heart-field">
      <span>心率值 <b class="metric-required">※</b></span>
      <div class="weight-stepper">
        <button class="weight-step-btn" type="button" data-metric-step="value" data-delta="-1" aria-label="减少心率值">−</button>
        <div class="weight-number-field">
          <input type="number" inputmode="numeric" data-metric-input="value" min="20" max="250" step="1" value="72" aria-label="心率值">
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
      <h4><span>${field.label}</span>${field.required ? `<b class="metric-required">※</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>
        <label class="metric-value-number-field">
          <input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" value="${metricRecordEditValue(metric, field)}" aria-label="${field.label}">
          ${field.unit ? `<span>${field.unit}</span>` : ""}
        </label>
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>
      </div>
    </section>
  `).join("");
  metricRecordFields.innerHTML = fields.map((field) => `
    <section class="metric-value-field">
      <h4><span>${field.label}</span>${field.required ? `<b class="metric-required">※</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>
        <label class="metric-value-number-field">
          <input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" value="${metricRecordEditValue(metric, field)}" aria-label="${field.label}">
          ${field.unit ? `<span>${field.unit}</span>` : ""}
        </label>
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>
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
      <h4><span>${field.label}</span>${field.required ? `<b class="metric-required">※</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
      <div class="metric-value-stepper">
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="-${field.step}" aria-label="减少${field.label}">−</button>
        <label class="metric-value-number-field">
          <input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" value="${metricRecordEditValue(metric, field)}" aria-label="${field.label}">
          ${field.unit ? `<span>${field.unit}</span>` : ""}
        </label>
        <button class="metric-value-step-btn" type="button" data-metric-step="${field.key}" data-delta="${field.step}" aria-label="增加${field.label}">+</button>
      </div>
      ${field.ownTime ? `
        <label class="metric-extra-time">
          <span>检查时间</span>
          <input type="datetime-local" data-metric-time="${field.key}" value="${localDateTimeValue()}">
        </label>
      ` : ""}
    </section>
  `).join("");
  if (metric.id === "lipid") {
    const renderMetricValueField = (field) => `
      <section class="metric-value-field">
        <h4><span>${field.label}</span>${field.required ? `<b class="metric-required">※</b>` : ""}${field.unit ? `<em>（${field.unit}）</em>` : ""}</h4>
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
  if (metricRecordTimeLabel) metricRecordTimeLabel.textContent = metric.id === "heart" ? "测量时间" : metric.id === "lipid" || isUric ? "检查时间" : "记录时间";
  updateMetricRecordTimeText();
  metricRecordNoteField.hidden = !["heart", "uric", "lipid"].includes(metric.id);
  metricRecordNoteField.querySelector("span").textContent = metric.id === "lipid" ? "备注（全局）" : "备注";
  metricRecordNote.placeholder = metric.id === "heart" ? "记录运动后、静息、心慌、服药后等情况" : isUric ? "可记录饮酒、饮食、痛风发作、用药变化等" : "请输入备注";
  if (metric.id === "lipid") {
    const globalLevel = metricRecordFields.querySelector(".lipid-level-global");
    if (metricRecordTimeLabel) metricRecordTimeLabel.textContent = "记录时间";
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
  const raw = latest?.values?.[field.key]
    ?? (field.key === "value" ? latest?.chartValue : undefined)
    ?? (field.key === "value" ? metric.value : undefined)
    ?? Number(field.min);
  const value = Number(raw);
  if (!Number.isFinite(value)) return field.min;
  return Number(field.step) < 1 ? value.toFixed(1) : String(Math.round(value));
}

function stepMetricRecordValue(key, delta) {
  const metric = getSelectedMetric();
  const field = metricRecordConfigs[metric.id]?.find((item) => item.key === key);
  const input = metricRecordFields?.querySelector(`[data-metric-input="${key}"]`);
  if (!field || !input) return;
  const fallback = metric.id === "heart" ? 72 : Number(field.min);
  const current = normalizeDecimal(input.value, fallback);
  const next = Math.min(Number(field.max), Math.max(Number(field.min), current + delta));
  input.value = Number(field.step) < 1 ? next.toFixed(1) : String(Math.round(next));
}

function metricRecordSuccessLines(metric, record) {
  if (metric.id === "lipid") {
    const lipidLines = [
      { label: "总胆固醇 TC", value: formatMetricNumber(record.values.tc), unit: "mmol/L" },
      { label: "甘油三酯 TG", value: formatMetricNumber(record.values.tg), unit: "mmol/L" },
      { label: "HDL-C", value: formatMetricNumber(record.values.hdl), unit: "mmol/L" },
      { label: "LDL-C", value: formatMetricNumber(record.values.ldl), unit: "mmol/L" }
    ];
    if (record.values.sdldl != null) lipidLines.push({ label: "sdLDL-C", value: formatMetricNumber(record.values.sdldl), unit: "mmol/L" });
    if (record.values.oxldl != null) lipidLines.push({ label: "oxLDL-C", value: formatMetricNumber(record.values.oxldl), unit: "mmol/L" });
    return lipidLines;
    return [
      { label: "总胆固醇 TC", value: formatMetricNumber(record.values.tc), unit: "mmol/L" },
      { label: "甘油三酯 TG", value: formatMetricNumber(record.values.tg), unit: "mmol/L" },
      { label: "HDL-C", value: formatMetricNumber(record.values.hdl), unit: "mmol/L" },
      { label: "LDL-C", value: formatMetricNumber(record.values.ldl), unit: "mmol/L" },
      { label: "sdLDL-C", value: formatMetricNumber(record.values.sdldl), unit: "mmol/L" },
      { label: "oxLDL-C", value: formatMetricNumber(record.values.oxldl), unit: "mmol/L" }
    ];
  }
  if (metric.id === "heart") return [{ label: "当前心率", value: record.display, unit: record.unit }];
  if (metric.id === "uric") return [{ label: "当前尿酸", value: record.display, unit: record.unit }];
  if (metric.id === "fat") return [{ label: "当前体脂率", value: record.display, unit: record.unit }];
  if (metric.id === "lipid") {
    return [
      { label: "甘油三酯", value: formatMetricNumber(record.values.tg), unit: "mmol/L" },
      { label: "低密度脂蛋白", value: formatMetricNumber(record.values.ldl), unit: "mmol/L" }
    ];
  }
  return [{ label: `当前${metric.name}`, value: record.display, unit: record.unit }];
}

function saveMetricRecord() {
  const metric = getSelectedMetric();
  const config = metricRecordConfigs[metric.id];
  const values = {};
  for (const field of config) {
    const input = metricRecordFields.querySelector(`[data-metric-input="${field.key}"]`);
    const rawValue = input?.value.trim() || "";
    if (!rawValue && !field.required) {
      values[field.key] = null;
      continue;
    }
    const value = Number(input?.value);
    if (!rawValue || !Number.isFinite(value) || value < Number(field.min) || value > Number(field.max)) {
      metricRecordError.textContent = `请正确填写${field.label}`;
      input?.focus();
      return;
    }
    values[field.key] = value;
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
    metricRecordError.textContent = "请选择记录时间";
    return;
  }
  if (metric.id === "sugar" && !values.period) values.period = "空腹";
  const display = metric.id === "bp"
    ? `${values.systolic}/${values.diastolic}`
    : metric.id === "lipid"
      ? `TC ${formatMetricNumber(values.tc)} / TG ${formatMetricNumber(values.tg)} / LDL-C ${formatMetricNumber(values.ldl)}`
      : formatMetricNumber(values.value);
  const chartValue = metric.id === "bp" ? values.systolic : metric.id === "lipid" ? values.tg : values.value;
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
    note: ["heart", "uric", "lipid"].includes(metric.id) ? metricRecordNote.value.trim() : ""
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
      <span>记录时间</span>
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
    if (error) error.textContent = "请选择记录时间";
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
      <div><input id="heartRecordEditValue" type="number" inputmode="numeric" min="20" max="250" step="1" value="${escapeAttr(record.display)}"><em>bpm</em></div>
    </label>
    <label>
      <span>记录时间</span>
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
  if (!Number.isFinite(value) || value < 20 || value > 250) {
    if (error) error.textContent = "请输入 20 ~ 250 bpm 范围内的心率";
    valueInput?.focus();
    return;
  }
  if (!time) {
    if (error) error.textContent = "请选择记录时间";
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
  const avgPulse = pressureAverage(chartParts, "pulse") || latest?.pulse || 80;

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
  document.querySelector("#metricStatPulseAverage") && (document.querySelector("#metricStatPulseAverage").textContent = avgPulse ? `${avgPulse}` : "--");
  document.querySelector("#pressureAverageDate") && (document.querySelector("#pressureAverageDate").textContent = metricDateCurrent.textContent);
  metricLineChart.innerHTML = renderPressureChart(chartParts);
}

function sugarRecordParts(record) {
  if (!record) return null;
  const value = Number(record.values?.value ?? record.chartValue ?? record.display);
  if (!Number.isFinite(value)) return null;
  return { value, time: record.time };
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
  const values = dayParts.map((item) => item.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  let lowBlock = document.querySelector("#metricSugarLowBlock");
  const pulseBlock = document.querySelector("#metricPulseAverageBlock");
  if (!lowBlock && metricAverageCard && pulseBlock) {
    lowBlock = document.createElement("div");
    lowBlock.id = "metricSugarLowBlock";
    lowBlock.className = "metric-sugar-low";
    metricAverageCard.insertBefore(lowBlock, pulseBlock);
  }

  metricDetailTitle.textContent = "血糖详情";
  metricDetailValue.textContent = formatMetricNumber(latest.value);
  metricDetailUnit.textContent = "mmol/L";
  metricDetailStatus.textContent = "";
  metricDetailStatus.classList.remove("attention");
  metricDetailTime.textContent = "";
  metricDateCurrent.textContent = `${selectedMetricDate.getFullYear()}年${padDateNumber(selectedMetricDate.getMonth() + 1)}月${padDateNumber(selectedMetricDate.getDate())}日`;
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = "";
  document.querySelector("#pressureAverageDate") && (document.querySelector("#pressureAverageDate").textContent = `${selectedMetricDate.getFullYear()}年${padDateNumber(selectedMetricDate.getMonth() + 1)}月${padDateNumber(selectedMetricDate.getDate())}日`);
  metricStatAverage.textContent = formatMetricNumber(max);
  if (lowBlock) {
    lowBlock.hidden = false;
    lowBlock.innerHTML = `<span>最低血糖</span><strong>${formatMetricNumber(min)}</strong>`;
  }
  if (pulseBlock) {
    pulseBlock.hidden = false;
    pulseBlock.innerHTML = `<span>平均血糖</span><strong id="metricStatPulseAverage">${formatMetricNumber(avg)}</strong>`;
  }
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
      <span>记录时间：${escapeAttr(waistFullTimeText(latest.time))}</span>
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
        <p>记录时间</p>
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
      <strong>${lipidResultValue(value, 1)}</strong>
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
    lipidExtraCell("oxLDL-C", values.oxldl)
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
    <section class="lipid-overview-card">
      <div class="lipid-overview-grid">
        <article><i class="count" aria-hidden="true"></i><span>记录次数</span><strong>${records.length}<em>次</em></strong></article>
      </div>
    </section>
    <section class="lipid-today-section">
      <header>
        <h2>血脂记录</h2>
      </header>
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
  return Number.isFinite(number) ? String(Math.round(number)) : "--";
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
        <p>记录时间</p>
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
      <span>尿酸值 <b class="metric-required">※</b></span>
      <div><input id="uricRecordEditValue" type="number" inputmode="numeric" min="1" max="1500" step="1" value="${escapeAttr(String(formatUricValue(record.value)))}"><em>μmol/L</em></div>
    </label>
    <label>
      <span>记录时间 <b class="metric-required">※</b></span>
      <input id="uricRecordEditTime" type="datetime-local" value="${escapeAttr(weightRecordInputTime(record.time))}">
    </label>
    <label class="weight-record-note-field">
      <span>备注</span>
      <textarea id="uricRecordEditNote" maxlength="100" placeholder="请输入备注">${escapeAttr(record.note || "")}</textarea>
    </label>
    <p class="weight-record-edit-error" id="uricRecordEditError"></p>
  `;
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
  if (!Number.isFinite(value) || value < 1 || value > 1500) {
    if (error) error.textContent = "请输入 1 ~ 1500 μmol/L 范围内的尿酸值";
    valueInput?.focus();
    return;
  }
  if (!time) {
    if (error) error.textContent = "请选择记录时间";
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

function renderMetricDetail() {
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
  selectedFocusMetric = metric.id;
  metricDetailPage?.classList.toggle("weight-detail-mode", metric.id === "weight");
  metricDetailPage?.classList.toggle("pressure-detail-mode", metric.id === "bp");
  metricDetailPage?.classList.toggle("sugar-detail-mode", metric.id === "sugar");
  metricDetailPage?.classList.toggle("heart-detail-mode", metric.id === "heart");
  metricDetailPage?.classList.toggle("lipid-detail-mode", metric.id === "lipid");
  metricDetailPage?.classList.toggle("uric-detail-mode", metric.id === "uric");
  metricDetailPage?.classList.toggle("waist-detail-mode", metric.id === "waist");
  const lipidPanel = document.querySelector("#lipidDetailPanel");
  if (lipidPanel) lipidPanel.hidden = metric.id !== "lipid";
  document.querySelector("#lipidHeaderDelete")?.toggleAttribute("hidden", metric.id !== "lipid");
  const uricPanel = document.querySelector("#uricDetailPanel");
  if (uricPanel) uricPanel.hidden = metric.id !== "uric";
  document.querySelector("#uricHeaderDelete")?.toggleAttribute("hidden", metric.id !== "uric");
  const waistPanel = document.querySelector("#waistDetailPanel");
  if (waistPanel) waistPanel.hidden = metric.id !== "waist";
  document.querySelector("#waistTrendButton")?.toggleAttribute("hidden", metric.id !== "waist" || waistDetailMode === "record");
  ensurePressureDetailExtras();
  document.querySelector("#metricSugarLowBlock")?.toggleAttribute("hidden", metric.id !== "sugar");
  resetMetricDetailExtras(metric.id);
  if (metric.id === "weight") {
    renderWeightMetricDetail(metric);
    return;
  }
  if (metric.id === "bp") {
    renderPressureMetricDetail(metric);
    return;
  }
  if (metric.id === "sugar") {
    renderSugarMetricDetail(metric);
    return;
  }
  if (metric.id === "heart") {
    renderHeartMetricDetail(metric);
    return;
  }
  if (metric.id === "lipid") {
    renderLipidMetricDetail(metric);
    return;
  }
  if (metric.id === "uric") {
    renderUricMetricDetail(metric);
    return;
  }
  if (metric.id === "waist") {
    renderWaistMetricDetail(metric);
    return;
  }
  const values = rangeMetricValues(metric, selectedMetricRange);
  const labels = metricRangeLabels(selectedMetricRange, values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const spread = max - min || 1;
  const points = values.map((value, index) => {
    const x = 24 + index * (272 / Math.max(values.length - 1, 1));
    const y = 132 - ((value - min) / spread) * 82;
    return { x, y, value, label: labels[index] };
  });
  metricDetailTitle.textContent = `${metric.name}详情`;
  metricDetailValue.textContent = metric.display;
  metricDetailUnit.textContent = metric.unit;
  metricDetailStatus.textContent = metric.status;
  metricDetailStatus.classList.toggle("attention", Boolean(metric.attention));
  const savedRecords = metricRecordsFor(metric.id);
  metricDetailTime.textContent = savedRecords.length
    ? `最近记录 ${displayMetricRecordTime(savedRecords[0].time)}`
    : `最近记录 ${dateInputValue(selectedMetricDate).replaceAll("-", "/")} 08:20`;
  metricDateCurrent.textContent = metricDateLabel();
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = selectedMetricRange === "day" ? "近24小时" : selectedMetricRange === "week" ? "近7天" : "近30天";
  metricStatAverage.textContent = `${formatMetricNumber(average)} ${metric.unit}`.trim();
  metricLineChart.innerHTML = `
    <svg viewBox="0 0 320 170" role="img" aria-label="${metric.name}变化趋势">
      <defs><linearGradient id="metricArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3671ff" stop-opacity=".22"/><stop offset="1" stop-color="#3671ff" stop-opacity="0"/></linearGradient></defs>
      <path d="M24 50H296M24 91H296M24 132H296" stroke="#e7edf7" stroke-width="1" stroke-dasharray="4 4"/>
      <path d="M${points.map((point) => `${point.x} ${point.y}`).join(" L")} L296 140 L24 140 Z" fill="url(#metricArea)"/>
      <polyline points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" fill="none" stroke="#3671ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#fff" stroke="#3671ff" stroke-width="2"/><text x="${point.x}" y="158" text-anchor="middle">${point.label}</text>`).join("")}
    </svg>`;
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
    pageId === "reportDetailPage" || pageId === "aiReparsePage" || pageId === "metricDetailPage" || pageId === "metricRecordsPage" || pageId === "dietRecognizePage" || pageId === "dietResultPage" || pageId === "dietDetailPage" || pageId === "sportDetailPage" || pageId === "medicineRecordsPage" || pageId === "medicineDetailPage" || pageId === "medicineImagePage"
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
      previous === "reportDetailPage" || previous === "aiReparsePage" || previous === "metricDetailPage" || previous === "metricRecordsPage" || previous === "dietRecognizePage" || previous === "dietResultPage" || previous === "dietDetailPage" || previous === "sportDetailPage" || previous === "medicineRecordsPage" || previous === "medicineDetailPage" || previous === "medicineImagePage"
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
