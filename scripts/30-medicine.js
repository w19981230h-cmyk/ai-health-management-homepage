function renderMedicineRecordGroup(group, recordId, compact = false) {
  return `
    <section class="${compact ? "medicine-record-group compact" : "medicine-record-group"}">
      <div class="medicine-record-meds">
        ${group.items.map((item) => {
          const image = item.images?.[0] || "";
          return `
            <button class="medicine-record-med" type="button" data-medicine-item="${recordId}" data-medicine-item-id="${item.id}">
              <b class="medicine-record-thumb" style="${medicineThumbStyle(image)}" aria-hidden="true"></b>
              <span>
                <strong>${escapeAttr(item.name)} <em>${escapeAttr(medicineItemDose(item))}</em></strong>
                <small>${escapeAttr(medicineItemUsage(item))}</small>
              </span>
              <i aria-hidden="true"></i>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderMedicineOverviewCard(records) {
  const stats = medicineRecordTypeStats(records);
  return `
    <section class="medicine-overview-card">
      <h2>今日整体概览</h2>
      <div class="medicine-overview-grid">
        <article>
          <div><i class="medicine-overview-icon medicine" aria-hidden="true"></i><span>今日用药总览</span></div>
          <strong>${stats.medicine}<em>次</em></strong>
        </article>
        <article>
          <div><i class="medicine-overview-icon nutrition" aria-hidden="true"></i><span>营养素总览</span></div>
          <strong>${stats.nutrition}<em>次</em></strong>
        </article>
      </div>
    </section>
  `;
}

function renderMedicineDoseItem(item, recordId) {
  const image = item.images?.[0] || "";
  return `
    <button class="medicine-dose-item ${item.type === "nutrition" ? "nutrition" : "medicine"}" type="button" data-medicine-item="${escapeAttr(recordId)}" data-medicine-item-id="${escapeAttr(item.id)}">
      <b class="medicine-record-thumb" style="${medicineThumbStyle(image)}" aria-hidden="true"></b>
      <span>
        <strong>${escapeAttr(item.name)}</strong>
      </span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMedicineDoseGroup(group, recordId) {
  return `
    <section class="medicine-dose-group ${group.type === "nutrition" ? "nutrition" : "medicine"}">
      <h3>
        <i aria-hidden="true"></i>
        <span>${escapeAttr(group.label)}</span>
        <em>${group.items.length}次</em>
      </h3>
      <div class="medicine-dose-items">
        ${group.items.map((item) => renderMedicineDoseItem(item, recordId)).join("")}
      </div>
    </section>
  `;
}

function renderMedicineDoseCard(record) {
  const parts = medicineDateParts(record.time);
  const groups = medicineRecordGroups(record);
  const itemCount = (record.items || []).length;
  return `
    <article class="medicine-dose-card" data-medicine-record="${escapeAttr(record.id)}">
      <header>
        <span>
          <i aria-hidden="true"></i>
          <time>${escapeAttr(parts.time)}</time>
          <em>共${itemCount}项</em>
        </span>
        <button class="medicine-dose-detail-link" type="button" data-medicine-record="${escapeAttr(record.id)}" aria-label="查看当次用药打卡详情"></button>
      </header>
      ${groups.map((group) => renderMedicineDoseGroup(group, record.id)).join("")}
    </article>
  `;
}

function ensureMedicineTodayExamples() {
  const key = medicinePatientKey();
  if (!medicineRecordsByPatient[key]) medicineRecordsByPatient[key] = [];
  const today = todayString();
  const records = medicineRecordsByPatient[key];
  const todayRecords = records.filter((record) => medicineRecordDateKey(record) === today);
  const todayCount = todayRecords.length;
  const nutritionCount = todayRecords.reduce((sum, record) => (
    sum + (record.items || []).filter((item) => item.type === "nutrition").length
  ), 0);
  const mixedCount = todayRecords.filter((record) => {
    const items = record.items || [];
    return items.some((item) => item.type !== "nutrition") && items.some((item) => item.type === "nutrition");
  }).length;
  const examples = [
    {
      id: `med-demo-${today}-0810`,
      time: `${today}T08:10`,
      note: "早餐后",
      items: [
        { id: `med-demo-${today}-0810-a`, type: "medicine", name: "二甲双胍片", images: [medicineMockImages[0]] },
        { id: `med-demo-${today}-0810-b`, type: "medicine", name: "缬沙坦胶囊", images: [medicineMockImages[1]] }
      ]
    },
    {
      id: `med-demo-${today}-1200`,
      time: `${today}T12:00`,
      note: "午餐后",
      items: [
        { id: `med-demo-${today}-1200-a`, type: "medicine", name: "阿托伐他汀钙片", images: [medicineMockImages[2]] },
        { id: `med-demo-${today}-1200-b`, type: "nutrition", name: "维生素C片", images: [medicineMockImages[1]] }
      ]
    },
    {
      id: `med-demo-${today}-1830`,
      time: `${today}T18:30`,
      note: "晚餐后",
      items: [
        { id: `med-demo-${today}-1830-a`, type: "medicine", name: "奥美拉唑肠溶胶囊", images: [medicineMockImages[0]] }
      ]
    },
    {
      id: `med-demo-${today}-2115`,
      time: `${today}T21:15`,
      note: "睡前",
      items: [
        { id: `med-demo-${today}-2115-a`, type: "nutrition", name: "钙片", images: [medicineMockImages[2]] },
        { id: `med-demo-${today}-2115-b`, type: "nutrition", name: "维生素D3软胶囊", images: [medicineMockImages[1]] }
      ]
    }
  ];
  const nutritionExamples = [
    {
      id: `med-nutrition-demo-${today}-0730`,
      time: `${today}T07:30`,
      note: "早餐后补充",
      items: [
        { id: `med-nutrition-demo-${today}-0730-a`, type: "nutrition", name: "维生素C片", images: [medicineMockImages[1]] },
        { id: `med-nutrition-demo-${today}-0730-b`, type: "nutrition", name: "复合维生素B片", images: [medicineMockImages[2]] }
      ]
    },
    {
      id: `med-nutrition-demo-${today}-1430`,
      time: `${today}T14:30`,
      note: "午后补充",
      items: [
        { id: `med-nutrition-demo-${today}-1430-a`, type: "nutrition", name: "鱼油软胶囊", images: [medicineMockImages[0]] }
      ]
    },
    {
      id: `med-nutrition-demo-${today}-2200`,
      time: `${today}T22:00`,
      note: "睡前补充",
      items: [
        { id: `med-nutrition-demo-${today}-2200-a`, type: "nutrition", name: "钙片", images: [medicineMockImages[2]] },
        { id: `med-nutrition-demo-${today}-2200-b`, type: "nutrition", name: "维生素D3软胶囊", images: [medicineMockImages[1]] }
      ]
    }
  ];
  const mixedExamples = [
    {
      id: `med-mixed-demo-${today}-0830`,
      time: `${today}T08:30`,
      note: "早餐后同服",
      items: [
        { id: `med-mixed-demo-${today}-0830-a`, type: "medicine", name: "二甲双胍片", images: [medicineMockImages[0]] },
        { id: `med-mixed-demo-${today}-0830-b`, type: "nutrition", name: "维生素C片", images: [medicineMockImages[1]] },
        { id: `med-mixed-demo-${today}-0830-c`, type: "nutrition", name: "复合维生素B片", images: [medicineMockImages[2]] }
      ]
    },
    {
      id: `med-mixed-demo-${today}-1230`,
      time: `${today}T12:30`,
      note: "午餐后同服",
      items: [
        { id: `med-mixed-demo-${today}-1230-a`, type: "medicine", name: "阿卡波糖片", images: [medicineMockImages[2]] },
        { id: `med-mixed-demo-${today}-1230-b`, type: "nutrition", name: "鱼油软胶囊", images: [medicineMockImages[0]] }
      ]
    },
    {
      id: `med-mixed-demo-${today}-2000`,
      time: `${today}T20:00`,
      note: "晚餐后同服",
      items: [
        { id: `med-mixed-demo-${today}-2000-a`, type: "medicine", name: "缬沙坦胶囊", images: [medicineMockImages[1]] },
        { id: `med-mixed-demo-${today}-2000-b`, type: "medicine", name: "阿托伐他汀钙片", images: [medicineMockImages[2]] },
        { id: `med-mixed-demo-${today}-2000-c`, type: "nutrition", name: "钙片", images: [medicineMockImages[2]] },
        { id: `med-mixed-demo-${today}-2000-d`, type: "nutrition", name: "维生素D3软胶囊", images: [medicineMockImages[1]] }
      ]
    }
  ];
  const existingIds = new Set(records.map((record) => record.id));
  let changed = false;
  examples.slice(0, Math.max(0, 4 - todayCount)).forEach((record) => {
    if (!existingIds.has(record.id)) records.unshift(record);
    changed = true;
  });
  nutritionExamples.slice(0, Math.max(0, 3 - nutritionCount)).forEach((record) => {
    if (!existingIds.has(record.id)) {
      records.unshift(record);
      changed = true;
    }
  });
  mixedExamples.slice(0, Math.max(0, 3 - mixedCount)).forEach((record) => {
    if (!existingIds.has(record.id)) {
      records.unshift(record);
      changed = true;
    }
  });
  if (changed) saveMedicineRecords();
}

function updateMedicineScheduleCard() {
  const data = scheduleDataFor();
  const records = sortedMedicineRecords();
  const latest = records[0];
  let medicineItem = data.checkins.find((item) => item.type === "medicine");
  if (!medicineItem) {
    medicineItem = { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "暂无记录" };
    data.checkins.unshift(medicineItem);
  }
  if (latest) {
    const parts = medicineDateParts(latest.time);
    const summary = medicineRecordSummary(latest);
    Object.assign(medicineItem, {
      title: "用药打卡",
      desc: latest.note || `记录 ${summary.count} 用药/补充明细`,
      count: `已记录 ${records.length} 次`,
      value: `${summary.primary} ${parts.time}`
    });
  } else {
    Object.assign(medicineItem, {
      title: "用药打卡",
      desc: "记录每日用药，帮助按时服药",
      count: "暂无记录",
      value: ""
    });
  }
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  renderSchedule();
}

function renderMedicineRecordsPage() {
  if (!medicineRecordsList) return;
  ensureMedicineTodayExamples();
  const records = medicineTodayDetailRecords();
  if (!records.length) {
    medicineRecordsList.innerHTML = `
      <div class="medicine-record-empty medicine-dose-empty">
        <strong>今日暂无用药记录</strong>
        <span>从健康打卡卡片右上角添加今日记录。</span>
      </div>
      <footer class="medicine-record-action-bar medicine-dose-action-bar">
        <button class="medicine-empty-action" type="button">＋ 记用药</button>
      </footer>
    `;
    return;
  }
  medicineRecordsList.innerHTML = `
    ${renderMedicineOverviewCard(records)}
    <h2 class="medicine-dose-section-title">用药记录</h2>
    <section class="medicine-dose-cards">
      ${records.map((record) => renderMedicineDoseCard(record)).join("")}
      <div class="medicine-dose-end"><span>没有更多数据了</span></div>
    </section>
    <footer class="medicine-record-action-bar medicine-dose-action-bar">
      <button class="medicine-empty-action" type="button">＋ 记用药</button>
    </footer>
  `;
}

function openMedicineRecordsPage() {
  renderMedicineRecordsPage();
  openSubPage("medicineRecordsPage");
}

function renderMedicineDetailPage() {
  const record = medicineRecordById(selectedMedicineRecordId) || sortedMedicineRecords()[0];
  if (!record) {
    openMedicineRecordsPage();
    return;
  }
  selectedMedicineRecordId = record.id;
  const parts = medicineDateParts(record.time);
  const groups = medicineRecordGroups(record);
  if (medicineDetailDelete) medicineDetailDelete.textContent = "删除本次打卡记录";
  if (medicineDetailSummary) {
    medicineDetailSummary.hidden = false;
    medicineDetailSummary.innerHTML = `
      <div class="medicine-detail-readonly-row">
        <span>记录时间</span>
        <strong>${parts.full}</strong>
      </div>
    `;
  }
  if (medicineDetailList) {
    let imageCursor = 0;
    medicineDetailList.innerHTML = `
      ${groups.map((group) => `
      <section class="medicine-detail-group">
        <div class="medicine-record-group-title ${group.type}">
          <i aria-hidden="true"></i>
          <span>${group.label}</span>
          <strong>${group.items.length}次</strong>
        </div>
        ${group.items.map((item) => {
          const images = item.images || [];
          const preview = images[0] || "";
          return `
            <article class="medicine-detail-item" data-medicine-item="${record.id}" data-medicine-item-id="${item.id}">
              <div class="medicine-detail-item-main">
                <b class="medicine-record-thumb" style="${medicineThumbStyle(preview)}" aria-hidden="true"></b>
                <span>
                  <strong>${escapeAttr(item.name)}</strong>
                </span>
                <i class="medicine-detail-item-arrow" aria-hidden="true"></i>
              </div>
              ${images.length ? `<div class="medicine-detail-proof">
                <div class="medicine-detail-images">
                  ${images.map((image) => {
                    const index = imageCursor++;
                    return `<button type="button" data-medicine-image="${record.id}" data-image-index="${index}" style="${medicineThumbStyle(image)}" aria-label="查看${escapeAttr(item.name)}图片"></button>`;
                  }).join("")}
                </div>
              </div>` : ""}
            </article>
          `;
        }).join("")}
      </section>
    `).join("")}
      <section class="medicine-detail-note">
        <strong>备注</strong>
        <p>${escapeAttr(record.note || "暂无备注")}</p>
      </section>
    `;
  }
}

function openMedicineDetailPage(recordId) {
  selectedMedicineRecordId = recordId;
  renderMedicineDetailPage();
  openSubPage("medicineDetailPage");
}

function medicineItemById(recordId, itemId) {
  const record = medicineRecordById(recordId);
  const item = record?.items?.find((entry) => entry.id === itemId);
  return { record, item };
}

function medicineItemImageStartIndex(record, itemId) {
  let cursor = 0;
  for (const entry of record?.items || []) {
    if (entry.id === itemId) return cursor;
    cursor += entry.images?.length || 0;
  }
  return 0;
}

function openMedicineItemDetailSheet(recordId, itemId) {
  const { record, item } = medicineItemById(recordId, itemId);
  if (!record || !item || !medicineItemDetailSheet || !medicineItemDetailBody) return;
  selectedMedicineItemRecordId = recordId;
  selectedMedicineItemId = itemId;
  const images = item.images || [];
  const itemType = item.type === "nutrition" ? "nutrition" : "medicine";
  const itemCopy = medicineRecordCopy(itemType);
  medicineItemDetailBody.innerHTML = `
    <section class="medicine-item-edit-card">
      <div class="medicine-item-edit-type" aria-label="记录类型">
        <span>记录类型</span>
        <div role="tablist">
          <button class="${itemType === "medicine" ? "active" : ""}" type="button" data-edit-medicine-type="medicine">药品</button>
          <button class="${itemType === "nutrition" ? "active" : ""}" type="button" data-edit-medicine-type="nutrition">营养素</button>
        </div>
      </div>
      <label class="medicine-item-edit-field">
        <span>${escapeAttr(itemCopy.fieldTitle)}</span>
        <input id="medicineItemEditName" value="${escapeAttr(item.name)}" placeholder="${escapeAttr(itemCopy.placeholder)}">
      </label>
      <div class="medicine-item-edit-images">
        <span>图片</span>
        <div>
          ${images.map((image, index) => `
            <button class="medicine-item-edit-thumb" type="button" data-edit-medicine-image-index="${index}" style="${medicineThumbStyle(image)}" aria-label="查看图片">
              <i data-remove-detail-medicine-image="${index}" aria-label="删除图片">×</i>
            </button>
          `).join("")}
          ${images.length < 9 ? `<button class="medicine-item-edit-add-image" type="button" data-add-detail-medicine-image>＋</button>` : ""}
        </div>
      </div>
      <button class="medicine-item-edit-time" type="button" data-edit-medicine-time>
        <span>记录时间</span>
        <strong>${escapeAttr(formatMedicineTimeText(record.time))}</strong>
        <i aria-hidden="true"></i>
      </button>
    </section>
  `;
  const title = medicineItemDetailSheet.querySelector("header h3");
  if (title) title.textContent = itemType === "nutrition" ? "编辑营养素记录" : "编辑药品记录";
  const footer = medicineItemDetailSheet.querySelector("footer");
  if (footer) {
    footer.innerHTML = `
      <button id="medicineItemDelete" class="medicine-item-delete-action" type="button">删除</button>
      <button id="medicineItemSave" class="medicine-item-save-action" type="button">确定</button>
    `;
    footer.querySelector("#medicineItemDelete")?.addEventListener("click", deleteSelectedMedicineItem);
    footer.querySelector("#medicineItemSave")?.addEventListener("click", saveSelectedMedicineItem);
  }
  sheetMask.classList.add("active");
  medicineItemDetailSheet.classList.add("active");
}

function renderSelectedMedicineItemDetailSheet() {
  if (selectedMedicineItemRecordId && selectedMedicineItemId) {
    openMedicineItemDetailSheet(selectedMedicineItemRecordId, selectedMedicineItemId);
  }
}

function updateSelectedMedicineItem(updater) {
  const key = medicinePatientKey();
  let updated = false;
  medicineRecordsByPatient[key] = currentMedicineRecords().map((record) => {
    if (record.id !== selectedMedicineItemRecordId) return record;
    const items = (record.items || []).map((item) => {
      if (item.id !== selectedMedicineItemId) return item;
      updated = true;
      return updater(item, record);
    });
    return { ...record, items };
  });
  return updated;
}

function saveSelectedMedicineItem() {
  const input = document.querySelector("#medicineItemEditName");
  const nextName = input?.value.trim() || "";
  if (!nextName) {
    showToast("请填写药品或营养素名称");
    input?.focus();
    return;
  }
  const saved = updateSelectedMedicineItem((item) => ({ ...item, name: nextName }));
  if (!saved) return;
  saveMedicineRecords();
  updateMedicineScheduleCard();
  renderMedicineRecordsPage();
  if (selectedMedicineRecordId === selectedMedicineItemRecordId) renderMedicineDetailPage();
  closeOverlays();
  showToast("药品记录已更新");
}

function selectedMedicineItemDraftName(fallback = "") {
  return document.querySelector("#medicineItemEditName")?.value.trim() || fallback;
}

function updateSelectedMedicineItemType(type) {
  const nextType = type === "nutrition" ? "nutrition" : "medicine";
  if (!updateSelectedMedicineItem((item) => ({ ...item, type: nextType, name: selectedMedicineItemDraftName(item.name) }))) return;
  saveMedicineRecords();
  renderMedicineRecordsPage();
  renderSelectedMedicineItemDetailSheet();
}

function addSelectedMedicineItemImages(files) {
  const incoming = Array.from(files || []);
  if (!incoming.length) return;
  updateSelectedMedicineItem((item) => {
    const images = [...(item.images || [])];
    const available = 9 - images.length;
    incoming.slice(0, available).forEach((file, index) => {
      let preview = medicineMockImages[(images.length + index) % medicineMockImages.length];
      try {
        preview = URL.createObjectURL(file);
      } catch (error) {
        preview = medicineMockImages[(images.length + index) % medicineMockImages.length];
      }
      images.push(preview);
    });
    if (incoming.length > available) showToast("每个药品最多上传 9 张图片");
    return { ...item, name: selectedMedicineItemDraftName(item.name), images };
  });
  saveMedicineRecords();
  renderMedicineRecordsPage();
  renderSelectedMedicineItemDetailSheet();
}

function removeSelectedMedicineItemImage(index) {
  updateSelectedMedicineItem((item) => {
    const images = [...(item.images || [])];
    const [removed] = images.splice(index, 1);
    if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
    return { ...item, name: selectedMedicineItemDraftName(item.name), images };
  });
  saveMedicineRecords();
  renderMedicineRecordsPage();
  renderSelectedMedicineItemDetailSheet();
}

function deleteSelectedMedicineItem() {
  if (!selectedMedicineItemRecordId || !selectedMedicineItemId) return;
  const key = medicinePatientKey();
  const records = currentMedicineRecords();
  medicineRecordsByPatient[key] = records.reduce((next, record) => {
    if (record.id !== selectedMedicineItemRecordId) {
      next.push(record);
      return next;
    }
    const items = (record.items || []).filter((item) => item.id !== selectedMedicineItemId);
    if (items.length) next.push({ ...record, items });
    return next;
  }, []);
  const deletedRecordId = selectedMedicineItemRecordId;
  selectedMedicineItemRecordId = "";
  selectedMedicineItemId = "";
  saveMedicineRecords();
  updateMedicineScheduleCard();
  renderMedicineRecordsPage();
  if (selectedMedicineRecordId === deletedRecordId && medicineRecordById(deletedRecordId)) {
    renderMedicineDetailPage();
  } else if (selectedMedicineRecordId === deletedRecordId) {
    selectedMedicineRecordId = "";
    renderMedicineRecordsPage();
    openSubPage("medicineRecordsPage");
  }
  closeOverlays();
  showToast("该药品记录已删除");
}

function deleteSelectedMedicineRecord() {
  if (!selectedMedicineRecordId) return;
  const key = medicinePatientKey();
  medicineRecordsByPatient[key] = currentMedicineRecords().filter((record) => record.id !== selectedMedicineRecordId);
  selectedMedicineRecordId = "";
  saveMedicineRecords();
  updateMedicineScheduleCard();
  renderMedicineRecordsPage();
  document.body.classList.add("detail-page-open");
  planPage.classList.remove("active");
  servicePage.classList.remove("active");
  serviceDetailPage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((item) => item.classList.toggle("active", item.id === "medicineRecordsPage"));
  pageStack = pageStack.filter((pageId) => pageId !== "medicineDetailPage");
  if (pageStack[pageStack.length - 1] === "medicineRecordsPage") pageStack.pop();
  showToast("用药记录已删除");
}

function openMedicineImagePage(recordId, imageIndex = 0) {
  const record = medicineRecordById(recordId);
  if (!record) return;
  medicinePreviewImages = record.items.flatMap((item) => (item.images || []).map((image) => ({ image, name: item.name })));
  medicinePreviewIndex = Math.max(0, Math.min(Number(imageIndex) || 0, medicinePreviewImages.length - 1));
  renderMedicineImagePage();
  openSubPage("medicineImagePage");
}

function renderMedicineImagePage() {
  const current = medicinePreviewImages[medicinePreviewIndex];
  if (!current) return;
  if (medicineImageCount) medicineImageCount.textContent = `${medicinePreviewIndex + 1} / ${medicinePreviewImages.length}`;
  if (medicineImageLarge) medicineImageLarge.setAttribute("style", medicineThumbStyle(current.image));
  if (medicineImageThumbs) {
    medicineImageThumbs.innerHTML = medicinePreviewImages.map((item, index) => `
      <button class="${index === medicinePreviewIndex ? "active" : ""}" type="button" data-preview-index="${index}" style="${medicineThumbStyle(item.image)}" aria-label="查看第${index + 1}张图片"></button>
    `).join("");
  }
}

function stepMedicineImage(delta) {
  if (!medicinePreviewImages.length) return;
  medicinePreviewIndex = (medicinePreviewIndex + delta + medicinePreviewImages.length) % medicinePreviewImages.length;
  renderMedicineImagePage();
}

function createMedicineItem(name = "", images = [], type = "medicine") {
  return {
    id: `medicine-${medicineIdSeed++}`,
    type,
    name,
    images
  };
}

function openMedicineCheckinSheet(recordId = "") {
  closeOverlays();
  const record = recordId ? medicineRecordById(recordId) : null;
  editingMedicineRecordId = record?.id || "";
  medicineItems = record
    ? record.items.map((item) => createMedicineItem(item.name, [...(item.images || [])], item.type))
    : [createMedicineItem()];
  medicineImageTargetId = "";
  if (medicineTime) medicineTime.value = record?.time || localDateTimeValue();
  updateMedicineTimeText();
  if (medicineNote) medicineNote.value = record?.note || "";
  updateMedicineNoteCount();
  renderMedicineItems();
  const title = medicineCheckinSheet?.querySelector(".medicine-sheet-head h3");
  if (title) title.textContent = editingMedicineRecordId ? "编辑用药/补充记录" : "用药/补充记录";
  if (medicineConfirm) medicineConfirm.textContent = editingMedicineRecordId ? "保存记录" : "打卡";
  sheetMask.classList.add("active");
  medicineCheckinSheet?.classList.add("active");
}

function medicineRecordCopy(type = "medicine") {
  return type === "nutrition"
    ? {
      itemTitle: "营养素",
      fieldTitle: "营养素名称",
      placeholder: "请输入营养素名称",
      imageHelp: "营养素图片（选填，支持多选，最多9张）",
      nameToast: "请填写营养素名称"
    }
    : {
      itemTitle: "药品",
      fieldTitle: "药品名称",
      placeholder: "请输入药品名称",
      imageHelp: "药品图片（选填，支持多选，最多9张）",
      nameToast: "请填写药品名称"
    };
}

function formatMedicineTimeText(value) {
  return formatCheckinTimeDisplay(value, "请选择记录时间");
}

function updateMedicineTimeText() {
  if (!medicineTimeText || !medicineTime) return;
  medicineTimeText.textContent = formatMedicineTimeText(medicineTime.value);
}

function populateMedicineTimePicker() {
  if (!medicinePickerDate || !medicinePickerHour || !medicinePickerMinute || !medicineTime) return;
  const selected = medicineTime.value ? new Date(medicineTime.value) : new Date();
  const pad = (value) => String(value).padStart(2, "0");
  medicinePickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  medicinePickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => `<option value="${pad(hour)}">${pad(hour)}</option>`).join("");
  medicinePickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const minute = pad(index * 5);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  medicinePickerDate.value = `${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`;
  medicinePickerHour.value = pad(selected.getHours());
  medicinePickerMinute.value = pad(Math.round(selected.getMinutes() / 5) * 5).replace("60", "55");
}

function openMedicineTimePicker() {
  medicineTimePickerMode = "checkin";
  populateMedicineTimePicker();
  medicineTimePicker?.classList.add("active");
}

function closeMedicineTimePicker() {
  medicineTimePicker?.classList.remove("active");
  medicineTimePickerMode = "checkin";
}

function confirmMedicineTimePicker() {
  if (!medicinePickerDate?.value || !medicinePickerHour?.value || !medicinePickerMinute?.value || !medicineTime) return;
  medicineTime.value = `${medicinePickerDate.value}T${medicinePickerHour.value}:${medicinePickerMinute.value}`;
  if (medicineTimePickerMode === "detail" && selectedMedicineRecordId) {
    updateSelectedMedicineRecordTime(medicineTime.value);
    closeMedicineTimePicker();
    return;
  }
  if (medicineTimePickerMode === "item" && selectedMedicineItemRecordId) {
    updateSelectedMedicineItemRecordTime(medicineTime.value);
    closeMedicineTimePicker();
    return;
  }
  updateMedicineTimeText();
  closeMedicineTimePicker();
}

function updateMedicineNoteCount() {
  if (!medicineNoteCount || !medicineNote) return;
  medicineNoteCount.textContent = `${medicineNote.value.length}/200`;
}

function openMedicineDetailTimePicker() {
  const record = medicineRecordById(selectedMedicineRecordId);
  if (!record || !medicineTime) return;
  medicineTimePickerMode = "detail";
  medicineTime.value = record.time || localDateTimeValue();
  populateMedicineTimePicker();
  medicineTimePicker?.classList.add("active");
}

function openMedicineItemTimePicker() {
  const record = medicineRecordById(selectedMedicineItemRecordId);
  if (!record || !medicineTime) return;
  medicineTimePickerMode = "item";
  medicineTime.value = record.time || localDateTimeValue();
  populateMedicineTimePicker();
  medicineTimePicker?.classList.add("active");
}

function updateSelectedMedicineRecordTime(value) {
  const key = medicinePatientKey();
  medicineRecordsByPatient[key] = currentMedicineRecords().map((record) => (
    record.id === selectedMedicineRecordId ? { ...record, time: value } : record
  ));
  saveMedicineRecords();
  updateMedicineScheduleCard();
  renderMedicineRecordsPage();
  renderMedicineDetailPage();
  showToast("记录时间已更新");
}

function updateSelectedMedicineItemRecordTime(value) {
  const key = medicinePatientKey();
  medicineRecordsByPatient[key] = currentMedicineRecords().map((record) => (
    record.id === selectedMedicineItemRecordId ? { ...record, time: value } : record
  ));
  saveMedicineRecords();
  updateMedicineScheduleCard();
  renderMedicineRecordsPage();
  if (selectedMedicineRecordId === selectedMedicineItemRecordId) renderMedicineDetailPage();
  renderSelectedMedicineItemDetailSheet();
  showToast("记录时间已更新");
}

function renderMedicineItems() {
  if (!medicineList) return;
  if (medicineListTitle) medicineListTitle.textContent = "用药/补充记录";
  if (medicineListDesc) medicineListDesc.textContent = "可添加多个记录，时间和备注对所有条目生效";
  if (medicineAdd) medicineAdd.textContent = "+ 添加记录";
  medicineList.innerHTML = medicineItems.map((item, index) => {
    const itemType = item.type === "nutrition" ? "nutrition" : "medicine";
    const copy = medicineRecordCopy(itemType);
    return `
    <article class="medicine-card" data-medicine-id="${item.id}">
      <div class="medicine-card-head">
        <i class="medicine-drag" aria-hidden="true"></i>
        <strong>${copy.itemTitle} ${index + 1}</strong>
        <button class="medicine-delete" type="button" data-delete-medicine="${item.id}" aria-label="删除${copy.itemTitle}"></button>
      </div>
      <div class="medicine-item-type" aria-label="${copy.itemTitle}记录类型">
        <span>记录类型</span>
        <div role="tablist">
          <button class="${itemType === "medicine" ? "active" : ""}" type="button" data-medicine-item-type="${item.id}" data-item-type="medicine">药品</button>
          <button class="${itemType === "nutrition" ? "active" : ""}" type="button" data-medicine-item-type="${item.id}" data-item-type="nutrition">营养素</button>
        </div>
      </div>
      <label>
        <span class="medicine-field-title">${copy.fieldTitle} <b class="required-mark">※</b></span>
        <input class="medicine-name-input" value="${escapeAttr(item.name)}" data-medicine-name="${item.id}" placeholder="${copy.placeholder}">
      </label>
      <div>
        <p class="medicine-image-help">${copy.imageHelp}</p>
        <div class="medicine-images">
          ${item.images.map((image, imageIndex) => `
            <div class="medicine-thumb" style="${image.startsWith("blob:") ? `background-image:url('${image}')` : `background:${image}`}">
              <button type="button" data-remove-medicine-image="${item.id}" data-image-index="${imageIndex}" aria-label="删除图片">×</button>
            </div>
          `).join("")}
          ${item.images.length < 9 ? `<button class="medicine-add-image" type="button" data-add-medicine-image="${item.id}">添加图片</button>` : ""}
        </div>
      </div>
    </article>
  `;
  }).join("");
}

function addMedicineItem() {
  medicineItems.push(createMedicineItem());
  renderMedicineItems();
}

function deleteMedicineItem(id) {
  const removed = medicineItems.find((item) => item.id === id);
  removed?.images.forEach((image) => {
    if (image.startsWith("blob:")) URL.revokeObjectURL(image);
  });
  medicineItems = medicineItems.filter((item) => item.id !== id);
  renderMedicineItems();
}

function addMedicineImages(files) {
  const item = medicineItems.find((medicine) => medicine.id === medicineImageTargetId);
  if (!item) return;
  const available = 9 - item.images.length;
  const incoming = Array.from(files || []).slice(0, available);
  incoming.forEach((file, index) => {
    let preview = medicineMockImages[(item.images.length + index) % medicineMockImages.length];
    try {
      preview = URL.createObjectURL(file);
    } catch (error) {
      preview = medicineMockImages[(item.images.length + index) % medicineMockImages.length];
    }
    item.images.push(preview);
  });
  if (Array.from(files || []).length > available) showToast("每个药品最多上传 9 张图片");
  renderMedicineItems();
}

function saveMedicineNamesFromDom() {
  medicineList?.querySelectorAll("[data-medicine-name]").forEach((input) => {
    const item = medicineItems.find((medicine) => medicine.id === input.dataset.medicineName);
    if (item) item.name = input.value.trim();
  });
}

function confirmMedicineCheckin() {
  saveMedicineNamesFromDom();
  if (!medicineTime?.value) {
    showToast("请选择记录时间");
    return;
  }
  if (!medicineItems.length) {
    showToast("请至少添加 1 条记录");
    return;
  }
  const empty = medicineItems.find((item) => !item.name);
  if (empty) {
    const copy = medicineRecordCopy(empty.type);
    showToast(copy.nameToast);
    medicineList?.querySelector(`[data-medicine-name="${empty.id}"]`)?.focus();
    return;
  }
  const key = medicinePatientKey();
  const nextRecord = {
    id: editingMedicineRecordId || `med-${Date.now()}`,
    time: medicineTime.value,
    note: medicineNote?.value?.trim() || "",
    items: medicineItems.map((item, index) => ({
      id: item.id || `med-item-${Date.now()}-${index}`,
      type: item.type === "nutrition" ? "nutrition" : "medicine",
      name: item.name,
      images: [...(item.images || [])]
    }))
  };
  if (!medicineRecordsByPatient[key]) medicineRecordsByPatient[key] = [];
  if (editingMedicineRecordId) {
    medicineRecordsByPatient[key] = medicineRecordsByPatient[key].map((record) => record.id === editingMedicineRecordId ? nextRecord : record);
  } else {
    medicineRecordsByPatient[key].unshift(nextRecord);
  }
  selectedMedicineRecordId = nextRecord.id;
  editingMedicineRecordId = "";
  saveMedicineRecords();
  updateMedicineScheduleCard();
  closeOverlays();
  const hasMedicine = medicineItems.some((item) => item.type !== "nutrition");
  const hasNutrition = medicineItems.some((item) => item.type === "nutrition");
  renderMedicineDetailPage();
  renderMedicineRecordsPage();
  showUnifiedCheckinSuccess([
    {
      label: hasMedicine && hasNutrition ? "用药/补充" : hasNutrition ? "营养素记录" : "用药记录",
      value: `${nextRecord.items.length}`,
      unit: "条"
    },
    { label: "记录时间", value: formatMedicineTimeText(nextRecord.time) }
  ]);
}

function formatSportTimeText(value) {
  return formatCheckinTimeDisplay(value);
}

function updateSportNoteCount() {
  if (!sportNoteInput || !sportNoteCount) return;
  sportNoteCount.textContent = `${sportNoteInput.value.length}/100`;
}

function currentSportName() {
  if (sportSelectedType !== "other") return sportTypes[sportSelectedType]?.label || "步行";
  return sportOtherName || "其他";
}
