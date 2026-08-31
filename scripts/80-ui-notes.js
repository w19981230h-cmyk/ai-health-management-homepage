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
  const summaryButton = $("#uiNoteSummaryButton");
  const collapseButton = $("#uiNoteCollapse");
  const launcherButton = $("#uiNoteLauncher");
  const countBadge = $("#uiNoteCount");
  const layer = $("#uiNoteLayer");
  const drawerMask = $("#uiNoteDrawerMask");
  const drawer = $("#uiNoteDrawer");
  const drawerTitle = $("#uiNoteDrawerHeading");
  const drawerClose = $("#uiNoteDrawerClose");
  const summary = $("#uiNoteSummary");
  const summaryClose = $("#uiNoteSummaryClose");
  const summaryCount = $("#uiNoteSummaryCount");
  const summaryPageCount = $("#uiNoteSummaryPageCount");
  const summaryList = $("#uiNoteSummaryList");
  const form = $("#uiNoteForm");
  const numberField = $("#uiNoteNumberField");
  const numberInput = $("#uiNoteNumber");
  const titleInput = $("#uiNoteTitle");
  const contentInput = $("#uiNoteContent");
  const aiAppendButton = $("#uiNoteAiAppend");
  const aiStatus = $("#uiNoteAiStatus");
  const attachmentList = $("#uiNoteAttachmentList");
  const attachmentStatus = $("#uiNoteAttachmentStatus");
  const interactionInput = $("#uiNoteInteractionContent");
  const interactionAiAppendButton = $("#uiNoteInteractionAiAppend");
  const interactionAiStatus = $("#uiNoteInteractionAiStatus");
  const interactionAttachmentList = $("#uiNoteInteractionAttachmentList");
  const interactionAttachmentStatus = $("#uiNoteInteractionAttachmentStatus");
  const imageViewer = $("#uiNoteImageViewer");
  const imageViewerImage = $("#uiNoteImageViewerImage");
  const imageViewerClose = $("#uiNoteImageViewerClose");
  const editorError = $("#uiNoteEditorError");
  const deleteButton = $("#uiNoteDelete");
  const cancelButton = $("#uiNoteCancel");
  const saveButton = $("#uiNoteSave");
  const homePage = $(".home-page");
  const sharedReviewMode = new URLSearchParams(window.location.search).get("review") === "1";

  if (!toolbar || !layer || !drawer || !homePage) return;
  if (layer.parentElement !== homePage) homePage.appendChild(layer);

  let currentPageId = "";
  let editingPageId = "";
  let notes = [];
  let summaryNotes = [];
  let currentAttachments = [];
  let currentInteractionAttachments = [];
  let notesVisible = sharedReviewMode;
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

  function isReadonlyMode() {
    return toolbar.hasAttribute("data-readonly");
  }

  function setReadonlyMode(message = "当前为在线只读批注") {
    toolbar.dataset.readonly = "true";
    toolbar.title = message;
    addButton.disabled = true;
    aiAppendButton.disabled = true;
    interactionAiAppendButton.disabled = true;
  }

  function localNoteRequest(url, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const noteId = decodeURIComponent(url.split("/").at(-1) || "");
    const body = options.body ? JSON.parse(options.body) : {};
    const storedNotes = readLocalNotes();
    if (method === "GET") {
      const searchParams = new URL(url, window.location.href).searchParams;
      const pageId = searchParams.get("pageId") || "";
      if (searchParams.get("scope") === "all") {
        return { notes: storedNotes.filter((note) => note.projectId === PROJECT_ID) };
      }
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

  function activeTabContext(frame) {
    if (!frame) return "";
    const containers = [...frame.querySelectorAll('[role="tablist"], [class*="tabs"], [id$="Tabs"]')];
    const identities = [];
    const claimedTabs = new Set();
    const clean = (value) => String(value).replace(/\s+/g, "").replace(/[:|=]/g, "-").slice(0, 40);
    containers.forEach((container, index) => {
      if (container.closest("[data-ui-note-ui]")) return;
      const rect = container.getBoundingClientRect();
      const style = getComputedStyle(container);
      if (!rect.width || !rect.height || style.display === "none" || style.visibility === "hidden") return;
      const activeTab = container.querySelector('[role="tab"][aria-selected="true"], [role="tab"].active, button.active, a.active');
      if (!activeTab) return;
      claimedTabs.add(activeTab);
      if (activeTab.dataset.profileTab || activeTab.dataset.orderTab) return;
      const firstTab = container.querySelector('[role="tab"], button, a');
      if (activeTab === firstTab) return;
      const datasetEntry = Object.entries(activeTab.dataset).find(([key, value]) => (
        value && /(tab|category|filter|range|group|plan|region|organ)/i.test(key)
        && !/^(profileTab|orderTab)$/.test(key)
      ));
      const rawValue = datasetEntry?.[1] || visibleText(activeTab);
      if (!rawValue) return;
      const containerKey = container.id
        || container.getAttribute("aria-label")
        || [...container.classList].find((name) => name.includes("tabs"))
        || `tabs${index + 1}`;
      identities.push(`${clean(containerKey)}=${clean(rawValue)}`);
    });
    [...frame.querySelectorAll('.active, [aria-selected="true"]')].forEach((candidate) => {
      if (claimedTabs.has(candidate) || candidate.closest("[data-ui-note-ui]")) return;
      const datasetEntry = Object.entries(candidate.dataset).find(([key, value]) => (
        value && /(tab|category|filter|range|group|plan|region|organ)/i.test(key)
        && !/^(profileTab|orderTab)$/.test(key)
      ));
      if (!datasetEntry) return;
      const rect = candidate.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      identities.push(`data-${clean(datasetEntry[0])}=${clean(datasetEntry[1])}`);
    });
    return [...new Set(identities)].join("|");
  }

  function compactPageId(value) {
    const pageId = String(value);
    if (pageId.length <= 240) return pageId;
    let hash = 2166136261;
    for (let index = 0; index < pageId.length; index += 1) {
      hash ^= pageId.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return pageId.slice(0, 220) + ":h" + (hash >>> 0).toString(36);
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
    const baseFrame = activeBaseFrame();
    const baseTabs = activeTabContext(baseFrame);
    const baseId = basePageId() + (baseTabs ? ":tabs:" + baseTabs : "");
    const overlay = activeOverlayFrame();
    if (!overlay) return compactPageId(baseId);
    const overlayId = overlay.id || overlay.getAttribute("aria-label")
      || [...overlay.classList].filter((name) => name !== "active").join(".") || overlay.tagName.toLowerCase();
    const overlayTabs = activeTabContext(overlay);
    return compactPageId(baseId + ":popup:" + overlayId + (overlayTabs ? ":tabs:" + overlayTabs : ""));
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
    summary.style.left = drawerLeft + "px";
    summary.style.right = "auto";
    summary.style.width = drawerWidth + "px";
    summary.style.top = Math.max(0, drawerRect.top) + "px";
    summary.style.height = Math.max(0, Math.min(innerHeight, drawerRect.bottom) - Math.max(0, drawerRect.top)) + "px";
    layer.hidden = toolHidden || !notesVisible;
  }

  function annotationSurfaceHeight() {
    return Math.max(1, Number.parseFloat(layer.style.height) || layer.offsetHeight || noteSurface?.scrollHeight || 1);
  }

  function prepareStablePointPosition(note) {
    if (Number.isFinite(note?._pixelY)) return;
    const snapshot = safeJson(note?.targetSnapshot, {}) || {};
    const savedBasisHeight = Number(snapshot.annotationSurfaceHeight);
    const basisHeight = savedBasisHeight > 0 ? savedBasisHeight : annotationSurfaceHeight();
    note._positionBasisHeight = basisHeight;
    note._pixelY = Math.max(0, Math.min(basisHeight, Number(note.y) * basisHeight));
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
      setReadonlyMode("当前为在线只读批注");
      return seed.notes.filter((note) => note.projectId === PROJECT_ID && note.pageId === pageId);
    }
  }

  async function fetchAllNotes() {
    const query = new URLSearchParams({ projectId: PROJECT_ID, scope: "all" });
    if (localMode) return localNoteRequest(API_PATH + "?" + query).notes;
    try {
      const payload = await apiRequest(API_PATH + "?" + query);
      if (!Array.isArray(payload.notes)) throw new Error("批注数据格式不正确");
      return payload.notes;
    } catch (apiError) {
      const seedResponse = await fetch("data/ui-notes-seed.json", { cache: "no-store" });
      if (!seedResponse.ok) throw apiError;
      const seed = await seedResponse.json();
      if (!Array.isArray(seed?.notes)) throw apiError;
      return seed.notes.filter((note) => note.projectId === PROJECT_ID && note.status !== "deleted");
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

  function resizeContentInput(input = contentInput) {
    input.style.height = "auto";
    input.style.height = Math.max(76, input.scrollHeight) + "px";
  }

  function nextOrderedPrefix(value) {
    const markers = [...String(value || "").matchAll(/^\s*(\d+)\s*([、.)．])\s*/gm)];
    if (!markers.length) return "补充：";
    const last = markers.at(-1);
    return `${Number(last[1]) + 1}${last[2]} `;
  }

  function appendAiNote(input = contentInput, status = aiStatus, button = aiAppendButton) {
    const title = titleInput.value.trim();
    const writtenRule = input.value.trim();
    if (!title) {
      editorError.textContent = "请先填写批注标题";
      titleInput.focus();
      return;
    }
    if (!writtenRule) {
      editorError.textContent = "请先写下你定的规则，AI只在这条规则上做必要补充";
      input.focus();
      return;
    }
    editorError.textContent = "";
    button.disabled = true;
    button.classList.add("loading");
    status.textContent = "正在检查这条规则还缺什么…";
    window.setTimeout(() => {
      currentManifest = buildInterfaceManifest();
      currentInference = inferFeature(title);
      const context = [title, currentTargetContext?.section, currentTargetContext?.label, currentManifest?.pageLabel].filter(Boolean).join(" ");
      const candidates = [];
      const destinationMatch = writtenRule.match(/(?:跳转|进入|打开)(?:到|至)?[“\"]?([^，。；\n”\"]{1,18}?)(?:界面|页面)/);
      if (destinationMatch && !/失败|打不开|加载失败/.test(writtenRule)) {
        const destination = destinationMatch[1].replace(/^(到|至)/, "");
        candidates.push({ covered: /失败|打不开|加载失败|重试/, rule: `${destination}页面打开失败时，提示“加载失败，请重试”。` });
      }
      if (/健康画像|画像|档案|报告|详情|查看|数据/.test(context)) {
        candidates.push(
          { covered: /无数据|暂无数据|空状态/, rule: "没有可展示的数据时，显示空状态说明，不保留上一次的数据。" },
          { covered: /加载失败|重新加载|重试/, rule: "数据加载失败时，保留当前页面并提供“重新加载”入口。" },
          { covered: /加载中|加载状态/, rule: "数据请求期间显示加载状态，完成后再展示结果。" }
        );
      }
      if (/仅.+显示|只有.+显示|满足.+显示/.test(writtenRule) || /显示|隐藏|入口/.test(title)) {
        candidates.push({ covered: /不满足|隐藏|不显示/, rule: "不满足上述条件时，不显示该入口。" });
      }
      if (/保存|提交|确认/.test(context)) {
        candidates.push({ covered: /失败|重试|保留已填写/, rule: "操作失败时保留已填写内容，并提示用户重试。" });
      }
      if (/删除|移除/.test(context)) {
        candidates.push({ covered: /确认|二次/, rule: "删除前需要再次确认，避免误操作。" });
      }
      if (/切换/.test(context)) {
        candidates.push({ covered: /刷新|更新当前|同步更新/, rule: "切换成功后，同步更新当前页面显示的内容。" });
      }
      if (/必填|校验|格式|输入/.test(context)) {
        candidates.push({ covered: /错误提示|对应位置|填写不正确/, rule: "填写不正确时，在对应位置直接说明问题。" });
      }
      candidates.push(
        { covered: /重复点击|处理中|不可重复/, rule: "操作处理中不可重复点击，完成后恢复操作。" },
        { covered: /成功提示|完成提示|操作成功/, rule: "操作完成后给出明确结果提示。" }
      );
      const selected = candidates.find((item) => !item.covered.test(writtenRule));
      const addition = selected ? nextOrderedPrefix(writtenRule) + selected.rule : "";

      if (!addition) {
        status.textContent = "这条规则已经很清楚，暂时不需要补充";
        button.disabled = false;
        button.classList.remove("loading");
        return;
      }
      const separator = input.value.trim() ? "\n" : "";
      const nextContent = input.value + separator + addition;
      if (nextContent.length > input.maxLength) {
        editorError.textContent = "补充说明内容较长，请精简部分文字后再使用AI补充";
        status.textContent = "未修改原有备注";
      } else {
        input.value = nextContent;
        resizeContentInput(input);
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
        input.scrollTop = input.scrollHeight;
        status.textContent = "只补充了这条规则，可直接修改";
      }
      button.disabled = false;
      button.classList.remove("loading");
    }, 260);
  }

  function noteSignature() {
    return JSON.stringify([numberInput.value, titleInput.value, contentInput.value, interactionInput.value,
      currentAttachments.map((item) => [item.id, item.name, item.dataUrl?.length || 0]),
      currentInteractionAttachments.map((item) => [item.id, item.name, item.dataUrl?.length || 0])]);
  }

  function openImageViewer(attachment) {
    if (!String(attachment?.dataUrl || "").startsWith("data:image/")) return;
    imageViewerImage.src = attachment.dataUrl;
    imageViewerImage.alt = attachment.name || "批注截图大图";
    imageViewer.hidden = false;
  }

  function closeImageViewer() {
    imageViewer.hidden = true;
    imageViewerImage.removeAttribute("src");
  }

  function renderAttachments(kind = "logic") {
    const isInteraction = kind === "interaction";
    const list = isInteraction ? interactionAttachmentList : attachmentList;
    const status = isInteraction ? interactionAttachmentStatus : attachmentStatus;
    const attachments = isInteraction ? currentInteractionAttachments : currentAttachments;
    list.replaceChildren();
    attachments.forEach((attachment) => {
      const item = document.createElement("figure");
      item.className = "ui-note-attachment-item";
      const preview = document.createElement("img");
      preview.src = attachment.dataUrl;
      preview.alt = attachment.name || "批注截图";
      preview.addEventListener("click", () => openImageViewer(attachment));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `删除截图${attachment.name || ""}`);
      remove.addEventListener("click", () => {
        if (isInteraction) currentInteractionAttachments = currentInteractionAttachments.filter((entry) => entry.id !== attachment.id);
        else currentAttachments = currentAttachments.filter((entry) => entry.id !== attachment.id);
        status.textContent = "已移除截图，保存批注后生效";
        renderAttachments(kind);
      });
      item.appendChild(preview);
      if (!isReadonlyMode()) item.appendChild(remove);
      list.appendChild(item);
    });
  }

  function readBlobAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("截图读取失败，请重新选择"));
      reader.readAsDataURL(blob);
    });
  }

  function loadPreviewImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("截图格式无法识别"));
      image.src = dataUrl;
    });
  }

  async function screenshotAttachment(file, attachmentNumber = 1) {
    if (!file?.type?.startsWith("image/")) throw new Error("只能添加图片格式的截图");
    if (file.size > 10 * 1024 * 1024) throw new Error("单张截图不能超过10MB");
    const original = await readBlobAsDataUrl(file);
    const image = await loadPreviewImage(original);
    const maxEdge = 1280;
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const compressedBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.78));
    const dataUrl = compressedBlob ? await readBlobAsDataUrl(compressedBlob) : original;
    if (dataUrl.length > 900000) throw new Error("截图内容较大，请裁剪后再粘贴");
    return {
      id: `shot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(file.name || `批注截图-${attachmentNumber}.jpg`).slice(0, 80),
      mimeType: "image/jpeg",
      dataUrl,
      createdAt: new Date().toISOString()
    };
  }

  async function addScreenshotFiles(files, kind = "logic") {
    const imageFiles = [...files].filter((file) => file?.type?.startsWith("image/"));
    if (!imageFiles.length) return;
    const isInteraction = kind === "interaction";
    const attachments = isInteraction ? currentInteractionAttachments : currentAttachments;
    const status = isInteraction ? interactionAttachmentStatus : attachmentStatus;
    const remaining = Math.max(0, 3 - attachments.length);
    if (!remaining) { status.textContent = "每个补充框最多添加3张截图"; return; }
    status.textContent = "正在处理截图…";
    try {
      for (const file of imageFiles.slice(0, remaining)) attachments.push(await screenshotAttachment(file, attachments.length + 1));
      status.textContent = `已添加${Math.min(imageFiles.length, remaining)}张截图，点击可放大，保存批注后生效`;
      renderAttachments(kind);
    } catch (error) {
      status.textContent = error.message;
      renderAttachments(kind);
    }
  }

  function pageLabelForSummary(pageId, pageNotes = []) {
    const capturedLabel = pageNotes.map((note) => safeJson(note.targetSnapshot)?.interfaceManifest?.pageLabel)
      .find((label) => String(label || "").trim());
    const baseId = String(pageId || "").split(":tabs:")[0];
    const knownPages = {
      home: "首页",
      "mine:medical": "健康档案",
      "mine:metrics": "健康指标",
      "mine:assessment": "健康评估",
      "mine:orders": "我的订单",
      "service-list": "健康服务",
      schedule: "日程",
      "service-purchase-success": "购买成功"
    };
    let label = capturedLabel || knownPages[baseId];
    if (!label && baseId.startsWith("mine:orders:")) label = "我的订单";
    if (!label && baseId.startsWith("service-order-detail:")) label = "订单详情";
    if (!label && baseId.startsWith("service-bound-detail:")) label = "服务详情";
    if (!label && baseId.startsWith("service-detail:")) label = "服务详情";
    if (!label && baseId.startsWith("sub:")) label = "业务详情";
    if (!label && baseId.startsWith("view:")) label = "功能界面";
    label ||= "其他界面";

    const tabText = String(pageId || "").split(":tabs:")[1]?.split(":popup:")[0] || "";
    const activeTabs = tabText.split("|").map((item) => item.split("=").slice(1).join("=")).filter(Boolean);
    if (activeTabs.length) label += " · " + activeTabs.join(" / ");
    if (String(pageId || "").includes(":popup:")) label += " · 弹窗";
    return label;
  }

  function summaryDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  }

  function renderSummary() {
    const grouped = new Map();
    summaryNotes.forEach((note) => {
      const pageId = String(note.pageId || "其他界面");
      if (!grouped.has(pageId)) grouped.set(pageId, []);
      grouped.get(pageId).push(note);
    });
    summaryCount.textContent = String(summaryNotes.length);
    summaryPageCount.textContent = `${grouped.size} 个界面`;
    summaryList.replaceChildren();
    if (!summaryNotes.length) {
      const empty = document.createElement("p");
      empty.className = "ui-note-summary-state";
      empty.textContent = "还没有界面批注";
      summaryList.appendChild(empty);
      return;
    }

    [...grouped.entries()].sort(([pageA, notesA], [pageB, notesB]) => {
      if (pageA === currentPageId) return -1;
      if (pageB === currentPageId) return 1;
      return pageLabelForSummary(pageA, notesA).localeCompare(pageLabelForSummary(pageB, notesB), "zh-CN");
    }).forEach(([pageId, pageNotes]) => {
      const group = document.createElement("section");
      group.className = "ui-note-summary-group";
      const header = document.createElement("header");
      const title = document.createElement("div");
      title.textContent = pageLabelForSummary(pageId, pageNotes);
      if (pageId === currentPageId) {
        const currentTag = document.createElement("b");
        currentTag.className = "ui-note-current-tag";
        currentTag.textContent = "当前界面";
        title.appendChild(currentTag);
      }
      const count = document.createElement("span");
      count.textContent = `${pageNotes.length} 条`;
      header.append(title, count);
      group.appendChild(header);
      pageNotes.sort((a, b) => Number(a.noteNumber) - Number(b.noteNumber)).forEach((note) => {
        const card = document.createElement("article");
        card.className = "ui-note-summary-card";
        const number = document.createElement("span");
        number.className = "ui-note-summary-number";
        number.textContent = String(note.noteNumber);
        const body = document.createElement("div");
        const cardTitle = document.createElement("h3");
        cardTitle.textContent = note.title || "未命名批注";
        const content = document.createElement("p");
        content.textContent = note.content || "暂无补充说明";
        const footer = document.createElement("footer");
        footer.textContent = [note.updatedBy || note.createdBy, summaryDate(note.updatedAt || note.createdAt)].filter(Boolean).join(" · ");
        body.append(cardTitle, content);
        const noteSnapshot = safeJson(note.targetSnapshot, {}) || {};
        const interactionText = String(noteSnapshot.interactionContent || "").trim();
        if (interactionText) {
          const interaction = document.createElement("p");
          interaction.textContent = `交互逻辑：${interactionText}`;
          body.appendChild(interaction);
        }
        const attachments = [...(Array.isArray(noteSnapshot.attachments) ? noteSnapshot.attachments : []),
          ...(Array.isArray(noteSnapshot.interactionAttachments) ? noteSnapshot.interactionAttachments : [])];
        if (Array.isArray(attachments) && attachments.length) {
          const previews = document.createElement("div");
          previews.className = "ui-note-summary-attachments";
          attachments.slice(0, 3).forEach((attachment) => {
            if (!String(attachment?.dataUrl || "").startsWith("data:image/")) return;
            const image = document.createElement("img");
            image.src = attachment.dataUrl;
            image.alt = attachment.name || "批注截图";
            image.addEventListener("click", () => openImageViewer(attachment));
            previews.appendChild(image);
          });
          if (previews.childElementCount) body.appendChild(previews);
        }
        if (footer.textContent) body.appendChild(footer);
        card.append(number, body);
        group.appendChild(card);
      });
      summaryList.appendChild(group);
    });
  }

  function closeSummary() {
    summary.classList.remove("active");
    summaryButton.classList.remove("active");
  }

  async function openSummary() {
    if (drawer.classList.contains("active")) {
      closeDrawer();
      if (drawer.classList.contains("active")) return;
    }
    summary.classList.add("active");
    summaryButton.classList.add("active");
    summaryList.replaceChildren();
    const loading = document.createElement("p");
    loading.className = "ui-note-summary-state";
    loading.textContent = "正在归集全部批注…";
    summaryList.appendChild(loading);
    syncOverlayBounds();
    try {
      summaryNotes = await fetchAllNotes();
      renderSummary();
    } catch (error) {
      summaryList.replaceChildren();
      const failed = document.createElement("p");
      failed.className = "ui-note-summary-state";
      failed.textContent = error.message || "批注汇总加载失败，请稍后重试";
      summaryList.appendChild(failed);
    }
  }

  function openDrawer(note = null) {
    closeSummary();
    if (note) prepareStablePointPosition(note);
    const readonly = isReadonlyMode();
    editingNoteId = note?.noteId || "";
    editingPageId = currentPageId;
    drawerTitle.textContent = readonly ? "查看批注" : (note ? "编辑批注" : "添加批注");
    numberField.hidden = false;
    const suggestedNumber = notes.reduce((max, item) => Math.max(max, Number(item.noteNumber) || 0), 0) + 1;
    numberInput.value = String(note?.noteNumber || suggestedNumber);
    titleInput.value = note?.title || "";
    contentInput.value = note?.content || "";
    currentTargetContext = safeJson(note?.targetSnapshot) || pendingTargetContext || captureTargetContext(activeAnnotationFrame());
    interactionInput.value = String(currentTargetContext?.interactionContent || "");
    currentAttachments = Array.isArray(currentTargetContext?.attachments)
      ? currentTargetContext.attachments.filter((item) => String(item?.dataUrl || "").startsWith("data:image/")).slice(0, 3)
      : [];
    currentInteractionAttachments = Array.isArray(currentTargetContext?.interactionAttachments)
      ? currentTargetContext.interactionAttachments.filter((item) => String(item?.dataUrl || "").startsWith("data:image/")).slice(0, 3)
      : [];
    renderAttachments();
    renderAttachments("interaction");
    attachmentStatus.textContent = currentAttachments.length
      ? `已保存${currentAttachments.length}张截图，可继续粘贴或删除`
      : "支持在逻辑补充中直接按 Ctrl+V 粘贴截图";
    interactionAttachmentStatus.textContent = currentInteractionAttachments.length
      ? `已保存${currentInteractionAttachments.length}张截图，可点击放大查看`
      : "支持在交互逻辑补充中直接按 Ctrl+V 粘贴截图";
    currentTargetContext.annotationSurfaceHeight = note?._positionBasisHeight || pendingPosition?.basisHeight || annotationSurfaceHeight();
    currentManifest = safeJson(currentTargetContext?.interfaceManifest) || buildInterfaceManifest();
    currentInference = safeJson(note?.featureInference) || inferFeature(titleInput.value);
    aiStatus.textContent = "输入序号后回车可自动续号，AI只追加不覆盖";
    interactionAiStatus.textContent = "输入序号后回车可自动续号，AI只追加不覆盖";
    editorError.textContent = "";
    [numberInput, titleInput, contentInput, interactionInput].forEach((input) => { input.readOnly = readonly; });
    deleteButton.hidden = !note || readonly;
    saveButton.hidden = readonly;
    cancelButton.textContent = readonly ? "关闭" : "取消";
    aiAppendButton.hidden = readonly;
    interactionAiAppendButton.hidden = readonly;
    refreshInference();
    drawerInitialSignature = noteSignature();
    drawer.classList.add("active");
    syncOverlayBounds();
    window.setTimeout(() => {
      resizeContentInput();
      resizeContentInput(interactionInput);
      titleInput.focus();
    }, 80);
  }

  function closeDrawer(force = false) {
    if (!force && drawer.classList.contains("active") && drawerInitialSignature && noteSignature() !== drawerInitialSignature
      && !window.confirm("当前批注还没有保存，确定关闭吗？")) return;
    drawer.classList.remove("active");
    closeImageViewer();
    editingNoteId = "";
    editingPageId = "";
    pendingPosition = null;
    pendingTargetContext = null;
    currentTargetContext = null;
    currentManifest = null;
    currentInference = null;
    currentAttachments = [];
    currentInteractionAttachments = [];
    drawerInitialSignature = "";
    editorError.textContent = "";
  }

  async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const interactionContent = interactionInput.value.trim();
    if (!title) { editorError.textContent = "请填写批注标题"; titleInput.focus(); return; }
    if (editingPageId !== currentPageId) { editorError.textContent = "页面已切换，请在当前页面重新添加批注"; return; }
    const noteNumber = Number(numberInput.value);
    if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) {
      editorError.textContent = "批注编号请输入1至9999之间的整数"; numberInput.focus(); return;
    }
    currentManifest = buildInterfaceManifest();
    currentInference = inferFeature(title);
    const existingNote = notes.find((note) => note.noteId === editingNoteId);
    const basisHeight = existingNote?._positionBasisHeight || pendingPosition?.basisHeight
      || currentTargetContext?.annotationSurfaceHeight || annotationSurfaceHeight();
    const targetSnapshot = { ...(currentTargetContext || {}), attachments: currentAttachments,
      interactionContent, interactionAttachments: currentInteractionAttachments,
      annotationSurfaceHeight: basisHeight, interfaceManifest: currentManifest };
    const commonPayload = { noteNumber, title, content, targetKey: currentTargetContext?.targetKey || "page", targetSnapshot,
      featureInference: currentInference, updatedBy: ACTOR };
    saveButton.disabled = true;
    deleteButton.disabled = true;
    try {
      if (editingNoteId) {
        const payload = await apiRequest(API_PATH + "/" + editingNoteId, { method: "PATCH", body: JSON.stringify({ ...commonPayload, x: existingNote?.x, y: existingNote?.y }) });
        payload.note._pixelY = existingNote?._pixelY;
        payload.note._positionBasisHeight = basisHeight;
        notes = notes.map((note) => note.noteId === editingNoteId ? payload.note : note).sort((a, b) => a.noteNumber - b.noteNumber);
      } else {
        const payload = await apiRequest(API_PATH, { method: "POST", body: JSON.stringify({ ...commonPayload, projectId: PROJECT_ID,
          pageId: currentPageId, x: pendingPosition?.x ?? 0.5, y: pendingPosition?.y ?? 0.5, createdBy: ACTOR }) });
        payload.note._pixelY = pendingPosition?.pixelY ?? (Number(payload.note.y) * basisHeight);
        payload.note._positionBasisHeight = basisHeight;
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
      const targetSnapshot = { ...(safeJson(note.targetSnapshot, {}) || {}), annotationSurfaceHeight: note._positionBasisHeight || annotationSurfaceHeight() };
      const payload = await apiRequest(API_PATH + "/" + note.noteId, {
        method: "PATCH",
        body: JSON.stringify({ x: note.x, y: note.y, targetSnapshot, updatedBy: ACTOR })
      });
      payload.note._pixelY = note._pixelY;
      payload.note._positionBasisHeight = note._positionBasisHeight;
      notes = notes.map((item) => item.noteId === note.noteId ? payload.note : item);
      renderNotes();
    } catch (error) {
      toolbar.dataset.error = "true";
      toolbar.title = error.message;
      await loadNotes(true);
    }
  }

  function updateToolbar() {
    toolbar.dataset.pageId = currentPageId;
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
    if (toolHidden) { closeDrawer(true); closeSummary(); }
    try { window.localStorage?.setItem(TOOL_HIDDEN_KEY, toolHidden ? "1" : "0"); } catch { /* ignore */ }
    updateToolbar();
    syncOverlayBounds();
  }

  function bindPointEvents(point, note) {
    let startX = 0;
    let startY = 0;
    let moved = false;

    point.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || isReadonlyMode()) return;
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
      note._pixelY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      note._positionBasisHeight = Math.max(1, rect.height);
      note.y = Math.max(0, Math.min(1, note._pixelY / note._positionBasisHeight));
      point.style.left = note.x * 100 + "%";
      point.style.top = note._pixelY + "px";
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
      prepareStablePointPosition(note);
      const point = document.createElement("button");
      point.type = "button"; point.className = "ui-note-point"; point.dataset.noteId = note.noteId; point.dataset.uiNoteUi = "";
      point.textContent = String(note.noteNumber); point.title = note.title + (note.content ? "：" + note.content : "");
      point.setAttribute("aria-label", "批注" + note.noteNumber + "：" + note.title);
      point.style.left = Math.max(0, Math.min(1, Number(note.x))) * 100 + "%";
      point.style.top = note._pixelY + "px";
      bindPointEvents(point, note); layer.appendChild(point);
    });
    updateToolbar();
  }

  async function loadNotes(silent = false) {
    const pageId = currentPageId; const sequence = ++loadSequence;
    try {
      const nextNotes = await fetchPageNotes(pageId);
      if (sequence !== loadSequence || pageId !== currentPageId) return;
      const existingById = new Map(notes.map((note) => [note.noteId, note]));
      nextNotes.forEach((note) => {
        const existing = existingById.get(note.noteId);
        if (!existing || !Number.isFinite(existing._pixelY)) return;
        note._pixelY = existing._pixelY;
        note._positionBasisHeight = existing._positionBasisHeight;
      });
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

  addButton.addEventListener("click", () => { if (isReadonlyMode()) return; const next = !addMode; if (next) notesVisible = true; setAddMode(next); });
  toggleButton.addEventListener("click", () => { notesVisible = !notesVisible; setAddMode(false); updateToolbar(); });
  summaryButton.addEventListener("click", () => {
    if (summary.classList.contains("active")) closeSummary();
    else openSummary();
  });
  collapseButton.addEventListener("click", () => setToolHidden(true));
  launcherButton.addEventListener("click", () => {
    setToolHidden(false);
    openSummary();
  });
  document.addEventListener("click", (event) => {
    if (!addMode || event.target.closest("[data-ui-note-ui]")) return;
    const rect = layer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
    event.preventDefault(); event.stopPropagation();
    pendingPosition = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      pixelY: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
      basisHeight: Math.max(1, rect.height)
    };
    pendingTargetContext = captureTargetContext(event.target);
    setAddMode(false); openDrawer();
  }, true);
  form.addEventListener("submit", (event) => { event.preventDefault(); saveNote(); });
  titleInput.addEventListener("input", refreshInference);
  function bindRichEditor(input, status, button, kind) {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
      const cursor = input.selectionStart;
      if (cursor !== input.selectionEnd) return;
      const lineStart = input.value.lastIndexOf("\n", cursor - 1) + 1;
      const currentLine = input.value.slice(lineStart, cursor);
      const match = currentLine.match(/^(\s*)(\d+)\s*([、.)．])\s*(.*)$/);
      if (!match) return;
      event.preventDefault();
      let insertion = "";
      if (!match[4].trim() && lineStart > 0) input.setRangeText("", lineStart, cursor, "end");
      else {
        insertion = `\n${match[1]}${Number(match[2]) + 1}${match[3]} `;
        input.setRangeText(insertion, cursor, cursor, "end");
      }
      resizeContentInput(input);
      status.textContent = insertion ? "已自动续写下一条序号" : "已结束自动编号";
    });
    input.addEventListener("input", () => {
      resizeContentInput(input);
      if (!button.classList.contains("loading")) status.textContent = "可继续手动修改，AI不会自动覆盖内容";
    });
    input.addEventListener("paste", (event) => {
      const imageFiles = [...(event.clipboardData?.items || [])]
        .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
        .map((item) => item.getAsFile()).filter(Boolean);
      if (!imageFiles.length) return;
      event.preventDefault();
      addScreenshotFiles(imageFiles, kind);
    });
    button.addEventListener("click", () => appendAiNote(input, status, button));
  }
  bindRichEditor(contentInput, aiStatus, aiAppendButton, "logic");
  bindRichEditor(interactionInput, interactionAiStatus, interactionAiAppendButton, "interaction");
  imageViewerClose.addEventListener("click", closeImageViewer);
  imageViewer.addEventListener("click", (event) => { if (event.target === imageViewer) closeImageViewer(); });
  deleteButton.addEventListener("click", removeNote);
  cancelButton.addEventListener("click", () => closeDrawer());
  drawerClose.addEventListener("click", () => closeDrawer());
  summaryClose.addEventListener("click", closeSummary);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!imageViewer.hidden) closeImageViewer();
    else if (drawer.classList.contains("active")) closeDrawer();
    else if (summary.classList.contains("active")) closeSummary();
  });

  function syncPageContext() {
    syncOverlayBounds();
    const nextPageId = activePageId();
    if (nextPageId === currentPageId) return;
    currentPageId = nextPageId; notesVisible = sharedReviewMode; setAddMode(false); closeDrawer(true); notes = []; renderNotes(); loadNotes();
    if (summary.classList.contains("active")) renderSummary();
  }

  window.addEventListener("resize", () => {
    syncOverlayBounds();
    if (drawer.classList.contains("active")) {
      resizeContentInput();
      resizeContentInput(interactionInput);
    }
  });
  window.addEventListener("scroll", syncOverlayBounds, true);
  currentPageId = activePageId();
  if (localMode) { toolbar.dataset.local = "true"; toolbar.title = "批注保存在当前浏览器"; }
  if (sharedReviewMode) setReadonlyMode("共享查看模式：已发布批注对所有访问者一致可见");
  syncOverlayBounds(); renderNotes();
  const initialLoad = loadNotes();
  if (sharedReviewMode) initialLoad.finally(() => openSummary());
  window.setInterval(syncPageContext, 250);
  window.setInterval(() => { if (!editingNoteId && !draggingNoteId && !drawer.classList.contains("active")) loadNotes(true); }, 5000);
})();
