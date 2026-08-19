(() => {
  const PROJECT_ID = "ai-health-management";
  const ACTOR = "在线访客";
  const API_PATH = "/api/ui-notes";
  const LOCAL_STORE_KEY = `ui-notes:${PROJECT_ID}`;
  const TOOL_HIDDEN_KEY = `ui-notes-tool-hidden:${PROJECT_ID}`;
  const $ = (selector) => document.querySelector(selector);
  const toolbar = $("#uiNoteToolbar");
  const addButton = $("#uiNoteAdd");
  const toggleButton = $("#uiNoteToggle");
  const collapseButton = $("#uiNoteCollapse");
  const launcherButton = $("#uiNoteLauncher");
  const countBadge = $("#uiNoteCount");
  const layer = $("#uiNoteLayer");
  const drawerMask = $("#uiNoteDrawerMask");
  const drawer = $("#uiNoteDrawer");
  const drawerTitle = $("#uiNoteDrawerHeading");
  const drawerClose = $("#uiNoteDrawerClose");
  const form = $("#uiNoteForm");
  const numberField = $("#uiNoteNumberField");
  const numberInput = $("#uiNoteNumber");
  const titleInput = $("#uiNoteTitle");
  const contentInput = $("#uiNoteContent");
  const aiAppendButton = $("#uiNoteAiAppend");
  const aiStatus = $("#uiNoteAiStatus");
  const editorError = $("#uiNoteEditorError");
  const deleteButton = $("#uiNoteDelete");
  const cancelButton = $("#uiNoteCancel");
  const saveButton = $("#uiNoteSave");
  const homePage = $(".home-page");

  if (!toolbar || !layer || !drawer || !homePage) return;
  if (layer.parentElement !== homePage) homePage.appendChild(layer);

  let currentPageId = "";
  let editingPageId = "";
  let notes = [];
  let notesVisible = false;
  let toolHidden = false;
  let addMode = false;
  let pendingPosition = null;
  let pendingTargetContext = null;
  let currentTargetContext = null;
  let currentManifest = null;
  let currentInference = null;
  let editingNoteId = "";
  let loadSequence = 0;
  let draggingNoteId = "";
  let noteSurface = null;
  let drawerInitialSignature = "";
  let localMode = window.location.protocol === "file:";

  try { toolHidden = window.localStorage?.getItem(TOOL_HIDDEN_KEY) === "1"; } catch { toolHidden = false; }

  function safeJson(value, fallback = null) {
    if (value == null || value === "") return fallback;
    if (typeof value === "object") return value;
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function readLocalNotes() {
    try {
      const stored = JSON.parse(window.localStorage?.getItem(LOCAL_STORE_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch { return []; }
  }

  function writeLocalNotes(nextNotes) {
    window.localStorage?.setItem(LOCAL_STORE_KEY, JSON.stringify(nextNotes));
  }

  function localNoteRequest(url, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const noteId = decodeURIComponent(url.split("/").at(-1) || "");
    const body = options.body ? JSON.parse(options.body) : {};
    const storedNotes = readLocalNotes();
    if (method === "GET") {
      const pageId = new URL(url, window.location.href).searchParams.get("pageId") || "";
      return { notes: storedNotes.filter((note) => note.projectId === PROJECT_ID && note.pageId === pageId) };
    }
    if (method === "POST") {
      const now = new Date().toISOString();
      const note = { ...body, noteId: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now, updatedAt: now };
      writeLocalNotes([...storedNotes, note]);
      return { note };
    }
    const existingIndex = storedNotes.findIndex((note) => note.noteId === noteId);
    if (existingIndex < 0) throw new Error("未找到这条批注，请刷新后重试");
    if (method === "DELETE") {
      writeLocalNotes(storedNotes.filter((note) => note.noteId !== noteId));
      return { ok: true };
    }
    if (method === "PATCH") {
      const note = { ...storedNotes[existingIndex], ...body, updatedAt: new Date().toISOString() };
      const nextNotes = [...storedNotes];
      nextNotes[existingIndex] = note;
      writeLocalNotes(nextNotes);
      return { note };
    }
    throw new Error("当前批注操作不受支持");
  }

  function activeBaseFrame() {
    const activeContentPage = [...document.querySelectorAll(".sub-page.active")].find((element) => (
      !element.matches('[role="dialog"], [aria-modal="true"], [class*="-sheet"], [class*="-dialog"]')
    ));
    return activeContentPage || $("#serviceDetailPage.active") || $("#servicePurchaseSuccessPage.active")
      || $("#servicePage.active") || $("#planPage.active") || $("#minePage.active")
      || $(".app-view.active") || homePage;
  }

  function activeOverlayFrame() {
    const baseFrame = activeBaseFrame();
    const candidates = [...document.querySelectorAll(".active")].filter((element) => {
      if (element === baseFrame || element.matches('[class*="mask"]') || element.closest("[data-ui-note-ui]")
        || (baseFrame !== homePage && baseFrame.contains(element))) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return /fixed|absolute/.test(style.position) && style.display !== "none" && style.visibility !== "hidden"
        && Number(style.opacity || 1) > 0 && rect.width >= 160 && rect.height >= 100;
    });
    return candidates.sort((a, b) => {
      const zDelta = (Number.parseInt(getComputedStyle(a).zIndex, 10) || 0) - (Number.parseInt(getComputedStyle(b).zIndex, 10) || 0);
      if (zDelta) return zDelta;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    }).at(-1) || null;
  }

  function activeAnnotationFrame() { return activeOverlayFrame() || activeBaseFrame(); }

  function activeAnnotationSurface() {
    const frame = activeAnnotationFrame();
    if (frame === homePage) return homePage;
    return [frame, ...frame.querySelectorAll("*")].find((element) => {
      const overflowY = getComputedStyle(element).overflowY;
      return element.offsetParent !== null && element.clientHeight >= Math.min(240, frame.clientHeight * 0.5)
        && element.clientWidth >= frame.clientWidth * 0.8 && /auto|scroll/.test(overflowY)
        && element.scrollHeight > element.clientHeight + 4;
    }) || frame;
  }

  function basePageId() {
    const activeSubPage = $(".sub-page.active");
    if (activeSubPage) return "sub:" + activeSubPage.id;
    const serviceDetail = $("#serviceDetailPage.active");
    if (serviceDetail) {
      const title = $("#detailServiceTitle")?.textContent.trim() || "default";
      if (serviceDetail.classList.contains("bound-service")) return "service-bound-detail:" + title;
      if (typeof serviceDetailSource !== "undefined" && serviceDetailSource === "orders") {
        const orderStatus = typeof activeServiceOrder !== "undefined" && activeServiceOrder?.status ? activeServiceOrder.status : "default";
        return "service-order-detail:" + orderStatus + ":" + title;
      }
      return "service-detail:" + title;
    }
    if ($("#servicePurchaseSuccessPage.active")) return "service-purchase-success";
    if ($("#servicePage.active")) return "service-list";
    if ($("#planPage.active")) return "schedule";
    if ($("#minePage.active")) {
      const profileTab = $("[data-profile-tab].active")?.dataset.profileTab || "medical";
      const orderTab = profileTab === "orders" ? $("[data-order-tab].active")?.dataset.orderTab || "all" : "";
      return "mine:" + profileTab + (orderTab ? ":" + orderTab : "");
    }
    const activeView = $(".app-view.active");
    return activeView?.id ? "view:" + activeView.id : "home";
  }

  function activePageId() {
    const baseId = basePageId();
    const overlay = activeOverlayFrame();
    if (!overlay) return baseId;
    const overlayId = overlay.id || overlay.getAttribute("aria-label")
      || [...overlay.classList].filter((name) => name !== "active").join(".") || overlay.tagName.toLowerCase();
    return baseId + ":popup:" + overlayId;
  }

  function syncOverlayBounds() {
    const surface = activeAnnotationSurface();
    const frame = activeAnnotationFrame();
    if (noteSurface !== surface) {
      noteSurface?.classList.remove("ui-note-surface", "ui-note-surface-static");
      noteSurface = surface;
      noteSurface.classList.add("ui-note-surface");
      if (getComputedStyle(noteSurface).position === "static") noteSurface.classList.add("ui-note-surface-static");
      noteSurface.appendChild(layer);
    }
    const toolbarFrame = activeOverlayFrame() ? activeBaseFrame() : frame;
    const rect = toolbarFrame.getBoundingClientRect();
    const visibleTop = Math.max(0, rect.top);
    layer.style.cssText = "left:0;top:0;width:100%;height:0px";
    const stableSurfaceHeight = Math.max(surface.scrollHeight, surface.clientHeight, surface.offsetHeight);
    layer.style.height = stableSurfaceHeight + "px";
    toolbar.style.left = Math.max(8, rect.right - toolbar.offsetWidth - 8) + "px";
    toolbar.style.top = Math.max(8, visibleTop + 46) + "px";
    const launcherOnRight = innerWidth - rect.right >= 60;
    launcherButton.style.left = (launcherOnRight ? rect.right + 8 : Math.max(8, rect.left - 52)) + "px";
    launcherButton.style.top = Math.max(8, visibleTop + 46) + "px";
    const drawerRect = activeBaseFrame().getBoundingClientRect();
    const drawerGap = 12;
    const rightSpace = Math.max(0, innerWidth - drawerRect.right - drawerGap);
    const leftSpace = Math.max(0, drawerRect.left - drawerGap);
    const useRightSide = rightSpace >= 260 || rightSpace >= leftSpace;
    const sideSpace = useRightSide ? rightSpace : leftSpace;
    const drawerWidth = Math.min(360, Math.max(240, sideSpace - 8));
    const drawerLeft = useRightSide
      ? drawerRect.right + drawerGap
      : drawerRect.left - drawerGap - drawerWidth;
    drawer.style.left = drawerLeft + "px";
    drawer.style.right = "auto";
    drawer.style.width = drawerWidth + "px";
    drawer.style.top = Math.max(0, drawerRect.top) + "px";
    drawer.style.height = Math.max(0, Math.min(innerHeight, drawerRect.bottom) - Math.max(0, drawerRect.top)) + "px";
    layer.hidden = toolHidden || !notesVisible;
  }

  async function apiRequest(url, options = {}) {
    if (localMode) return localNoteRequest(url, options);
    const response = await fetch(url, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
    const payload = await response.json().catch(() => null);
    if (!payload) throw new Error("批注服务未启用");
    if (!response.ok) throw new Error(payload.error || "批注保存失败，请稍后重试");
    return payload;
  }

  async function fetchPageNotes(pageId) {
    const query = new URLSearchParams({ projectId: PROJECT_ID, pageId });
    if (localMode) {
      toolbar.dataset.local = "true";
      toolbar.title = "批注保存在当前浏览器";
      return localNoteRequest(API_PATH + "?" + query).notes;
    }
    try {
      const payload = await apiRequest(API_PATH + "?" + query);
      if (!Array.isArray(payload.notes)) throw new Error("批注数据格式不正确");
      return payload.notes;
    } catch (apiError) {
      const seedResponse = await fetch("data/ui-notes-seed.json", { cache: "no-store" });
      if (!seedResponse.ok) throw apiError;
      const seed = await seedResponse.json();
      if (!Array.isArray(seed?.notes)) throw apiError;
      toolbar.dataset.readonly = "true";
      toolbar.title = "当前为在线只读批注";
      addButton.disabled = true;
      aiAppendButton.disabled = true;
      return seed.notes.filter((note) => note.projectId === PROJECT_ID && note.pageId === pageId);
    }
  }

  function visibleText(element) {
    return String(element?.getAttribute("aria-label") || element?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  function elementRole(element) {
    return element?.getAttribute("role") || ({ BUTTON: "按钮", A: "链接", INPUT: "输入框", TEXTAREA: "多行输入", SELECT: "选择器", NAV: "导航" }[element?.tagName] || "内容区域");
  }

  function stableTargetKey(element) {
    if (!element) return "page";
    for (const key of ["annotationKey", "testid", "action", "profileTab", "orderTab"]) {
      if (element.dataset?.[key]) return `data-${key}:${element.dataset[key]}`;
    }
    if (element.id) return "#" + element.id;
    const classes = [...element.classList].filter((name) => !/active|selected|open|show|disabled/.test(name)).slice(0, 2);
    return element.tagName.toLowerCase() + (classes.length ? "." + classes.join(".") : "");
  }

  function captureTargetContext(rawTarget) {
    const frame = activeAnnotationFrame();
    const meaningful = rawTarget?.closest?.('button,a,input,textarea,select,[role="button"],[role="tab"],[data-action],[data-profile-tab],[data-order-tab],label,article,section,nav') || rawTarget;
    const element = meaningful && frame.contains(meaningful) ? meaningful : frame;
    const section = element.closest?.("section,article") || frame;
    const sectionTitle = visibleText(section.querySelector?.("h1,h2,h3,h4,.section-title,.title"));
    return {
      targetKey: stableTargetKey(element),
      label: visibleText(element) || "未命名区域",
      role: elementRole(element),
      section: sectionTitle || visibleText(frame.querySelector("h1,h2,h3,.page-title,.detail-title")) || "当前界面",
      pageId: currentPageId
    };
  }

  function buildInterfaceManifest() {
    const frame = activeAnnotationFrame();
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const headings = [...frame.querySelectorAll("h1,h2,h3,h4,.section-title,.page-title")]
      .filter(visible).map(visibleText).filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).slice(0, 12);
    const controls = [...frame.querySelectorAll('button,a,input,textarea,select,[role="button"],[role="tab"],[data-action]')]
      .filter((element) => !element.closest("[data-ui-note-ui]") && visible(element)).slice(0, 24).map((element) => ({
        key: stableTargetKey(element), label: visibleText(element) || element.getAttribute("placeholder") || "未命名控件",
        role: elementRole(element), disabled: Boolean(element.disabled || element.getAttribute("aria-disabled") === "true")
      }));
    return { pageId: currentPageId, route: location.hash || location.pathname, pageLabel: headings[0] || document.title || "当前界面", headings, controls, capturedAt: new Date().toISOString() };
  }

  const featurePatterns = [
    { pattern: /退款|退费|取消订单|售后/, name: "订单退款", states: "可申请、审核中、退款成功、退款失败、已关闭" },
    { pattern: /验证码|短信|倒计时/, name: "短信验证码", states: "待发送、发送中、倒计时、可重发、发送失败" },
    { pattern: /购买|订阅|支付|下单|续费/, name: "服务包购买", states: "待确认、支付中、支付成功、支付失败、已取消" },
    { pattern: /切换.*(用户|患者|就诊人|成员)|选择.*(用户|患者|就诊人|成员)/, name: "就诊人切换", states: "未选择、已选择、切换中、切换失败" },
    { pattern: /保存|提交|确认/, name: "表单提交", states: "待填写、校验中、提交中、提交成功、提交失败" },
    { pattern: /删除|移除/, name: "删除确认", states: "可删除、确认中、删除中、删除成功、删除失败" },
    { pattern: /显示|隐藏|可见|入口|按钮.*出现/, name: "功能可见性", states: "显示、隐藏、禁用、无权限" },
    { pattern: /订单|服务包/, name: "订单管理", states: "待使用、生效中、退款中、已退款、已关闭" }
  ];

  function inferFeature(title, target = currentTargetContext) {
    const cleanTitle = String(title || "").trim();
    const matched = featurePatterns.find((item) => item.pattern.test(cleanTitle));
    const pageSupport = [target?.section, target?.label, currentManifest?.pageLabel].filter(Boolean).join(" / ");
    const fallbackName = cleanTitle ? cleanTitle.replace(/[？?。.!！]/g, "").slice(0, 24) : "待判断功能";
    return {
      featureName: matched?.name || fallbackName,
      confidence: matched ? "高" : cleanTitle ? "中" : "待判断",
      basis: cleanTitle ? `主要依据：标题“${cleanTitle}”；界面核对：${pageSupport || "当前页面"}` : "标题是第一判断依据，界面位置和现有交互用于核对。",
      states: matched?.states || "初始、处理中、成功、失败"
    };
  }

  function refreshInference() {
    currentInference = inferFeature(titleInput.value);
  }

  function resizeContentInput() {
    contentInput.style.height = "auto";
    contentInput.style.height = Math.max(76, contentInput.scrollHeight) + "px";
  }

  function appendAiNote() {
    const title = titleInput.value.trim();
    const writtenRule = contentInput.value.trim();
    if (!title) {
      editorError.textContent = "请先填写批注标题";
      titleInput.focus();
      return;
    }
    if (!writtenRule) {
      editorError.textContent = "请先写下你定的规则，AI只在这条规则上做必要补充";
      contentInput.focus();
      return;
    }
    editorError.textContent = "";
    aiAppendButton.disabled = true;
    aiAppendButton.classList.add("loading");
    aiStatus.textContent = "正在检查这条规则还缺什么…";
    window.setTimeout(() => {
      currentManifest = buildInterfaceManifest();
      currentInference = inferFeature(title);
      let addition = "";
      const destinationMatch = writtenRule.match(/(?:跳转|进入|打开)(?:到|至)?[“\"]?([^，。；\n”\"]{1,18}?)(?:界面|页面)/);
      if (destinationMatch && !/失败|打不开|加载失败/.test(writtenRule)) {
        const destination = destinationMatch[1].replace(/^(到|至)/, "");
        addition = `补充：${destination}页面打开失败时，提示“加载失败，请重试”。`;
      } else if (/仅.+显示|只有.+显示|满足.+显示/.test(writtenRule) && !/其他|不满足|隐藏|不显示/.test(writtenRule)) {
        addition = "补充：不满足上述条件时，不显示该入口。";
      } else if (/保存|提交/.test(writtenRule) && !/失败|重试/.test(writtenRule)) {
        addition = "补充：操作失败时保留已填写内容，并提示用户重试。";
      } else if (/删除|移除/.test(writtenRule) && !/确认|二次/.test(writtenRule)) {
        addition = "补充：删除前需要再次确认，避免误操作。";
      } else if (/切换/.test(writtenRule) && !/刷新|更新/.test(writtenRule)) {
        addition = "补充：切换成功后，同时更新当前页面显示的内容。";
      } else if (/必填|校验|格式/.test(writtenRule) && !/提示|说明/.test(writtenRule)) {
        addition = "补充：填写不正确时，在对应位置直接说明问题。";
      }

      if (!addition || writtenRule.includes(addition.replace(/^补充：/, ""))) {
        aiStatus.textContent = "这条规则已经很清楚，暂时不需要补充";
        aiAppendButton.disabled = false;
        aiAppendButton.classList.remove("loading");
        return;
      }
      const separator = contentInput.value.trim() ? "\n" : "";
      const nextContent = contentInput.value + separator + addition;
      if (nextContent.length > contentInput.maxLength) {
        editorError.textContent = "补充说明内容较长，请精简部分文字后再使用AI补充";
        aiStatus.textContent = "未修改原有备注";
      } else {
        contentInput.value = nextContent;
        resizeContentInput();
        contentInput.focus();
        contentInput.setSelectionRange(contentInput.value.length, contentInput.value.length);
        contentInput.scrollTop = contentInput.scrollHeight;
        aiStatus.textContent = "只补充了这条规则，可直接修改";
      }
      aiAppendButton.disabled = false;
      aiAppendButton.classList.remove("loading");
    }, 260);
  }

  function noteSignature() {
    return JSON.stringify([numberInput.value, titleInput.value, contentInput.value]);
  }

  function openDrawer(note = null) {
    editingNoteId = note?.noteId || "";
    editingPageId = currentPageId;
    drawerTitle.textContent = note ? "编辑批注" : "添加批注";
    numberField.hidden = false;
    const suggestedNumber = notes.reduce((max, item) => Math.max(max, Number(item.noteNumber) || 0), 0) + 1;
    numberInput.value = String(note?.noteNumber || suggestedNumber);
    titleInput.value = note?.title || "";
    contentInput.value = note?.content || "";
    currentTargetContext = safeJson(note?.targetSnapshot) || pendingTargetContext || captureTargetContext(activeAnnotationFrame());
    currentManifest = safeJson(currentTargetContext?.interfaceManifest) || buildInterfaceManifest();
    currentInference = safeJson(note?.featureInference) || inferFeature(titleInput.value);
    aiStatus.textContent = "AI只补必要内容，不改变你写的规则";
    editorError.textContent = "";
    deleteButton.hidden = !note;
    refreshInference();
    drawerInitialSignature = noteSignature();
    drawer.classList.add("active");
    syncOverlayBounds();
    window.setTimeout(() => {
      resizeContentInput();
      titleInput.focus();
    }, 80);
  }

  function closeDrawer(force = false) {
    if (!force && drawer.classList.contains("active") && drawerInitialSignature && noteSignature() !== drawerInitialSignature
      && !window.confirm("当前批注还没有保存，确定关闭吗？")) return;
    drawer.classList.remove("active");
    editingNoteId = "";
    editingPageId = "";
    pendingPosition = null;
    pendingTargetContext = null;
    currentTargetContext = null;
    currentManifest = null;
    currentInference = null;
    drawerInitialSignature = "";
    editorError.textContent = "";
  }

  async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title) { editorError.textContent = "请填写批注标题"; titleInput.focus(); return; }
    if (editingPageId !== currentPageId) { editorError.textContent = "页面已切换，请在当前页面重新添加批注"; return; }
    const noteNumber = Number(numberInput.value);
    if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) {
      editorError.textContent = "批注编号请输入1至9999之间的整数"; numberInput.focus(); return;
    }
    currentManifest = buildInterfaceManifest();
    currentInference = inferFeature(title);
    const targetSnapshot = { ...(currentTargetContext || {}), interfaceManifest: currentManifest };
    const commonPayload = { noteNumber, title, content, targetKey: currentTargetContext?.targetKey || "page", targetSnapshot,
      featureInference: currentInference, updatedBy: ACTOR };
    saveButton.disabled = true;
    deleteButton.disabled = true;
    try {
      if (editingNoteId) {
        const existing = notes.find((note) => note.noteId === editingNoteId);
        const payload = await apiRequest(API_PATH + "/" + editingNoteId, { method: "PATCH", body: JSON.stringify({ ...commonPayload, x: existing?.x, y: existing?.y }) });
        notes = notes.map((note) => note.noteId === editingNoteId ? payload.note : note).sort((a, b) => a.noteNumber - b.noteNumber);
      } else {
        const payload = await apiRequest(API_PATH, { method: "POST", body: JSON.stringify({ ...commonPayload, projectId: PROJECT_ID,
          pageId: currentPageId, x: pendingPosition?.x ?? 0.5, y: pendingPosition?.y ?? 0.5, createdBy: ACTOR }) });
        notes = [...notes, payload.note].sort((a, b) => a.noteNumber - b.noteNumber);
      }
      closeDrawer(true);
      renderNotes();
    } catch (error) { editorError.textContent = error.message; }
    finally { saveButton.disabled = false; deleteButton.disabled = false; }
  }

  async function removeNote() {
    if (!editingNoteId || !window.confirm("确定删除这条批注吗？")) return;
    deleteButton.disabled = true; saveButton.disabled = true;
    try {
      await apiRequest(API_PATH + "/" + editingNoteId, { method: "DELETE", headers: { "X-UI-Note-User": encodeURIComponent(ACTOR) } });
      notes = notes.filter((note) => note.noteId !== editingNoteId);
      closeDrawer(true); renderNotes();
    } catch (error) { editorError.textContent = error.message; }
    finally { deleteButton.disabled = false; saveButton.disabled = false; }
  }

  async function savePosition(note) {
    try {
      const payload = await apiRequest(API_PATH + "/" + note.noteId, {
        method: "PATCH",
        body: JSON.stringify({ x: note.x, y: note.y, updatedBy: ACTOR })
      });
      notes = notes.map((item) => item.noteId === note.noteId ? payload.note : item);
      renderNotes();
    } catch (error) {
      toolbar.dataset.error = "true";
      toolbar.title = error.message;
      await loadNotes(true);
    }
  }

  function updateToolbar() {
    countBadge.textContent = String(notes.length);
    toggleButton.textContent = notesVisible ? "隐藏批注" : "显示批注";
    addButton.textContent = addMode ? "取消打点" : "添加批注";
    addButton.classList.toggle("active", addMode);
    toolbar.hidden = toolHidden;
    launcherButton.hidden = !toolHidden;
    layer.hidden = toolHidden || !notesVisible;
    document.body.classList.toggle("ui-note-placement-mode", addMode && !toolHidden);
    document.body.classList.toggle("ui-note-tool-hidden", toolHidden);
  }

  function setToolHidden(hidden) {
    const nextHidden = Boolean(hidden);
    if (nextHidden && drawer.classList.contains("active") && drawerInitialSignature
      && noteSignature() !== drawerInitialSignature
      && !window.confirm("当前批注还没有保存，收起后将放弃本次修改，是否继续？")) return;
    toolHidden = nextHidden;
    addMode = false;
    notesVisible = false;
    if (toolHidden) closeDrawer(true);
    try { window.localStorage?.setItem(TOOL_HIDDEN_KEY, toolHidden ? "1" : "0"); } catch { /* ignore */ }
    updateToolbar();
    syncOverlayBounds();
  }

  function bindPointEvents(point, note) {
    let startX = 0;
    let startY = 0;
    let moved = false;

    point.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      draggingNoteId = note.noteId;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      point.setPointerCapture(event.pointerId);
    });

    point.addEventListener("pointermove", (event) => {
      if (draggingNoteId !== note.noteId) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 3) moved = true;
      if (!moved) return;
      const rect = layer.getBoundingClientRect();
      note.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      note.y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      point.style.left = note.x * 100 + "%";
      point.style.top = note.y * 100 + "%";
    });

    point.addEventListener("pointerup", (event) => {
      if (draggingNoteId !== note.noteId) return;
      point.releasePointerCapture(event.pointerId);
      draggingNoteId = "";
      point.dataset.dragged = moved ? "true" : "false";
      if (moved) savePosition(note);
    });

    point.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (point.dataset.dragged === "true") {
        point.dataset.dragged = "false";
        return;
      }
      openDrawer(note);
    });
  }

  function renderNotes() {
    layer.replaceChildren();
    notes.forEach((note) => {
      const point = document.createElement("button");
      point.type = "button"; point.className = "ui-note-point"; point.dataset.noteId = note.noteId; point.dataset.uiNoteUi = "";
      point.textContent = String(note.noteNumber); point.title = note.title + (note.content ? "：" + note.content : "");
      point.setAttribute("aria-label", "批注" + note.noteNumber + "：" + note.title);
      point.style.left = Math.max(0, Math.min(1, Number(note.x))) * 100 + "%";
      point.style.top = Math.max(0, Math.min(1, Number(note.y))) * 100 + "%";
      bindPointEvents(point, note); layer.appendChild(point);
    });
    updateToolbar();
  }

  async function loadNotes(silent = false) {
    const pageId = currentPageId; const sequence = ++loadSequence;
    try {
      const nextNotes = await fetchPageNotes(pageId);
      if (sequence !== loadSequence || pageId !== currentPageId) return;
      const signature = (items) => JSON.stringify(items.map((note) => [note.noteId, note.noteNumber, note.title, note.content, note.x, note.y, note.updatedAt, note.ruleGeneratedAt]));
      if (silent && signature(notes) === signature(nextNotes)) return;
      notes = nextNotes; renderNotes(); toolbar.removeAttribute("data-error");
      if (!toolbar.hasAttribute("data-readonly")) toolbar.title = "";
    } catch (error) {
      if (sequence !== loadSequence) return;
      toolbar.dataset.error = "true"; toolbar.title = error.message;
      if (!silent) { countBadge.textContent = "!"; countBadge.title = error.message; }
    }
  }

  function setAddMode(enabled) { addMode = Boolean(enabled); updateToolbar(); }

  addButton.addEventListener("click", () => { const next = !addMode; if (next) notesVisible = true; setAddMode(next); });
  toggleButton.addEventListener("click", () => { notesVisible = !notesVisible; setAddMode(false); updateToolbar(); });
  collapseButton.addEventListener("click", () => setToolHidden(true));
  launcherButton.addEventListener("click", () => setToolHidden(false));
  document.addEventListener("click", (event) => {
    if (!addMode || event.target.closest("[data-ui-note-ui]")) return;
    const rect = layer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
    event.preventDefault(); event.stopPropagation();
    pendingPosition = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
    pendingTargetContext = captureTargetContext(event.target);
    setAddMode(false); openDrawer();
  }, true);
  form.addEventListener("submit", (event) => { event.preventDefault(); saveNote(); });
  titleInput.addEventListener("input", refreshInference);
  contentInput.addEventListener("input", () => {
    resizeContentInput();
    if (!aiAppendButton.classList.contains("loading")) aiStatus.textContent = "可继续手动修改，AI不会自动覆盖内容";
  });
  aiAppendButton.addEventListener("click", appendAiNote);
  deleteButton.addEventListener("click", removeNote);
  cancelButton.addEventListener("click", () => closeDrawer());
  drawerClose.addEventListener("click", () => closeDrawer());
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && drawer.classList.contains("active")) closeDrawer(); });

  function syncPageContext() {
    syncOverlayBounds();
    const nextPageId = activePageId();
    if (nextPageId === currentPageId) return;
    currentPageId = nextPageId; notesVisible = false; setAddMode(false); closeDrawer(true); notes = []; renderNotes(); loadNotes();
  }

  window.addEventListener("resize", () => {
    syncOverlayBounds();
    if (drawer.classList.contains("active")) resizeContentInput();
  });
  window.addEventListener("scroll", syncOverlayBounds, true);
  currentPageId = activePageId();
  if (localMode) { toolbar.dataset.local = "true"; toolbar.title = "批注保存在当前浏览器"; }
  syncOverlayBounds(); renderNotes(); loadNotes();
  window.setInterval(syncPageContext, 250);
  window.setInterval(() => { if (!editingNoteId && !draggingNoteId && !drawer.classList.contains("active")) loadNotes(true); }, 5000);
})();
