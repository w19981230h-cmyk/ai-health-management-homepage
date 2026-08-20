function renderMedicalReports() {
  if (!medicalReportList) return;
  const reports = sortedMedicalReports();
  const syncedEncounters = selectedMedicalCategory === "全部" || selectedMedicalCategory === "就诊记录"
    ? hospitalSyncedEncounters
    : [];
  const timelineItems = [
    ...reports.map((report) => ({ kind: "report", date: reportDateValue(report), report })),
    ...syncedEncounters.map((encounter) => ({ kind: "hospital", date: encounter.date, encounter }))
  ].sort((left, right) => parseDateTime(right.date) - parseDateTime(left.date));
  const groups = timelineItems.reduce((result, item) => {
    const month = formatYearMonth(item.date);
    if (!result.has(month)) result.set(month, []);
    result.get(month).push(item);
    return result;
  }, new Map());
  medicalReportList.innerHTML = timelineItems.length ? [...groups.entries()].map(([month, items]) => `
    <section class="report-month-section">
      <h3>${month}</h3>
      ${items.map((item) => item.kind === "hospital" ? renderHospitalEncounterCard(item.encounter) : `
        <button class="report-card report-row" type="button" data-report-id="${item.report.id}" data-report-row="${item.report.id}">
          <span class="report-card-main">
            <span class="report-card-meta">
              <strong>${reportCardTypeLabel(item.report)}${isNewReport(item.report) ? '<em class="new-badge">新增</em>' : ""}</strong>
              <em>报告时间:${reportCardDateText(item.report.reportTime)}</em>
            </span>
            <span class="report-card-title">${item.report.name}</span>
            <span class="report-card-source">来源：${item.report.source || item.report.org || "自动上传"}</span>
          </span>
          <i class="report-thumb ${thumbForType(item.report.type, item.report.thumb || "doc")}"></i>
        </button>
      `).join("")}
    </section>
  `).join("") : `<p class="period-empty">暂无就医资料</p>`;
  updateParseTaskEntry();
}

function renderHospitalEncounterCard(encounter) {
  const visitDate = reportCardDateText(encounter.date);
  return `
    <button class="report-card report-row hospital-encounter-card" type="button" data-hospital-encounter="${encounter.id}">
      <span class="report-card-main">
        <span class="report-card-meta">
          <strong>就诊记录</strong><em>就诊时间:${visitDate}</em>
        </span>
        <span class="report-card-title">${visitDate}${encounter.title}</span>
        <span class="report-card-source hospital-encounter-source">医院同步 · ${encounter.org}</span>
      </span>
      <i class="report-thumb medical" aria-hidden="true"></i>
    </button>
  `;
}

function openHospitalRecordPage(encounterId) {
  selectedHospitalEncounterId = encounterId;
  selectedHospitalRecordGroup = "病案首页";
  renderHospitalRecordPage();
  openSubPage("hospitalRecordPage");
}

function renderHospitalRecordPage() {
  const encounter = hospitalSyncedEncounters.find((item) => item.id === selectedHospitalEncounterId);
  if (!encounter) return;
  const records = encounter.records.filter((record) => record.group === selectedHospitalRecordGroup);
  const list = document.querySelector("#hospitalRecordPageList");
  const tabs = document.querySelector("#hospitalRecordTabs");
  tabs?.querySelectorAll("[data-hospital-page-group]").forEach((button) => {
    const isActive = button.dataset.hospitalPageGroup === selectedHospitalRecordGroup;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  if (!list) return;
  list.innerHTML = records.length ? records.map((record) => `
    <article class="hospital-record-document">
      <h2>${record.name}</h2>
      <div class="hospital-record-file-image">
        ${renderHospitalOriginalFile(record, encounter)}
      </div>
    </article>
  `).join("") : `<p class="period-empty">该分类暂无同步资料</p>`;
}

function renderHospitalOriginalFile(record, encounter) {
  const commonHeader = `
    <span class="hospital-file-hospital">${encounter.org}</span>
    <strong class="hospital-file-title">${record.name}</strong>
  `;
  if (record.id === "hospital-case-home") {
    return `
      <i class="hospital-file-preview hospital-file-case-home" aria-hidden="true">
        ${commonHeader}
        <span class="hospital-file-number">住院号：${encounter.admissionNo}</span>
        <span class="hospital-file-grid hospital-file-patient-grid">
          <span><b>姓名</b>张女士</span><span><b>性别</b>女</span><span><b>年龄</b>38岁</span>
          <span><b>科室</b>${encounter.department}</span><span><b>入院日期</b>2024.02.02</span><span><b>出院日期</b>2024.02.08</span>
          <span class="hospital-file-grid-wide"><b>主要诊断</b>原发性高血压</span>
        </span>
        <span class="hospital-file-seal">医院<br>归档</span>
      </i>
    `;
  }
  if (record.id === "hospital-discharge-summary") {
    return `
      <i class="hospital-file-preview hospital-file-discharge" aria-hidden="true">
        ${commonHeader}
        <span class="hospital-file-number">科室：${encounter.department}　住院号：${encounter.admissionNo}</span>
        <span class="hospital-file-paragraph"><b>入院情况</b>患者因血压升高入院，完善相关检查后给予规范治疗。</span>
        <span class="hospital-file-paragraph"><b>出院诊断</b>原发性高血压，治疗后血压较入院时改善。</span>
        <span class="hospital-file-paragraph"><b>出院医嘱</b>规律服药，居家监测血压，按时复诊。</span>
        <span class="hospital-file-sign">医师签名：王医生　　2024.02.08</span>
      </i>
    `;
  }
  if (record.group === "检验记录") {
    return `
      <i class="hospital-file-preview hospital-file-lab" aria-hidden="true">
        ${commonHeader}
        <span class="hospital-file-number">检验日期：${reportCardDateText(record.reportTime)}　${encounter.department}</span>
        <span class="hospital-file-lab-table">
          <span class="hospital-file-lab-head"><b>检验项目</b><b>结果</b><b>参考范围</b></span>
          ${record.keyResults.map((item) => `
            <span class="${item.status === "异常" ? "hospital-file-result-abnormal" : ""}">
              <b>${item.name}</b><em>${item.result}</em><small>${item.extra.replace(/^参考范围\s*/, "")}</small>
            </span>
          `).join("")}
        </span>
        <span class="hospital-file-sign">检验者：李医生　审核者：陈医生</span>
      </i>
    `;
  }
  return `
    <i class="hospital-file-preview hospital-file-generic" aria-hidden="true">
      ${commonHeader}
      <span class="hospital-file-number">${reportCardDateText(record.reportTime)}　${encounter.department}</span>
      <span class="hospital-file-lab-table hospital-file-result-table">
        <span class="hospital-file-lab-head"><b>项目</b><b>结果</b><b>说明</b></span>
        ${record.keyResults.map((item) => `
          <span class="${item.status === "异常" ? "hospital-file-result-abnormal" : ""}">
            <b>${item.name}</b><em>${item.result}</em><small>${item.extra}</small>
          </span>
        `).join("")}
      </span>
      <span class="hospital-file-sign">数据来源：医院同步</span>
    </i>
  `;
}

function reportCardDateText(value) {
  if (!value) return "待补充";
  return formatDateTime(value).slice(0, 10).replaceAll("-", ".");
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

function keyResultsForReport(report) {
  if (Array.isArray(report.keyResults) && report.keyResults.length) return report.keyResults;
  const date = (report.reportTime || "2026-08-04").slice(0, 10);
  const name = report.name || "";
  const type = normalizeReportType(report.type || "检验报告", name);
  const category = type.includes("处方") ? "处方记录" : type.includes("病历") ? "就诊记录" : "报告单";

  if (type.includes("处方") || name.includes("处方")) {
    return [
      { category, type: "门诊处方", name: "厄贝沙坦片", result: "150 mg", status: "正常", extra: "每日1次，每次1片", date },
      { category, type: "门诊处方", name: "苯磺酸氨氯地平片", result: "5 mg", status: "正常", extra: "每日1次，每次1片", date },
      { category, type: "门诊处方", name: "用药疗程", result: "30天", status: "正常", extra: "按医嘱规律服用", date },
      { category, type: "门诊处方", name: "用药调整", result: "维持原方案", status: "需关注", extra: "不可自行停药或改量", date },
      { category, type: "门诊处方", name: "复诊安排", result: "4周后", status: "待确认", extra: "携家庭血压记录复诊", date }
    ];
  }

  if (type.includes("病历") || type.includes("住院") || /病历|出院记录|入院记录/.test(name)) {
    const recordType = type.includes("住院") || /出院|入院/.test(name) ? "出院记录" : "门诊记录";
    return [
      { category: "就诊记录", type: recordType, name: "就诊原因", result: "血压复诊", status: "正常", extra: "近期偶有头晕，无胸痛、气促", date },
      { category: "就诊记录", type: recordType, name: "诊室血压", result: "146/92 mmHg", status: "异常", extra: "高于诊室血压参考目标", date },
      { category: "就诊记录", type: recordType, name: "临床诊断", result: "原发性高血压", status: "需关注", extra: "继续结合家庭血压评估", date },
      { category: "就诊记录", type: recordType, name: "处置方案", result: "维持原治疗", status: "正常", extra: "低盐饮食并规律监测血压", date },
      { category: "就诊记录", type: recordType, name: "复诊计划", result: "4周后复诊", status: "待确认", extra: "携带早晚家庭血压记录", date }
    ];
  }

  if (type.includes("检查") || /CT|超声|彩超|心电图|磁共振|MRI|影像|放射|X线/i.test(name)) {
    const inspectionType = name.includes("CT") ? "CT报告" : /心电图/.test(name) ? "心电图报告" : /超声|彩超/.test(name) ? "超声报告" : "检查报告";
    if (/腹部|超声|彩超/.test(name) && !name.includes("CT")) {
      return [
        { category: "报告单", type: inspectionType, name: "肝脏", result: "形态大小正常", status: "正常", extra: "实质回声均匀，肝内管道清晰", date },
        { category: "报告单", type: inspectionType, name: "胆囊", result: "息肉样回声约4 mm", status: "需关注", extra: "胆囊壁不厚，建议定期超声随访", date },
        { category: "报告单", type: inspectionType, name: "胰腺", result: "未见明显异常", status: "正常", extra: "形态及内部回声未见异常", date },
        { category: "报告单", type: inspectionType, name: "双肾", result: "未见异常", status: "正常", extra: "集合系统未见明显分离", date },
        { category: "报告单", type: inspectionType, name: "腹腔积液", result: "未见", status: "正常", extra: "腹腔内未探及游离液性暗区", date }
      ];
    }
    if (/心电图/.test(name)) {
      return [
        { category: "报告单", type: inspectionType, name: "心律", result: "窦性心律", status: "正常", extra: "心律规则", date },
        { category: "报告单", type: inspectionType, name: "心率", result: "78 次/分", status: "正常", extra: "参考范围 60–100 次/分", date },
        { category: "报告单", type: inspectionType, name: "PR间期", result: "160 ms", status: "正常", extra: "参考范围 120–200 ms", date },
        { category: "报告单", type: inspectionType, name: "ST-T改变", result: "轻度改变", status: "需关注", extra: "建议结合症状和既往心电图", date },
        { category: "报告单", type: inspectionType, name: "检查结论", result: "大致正常心电图", status: "正常", extra: "以临床医生判断为准", date }
      ];
    }
    return [
      { category: "报告单", type: inspectionType, name: "肺结节", result: "约6 mm", status: "需关注", extra: "右肺上叶，建议结合既往影像", date },
      { category: "报告单", type: inspectionType, name: "肺部纹理", result: "轻度增多", status: "异常", extra: "双肺，结合呼吸道症状判断", date },
      { category: "报告单", type: inspectionType, name: "胸腔积液", result: "未见", status: "正常", extra: "双侧胸腔", date },
      { category: "报告单", type: inspectionType, name: "纵隔淋巴结", result: "未见肿大", status: "正常", extra: "纵隔区", date },
      { category: "报告单", type: inspectionType, name: "复查周期", result: "6–12个月", status: "待确认", extra: "由临床医生结合风险评估", date }
    ];
  }

  if (type.includes("检验") || /血常规|肝功能|血糖|尿常规/.test(name)) {
    if (name.includes("血常规")) {
      return [
        { category: "报告单", type: "检验报告", name: "白细胞计数", result: "10.8 ×10⁹/L", status: "异常", extra: "参考范围 3.5–9.5 ×10⁹/L", date },
        { category: "报告单", type: "检验报告", name: "中性粒细胞百分比", result: "76.2%", status: "需关注", extra: "参考范围 40%–75%", date },
        { category: "报告单", type: "检验报告", name: "血红蛋白", result: "132 g/L", status: "正常", extra: "参考范围 115–150 g/L", date },
        { category: "报告单", type: "检验报告", name: "血小板计数", result: "228 ×10⁹/L", status: "正常", extra: "参考范围 125–350 ×10⁹/L", date },
        { category: "报告单", type: "检验报告", name: "红细胞计数", result: "4.46 ×10¹²/L", status: "正常", extra: "参考范围 3.8–5.1 ×10¹²/L", date }
      ];
    }
    if (name.includes("肝功能")) {
      return [
        { category: "报告单", type: "检验报告", name: "丙氨酸氨基转移酶", result: "68 U/L", status: "异常", extra: "参考范围 7–40 U/L", date },
        { category: "报告单", type: "检验报告", name: "天门冬氨酸氨基转移酶", result: "42 U/L", status: "需关注", extra: "参考范围 13–35 U/L", date },
        { category: "报告单", type: "检验报告", name: "γ-谷氨酰转移酶", result: "58 U/L", status: "需关注", extra: "参考范围 7–45 U/L", date },
        { category: "报告单", type: "检验报告", name: "总胆红素", result: "16.8 μmol/L", status: "正常", extra: "参考范围 5–21 μmol/L", date },
        { category: "报告单", type: "检验报告", name: "白蛋白", result: "44.2 g/L", status: "正常", extra: "参考范围 40–55 g/L", date }
      ];
    }
    if (name.includes("血糖")) {
      return [
        { category: "报告单", type: "检验报告", name: "空腹血糖", result: "7.2 mmol/L", status: "异常", extra: "参考范围 3.9–6.1 mmol/L", date },
        { category: "报告单", type: "检验报告", name: "糖化血红蛋白", result: "6.4%", status: "需关注", extra: "参考范围 4.0%–6.0%", date },
        { category: "报告单", type: "检验报告", name: "尿糖", result: "阴性", status: "正常", extra: "参考结果：阴性", date },
        { category: "报告单", type: "检验报告", name: "尿酮体", result: "阴性", status: "正常", extra: "参考结果：阴性", date },
        { category: "报告单", type: "检验报告", name: "餐后2小时血糖", result: "待补充", status: "待确认", extra: "建议补充同日餐后检测", date }
      ];
    }
    return [
      { category: "报告单", type: "检验报告", name: "尿蛋白", result: "阴性", status: "正常", extra: "参考结果：阴性", date },
      { category: "报告单", type: "检验报告", name: "尿潜血", result: "±", status: "需关注", extra: "建议结合症状复查尿常规", date },
      { category: "报告单", type: "检验报告", name: "尿白细胞", result: "6 个/HP", status: "需关注", extra: "参考范围 0–5 个/HP", date },
      { category: "报告单", type: "检验报告", name: "尿糖", result: "阴性", status: "正常", extra: "参考结果：阴性", date },
      { category: "报告单", type: "检验报告", name: "尿酮体", result: "阴性", status: "正常", extra: "参考结果：阴性", date }
    ];
  }

  return [
    { category: "报告单", type, name: "血压", result: "138/88 mmHg", status: "需关注", extra: "建议结合家庭血压连续观察", date },
    { category: "报告单", type, name: "体重指数", result: "23.6 kg/m²", status: "正常", extra: "参考范围 18.5–23.9 kg/m²", date },
    { category: "报告单", type, name: "空腹血糖", result: "5.6 mmol/L", status: "正常", extra: "参考范围 3.9–6.1 mmol/L", date },
    { category: "报告单", type, name: "总胆固醇", result: "5.3 mmol/L", status: "需关注", extra: "参考范围 <5.2 mmol/L", date },
    { category: "报告单", type, name: "肾功能", result: "未见异常", status: "正常", extra: "肌酐、尿素氮在参考范围", date }
  ];
}

function keyResultStatusClass(status) {
  if (status === "正常") return "is-normal";
  if (status === "异常") return "is-abnormal";
  if (status === "需关注") return "is-attention";
  return "is-pending";
}

function keyDataCategory(item) {
  const type = item.type || "";
  if (type.includes("检验")) return "检验报告";
  if (/CT|超声|心电图|检查/.test(type)) return "检查报告";
  if (type.includes("处方") || item.category === "处方记录") return "处方记录";
  if (/门诊记录|出院记录|病历/.test(type) || item.category === "就诊记录") return "病历";
  return item.category || "报告数据";
}

function keyDataReference(item) {
  if (!(item.type || "").includes("检验")) return "";
  const extra = String(item.extra || "").trim();
  if (extra.startsWith("参考范围")) return extra;
  if (/^参考结果[：:]/.test(extra)) return extra.replace(/^参考结果[：:]\s*/, "参考范围 ");
  return "";
}

function allReportsForMetricHistory() {
  const syncedReports = hospitalSyncedEncounters.flatMap((encounter) => encounter.records);
  const reportsById = new Map();
  [...medicalReports, ...syncedReports].forEach((report) => reportsById.set(report.id, report));
  return [...reportsById.values()];
}

function metricHistoryRecords(metricName) {
  const seen = new Set();
  return allReportsForMetricHistory().flatMap((report) => keyResultsForReport(report)
    .filter((item) => item.name === metricName)
    .map((item) => ({
      ...item,
      reportId: report.id,
      reportName: report.name,
      reportOrg: report.org || "",
      reportSource: report.sourceType === "hospital" ? "医院同步" : (report.source || "上传保存"),
      recordDate: item.date || (report.reportTime || "").slice(0, 10)
    })))
    .filter((item) => {
      const key = `${item.reportId}|${item.name}|${item.recordDate}|${item.result}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => parseDateTime(right.recordDate) - parseDateTime(left.recordDate));
}

function renderKeyResultItem(item, showHistory = true) {
  const reference = keyDataReference(item);
  const statusClass = keyResultStatusClass(item.status);
  const historyCount = showHistory ? metricHistoryRecords(item.name).length : 0;
  return `
    <article class="ai-key-result-item ${statusClass}">
      <div class="ai-key-result-top"><span>${keyDataCategory(item)}</span><b class="${statusClass}">${item.status}</b></div>
      <div class="ai-key-result-main">
        <div class="ai-key-data-field"><small>名称</small><strong>${item.name}</strong></div>
        <div class="ai-key-data-field is-value"><small>结果</small><p>${item.result}</p></div>
      </div>
      <div class="ai-key-result-meta ${reference ? "has-reference" : "only-time"}">
        ${reference ? `<span class="ai-key-reference">${reference}</span>` : ""}
        <span class="ai-key-result-meta-actions">
          <time datetime="${item.date}"><small>报告时间</small>${item.date}</time>
          ${historyCount > 1 ? `<button class="ai-key-history-entry" type="button" data-key-history-name="${encodeURIComponent(item.name)}">共${historyCount}次记录</button>` : ""}
        </span>
      </div>
    </article>
  `;
}

function reportMetricHistoryRecords(report, metricName) {
  return [...(report.metricHistory || [])]
    .sort((left, right) => metricHistorySortTime(right) - metricHistorySortTime(left))
    .map((record, contextIndex) => ({ ...record, contextIndex }))
    .filter((record) => record.name === metricName);
}

function renderReportMetricHistoryRecord(record, index) {
  const statusClass = keyResultStatusClass(record.status || "正常");
  const isCurrent = Boolean(record.current);
  return `
    <article class="report-metric-history-record${isCurrent ? " is-current" : ""}${index >= 3 ? " is-extra" : ""}">
      <i class="report-metric-history-node" aria-hidden="true"></i>
      <div class="report-metric-history-record-head">
        <time datetime="${record.time}">${String(record.time || "").replaceAll("-", ".")}</time>
        ${isCurrent ? "<em>当前</em>" : ""}
        <b class="${statusClass}">${record.status || "正常"}</b>
      </div>
      <strong>${record.name}</strong>
      <p>${record.value}</p>
      <button type="button" data-report-history-source="${record.contextIndex}"><span>来源</span>${record.source}<i aria-hidden="true"></i></button>
    </article>`;
}

function renderReportMetricHistoryInline(report, metricName) {
  const records = reportMetricHistoryRecords(report, metricName);
  if (!report.isPortraitMetric || records.length <= 1) return "";
  return `
    <section class="report-metric-history" data-report-metric-history>
      <button class="report-metric-history-toggle" type="button" aria-expanded="false">
        <span><strong>历史数据节</strong><em>共 ${records.length} 次</em></span><i aria-hidden="true"></i>
      </button>
      <div class="report-metric-history-body" hidden>
        <div class="report-metric-history-list">${records.map(renderReportMetricHistoryRecord).join("")}</div>
        ${records.length > 3 ? `<button class="report-metric-history-more" type="button">展开更多（${records.length - 3}）</button>` : ""}
      </div>
    </section>`;
}

function renderReportDetailKeyResult(item, report) {
  const reference = keyDataReference(item) || String(item.extra || "");
  const statusClass = keyResultStatusClass(item.status);
  const source = item.source || item.type || keyDataCategory(item);
  return `
    <section class="ai-key-result-group">
      <article class="ai-key-result-item ai-key-result-report-card ${statusClass}">
        <div class="ai-key-result-report-meta"><span>${source}</span><time datetime="${item.date}">报告时间：${String(item.date || "").replaceAll("-", ".")}</time></div>
        <div class="ai-key-result-report-value"><strong>${item.name}</strong><b class="${statusClass}">${item.status}</b></div>
        <p>${item.result}${reference ? ` <span>${reference}</span>` : ""}</p>
      </article>
      ${renderReportMetricHistoryInline(report, item.name)}
    </section>`;
}

function renderMetricHistoryRecord(item, index) {
  const statusClass = keyResultStatusClass(item.status);
  return `
    <article class="ai-key-history-record">
      <span class="ai-key-history-record-head"><time datetime="${item.recordDate}">${item.recordDate}${index === 0 ? " · 最新" : ""}</time><b class="${statusClass}">${item.status}</b></span>
      <strong>${item.result}</strong>
      <span class="ai-key-history-record-source">${item.reportName} · ${item.reportSource}${item.reportOrg ? ` · ${item.reportOrg}` : ""}</span>
    </article>
  `;
}

function openMetricHistory(metricName) {
  const history = metricHistoryRecords(metricName);
  if (history.length <= 1) return;
  const sheetTitle = document.querySelector("#aiKeyResultsTitle");
  if (sheetTitle) sheetTitle.textContent = metricName;
  if (aiKeyResultsSheetStats) aiKeyResultsSheetStats.textContent = `历次数据 · 共 ${history.length} 次`;
  if (aiKeyResultsAll) aiKeyResultsAll.innerHTML = history.map(renderMetricHistoryRecord).join("");
  openSheet(aiKeyResultsSheet);
  window.setTimeout(() => aiKeyResultsClose?.focus(), 0);
}

function renderKeyResults(report) {
  const results = keyResultsForReport(report);
  const statusPriority = { "异常": 0, "需关注": 1, "待确认": 2, "正常": 3 };
  const sortedResults = [...results].sort((left, right) => (statusPriority[left.status] ?? 4) - (statusPriority[right.status] ?? 4));
  const abnormalCount = results.filter((item) => item.status !== "正常").length;
  const stats = report.isPortraitMetric
    ? `共${results.length}条数据，${abnormalCount}项异常`
    : `共 ${results.length} 条数据${abnormalCount ? ` · ${abnormalCount} 条异常/需关注` : ""}`;
  document.querySelector("#aiSummary").innerHTML = sortedResults.slice(0, 3)
    .map((item) => report.isPortraitMetric ? renderReportDetailKeyResult(item, report) : renderKeyResultItem(item))
    .join("");
  if (aiKeyResultStats) aiKeyResultStats.textContent = stats;
  if (aiKeyResultsSheetStats) aiKeyResultsSheetStats.textContent = stats;
  if (aiKeyResultsAll) aiKeyResultsAll.innerHTML = sortedResults.map((item) => renderKeyResultItem(item)).join("");
  if (aiKeyResultMore) {
    aiKeyResultMore.hidden = results.length <= 3;
    aiKeyResultMore.textContent = report.isPortraitMetric
      ? `展开全部数据（${Math.max(0, results.length - 3)}）`
      : "查看全部关键数据";
  }
}

let activeReportMetricHistoryContext = null;
let reportSourceLoadTimer = 0;
let activeReportDetailRecord = null;
let reportDetailNavigationStack = [];

function metricHistorySortTime(record) {
  return parseDateTime(String(record.time || record.date || "").replaceAll(".", "-")).getTime();
}

function renderReportMetricHistory(report) {
  const records = [...(report.metricHistory || [])].sort((left, right) => metricHistorySortTime(right) - metricHistorySortTime(left));
  activeReportMetricHistoryContext = report.isPortraitMetric && records.length > 1 ? { report, records } : null;
}

function finishReportSourceLoading() {
  const reportPage = document.querySelector("#reportDetailPage");
  const loading = document.querySelector("#reportSourceLoading");
  window.clearTimeout(reportSourceLoadTimer);
  reportSourceLoadTimer = 0;
  reportPage?.classList.remove("is-source-loading");
  reportPage?.removeAttribute("aria-busy");
  if (loading) loading.hidden = true;
}

function animateReportDetailEntry() {
  const reportPage = document.querySelector("#reportDetailPage");
  reportPage?.classList.remove("is-source-entering");
  window.requestAnimationFrame(() => {
    reportPage?.classList.add("is-source-entering");
    window.setTimeout(() => reportPage?.classList.remove("is-source-entering"), 360);
  });
}

function goBackReportDetailRecord() {
  if (reportSourceLoadTimer) {
    finishReportSourceLoading();
    return true;
  }
  const previousReport = reportDetailNavigationStack.pop();
  if (!previousReport) return false;
  openReportDetailRecord(previousReport, { replace: true, historyBack: true });
  animateReportDetailEntry();
  return true;
}

function openMetricHistorySourceReport(recordIndex) {
  if (!activeReportMetricHistoryContext) return;
  const sourceRecord = activeReportMetricHistoryContext.records[Number(recordIndex)];
  if (!sourceRecord) return;
  const baseReport = activeReportMetricHistoryContext.report;
  const normalizedTime = String(sourceRecord.time || sourceRecord.date || "2026-01-11").replaceAll(".", "-");
  const metricHistory = activeReportMetricHistoryContext.records.map((record) => ({ ...record, current: record === sourceRecord }));
  const sourceName = String(sourceRecord.source || baseReport.name).split(" · ")[0].replace(/[（(].*?[）)]/g, "").trim();
  const selectedResult = {
    category: "报告单",
    type: baseReport.type,
    source: sourceRecord.source,
    name: sourceRecord.name,
    result: sourceRecord.value,
    status: sourceRecord.status,
    extra: sourceRecord.reference || "",
    date: normalizedTime.slice(0, 10)
  };
  const nextReport = {
    ...baseReport,
    id: `${baseReport.id || "portrait-report"}-${recordIndex}`,
    name: sourceName || baseReport.name,
    reportTime: `${normalizedTime.slice(0, 10)}T09:00`,
    uploadTime: `${normalizedTime.slice(0, 10)}T09:10`,
    sourceLabel: String(sourceRecord.source || "").includes("自动同步") ? "自动同步" : String(sourceRecord.source || "").includes("医院同步") ? "医院同步" : "手动上传",
    keyResults: [selectedResult, ...(baseReport.keyResults || []).filter((item) => item.name !== sourceRecord.name)],
    metricHistory
  };
  const reportPage = document.querySelector("#reportDetailPage");
  const loading = document.querySelector("#reportSourceLoading");
  window.clearTimeout(reportSourceLoadTimer);
  reportPage?.setAttribute("aria-busy", "true");
  reportPage?.classList.add("is-source-loading");
  if (loading) loading.hidden = false;
  reportPage?.scrollTo({ top: 0, behavior: "smooth" });
  reportSourceLoadTimer = window.setTimeout(() => {
    reportSourceLoadTimer = 0;
    if (activeReportDetailRecord) reportDetailNavigationStack.push(activeReportDetailRecord);
    openReportDetailRecord(nextReport, { replace: true });
    finishReportSourceLoading();
    animateReportDetailEntry();
  }, 420);
}

document.querySelector("#aiSummary")?.addEventListener("click", (event) => {
  const toggle = event.target.closest(".report-metric-history-toggle");
  if (toggle) {
    const body = toggle.nextElementSibling;
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    if (body) body.hidden = expanded;
    return;
  }
  const more = event.target.closest(".report-metric-history-more");
  if (more) {
    more.closest("[data-report-metric-history]")?.querySelectorAll(".is-extra").forEach((record) => record.classList.remove("is-extra"));
    more.hidden = true;
    return;
  }
  const source = event.target.closest("[data-report-history-source]");
  if (source) openMetricHistorySourceReport(source.dataset.reportHistorySource);
});

document.addEventListener("click", (event) => {
  const historyEntry = event.target.closest("[data-key-history-name]");
  if (historyEntry) {
    openMetricHistory(decodeURIComponent(historyEntry.dataset.keyHistoryName));
  }
});

function openReportDetail(reportId) {
  const report = medicalReports.find((item) => item.id === reportId) || hospitalSyncedReport(reportId);
  if (!report) return;
  openReportDetailRecord(report);
}

function openReportDetailRecord(report, options = {}) {
  if (!report) return;
  if (!options.replace) reportDetailNavigationStack = [];
  activeReportDetailRecord = report;
  selectedReportId = report.isPortraitMetric ? "" : report.id;
  const isHospitalSynced = report.sourceType === "hospital" || report.isPortraitMetric;
  const reportPage = document.querySelector("#reportDetailPage");
  const reportNavTitle = document.querySelector("#reportDetailNavTitle");
  const reportEditEntry = document.querySelector("#reportDetailPage .report-edit-entry");
  const reportDeleteEntry = document.querySelector("#reportDetailPage .report-delete-icon");
  const reportSourceText = document.querySelector("#detailReportSourceText");
  reportPage?.classList.toggle("portrait-metric-detail", Boolean(report.isPortraitMetric));
  if (reportNavTitle) reportNavTitle.textContent = report.isPortraitMetric ? "资料详情" : "报告单详情";
  if (reportEditEntry) reportEditEntry.hidden = isHospitalSynced;
  if (reportDeleteEntry) reportDeleteEntry.hidden = isHospitalSynced;
  if (reportSourceText) reportSourceText.textContent = report.sourceLabel || (report.sourceType === "hospital" ? "医院同步" : "上传保存");
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
  renderKeyResults(report);
  renderReportMetricHistory(report);
  document.querySelector("#aiConclusion").textContent = ai.conclusion;
  document.querySelector("#aiFocus").textContent = ai.focus;
  document.querySelector("#aiNotice").textContent = ai.notice;
  const adviceItems = ai.adviceItems || [ai.notice, ai.advice, ai.next].filter((item, index, items) => item && items.indexOf(item) === index);
  document.querySelector("#aiAdvice").innerHTML = adviceItems.map((item, index) => typeof item === "string"
    ? `<li><i>${index + 1}</i><span>${item}</span></li>`
    : `<li><i>${index + 1}</i><span><strong>${item.title}</strong><em>${item.text}</em></span></li>`).join("");
  document.querySelector("#aiNext").textContent = ai.next;
  if (options.replace) {
    document.querySelector("#reportDetailPage")?.scrollTo({ top: 0, behavior: "auto" });
  } else {
    openSubPage("reportDetailPage");
  }
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
          type: normalizeReportType(current.type, "腹部超声检查报告单"),
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
    type: normalizeReportType(overrides.type || task.type || "报告单", overrides.name || task.name || task.fileName || ""),
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
    type: normalizeReportType(task.type || "报告单", task.name || "腹部超声检查报告单"),
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
      <strong class="patient-chip-name">新成员${addedMemberCount}</strong>
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
  if (button.classList.contains("checkin-water") || button.dataset.quickCheckin.includes("饮水")) {
    setTaskPanelOpen(false);
    openWaterCheckinSheet();
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
  if (target.dataset.scheduleAction === "assessment") {
    openSubPage("assessmentStartPage");
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
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "water") {
    openWaterCheckinSheet();
    return;
  }
  if (target.dataset.scheduleAction === "records" && target.dataset.type === "water") {
    openWaterDetailPage();
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

const assessmentVoiceLanguageCopies = {
  mandarin: {
    label: "普通话",
    title: "健康评估",
    agent: "AI智能小助手",
    desc: "每完成一项，离健康更近一步。",
    progress: "5%<br>进度",
    intro: "你来啦~我是您的 AI 健康小助手～来跟我聊聊最近身体状况吧~",
    question: "您提到肚子疼，能具体描述一下疼痛的位置和感觉吗?比如是集中在上腹部(像心窝附近)、下腹部(可能涉及肠道或泌尿)，或者像绞痛、胀痛、刀割样等不同性质",
    interrupt: "点击打断",
    micLabel: "开始语音采集",
    agentLabel: "AI智能小助手"
  },
  english: {
    label: "英语",
    title: "Health Assessment",
    agent: "AI Health Assistant",
    desc: "Each answer brings you one step closer to better health.",
    progress: "5%<br>Progress",
    intro: "Hi, I'm your AI health assistant. Let's talk about how you've been feeling recently.",
    question: "You mentioned abdominal pain. Could you describe where it hurts and what it feels like? For example, upper abdomen, lower abdomen, cramping, bloating, or sharp pain.",
    interrupt: "Interrupt",
    micLabel: "Start voice input",
    agentLabel: "AI Health Assistant"
  },
  sichuan: {
    label: "四川话",
    title: "健康评估",
    agent: "AI健康小助手",
    desc: "每答完一项，离健康又近一步哈。",
    progress: "5%<br>进度",
    intro: "你来咯～我是你的 AI 健康小助手，来跟我摆哈最近身体咋个样嘛～",
    question: "你说肚子痛，能不能具体说哈痛的位置和感觉喃？比如上腹部、下腹部，或者是绞起痛、胀痛、刀割样痛这些不同感觉。",
    interrupt: "点我打断",
    micLabel: "开始语音采集",
    agentLabel: "AI健康小助手"
  },
  cantonese: {
    label: "粤语",
    title: "健康評估",
    agent: "AI健康小助手",
    desc: "每完成一項，就離健康近一步。",
    progress: "5%<br>進度",
    intro: "你嚟啦～我係你嘅 AI 健康小助手，嚟同我傾吓最近身體狀況啦。",
    question: "你提到肚痛，可以具體講吓痛嘅位置同感覺嗎？例如上腹、下腹，或者係絞痛、脹痛、刀割咁痛等。",
    interrupt: "點擊打斷",
    micLabel: "開始語音採集",
    agentLabel: "AI健康小助手"
  }
};

function setAssessmentVoiceLanguage(language = "mandarin") {
  const copy = assessmentVoiceLanguageCopies[language] || assessmentVoiceLanguageCopies.mandarin;
  const title = document.querySelector("#assessmentVoiceTitle");
  const agent = document.querySelector("#assessmentVoiceAgentName");
  const desc = document.querySelector("#assessmentVoiceAgentDesc");
  const progress = document.querySelector("#assessmentVoiceProgress");
  const intro = document.querySelector("#assessmentVoiceBubbleIntro");
  const question = document.querySelector("#assessmentVoiceBubbleQuestion");
  const interrupt = document.querySelector("#assessmentInterrupt span");
  const trigger = document.querySelector("#assessmentLanguageTrigger");
  const menu = document.querySelector("#assessmentLanguageMenu");
  const mic = document.querySelector(".assessment-mic-button");
  const agentWrap = document.querySelector("#assessmentVoiceAgent");
  if (title) title.textContent = copy.title;
  if (agent) agent.textContent = copy.agent;
  if (desc) desc.textContent = copy.desc;
  if (progress) progress.innerHTML = copy.progress;
  if (intro) intro.textContent = copy.intro;
  if (question) question.innerHTML = `${copy.question} <i></i>`;
  if (interrupt) interrupt.textContent = copy.interrupt;
  if (trigger) trigger.textContent = copy.label;
  mic?.setAttribute("aria-label", copy.micLabel);
  agentWrap?.setAttribute("aria-label", copy.agentLabel);
  menu?.querySelectorAll("[data-assessment-language]").forEach((button) => {
    const active = button.dataset.assessmentLanguage === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

const assessmentLanguageSwitch = document.querySelector("#assessmentLanguageSwitch");
const assessmentLanguageTrigger = document.querySelector("#assessmentLanguageTrigger");
const assessmentLanguageMenu = document.querySelector("#assessmentLanguageMenu");

assessmentLanguageMenu?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-assessment-language]");
  if (!option) return;
  setAssessmentVoiceLanguage(option.dataset.assessmentLanguage);
  assessmentLanguageSwitch?.classList.remove("open");
});

assessmentLanguageTrigger?.addEventListener("click", () => {
  assessmentLanguageSwitch?.classList.toggle("open");
});

setAssessmentVoiceLanguage("mandarin");
