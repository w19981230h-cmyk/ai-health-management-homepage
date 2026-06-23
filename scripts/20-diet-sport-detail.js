function openDietUploadSheet() {
  closeOverlays();
  resetDietUploadState();
  showDietUploadSheet();
}

function renderDietMealOptions() {
  dietMealOptions?.querySelectorAll("[data-diet-meal]").forEach((button) => {
    button.classList.toggle("active", button.dataset.dietMeal === dietSelectedMeal);
  });
}

function renderDietUploadImages() {
  if (!dietImageGrid || !dietUploadArea) return;
  dietUploadArea.classList.toggle("hidden", dietUploadImages.length > 0);
  dietImageGrid.classList.toggle("active", dietUploadImages.length > 0);
  dietImageGrid.innerHTML = dietUploadImages.map((image, index) => `
    <div class="diet-image-thumb" style="${image.preview?.startsWith("blob:") ? `background-image:url('${image.preview}')` : `background:${image.preview || dietMockImages[index % dietMockImages.length]}`}">
      <button type="button" data-remove-diet-image="${index}" aria-label="删除图片">×</button>
    </div>
  `).join("") + (dietUploadImages.length < 9 ? `<button class="diet-image-add" type="button" data-add-diet-image>+</button>` : "");
}

function addDietMockImage() {
  if (dietUploadImages.length >= 9) {
    showToast("最多上传 9 张图片");
    return;
  }
  const index = dietUploadImages.length;
  dietUploadImages.push({
    id: `mock-${Date.now()}-${index}`,
    name: `meal-${index + 1}.jpg`,
    preview: dietMockImages[index % dietMockImages.length]
  });
  renderDietUploadImages();
}

function addDietFiles(files) {
  [...files].slice(0, 9 - dietUploadImages.length).forEach((file, index) => {
    dietUploadImages.push({
      id: `file-${Date.now()}-${index}`,
      name: file.name || `meal-${dietUploadImages.length + 1}.jpg`,
      preview: URL.createObjectURL(file)
    });
  });
  if (files.length > 9 || dietUploadImages.length >= 9) showToast("最多上传 9 张图片");
  renderDietUploadImages();
}

function openDietCameraPage(reset = false) {
  if (reset) resetDietUploadState();
  openCameraPage("diet");
}

function buildDietResults() {
  const meal = dietSelectedMeal || "早餐";
  const time = formatDietTime(dietMealTime?.value);
  return dietUploadImages.map((image, imageIndex) => ({
    image,
    meal,
    time,
    foods: dietFoodTemplates[imageIndex % dietFoodTemplates.length].map((food, foodIndex) => ({
      ...food,
      id: `${image.id}-${foodIndex}`,
      grams: food.grams || 100,
      baseCalories: food.calories,
      baseProtein: food.protein,
      baseFat: food.fat,
      baseCarb: food.carb,
      recordTime: time
    }))
  }));
}

function formatFoodNumber(value) {
  const numeric = Number(value || 0);
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1).replace(/\.0$/, "");
}

function updateFoodByGrams(food, grams) {
  const nextGrams = Math.max(1, Math.min(2000, Number(grams) || 1));
  const ratio = nextGrams / 100;
  food.grams = nextGrams;
  food.calories = Math.round((food.baseCalories ?? food.calories ?? 0) * ratio);
  food.protein = Number(((food.baseProtein ?? food.protein ?? 0) * ratio).toFixed(1));
  food.fat = Number(((food.baseFat ?? food.fat ?? 0) * ratio).toFixed(1));
  food.carb = Number(((food.baseCarb ?? food.carb ?? 0) * ratio).toFixed(1));
}

function dietTotals() {
  const foods = dietResults.flatMap((result) => result.foods);
  return foods.reduce((total, food) => ({
    calories: total.calories + Number(food.calories || 0),
    protein: total.protein + Number(food.protein || 0),
    fat: total.fat + Number(food.fat || 0),
    carb: total.carb + Number(food.carb || 0)
  }), { calories: 0, protein: 0, fat: 0, carb: 0 });
}

function startDietRecognition() {
  if (!dietUploadImages.length) {
    showToast("请先上传食物图片");
    return;
  }
  if (!dietSelectedMeal) {
    showToast("请选择餐次");
    return;
  }
  dietRecognitionIndex = 0;
  dietResults = buildDietResults();
  clearTimeout(dietRecognitionTimer);
  closeOverlays();
  openSubPage("dietRecognizePage");
  renderDietRecognition(false);
  runDietRecognitionStep();
}

function renderDietRecognition(failed) {
  if (!dietRecognizeStep || !dietRecognizeProgress || !dietRecognizeThumbs) return;
  dietAiStatus.hidden = Boolean(failed);
  dietFailCard.hidden = !failed;
  const total = Math.max(dietUploadImages.length, 1);
  const current = Math.min(dietRecognitionIndex + 1, total);
  dietRecognizeStep.textContent = `正在识别第 ${current} / ${total} 张`;
  dietRecognizeProgress.style.width = `${Math.min(100, Math.round((current / total) * 100))}%`;
  dietRecognizeThumbs.innerHTML = dietUploadImages.map((image, index) => `
    <span class="${index === dietRecognitionIndex ? "active" : ""}" style="${image.preview?.startsWith("blob:") ? `background-image:url('${image.preview}')` : `background:${image.preview}`}"></span>
  `).join("");
}

function runDietRecognitionStep() {
  renderDietRecognition(false);
  dietRecognitionTimer = window.setTimeout(() => {
    if (dietRecognitionIndex < dietUploadImages.length - 1) {
      dietRecognitionIndex += 1;
      runDietRecognitionStep();
      return;
    }
    openDietResultPage();
  }, 760);
}

function showDietRecognitionFailure() {
  clearTimeout(dietRecognitionTimer);
  renderDietRecognition(true);
}

function openDietResultPage() {
  clearTimeout(dietRecognitionTimer);
  dietResultMode = "checkin";
  dietResultIndex = 0;
  if (dietResultTime && dietMealTime?.value) dietResultTime.value = dietMealTime.value;
  if (dietResultNoteInput) dietResultNoteInput.value = dietNoteInput?.value?.trim() || "今天的分量比平时稍少。";
  renderDietResult();
  openSubPage("dietResultPage");
}

function renderDietResult() {
  if (!dietFoodList) return;
  const readonlyResult = dietResultMode === "detail";
  const totals = dietTotals();
  dietTotalCalories.innerHTML = `${Math.round(totals.calories)} <em>kcal · 食物总热量</em>`;
  dietProteinTotal.textContent = `${Math.round(totals.protein)}g`;
  dietFatTotal.textContent = `${Number(totals.fat.toFixed(1))}g`;
  dietCarbTotal.textContent = `${Math.round(totals.carb)}g`;
  const current = dietResults[dietResultIndex] || dietResults[0];
  dietMealTitle.textContent = current?.meal || "早餐";
  const resultTime = formatDietTime(dietResultTime?.value || dietMealTime?.value);
  dietRecordTimeText.textContent = `${resultTime || current?.time || "12:00"} 记录`;
  dietFoodList.innerHTML = (current?.foods || []).map((food) => `
    <article class="diet-food-card" data-food-id="${food.id}" role="button" tabindex="0">
      <i class="food-thumb ${food.image}" aria-hidden="true"></i>
      <div>
        <strong>${food.name}</strong>
        <p>${food.calories} kcal · ${formatFoodNumber(food.grams || 100)}g</p>
      </div>
      <menu class="diet-food-actions">
        <button class="diet-food-edit" type="button" data-edit-food="${food.id}" aria-label="编辑${escapeAttr(food.name)}"></button>
      </menu>
    </article>
  `).join("") + (current ? renderDietResultMeta(current) : "") || `<div class="diet-empty-result">当前图片的食物已删除</div>`;
  if (dietResultNoteInput) {
    dietResultNoteInput.readOnly = readonlyResult;
    dietResultNoteInput.setAttribute("aria-readonly", String(readonlyResult));
  }
  if (dietConfirmCheckin) {
    dietConfirmCheckin.textContent = readonlyResult ? "删除" : "打卡";
    dietConfirmCheckin.classList.toggle("danger", readonlyResult);
  }
}

function findDietFood(foodId) {
  return dietResults.flatMap((result) => result.foods).find((item) => item.id === foodId);
}

function findDietResultFoodGroup(foodId) {
  return dietResults.find((result) => result.foods?.some((item) => item.id === foodId));
}

function findDietDetailFood(foodId) {
  return (dietDetailMealGroups || []).flatMap((group) => group.foods).find((item) => item.id === foodId);
}

function findDietDetailFoodGroup(foodId) {
  return (dietDetailMealGroups || []).find((group) => group.foods?.some((item) => item.id === foodId));
}

function currentEditingDietFood() {
  return editingDietFoodContext === "detail"
    ? findDietDetailFood(editingDietFoodId)
    : findDietFood(editingDietFoodId);
}

function openDietGramSheet(foodId) {
  const food = findDietFood(foodId);
  if (!food) return;
  editingDietFoodId = foodId;
  editingDietFoodContext = "result";
  openDietFoodEditSheet(food);
}

function openDietDetailFoodSheet(foodId) {
  const food = findDietDetailFood(foodId);
  if (!food) return;
  editingDietFoodId = foodId;
  editingDietFoodContext = "detail";
  openDietFoodEditSheet(food);
}

function openDietFoodEditSheet(food) {
  const isDetailEdit = editingDietFoodContext === "detail";
  const currentGroup = isDetailEdit ? findDietDetailFoodGroup(editingDietFoodId) : findDietResultFoodGroup(editingDietFoodId);
  const resultTime = !isDetailEdit ? formatDietTime(dietResultTime?.value || dietMealTime?.value) : "";
  const currentTime = dietDetailTimeOnly(food.recordTime || currentGroup?.time || resultTime);
  if (dietFoodNameInput) dietFoodNameInput.value = food.name;
  if (dietGramInput) dietGramInput.value = food.grams || detailFoodGrams(food) || 100;
  if (dietEditMealSelect) dietEditMealSelect.value = currentGroup?.meal || dietSelectedMeal || "早餐";
  if (dietEditTimeInput) dietEditTimeInput.value = currentTime === "--:--" ? "08:00" : currentTime;
  const grams = food.grams || detailFoodGrams(food) || 100;
  if (dietEditTitle) dietEditTitle.textContent = "编辑食物";
  if (dietEditFoodThumb) dietEditFoodThumb.className = `food-thumb ${food.image || ""}`;
  if (dietEditFoodMeta) dietEditFoodMeta.textContent = food.name || "";
  sheetMask.classList.add("active");
  dietGramSheet?.classList.add("active");
  dietGramSheet?.classList.add("detail-edit-mode");
}

function closeDietGramSheet() {
  editingDietFoodId = "";
  editingDietFoodContext = "result";
  dietGramSheet?.classList.remove("active", "detail-edit-mode");
  if (!document.querySelector(".diet-upload-sheet.active, .medicine-checkin-sheet.active, .sport-checkin-sheet.active, .weight-checkin-page.active, .waist-checkin-sheet.active, .pressure-checkin-sheet.active, .sugar-checkin-sheet.active, .checkin-success-dialog.active, .sport-success-dialog.active, .pressure-success-dialog.active, .sugar-success-dialog.active, .unified-checkin-success-dialog.active")) {
    sheetMask.classList.remove("active");
  }
}

function confirmDietGramEdit() {
  const food = currentEditingDietFood();
  if (!food) return;
  const nextName = dietFoodNameInput?.value?.trim();
  if (!nextName) {
    showToast("请输入食物名称");
    dietFoodNameInput?.focus();
    return;
  }
  food.name = nextName;
  updateFoodByGrams(food, dietGramInput?.value);
  if (editingDietFoodContext === "detail") {
    const currentGroup = findDietDetailFoodGroup(editingDietFoodId);
    const nextMeal = dietEditMealSelect?.value || currentGroup?.meal || "早餐";
    const nextTime = dietEditTimeInput?.value || dietDetailTimeOnly(food.recordTime || currentGroup?.time);
    food.amount = `${formatFoodNumber(food.grams || 100)}g`;
    food.recordTime = nextTime;
    if (currentGroup) {
      currentGroup.time = `${nextTime} 记录`;
      if (nextMeal !== currentGroup.meal) {
        currentGroup.foods = currentGroup.foods.filter((item) => item.id !== food.id);
        let targetGroup = dietDetailMealGroups.find((group) => group.meal === nextMeal);
        if (!targetGroup) {
          targetGroup = { meal: nextMeal, time: `${nextTime} 记录`, foods: [], images: [] };
          dietDetailMealGroups.push(targetGroup);
        }
        targetGroup.time = `${nextTime} 记录`;
        targetGroup.foods.push(food);
        dietDetailMealGroups = dietDetailMealGroups.filter((group) => group.foods?.length);
      }
    }
  } else {
    const currentGroup = findDietResultFoodGroup(editingDietFoodId);
    const nextMeal = dietEditMealSelect?.value || currentGroup?.meal || dietSelectedMeal || "早餐";
    const nextTime = dietEditTimeInput?.value || dietDetailTimeOnly(food.recordTime || currentGroup?.time || dietResultTime?.value);
    food.recordTime = nextTime;
    if (currentGroup) {
      currentGroup.meal = nextMeal;
      currentGroup.time = nextTime;
      currentGroup.foods.forEach((item) => {
        item.recordTime = nextTime;
      });
    }
    const nextDateTime = dietDateTimeWithTime(dietResultTime?.value || dietMealTime?.value, nextTime);
    if (dietResultTime) dietResultTime.value = nextDateTime;
    if (dietMealTime) dietMealTime.value = nextDateTime;
  }
  const context = editingDietFoodContext;
  closeDietGramSheet();
  if (context === "detail") renderDietDetailPage();
  else renderDietResult();
}

function deleteDietFood(foodId) {
  dietResults.forEach((result) => {
    result.foods = result.foods.filter((food) => food.id !== foodId);
  });
  renderDietResult();
  showToast("已删除该食物");
}

function deleteEditingDietFood() {
  if (!editingDietFoodId) return;
  const foodId = editingDietFoodId;
  const context = editingDietFoodContext;
  closeDietGramSheet();
  if (context === "detail") {
    (dietDetailMealGroups || []).forEach((group) => {
      group.foods = group.foods.filter((food) => food.id !== foodId);
    });
    renderDietDetailPage();
    showToast("已删除该食物");
    return;
  }
  deleteDietFood(foodId);
}

function deleteCurrentDietMealResult() {
  if (dietResultMode !== "detail") return false;
  const current = dietResults[dietResultIndex] || dietResults[0];
  const meal = current?.meal;
  if (meal && dietDetailMealGroups) {
    dietDetailMealGroups = dietDetailMealGroups.filter((group) => group.meal !== meal);
  }
  dietDetailHasRecords = Boolean((dietDetailMealGroups || []).some((group) => group.foods.length));
  renderDietDetailPage();
  openSubPage("dietDetailPage");
  showToast("已删除该餐次记录");
  return true;
}

function confirmDietCheckin() {
  if (deleteCurrentDietMealResult()) return;
  const totals = dietTotals();
  const totalFoods = dietResults.flatMap((result) => result.foods).length;
  const totalGrams = dietResults
    .flatMap((result) => result.foods)
    .reduce((sum, food) => sum + Number(food.grams || 0), 0);
  const time = formatDietTime(dietResultTime?.value || dietMealTime?.value);
  if (dietNoteInput && dietResultNoteInput) dietNoteInput.value = dietResultNoteInput.value.trim();
  if (dietMealTime && dietResultTime?.value) dietMealTime.value = dietResultTime.value;
  const data = scheduleDataFor();
  const dietItem = data.checkins.find((item) => item.type === "diet");
  const nextDietItem = {
    type: "diet",
    title: "饮食打卡",
    desc: `当日摄入 ${Math.round(totals.calories)} kcal，食物克重 ${formatFoodNumber(totalGrams)}g`,
    count: `已记录 ${Math.max(totalFoods, 1)} 次`,
    value: `${Math.round(totals.calories)} kcal`,
    totalCalories: Math.round(totals.calories),
    latestRecordTime: time
  };
  if (dietItem) Object.assign(dietItem, nextDietItem);
  else data.checkins.unshift(nextDietItem);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  dietCheckinSummary = nextDietItem;
  const existingGroups = dietDetailFoodsForRender().map((group) => ({
    ...group,
    images: Array.isArray(group.images) ? [...group.images] : [],
    foods: [...group.foods]
  }));
  dietResults.forEach((result, resultIndex) => {
    const mealName = result.meal || dietSelectedMeal || "加餐";
    const group = existingGroups.find((item) => item.meal === mealName);
    const nextFoods = result.foods.map((food, foodIndex) => prepareDietDetailFood({
      ...food,
      id: food.id || `diet-upload-${Date.now()}-${resultIndex}-${foodIndex}`
    }, existingGroups.length + resultIndex, foodIndex));
    const nextImage = result.image ? [result.image] : [];
    if (group) {
      group.time = `${String(result.time || time).replace(/\s*记录$/, "")} 记录`;
      group.images = [...(group.images || []), ...nextImage];
      group.foods = [...group.foods, ...nextFoods];
    } else {
      existingGroups.push({
        meal: mealName,
        time: `${String(result.time || time).replace(/\s*记录$/, "")} 记录`,
        images: nextImage,
        foods: nextFoods
      });
    }
  });
  dietDetailMealGroups = existingGroups;
  dietDetailHasRecords = true;
  if (dietReturnView === "dietDetail") {
    renderDietDetailPage();
    openSubPage("dietDetailPage");
    showUnifiedCheckinSuccess([
      { label: "本次摄入", value: `${Math.round(totals.calories)}`, unit: "kcal" },
      { label: "食物数量", value: `${Math.max(totalFoods, 1)}`, unit: "项" }
    ]);
    return;
  }
  const nextView = dietReturnView === "home" ? "home" : "plan";
  tabbarLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === nextView));
  switchView(nextView);
  showUnifiedCheckinSuccess([
    { label: "本次摄入", value: `${Math.round(totals.calories)}`, unit: "kcal" },
    { label: "食物数量", value: `${Math.max(totalFoods, 1)}`, unit: "项" }
  ]);
}

function currentDietCheckinItem() {
  return scheduleDataFor().checkins.find((item) => item.type === "diet");
}

function hasDietRecord(item) {
  if (!item) return false;
  return !dietCheckinDisplay(item).empty;
}

function renderDietDetailPage() {
  const item = currentDietCheckinItem();
  const hasRecord = hasDietRecord(item);
  if (dietDetailSummary) {
    dietDetailSummary.innerHTML = hasRecord ? `
      <div>
        <span>今日饮食</span>
        <strong>${escapeAttr(item.value || "已记录")}</strong>
        <p>${escapeAttr(item.desc || "已完成本次饮食打卡，可继续补充餐食记录。")}</p>
      </div>
      <i aria-hidden="true">食</i>
    ` : `
      <div>
        <span>今日饮食</span>
        <strong>暂无记录</strong>
        <p>拍摄餐食图片后，AI 会识别热量与营养成分。</p>
      </div>
      <i aria-hidden="true">食</i>
    `;
  }
  if (dietDetailRecords) {
    dietDetailRecords.innerHTML = hasRecord ? `
      <article class="diet-detail-record">
        <i aria-hidden="true"></i>
        <div>
          <strong>${escapeAttr(item.title || "饮食打卡")}</strong>
          <p>${escapeAttr(item.count || "已记录 1 次")}</p>
          <span>${escapeAttr(item.desc || "营养识别结果已保存")}</span>
        </div>
        <em>${escapeAttr(item.value || "")}</em>
      </article>
    ` : `
      <div class="diet-detail-empty">
        <strong>暂无饮食记录</strong>
        <span>点击去打卡，进入饮食拍摄页。</span>
      </div>
    `;
  }
}

function openDietDetailPage() {
  renderDietDetailRange();
  renderDietDetailPage();
  openSubPage("dietDetailPage");
}

function currentSportCheckinItem() {
  return scheduleDataFor().checkins.find((item) => item.type === "sport");
}

function mutableScheduleDataForSelected() {
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  if (!scheduleTasks[schedulePatientId][scheduleSelectedDate]) {
    scheduleTasks[schedulePatientId][scheduleSelectedDate] = { reminders: [], followups: [], assessments: [], checkins: [] };
  }
  return scheduleTasks[schedulePatientId][scheduleSelectedDate];
}

function sportTypeKeyByName(name) {
  return Object.keys(sportTypes).find((key) => sportTypes[key]?.label === name) || "walk";
}

function sportRateForRecord(record) {
  const recordRate = Number(record?.kcalRate);
  if (Number.isFinite(recordRate) && recordRate > 0) return recordRate;
  const typeKey = record?.type || sportTypeKeyByName(record?.name);
  const typeRate = sportTypes[typeKey]?.kcal;
  if (Number.isFinite(typeRate)) return typeRate;
  const duration = Number(record?.duration || 0);
  const calories = Number(record?.calories || 0);
  return duration > 0 && calories > 0 ? calories / duration : sportTypes.walk.kcal;
}

function sportRecordDateTime(record) {
  if (record?.time) return record.time;
  const timeText = record?.timeText || "08:30";
  return `${scheduleSelectedDate}T${timeText}`;
}

function normalizeSportRecord(record, index = 0) {
  const next = record || {};
  next.id = next.id || `sport-record-${scheduleSelectedDate}-${index}`;
  next.time = sportRecordDateTime(next);
  next.name = next.name || "运动";
  next.type = next.type || sportTypeKeyByName(next.name);
  next.duration = Number(next.duration || 0);
  next.intensity = next.intensity || "medium";
  next.intensityLabel = next.intensityLabel || sportIntensities[next.intensity] || "中强度";
  next.kcalRate = Number(next.kcalRate || 0) || sportRateForRecord(next);
  next.calories = Number(next.calories || Math.round(next.duration * sportRateForRecord(next)));
  return next;
}

function sortSportRecordsNewest(records) {
  records.sort((a, b) => sportRecordSortValue(b) - sportRecordSortValue(a));
  return records;
}

function ensureSportRecordStore() {
  const data = mutableScheduleDataForSelected();
  let item = data.checkins.find((checkin) => checkin.type === "sport");
  if (!item) {
    item = { type: "sport", title: "运动打卡", count: "暂无记录", desc: "", records: [] };
    data.checkins.unshift(item);
  }
  if (!Array.isArray(item.records) || !item.records.length) {
    item.records = defaultSportDetailData().records.map((record) => ({
      id: record.id,
      type: record.type,
      name: record.name,
      duration: record.duration,
      calories: record.calories,
      kcalRate: record.kcalRate,
      intensity: record.intensity || "medium",
      intensityLabel: record.intensityLabel || sportIntensities[record.intensity || "medium"] || "中强度",
      time: `${scheduleSelectedDate}T${record.timeText}`
    }));
  }
  item.records = item.records.map((record, index) => normalizeSportRecord(record, index));
  return { data, item, records: item.records };
}

function syncSportCheckinItem(item) {
  if (!item) return;
  const records = Array.isArray(item.records) ? sortSportRecordsNewest(item.records) : [];
  const totalDuration = records.reduce((sum, record) => sum + Number(record.duration || 0), 0);
  const totalCalories = records.reduce((sum, record) => sum + Number(record.calories || 0), 0);
  const latest = records[0];
  Object.assign(item, {
    type: "sport",
    title: "运动打卡",
    desc: records.length ? `总时长 ${Math.round(totalDuration)}分钟` : "",
    count: records.length ? `已记录 ${records.length} 次` : "暂无记录",
    value: records.length ? `消耗 ${Math.round(totalCalories)} kcal` : "",
    duration: totalDuration,
    totalDuration,
    calories: totalCalories,
    totalCalories,
    latestRecordTime: latest ? formatSportTimeText(latest.time) : "",
    records
  });
}

function defaultSportDetailData() {
  return {
    totalDuration: 108,
    totalCalories: 569,
    records: [
      { id: "sport-default-0", type: "walk", timeText: "08:30", name: "快走", duration: 30, calories: 90, kcalRate: 3, intensity: "medium", intensityLabel: "中强度" },
      { id: "sport-default-1", type: "fitness", timeText: "10:15", name: "力量训练", duration: 20, calories: 140, kcalRate: 7, intensity: "high", intensityLabel: "高强度" },
      { id: "sport-default-2", type: "cycle", timeText: "16:40", name: "骑行", duration: 25, calories: 150, kcalRate: 6, intensity: "medium", intensityLabel: "中强度" },
      { id: "sport-default-3", type: "fitness", timeText: "19:20", name: "瑜伽", duration: 15, calories: 45, kcalRate: 3, intensity: "low", intensityLabel: "低强度" },
      { id: "sport-default-4", type: "run", timeText: "20:30", name: "慢跑", duration: 18, calories: 144, kcalRate: 8, intensity: "high", intensityLabel: "高强度" }
    ]
  };
}

function sportDetailDataForRender() {
  const item = currentSportCheckinItem();
  if (item && Array.isArray(item.records) && !item.records.length) {
    return { totalDuration: 0, totalCalories: 0, records: [] };
  }
  const records = Array.isArray(item?.records) && item.records.length
    ? item.records.map((record, index) => {
        const normalized = normalizeSportRecord({ ...record }, index);
        return {
          ...normalized,
          timeText: checkinTimeText(normalized.time) || "--:--",
          sortTime: new Date(normalized.time).getTime()
        };
      })
    : [];
  if (!records.length) {
    const data = defaultSportDetailData();
    return {
      ...data,
      records: [...data.records].sort((a, b) => sportRecordSortValue(b) - sportRecordSortValue(a))
    };
  }
  records.sort((a, b) => sportRecordSortValue(b) - sportRecordSortValue(a));
  const totalDuration = records.reduce((sum, record) => sum + Number(record.duration || 0), 0);
  const calculatedCalories = records.reduce((sum, record) => sum + Number(record.calories || 0), 0);
  const totalCalories = Number(item?.totalCalories ?? item?.calories ?? calculatedCalories);
  return {
    totalDuration,
    totalCalories: Number.isFinite(totalCalories) ? totalCalories : calculatedCalories,
    records
  };
}

function sportRecordSortValue(record) {
  if (Number.isFinite(record.sortTime)) return record.sortTime;
  const timeValue = new Date(record.time).getTime();
  if (Number.isFinite(timeValue)) return timeValue;
  const matched = String(record.timeText || "").match(/^(\d{1,2}):(\d{2})/);
  return matched ? Number(matched[1]) * 60 + Number(matched[2]) : 0;
}

function renderSportDetailPage() {
  const data = sportDetailDataForRender();
  if (sportDetailSummary) {
    sportDetailSummary.innerHTML = `
      <div class="sport-detail-stats">
        <div class="sport-detail-calorie"><span>累计消耗</span><strong>${Math.round(data.totalCalories)}<em>kcal</em></strong></div>
        <div><span>累计时长</span><strong>${Math.round(data.totalDuration)}<em>分钟</em></strong></div>
      </div>
    `;
  }
  if (sportDetailRecords) {
    sportDetailRecords.innerHTML = data.records.length
      ? data.records.map((record) => `
        <article class="sport-detail-record" data-sport-record-id="${escapeAttr(record.id)}" tabindex="0">
          <i class="sport-icon ${escapeAttr(record.type || sportTypeKeyByName(record.name) || "walk")}" aria-hidden="true"></i>
          <div>
            <strong>${escapeAttr(record.name)}</strong>
            <span>${Math.round(record.duration)}分钟 · ${escapeAttr(record.timeText)}</span>
            <em>${escapeAttr(record.intensityLabel || sportIntensities[record.intensity] || "中强度")}</em>
          </div>
          <p><b>${Math.round(record.calories)}</b> 千卡 <em aria-hidden="true"></em></p>
        </article>
      `).join("")
      : `<div class="sport-detail-empty">今日暂无运动记录</div>`;
  }
}

function openSportDetailPage() {
  renderSportDetailPage();
  openSubPage("sportDetailPage");
}

function closeSportRecordEditor() {
  sportRecordEditor?.classList.remove("active");
  if (!document.querySelector(".sport-checkin-sheet.active, .sport-time-picker.active, .sport-success-dialog.active")) {
    sheetMask.classList.remove("active");
  }
  editingSportRecordId = "";
}

function currentEditingSportRecord() {
  const { records } = ensureSportRecordStore();
  return records.find((record) => record.id === editingSportRecordId);
}

function sportEditorDurationValue() {
  const value = Number(sportRecordDurationInput?.value || 0);
  return Math.min(300, Math.max(1, Number.isFinite(value) ? value : 1));
}

function sportEditorCalories(record) {
  return Math.round(sportEditorDurationValue() * sportRateForRecord(record));
}

function renderSportRecordEditor() {
  const record = currentEditingSportRecord();
  if (!record) return;
  const duration = sportEditorDurationValue();
  const calories = sportEditorCalories(record);
  sportRecordIntensityOptions?.querySelectorAll("[data-record-sport-intensity]").forEach((button) => {
    button.classList.toggle("active", button.dataset.recordSportIntensity === editingSportRecordIntensity);
  });
  if (sportRecordIcon) sportRecordIcon.className = `sport-icon ${record.type || sportTypeKeyByName(record.name) || "walk"}`;
  if (sportRecordName) sportRecordName.textContent = record.name || "运动";
  if (sportRecordMeta) sportRecordMeta.textContent = `${sportIntensities[editingSportRecordIntensity] || "中强度"} · ${Math.round(duration)} 分钟`;
  if (sportRecordCalories) sportRecordCalories.textContent = String(Math.round(calories));
  if (sportRecordTimeText) sportRecordTimeText.textContent = formatSportTimeText(sportRecordTimeInput?.value || record.time);
}

function openSportRecordEditor(recordId) {
  const { records } = ensureSportRecordStore();
  const record = records.find((item) => item.id === recordId);
  if (!record) return;
  editingSportRecordId = record.id;
  editingSportRecordIntensity = record.intensity || "medium";
  if (sportRecordDurationInput) sportRecordDurationInput.value = String(Math.round(record.duration || 1));
  if (sportRecordTimeInput) {
    const date = new Date(record.time);
    sportRecordTimeInput.value = Number.isNaN(date.getTime()) ? localDateTimeValue() : localDateTimeValue(date);
  }
  if (sportRecordNoteInput) sportRecordNoteInput.value = record.note || "";
  renderSportRecordEditor();
  sheetMask.classList.add("active");
  sportRecordEditor?.classList.add("active");
}

function saveSportRecordEdit() {
  const { item, records } = ensureSportRecordStore();
  const record = records.find((entry) => entry.id === editingSportRecordId);
  if (!record) return;
  record.duration = sportEditorDurationValue();
  record.intensity = editingSportRecordIntensity || "medium";
  record.intensityLabel = sportIntensities[record.intensity] || "中强度";
  record.calories = sportEditorCalories(record);
  record.time = sportRecordTimeInput?.value || record.time || localDateTimeValue();
  record.note = sportRecordNoteInput?.value.trim() || "";
  syncSportCheckinItem(item);
  renderSchedule();
  renderSportDetailPage();
  closeSportRecordEditor();
  showToast("运动记录已更新");
}

function deleteSportRecordEdit() {
  const { item } = ensureSportRecordStore();
  item.records = item.records.filter((record) => record.id !== editingSportRecordId);
  syncSportCheckinItem(item);
  renderSchedule();
  renderSportDetailPage();
  closeSportRecordEditor();
  showToast("运动记录已删除");
}

function dateOnlyValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthOnlyValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function shortDateText(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getMonth() + 1}/${pad(date.getDate())}`;
}

function detailWeekRangeText(date) {
  const start = new Date(date);
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.getFullYear()}年${shortDateText(start)} - ${shortDateText(end)}`;
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function dietDetailRangeLabel() {
  const current = dietDetailRangeDate || new Date();
  const pad = (value) => String(value).padStart(2, "0");
  if (dietDetailRangeMode === "day") {
    return isSameDate(current, new Date())
      ? "今日"
      : `${current.getFullYear()}年${pad(current.getMonth() + 1)}月${pad(current.getDate())}日`;
  }
  if (dietDetailRangeMode === "week") return detailWeekRangeText(current);
  if (dietDetailRangeMode === "month") return `${current.getFullYear()}年${pad(current.getMonth() + 1)}月`;
  return `${current.getFullYear()}年`;
}

function renderDietDetailRange() {
  dietDetailRangeTabs?.querySelectorAll("[data-diet-range]").forEach((button) => {
    button.classList.toggle("active", button.dataset.dietRange === dietDetailRangeMode);
  });
  if (dietDetailRangeText) dietDetailRangeText.textContent = dietDetailRangeLabel();
  if (dietDetailDayInput) dietDetailDayInput.value = dateOnlyValue(dietDetailRangeDate);
  if (dietDetailMonthInput) dietDetailMonthInput.value = monthOnlyValue(dietDetailRangeDate);
}

function detailFoodGrams(food) {
  if (food.grams) return Number(food.grams);
  const text = String(food.amount || "");
  const matched = text.match(/(\d+(?:\.\d+)?)\s*(?:g|ml)/i) || text.match(/(\d+(?:\.\d+)?)/);
  return matched ? Number(matched[1]) : 100;
}

function prepareDietDetailFood(food, groupIndex, foodIndex) {
  const grams = detailFoodGrams(food);
  return {
    ...food,
    id: food.id || `detail-${groupIndex}-${foodIndex}`,
    grams,
    amount: food.amount || `${formatFoodNumber(grams)}g`,
    baseCalories: food.baseCalories ?? Number(((Number(food.calories || 0) * 100) / Math.max(grams, 1)).toFixed(2)),
    baseProtein: food.baseProtein ?? 0,
    baseFat: food.baseFat ?? 0,
    baseCarb: food.baseCarb ?? 0
  };
}

function dietDetailTimeOnly(value) {
  const text = String(value || "").trim();
  const matched = text.match(/(\d{1,2}):(\d{2})/);
  if (!matched) return "--:--";
  return `${matched[1].padStart(2, "0")}:${matched[2]}`;
}

function dietDateTimeWithTime(sourceValue, timeValue) {
  const fallback = localDateTimeValue();
  const dateText = String(sourceValue || "").match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || fallback.slice(0, 10);
  const timeText = dietDetailTimeOnly(timeValue);
  return `${dateText}T${timeText === "--:--" ? fallback.slice(11, 16) : timeText}`;
}

function dietDetailImageStyle(image, fallbackClass = "") {
  const preview = typeof image === "string" ? image : image?.preview;
  if (preview?.startsWith("blob:") || preview?.startsWith("data:") || preview?.startsWith("http")) {
    return `style="background-image:url('${escapeAttr(preview)}')"`;
  }
  if (preview?.startsWith("linear-gradient") || preview?.startsWith("radial-gradient") || preview?.startsWith("#")) {
    return `style="background:${escapeAttr(preview)}"`;
  }
  return fallbackClass ? `class="diet-detail-upload-thumb food-thumb ${escapeAttr(fallbackClass)}"` : `class="diet-detail-upload-thumb"`;
}

function renderDietDetailMealMeta(group) {
  const images = Array.isArray(group.images) && group.images.length
    ? group.images
    : [{ preview: "", fallback: group.foods?.[0]?.image || "egg" }];
  const time = dietDetailTimeOnly(group.time || group.foods?.[0]?.recordTime);
  return `
    <div class="diet-detail-meal-meta">
      <div class="diet-detail-upload-thumbs">
        ${images.slice(0, 4).map((image) => {
          const fallback = image?.fallback || group.foods?.[0]?.image || "egg";
          const attr = dietDetailImageStyle(image, fallback);
          return `<span ${attr.includes("class=") ? attr : `class="diet-detail-upload-thumb" ${attr}`}></span>`;
        }).join("")}
      </div>
      <time>${escapeAttr(time)}</time>
    </div>
  `;
}

function renderDietResultMeta(result) {
  const images = result?.image ? [result.image] : Array.isArray(result?.images) ? result.images : [];
  if (!images.length && !result?.time) return "";
  const time = dietDetailTimeOnly(result?.time || dietResultTime?.value || dietMealTime?.value);
  return `
    <div class="diet-detail-meal-meta diet-result-meal-meta">
      ${images.length ? `
        <div class="diet-detail-upload-thumbs">
          ${images.slice(0, 4).map((image) => {
            const fallback = result?.foods?.[0]?.image || "egg";
            const attr = dietDetailImageStyle(image, fallback);
            return `<span ${attr.includes("class=") ? attr : `class="diet-detail-upload-thumb" ${attr}`}></span>`;
          }).join("")}
        </div>
      ` : ""}
      <time>${escapeAttr(time)}</time>
    </div>
  `;
}

function defaultDietDetailMealGroups() {
  return [
    {
      meal: "早餐",
      time: "08:12 记录",
      foods: [
        { name: "鸡蛋", amount: "1个（50g）", calories: 70, image: "egg" },
        { name: "牛奶", amount: "250 ml", calories: 150, image: "milk" },
        { name: "全麦面包", amount: "1片（60g）", calories: 160, image: "bread" },
        { name: "香蕉", amount: "1根（100g）", calories: 90, image: "banana" }
      ]
    },
    {
      meal: "午餐",
      time: "12:36 记录",
      foods: [
        { name: "香煎三文鱼配轻食沙拉", amount: "100g", calories: 155, image: "fish" },
        { name: "水煮西兰花", amount: "100g", calories: 64, image: "green" },
        { name: "糙米饭", amount: "120g", calories: 170, image: "rice" }
      ]
    },
    {
      meal: "晚餐",
      time: "18:42 记录",
      foods: [
        { name: "煎鸡胸肉", amount: "100g", calories: 180, image: "chicken" },
        { name: "番茄豆腐汤", amount: "1碗（260g）", calories: 120, image: "soup" },
        { name: "蔬菜沙拉", amount: "1份（120g）", calories: 80, image: "salad" }
      ]
    },
    {
      meal: "加餐",
      time: "15:40 记录",
      foods: [
        { name: "无糖酸奶", amount: "120g", calories: 90, image: "yogurt" },
        { name: "坚果", amount: "15g", calories: 95, image: "nuts" },
        { name: "苹果", amount: "半个（90g）", calories: 48, image: "apple" }
      ]
    }
  ];
}

function dietDetailFoodsForRender() {
  if (!dietDetailMealGroups) {
    dietDetailMealGroups = defaultDietDetailMealGroups().map((group, groupIndex) => ({
      ...group,
      foods: group.foods.map((food, foodIndex) => prepareDietDetailFood(food, groupIndex, foodIndex))
    }));
  }
  return dietDetailMealGroups;
}

function dietDetailSortTimeValue(value) {
  const text = String(value || "");
  const dateValue = new Date(text.replace(/\s*记录$/, "").replace(" ", "T")).getTime();
  if (Number.isFinite(dateValue)) return dateValue;
  const matched = text.match(/(\d{1,2}):(\d{2})/);
  if (!matched) return 0;
  return Number(matched[1]) * 60 + Number(matched[2]);
}

function dietDetailMealSortValue(group) {
  return dietDetailSortTimeValue(group?.time || group?.foods?.[0]?.recordTime);
}

function sortedDietDetailMealEntries() {
  return dietDetailFoodsForRender()
    .map((group, groupIndex) => ({ group, groupIndex }))
    .sort((a, b) => dietDetailMealSortValue(b.group) - dietDetailMealSortValue(a.group));
}

function openDietMealResult(groupIndex) {
  const group = dietDetailFoodsForRender()[groupIndex];
  if (!group) return;
  dietReturnView = "dietDetail";
  dietResultMode = "detail";
  dietResultIndex = 0;
  dietResults = [{
    meal: group.meal,
    time: String(group.time || "").replace(/\s*记录$/, ""),
    foods: group.foods
  }];
  if (dietResultNoteInput) dietResultNoteInput.value = "今天的分量比平时稍少。";
  renderDietResult();
  openSubPage("dietResultPage");
}

function renderDietDetailPage() {
  const hasRecord = dietDetailHasRecords || Boolean(dietCheckinSummary);
  if (!hasRecord) {
    if (dietDetailSummary) {
      dietDetailSummary.innerHTML = `
        <div class="diet-detail-empty-summary">
          <strong class="diet-detail-empty-total">摄入总量：<b>0</b><em>千卡</em></strong>
          <p>蛋白质：0g，脂肪：0g；碳水化合物：0g</p>
        </div>
      `;
    }
    if (dietDetailRecords) {
      dietDetailRecords.innerHTML = `
        <div class="diet-detail-empty">
          <strong>记录今日饮食，获取饮食建议</strong>
          <span>点击右上角去打卡，完成后这里会展示早餐、午餐、晚餐和加餐记录。</span>
        </div>
      `;
    }
    return;
  }
  const mealGroupEntries = sortedDietDetailMealEntries();
  const foods = mealGroupEntries.flatMap(({ group }) => group.foods);
  const calories = foods.reduce((sum, food) => sum + Number(food.calories || 0), 0);
  const protein = 72;
  const fat = 38;
  const carb = 188;
  if (dietDetailSummary) {
    dietDetailSummary.innerHTML = `
      <div class="diet-detail-ai-label"><span>AI分析</span><em>食物已为您识别并计算</em></div>
      <strong class="diet-detail-calories">${calories}<em>kcal · 今日总热量</em></strong>
      <div class="diet-detail-nutrients">
        <div><i class="nutrient-protein" aria-hidden="true"></i><b>蛋白质</b><strong>${protein}<small>g</small></strong><span>21%</span></div>
        <div><i class="nutrient-fat" aria-hidden="true"></i><b>脂肪</b><strong>${fat}<small>g</small></strong><span>30%</span></div>
        <div><i class="nutrient-carb" aria-hidden="true"></i><b>碳水</b><strong>${carb}<small>g</small></strong><span>49%</span></div>
      </div>
    `;
  }
  if (dietDetailRecords) {
    dietDetailRecords.innerHTML = mealGroupEntries.map(({ group, groupIndex }) => `
      <section class="diet-detail-meal-block">
        <div class="diet-detail-meal-row">
          <span class="diet-detail-meal-title">
            <strong>${escapeAttr(group.meal)}</strong>
            <em>${escapeAttr(group.time)}</em>
          </span>
          <button class="diet-detail-meal-link" type="button" data-detail-meal-index="${groupIndex}" aria-label="查看${escapeAttr(group.meal)}详情">
            <i aria-hidden="true"></i>
          </button>
        </div>
        <section class="diet-detail-food-card">
          <div class="diet-detail-food-list">
            ${group.foods.map((food) => `
              <article class="diet-detail-food-row" data-detail-food="${food.id}" role="button" tabindex="0" aria-label="编辑${escapeAttr(food.name)}">
                <i class="food-thumb ${food.image}" aria-hidden="true"></i>
                <div>
                  <strong>${escapeAttr(food.name)}</strong>
                  <span>${escapeAttr(food.amount || `${formatFoodNumber(food.grams || 100)}g`)}</span>
                </div>
                <em>${Math.round(food.calories)} kcal</em>
                <b aria-hidden="true"></b>
              </article>
            `).join("")}
          </div>
          ${renderDietDetailMealMeta(group)}
        </section>
      </section>
    `).join("");
  }
}

function medicinePatientKey() {
  return schedulePatientId || currentPatient.id || "zhang";
}

function currentMedicineRecords() {
  const key = medicinePatientKey();
  if (!medicineRecordsByPatient[key]) medicineRecordsByPatient[key] = [];
  return medicineRecordsByPatient[key];
}

function sortedMedicineRecords() {
  return [...currentMedicineRecords()].sort((a, b) => new Date(b.time) - new Date(a.time));
}

function medicineRecordById(recordId) {
  return currentMedicineRecords().find((record) => record.id === recordId);
}

function medicineDateParts(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { group: "未知时间", time: "--:--", full: "--" };
  const today = parseDate(todayString());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const dateText = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const group = sameDay(date, today) ? "今天" : sameDay(date, yesterday) ? "昨天" : dateText;
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return {
    group,
    time,
    full: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${time}`
  };
}

function medicineRecordDateKey(record) {
  const date = new Date(record?.time || "");
  return Number.isNaN(date.getTime()) ? "" : formatDate(date);
}

function todayMedicineRecords() {
  const today = todayString();
  return sortedMedicineRecords().filter((record) => medicineRecordDateKey(record) === today);
}

function medicineRecordTypeStats(records) {
  return records.reduce((result, record) => {
    (record.items || []).forEach((item) => {
      if (item.type === "nutrition") result.nutrition += 1;
      else result.medicine += 1;
      result.total += 1;
    });
    return result;
  }, { medicine: 0, nutrition: 0, total: 0 });
}

function medicineItemTypeLabel(type) {
  return type === "nutrition" ? "营养素" : "药品";
}

function medicineItemDose(item) {
  if (item?.dose) return item.dose;
  const name = item?.name || "";
  if (name.includes("二甲双胍")) return "0.5g";
  if (name.includes("阿托伐他汀")) return "20mg";
  if (name.includes("维生素C")) return "500mg";
  if (name.includes("D3")) return "500mg";
  if (name.includes("缬沙坦")) return "80mg";
  if (name.includes("钙")) return "600mg";
  return item?.type === "nutrition" ? "500mg" : "0.5g";
}

function medicineItemUsage(item) {
  if (item?.usage) return item.usage;
  return item?.type === "nutrition" ? "1片 | 1次" : "1粒 | 1次";
}

function medicineRecordGroups(record) {
  const items = record?.items || [];
  return [
    { type: "medicine", label: "药品", items: items.filter((item) => item.type !== "nutrition") },
    { type: "nutrition", label: "营养素", items: items.filter((item) => item.type === "nutrition") }
  ].filter((group) => group.items.length);
}

function medicineThumbStyle(image) {
  if (!image) return "";
  const legacyImages = {
    "linear-gradient(135deg, #f3f7ff 0 28%, #8cc8ff 28% 36%, #ffffff 36% 58%, #2f7bdc 58% 68%, #f6fbff 68% 100%)": medicineMockImages?.[0],
    "linear-gradient(135deg, #e7f8ec 0 36%, #54bd72 36% 52%, #ffffff 52% 66%, #7bd48f 66% 100%)": medicineMockImages?.[1],
    "radial-gradient(circle at 35% 35%, #222 0 12%, transparent 13%), radial-gradient(circle at 65% 35%, #222 0 12%, transparent 13%), radial-gradient(circle at 35% 65%, #222 0 12%, transparent 13%), radial-gradient(circle at 65% 65%, #222 0 12%, transparent 13%), #eef2f7": medicineMockImages?.[2]
  };
  const normalizedImage = legacyImages[image] || image;
  return normalizedImage.startsWith("blob:") || /^https?:/.test(normalizedImage) || normalizedImage.startsWith("data:")
    ? `background-image:url('${normalizedImage}')`
    : `background:${normalizedImage}`;
}

function medicineRecordSummary(record) {
  const items = record?.items || [];
  const medicineNames = items.filter((item) => item.type !== "nutrition").map((item) => item.name);
  const nutritionNames = items.filter((item) => item.type === "nutrition").map((item) => item.name);
  const first = medicineNames[0] || nutritionNames[0] || "用药/补充";
  return {
    count: `${items.length} 项`,
    primary: first,
    medicineText: medicineNames.length ? medicineNames.join("、") : "无",
    nutritionText: nutritionNames.length ? nutritionNames.join("、") : "无"
  };
}

function medicineTodayDetailRecords() {
  const records = todayMedicineRecords();
  return records.length ? records : sortedMedicineRecords();
}
