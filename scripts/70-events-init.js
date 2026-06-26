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
    if (metricDetailPage?.classList.contains("active") && selectedFocusMetric === "uric" && uricDetailMode === "record") {
      event.preventDefault();
      uricDetailMode = "list";
      renderMetricDetail();
      return;
    }
    if (metricDetailPage?.classList.contains("active") && selectedFocusMetric === "waist" && waistDetailMode === "record") {
      event.preventDefault();
      waistDetailMode = "list";
      renderMetricDetail();
      return;
    }
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
    showUnifiedCheckinSuccess([
      { label: "经期结束", value: selectedDate }
    ]);
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
    showUnifiedCheckinSuccess([
      { label: "经期开始", value: selectedDate }
    ]);
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
  cameraPage?.classList.remove("active");
  cameraPage?.classList.remove("diet-camera");
  metricRecordSheet?.classList.remove("active");
  metricRecordTimePicker?.classList.remove("active");
  editingMetricRecordId = "";
  if (metricRecordConfirm) metricRecordConfirm.textContent = "打卡";
  document.querySelector("#metricRecordInlineDelete")?.remove();
  document.querySelector("#metricRecordActions")?.classList.remove("has-delete");
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
  metricDeleteDialog?.classList.remove("active");
  weightRecordDetailDialog?.classList.remove("active");
  heartRecordDetailDialog?.classList.remove("active");
  supplementDialog.classList.remove("active");
  reportDeleteDialog.classList.remove("active");
  taskDeleteDialog.classList.remove("active");
  schedulePatientSheet?.classList.remove("active");
  scheduleCheckinSheet?.classList.remove("active");
  dietUploadSheet?.classList.remove("active");
  dietUploadActionSheet?.classList.remove("active");
  dietTimePicker?.classList.remove("active");
  dietTaskBindSheet?.classList.remove("active");
  dietGramSheet?.classList.remove("active");
  medicineCheckinSheet?.classList.remove("active");
  medicineItemDetailSheet?.classList.remove("active");
  medicineTimePicker?.classList.remove("active");
  sportCheckinSheet?.classList.remove("active");
  sportTimePicker?.classList.remove("active");
  sportRecordEditor?.classList.remove("active");
  sportSuccessDialog?.classList.remove("active");
  weightCheckinPage?.classList.remove("active");
  weightTimePicker?.classList.remove("active");
  waistCheckinSheet?.classList.remove("active");
  waistTimePicker?.classList.remove("active");
  editingWaistRecordId = "";
  pressureCheckinSheet?.classList.remove("active");
  pressureTimePicker?.classList.remove("active");
  pressureSuccessDialog?.classList.remove("active");
  sugarCheckinSheet?.classList.remove("active");
  sugarTimePicker?.classList.remove("active");
  sugarSuccessDialog?.classList.remove("active");
  unifiedCheckinSuccessDialog?.classList.remove("active");
  checkinSuccessDialog?.classList.remove("active");
  pendingDietTaskBinding = false;
  selectedDietTaskBindingId = "";
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
  const camera = event.target.closest("[data-open-camera]");
  const document = event.target.closest("[data-open-document]");
  if (remove) {
    const [removed] = selectedUploadFiles.splice(Number(remove.dataset.removeFile), 1);
    if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
    renderSelectedFiles();
  }
  if (picker) {
    addMockFile(picker.dataset.mockFile);
  }
  if (camera) {
    openCameraPage();
  }
  if (document) {
    documentPicker?.click();
  }
});
cameraBack?.addEventListener("click", returnToUploadSheet);
cameraShutter?.addEventListener("click", captureReportImage);
albumPicker?.addEventListener("change", () => {
  if (albumPicker.files?.length) {
    if (cameraMode === "diet") {
      addDietFiles(albumPicker.files);
      returnToUploadSheet();
    } else {
      addSelectedImages(albumPicker.files);
    }
  }
  albumPicker.value = "";
});
documentPicker?.addEventListener("change", () => {
  if (documentPicker.files?.length) addSelectedDocuments(documentPicker.files);
  documentPicker.value = "";
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

focusMetricGrid?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-focus-metric]");
  if (card) openMetricDetail(card.dataset.focusMetric);
});

metricRangeTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-metric-range]");
  if (!button) return;
  selectedMetricRange = button.dataset.metricRange;
  metricRangeTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  renderMetricDetail();
});

metricDateNav?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-metric-date-step]");
  if (stepButton) {
    shiftMetricDate(Number(stepButton.dataset.metricDateStep));
    return;
  }
  if (event.target.closest("#metricDateCurrent")) {
    if (typeof metricDatePicker.showPicker === "function") metricDatePicker.showPicker();
    else metricDatePicker.click();
  }
});

metricDatePicker?.addEventListener("change", () => {
  if (!metricDatePicker.value) return;
  const [year, month, day] = metricDatePicker.value.split("-").map(Number);
  selectedMetricDate = new Date(year, month - 1, day);
  renderMetricDetail();
});

metricRecordEntry?.addEventListener("click", () => {
  if (selectedFocusMetric === "weight") {
    openWeightCheckinPage();
    return;
  }
  if (selectedFocusMetric === "waist") {
    openWaistCheckinSheet();
    return;
  }
  if (selectedFocusMetric === "sugar") {
    openSugarCheckinSheet();
    return;
  }
  if (selectedFocusMetric === "bp") {
    openPressureCheckinSheet();
    return;
  }
  openMetricRecordSheet();
});
metricRecordTimeTrigger?.addEventListener("click", openMetricRecordTimePicker);
document.querySelector(".metric-record-picker-cancel")?.addEventListener("click", closeMetricRecordTimePicker);
document.querySelector(".metric-record-picker-confirm")?.addEventListener("click", confirmMetricRecordTimePicker);
metricAllRecords?.addEventListener("click", () => {
  renderAllMetricRecords();
  openSubPage("metricRecordsPage");
});
allCheckinFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-all-checkin-filter]");
  if (!button) return;
  renderAllCheckinRecords(button.dataset.allCheckinFilter || "all");
});
metricRecordsGroups?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-metric-record]");
  if (deleteButton) {
    openMetricDeleteDialog(deleteButton.dataset.deleteMetricRecord);
    return;
  }
  const checkinCard = event.target.closest("[data-checkin-record-type]");
  if (checkinCard) openAllCheckinRecordDetail(checkinCard.dataset.checkinRecordType, checkinCard.dataset.checkinRecordId);
});
metricRecordsGroups?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const checkinCard = event.target.closest("[data-checkin-record-type]");
  if (!checkinCard) return;
  event.preventDefault();
  openAllCheckinRecordDetail(checkinCard.dataset.checkinRecordType, checkinCard.dataset.checkinRecordId);
});
weightDetailRecords?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-weight-record-key]");
  if (card) openWeightRecordDetail(card.dataset.weightRecordKey);
});
weightDetailRecords?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-weight-record-key]");
  if (!card) return;
  event.preventDefault();
  openWeightRecordDetail(card.dataset.weightRecordKey);
});
heartRecordsList?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-heart-record-id]");
  if (card) openHeartRecordDetail(card.dataset.heartRecordId);
});
heartRecordsList?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-heart-record-id]");
  if (!card) return;
  event.preventDefault();
  openHeartRecordDetail(card.dataset.heartRecordId);
});
document.querySelector(".metric-record-close")?.addEventListener("click", closeOverlays);
document.querySelector(".weight-record-dialog-close")?.addEventListener("click", closeOverlays);
document.querySelector(".heart-record-dialog-close")?.addEventListener("click", closeOverlays);
metricRecordFields?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-metric-step]");
  if (!button) return;
  stepMetricRecordValue(button.dataset.metricStep, Number(button.dataset.delta));
});
metricRecordFields?.addEventListener("change", (event) => {
  const timeInput = event.target.closest("[data-metric-time]");
  if (!timeInput) return;
  const timeText = metricRecordFields.querySelector(`[data-metric-time-text="${timeInput.dataset.metricTime}"]`);
  if (timeText) timeText.textContent = formatMetricRecordInputTime(timeInput.value);
});
metricRecordNote?.addEventListener("input", updateMetricRecordNoteCount);
metricRecordConfirm?.addEventListener("click", saveMetricRecord);
document.querySelector(".metric-delete-confirm")?.addEventListener("click", confirmMetricRecordDelete);
weightRecordDeleteAction?.addEventListener("click", deleteSelectedWeightRecord);
weightRecordSaveAction?.addEventListener("click", saveSelectedWeightRecord);
heartRecordDeleteAction?.addEventListener("click", deleteSelectedHeartRecord);
heartRecordSaveAction?.addEventListener("click", saveSelectedHeartRecord);

dietUploadArea?.addEventListener("click", () => openDietCameraPage());
dietImageGrid?.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-diet-image]");
  const add = event.target.closest("[data-add-diet-image]");
  if (remove) {
    const [removed] = dietUploadImages.splice(Number(remove.dataset.removeDietImage), 1);
    if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
    renderDietUploadImages();
  }
  if (add) openDietCameraPage();
});
dietUploadActionSheet?.addEventListener("click", (event) => {
  if (event.target.closest(".diet-action-cancel")) {
    dietUploadActionSheet.classList.remove("active");
    return;
  }
  const action = event.target.closest("[data-diet-upload-action]");
  if (!action) return;
  dietUploadActionSheet.classList.remove("active");
  if (action.dataset.dietUploadAction === "camera") {
    addDietMockImage();
  } else {
    dietImagePicker?.click();
  }
});
dietImagePicker?.addEventListener("change", () => {
  if (dietImagePicker.files?.length) addDietFiles(dietImagePicker.files);
  dietImagePicker.value = "";
});
dietMealOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-meal]");
  if (!button) return;
  dietSelectedMeal = button.dataset.dietMeal;
  renderDietMealOptions();
});
dietMealTimeTrigger?.addEventListener("click", () => {
  openDietTimePicker("checkin");
});
dietEditTimeTrigger?.addEventListener("click", () => openDietTimePicker("detail"));
document.querySelector(".diet-picker-cancel")?.addEventListener("click", closeDietTimePicker);
document.querySelector(".diet-picker-confirm")?.addEventListener("click", confirmDietTimePicker);
dietCancelUpload?.addEventListener("click", () => {
  activeDietTaskBindingId = "";
  selectedDietTaskBindingId = "";
  pendingDietTaskBinding = false;
  closeOverlays();
});
dietStartRecognize?.addEventListener("click", startDietRecognition);
dietRetryRecognize?.addEventListener("click", () => {
  dietRecognitionIndex = 0;
  runDietRecognitionStep();
});
dietManualFill?.addEventListener("click", () => {
  if (!dietResults.length) dietResults = buildDietResults();
  openDietResultPage();
});
dietResultTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-result-index]");
  if (!button) return;
  dietResultIndex = Number(button.dataset.dietResultIndex);
  renderDietResult();
});
dietFoodList?.addEventListener("click", (event) => {
  const current = dietResults[dietResultIndex] || dietResults[0];
  if (current?.doctorReview || dietResultReadonly) return;
  const editFood = event.target.closest("[data-edit-food]");
  if (editFood) {
    openDietGramSheet(editFood.dataset.editFood);
    return;
  }
  const foodCard = event.target.closest("[data-food-id]");
  if (foodCard) openDietGramSheet(foodCard.dataset.foodId);
});
dietFoodList?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const current = dietResults[dietResultIndex] || dietResults[0];
  if (current?.doctorReview || dietResultReadonly) return;
  const foodCard = event.target.closest("[data-food-id]");
  if (!foodCard) return;
  event.preventDefault();
  openDietGramSheet(foodCard.dataset.foodId);
});
dietDetailRecords?.addEventListener("click", (event) => {
  const mealButton = event.target.closest("[data-detail-meal-index]");
  if (mealButton) {
    openDietMealResult(Number(mealButton.dataset.detailMealIndex));
    return;
  }
  const row = event.target.closest("[data-detail-food]");
  if (row) openDietDetailFoodSheet(row.dataset.detailFood);
});
dietDetailRecords?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const mealButton = event.target.closest("[data-detail-meal-index]");
  if (mealButton) {
    event.preventDefault();
    openDietMealResult(Number(mealButton.dataset.detailMealIndex));
    return;
  }
  const row = event.target.closest("[data-detail-food]");
  if (!row) return;
  event.preventDefault();
  openDietDetailFoodSheet(row.dataset.detailFood);
});
document.querySelector(".diet-gram-close")?.addEventListener("click", closeDietGramSheet);
dietGramCancel?.addEventListener("click", closeDietGramSheet);
dietGramConfirm?.addEventListener("click", confirmDietGramEdit);
dietFoodSheetDelete?.addEventListener("click", deleteEditingDietFood);
dietResultTime?.addEventListener("change", renderDietResult);
dietConfirmCheckin?.addEventListener("click", confirmDietCheckin);
dietTaskBindCancel?.addEventListener("click", closeDietTaskBindSheet);
dietTaskBindClose?.addEventListener("click", closeDietTaskBindSheet);
dietTaskBindConfirm?.addEventListener("click", confirmDietTaskBinding);
dietTaskBindList?.addEventListener("change", (event) => {
  const input = event.target.closest("input[name='dietTaskBinding']");
  if (input) selectedDietTaskBindingId = input.value;
});
dietDetailCheckin?.addEventListener("click", () => openDietCameraPage(true));
dietDetailRecordFood?.addEventListener("click", () => openDietCameraPage(true));
sportDetailCheckin?.addEventListener("click", openSportCheckinSheet);
sportDetailRecords?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-sport-record-id]");
  if (!card) return;
  openSportRecordEditor(card.dataset.sportRecordId);
});
sportDetailRecords?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-sport-record-id]");
  if (!card) return;
  event.preventDefault();
  openSportRecordEditor(card.dataset.sportRecordId);
});
dietDetailRangeTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-range]");
  if (!button) return;
  dietDetailRangeMode = button.dataset.dietRange;
  dietDetailRangeDate = new Date();
  renderDietDetailRange();
});
dietDetailRangeTrigger?.addEventListener("click", () => {
  if (dietDetailRangeMode === "month") {
    if (typeof dietDetailMonthInput?.showPicker === "function") dietDetailMonthInput.showPicker();
    else dietDetailMonthInput?.click();
    return;
  }
  if (dietDetailRangeMode === "year") {
    const nextYear = window.prompt("请选择年份", String(dietDetailRangeDate.getFullYear()));
    if (!nextYear) return;
    const year = Number(nextYear);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      showToast("请输入正确年份");
      return;
    }
    dietDetailRangeDate = new Date(year, 0, 1);
    renderDietDetailRange();
    return;
  }
  if (typeof dietDetailDayInput?.showPicker === "function") dietDetailDayInput.showPicker();
  else dietDetailDayInput?.click();
});
dietDetailDayInput?.addEventListener("change", () => {
  if (!dietDetailDayInput.value) return;
  const [year, month, day] = dietDetailDayInput.value.split("-").map(Number);
  dietDetailRangeDate = new Date(year, month - 1, day);
  renderDietDetailRange();
});
dietDetailMonthInput?.addEventListener("change", () => {
  if (!dietDetailMonthInput.value) return;
  const [year, month] = dietDetailMonthInput.value.split("-").map(Number);
  dietDetailRangeDate = new Date(year, month - 1, 1);
  renderDietDetailRange();
});
medicineClose?.addEventListener("click", closeOverlays);
medicineTimeTrigger?.addEventListener("click", openMedicineTimePicker);
document.querySelector(".medicine-picker-cancel")?.addEventListener("click", closeMedicineTimePicker);
document.querySelector(".medicine-picker-confirm")?.addEventListener("click", confirmMedicineTimePicker);
medicineNote?.addEventListener("input", updateMedicineNoteCount);
medicineAdd?.addEventListener("click", () => {
  saveMedicineNamesFromDom();
  addMedicineItem();
});
medicineList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-medicine-name]");
  if (!input) return;
  const item = medicineItems.find((medicine) => medicine.id === input.dataset.medicineName);
  if (item) item.name = input.value;
});
medicineList?.addEventListener("click", (event) => {
  const typeButton = event.target.closest("[data-medicine-item-type]");
  const deleteButton = event.target.closest("[data-delete-medicine]");
  const addImage = event.target.closest("[data-add-medicine-image]");
  const removeImage = event.target.closest("[data-remove-medicine-image]");
  const historyName = event.target.closest("[data-medicine-history-name]");
  if (historyName) {
    const item = medicineItems.find((medicine) => medicine.id === historyName.dataset.medicineHistoryName);
    const value = historyName.dataset.historyValue || "";
    if (!item || !value) return;
    item.name = value;
    const input = medicineList.querySelector(`[data-medicine-name="${historyName.dataset.medicineHistoryName}"]`);
    if (input) input.value = value;
    renderMedicineItems();
    return;
  }
  if (typeButton) {
    saveMedicineNamesFromDom();
    const item = medicineItems.find((medicine) => medicine.id === typeButton.dataset.medicineItemType);
    if (!item) return;
    item.type = typeButton.dataset.itemType === "nutrition" ? "nutrition" : "medicine";
    renderMedicineItems();
    return;
  }
  if (deleteButton) {
    saveMedicineNamesFromDom();
    deleteMedicineItem(deleteButton.dataset.deleteMedicine);
    return;
  }
  if (addImage) {
    saveMedicineNamesFromDom();
    medicineImageTargetId = addImage.dataset.addMedicineImage;
    medicineImagePicker?.click();
    return;
  }
  if (removeImage) {
    const item = medicineItems.find((medicine) => medicine.id === removeImage.dataset.removeMedicineImage);
    const index = Number(removeImage.dataset.imageIndex);
    if (!item || Number.isNaN(index)) return;
    const [removed] = item.images.splice(index, 1);
    if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
    renderMedicineItems();
  }
});
medicineImagePicker?.addEventListener("change", () => {
  if (medicineImagePicker.files?.length) {
    if (medicineImageTargetId === "__detail_item__") addSelectedMedicineItemImages(medicineImagePicker.files);
    else addMedicineImages(medicineImagePicker.files);
  }
  medicineImagePicker.value = "";
});
medicineConfirm?.addEventListener("click", confirmMedicineCheckin);
medicineRecordsList?.addEventListener("click", (event) => {
  if (event.target.closest(".medicine-empty-action")) {
    openMedicineCheckinSheet();
    return;
  }
  const item = event.target.closest("[data-medicine-item]");
  if (item) {
    event.stopPropagation();
    openMedicineItemDetailSheet(item.dataset.medicineItem, item.dataset.medicineItemId);
    return;
  }
  const row = event.target.closest("[data-medicine-record]");
  if (!row) return;
  openMedicineDetailPage(row.dataset.medicineRecord);
});
medicineDetailSummary?.addEventListener("click", (event) => {
  if (!event.target.closest("[data-medicine-detail-time]")) return;
  openMedicineDetailTimePicker();
});
medicineDetailList?.addEventListener("click", (event) => {
  const image = event.target.closest("[data-medicine-image]");
  if (image) {
    openMedicineImagePage(image.dataset.medicineImage, Number(image.dataset.imageIndex || 0));
    return;
  }
  const item = event.target.closest("[data-medicine-item]");
  if (!item) return;
  openMedicineItemDetailSheet(item.dataset.medicineItem, item.dataset.medicineItemId);
});
medicineDetailEdit?.addEventListener("click", () => openMedicineCheckinSheet(selectedMedicineRecordId));
medicineDetailDelete?.addEventListener("click", deleteSelectedMedicineRecord);
medicineItemDetailClose?.addEventListener("click", closeOverlays);
medicineItemDelete?.addEventListener("click", deleteSelectedMedicineItem);
medicineItemDetailBody?.addEventListener("click", (event) => {
  const typeButton = event.target.closest("[data-edit-medicine-type]");
  if (typeButton) {
    updateSelectedMedicineItemType(typeButton.dataset.editMedicineType);
    return;
  }
  const addImage = event.target.closest("[data-add-detail-medicine-image]");
  if (addImage) {
    medicineImageTargetId = "__detail_item__";
    medicineImagePicker?.click();
    return;
  }
  const removeImage = event.target.closest("[data-remove-detail-medicine-image]");
  if (removeImage) {
    event.stopPropagation();
    removeSelectedMedicineItemImage(Number(removeImage.dataset.removeDetailMedicineImage));
    return;
  }
  const time = event.target.closest("[data-edit-medicine-time]");
  if (time) {
    openMedicineItemTimePicker();
    return;
  }
  const image = event.target.closest("[data-edit-medicine-image-index]");
  if (!image) return;
  closeOverlays();
  const startIndex = medicineItemImageStartIndex(medicineRecordById(selectedMedicineItemRecordId), selectedMedicineItemId);
  openMedicineImagePage(selectedMedicineItemRecordId, startIndex + Number(image.dataset.editMedicineImageIndex || 0));
});
medicineImageClose?.addEventListener("click", goBackPage);
medicineImagePrev?.addEventListener("click", () => stepMedicineImage(-1));
medicineImageNext?.addEventListener("click", () => stepMedicineImage(1));
medicineImageThumbs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preview-index]");
  if (!button) return;
  medicinePreviewIndex = Number(button.dataset.previewIndex || 0);
  renderMedicineImagePage();
});
sportClose?.addEventListener("click", closeOverlays);
sportTypeGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sport-type]");
  if (!button) return;
  sportSelectedType = button.dataset.sportType;
  renderSportCheckin();
  if (sportSelectedType === "other") {
    window.setTimeout(() => sportOtherInput?.focus(), 80);
  }
});
sportOtherInput?.addEventListener("input", () => {
  sportOtherName = sportOtherInput.value.trim();
  renderSportCheckin();
});
sportNoteInput?.addEventListener("input", updateSportNoteCount);
sportMinus?.addEventListener("click", () => {
  sportDuration = Math.max(5, sportDuration - 5);
  renderSportCheckin();
});
sportPlus?.addEventListener("click", () => {
  sportDuration = Math.min(180, sportDuration + 5);
  renderSportCheckin();
});
sportIntensityOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sport-intensity]");
  if (!button) return;
  sportSelectedIntensity = button.dataset.sportIntensity || "medium";
  renderSportCheckin();
});
sportTimeTrigger?.addEventListener("click", openSportTimePicker);
document.querySelector(".sport-picker-cancel")?.addEventListener("click", closeSportTimePicker);
document.querySelector(".sport-picker-confirm")?.addEventListener("click", confirmSportTimePicker);
sportSubmit?.addEventListener("click", submitSportCheckin);
sportRecordClose?.addEventListener("click", closeSportRecordEditor);
sportRecordDurationInput?.addEventListener("input", renderSportRecordEditor);
sportRecordIntensityOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-record-sport-intensity]");
  if (!button) return;
  editingSportRecordIntensity = button.dataset.recordSportIntensity || "medium";
  renderSportRecordEditor();
});
sportRecordTimeTrigger?.addEventListener("click", () => {
  if (typeof sportRecordTimeInput?.showPicker === "function") sportRecordTimeInput.showPicker();
  else sportRecordTimeInput?.click();
});
sportRecordTimeInput?.addEventListener("change", renderSportRecordEditor);
sportRecordSave?.addEventListener("click", saveSportRecordEdit);
sportRecordDelete?.addEventListener("click", deleteSportRecordEdit);
sportSuccessDone?.addEventListener("click", closeSportSuccessDialog);
weightCheckinPage?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-weight-step]");
  if (!stepButton) return;
  stepWeightField(stepButton.dataset.weightStep, Number(stepButton.dataset.delta));
});
weightValueInput?.addEventListener("input", () => validateWeightInputs(false));
weightFatInput?.addEventListener("input", () => validateWeightInputs(false));
weightTimeTrigger?.addEventListener("click", openWeightTimePicker);
document.querySelector(".weight-picker-cancel")?.addEventListener("click", closeWeightTimePicker);
document.querySelector(".weight-picker-confirm")?.addEventListener("click", confirmWeightTimePicker);
document.querySelector(".weight-sheet-close")?.addEventListener("click", closeOverlays);
weightNoteInput?.addEventListener("input", updateWeightNoteCount);
weightSubmit?.addEventListener("click", submitWeightCheckin);
waistValueInput?.addEventListener("input", () => {
  if (waistError) waistError.textContent = "";
});
waistCheckinSheet?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-waist-step]");
  if (!stepButton) return;
  stepWaistValue(Number(stepButton.dataset.waistStep));
});
waistTimeTrigger?.addEventListener("click", openWaistTimePicker);
waistClose?.addEventListener("click", closeOverlays);
document.querySelector(".waist-picker-cancel")?.addEventListener("click", closeWaistTimePicker);
document.querySelector(".waist-picker-confirm")?.addEventListener("click", confirmWaistTimePicker);
waistNoteInput?.addEventListener("input", updateWaistNoteCount);
waistSubmit?.addEventListener("click", saveWaistCheckin);
pressureCheckinSheet?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-pressure-step]");
  if (!stepButton) return;
  stepPressureField(stepButton.dataset.pressureStep, Number(stepButton.dataset.delta));
});
pressureSystolicInput?.addEventListener("input", () => validatePressureInputs(false));
pressureDiastolicInput?.addEventListener("input", () => validatePressureInputs(false));
pressurePulseInput?.addEventListener("input", () => validatePressureInputs(false));
pressureTimeTrigger?.addEventListener("click", openPressureTimePicker);
document.querySelector(".pressure-picker-cancel")?.addEventListener("click", closePressureTimePicker);
document.querySelector(".pressure-picker-confirm")?.addEventListener("click", confirmPressureTimePicker);
pressureClose?.addEventListener("click", closeOverlays);
pressureNoteInput?.addEventListener("input", updatePressureNoteCount);
pressureSubmit?.addEventListener("click", submitPressureCheckin);
pressureSuccessDone?.addEventListener("click", closeOverlays);
sugarCheckinSheet?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-sugar-step]");
  if (stepButton) stepSugarValue(Number(stepButton.dataset.sugarStep));
});
sugarPeriodSelect?.addEventListener("change", () => {
  sugarSelectedPeriod = sugarPeriodSelect.value;
});
sugarValueInput?.addEventListener("input", () => validateSugarInput(false));
sugarTimeTrigger?.addEventListener("click", openSugarTimePicker);
document.querySelector(".sugar-picker-cancel")?.addEventListener("click", closeSugarTimePicker);
document.querySelector(".sugar-picker-confirm")?.addEventListener("click", confirmSugarTimePicker);
sugarClose?.addEventListener("click", closeOverlays);
sugarNoteInput?.addEventListener("input", updateSugarNoteCount);
sugarSubmit?.addEventListener("click", submitSugarCheckin);
unifiedCheckinSuccessDone?.addEventListener("click", closeOverlays);
checkinSuccessDone?.addEventListener("click", closeOverlays);

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
updateMedicineScheduleCard();
initCycleReminder();
renderFocusPlans();

const initialView = window.location.hash.replace("#", "");
if (["home", "plan", "service", "mine"].includes(initialView)) {
  tabbarLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === initialView));
  switchView(initialView);
}
