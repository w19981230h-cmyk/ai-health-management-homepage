document.addEventListener("click", (event) => {
  const archivePatientButton = event.target.closest("[data-archive-patient-id]");
  if (archivePatientButton) {
    switchArchivePatient(archivePatientButton);
    return;
  }
  const reportButton = event.target.closest("[data-report-id]");
  if (reportButton) {
    openReportDetail(reportButton.dataset.reportId);
    return;
  }
  const portraitRegionButton = event.target.closest("[data-portrait-region]");
  if (portraitRegionButton) {
    setPortraitRegion(portraitRegionButton.dataset.portraitRegion);
    return;
  }
  const portraitProblemButton = event.target.closest(".portrait-problem-card[data-portrait-organ]");
  if (portraitProblemButton) {
    openPortraitBiomarkerDetail(portraitProblemButton.dataset.portraitOrgan);
    return;
  }
  const portraitOrganButton = event.target.closest("[data-portrait-organ]");
  if (portraitOrganButton) {
    setPortraitOrgan(portraitOrganButton.dataset.portraitOrgan);
    return;
  }
  const portraitFigureButton = event.target.closest("#portraitFigure");
  if (portraitFigureButton && portraitFigure?.dataset.portraitMode === "body") {
    setPortraitAnatomyView();
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
    if (opener.dataset.openPage === "healthPortraitPage") {
      updatePatientPortraitAssets();
      setPortraitAnatomyView();
    }
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

const portraitBiomarkerDetails = {
  heart: {
    title: "心血管详情",
    rows: [
      { name: "日均睡眠", value: "6 h", reference: "参考：7-8h", source: "健康问卷", status: "不足", level: "warn" },
      { name: "入睡时间", value: ">30min", reference: "参考：<20min", source: "健康问卷", status: "关注", level: "focus" },
      { name: "压力自评", value: "6/10", reference: "参考：<4/10", source: "健康问卷", status: "偏高", level: "warn" },
      { name: "头痛频率", value: "1-2次/月", reference: "参考：无", source: "健康问卷", status: "关注", level: "focus" },
      { name: "咖啡因", value: "2-3杯/d", reference: "参考：≤1杯/d", source: "健康问卷", status: "偏高", level: "warn" },
      { name: "同型半胱氨酸", value: "15.6 μmol/L", reference: "参考：<15", source: "心脑血管筛查", status: "关注", level: "focus", sourceType: "blue" }
    ],
    advice: [
      "神经系统评估核心问题是睡眠不足+慢性压力，主要源于生活方式。综合评估建议：",
      "1. 建立规律作息（23:00前上床），目标7h+睡眠",
      "2. 睡前1h停止屏幕，蓝光阻断+放松仪式（冥想/阅读）",
      "3. 下午2点后禁咖啡因",
      "4. 每周3-4次有氧运动促进内啡肽释放",
      "5. 如持续>3个月，考虑CBT-I或睡眠科评估"
    ]
  },
  lung: {
    title: "肺部详情",
    rows: [
      { name: "慢性咳嗽频率", value: "每周3次", reference: "参考：偶发", source: "健康问卷", status: "关注", level: "focus" },
      { name: "运动后气促", value: "中度", reference: "参考：无", source: "健康问卷", status: "偏高", level: "warn" },
      { name: "肺功能FEV1/FVC", value: "68%", reference: "参考：≥70%", source: "体检报告", status: "偏低", level: "warn" },
      { name: "胸部影像", value: "轻度纹理增多", reference: "参考：未见异常", source: "检查报告", status: "关注", level: "focus", sourceType: "blue" }
    ],
    advice: [
      "肺部指标提示近期存在呼吸道负担，需要结合症状和检查结果持续观察。",
      "1. 避免烟雾、粉尘和冷空气刺激",
      "2. 保持规律有氧活动，优先选择低强度步行",
      "3. 若咳嗽、气促持续加重，建议呼吸科复查肺功能",
      "4. 按医生建议完成胸部影像随访"
    ]
  },
  stomach: {
    title: "消化系统详情",
    rows: [
      { name: "胃部不适频率", value: "每周2次", reference: "参考：无", source: "健康问卷", status: "关注", level: "focus" },
      { name: "餐后腹胀", value: "偶发", reference: "参考：无", source: "健康问卷", status: "关注", level: "focus" },
      { name: "幽门螺杆菌", value: "阴性", reference: "参考：阴性", source: "体检报告", status: "正常", level: "normal", sourceType: "blue" },
      { name: "饮食规律性", value: "不规律", reference: "参考：规律", source: "健康问卷", status: "偏离", level: "warn" }
    ],
    advice: [
      "消化系统主要风险来自饮食节律不稳定和胃部不适反复出现。",
      "1. 固定三餐时间，避免长时间空腹后暴食",
      "2. 减少辛辣、油炸和高糖饮品",
      "3. 记录胃部不适出现时间和诱因",
      "4. 若疼痛、反酸持续超过2周，建议消化科评估"
    ]
  }
};

function openPortraitBiomarkerDetail(organId) {
  const detail = portraitBiomarkerDetails[organId] || portraitBiomarkerDetails.heart;
  const title = document.querySelector("#portraitBiomarkerTitle");
  const list = document.querySelector("#portraitBiomarkerList");
  const advice = document.querySelector("#portraitAiAdvice");
  if (title) title.textContent = detail.title;
  if (list) {
    list.innerHTML = detail.rows.map((row) => `
      <article class="portrait-biomarker-row">
        <i aria-hidden="true"></i>
        <div>
          <strong>${row.name}</strong>
          <p>${row.value}<span>（${row.reference}）</span></p>
        </div>
        <em class="${row.sourceType === "blue" ? "source-blue" : ""}">${row.source}</em>
        <b class="level-${row.level}">${row.status}</b>
      </article>
    `).join("");
  }
  if (advice) {
    advice.innerHTML = detail.advice.map((line, index) => index === 0 ? `<p>${line}</p>` : `<p>${line}</p>`).join("");
  }
  openSubPage("portraitBiomarkerDetailPage");
}

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

const portraitPatientAssets = {
  self: {
    name: "张女士",
    meta: "♀ 32岁",
    archiveImage: "assets/health-portrait-female.png?v=20260707-female-portrait",
    portraitImage: "assets/health-portrait-female.png?v=20260707-female-portrait",
    anatomyImage: "assets/health-anatomy-female-clean.png?v=20260707-anatomy-pair",
    portraitAlt: "张女士健康画像"
  },
  zhang: {
    name: "张患者",
    meta: "♂ 24岁",
    archiveImage: "assets/archive-patient-portrait.png?v=20260706-portrait-assets",
    portraitImage: "assets/health-portrait-fullbody.png?v=20260706-portrait-assets",
    anatomyImage: "assets/health-anatomy-male-clean.png?v=20260707-anatomy-pair",
    portraitAlt: "张患者健康画像"
  }
};

function updatePatientPortraitAssets() {
  const asset = portraitPatientAssets[currentPatient.id] || (currentPatient.sex === "female" ? portraitPatientAssets.self : portraitPatientAssets.zhang);
  const archiveDoctor = document.querySelector(".archive-doctor");
  const portraitFullBody = document.querySelector(".portrait-full-body");
  const portraitAnatomyBody = document.querySelector(".portrait-anatomy-body");
  const portraitProfileName = document.querySelector(".portrait-profile-main strong");
  const portraitProfileMeta = document.querySelector(".portrait-profile-meta");
  const portraitProfileAvatar = document.querySelector(".portrait-profile-avatar");
  const portraitFemaleAnomaly = Boolean(portraitPatientAnomalies[currentPatient.id]);

  if (archiveDoctor) {
    archiveDoctor.classList.toggle("female", portraitFemaleAnomaly);
    archiveDoctor.style.backgroundImage = `url("${asset.archiveImage}")`;
  }
  if (portraitFullBody) {
    portraitFullBody.src = asset.portraitImage;
    portraitFullBody.alt = asset.portraitAlt;
    portraitFullBody.classList.toggle("female", portraitFemaleAnomaly);
  }
  if (portraitAnatomyBody) {
    portraitAnatomyBody.src = asset.anatomyImage || portraitPatientAssets.zhang.anatomyImage;
    portraitAnatomyBody.alt = currentPatient.sex === "female" ? "女性健康可视化人体" : "男性健康可视化人体";
    portraitAnatomyBody.classList.toggle("female", portraitFemaleAnomaly);
  }
  portraitFigure?.setAttribute("data-patient-sex", currentPatient.sex || "unknown");
  portraitFigure?.classList.toggle("female-anomaly", portraitFemaleAnomaly);
  applyPortraitOrganRiskStates();
  if (portraitProfileAvatar) {
    portraitProfileAvatar.classList.toggle("female", portraitFemaleAnomaly);
  }
  if (portraitMarkerLayer && portraitFigure?.dataset.portraitMode === "anatomy") {
    renderPortraitMarkers(portraitFigure.dataset.portraitView || "root");
  }
  if (portraitProfileName) portraitProfileName.textContent = currentPatient.name || asset.name;
  if (portraitProfileMeta) portraitProfileMeta.textContent = currentPatient.sex === "female" ? `♀ ${currentPatient.age || "32"}岁` : `♂ ${currentPatient.age || "24"}岁`;
}

function updateCurrentPatientView() {
  if (profileNameButton) {
    const archiveSwitcher = profileNameButton.closest(".archive-member-switcher");
    if (archiveSwitcher) {
      const archivePatientButtons = [...archiveSwitcher.querySelectorAll("[data-archive-patient-id]")];
      const activeButton = archivePatientButtons.find((item) => item.dataset.archivePatientId === currentPatient.id) || archivePatientButtons[0];
      archivePatientButtons.forEach((item) => {
        const active = item === activeButton;
        item.classList.toggle("active", active);
        item.setAttribute("aria-checked", String(active));
      });
    } else {
      const profileChipName = profileNameButton.querySelector(".patient-chip-name");
      if (profileChipName) profileChipName.textContent = currentPatient.name;
      else profileNameButton.textContent = currentPatient.name;
      profileNameButton.setAttribute("aria-label", currentPatient.name || "切换就诊人");
    }
  }
  if (profileGenderAge) {
    const sexLabel = currentPatient.sex === "female" ? "女" : currentPatient.sex === "male" ? "男" : "未知";
    profileGenderAge.textContent = currentPatient.age ? `${sexLabel}｜${currentPatient.age}岁` : `${sexLabel}｜待完善`;
  }
  renderPeriodCard();
  renderPeriodDetail();
  updateCycleReminderVisibility();
  updatePatientPortraitAssets();
}

function switchArchivePatient(button) {
  const switcher = button.closest(".archive-member-switcher");
  switcher?.querySelectorAll("[data-archive-patient-id]").forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-checked", "false");
  });
  button.classList.add("active");
  button.setAttribute("aria-checked", "true");
  currentPatient = {
    id: button.dataset.archivePatientId || button.dataset.name || "unknown",
    name: button.dataset.name || "就诊人",
    sex: button.dataset.sex || "unknown",
    age: button.dataset.age || ""
  };
  updateCurrentPatientView();
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
  const recordsButton = event.target.closest("[data-service-records]");
  if (recordsButton) {
    event.preventDefault();
    event.stopPropagation();
    toast.textContent = "执行记录功能待接入";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  const card = event.target.closest(".archive-service-card");
  if (!card) return;
  openServiceDetail(card.dataset.serviceId, "orders");
});

document.querySelector(".orders-panel")?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".archive-service-card");
  if (!card || event.target.closest("[data-service-records]")) return;
  event.preventDefault();
  openServiceDetail(card.dataset.serviceId, "orders");
});

function openSheet(sheet) {
  closeOverlays();
  sheetMask.classList.add("active");
  sheet.classList.add("active");
}

const portraitRegions = {
  root: {
    title: "全身总览",
    desc: "点击一级部位后，可查看对应子级器官。",
    icon: "身",
    hint: "一级部位",
    markers: [],
    organs: []
  },
  head: {
    title: "头部",
    desc: "头部包含头颅、眼睛、鼻子、口腔、耳朵、咽喉和甲状腺。",
    icon: "头",
    hint: "点击下方器官继续放大",
    markers: ["brain", "eye", "nose", "mouth", "ear", "throat", "thyroid"],
    organs: [
      { id: "brain", name: "头颅", icon: "脑", desc: "关注头痛、眩晕、睡眠和血压相关风险。" },
      { id: "eye", name: "眼睛", icon: "眼", desc: "关注视力、眼压及糖尿病相关眼底风险。" },
      { id: "nose", name: "鼻子", icon: "鼻", desc: "关注鼻炎、鼻窦不适和呼吸通畅度。" },
      { id: "mouth", name: "口腔", icon: "口", desc: "关注口腔溃疡、牙龈和饮食相关问题。" },
      { id: "ear", name: "耳朵", icon: "耳", desc: "关注听力、耳鸣及眩晕相关症状。" },
      { id: "throat", name: "咽喉", icon: "咽", desc: "关注咽痛、咳嗽、吞咽不适。" },
      { id: "thyroid", name: "甲状腺", icon: "甲", desc: "关注甲状腺结节和代谢相关指标。" }
    ]
  },
  chest: {
    title: "胸部",
    desc: "胸部包含乳房、心脏、肺、气管、食管和胸腺。",
    icon: "胸",
    hint: "点击下方器官继续放大",
    markers: ["breast", "heart", "lung", "trachea", "esophagus", "thymus"],
    organs: [
      { id: "breast", name: "乳房", icon: "乳", desc: "关注乳腺结节、乳腺增生和筛查记录。" },
      { id: "heart", name: "心脏", icon: "心", desc: "关注心率、血压、胸闷和心血管风险。" },
      { id: "lung", name: "肺", icon: "肺", desc: "关注慢阻肺、肺结节和胸部 CT 报告。" },
      { id: "trachea", name: "气管", icon: "气", desc: "关注咳嗽、喘息和呼吸道症状。" },
      { id: "esophagus", name: "食管", icon: "食", desc: "关注反酸、吞咽不适和消化道症状。" },
      { id: "thymus", name: "胸腺", icon: "腺", desc: "关注胸腺影像和免疫相关提示。" }
    ]
  },
  abdomen: {
    title: "腹部",
    desc: "腹部包含胆、胃、肝、胰、脾、输尿管、肾、肠等部位。",
    icon: "腹",
    hint: "点击下方器官继续放大",
    markers: ["gallbladder", "stomach", "liver", "pancreas", "spleen", "ureter", "kidney", "intestine"],
    organs: [
      { id: "gallbladder", name: "胆", icon: "胆", desc: "关注胆囊结石、胆囊炎和腹部超声。" },
      { id: "stomach", name: "胃", icon: "胃", desc: "关注胃痛、胃炎、饮食和胃镜记录。" },
      { id: "liver", name: "肝", icon: "肝", desc: "关注肝功能、脂肪肝和用药饮酒影响。" },
      { id: "pancreas", name: "胰", icon: "胰", desc: "关注血糖、胰腺和代谢相关风险。" },
      { id: "spleen", name: "脾", icon: "脾", desc: "关注脾脏大小和腹部影像提示。" },
      { id: "ureter", name: "输尿管", icon: "管", desc: "关注泌尿系统通畅度和相关检查。" },
      { id: "kidney", name: "肾", icon: "肾", desc: "关注肾小球过滤率、肌酐、尿酸和血压。" },
      { id: "intestine", name: "肠", icon: "肠", desc: "关注肠道症状、便秘腹泻和肠镜记录。" }
    ]
  },
  pelvis: {
    title: "盆腔",
    desc: "盆腔包含膀胱、子宫及附件、阴道、前列腺、睾丸和输精管。",
    icon: "盆",
    hint: "点击下方器官继续放大",
    markers: ["bladder", "uterus", "vagina", "prostate", "testis", "vas"],
    organs: [
      { id: "bladder", name: "膀胱", icon: "膀", desc: "关注尿频尿急、尿常规和泌尿系统提示。" },
      { id: "uterus", name: "子宫及附件", icon: "宫", desc: "关注妇科超声、经期和附件相关记录。" },
      { id: "vagina", name: "阴道", icon: "阴", desc: "关注分泌物、炎症和妇科检查。" },
      { id: "prostate", name: "前列腺", icon: "前", desc: "关注前列腺超声、尿频尿急等提示。" },
      { id: "testis", name: "睾丸", icon: "睾", desc: "关注男性生殖系统检查。" },
      { id: "vas", name: "输精管", icon: "管", desc: "关注男性生殖系统相关记录。" }
    ]
  },
  skeleton: {
    title: "骨骼",
    desc: "骨骼包含骨骼和关节。",
    icon: "骨",
    hint: "点击下方部位继续放大",
    markers: ["bone", "joint"],
    organs: [
      { id: "bone", name: "骨骼", icon: "骨", desc: "关注骨密度、骨折史和影像报告。" },
      { id: "joint", name: "关节", icon: "节", desc: "关注关节疼痛、活动受限和影像检查。" }
    ]
  },
  vessel: {
    title: "血管",
    desc: "血管用于查看动脉硬化、血管风险等信息。",
    icon: "管",
    hint: "点击下方部位继续放大",
    markers: ["vessel"],
    organs: [
      { id: "vessel", name: "血管", icon: "管", desc: "关注动脉硬化、血压和心血管风险。" }
    ]
  }
};

const portraitRootRegions = [
  ["head", "头部", "头"],
  ["chest", "胸部", "胸"],
  ["abdomen", "腹部", "腹"],
  ["pelvis", "盆腔", "盆"],
  ["skeleton", "骨骼", "骨"],
  ["vessel", "血管", "管"]
];

let currentPortraitRegion = "root";

function setPortraitRegion(regionName) {
  const region = portraitRegions[regionName] || portraitRegions.root;
  currentPortraitRegion = regionName;
  portraitFigure?.setAttribute("data-portrait-view", regionName);
  portraitFigure?.removeAttribute("data-portrait-organ");
  portraitCurrentIcon.textContent = region.icon;
  if (portraitOrganInfo) portraitOrganInfo.hidden = true;
  portraitOrganPanelTitle.textContent = regionName === "root" ? "一级部位" : `${region.title}子级`;
  portraitOrganPanelHint.textContent = regionName === "root" ? "请选择上方一级部位" : region.hint;
  renderPortraitMarkers(regionName);
  portraitRegionList?.querySelectorAll("[data-portrait-region]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitRegion === regionName);
  });
  document.querySelectorAll(".portrait-problem-card[data-portrait-organ]").forEach((button) => {
    button.classList.remove("active");
  });
  portraitOrganList.innerHTML = region.organs.length ? region.organs.map((organ) => `
    <button type="button" data-portrait-organ="${organ.id}" data-parent-region="${regionName}">
      <i>${organ.icon}</i>
      <span>${organ.name}</span>
    </button>
  `).join("") : "";
  if (region.organs.length) {
    activatePortraitOrgan(region.organs[0], regionName);
  }
}

function setPortraitOrgan(organId) {
  const entry = Object.entries(portraitRegions).find(([, region]) => region.organs?.some((organ) => organ.id === organId));
  if (!entry) return;
  const [regionName, region] = entry;
  const organ = region.organs.find((item) => item.id === organId);
  if (currentPortraitRegion !== regionName) {
    setPortraitRegion(regionName);
  }
  activatePortraitOrgan(organ, regionName);
}

function activatePortraitOrgan(organ, regionName) {
  const region = portraitRegions[regionName] || portraitRegions.root;
  const hasRisk = Boolean(organ.risk || ["heart", "gallbladder", "vessel"].includes(organ.id));
  portraitFigure?.setAttribute("data-portrait-organ", organ.id);
  portraitCurrentIcon.textContent = organ.icon;
  if (portraitOrganInfo) {
    portraitOrganInfo.hidden = true;
    portraitInfoIcon.textContent = organ.icon;
    portraitInfoTitle.textContent = organ.name;
    portraitInfoRisk.textContent = hasRisk ? (organ.risk || "1 项需关注") : "暂无异常";
    portraitInfoDesc.textContent = organ.card || organ.desc;
    if (anomaly) {
      portraitInfoRisk.textContent = anomaly.risk;
      portraitInfoDesc.textContent = anomaly.card;
    }
    const action = document.querySelector("#portraitInfoAction");
    if (action) action.textContent = hasRisk ? "查看详情" : "新增报告";
  }
  portraitOrganPanelTitle.textContent = `${region.title} · ${organ.name}`;
  portraitOrganPanelHint.textContent = "可继续切换同级器官";
  portraitOrganList?.querySelectorAll("[data-portrait-organ]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitOrgan === organ.id);
  });
  portraitMarkerLayer?.querySelectorAll("[data-portrait-organ]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitOrgan === organ.id);
  });
  document.querySelectorAll(".portrait-problem-card[data-portrait-organ]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitOrgan === organ.id);
  });
}

function getPortraitOrgan(organId) {
  for (const region of Object.values(portraitRegions)) {
    const organ = region.organs?.find((item) => item.id === organId);
    if (organ) return organ;
  }
  return null;
}

function renderPortraitMarkers(regionName) {
  if (!portraitMarkerLayer) return;
  const region = portraitRegions[regionName] || portraitRegions.root;
  portraitMarkerLayer.innerHTML = (region.markers || []).map((organId) => {
    const organ = getPortraitOrgan(organId);
    if (!organ) return "";
    return `<button class="portrait-organ-marker marker-${organ.id}" type="button" data-portrait-organ="${organ.id}" aria-label="${organ.name}"><span>${organ.icon}</span></button>`;
  }).join("");
}

const portraitRegionsV2 = {
  root: {
    title: "全身总览",
    icon: "身",
    hint: "先选择一级部位",
    camera: { scale: 1, x: 0, y: 0 },
    markers: [],
    organs: []
  },
  head: {
    title: "头颈",
    icon: "头",
    hint: "头颅 / 眼睛 / 鼻子 / 口腔 / 耳朵 / 咽喉",
    camera: { scale: 1.34, x: 0, y: 74 },
    markers: ["brain", "eye", "nose", "mouth", "ear", "throat", "thyroid"],
    organs: [
      { id: "brain", name: "头颅", desc: "补充头颅相关检查报告，为你分析", camera: { scale: 1.48, x: 0, y: 96 } },
      { id: "eye", name: "眼睛", desc: "关注视力、眼压和眼底检查记录", camera: { scale: 1.48, x: 10, y: 78 } },
      { id: "nose", name: "鼻子", desc: "关注鼻炎、鼻窦及呼吸通畅情况", camera: { scale: 1.48, x: 0, y: 64 } },
      { id: "mouth", name: "口腔", desc: "关注牙龈、口腔溃疡和口腔检查", camera: { scale: 1.46, x: 0, y: 42 } },
      { id: "ear", name: "耳朵", desc: "关注听力、耳鸣和眩晕相关提示", camera: { scale: 1.46, x: -30, y: 74 } },
      { id: "throat", name: "咽喉", desc: "关注咽痛、咳嗽和吞咽不适", camera: { scale: 1.42, x: 0, y: 20 } },
      { id: "thyroid", name: "甲状腺", desc: "关注甲状腺结节和代谢指标", camera: { scale: 1.42, x: 0, y: 8 } }
    ]
  },
  chest: {
    title: "胸部",
    icon: "胸",
    hint: "心脏 / 肺 / 气管 / 乳房 / 食管 / 胸腺",
    camera: { scale: 1.28, x: 10, y: -56 },
    markers: ["heart", "lung", "trachea", "breast", "esophagus", "thymus"],
    organs: [
      { id: "heart", name: "心脏", risk: "1 项需关注", card: "CT：心脏CT见主动脉钙化", desc: "关注心率、血压和心血管风险", camera: { scale: 1.92, x: 8, y: -58 } },
      { id: "lung", name: "肺", desc: "补充胸部CT或肺部检查报告，为你分析", camera: { scale: 1.82, x: 0, y: -50 } },
      { id: "trachea", name: "气管", desc: "关注咳嗽、喘息和呼吸道症状", camera: { scale: 1.9, x: 0, y: 8 } },
      { id: "breast", name: "乳房", desc: "关注乳腺结节、增生和筛查记录", camera: { scale: 1.78, x: 28, y: -62 } },
      { id: "esophagus", name: "食管", desc: "关注反酸、吞咽不适和消化道症状", camera: { scale: 1.9, x: 0, y: -66 } },
      { id: "thymus", name: "胸腺", desc: "关注胸腺影像和免疫相关提示", camera: { scale: 1.86, x: 0, y: -18 } }
    ]
  },
  abdomen: {
    title: "腹部",
    icon: "腹",
    hint: "胆 / 胃 / 肝 / 胰 / 脾 / 输尿管 / 肾 / 肠",
    camera: { scale: 1.32, x: 0, y: -118 },
    markers: ["gallbladder", "stomach", "liver", "pancreas", "spleen", "ureter", "kidney", "intestine"],
    organs: [
      { id: "gallbladder", name: "胆", risk: "1 项需关注", card: "CT：胆囊CT未见显影需评估", desc: "关注胆囊结石、胆囊炎和腹部超声", camera: { scale: 1.95, x: 42, y: -35 } },
      { id: "stomach", name: "胃", desc: "关注胃痛、胃炎、饮食和胃镜记录", camera: { scale: 1.9, x: -28, y: -36 } },
      { id: "liver", name: "肝", desc: "关注肝功能、脂肪肝和用药饮酒影响", camera: { scale: 1.88, x: 36, y: -22 } },
      { id: "pancreas", name: "胰", desc: "关注血糖、胰腺和代谢相关风险", camera: { scale: 1.92, x: 0, y: -58 } },
      { id: "spleen", name: "脾", desc: "关注脾脏大小和腹部影像提示", camera: { scale: 1.9, x: -42, y: -30 } },
      { id: "ureter", name: "输尿管", desc: "关注泌尿系统通畅度和相关检查", camera: { scale: 1.92, x: 26, y: -96 } },
      { id: "kidney", name: "肾", desc: "关注肾小球过滤率、肌酐、尿酸和血压", camera: { scale: 1.9, x: -26, y: -92 } },
      { id: "intestine", name: "肠", desc: "关注肠道症状、腹泻便秘和肠镜记录", camera: { scale: 1.86, x: 0, y: -112 } }
    ]
  },
  pelvis: {
    title: "盆腔",
    icon: "盆",
    hint: "膀胱 / 子宫及附件 / 阴道 / 前列腺 / 睾丸 / 输精管",
    camera: { scale: 1.36, x: 0, y: -206 },
    markers: ["bladder", "uterus", "vagina", "prostate", "testis", "vas"],
    organs: [
      { id: "bladder", name: "膀胱", desc: "补充膀胱相关检查报告，为你分析", camera: { scale: 1.95, x: 0, y: -170 } },
      { id: "uterus", name: "子宫及附件", desc: "关注妇科超声、经期和附件相关记录", camera: { scale: 1.95, x: 12, y: -150 } },
      { id: "vagina", name: "阴道", desc: "关注分泌物、炎症和妇科检查", camera: { scale: 1.95, x: 0, y: -190 } },
      { id: "prostate", name: "前列腺", desc: "关注前列腺超声、尿频尿急等提示", camera: { scale: 1.95, x: -12, y: -160 } },
      { id: "testis", name: "睾丸", desc: "关注男性生殖系统检查", camera: { scale: 1.9, x: 28, y: -205 } },
      { id: "vas", name: "输精管", desc: "关注男性生殖系统相关记录", camera: { scale: 1.9, x: -34, y: -200 } }
    ]
  },
  skeleton: {
    title: "骨骼",
    icon: "骨",
    hint: "骨骼 / 关节",
    camera: { scale: 1.22, x: 0, y: -35 },
    markers: ["bone", "joint"],
    organs: [
      { id: "bone", name: "骨骼", desc: "补充骨骼相关检查报告，为你分析", camera: { scale: 1.28, x: 0, y: -42 } },
      { id: "joint", name: "关节", desc: "关注关节疼痛、活动受限和影像检查", camera: { scale: 1.35, x: -32, y: -80 } }
    ]
  },
  vessel: {
    title: "血管",
    icon: "管",
    hint: "血管",
    camera: { scale: 1.08, x: 0, y: -18 },
    markers: ["vessel"],
    organs: [
      { id: "vessel", name: "血管", risk: "1 项需关注", card: "CT：动脉硬化，需进一步评估", desc: "关注动脉硬化、血压和心血管风险", camera: { scale: 1.12, x: 0, y: -26 } }
    ]
  }
};

const portraitOrganTargets = {
  brain: [".brain"],
  eye: [".eye"],
  nose: [".nose"],
  mouth: [".mouth"],
  ear: [".ear"],
  throat: [".throat"],
  thyroid: [".thyroid"],
  heart: [".heart"],
  lung: [".lung"],
  trachea: [".trachea"],
  breast: [".breast"],
  esophagus: [".esophagus"],
  thymus: [".thymus"],
  gallbladder: [".gallbladder"],
  stomach: [".stomach"],
  liver: [".liver"],
  pancreas: [".pancreas"],
  spleen: [".spleen"],
  ureter: [".ureter"],
  kidney: [".kidney"],
  intestine: [".intestine"],
  bladder: [".bladder"],
  uterus: [".uterus"],
  vagina: [".vagina"],
  prostate: [".prostate"],
  testis: [".testis"],
  vas: [".vas"],
  bone: [".bone"],
  joint: [".joint"],
  vessel: [".vessel"]
};

const portraitPatientAnomalies = {
  self: {
    liver: {
      risk: "1 项需关注",
      card: "肝功能指标异常；数据来源：健康评估报告、体检报告。建议复查肝功能和腹部超声。",
      source: "健康评估报告 / 体检报告"
    }
  }
};

function getPortraitAnomaly(organId) {
  return portraitPatientAnomalies[currentPatient.id]?.[organId] || null;
}

function applyPortraitOrganRiskStates() {
  if (!portraitFigure) return;
  portraitFigure.querySelectorAll(".organ, .bone, .vessel").forEach((node) => {
    node.classList.remove("risk-warning", "risk-danger");
  });

  const anomalies = portraitPatientAnomalies[currentPatient.id] || {};
  Object.keys(anomalies).forEach((organId) => {
    (portraitOrganTargets[organId] || []).forEach((selector) => {
      portraitFigure.querySelectorAll(selector).forEach((node) => {
        node.classList.add(anomalies[organId].level === "danger" ? "risk-danger" : "risk-warning");
      });
    });
  });
}

function portraitIconSvg(type) {
  const paths = {
    brain: '<path d="M8 13c-2.5-1-2.5-5 0-6 1-3 5-3.5 6-1 2-1.5 5 .2 5 3 2 .6 2.7 3.8.5 5-.6 2.6-4 3-5.5 1.3-1.7 1.5-4.6 1.3-6-.3Z"/><path d="M12 6v10M15 7v8"/>',
    eye: '<path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z"/><circle cx="12" cy="12" r="2.5"/>',
    nose: '<path d="M12 4c1 4 3 6.5 3 10 0 2-1.7 3-3 3-1.5 0-3-.7-4-1.8"/><path d="M10 18c1.5.8 3 .8 4 0"/>',
    mouth: '<path d="M5 11c3 3 11 3 14 0"/><path d="M7 14c3 3 7 3 10 0"/>',
    ear: '<path d="M8 8c0-3 2-5 5-5s5 2 5 5c0 5-5 5-5 10 0 2-3 2-4 0"/><path d="M11 8c0-1.5 1-2.5 2.5-2.5S16 6.5 16 8c0 2-2 2.3-2.7 4"/>',
    throat: '<path d="M9 4v8c0 4 6 4 6 0V4"/><path d="M7 11h10M10 16h4"/>',
    thyroid: '<path d="M12 13c-2-4-4-5-7-4-.5 5 2 8 7 8 5 0 7.5-3 7-8-3-1-5 0-7 4Z"/><path d="M12 7v10"/>',
    heart: '<path d="M12 20S5 15 5 9.8C5 6 9 4.8 12 8c3-3.2 7-2 7 1.8C19 15 12 20 12 20Z"/>',
    lung: '<path d="M11 5v14M13 5v14"/><path d="M11 9C7 7 5 10 5 15c0 4 2 6 5 4 1-2 1-6 1-10Z"/><path d="M13 9c4-2 6 1 6 6 0 4-2 6-5 4-1-2-1-6-1-10Z"/>',
    trachea: '<path d="M12 4v16"/><path d="M9 7h6M9 10h6M9 13h6M9 16h6"/>',
    breast: '<path d="M6 13a5 5 0 0 0 10 0"/><path d="M18 13a5 5 0 0 1-10 0"/>',
    esophagus: '<path d="M12 4c-3 5 3 8 0 16"/>',
    thymus: '<path d="M12 4l6 3v5c0 4-2.6 6.5-6 8-3.4-1.5-6-4-6-8V7l6-3Z"/>',
    liver: '<path d="M4 11c6-5 13-5 17 1-4 4-12 5-17-1Z"/>',
    gallbladder: '<path d="M12 4c4 4 4 9 0 14-4-5-4-10 0-14Z"/>',
    stomach: '<path d="M12 4c5 1 7 6 4 10-2.5 4-9 3-8-2 .5-3 2-6 4-8Z"/>',
    pancreas: '<path d="M4 13c5-4 11-4 16-1-4 4-11 5-16 1Z"/>',
    spleen: '<path d="M15 5c5 5 3 13-3 14-4-5-2-12 3-14Z"/>',
    kidney: '<path d="M9 4c4 2 4 11-1 14-4-2-4-11 1-14Z"/><path d="M15 4c-4 2-4 11 1 14 4-2 4-11-1-14Z"/>',
    ureter: '<path d="M8 5c0 7 8 7 8 14"/><path d="M16 5c0 7-8 7-8 14"/>',
    intestine: '<path d="M6 8c5-4 12-1 12 4 0 6-9 7-12 2-2-3-1-5 2-6Z"/><path d="M8 12h8M9 15h5"/>',
    bladder: '<path d="M8 8c3-3 5-3 8 0 2 7-1 11-4 11s-6-4-4-11Z"/>',
    uterus: '<path d="M7 7c3 3 7 3 10 0-1 7-3 10-5 10S8 14 7 7Z"/><path d="M7 9H4M17 9h3"/>',
    vagina: '<path d="M12 5v14M8 11h8"/>',
    prostate: '<path d="M8 8c3 2 5 2 8 0v8c-3 2-5 2-8 0V8Z"/>',
    testis: '<circle cx="9" cy="15" r="3"/><circle cx="15" cy="15" r="3"/><path d="M12 4c-4 3-5 7-3 11M12 4c4 3 5 7 3 11"/>',
    vas: '<path d="M7 18c-4-6-1-12 5-14 6 2 9 8 5 14"/><path d="M9 15h6"/>',
    bone: '<path d="M8 8a3 3 0 1 1 3-3h2a3 3 0 1 1 3 3l-8 8a3 3 0 1 1-3-3v-2a3 3 0 1 1 3-3Z"/>',
    joint: '<circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>',
    vessel: '<path d="M5 18c4-8 10-4 14-12"/><path d="M5 12c4 0 4 4 8 4"/><path d="M12 8c3 0 4 2 7 2"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[type] || paths.thymus}</svg>`;
}

function applyPortraitCamera(camera) {
  if (!portraitFigure) return;
  const next = camera || portraitRegionsV2.root.camera;
  portraitFigure.style.setProperty("--portrait-scale", next.scale);
  portraitFigure.style.setProperty("--portrait-x", `${next.x}px`);
  portraitFigure.style.setProperty("--portrait-y", `${next.y}px`);
  portraitFigure.style.setProperty("--portrait-marker-scale", (1 / Number(next.scale || 1)).toFixed(3));
}

function clearPortraitOrganSelection() {
  portraitFigure?.querySelectorAll(".organ-selected").forEach((node) => node.classList.remove("organ-selected"));
}

function setPortraitRegion(regionName) {
  const region = portraitRegionsV2[regionName] || portraitRegionsV2.root;
  currentPortraitRegion = regionName;
  portraitFigure?.setAttribute("data-portrait-mode", "anatomy");
  portraitFigure?.setAttribute("data-portrait-view", "root");
  portraitFigure?.removeAttribute("data-portrait-organ");
  applyPortraitCamera(portraitRegionsV2.root.camera);
  applyPortraitOrganRiskStates();
  clearPortraitOrganSelection();
  portraitCurrentIcon.innerHTML = regionName === "root" ? "身" : portraitIconSvg(region.markers[0] || "thymus");
  if (portraitOrganInfo) portraitOrganInfo.hidden = true;
  if (portraitOrganPanelTitle) portraitOrganPanelTitle.textContent = regionName === "root" ? "一级部位" : region.title;
  if (portraitOrganPanelHint) portraitOrganPanelHint.textContent = region.hint;
  renderPortraitMarkers("root");
  portraitRegionList?.querySelectorAll("[data-portrait-region]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitRegion === regionName);
  });
  if (portraitOrganList) portraitOrganList.innerHTML = "";
}

function setPortraitBodyView() {
  currentPortraitRegion = "root";
  portraitFigure?.setAttribute("data-portrait-mode", "body");
  portraitFigure?.setAttribute("data-portrait-view", "root");
  portraitFigure?.removeAttribute("data-portrait-organ");
  applyPortraitCamera(portraitRegionsV2.root.camera);
  clearPortraitOrganSelection();
  if (portraitOrganInfo) portraitOrganInfo.hidden = true;
  if (portraitCurrentIcon) portraitCurrentIcon.innerHTML = "身";
  renderPortraitMarkers("root");
  if (portraitOrganList) portraitOrganList.innerHTML = "";
  if (portraitOrganPanelTitle) portraitOrganPanelTitle.textContent = "一级部位";
  if (portraitOrganPanelHint) portraitOrganPanelHint.textContent = "点击人体标签查看二级部位";
  portraitRegionList?.querySelectorAll("[data-portrait-region]").forEach((button) => button.classList.remove("active"));
}

function setPortraitAnatomyView() {
  setPortraitRegion("root");
}

function setPortraitOrgan(organId) {
  const entry = Object.entries(portraitRegionsV2).find(([, region]) => region.organs?.some((organ) => organ.id === organId));
  if (!entry) return;
  const [regionName, region] = entry;
  const organ = region.organs.find((item) => item.id === organId);
  if (currentPortraitRegion !== regionName) {
    setPortraitRegion(regionName);
  }
  applyPortraitCamera(portraitRegionsV2.root.camera);
  activatePortraitOrgan(organ, regionName, { keepCamera: true });
}

function activatePortraitOrgan(organ, regionName, options = {}) {
  const region = portraitRegionsV2[regionName] || portraitRegionsV2.root;
  const anomaly = getPortraitAnomaly(organ.id);
  const hasRisk = Boolean(anomaly || organ.risk || ["heart", "gallbladder", "vessel"].includes(organ.id));
  portraitFigure?.setAttribute("data-portrait-organ", organ.id);
  if (!options.keepCamera) applyPortraitCamera(portraitRegionsV2.root.camera);
  clearPortraitOrganSelection();
  (portraitOrganTargets[organ.id] || []).forEach((selector) => {
    portraitFigure?.querySelectorAll(selector).forEach((node) => node.classList.add("organ-selected"));
  });
  portraitCurrentIcon.innerHTML = portraitIconSvg(organ.id);
  if (portraitOrganInfo) {
    portraitOrganInfo.hidden = false;
    portraitInfoIcon.innerHTML = portraitIconSvg(organ.id);
    portraitInfoTitle.textContent = organ.name;
    portraitInfoRisk.textContent = hasRisk ? (organ.risk || "1 项需关注") : "暂无异常";
    portraitInfoDesc.textContent = organ.card || organ.desc;
    const action = document.querySelector("#portraitInfoAction");
    if (action) action.textContent = hasRisk ? "查看详情" : "新增报告";
  }
  if (portraitOrganPanelTitle) portraitOrganPanelTitle.textContent = region.title;
  if (portraitOrganPanelHint) portraitOrganPanelHint.textContent = "点击下方器官继续切换";
  portraitOrganList?.querySelectorAll("[data-portrait-organ]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitOrgan === organ.id);
  });
  portraitMarkerLayer?.querySelectorAll("[data-portrait-organ]").forEach((button) => {
    button.classList.toggle("active", button.dataset.portraitOrgan === organ.id);
  });
}

function getPortraitOrgan(organId) {
  for (const region of Object.values(portraitRegionsV2)) {
    const organ = region.organs?.find((item) => item.id === organId);
    if (organ) return organ;
  }
  return null;
}

function renderPortraitMarkers(regionName) {
  if (!portraitMarkerLayer) return;
  portraitMarkerLayer.innerHTML = "";
  return;
  const problemMarkers = {
    root: ["heart", "lung", "stomach"],
    chest: ["heart", "lung"],
    abdomen: ["stomach"]
  };
  const markerOrgans = problemMarkers[regionName] || [];
  const liverAnomaly = getPortraitAnomaly("liver");
  const markers = markerOrgans.map((organId) => {
    const organ = getPortraitOrgan(organId);
    if (!organ) return "";
    return `<button class="portrait-problem-marker marker-${organId}-problem" type="button" data-portrait-organ="${organId}" aria-label="${organ.name}存在问题"></button>`;
  });
  if (liverAnomaly && ["root", "abdomen"].includes(regionName)) {
    markers.push(`
      <button class="portrait-anomaly-marker marker-liver-anomaly" type="button" data-portrait-organ="liver" aria-label="肝异常">
        <strong>肝异常</strong>
        <span>来源：${liverAnomaly.source}</span>
      </button>
    `);
  }
  if (markers.length) {
    portraitMarkerLayer.innerHTML = markers.join("");
    return;
  }
  portraitMarkerLayer.innerHTML = "";
  return;
  if (regionName === "root") {
    const rootRegions = [
      ["head", "\u5934\u90e8"],
      ["chest", "\u80f8\u90e8"],
      ["abdomen", "\u8179\u90e8"],
      ["pelvis", "\u76c6\u8154"],
      ["skeleton", "\u9aa8\u9abc"],
      ["vessel", "\u8840\u7ba1"]
    ];
    portraitMarkerLayer.innerHTML = rootRegions.map(([regionId, label]) => {
      if (!portraitRegionsV2[regionId]) return "";
      return `<button class="portrait-region-marker marker-region-${regionId}" type="button" data-portrait-region="${regionId}" aria-label="${label}"><span>${label}</span></button>`;
    }).join("");
    return;
  }
  portraitMarkerLayer.innerHTML = "";
  return;
  const markerLabels = {
    brain: "脑",
    eye: "眼",
    nose: "鼻",
    mouth: "口",
    ear: "耳",
    throat: "喉",
    thyroid: "甲",
    heart: "心",
    lung: "肺",
    trachea: "气",
    breast: "乳",
    esophagus: "食",
    thymus: "胸",
    gallbladder: "胆",
    stomach: "胃",
    liver: "肝",
    pancreas: "胰",
    spleen: "脾",
    ureter: "输",
    kidney: "肾",
    intestine: "肠",
    bladder: "膀",
    uterus: "宫",
    vagina: "阴",
    prostate: "前",
    testis: "睾",
    vas: "精",
    bone: "骨",
    joint: "节",
    vessel: "管"
  };
  const region = portraitRegionsV2[regionName] || portraitRegionsV2.root;
  portraitMarkerLayer.innerHTML = (region.markers || []).map((organId) => {
    const organ = getPortraitOrgan(organId);
    if (!organ) return "";
    const label = markerLabels[organId] || organ.name;
    return `<button class="portrait-organ-marker marker-${organ.id}" type="button" data-portrait-organ="${organ.id}" aria-label="${organ.name}"><em>${label}</em></button>`;
  }).join("");
}

setPortraitAnatomyView();

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
  waterCheckinSheet?.classList.remove("active");
  waterGoalPickerSheet?.classList.remove("active");
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

focusPlanSwitch?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-focus-plan]");
  if (!button || !focusPlanDashboards[button.dataset.focusPlan]) return;
  selectedFocusPlan = button.dataset.focusPlan;
  selectedFocusMetric = focusPlanDashboards[selectedFocusPlan].metrics[0]?.id || "";
  renderFocusPlans();
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
metricRecordFields?.addEventListener("input", (event) => clampMetricRecordInputEvent(event));
metricRecordFields?.addEventListener("change", (event) => {
  clampMetricRecordInputEvent(event, true);
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
  const reviewToggle = event.target.closest("[data-sport-review-toggle]");
  if (reviewToggle) {
    event.stopPropagation();
    toggleSportRecordReview(reviewToggle.dataset.sportReviewToggle);
    return;
  }
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
waterClose?.addEventListener("click", closeOverlays);
waterSubmit?.addEventListener("click", submitWaterCheckin);
waterCheckinSheet?.addEventListener("click", (event) => {
  const step = event.target.closest("[data-water-step]");
  if (step && waterAmountInput) {
    const next = Math.max(1, Math.min(5000, Math.round(Number(waterAmountInput.value || 0) + Number(step.dataset.waterStep || 0))));
    waterAmountInput.value = String(next);
    return;
  }
  const typeButton = event.target.closest("[data-water-type]");
  if (!typeButton) return;
  selectedWaterType = typeButton.dataset.waterType || "白水";
  renderWaterTypeOptions();
  if (selectedWaterType === "其他") waterOtherTypeInput?.focus();
});
waterOtherTypeInput?.addEventListener("input", renderWaterTypeOptions);
waterGoalSet?.addEventListener("click", setWaterGoal);
waterGoalPickerCancel?.addEventListener("click", closeWaterGoalPicker);
waterGoalPickerConfirm?.addEventListener("click", confirmWaterGoalPicker);
waterGoalPickerList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-water-goal]");
  if (!button) return;
  selectWaterGoal(button.dataset.waterGoal);
  button.scrollIntoView({ block: "center", behavior: "smooth" });
});
waterGoalPickerList?.addEventListener("scroll", () => {
  window.clearTimeout(waterGoalScrollTimer);
  waterGoalScrollTimer = window.setTimeout(syncWaterGoalFromScroll, 80);
});
waterDetailAdd?.addEventListener("click", openWaterCheckinSheet);
waterDetailRecords?.addEventListener("click", (event) => {
  const row = event.target.closest("[data-water-record]");
  if (!row) return;
  openWaterRecordDetail(row.dataset.waterRecord);
});
waterDetailRecords?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const row = event.target.closest("[data-water-record]");
  if (!row) return;
  event.preventDefault();
  openWaterRecordDetail(row.dataset.waterRecord);
});
waterRecordDetailBody?.addEventListener("click", (event) => {
  const step = event.target.closest("[data-water-detail-step]");
  const amountInput = document.querySelector("#waterRecordAmountInput");
  if (!step || !amountInput) return;
  const next = Math.max(1, Math.min(5000, Math.round(Number(amountInput.value || 0) + Number(step.dataset.waterDetailStep || 0))));
  amountInput.value = String(next);
});
waterRecordDetailBody?.addEventListener("change", (event) => {
  if (!event.target.closest("#waterRecordTypeInput")) return;
  updateWaterRecordOtherInput();
});
waterRecordDetailDelete?.addEventListener("click", deleteWaterRecordDetail);
waterRecordDetailSave?.addEventListener("click", saveWaterRecordDetail);
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
