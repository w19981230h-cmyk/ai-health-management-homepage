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

function openCameraPage(mode = "report") {
  cameraMode = mode;
  closeOverlays();
  cameraPage?.classList.toggle("diet-camera", mode === "diet");
  if (cameraHint) {
    cameraHint.textContent = mode === "diet" ? "请从正上方俯拍食物，以便提升识别效果" : "请从正上方俯拍报告，以便提升识别效果";
  }
  cameraBack?.setAttribute("aria-label", mode === "diet" ? "返回饮食打卡" : "返回上传资料");
  cameraShutter?.setAttribute("aria-label", mode === "diet" ? "拍摄食物" : "拍摄报告");
  cameraPage?.classList.add("active");
}

function returnToUploadSheet() {
  cameraPage?.classList.remove("active");
  cameraPage?.classList.remove("diet-camera");
  if (cameraMode === "diet") {
    sheetMask.classList.add("active");
    dietUploadSheet?.classList.add("active");
    renderDietUploadImages();
  } else {
    openSheet(uploadSheet);
    renderSelectedFiles();
  }
}

function addSelectedImages(files) {
  const available = Math.max(0, 5 - selectedUploadFiles.length);
  const images = Array.from(files || []).slice(0, available);
  images.forEach((file, index) => {
    let preview = "assets/camera-report-preview.jpg";
    try {
      preview = URL.createObjectURL(file);
    } catch (error) {
      preview = "assets/camera-report-preview.jpg";
    }
    selectedUploadFiles.push({
      name: file.name || `image${selectedUploadFiles.length + index + 1}.jpg`,
      sizeMb: file.size ? file.size / 1024 / 1024 : 2.4,
      source: "图片上传",
      kind: "image",
      preview
    });
  });
  if (Array.from(files || []).length > available) {
    toast.textContent = "最多选择 5 张图片";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1500);
  }
  returnToUploadSheet();
}

function addSelectedDocuments(files) {
  const available = Math.max(0, 5 - selectedUploadFiles.length);
  const documents = Array.from(files || []).slice(0, available);
  documents.forEach((file, index) => {
    selectedUploadFiles.push({
      name: file.name || `report${selectedUploadFiles.length + index + 1}.pdf`,
      sizeMb: file.size ? file.size / 1024 / 1024 : 2.4,
      source: "文件上传",
      kind: "file"
    });
  });
  if (Array.from(files || []).length > available) {
    toast.textContent = "最多选择 5 个文件";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1500);
  }
  renderSelectedFiles();
}

function captureReportImage() {
  if (cameraMode === "diet") {
    addDietMockImage();
    returnToUploadSheet();
    return;
  }
  if (selectedUploadFiles.length >= 5) {
    toast.textContent = "最多选择 5 张图片";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1500);
    returnToUploadSheet();
    return;
  }
  selectedUploadFiles.push({
    name: `camera-${Date.now()}.jpg`,
    sizeMb: 2.4,
    source: "图片上传",
    kind: "image",
    preview: "assets/camera-report-preview.jpg"
  });
  returnToUploadSheet();
}

function renderSelectedFiles() {
  if (!selectedFiles) return;
  if (!selectedUploadFiles.length) {
    selectedFiles.className = "selected-files upload-entry-state";
    selectedFiles.innerHTML = `
      <button class="upload-entry-card image-entry" type="button" data-open-camera><i></i><span>图片上传</span></button>
      <button class="upload-entry-card file-entry" type="button" data-open-document><i></i><span>文件上传</span></button>
    `;
  } else {
    selectedFiles.className = "selected-files upload-grid-state";
    selectedFiles.innerHTML = `
      ${selectedUploadFiles.map((file, index) => `
        <div class="selected-file ${file.kind === "file" ? "file" : "image"}${file.preview ? " has-preview" : ""}"${file.preview ? ` style="background-image:url(${file.preview})"` : ""}>
          <i aria-hidden="true"></i>
          <button type="button" data-remove-file="${index}" aria-label="删除${file.name}">×</button>
        </div>
      `).join("")}
      ${selectedUploadFiles.length < 5 ? `<button class="upload-add-tile" type="button" ${selectedUploadFiles.every((file) => file.kind === "file") ? "data-open-document" : "data-open-camera"}>+</button>` : ""}
    `;
  }
  const hasSelectedImages = selectedUploadFiles.length > 0 && selectedUploadFiles.every((file) => file.kind === "image");
  uploadMergeOption?.classList.toggle("hidden", !hasSelectedImages);
  if (!hasSelectedImages && mergeReportImages) mergeReportImages.checked = false;
  submitUpload?.classList.toggle("hidden", !selectedUploadFiles.length);
  submitUpload?.toggleAttribute("disabled", !selectedUploadFiles.length);
}

function hasOversizeFile() {
  return selectedUploadFiles.some((file) => file.sizeMb > 50);
}

function createParseTasks(status = "parsing") {
  const now = new Date().toISOString().slice(0, 16);
  const shouldMerge = Boolean(
    mergeReportImages?.checked &&
    selectedUploadFiles.length > 1 &&
    selectedUploadFiles.every((file) => file.kind === "image")
  );
  const filesToParse = shouldMerge
    ? [{
        name: `合并报告-${selectedUploadFiles.length}张图片.jpg`,
        kind: "image",
        sourceCount: selectedUploadFiles.length
      }]
    : selectedUploadFiles;
  const createdTasks = filesToParse.map((file, index) => {
    const task = {
      id: `task-${Date.now()}-${index}`,
      fileName: file.name.replace(/\.[^.]+$/, ""),
      type: uploadTypeSelect.value,
      status,
      thumb: file.kind === "image" ? "upload-image" : "doc",
      kind: file.kind,
      sourceCount: file.sourceCount || 1,
      createdAt: now
    };
    parseTasks.unshift(task);
    return task;
  });
  saveMedicalStores();
  selectedUploadFiles = [];
  if (mergeReportImages) mergeReportImages.checked = false;
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

function setTaskPanelOpen(isOpen) {
  taskPanel.classList.toggle("open", isOpen);
  taskPanelMask?.classList.toggle("active", isOpen);
  addButton.classList.toggle("active", isOpen);
  addButton.setAttribute("aria-expanded", String(isOpen));
}

function openMetricCheckinByType(type) {
  if (type === "weight") {
    openWeightCheckinPage();
    return true;
  }
  if (type === "waist") {
    openWaistCheckinSheet();
    return true;
  }
  if (type === "pressure") {
    openPressureCheckinSheet();
    return true;
  }
  if (type === "sugar") {
    openSugarCheckinSheet();
    return true;
  }
  const metricId = {
    heart: "heart",
    lipid: "lipid",
    uric: "uric",
    fat: "fat"
  }[type];
  if (!metricId || !metricRecordConfigs[metricId]) return false;
  selectedFocusPlan = "weight90";
  selectedFocusMetric = metricId;
  selectedMetricRange = "day";
  selectedMetricDate = new Date();
  openMetricRecordSheet();
  return true;
}

addButton.addEventListener("click", () => {
  setTaskPanelOpen(!taskPanel.classList.contains("open"));
});

taskPanelMask?.addEventListener("click", () => setTaskPanelOpen(false));

taskPanel?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quick-checkin]");
  if (!button) return;
  if (button.classList.contains("checkin-diet") || button.dataset.quickCheckin.includes("饮食")) {
    setTaskPanelOpen(false);
    openDietUploadSheet();
    return;
  }
  if (button.classList.contains("checkin-medicine") || button.dataset.quickCheckin.includes("用药")) {
    setTaskPanelOpen(false);
    openMedicineCheckinSheet();
    return;
  }
  if (button.classList.contains("checkin-sport") || button.dataset.quickCheckin.includes("运动")) {
    setTaskPanelOpen(false);
    openSportCheckinSheet();
    return;
  }
  if (button.classList.contains("checkin-weight") || button.dataset.quickCheckin.includes("体重")) {
    setTaskPanelOpen(false);
    openWeightCheckinPage();
    return;
  }
  if (button.classList.contains("checkin-waist") || button.dataset.quickCheckin.includes("腰围")) {
    setTaskPanelOpen(false);
    openWaistCheckinSheet();
    return;
  }
  if (button.classList.contains("checkin-pressure") || button.dataset.quickCheckin.includes("血压")) {
    setTaskPanelOpen(false);
    openPressureCheckinSheet();
    return;
  }
  const quickMetricType = [
    ["checkin-sugar", "血糖", "sugar"],
    ["checkin-heart", "心率", "heart"],
    ["checkin-lipid", "血脂", "lipid"],
    ["checkin-uric", "尿酸", "uric"]
  ].find(([className, label]) => button.classList.contains(className) || button.dataset.quickCheckin.includes(label))?.[2];
  if (quickMetricType) {
    setTaskPanelOpen(false);
    openMetricCheckinByType(quickMetricType);
    return;
  }
  toast.textContent = `${button.dataset.quickCheckin}已选择`;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1400);
  setTaskPanelOpen(false);
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
  setTaskPanelOpen(false);
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
  if (target.dataset.scheduleRecords !== undefined) {
    renderAllCheckinRecords("all");
    openSubPage("metricRecordsPage");
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "diet") {
    if (target.dataset.taskId) startDietTaskCheckin(target.dataset.taskId);
    else {
      activeDietTaskBindingId = "";
      selectedDietTaskBindingId = "";
      pendingDietTaskBinding = false;
      openDietCameraPage(true);
    }
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "sport") {
    openSportCheckinSheet();
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "sport") {
    openSportDetailPage();
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "medicine") {
    openMedicineCheckinSheet();
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "weight") {
    openWeightCheckinPage();
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "pressure") {
    openMetricDetail("bp");
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "pressure") {
    openPressureCheckinSheet();
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "sugar") {
    openMetricDetail("sugar");
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "sugar") {
    openSugarCheckinSheet();
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "period") {
    openCycleSheet(calculatePeriodSummary().inPeriod ? "end" : "start");
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && openMetricCheckinByType(target.dataset.type)) {
    return;
  }
  const metricRecordType = scheduleCheckinTypeForMetric(target.dataset.type);
  if (target.dataset.scheduleAction === "records" && metricRecordType) {
    openMetricDetail(scheduleMetricKey(target.dataset.type));
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "diet") {
    if (target.dataset.taskId) openBoundDietTaskRecord(target.dataset.taskId);
    else openDietDetailPage();
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "medicine") {
    openMedicineRecordsPage();
    return;
  }
  if (target.dataset.scheduleAction === "checkin") {
    const label = defaultCheckinItem(target.dataset.type).title;
    showScheduleToast(`${label}已选择`);
    return;
  }
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
