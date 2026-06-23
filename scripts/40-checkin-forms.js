function renderSportCheckin() {
  if (!sportTypeGrid) return;
  sportTypeGrid.querySelectorAll("[data-sport-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sportType === sportSelectedType);
  });
  if (sportOtherField) sportOtherField.classList.toggle("active", sportSelectedType === "other");
  if (sportOtherLabel) sportOtherLabel.textContent = sportSelectedType === "other" && sportOtherName ? sportOtherName : "其他";
  if (sportOtherCount && sportOtherInput) sportOtherCount.textContent = `${sportOtherInput.value.length}/10`;
  if (sportDurationText) sportDurationText.textContent = String(sportDuration);
  sportIntensityOptions?.querySelectorAll("[data-sport-intensity]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sportIntensity === sportSelectedIntensity);
  });
  if (sportTimeText) sportTimeText.textContent = formatSportTimeText(sportTimeValue);
}

function openSportCheckinSheet() {
  closeOverlays();
  sportSelectedType = "walk";
  sportOtherName = "";
  sportDuration = 30;
  sportSelectedIntensity = "medium";
  sportTimeValue = localDateTimeValue();
  if (sportOtherInput) sportOtherInput.value = "";
  if (sportNoteInput) sportNoteInput.value = "";
  updateSportNoteCount();
  renderSportCheckin();
  sheetMask.classList.add("active");
  sportCheckinSheet?.classList.add("active");
}

function populateSportTimePicker() {
  if (!sportPickerDate || !sportPickerHour || !sportPickerMinute) return;
  const selected = sportTimeValue ? new Date(sportTimeValue) : new Date();
  const pad = (value) => String(value).padStart(2, "0");
  sportPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  sportPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => `<option value="${pad(hour)}">${pad(hour)}</option>`).join("");
  sportPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const minute = pad(index * 5);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  sportPickerDate.value = `${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`;
  sportPickerHour.value = pad(selected.getHours());
  sportPickerMinute.value = pad(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openSportTimePicker() {
  populateSportTimePicker();
  sportTimePicker?.classList.add("active");
}

function closeSportTimePicker() {
  sportTimePicker?.classList.remove("active");
}

function confirmSportTimePicker() {
  if (!sportPickerDate?.value || !sportPickerHour?.value || !sportPickerMinute?.value) return;
  sportTimeValue = `${sportPickerDate.value}T${sportPickerHour.value}:${sportPickerMinute.value}`;
  renderSportCheckin();
  closeSportTimePicker();
}

function submitSportCheckin() {
  if (sportSelectedType === "other" && !sportOtherName) {
    showToast("请输入运动名称");
    sportOtherInput?.focus();
    return;
  }
  const rule = sportTypes[sportSelectedType] || sportTypes.walk;
  const calories = sportDuration * rule.kcal;
  const record = {
    id: `sport-${Date.now()}`,
    type: sportSelectedType,
    name: currentSportName(),
    duration: sportDuration,
    intensity: sportSelectedIntensity,
    intensityLabel: sportIntensities[sportSelectedIntensity] || "中强度",
    calories,
    kcalRate: rule.kcal,
    time: sportTimeValue || localDateTimeValue()
  };
  const data = scheduleDataFor();
  const sportItem = data.checkins.find((item) => item.type === "sport");
  const records = Array.isArray(sportItem?.records) ? [...sportItem.records] : [];
  records.unshift(record);
  const totalDuration = records.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const totalCalories = records.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const nextSportItem = {
    type: "sport",
    title: "运动打卡",
    desc: `总时长 ${totalDuration}分钟`,
    count: `已记录 ${records.length} 次`,
    value: `消耗 ${totalCalories} kcal`,
    duration: totalDuration,
    totalDuration,
    calories: totalCalories,
    totalCalories,
    latestRecordTime: formatSportTimeText(record.time),
    records
  };
  if (sportItem) Object.assign(sportItem, nextSportItem);
  else data.checkins.unshift(nextSportItem);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  renderSchedule();
  if (sportSuccessSummary) sportSuccessSummary.textContent = `本次运动：${currentSportName()} ${sportDuration}分钟`;
  if (sportCalories) sportCalories.textContent = `${calories} kcal`;
  sportCheckinSheet?.classList.remove("active");
  sportTimePicker?.classList.remove("active");
  sheetMask.classList.add("active");
  sportSuccessDialog?.classList.add("active");
}

function closeSportSuccessDialog() {
  closeOverlays();
  showToast("运动打卡已完成");
}

function formatWeightTimeText(value) {
  return formatCheckinTimeDisplay(value);
}

function updateWeightTimeText() {
  if (weightTimeText) weightTimeText.textContent = formatWeightTimeText(weightCheckinTimeValue);
}

function updateWeightNoteCount() {
  if (!weightNoteInput || !weightNoteCount) return;
  weightNoteCount.textContent = `${weightNoteInput.value.length}/100`;
}

function normalizeDecimal(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function setWeightField(field, value) {
  const input = field === "fat" ? weightFatInput : weightValueInput;
  if (!input) return;
  input.value = Number(value).toFixed(1);
  validateWeightInputs(false);
}

function stepWeightField(field, delta) {
  const input = field === "fat" ? weightFatInput : weightValueInput;
  const min = field === "fat" ? 3 : 20;
  const max = field === "fat" ? 70 : 300;
  const fallback = field === "fat" ? 24.5 : 68.5;
  const current = normalizeDecimal(input?.value, fallback);
  const next = Math.min(max, Math.max(min, current + delta));
  setWeightField(field, next);
}

function validateWeightInputs(showError = true) {
  const weight = Number(weightValueInput?.value);
  const fatRaw = weightFatInput?.value?.trim() || "";
  const fat = Number(fatRaw);
  let valid = true;
  if (!weightValueInput?.value) {
    if (showError) showToast("请输入体重");
    valid = false;
  } else if (!Number.isFinite(weight) || weight < 20 || weight > 300) {
    weightValueHint.textContent = "请输入正确的体重";
    weightValueHint.classList.add("error");
    valid = false;
  } else {
    weightValueHint.textContent = "";
    weightValueHint.classList.remove("error");
  }
  if (fatRaw && (!Number.isFinite(fat) || fat < 3 || fat > 70)) {
    weightFatHint.textContent = "请输入正确的体脂率";
    weightFatHint.classList.add("error");
    valid = false;
  } else {
    weightFatHint.textContent = "";
    weightFatHint.classList.remove("error");
  }
  return valid;
}

function openWeightCheckinPage() {
  closeOverlays();
  weightCheckinTimeValue = localDateTimeInputValue();
  if (weightValueInput) weightValueInput.value = "68.5";
  if (weightFatInput) weightFatInput.value = "24.5";
  if (weightNoteInput) weightNoteInput.value = "";
  updateWeightTimeText();
  updateWeightNoteCount();
  validateWeightInputs(false);
  sheetMask?.classList.add("active");
  weightCheckinPage?.classList.add("active");
}

function populateWeightTimePicker() {
  if (!weightPickerDate || !weightPickerHour || !weightPickerMinute) return;
  const selected = weightCheckinTimeValue ? new Date(weightCheckinTimeValue) : new Date();
  weightPickerDate.innerHTML = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  weightPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => `<option value="${padDateNumber(hour)}">${padDateNumber(hour)}</option>`).join("");
  weightPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const minute = padDateNumber(index * 5);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  weightPickerDate.value = dateInputValue(selected);
  weightPickerHour.value = padDateNumber(selected.getHours());
  weightPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openWeightTimePicker() {
  populateWeightTimePicker();
  sheetMask?.classList.add("active");
  weightTimePicker?.classList.add("active");
}

function closeWeightTimePicker() {
  weightTimePicker?.classList.remove("active");
  if (!weightCheckinPage?.classList.contains("active")) sheetMask?.classList.remove("active");
}

function confirmWeightTimePicker() {
  if (!weightPickerDate?.value || !weightPickerHour?.value || !weightPickerMinute?.value) return;
  weightCheckinTimeValue = `${weightPickerDate.value}T${weightPickerHour.value}:${weightPickerMinute.value}`;
  updateWeightTimeText();
  closeWeightTimePicker();
}

function submitWeightCheckin() {
  if (!validateWeightInputs(true)) return;
  if (!weightCheckinTimeValue) {
    showToast("请选择记录时间");
    return;
  }
  const weightValue = Number(weightValueInput.value);
  const fatValue = weightFatInput.value ? Number(weightFatInput.value) : null;
  const records = [
    {
      metricId: "weight",
      value: weightValue,
      display: formatMetricNumber(weightValue),
      unit: "kg",
      values: { value: weightValue }
    }
  ];
  if (Number.isFinite(fatValue)) {
    records.push({
      metricId: "fat",
      value: fatValue,
      display: formatMetricNumber(fatValue),
      unit: "%",
      values: { value: fatValue }
    });
  }
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  records.forEach((record) => {
    const status = metricStatus(record.metricId, record.values);
    if (!metricRecordsByPatient[currentPatient.id][record.metricId]) metricRecordsByPatient[currentPatient.id][record.metricId] = [];
    const savedRecord = {
      id: `metric-${record.metricId}-${Date.now()}`,
      time: weightCheckinTimeValue,
      display: record.display,
      chartValue: record.value,
      unit: record.unit,
      status: status.text,
      attention: status.attention,
      values: record.values,
      note: weightNoteInput?.value.trim() || ""
    };
    metricRecordsByPatient[currentPatient.id][record.metricId].unshift(savedRecord);
    updateScheduleMetricCheckin(record.metricId, savedRecord);
  });
  saveMetricRecords();
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  closeOverlays();
  const successLines = [{ label: "当前体重", value: formatMetricNumber(weightValue), unit: "kg" }];
  if (Number.isFinite(fatValue)) successLines.push({ label: "体脂率", value: formatMetricNumber(fatValue), unit: "%" });
  showUnifiedCheckinSuccess(successLines);
}

function waistMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "waist");
}

function formatWaistTimeText(value) {
  return formatCheckinTimeDisplay(value);
}

function updateWaistTimeText() {
  if (waistTimeText) waistTimeText.textContent = formatWaistTimeText(waistCheckinTimeValue);
}

function updateWaistNoteCount() {
  if (waistNoteCount) waistNoteCount.textContent = `${waistNoteInput?.value.length || 0}/100`;
}

function stepWaistValue(delta) {
  const current = normalizeDecimal(waistValueInput?.value, 82.5);
  const next = Math.min(200, Math.max(40, current + delta));
  if (waistValueInput) waistValueInput.value = next.toFixed(1);
  if (waistError) waistError.textContent = "";
}

function openWaistCheckinSheet(recordId = "") {
  closeOverlays();
  editingWaistRecordId = recordId;
  const editingRecord = recordId ? waistRecordById(recordId) : null;
  const latest = metricRecordsFor("waist")[0];
  const metric = waistMetric();
  if (waistValueInput) waistValueInput.value = editingRecord?.display || latest?.display || metric?.display || "82.5";
  waistCheckinTimeValue = editingRecord?.time || localDateTimeInputValue();
  if (waistNoteInput) waistNoteInput.value = editingRecord?.note || "";
  if (waistError) waistError.textContent = "";
  updateWaistTimeText();
  updateWaistNoteCount();
  sheetMask.classList.add("active");
  waistCheckinSheet?.classList.add("active");
  window.setTimeout(() => waistValueInput?.select(), 80);
}

function populateWaistTimePicker() {
  if (!waistPickerDate || !waistPickerHour || !waistPickerMinute) return;
  const selected = waistCheckinTimeValue ? new Date(waistCheckinTimeValue) : new Date();
  waistPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  waistPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  waistPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  waistPickerDate.value = dateInputValue(selected);
  waistPickerHour.value = padDateNumber(selected.getHours());
  waistPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openWaistTimePicker() {
  populateWaistTimePicker();
  waistTimePicker?.classList.add("active");
}

function closeWaistTimePicker() {
  waistTimePicker?.classList.remove("active");
}

function confirmWaistTimePicker() {
  if (!waistPickerDate?.value || !waistPickerHour?.value || !waistPickerMinute?.value) return;
  waistCheckinTimeValue = `${waistPickerDate.value}T${waistPickerHour.value}:${waistPickerMinute.value}`;
  updateWaistTimeText();
  closeWaistTimePicker();
}

function saveWaistCheckin() {
  const value = Number(waistValueInput?.value);
  if (!waistValueInput?.value || !Number.isFinite(value) || value < 40 || value > 200) {
    if (waistError) waistError.textContent = "请填写 40.0 ~ 200.0 cm 范围内的腰围";
    waistValueInput?.focus();
    return;
  }
  if (!waistCheckinTimeValue) {
    if (waistError) waistError.textContent = "请选择记录时间";
    return;
  }
  const metric = waistMetric();
  const display = formatMetricNumber(value);
  const status = metricStatus("waist", { value });
  const record = {
    id: editingWaistRecordId?.startsWith("waist-sample") ? `metric-waist-${Date.now()}` : editingWaistRecordId || `metric-waist-${Date.now()}`,
    time: waistCheckinTimeValue,
    display,
    chartValue: value,
    unit: "cm",
    status: status.text,
    attention: status.attention,
    values: { value },
    note: waistNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].waist) metricRecordsByPatient[currentPatient.id].waist = [];
  const records = metricRecordsByPatient[currentPatient.id].waist;
  const recordIndex = records.findIndex((item) => item.id === editingWaistRecordId);
  if (recordIndex >= 0) records[recordIndex] = record;
  else records.unshift(record);
  metricRecordsByPatient[currentPatient.id].waist.sort((a, b) => new Date(b.time) - new Date(a.time));
  updateScheduleMetricCheckin("waist", record);
  saveMetricRecords();
  if (metric) {
    metric.value = value;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, value].slice(-7);
  }
  selectedFocusMetric = "waist";
  selectedWaistRecordId = record.id;
  waistDetailMode = "list";
  selectedMetricDate = new Date(waistCheckinTimeValue);
  editingWaistRecordId = "";
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  showUnifiedCheckinSuccess([
    { label: "当前腰围", value: display, unit: "cm" }
  ]);
}

function formatPressureTimeText(value) {
  return formatCheckinTimeDisplay(value);
}

function updatePressureTimeText() {
  if (pressureTimeText) pressureTimeText.textContent = formatPressureTimeText(pressureCheckinTimeValue);
}

function updatePressureNoteCount() {
  if (pressureNoteCount) pressureNoteCount.textContent = `${pressureNoteInput?.value.length || 0}/100`;
}

function pressureFieldConfig(field) {
  return {
    systolic: { input: pressureSystolicInput, hint: pressureSystolicHint, min: 60, max: 250, unit: "mmHg", label: "收缩压" },
    diastolic: { input: pressureDiastolicInput, hint: pressureDiastolicHint, min: 40, max: 150, unit: "mmHg", label: "舒张压" },
    pulse: { input: pressurePulseInput, hint: pressurePulseHint, min: 40, max: 200, unit: "次/分", label: "脉搏", optional: true }
  }[field];
}

function validatePressureInputs(showError = false) {
  const fields = ["systolic", "diastolic", "pulse"];
  let valid = true;
  fields.forEach((field) => {
    const config = pressureFieldConfig(field);
    if (!config?.input || !config.hint) return;
    const emptyOptional = config.optional && !config.input.value;
    const value = Number(config.input.value);
    const invalid = !emptyOptional && (!config.input.value || !Number.isFinite(value) || value < config.min || value > config.max);
    config.hint.classList.toggle("error", invalid);
    config.hint.textContent = invalid && showError
      ? `请填写 ${config.min} ~ ${config.max} ${config.unit} 范围内的${config.label}`
      : `可录入范围：${config.min} ~ ${config.max} ${config.unit}`;
    if (invalid) valid = false;
  });
  if (pressureError) pressureError.textContent = valid ? "" : "请检查血压数值是否在可录入范围内";
  return valid;
}

function stepPressureField(field, delta) {
  const config = pressureFieldConfig(field);
  if (!config?.input) return;
  const fallback = field === "systolic" ? 120 : field === "diastolic" ? 80 : 72;
  const current = Number(config.input.value || fallback);
  const next = Math.min(config.max, Math.max(config.min, Math.round(current + delta)));
  config.input.value = String(next);
  validatePressureInputs(false);
}

function pressureMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "bp");
}

function openPressureCheckinSheet() {
  closeOverlays();
  const latest = metricRecordsFor("bp")[0];
  const metric = pressureMetric();
  const latestValues = latest?.values || {};
  const displayParts = String(latest?.display || metric?.display || "120/80").split("/");
  if (pressureSystolicInput) pressureSystolicInput.value = String(latestValues.systolic || Number(displayParts[0]) || 120);
  if (pressureDiastolicInput) pressureDiastolicInput.value = String(latestValues.diastolic || Number(displayParts[1]) || 80);
  if (pressurePulseInput) pressurePulseInput.value = String(latestValues.pulse || 72);
  pressureCheckinTimeValue = localDateTimeInputValue();
  if (pressureNoteInput) pressureNoteInput.value = "";
  if (pressureError) pressureError.textContent = "";
  updatePressureTimeText();
  updatePressureNoteCount();
  validatePressureInputs(false);
  sheetMask.classList.add("active");
  pressureCheckinSheet?.classList.add("active");
  window.setTimeout(() => pressureSystolicInput?.select(), 80);
}

function populatePressureTimePicker() {
  if (!pressurePickerDate || !pressurePickerHour || !pressurePickerMinute) return;
  const selected = pressureCheckinTimeValue ? new Date(pressureCheckinTimeValue) : new Date();
  pressurePickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  pressurePickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  pressurePickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  pressurePickerDate.value = dateInputValue(selected);
  pressurePickerHour.value = padDateNumber(selected.getHours());
  pressurePickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openPressureTimePicker() {
  populatePressureTimePicker();
  pressureTimePicker?.classList.add("active");
}

function closePressureTimePicker() {
  pressureTimePicker?.classList.remove("active");
}

function confirmPressureTimePicker() {
  if (!pressurePickerDate?.value || !pressurePickerHour?.value || !pressurePickerMinute?.value) return;
  pressureCheckinTimeValue = `${pressurePickerDate.value}T${pressurePickerHour.value}:${pressurePickerMinute.value}`;
  updatePressureTimeText();
  closePressureTimePicker();
}

function updateSchedulePressureCheckin(display, pulse) {
  const data = scheduleDataFor();
  const timeText = checkinTimeText(pressureCheckinTimeValue) || "--:--";
  const existing = data.checkins.find((item) => item.type === "pressure");
  const payload = {
    type: "pressure",
    title: "血压打卡",
    desc: "记录收缩压、舒张压、脉搏",
    count: "已记录 1 次",
    value: `${display} mmHg ${timeText}`,
    values: { systolic: Number(pressureSystolicInput?.value), diastolic: Number(pressureDiastolicInput?.value), pulse },
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function submitPressureCheckin() {
  if (!validatePressureInputs(true)) return;
  if (!pressureCheckinTimeValue) {
    if (pressureError) pressureError.textContent = "请选择记录时间";
    return;
  }
  const systolic = Number(pressureSystolicInput?.value);
  const diastolic = Number(pressureDiastolicInput?.value);
  const pulse = pressurePulseInput?.value ? Number(pressurePulseInput.value) : null;
  const display = `${systolic}/${diastolic}`;
  const values = { systolic, diastolic };
  if (Number.isFinite(pulse)) values.pulse = pulse;
  const status = metricStatus("bp", values);
  const record = {
    id: `metric-bp-${Date.now()}`,
    time: pressureCheckinTimeValue,
    display,
    chartValue: systolic,
    unit: "mmHg",
    status: status.text,
    attention: status.attention,
    values,
    note: pressureNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].bp) metricRecordsByPatient[currentPatient.id].bp = [];
  metricRecordsByPatient[currentPatient.id].bp.unshift(record);
  saveMetricRecords();
  const metric = pressureMetric();
  if (metric) {
    metric.value = systolic;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, systolic].slice(-7);
  }
  updateSchedulePressureCheckin(display, Number.isFinite(pulse) ? pulse : null);
  selectedFocusMetric = "bp";
  selectedMetricDate = new Date(pressureCheckinTimeValue);
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  const successLines = [{ label: "当前血压", value: display, unit: "mmHg" }];
  if (Number.isFinite(pulse)) successLines.push({ label: "脉搏", value: `${pulse}`, unit: "次/分" });
  showUnifiedCheckinSuccess(successLines);
}

function sugarMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "sugar");
}

function recommendedSugarPeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "凌晨";
  if (hour < 9) return "空腹";
  if (hour < 11) return "早餐后2h";
  if (hour < 15) return "午餐后2h";
  if (hour < 21) return "晚餐后2h";
  return "睡前";
}

function formatSugarTimeText(value) {
  return formatCheckinTimeDisplay(value, "请选择记录时间");
}

function updateSugarPeriodSelect() {
  if (sugarPeriodSelect) sugarPeriodSelect.value = sugarSelectedPeriod;
}

function stepSugarValue(delta) {
  const current = normalizeDecimal(sugarValueInput?.value, 5);
  const next = Math.min(33.3, Math.max(1, current + delta));
  if (sugarValueInput) sugarValueInput.value = next.toFixed(1);
  validateSugarInput(false);
}

function updateSugarTimeText() {
  if (sugarTimeText) sugarTimeText.textContent = formatSugarTimeText(sugarCheckinTimeValue);
}

function updateSugarNoteCount() {
  if (sugarNoteCount) sugarNoteCount.textContent = `${sugarNoteInput?.value.length || 0}/100`;
}

function validateSugarInput(showError = false) {
  const value = Number(sugarValueInput?.value);
  const valid = Boolean(sugarValueInput?.value) && Number.isFinite(value) && value >= 1 && value <= 33.3;
  sugarValueInput?.closest(".sugar-stepper")?.classList.toggle("error", !valid && showError);
  if (sugarValueHint) {
    sugarValueHint.classList.toggle("error", !valid && showError);
    sugarValueHint.textContent = !valid && showError ? "请填写 1.0 ~ 33.3 mmol/L 范围内的血糖值" : "建议范围：1.0 ~ 33.3 mmol/L";
  }
  if (sugarError) sugarError.textContent = valid ? "" : (showError ? "请填写血糖值" : "");
  return valid;
}

function openSugarCheckinSheet() {
  closeOverlays();
  const now = new Date();
  sugarSelectedPeriod = recommendedSugarPeriod(now);
  sugarCheckinTimeValue = localDateTimeInputValue(now);
  if (sugarValueInput) sugarValueInput.value = "5.0";
  if (sugarNoteInput) sugarNoteInput.value = "";
  if (sugarError) sugarError.textContent = "";
  sugarValueInput?.closest(".sugar-stepper")?.classList.remove("error");
  updateSugarTimeText();
  updateSugarNoteCount();
  validateSugarInput(false);
  updateSugarPeriodSelect();
  sheetMask.classList.add("active");
  sugarCheckinSheet?.classList.add("active");
  window.setTimeout(() => sugarValueInput?.focus(), 80);
}

function populateSugarTimePicker() {
  if (!sugarPickerDate || !sugarPickerHour || !sugarPickerMinute) return;
  const selected = sugarCheckinTimeValue ? new Date(sugarCheckinTimeValue) : new Date();
  sugarPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  sugarPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  sugarPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  sugarPickerDate.value = dateInputValue(selected);
  sugarPickerHour.value = padDateNumber(selected.getHours());
  sugarPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openSugarTimePicker() {
  populateSugarTimePicker();
  sugarTimePicker?.classList.add("active");
}

function closeSugarTimePicker() {
  sugarTimePicker?.classList.remove("active");
}

function confirmSugarTimePicker() {
  if (!sugarPickerDate?.value || !sugarPickerHour?.value || !sugarPickerMinute?.value) return;
  sugarCheckinTimeValue = `${sugarPickerDate.value}T${sugarPickerHour.value}:${sugarPickerMinute.value}`;
  updateSugarTimeText();
  closeSugarTimePicker();
}

function updateScheduleSugarCheckin(record) {
  const data = scheduleDataFor();
  const existing = data.checkins.find((item) => item.type === "sugar");
  const timeText = checkinTimeText(record.time) || "--:--";
  const payload = {
    type: "sugar",
    title: "血糖打卡",
    desc: "记录空腹/餐后血糖",
    count: "已记录 1 次",
    value: `${record.values.period} ${record.display} mmol/L ${timeText}`,
    display: record.display,
    values: record.values,
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function submitSugarCheckin() {
  if (!validateSugarInput(true)) {
    sugarValueInput?.focus();
    return;
  }
  if (!sugarCheckinTimeValue) {
    if (sugarError) sugarError.textContent = "请选择记录时间";
    return;
  }
  const value = Number(sugarValueInput.value);
  const display = formatMetricNumber(value);
  const values = { value, period: sugarSelectedPeriod };
  const status = metricStatus("sugar", values);
  const record = {
    id: `metric-sugar-${Date.now()}`,
    time: sugarCheckinTimeValue,
    display,
    chartValue: value,
    unit: "mmol/L",
    status: status.text,
    attention: status.attention,
    values,
    note: sugarNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].sugar) metricRecordsByPatient[currentPatient.id].sugar = [];
  metricRecordsByPatient[currentPatient.id].sugar.unshift(record);
  saveMetricRecords();
  const metric = sugarMetric();
  if (metric) {
    metric.value = value;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, value].slice(-7);
  }
  updateScheduleSugarCheckin(record);
  selectedFocusMetric = "sugar";
  selectedMetricDate = new Date(sugarCheckinTimeValue);
  sugarCheckinSheet?.classList.remove("active");
  sugarTimePicker?.classList.remove("active");
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  showUnifiedCheckinSuccess([
    { label: `${sugarSelectedPeriod}血糖为`, value: display, unit: "mmol/L" }
  ]);
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
