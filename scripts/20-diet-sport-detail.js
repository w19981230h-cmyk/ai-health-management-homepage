const DIET_IMAGE_LIMIT = 5;

function openDietUploadSheet() {
  activeDietTaskBindingId = "";
  selectedDietTaskBindingId = "";
  pendingDietTaskBinding = false;
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
  `).join("") + (dietUploadImages.length < DIET_IMAGE_LIMIT ? `<button class="diet-image-add" type="button" data-add-diet-image>+</button>` : "");
}

function addDietMockImage() {
  if (dietUploadImages.length >= DIET_IMAGE_LIMIT) {
    showToast(`最多上传 ${DIET_IMAGE_LIMIT} 张图片`);
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
  const incomingFiles = [...files];
  const remainingCount = DIET_IMAGE_LIMIT - dietUploadImages.length;
  incomingFiles.slice(0, remainingCount).forEach((file, index) => {
    dietUploadImages.push({
      id: `file-${Date.now()}-${index}`,
      name: file.name || `meal-${dietUploadImages.length + 1}.jpg`,
      preview: URL.createObjectURL(file)
    });
  });
  if (incomingFiles.length > remainingCount || dietUploadImages.length >= DIET_IMAGE_LIMIT) showToast(`最多上传 ${DIET_IMAGE_LIMIT} 张图片`);
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
  const taskBindingId = selectedDietTaskBindingId;
  const taskBindingPending = pendingDietTaskBinding;
  closeOverlays();
  selectedDietTaskBindingId = taskBindingId;
  pendingDietTaskBinding = taskBindingPending;
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
  dietResultReadonly = false;
  dietResultIndex = 0;
  if (dietResultTime && dietMealTime?.value) dietResultTime.value = dietMealTime.value;
  if (dietResultNoteInput) dietResultNoteInput.value = dietNoteInput?.value?.trim() || "今天的分量比平时稍少。";
  renderDietResult();
  openSubPage("dietResultPage");
}

function renderDietResult() {
  if (!dietFoodList) return;
  const current = dietResults[dietResultIndex] || dietResults[0];
  const doctorReview = current?.doctorReview;
  const lockedByDoctorReview = Boolean(doctorReview);
  const lockedByTaskView = Boolean(dietResultReadonly);
  const lockedResult = lockedByDoctorReview || lockedByTaskView;
  const readonlyResult = dietResultMode === "detail" || lockedByDoctorReview;
  dietResultPage?.classList.toggle("doctor-reviewed", lockedByDoctorReview);
  dietResultPage?.classList.toggle("readonly-result", lockedByTaskView);
  const totals = dietTotals();
  dietTotalCalories.innerHTML = `${Math.round(totals.calories)} <em>kcal · 食物总热量</em>`;
  dietProteinTotal.textContent = `${Math.round(totals.protein)}g`;
  dietFatTotal.textContent = `${Number(totals.fat.toFixed(1))}g`;
  dietCarbTotal.textContent = `${Math.round(totals.carb)}g`;
  dietMealTitle.textContent = current?.meal || "早餐";
  const resultTime = formatDietTime(dietResultTime?.value || dietMealTime?.value);
  dietRecordTimeText.textContent = `${resultTime || current?.time || "12:00"} 记录`;
  dietFoodList.innerHTML = (current?.foods || []).map((food) => `
    <article class="diet-food-card${lockedResult ? " readonly" : ""}" data-food-id="${food.id}"${lockedResult ? "" : ` role="button" tabindex="0"`}>
      <i class="food-thumb ${food.image}" aria-hidden="true"></i>
      <div>
        <strong>${food.name}</strong>
        <p>${food.calories} kcal · ${formatFoodNumber(food.grams || 100)}g</p>
      </div>
      ${lockedResult ? "" : `<menu class="diet-food-actions">
        <button class="diet-food-edit" type="button" data-edit-food="${food.id}" aria-label="编辑${escapeAttr(food.name)}"></button>
      </menu>`}
    </article>
  `).join("") + (current ? renderDietResultMeta(current) : "") || `<div class="diet-empty-result">当前图片的食物已删除</div>`;
  if (dietResultNoteInput) {
    dietResultNoteInput.readOnly = readonlyResult;
    dietResultNoteInput.setAttribute("aria-readonly", String(readonlyResult));
  }
  renderDietDoctorReview(doctorReview);
  if (dietConfirmCheckin) {
    dietConfirmCheckin.hidden = lockedResult;
    dietConfirmCheckin.textContent = dietResultMode === "detail" ? "删除" : "打卡";
    dietConfirmCheckin.classList.toggle("danger", dietResultMode === "detail");
  }
}

function renderDietDoctorReview(review) {
  const card = document.querySelector("#dietDoctorReviewCard");
  if (!card) return;
  const reviews = Array.isArray(review) ? review.filter(Boolean) : review ? [review] : [];
  card.hidden = !reviews.length;
  if (!reviews.length) {
    card.innerHTML = "";
    return;
  }
  card.innerHTML = `
    <h2>综合评价与建议</h2>
    <div class="diet-review-list">
      ${reviews.map((item) => `
        <article class="diet-review-record">
          <div class="diet-review-head">
            <span class="diet-review-title"><i aria-hidden="true">AI</i><strong>${escapeAttr(item.label || "AI建议")}</strong></span>
            ${item.meta ? `<em>${escapeAttr(item.meta)}</em>` : ""}
          </div>
          <p>${escapeAttr(item.content || "")}</p>
          ${item.time ? `<time>${escapeAttr(item.time)}</time>` : ""}
        </article>
      `).join("")}
    </div>
  `;
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

function isEditingDietFoodReadonly() {
  if (editingDietFoodContext === "detail") {
    const group = findDietDetailFoodGroup(editingDietFoodId);
    return Boolean(dietDoctorReviewForMeal(group?.meal));
  }
  const group = findDietResultFoodGroup(editingDietFoodId);
  return Boolean(group?.doctorReview || dietResultReadonly);
}

function openDietGramSheet(foodId) {
  const current = dietResults[dietResultIndex] || dietResults[0];
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
  const readonly = isEditingDietFoodReadonly();
  const resultTime = !isDetailEdit ? formatDietTime(dietResultTime?.value || dietMealTime?.value) : "";
  const currentTime = dietDetailTimeOnly(food.recordTime || currentGroup?.time || resultTime);
  const dateSource = isDetailEdit ? dietMealTime?.value || new Date() : dietResultTime?.value || dietMealTime?.value || new Date();
  const currentDateTime = dietDateTimeWithTime(dateSource, currentTime === "--:--" ? "08:00" : currentTime);
  if (dietFoodNameInput) dietFoodNameInput.value = food.name;
  if (dietGramInput) dietGramInput.value = food.grams || detailFoodGrams(food) || 100;
  if (dietEditMealSelect) dietEditMealSelect.value = currentGroup?.meal || dietSelectedMeal || "早餐";
  if (dietEditTimeInput) dietEditTimeInput.value = currentDateTime;
  if (dietEditTimeText) dietEditTimeText.textContent = formatCheckinTimeDisplay(currentDateTime, "请选择饮食时间");
  const grams = food.grams || detailFoodGrams(food) || 100;
  if (dietEditTitle) dietEditTitle.textContent = "编辑食物";
  if (dietEditFoodThumb) dietEditFoodThumb.className = `food-thumb ${food.image || ""}`;
  if (dietEditFoodMeta) dietEditFoodMeta.textContent = food.name || "";
  if (dietFoodNameInput) dietFoodNameInput.disabled = readonly;
  if (dietGramInput) dietGramInput.disabled = readonly;
  if (dietEditMealSelect) dietEditMealSelect.disabled = readonly;
  if (dietEditTimeTrigger) dietEditTimeTrigger.disabled = readonly;
  if (dietFoodSheetDelete) dietFoodSheetDelete.hidden = readonly;
  if (dietGramConfirm) {
    dietGramConfirm.hidden = readonly;
    dietGramConfirm.disabled = readonly;
  }
  sheetMask.classList.add("active");
  dietGramSheet?.classList.add("active");
  dietGramSheet?.classList.toggle("detail-edit-mode", isDetailEdit);
  dietGramSheet?.classList.toggle("readonly", readonly);
}

function closeDietGramSheet() {
  editingDietFoodId = "";
  editingDietFoodContext = "result";
  dietGramSheet?.classList.remove("active", "detail-edit-mode", "readonly");
  if (!document.querySelector(".diet-upload-sheet.active, .medicine-checkin-sheet.active, .sport-checkin-sheet.active, .weight-checkin-page.active, .waist-checkin-sheet.active, .pressure-checkin-sheet.active, .sugar-checkin-sheet.active, .checkin-success-dialog.active, .sport-success-dialog.active, .pressure-success-dialog.active, .sugar-success-dialog.active, .unified-checkin-success-dialog.active")) {
    sheetMask.classList.remove("active");
  }
}

function confirmDietGramEdit() {
  const food = currentEditingDietFood();
  if (!food) return;
  if (isEditingDietFoodReadonly()) {
    showToast("存在打卡评价的记录仅支持查看");
    return;
  }
  const nextName = dietFoodNameInput?.value?.trim();
  if (!nextName) {
    showToast("请输入食物名称");
    dietFoodNameInput?.focus();
    return;
  }
  food.name = nextName;
  updateFoodByGrams(food, dietGramInput?.value);
  if (editingDietFoodContext === "result") {
    food.amount = `${formatFoodNumber(food.grams || 100)}g`;
  }
  if (editingDietFoodContext === "detail") {
    const currentGroup = findDietDetailFoodGroup(editingDietFoodId);
    const nextMeal = dietEditMealSelect?.value || currentGroup?.meal || "早餐";
    const nextTime = dietDetailTimeOnly(dietEditTimeInput?.value || food.recordTime || currentGroup?.time);
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
  if (isEditingDietFoodReadonly()) {
    showToast("存在打卡评价的记录不能删除");
    return;
  }
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
  if (dietResultReadonly) {
    showToast("任务查看记录仅支持查看");
    return true;
  }
  if (current?.doctorReview) {
    showToast("医生已评价的记录仅支持查看");
    return true;
  }
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

function currentDietBindingTasks() {
  const data = scheduleDataFor();
  const tasks = [];
  (data.followups || []).forEach((task, index) => {
    const isDietTask = scheduleTaskCheckinType(task.type) === "diet"
      || String(task.type || "").includes("饮食")
      || String(task.title || "").includes("饮食");
    if (!isDietTask) return;
    tasks.push({
      id: `followup-${index}`,
      plan: task.plan || "健康管理方案",
      title: task.title || task.type || "饮食打卡任务",
      desc: task.range || task.status || "按任务要求完成饮食打卡",
      source: task
    });
  });
  (data.checkins || []).forEach((item, index) => {
    if (item.type !== "diet") return;
    tasks.push({
      id: `checkin-${index}`,
      plan: item.plan || "今日健康日程",
      title: item.title || "饮食打卡",
      desc: item.desc || "记录今日饮食，完成健康日程打卡",
      source: item
    });
  });
  return tasks;
}

function startDietTaskCheckin(taskId) {
  activeDietTaskBindingId = taskId || "";
  openDietCameraPage(true);
  selectedDietTaskBindingId = activeDietTaskBindingId;
  pendingDietTaskBinding = Boolean(activeDietTaskBindingId);
}

function openBoundDietTaskRecord(taskId) {
  const task = currentDietBindingTasks().find((item) => item.id === taskId);
  const record = task?.source?.boundRecord;
  if (!record) {
    openDietDetailPage();
    return;
  }
  const groups = dietDetailFoodsForRender();
  const index = groups.findIndex((group) => (
    (!record.meal || group.meal === record.meal)
    && (!record.time || String(group.time || "").includes(record.time))
  ));
  if (index >= 0) {
    openDietMealResult(index, true);
    return;
  }
  openDietDetailPage();
}

function openDietTaskBindSheet() {
  const tasks = currentDietBindingTasks();
  if (!tasks.length) return false;
  selectedDietTaskBindingId = selectedDietTaskBindingId || tasks[0].id;
  if (dietTaskBindSummary) {
    dietTaskBindSummary.textContent = `存在${tasks.length}条可关联任务，可选择绑定或仅保存为普通记录`;
  }
  if (dietTaskBindList) {
    dietTaskBindList.innerHTML = [
      ...tasks.map((task) => `
        <label class="diet-task-bind-option">
          <input type="radio" name="dietTaskBinding" value="${escapeAttr(task.id)}" ${selectedDietTaskBindingId === task.id ? "checked" : ""}>
          <span aria-hidden="true"></span>
          <b>${escapeAttr(task.title)}</b>
          <em>${escapeAttr(task.plan || "打卡任务")}</em>
        </label>
      `),
      `<label class="diet-task-bind-option muted">
        <input type="radio" name="dietTaskBinding" value="none" ${selectedDietTaskBindingId === "none" ? "checked" : ""}>
        <span aria-hidden="true"></span>
        <b>暂不绑定</b>
        <em>不绑定任务，直接完成打卡</em>
      </label>`
    ].join("");
  }
  pendingDietTaskBinding = true;
  sheetMask.classList.add("active");
  dietTaskBindSheet?.classList.add("active");
  return true;
}

function closeDietTaskBindSheet() {
  pendingDietTaskBinding = false;
  activeDietTaskBindingId = "";
  dietTaskBindSheet?.classList.remove("active");
  if (!document.querySelector(".diet-upload-sheet.active, .diet-gram-sheet.active")) {
    sheetMask.classList.remove("active");
  }
}

function applyDietTaskBinding(nextDietItem) {
  const bindingId = activeDietTaskBindingId || selectedDietTaskBindingId;
  if (!bindingId || bindingId === "none") return;
  const task = currentDietBindingTasks().find((item) => item.id === bindingId);
  if (!task?.source) return;
  task.source.boundRecord = {
    type: "diet",
    calories: nextDietItem.totalCalories,
    time: nextDietItem.latestRecordTime,
    value: nextDietItem.value,
    meal: dietResults[0]?.meal || dietSelectedMeal || ""
  };
  task.source.status = "已完成";
  task.source.action = "查看";
}

function confirmDietTaskBinding() {
  const checked = dietTaskBindList?.querySelector("input[name='dietTaskBinding']:checked");
  selectedDietTaskBindingId = checked?.value || "none";
  activeDietTaskBindingId = "";
  pendingDietTaskBinding = false;
  dietTaskBindSheet?.classList.remove("active");
  sheetMask.classList.remove("active");
  submitDietCheckin();
}

function confirmDietCheckin() {
  if (deleteCurrentDietMealResult()) return;
  if (activeDietTaskBindingId) {
    selectedDietTaskBindingId = activeDietTaskBindingId;
    pendingDietTaskBinding = true;
  }
  if (!pendingDietTaskBinding && openDietTaskBindSheet()) return;
  submitDietCheckin();
}

function submitDietCheckin() {
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
  applyDietTaskBinding(nextDietItem);
  activeDietTaskBindingId = "";
  pendingDietTaskBinding = false;
  selectedDietTaskBindingId = "";
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  dietCheckinSummary = nextDietItem;
  const existingGroups = dietDetailFoodsForRender().map((group) => ({
    ...group,
    images: Array.isArray(group.images) ? [...group.images] : [],
    foods: [...group.foods]
  }));
  dietResults.forEach((result, resultIndex) => {
    const mealName = result.meal || dietSelectedMeal || "早餐";
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
  if (Array.isArray(next.review)) {
    next.review = defaultSportReviewForRecord(next) || next.review[0];
  }
  if (!next.review) next.review = defaultSportReviewForRecord(next);
  return next;
}

function defaultSportReviews() {
  return [
    {
      label: "AI建议",
      meta: "高血压随访团队-张医生已修改并审核",
      content: "本次慢跑强度偏高，建议运动前后做好热身和拉伸；如果出现胸闷、头晕或明显不适，请降低强度并及时休息。"
    },
    {
      label: "AI建议",
      meta: "AI生成，仅供参考",
      content: "本次运动消耗较高，整体完成度较好。建议下次保持中等强度，运动后补充水分，并根据身体反馈调整时长。"
    }
  ];
}

function defaultSportReview() {
  return defaultSportReviews()[0];
}

function defaultSportReviewForRecord(record) {
  const reviews = defaultSportReviews();
  if (record?.type === "run" || record?.name === "慢跑") return reviews[0];
  if (record?.name === "瑜伽") return reviews[1];
  return null;
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
      { id: "sport-default-3", type: "fitness", timeText: "19:20", name: "瑜伽", duration: 15, calories: 45, kcalRate: 3, intensity: "low", intensityLabel: "低强度", review: defaultSportReviews()[1] },
      { id: "sport-default-4", type: "run", timeText: "20:30", name: "慢跑", duration: 18, calories: 144, kcalRate: 8, intensity: "high", intensityLabel: "高强度", review: defaultSportReview() }
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

function sportReviewEntries(review) {
  if (Array.isArray(review)) return review.filter(Boolean);
  return review ? [review] : [];
}

function renderSportRecordReview(record) {
  const review = sportReviewEntries(record?.review)[0];
  if (!review) return "";
  const expanded = expandedSportReviewIds.has(record.id);
  if (!expanded) {
    return `
      <button class="sport-record-review-toggle" type="button" data-sport-review-toggle="${escapeAttr(record.id)}">
        <span>您有一条新评价</span>
        <em>展开</em>
      </button>
    `;
  }
  return `
    <section class="sport-record-review-panel">
      <h3>综合评价与建议</h3>
      <div class="sport-review-list">
        <article class="sport-review-record">
          <div class="sport-review-head">
            <span class="sport-review-title"><i aria-hidden="true">AI</i><strong>${escapeAttr(review.label || "AI建议")}</strong></span>
            ${review.meta ? `<em>${escapeAttr(review.meta)}</em>` : ""}
          </div>
          <p>${escapeAttr(review.content || "")}</p>
          ${review.time ? `<time>${escapeAttr(review.time)}</time>` : ""}
        </article>
      </div>
      <button type="button" data-sport-review-toggle="${escapeAttr(record.id)}">收起</button>
    </section>
  `;
}

function toggleSportRecordReview(recordId) {
  if (!recordId) return;
  if (expandedSportReviewIds.has(recordId)) expandedSportReviewIds.delete(recordId);
  else expandedSportReviewIds.add(recordId);
  renderSportDetailPage();
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
        <article class="sport-detail-record${record.review ? " reviewed" : ""}" data-sport-record-id="${escapeAttr(record.id)}" tabindex="0">
          <div class="sport-detail-record-main">
            <i class="sport-icon ${escapeAttr(record.type || sportTypeKeyByName(record.name) || "walk")}" aria-hidden="true"></i>
            <div>
              <strong>${escapeAttr(record.name)}</strong>
              <span>${Math.round(record.duration)}分钟 · ${escapeAttr(record.timeText)}</span>
              <em>${escapeAttr(record.intensityLabel || sportIntensities[record.intensity] || "中强度")}</em>
            </div>
            <p><b>${Math.round(record.calories)}</b> 千卡 <em aria-hidden="true"></em></p>
          </div>
          ${renderSportRecordReview(record)}
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
  const readonly = Boolean(record.review);
  const duration = sportEditorDurationValue();
  const calories = sportEditorCalories(record);
  sportRecordIntensityOptions?.querySelectorAll("[data-record-sport-intensity]").forEach((button) => {
    button.classList.toggle("active", button.dataset.recordSportIntensity === editingSportRecordIntensity);
    button.disabled = readonly;
  });
  if (sportRecordIcon) sportRecordIcon.className = `sport-icon ${record.type || sportTypeKeyByName(record.name) || "walk"}`;
  if (sportRecordName) sportRecordName.textContent = record.name || "运动";
  if (sportRecordMeta) sportRecordMeta.textContent = `${sportIntensities[editingSportRecordIntensity] || "中强度"} · ${Math.round(duration)} 分钟`;
  if (sportRecordCalories) sportRecordCalories.textContent = String(Math.round(calories));
  if (sportRecordTimeText) sportRecordTimeText.textContent = formatSportTimeText(sportRecordTimeInput?.value || record.time);
  if (sportRecordDurationInput) sportRecordDurationInput.disabled = readonly;
  if (sportRecordTimeTrigger) sportRecordTimeTrigger.disabled = readonly;
  if (sportRecordNoteInput) sportRecordNoteInput.disabled = readonly;
  if (sportRecordDelete) sportRecordDelete.hidden = readonly;
  if (sportRecordSave) {
    sportRecordSave.hidden = readonly;
    sportRecordSave.disabled = readonly;
  }
  sportRecordEditor?.classList.toggle("readonly", readonly);
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
  if (record.review) {
    showToast("有评价的记录仅支持查看");
    return;
  }
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
  const record = item.records.find((entry) => entry.id === editingSportRecordId);
  if (record?.review) {
    showToast("有评价的记录不能删除");
    return;
  }
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
      meal: "早加餐",
      time: "10:15 记录",
      foods: [
        { name: "原味坚果", amount: "10g", calories: 62, image: "nuts" },
        { name: "蓝莓", amount: "80g", calories: 46, image: "green" }
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
      meal: "午加餐",
      time: "15:40 记录",
      foods: [
        { name: "无糖酸奶", amount: "120g", calories: 90, image: "yogurt" },
        { name: "苹果", amount: "半个（90g）", calories: 48, image: "apple" }
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
      meal: "晚加餐",
      time: "20:30 记录",
      foods: [
        { name: "温牛奶", amount: "200 ml", calories: 120, image: "milk" },
        { name: "苏打饼干", amount: "2片（20g）", calories: 86, image: "bread" }
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

function dietDetailMealOrderValue(meal) {
  const mealOrder = ["早餐", "早加餐", "午餐", "午加餐", "晚餐", "晚加餐"];
  const index = mealOrder.indexOf(String(meal || ""));
  return index === -1 ? mealOrder.length : index;
}

function sortedDietDetailMealEntries() {
  return dietDetailFoodsForRender()
    .map((group, groupIndex) => ({ group, groupIndex }))
    .sort((a, b) => {
      const mealDiff = dietDetailMealOrderValue(a.group?.meal) - dietDetailMealOrderValue(b.group?.meal);
      if (mealDiff !== 0) return mealDiff;
      return dietDetailMealSortValue(a.group) - dietDetailMealSortValue(b.group);
    });
}

function openDietMealResult(groupIndex, readonly = false) {
  const group = dietDetailFoodsForRender()[groupIndex];
  if (!group) return;
  dietReturnView = "dietDetail";
  dietResultMode = "detail";
  dietResultReadonly = Boolean(readonly);
  dietResultIndex = 0;
  dietResults = [{
    meal: group.meal,
    time: String(group.time || "").replace(/\s*记录$/, ""),
    foods: group.foods,
    doctorReview: dietDoctorReviewForMeal(group.meal)
  }];
  if (dietResultNoteInput) dietResultNoteInput.value = "今天的分量比平时稍少。";
  renderDietResult();
  openSubPage("dietResultPage");
}

function dietDoctorReviewForMeal(meal) {
  const mealName = String(meal || "");
  if (mealName === "午餐") {
    return [
      {
        label: "AI建议",
        meta: "高血压随访团队-张医生已修改并审核",
        content: "午餐整体蛋白质和碳水搭配较均衡，建议继续保持蔬菜摄入；如果下午活动量不高，主食分量可以略微控制，避免总热量偏高。"
      },
      {
        label: "AI建议",
        meta: "AI生成，仅供参考",
        content: "本次午餐热量适中，蛋白质来源较清晰。建议继续搭配蔬菜和适量主食，减少高油烹饪方式。"
      }
    ];
  }
  if (mealName !== "早餐") return null;
  return [
    {
      label: "AI建议",
      meta: "高血压随访团队-张医生已修改并审核",
      content: "早餐执行较好，蛋白质来源清晰，建议继续保持鸡蛋、牛奶和全麦主食的组合；如上午活动量增加，可补充少量坚果或低糖水果。"
    },
    {
      label: "AI建议",
      meta: "AI生成，仅供参考",
      content: "本次早餐碳水和蛋白质搭配较均衡，整体热量适中。建议保留全麦面包和牛奶组合，若血糖波动明显，可优先减少水果份量。"
    }
  ];
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
          <span>点击右上角去打卡，完成后这里会展示早餐、早加餐、午餐、午加餐、晚餐和晚加餐记录。</span>
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

const WATER_DEFAULT_GOAL = 1600;
const WATER_GOAL_OPTIONS = Array.from({ length: 21 }, (_, index) => 800 + index * 100);
const waterGoalByPatient = {};
let selectedWaterType = "白水";
let pendingWaterGoal = WATER_DEFAULT_GOAL;
let waterGoalScrollTimer = 0;
let activeWaterRecordId = "";

const WATER_TYPE_OPTIONS = [
  { value: "白水", icon: "水" },
  { value: "淡茶", icon: "茶" },
  { value: "无糖饮品", icon: "0" },
  { value: "含糖饮料", icon: "糖" },
  { value: "咖啡", icon: "咖" },
  { value: "奶类", icon: "奶" },
  { value: "汤类", icon: "汤" },
  { value: "其他", icon: "..." }
];

function currentWaterItem() {
  return scheduleDataFor().checkins.find((item) => item.type === "water");
}

function mutableWaterItem() {
  const data = mutableScheduleDataForSelected();
  let item = data.checkins.find((checkin) => checkin.type === "water");
  if (!item) {
    item = defaultCheckinItem("water");
    item.records = [];
    data.checkins.push(item);
  }
  if (!Array.isArray(item.records)) item.records = [];
  return item;
}

function waterGoal() {
  return Number(waterGoalByPatient[schedulePatientId] || WATER_DEFAULT_GOAL);
}

function normalizedWaterGoal(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return WATER_DEFAULT_GOAL;
  return Math.max(800, Math.min(2800, Math.round(numeric / 100) * 100));
}

function waterRecords() {
  return (currentWaterItem()?.records || [])
    .slice()
    .sort((a, b) => allCheckinTimeValue(b.time) - allCheckinTimeValue(a.time));
}

function waterTotal(records = waterRecords()) {
  return records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
}

function defaultWaterReview(record) {
  const amount = Math.round(Number(record?.amount || 0));
  const type = record?.type || "白水";
  return {
    label: "AI建议",
    meta: "AI生成，仅供参考",
    content: `本次饮水记录为${type} ${amount || 0}ml，建议全天分次饮水，避免一次性大量饮水；如正在控制血压或肾功能相关指标，请结合医生建议调整饮水目标。`,
    time: "2021/01/10 17:20"
  };
}

function findMutableWaterRecord(recordId) {
  const item = mutableWaterItem();
  const index = item.records.findIndex((record) => record.id === recordId);
  if (index < 0) return null;
  return { item, record: item.records[index], index };
}

function updateWaterItemSummary(item) {
  const records = Array.isArray(item.records) ? item.records : [];
  const total = waterTotal(records);
  const latest = records.slice().sort((a, b) => allCheckinTimeValue(b.time) - allCheckinTimeValue(a.time))[0];
  Object.assign(item, {
    type: "water",
    title: "饮水打卡",
    desc: `今日饮水 ${Math.round(total)} ml`,
    count: `已记录 ${records.length} 次`,
    value: `${Math.round(total)} ml`,
    totalWater: Math.round(total),
    latestRecordTime: latest ? checkinTimeText(latest.time) : ""
  });
}

function renderWaterTypeOptions() {
  const isOther = selectedWaterType === "其他";
  const typedOther = waterOtherTypeInput?.value?.trim() || "";
  if (waterTypeValue) waterTypeValue.value = isOther ? typedOther : selectedWaterType;
  if (waterOtherTypeInput) {
    waterOtherTypeInput.hidden = !isOther;
    waterOtherTypeInput.disabled = !isOther;
  }
  waterTypeGrid?.querySelectorAll("[data-water-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.waterType === selectedWaterType);
  });
}

function openWaterCheckinSheet() {
  closeOverlays();
  if (waterAmountInput) waterAmountInput.value = "400";
  selectedWaterType = "白水";
  if (waterOtherTypeInput) waterOtherTypeInput.value = "";
  renderWaterTypeOptions();
  if (waterTimeInput) waterTimeInput.value = localDateTimeValue(new Date());
  if (waterNoteInput) waterNoteInput.value = "";
  sheetMask.classList.add("active");
  waterCheckinSheet?.classList.add("active");
}

function submitWaterCheckin() {
  const amount = Math.round(Number(waterAmountInput?.value || 0));
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("请输入饮水量");
    waterAmountInput?.focus();
    return;
  }
  const time = waterTimeInput?.value || localDateTimeValue(new Date());
  const resolvedWaterType = selectedWaterType === "其他"
    ? waterOtherTypeInput?.value?.trim()
    : selectedWaterType;
  if (!resolvedWaterType) {
    showToast("请输入其他饮水类型");
    waterOtherTypeInput?.focus();
    return;
  }
  const item = mutableWaterItem();
  item.records.push({
    id: `water-${Date.now()}`,
    type: resolvedWaterType || waterTypeValue?.value || "白水",
    amount,
    time,
    note: waterNoteInput?.value?.trim() || "",
    review: defaultWaterReview({ type: resolvedWaterType || waterTypeValue?.value || "白水", amount })
  });
  updateWaterItemSummary(item);
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = mutableScheduleDataForSelected();
  closeOverlays();
  renderSchedule();
  if (document.querySelector("#waterDetailPage")?.classList.contains("active")) renderWaterDetailPage();
  showUnifiedCheckinSuccess([
    { label: "今日饮水", value: `${Math.round(item.totalWater || amount)}`, unit: "ml" }
  ]);
}

function waterReviewEntries(review) {
  if (Array.isArray(review)) return review.filter(Boolean);
  return review ? [review] : [];
}

function renderWaterRecordReview(record, fallbackReview) {
  const review = waterReviewEntries(record?.review)[0] || fallbackReview;
  if (!review) return "";
  const expanded = expandedWaterReviewIds.has(record.id);
  if (!expanded) {
    return `
      <button class="sport-record-review-toggle water-record-review-toggle" type="button" data-water-review-toggle="${escapeAttr(record.id)}">
        <span>您有一条新评价</span>
        <em>展开</em>
      </button>
    `;
  }
  return `
    <section class="sport-record-review-panel water-record-review-panel">
      <h3>饮水评价与建议</h3>
      <div class="sport-review-list">
        <article class="sport-review-record">
          <div class="sport-review-head">
            <span class="sport-review-title"><i aria-hidden="true">AI</i><strong>${escapeAttr(review.label || "AI建议")}</strong></span>
            ${review.meta ? `<em>${escapeAttr(review.meta)}</em>` : ""}
          </div>
          <p>${escapeAttr(review.content || "")}</p>
          ${review.time ? `<time>${escapeAttr(review.time)}</time>` : ""}
        </article>
      </div>
      <button type="button" data-water-review-toggle="${escapeAttr(record.id)}">收起</button>
    </section>
  `;
}

function toggleWaterRecordReview(recordId) {
  if (!recordId) return;
  if (expandedWaterReviewIds.has(recordId)) expandedWaterReviewIds.delete(recordId);
  else expandedWaterReviewIds.add(recordId);
  renderWaterDetailPage();
}

function renderWaterRecordDetailReview(record) {
  const review = waterReviewEntries(record?.review)[0] || defaultWaterReview(record);
  if (!review) return "";
  return `
    <section class="sport-record-review-panel water-record-detail-review">
      <h3>饮水评价与建议</h3>
      <div class="sport-review-list">
        <article class="sport-review-record">
          <div class="sport-review-head">
            <span class="sport-review-title"><i aria-hidden="true">AI</i><strong>${escapeAttr(review.label || "AI建议")}</strong></span>
            ${review.meta ? `<em>${escapeAttr(review.meta)}</em>` : ""}
          </div>
          <p>${escapeAttr(review.content || "")}</p>
          ${review.time ? `<time>${escapeAttr(review.time)}</time>` : ""}
        </article>
      </div>
    </section>
  `;
}

function waterRecordHasReview(record) {
  return waterReviewEntries(record?.review).length > 0;
}

function renderWaterRecordReadonlyDetail(record) {
  return `
    <section class="water-record-readonly-card">
      <div class="water-readonly-head">
        <span>饮水量</span>
        <strong>${Math.round(Number(record.amount || 0))}<em>ml</em></strong>
      </div>
      <div class="water-readonly-grid">
        <div><span>饮水类型</span><strong>${escapeAttr(record.type || "白水")}</strong></div>
        <div><span>记录时间</span><strong>${escapeAttr(checkinTimeText(record.time) || "--:--")}</strong></div>
      </div>
      <div class="water-readonly-note">
        <span>备注</span>
        <p>${escapeAttr(record.note || "暂无备注")}</p>
      </div>
    </section>
    ${renderWaterRecordDetailReview(record)}
  `;
}

function renderWaterDetailPage() {
  const records = waterRecords();
  const total = waterTotal(records);
  const goal = waterGoal();
  const remain = Math.max(goal - total, 0);
  if (waterDetailOverview) {
    waterDetailOverview.innerHTML = `
      <article>
        <span>当日饮水总量</span>
        <strong>${Math.round(total)}<em>ml</em></strong>
      </article>
      <article>
        <span>当日饮水总次数</span>
        <strong>${records.length}<em>次</em></strong>
      </article>
    `;
  }
  if (waterGoalValue) waterGoalValue.innerHTML = `${Math.round(goal)}<em>ml</em>`;
  if (waterRemainValue) waterRemainValue.textContent = `剩余 ${Math.round(remain)} ml 达成今日目标`;
  if (waterDetailRecords) {
    waterDetailRecords.innerHTML = records.length ? records.map((record) => {
      return `
      <article class="water-record-row" data-water-record="${escapeAttr(record.id)}" role="button" tabindex="0">
        <i aria-hidden="true">水</i>
        <div>
          <strong>${escapeAttr(record.type || "白水")}</strong>
          <span>${Math.round(Number(record.amount || 0))} ml · ${escapeAttr(checkinTimeText(record.time) || "--:--")}</span>
          ${record.note ? `<p>${escapeAttr(record.note)}</p>` : ""}
        </div>
        <b aria-hidden="true"></b>
      </article>
    `;
    }).join("") : `
      <div class="diet-detail-empty">
        <strong>暂无饮水记录</strong>
        <span>点击添加饮水，记录今日饮水量。</span>
      </div>
    `;
  }
}

function openWaterRecordDetail(recordId) {
  const record = waterRecords().find((item) => item.id === recordId);
  if (!record || !waterRecordDetailBody) return;
  activeWaterRecordId = recordId;
  waterRecordDetailPage?.classList.add("review-locked");
  waterRecordDetailBody.innerHTML = renderWaterRecordReadonlyDetail(record);
  openSubPage("waterRecordDetailPage");
  return;
  const isKnownType = WATER_TYPE_OPTIONS.some((item) => item.value === record.type);
  const selectedType = isKnownType ? record.type : "其他";
  const otherValue = selectedType === "其他" ? record.type || "" : "";
  waterRecordDetailBody.innerHTML = `
    <section class="water-form-card water-record-edit-card">
      <label>
        <span>饮水量 <b>*</b></span>
        <div class="water-amount-control">
          <button type="button" data-water-detail-step="-50" aria-label="减少饮水量">−</button>
          <input id="waterRecordAmountInput" type="number" inputmode="numeric" min="1" max="5000" step="10" value="${Math.round(Number(record.amount || 0))}">
          <em>ml</em>
          <button type="button" data-water-detail-step="50" aria-label="增加饮水量">+</button>
        </div>
      </label>
      <label>
        <span>饮水类型 <b>*</b></span>
        <select id="waterRecordTypeInput">
          ${WATER_TYPE_OPTIONS.map((item) => `<option value="${escapeAttr(item.value)}"${item.value === selectedType ? " selected" : ""}>${escapeAttr(item.value)}</option>`).join("")}
        </select>
        <input class="water-other-type-input" id="waterRecordOtherTypeInput" type="text" maxlength="12" placeholder="请输入其他饮水类型" value="${escapeAttr(otherValue)}"${selectedType === "其他" ? "" : " hidden"}>
      </label>
    </section>
    <section class="water-form-card water-record-edit-card">
      <label>
        <span>记录时间 <b>*</b></span>
        <input id="waterRecordTimeInput" type="datetime-local" value="${escapeAttr(record.time || localDateTimeValue(new Date()))}">
      </label>
      <label>
        <span>备注</span>
        <textarea id="waterRecordNoteInput" maxlength="100" placeholder="请输入备注">${escapeAttr(record.note || "")}</textarea>
      </label>
    </section>
    ${renderWaterRecordDetailReview(record)}
  `;
  openSubPage("waterRecordDetailPage");
}

function updateWaterRecordOtherInput() {
  const typeInput = document.querySelector("#waterRecordTypeInput");
  const otherInput = document.querySelector("#waterRecordOtherTypeInput");
  if (!typeInput || !otherInput) return;
  const isOther = typeInput.value === "其他";
  otherInput.hidden = !isOther;
  otherInput.disabled = !isOther;
}

function returnToWaterDetailPage() {
  if (pageStack[pageStack.length - 1] === "waterDetailPage") pageStack.pop();
  document.querySelectorAll(".sub-page").forEach((page) => page.classList.remove("active"));
  document.querySelector("#waterDetailPage")?.classList.add("active");
  waterRecordDetailPage?.classList.remove("review-locked");
  document.body.classList.add("detail-page-open");
  closeOverlays();
}

function saveWaterRecordDetail() {
  const target = findMutableWaterRecord(activeWaterRecordId);
  if (!target) return;
  if (waterRecordHasReview(target.record)) {
    showToast("存在评价的记录仅支持查看");
    return;
  }
  const amountInput = document.querySelector("#waterRecordAmountInput");
  const typeInput = document.querySelector("#waterRecordTypeInput");
  const otherInput = document.querySelector("#waterRecordOtherTypeInput");
  const timeInput = document.querySelector("#waterRecordTimeInput");
  const noteInput = document.querySelector("#waterRecordNoteInput");
  const amount = Math.round(Number(amountInput?.value || 0));
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("请输入饮水量");
    amountInput?.focus();
    return;
  }
  const resolvedType = typeInput?.value === "其他" ? otherInput?.value?.trim() : typeInput?.value;
  if (!resolvedType) {
    showToast("请输入其他饮水类型");
    otherInput?.focus();
    return;
  }
  Object.assign(target.record, {
    amount,
    type: resolvedType,
    time: timeInput?.value || localDateTimeValue(new Date()),
    note: noteInput?.value?.trim() || ""
  });
  updateWaterItemSummary(target.item);
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = mutableScheduleDataForSelected();
  renderSchedule();
  renderWaterDetailPage();
  returnToWaterDetailPage();
  showToast("饮水记录已保存");
}

function deleteWaterRecordDetail() {
  const target = findMutableWaterRecord(activeWaterRecordId);
  if (!target) return;
  if (waterRecordHasReview(target.record)) {
    showToast("存在评价的记录不能删除");
    return;
  }
  target.item.records.splice(target.index, 1);
  updateWaterItemSummary(target.item);
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = mutableScheduleDataForSelected();
  activeWaterRecordId = "";
  renderSchedule();
  renderWaterDetailPage();
  returnToWaterDetailPage();
  showToast("饮水记录已删除");
}

function openWaterDetailPage() {
  renderWaterDetailPage();
  openSubPage("waterDetailPage");
}

function renderWaterGoalPicker(selected = waterGoal()) {
  if (!waterGoalPickerList) return;
  const current = normalizedWaterGoal(selected);
  waterGoalPickerList.innerHTML = WATER_GOAL_OPTIONS.map((value) => `
    <button class="${value === current ? "active" : ""}" type="button" data-water-goal="${value}">
      <strong>${value}</strong><span>ml</span>
    </button>
  `).join("");
}

function selectWaterGoal(value) {
  pendingWaterGoal = normalizedWaterGoal(value);
  waterGoalPickerList?.querySelectorAll("[data-water-goal]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.waterGoal) === pendingWaterGoal);
  });
}

function syncWaterGoalFromScroll() {
  if (!waterGoalPickerList) return;
  const listRect = waterGoalPickerList.getBoundingClientRect();
  const centerY = listRect.top + listRect.height / 2;
  let nearestButton = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  waterGoalPickerList.querySelectorAll("[data-water-goal]").forEach((button) => {
    const rect = button.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - centerY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestButton = button;
    }
  });
  if (nearestButton) selectWaterGoal(nearestButton.dataset.waterGoal);
}

function closeWaterGoalPicker() {
  waterGoalPickerSheet?.classList.remove("active");
  if (!document.querySelector(".water-checkin-sheet.active")) {
    sheetMask?.classList.remove("active");
  }
}

function openWaterGoalPicker() {
  pendingWaterGoal = normalizedWaterGoal(waterGoal());
  renderWaterGoalPicker(pendingWaterGoal);
  sheetMask?.classList.add("active");
  waterGoalPickerSheet?.classList.add("active");
  window.setTimeout(() => {
    const activeButton = waterGoalPickerList?.querySelector(".active");
    activeButton?.scrollIntoView({ block: "center" });
  }, 30);
}

function confirmWaterGoalPicker() {
  waterGoalByPatient[schedulePatientId] = pendingWaterGoal;
  closeWaterGoalPicker();
  renderWaterDetailPage();
  showToast("饮水目标已更新");
}

function setWaterGoal() {
  openWaterGoalPicker();
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
