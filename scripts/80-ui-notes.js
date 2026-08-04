(() => {
  const PROJECT_ID = "ai-health-management";
  const ACTOR = "在线访客";
  const API_PATH = "/api/ui-notes";
  const LOCAL_STORE_KEY = `ui-notes:${PROJECT_ID}`;
  const toolbar = document.querySelector("#uiNoteToolbar");
  const addButton = document.querySelector("#uiNoteAdd");
  const toggleButton = document.querySelector("#uiNoteToggle");
  const countBadge = document.querySelector("#uiNoteCount");
  const layer = document.querySelector("#uiNoteLayer");
  const editorMask = document.querySelector("#uiNoteEditorMask");
  const editor = document.querySelector("#uiNoteEditor");
  const editorTitle = document.querySelector("#uiNoteEditorHeading");
  const editorClose = document.querySelector("#uiNoteEditorClose");
  const form = document.querySelector("#uiNoteForm");
  const numberField = document.querySelector("#uiNoteNumberField");
  const numberInput = document.querySelector("#uiNoteNumber");
  const titleInput = document.querySelector("#uiNoteTitle");
  const contentInput = document.querySelector("#uiNoteContent");
  const editorError = document.querySelector("#uiNoteEditorError");
  const deleteButton = document.querySelector("#uiNoteDelete");
  const cancelButton = document.querySelector("#uiNoteCancel");
  const saveButton = document.querySelector("#uiNoteSave");
  const homePage = document.querySelector(".home-page");

  if (!toolbar || !layer || !editor || !homePage) return;
  if (layer.parentElement !== homePage) homePage.appendChild(layer);

  let currentPageId = "";
  let editingPageId = "";
  let notes = [];
  let notesVisible = false;
  let addMode = false;
  let pendingPosition = null;
  let editingNoteId = "";
  let loadSequence = 0;
  let draggingNoteId = "";
  let noteSurface = null;
  let localMode = window.location.protocol === "file:";

  function readLocalNotes() {
    try {
      const stored = JSON.parse(window.localStorage?.getItem(LOCAL_STORE_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
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
      const query = new URL(url, window.location.href).searchParams;
      const pageId = query.get("pageId") || "";
      return { notes: storedNotes.filter((note) => note.projectId === PROJECT_ID && note.pageId === pageId) };
    }

    if (method === "POST") {
      const now = new Date().toISOString();
      const note = {
        ...body,
        noteId: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        updatedAt: now
      };
      writeLocalNotes([...storedNotes, note]);
      return { note };
    }

    const existingIndex = storedNotes.findIndex((note) => note.noteId === noteId);
    if (existingIndex < 0) throw new Error("未找到这条备注，请刷新后重试");

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

    throw new Error("当前备注操作不受支持");
  }

  function activeBaseFrame() {
    return document.querySelector(".sub-page.active")
      || document.querySelector("#serviceDetailPage.active")
      || document.querySelector("#servicePurchaseSuccessPage.active")
      || document.querySelector("#servicePage.active")
      || document.querySelector("#planPage.active")
      || document.querySelector("#minePage.active")
      || document.querySelector(".app-view.active")
      || homePage;
  }

  function activeOverlayFrame() {
    const mask = document.querySelector("#sheetMask.active");
    if (!mask) return null;
    const candidates = [...document.querySelectorAll(".active")].filter((element) => {
      if (element === mask || element.closest("[data-ui-note-ui]")) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return /fixed|absolute/.test(style.position)
        && style.display !== "none"
        && style.visibility !== "hidden"
        && Number(style.opacity || 1) > 0
        && rect.width >= 160
        && rect.height >= 100;
    });
    return candidates.sort((a, b) => {
      const zDelta = (Number.parseInt(getComputedStyle(a).zIndex, 10) || 0)
        - (Number.parseInt(getComputedStyle(b).zIndex, 10) || 0);
      if (zDelta) return zDelta;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    }).at(-1) || null;
  }

  function activeAnnotationFrame() {
    return activeOverlayFrame() || activeBaseFrame();
  }

  function activeAnnotationSurface() {
    const frame = activeAnnotationFrame();
    if (frame === homePage) return homePage;
    const candidates = [frame, ...frame.querySelectorAll("*")];
    return candidates.find((element) => {
      const overflowY = getComputedStyle(element).overflowY;
      return element.offsetParent !== null
        && element.clientHeight >= Math.min(240, frame.clientHeight * 0.5)
        && element.clientWidth >= frame.clientWidth * 0.8
        && /auto|scroll/.test(overflowY)
        && element.scrollHeight > element.clientHeight + 4;
    }) || frame;
  }

  function basePageId() {
    const activeSubPage = document.querySelector(".sub-page.active");
    if (activeSubPage) return "sub:" + activeSubPage.id;

    const serviceDetail = document.querySelector("#serviceDetailPage.active");
    if (serviceDetail) {
      const title = document.querySelector("#detailServiceTitle")?.textContent.trim() || "default";
      return "service-detail:" + title;
    }

    if (document.querySelector("#servicePurchaseSuccessPage.active")) return "service-purchase-success";
    if (document.querySelector("#servicePage.active")) return "service-list";
    if (document.querySelector("#planPage.active")) return "schedule";

    if (document.querySelector("#minePage.active")) {
      const profileTab = document.querySelector("[data-profile-tab].active")?.dataset.profileTab || "medical";
      const orderTab = profileTab === "orders"
        ? document.querySelector("[data-order-tab].active")?.dataset.orderTab || "all"
        : "";
      return "mine:" + profileTab + (orderTab ? ":" + orderTab : "");
    }

    const activeView = document.querySelector(".app-view.active");
    if (activeView?.id) return "view:" + activeView.id;
    return "home";
  }

  function activePageId() {
    const baseId = basePageId();
    const overlay = activeOverlayFrame();
    if (!overlay) return baseId;
    const overlayId = overlay.id
      || overlay.getAttribute("aria-label")
      || [...overlay.classList].filter((name) => name !== "active").join(".")
      || overlay.tagName.toLowerCase();
    return baseId + ":popup:" + overlayId;
  }

  function syncOverlayBounds() {
    const surface = activeAnnotationSurface();
    const frame = activeAnnotationFrame();
    if (noteSurface !== surface) {
      noteSurface?.classList.remove("ui-note-surface", "ui-note-surface-static");
      noteSurface = surface;
      noteSurface.classList.add("ui-note-surface");
      if (getComputedStyle(noteSurface).position === "static") {
        noteSurface.classList.add("ui-note-surface-static");
      }
      noteSurface.appendChild(layer);
    }
    const toolbarFrame = activeOverlayFrame() ? activeBaseFrame() : frame;
    const rect = toolbarFrame.getBoundingClientRect();
    const visibleTop = Math.max(0, rect.top);
    layer.style.left = "0";
    layer.style.top = "0";
    layer.style.width = "100%";
    layer.style.height = "0px";
    const stableSurfaceHeight = Math.max(surface.scrollHeight, surface.clientHeight, surface.offsetHeight);
    layer.style.height = stableSurfaceHeight + "px";
    toolbar.style.left = Math.max(8, rect.right - toolbar.offsetWidth - 8) + "px";
    toolbar.style.top = Math.max(8, visibleTop + 46) + "px";
    layer.hidden = !notesVisible;
  }

  async function apiRequest(url, options = {}) {
    if (localMode) return localNoteRequest(url, options);
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const payload = await response.json().catch(() => null);
    if (!payload) throw new Error("备注服务未启用");
    if (!response.ok) throw new Error(payload.error || "备注保存失败，请稍后重试");
    return payload;
  }

  async function fetchPageNotes(pageId) {
    const query = new URLSearchParams({ projectId: PROJECT_ID, pageId });
    if (localMode) {
      toolbar.dataset.local = "true";
      toolbar.title = "备注保存在当前浏览器";
      return localNoteRequest(API_PATH + "?" + query.toString()).notes;
    }
    try {
      const payload = await apiRequest(API_PATH + "?" + query.toString());
      if (!Array.isArray(payload.notes)) throw new Error("备注数据格式不正确");
      return payload.notes;
    } catch (apiError) {
      const seedResponse = await fetch("data/ui-notes-seed.json", { cache: "no-store" });
      if (!seedResponse.ok) throw apiError;
      const seed = await seedResponse.json();
      if (!Array.isArray(seed?.notes)) throw apiError;
      toolbar.dataset.readonly = "true";
      toolbar.title = "当前为在线只读备注";
      addButton.disabled = true;
      addButton.title = "当前链接支持查看备注，编辑请使用服务端版本";
      return seed.notes.filter((note) => note.projectId === PROJECT_ID && note.pageId === pageId);
    }
  }

  function updateToolbar() {
    countBadge.textContent = String(notes.length);
    toggleButton.textContent = notesVisible ? "隐藏备注" : "显示备注";
    addButton.textContent = addMode ? "取消打点" : "添加备注";
    addButton.classList.toggle("active", addMode);
    layer.hidden = !notesVisible;
    document.body.classList.toggle("ui-note-placement-mode", addMode);
  }

  function renderNotes() {
    layer.replaceChildren();
    notes.forEach((note) => {
      const point = document.createElement("button");
      point.type = "button";
      point.className = "ui-note-point";
      point.dataset.noteId = note.noteId;
      point.dataset.uiNoteUi = "";
      point.textContent = String(note.noteNumber);
      point.title = note.title + (note.content ? "：" + note.content : "");
      point.setAttribute("aria-label", "备注" + note.noteNumber + "：" + note.title);
      point.style.left = Math.max(0, Math.min(1, Number(note.x))) * 100 + "%";
      point.style.top = Math.max(0, Math.min(1, Number(note.y))) * 100 + "%";
      bindPointEvents(point, note);
      layer.appendChild(point);
    });
    updateToolbar();
  }

  async function loadNotes(silent = false) {
    const pageId = currentPageId;
    const sequence = ++loadSequence;
    try {
      const nextNotes = await fetchPageNotes(pageId);
      if (sequence !== loadSequence || pageId !== currentPageId) return;
      const currentSignature = JSON.stringify(notes.map((note) => [
        note.noteId, note.noteNumber, note.title, note.content, note.x, note.y, note.updatedAt
      ]));
      const nextSignature = JSON.stringify(nextNotes.map((note) => [
        note.noteId, note.noteNumber, note.title, note.content, note.x, note.y, note.updatedAt
      ]));
      if (silent && currentSignature === nextSignature) return;
      notes = nextNotes;
      renderNotes();
      toolbar.removeAttribute("data-error");
      if (!toolbar.hasAttribute("data-readonly")) toolbar.title = "";
    } catch (error) {
      if (sequence !== loadSequence) return;
      toolbar.dataset.error = "true";
      toolbar.title = error.message;
      if (!silent) {
        countBadge.textContent = "!";
        countBadge.title = error.message;
      }
    }
  }

  function setAddMode(enabled) {
    addMode = Boolean(enabled);
    updateToolbar();
  }

  function resizeContentInput() {
    const maxHeight = Math.max(120, Math.min(360, window.innerHeight * 0.38));
    contentInput.style.height = "auto";
    const nextHeight = Math.min(maxHeight, Math.max(80, contentInput.scrollHeight));
    contentInput.style.height = nextHeight + "px";
    contentInput.style.overflowY = contentInput.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  function openEditor(note = null) {
    editingNoteId = note?.noteId || "";
    editingPageId = currentPageId;
    editorTitle.textContent = note ? "编辑备注" : "添加备注";
    numberField.hidden = false;
    const suggestedNumber = notes.reduce((max, item) => Math.max(max, Number(item.noteNumber) || 0), 0) + 1;
    numberInput.value = String(note?.noteNumber || suggestedNumber);
    titleInput.value = note?.title || "";
    contentInput.value = note?.content || "";
    editorError.textContent = "";
    deleteButton.hidden = !note;
    editorMask.classList.add("active");
    editor.classList.add("active");
    window.setTimeout(() => {
      resizeContentInput();
      titleInput.focus();
    }, 30);
  }

  function closeEditor() {
    editorMask.classList.remove("active");
    editor.classList.remove("active");
    editingNoteId = "";
    editingPageId = "";
    pendingPosition = null;
    editorError.textContent = "";
  }

  async function saveNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title) {
      editorError.textContent = "请填写备注标题";
      titleInput.focus();
      return;
    }
    if (editingPageId !== currentPageId) {
      editorError.textContent = "页面已切换，请在当前页面重新添加备注";
      return;
    }
    const noteNumber = Number(numberInput.value);
    if (!Number.isInteger(noteNumber) || noteNumber < 1 || noteNumber > 9999) {
      editorError.textContent = "备注编号请输入1至9999之间的整数";
      numberInput.focus();
      return;
    }

    saveButton.disabled = true;
    deleteButton.disabled = true;
    try {
      if (editingNoteId) {
        const existing = notes.find((note) => note.noteId === editingNoteId);
        const payload = await apiRequest(API_PATH + "/" + editingNoteId, {
          method: "PATCH",
          body: JSON.stringify({
            noteNumber,
            title,
            content,
            x: existing?.x,
            y: existing?.y,
            updatedBy: ACTOR
          })
        });
        notes = notes
          .map((note) => note.noteId === editingNoteId ? payload.note : note)
          .sort((a, b) => a.noteNumber - b.noteNumber);
      } else {
        const payload = await apiRequest(API_PATH, {
          method: "POST",
          body: JSON.stringify({
            projectId: PROJECT_ID,
            pageId: currentPageId,
            noteNumber,
            title,
            content,
            x: pendingPosition?.x ?? 0.5,
            y: pendingPosition?.y ?? 0.5,
            createdBy: ACTOR
          })
        });
        notes = [...notes, payload.note].sort((a, b) => a.noteNumber - b.noteNumber);
      }
      closeEditor();
      renderNotes();
    } catch (error) {
      editorError.textContent = error.message;
    } finally {
      saveButton.disabled = false;
      deleteButton.disabled = false;
    }
  }

  async function removeNote() {
    if (!editingNoteId) return;
    deleteButton.disabled = true;
    saveButton.disabled = true;
    try {
      await apiRequest(API_PATH + "/" + editingNoteId, {
        method: "DELETE",
        headers: { "X-UI-Note-User": encodeURIComponent(ACTOR) }
      });
      notes = notes.filter((note) => note.noteId !== editingNoteId);
      closeEditor();
      renderNotes();
    } catch (error) {
      editorError.textContent = error.message;
    } finally {
      deleteButton.disabled = false;
      saveButton.disabled = false;
    }
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
      event.stopPropagation();
      if (point.dataset.dragged === "true") {
        point.dataset.dragged = "false";
        return;
      }
      openEditor(note);
    });
  }

  addButton.addEventListener("click", () => setAddMode(!addMode));
  toggleButton.addEventListener("click", () => {
    notesVisible = !notesVisible;
    setAddMode(false);
    updateToolbar();
  });

  document.addEventListener("click", (event) => {
    if (!addMode || event.target.closest("[data-ui-note-ui]")) return;
    const rect = layer.getBoundingClientRect();
    if (
      event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom
    ) return;
    event.preventDefault();
    event.stopPropagation();
    pendingPosition = {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    };
    setAddMode(false);
    openEditor();
  }, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveNote();
  });
  contentInput.addEventListener("input", resizeContentInput);
  deleteButton.addEventListener("click", removeNote);
  cancelButton.addEventListener("click", closeEditor);
  editorClose.addEventListener("click", closeEditor);
  editorMask.addEventListener("click", closeEditor);

  function syncPageContext() {
    syncOverlayBounds();
    const nextPageId = activePageId();
    if (nextPageId === currentPageId) return;
    currentPageId = nextPageId;
    setAddMode(false);
    closeEditor();
    notes = [];
    renderNotes();
    loadNotes();
  }

  window.addEventListener("resize", () => {
    syncOverlayBounds();
    if (editor.classList.contains("active")) resizeContentInput();
  });
  window.addEventListener("scroll", syncOverlayBounds, true);
  currentPageId = activePageId();
  if (localMode) {
    toolbar.dataset.local = "true";
    toolbar.title = "备注保存在当前浏览器";
  }
  syncOverlayBounds();
  renderNotes();
  loadNotes();
  window.setInterval(syncPageContext, 250);
  window.setInterval(() => {
    if (!editingNoteId && !draggingNoteId) loadNotes(true);
  }, 5000);
})();
