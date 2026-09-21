// Health-history overview is read-only; each category has its own inline editor.
(() => {
  const categories = [
    { key: "diseases", title: "既往疾病", editorTitle: "既往史", itemTitle: "既往患病", addLabel: "添加其他疾病", fields: [{ key: "name", label: "疾病名称", type: "text", required: true }, { key: "date", label: "确诊时间", type: "date", required: true }] },
    { key: "surgeries", title: "手术史", itemTitle: "手术记录", addLabel: "添加手术", fields: [{ key: "name", label: "手术名称", type: "text", required: true }, { key: "date", label: "手术时间", type: "date", required: true }] },
    { key: "allergies", title: "过敏史", itemTitle: "过敏记录", addLabel: "添加过敏原", fields: [{ key: "type", label: "过敏类型", options: ["药物过敏", "食物过敏", "环境/接触物过敏", "其他"], required: true }, { key: "name", label: "过敏原", type: "text", required: true }] },
    { key: "family", title: "家族史", itemTitle: "家族疾病", addLabel: "添加家族史", fields: [{ key: "relation", label: "亲属关系", options: ["父亲", "母亲", "兄弟", "姐妹", "子女", "祖父", "祖母", "外祖父", "外祖母", "其他"], required: true }, { key: "name", label: "疾病名称", type: "text", required: true }] },
    { key: "medications", title: "用药情况", itemTitle: "用药记录", addLabel: "添加用药", fields: [{ key: "name", label: "用药名称", type: "text", required: true }, { key: "frequency", label: "用药频率", type: "text", optionalHint: true }, { key: "dose", label: "用药剂量", type: "text", optionalHint: true }, { key: "time", label: "用药时间", type: "text", optionalHint: true }] },
    { key: "smoking", title: "吸烟史", itemTitle: "吸烟记录", addLabel: "添加吸烟史", single: true, fields: [{ key: "status", label: "吸烟状态", options: ["偶尔吸烟", "经常吸烟", "已戒烟"], required: true }, { key: "amount", label: "每日吸烟量（支）", type: "number", required: true, when: "activeOrQuit" }, { key: "years", label: "吸烟年限（年）", type: "number", required: true, when: "activeOrQuit" }, { key: "quit", label: "戒烟时间", type: "month", required: true, when: "quit" }] },
    { key: "drinking", title: "饮酒史", itemTitle: "饮酒记录", addLabel: "添加饮酒史", single: true, fields: [{ key: "status", label: "饮酒状态", options: ["偶尔饮酒", "经常饮酒", "已戒酒"], required: true }, { key: "frequency", label: "饮酒频率", type: "text", required: true, when: "activeOrQuit" }, { key: "years", label: "饮酒年限（年）", type: "number", required: true, when: "activeOrQuit" }, { key: "quit", label: "戒酒时间", type: "month", required: true, when: "quit" }] }
  ];
  const commonDiseases = ["高血压", "糖尿病", "高血脂", "冠心病", "哮喘", "慢阻肺", "鼻炎", "胃炎", "反流", "脂肪肝", "肝炎", "胆结石", "甲亢", "甲减"];
  const sample = {
    diseases: [{ name: "高血压", date: "2022-03-15" }, { name: "2型糖尿病", date: "2024-01-08" }],
    surgeries: [{ name: "胆囊切除术", date: "2021-06-20" }, { name: "阑尾切除术", date: "2018-09-11" }],
    allergies: [{ name: "青霉素", type: "药物过敏" }, { name: "虾", type: "食物过敏" }],
    family: [{ relation: "父亲", name: "高血压" }, { relation: "母亲", name: "2型糖尿病" }],
    medications: [{ name: "氨氯地平片", frequency: "每日1次", dose: "5mg", time: "2024-03" }, { name: "二甲双胍片", frequency: "", dose: "", time: "2022-06" }],
    smoking: [{ status: "已戒烟", amount: "10", years: "20", quit: "2025-01" }],
    drinking: []
  };
  const list = document.querySelector("#healthHistoryList");
  const content = document.querySelector("#healthHistoryEditorContent");
  const confirm = document.querySelector("#healthHistoryConfirm");
  const error = document.querySelector("#healthHistoryEditorError");
  let draftRecords = {};
  let draftPresence = {};
  let deletingRecord = null;
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const categoryFor = (key) => categories.find((item) => item.key === key);
  const patientId = () => document.querySelector(".archive-member-switcher [data-archive-patient-id].active")?.dataset.archivePatientId || "self";
  const storageKey = () => `healthHistory:${patientId()}`;
  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()));
      if (saved && typeof saved === "object") return saved;
    } catch (_) { /* use preview data */ }
    return structuredClone(patientId() === "self" ? sample : Object.fromEntries(categories.map((category) => [category.key, []])));
  }
  function write(data) { localStorage.setItem(storageKey(), JSON.stringify(data)); renderOverview(); }
  function medicationRecord(record) {
    const oldDosage = String(record.dosage || "").split(/[，,]/);
    return {
      name: record.name || "",
      frequency: record.frequency || oldDosage.slice(1).join("，").trim(),
      dose: record.dose || (oldDosage.length > 1 ? oldDosage[0].trim() : String(record.dosage || "").trim()),
      time: record.time || record.start || record.end || ""
    };
  }
  function legacyNever(data, key) {
    return (key === "smoking" && data.smoking?.[0]?.status === "从不吸烟") ||
      (key === "drinking" && data.drinking?.[0]?.status === "从不饮酒");
  }
  function lines(category, record) {
    switch (category.key) {
      case "diseases": case "surgeries": return [record.name, record.date];
      case "allergies": return [record.name, record.type];
      case "family": return [record.relation, record.name];
      case "medications": return [record.name, `用药时间：${record.time || record.start || record.end || "待补充"}`];
      case "smoking": return [record.status, record.amount && `${record.status === "已戒烟" ? "原每日" : "每日"}${record.amount}支`, record.years && `吸烟${record.years}年`, record.quit && `${record.quit}戒烟`];
      default: return [record.status, record.frequency && `${record.status === "已戒酒" ? "原" : ""}${record.frequency}`, record.years && `饮酒${record.years}年`, record.quit && `${record.quit}戒酒`];
    }
  }
  function renderOverview() {
    const data = read();
    list.innerHTML = categories.map((category) => {
      const isNone = data._presence?.[category.key] === "none" || legacyNever(data, category.key);
      const records = !isNone && Array.isArray(data[category.key]) ? data[category.key].slice(0, category.single ? 1 : undefined) : [];
      const emptyText = isNone ? "无" : "待补充";
      return `<section class="health-history-card" aria-label="${category.title}">
        <header><h2>${category.title}</h2><button type="button" data-history-category="${category.key}">编辑</button></header>
        <div class="health-history-records">${records.length ? records.map((record) => {
          const [title, ...details] = lines(category, record);
          return `<article class="health-history-record"><div class="health-history-record-copy"><strong>${escape(title)}</strong>${details.filter(Boolean).map((detail) => `<span>${escape(detail)}</span>`).join("")}</div></article>`;
        }).join("") : `<p class="health-history-empty">${emptyText}</p>`}</div>
      </section>`;
    }).join("");
  }
  function visible(field, category, status) {
    if (!field.when) return true;
    if (field.when === "quit") return status === (category.key === "smoking" ? "已戒烟" : "已戒酒");
    return Boolean(status);
  }
  function fieldLabel(field, record) {
    if (field.key === "amount" && record.status === "已戒烟") return "原每日吸烟量（支）";
    if (field.key === "frequency" && record.status === "已戒酒") return "原饮酒频率";
    return field.label;
  }
  function renderField(category, field, record, index) {
    if (!visible(field, category, record.status)) return "";
    const value = record[field.key] || "";
    const label = fieldLabel(field, record);
    const control = field.options
      ? `<select data-category="${category.key}" data-row="${index}" data-key="${field.key}" aria-label="${label}"><option value="">请选择</option>${field.options.map((option) => `<option value="${escape(option)}" ${value === option ? "selected" : ""}>${escape(option)}</option>`).join("")}</select>`
      : `<input data-category="${category.key}" data-row="${index}" data-key="${field.key}" type="${field.type}" value="${escape(value)}" ${field.type === "number" ? 'min="0" step="1" inputmode="numeric"' : ""} placeholder="${field.type === "date" || field.type === "month" ? "请选择" : `请输入${label}`}" aria-label="${label}">`;
    return `<label class="health-history-editor-field"><span>${label}${field.required ? '<em>*</em>' : ""}${field.optionalHint ? '<small>选填</small>' : ""}</span>${control}</label>`;
  }
  function renderEditorCard(category) {
    const key = category.key;
    const records = draftRecords[key];
    const presence = draftPresence[key];
    const tools = key === "diseases" ? `<div class="health-history-common"><div><span>常见疾病</span><button type="button" data-history-add="${key}">⊕ ${category.addLabel}</button></div><div class="health-history-chips">${commonDiseases.map((name) => `<button type="button" data-history-chip="${escape(name)}">${escape(name)}</button>`).join("")}</div></div>` : `<div class="health-history-add-row">${!category.single || records.length === 0 ? `<button type="button" data-history-add="${key}">⊕ ${category.addLabel}</button>` : ""}</div>`;
    return `<section class="health-history-editor-card" data-history-editor-card="${key}"><header><h2>${category.title}</h2><div class="health-history-presence"><button type="button" data-history-presence="has" class="${presence === "has" ? "active" : ""}" aria-pressed="${presence === "has"}">有</button><button type="button" data-history-presence="none" class="${presence === "none" ? "active" : ""}" aria-pressed="${presence === "none"}">无</button></div></header>${presence === "has" ? `${tools}<div class="health-history-editor-records">${records.map((record, index) => `<article class="health-history-editor-record"><header><strong><b>${index + 1}</b>${category.itemTitle}</strong><button type="button" data-history-remove="${index}">删除</button></header>${category.fields.map((field) => renderField(category, field, record, index)).join("")}</article>`).join("")}</div>` : '<p class="health-history-none-hint">已选择无相关健康史，保存后将在总览中显示“无”。</p>'}</section>`;
  }
  function renderEditor() { content.innerHTML = categories.map(renderEditorCard).join(""); }
  function refreshCard(key) {
    const card = content.querySelector(`[data-history-editor-card="${key}"]`);
    if (card) card.outerHTML = renderEditorCard(categoryFor(key));
  }
  function openEditor(focusKey) {
    const data = read();
    draftRecords = Object.fromEntries(categories.map((category) => {
      const records = !legacyNever(data, category.key) && Array.isArray(data[category.key]) ? data[category.key].slice(0, category.single ? 1 : undefined) : [];
      return [category.key, structuredClone(category.key === "medications" ? records.map(medicationRecord) : records)];
    }));
    draftPresence = Object.fromEntries(categories.map((category) => [category.key, data._presence?.[category.key] === "none" || legacyNever(data, category.key) ? "none" : "has"]));
    error.textContent = "";
    renderEditor();
    openSubPage("healthHistoryEditorPage");
    const target = content.querySelector(`[data-history-editor-card="${focusKey}"]`);
    if (focusKey === "diseases") document.querySelector("#healthHistoryEditorPage").scrollIntoView({ block: "start" });
    else target?.scrollIntoView({ block: "center" });
  }
  function closeConfirm() { confirm.hidden = true; deletingRecord = null; }
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-history-category]");
    if (button) openEditor(button.dataset.historyCategory);
  });
  content.addEventListener("click", (event) => {
    const presence = event.target.closest("[data-history-presence]");
    const add = event.target.closest("[data-history-add]");
    const chip = event.target.closest("[data-history-chip]");
    const remove = event.target.closest("[data-history-remove]");
    const key = event.target.closest("[data-history-editor-card]")?.dataset.historyEditorCard;
    const category = categoryFor(key);
    if (!category) return;
    if (presence) { draftPresence[key] = presence.dataset.historyPresence; error.textContent = ""; refreshCard(key); }
    if ((add || chip) && (!category.single || draftRecords[key].length === 0)) {
      const name = chip?.dataset.historyChip;
      const existing = name ? draftRecords[key].findIndex((record) => record.name === name) : -1;
      if (existing >= 0) {
        content.querySelector(`[data-category="${key}"][data-row="${existing}"][data-key="date"]`)?.focus();
        return;
      }
      draftRecords[key].push(name ? { name } : {});
      error.textContent = "";
      refreshCard(key);
      content.querySelector(`[data-category="${key}"][data-row="${draftRecords[key].length - 1}"][data-key="${chip ? "date" : category.fields[0].key}"]`)?.focus();
    }
    if (remove) { deletingRecord = { key, index: Number(remove.dataset.historyRemove) }; confirm.hidden = false; }
  });
  function updateDraft(event) {
    const input = event.target.closest("[data-category][data-row][data-key]");
    if (!input) return;
    const key = input.dataset.category;
    const index = Number(input.dataset.row);
    if (!draftRecords[key]?.[index]) return;
    draftRecords[key][index][input.dataset.key] = input.value;
    error.textContent = "";
    if (input.dataset.key === "status" && event.type === "change") {
      const category = categoryFor(key);
      category.fields.filter((field) => !visible(field, category, input.value)).forEach((field) => { delete draftRecords[key][index][field.key]; });
      refreshCard(key);
    }
  }
  content.addEventListener("input", updateDraft);
  content.addEventListener("change", updateDraft);
  confirm.addEventListener("click", (event) => { if (event.target.closest("[data-history-cancel-delete]")) closeConfirm(); });
  document.querySelector("#healthHistoryDeleteConfirm").addEventListener("click", () => {
    if (deletingRecord) { draftRecords[deletingRecord.key].splice(deletingRecord.index, 1); refreshCard(deletingRecord.key); }
    closeConfirm();
  });
  document.querySelector("#healthHistoryEditorSave").addEventListener("click", () => {
    for (const category of categories) {
      if (draftPresence[category.key] === "has") {
        for (let index = 0; index < draftRecords[category.key].length; index += 1) {
          const record = draftRecords[category.key][index];
          for (const field of category.fields) {
            if (field.required && visible(field, category, record.status) && !String(record[field.key] ?? "").trim()) {
              error.textContent = `请完善${category.title}第${index + 1}条记录的${fieldLabel(field, record)}`;
              content.querySelector(`[data-category="${category.key}"][data-row="${index}"][data-key="${field.key}"]`)?.focus();
              return;
            }
          }
        }
      }
    }
    const data = read();
    data._presence = data._presence || {};
    categories.forEach((category) => {
      const records = draftPresence[category.key] === "none" ? [] : draftRecords[category.key].slice(0, category.single ? 1 : undefined);
      data[category.key] = category.key === "medications" ? records.map(medicationRecord) : records;
      data._presence[category.key] = draftPresence[category.key];
    });
    write(data);
    goBackPage();
  });
  document.querySelectorAll("[data-archive-patient-id]").forEach((button) => button.addEventListener("click", () => queueMicrotask(renderOverview)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeConfirm(); });
  renderOverview();
})();
