// Front-end prototype: real QR, identity verification and cross-account consent require a server.
const familyShareList = document.querySelector("#familyShareList");
const familyShareCount = document.querySelector("#familyShareCount");
const familyQrCountdown = document.querySelector("#familyQrCountdown");
const familyInviteQr = document.querySelector("#familyInviteQr");
const familyQrSheet = document.querySelector("#familyInviteQrPage");
const familyQrBackdrop = document.querySelector("#familyQrBackdrop");
const familyAuthorizationEntry = document.querySelector(".archive-auth-entry");
const archiveAuthorizationGate = document.querySelector("#archiveAuthorizationGate");
const familyStorageKey = "ai-health-family-share-prototype-v1";
const dismissedAuthorizationPrompts = new Set();
let familyInviteExpiresAt = 0;
let familyQrModel = null;
let familyUnbindId = null;
let familyShareMembers = [];
let authorizationRequestPatient = null;
const demoAuthorizedPatients = new Set();

function openFamilySubPage(pageId) {
  openSubPage(pageId);
  window.scrollTo(0, 0);
}

function openFamilyQrSheet() {
  familyQrBackdrop.hidden = false;
  familyQrSheet.classList.add("active", "family-qr-sheet");
  document.body.classList.add("family-qr-sheet-open");
  familyQrSheet.scrollTop = 0;
  document.querySelector("#familyQrClose")?.focus();
}

function closeFamilyQrSheet() {
  familyQrSheet.classList.remove("active", "family-qr-sheet");
  familyQrBackdrop.hidden = true;
  document.body.classList.remove("family-qr-sheet-open");
}

try {
  const saved = JSON.parse(localStorage.getItem(familyStorageKey) || "[]");
  if (Array.isArray(saved)) familyShareMembers = saved.filter((item) => item && typeof item.name === "string" && typeof item.id === "string");
} catch (_) { /* Storage may be unavailable in the preview browser. */ }

function saveFamilyShareMembers() {
  try { localStorage.setItem(familyStorageKey, JSON.stringify(familyShareMembers)); } catch (_) { /* Keep this session usable. */ }
}

function familyShareToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function familyAuthorizationState() {
  if (currentPatient.id === "self") return "self";
  if (currentPatient.id === "li-demo" || currentPatient.id.startsWith("family-share-") || demoAuthorizedPatients.has(currentPatient.id)) return "authorized";
  if (currentPatient.id === "wang-demo") return "revoked";
  return "ungranted";
}

function updateFamilyAuthorizationEntry() {
  const state = familyAuthorizationState();
  const label = state === "self" ? "邀请" : state === "authorized" ? "已授权" : "获取授权";
  familyAuthorizationEntry.querySelector("span:last-child").textContent = label;
  familyAuthorizationEntry.setAttribute("aria-label", `${currentPatient.name}：${label}`);
  familyAuthorizationEntry.title = `${currentPatient.name}：${label}`;
  familyAuthorizationEntry.dataset.authorizationState = state;
  if (state === "self") familyAuthorizationEntry.dataset.openPage = "familySharingPage";
  else familyAuthorizationEntry.removeAttribute("data-open-page");
  const locked = state === "ungranted" || state === "revoked";
  minePage.classList.toggle("authorization-locked", locked);
  archiveAuthorizationGate.hidden = !locked || dismissedAuthorizationPrompts.has(currentPatient.id);
}

function openFamilyAuthorizationQr() {
  authorizationRequestPatient = { id: currentPatient.id, name: currentPatient.name };
  document.querySelector("#familyRequestPatientName").textContent = currentPatient.name;
  openFamilySubPage("familyRequestIntroPage");
}

document.querySelector("#familyRequestStart")?.addEventListener("click", () => {
  if (!authorizationRequestPatient) return;
  const qrPage = document.querySelector("#familyInviteQrPage");
  qrPage.classList.add("family-request-flow");
  qrPage.querySelector(".family-share-nav h1").textContent = "分享授权申请";
  qrPage.querySelector(".back-page").setAttribute("aria-label", "返回申请说明");
  document.querySelector("#familyQrTitle").textContent = "分享给家人";
  document.querySelector("#familyQrDescription").textContent = `健康档案授权申请，期待${authorizationRequestPatient.name}同意`;
  document.querySelector("#familyQrTip").textContent = "当前为前端演示。请将二维码发给用户本人，由本人确认后才会建立授权关系。";
  document.querySelector("#familyDemoScan").textContent = "体验用户查看申请并同意授权 →";
  familyInviteExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  updateFamilyQrCountdown();
  renderFamilyInviteQr();
  openFamilyQrSheet();
});

function openFamilyAuthorizationHelp() {
  const revoked = familyAuthorizationState() === "revoked";
  document.querySelector("#familyAuthorizationHelpTitle").textContent = revoked
    ? "请患者本人重新邀请授权"
    : "需要患者本人分享授权二维码";
  document.querySelector("#familyAuthorizationHelpDescription").textContent = revoked
    ? `${currentPatient.name}此前授予的权限已解除，需要重新发送邀请。`
    : `您尚未获得${currentPatient.name}的健康档案管理权限。`;
  openFamilySubPage("familyAuthorizationHelpPage");
}

document.addEventListener("click", (event) => {
  if (!event.target.closest?.(".archive-auth-entry")) return;
  const state = familyAuthorizationState();
  if (state === "self") return;
  event.preventDefault();
  event.stopPropagation();
  if (state === "authorized") {
    setProfileTab("medical");
    familyShareToast(`已获得${currentPatient.name}授权，可正常管理健康档案`);
  } else {
    openFamilyAuthorizationQr();
  }
}, true);

document.querySelector("#archiveAuthorizationGateAction")?.addEventListener("click", openFamilyAuthorizationQr);
document.querySelector("#archiveAuthorizationGateClose")?.addEventListener("click", () => {
  dismissedAuthorizationPrompts.add(currentPatient.id);
  archiveAuthorizationGate.hidden = true;
});
document.querySelector("#familyAuthorizationHelpBack")?.addEventListener("click", goBackPage);

function familyShareReturnToList() {
  subPages.forEach((page) => page.classList.remove("active"));
  minePage.classList.add("active");
  pageStack = [];
  openFamilySubPage("familySharingPage");
}

function familyShareReturnHome() {
  subPages.forEach((page) => page.classList.remove("active"));
  minePage.classList.add("active");
  pageStack = [];
  setProfileTab("medical");
  window.scrollTo(0, 0);
}

function familyShareGoToHome() {
  familyShareReturnHome();
  document.querySelector(".tab-home")?.click();
}

function makeFamilyChip(member, archive) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "member-chip";
  button.dataset.familyShareId = member.id;
  Object.assign(button.dataset, {
    name: "张女士",
    sex: "female",
    age: "32",
    ...(archive ? { archivePatientId: member.id } : { patientId: member.id }),
    state: "initial",
    meta: `32岁 · 授权共享给${member.name}`
  });
  if (archive) {
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", "false");
  }
  button.setAttribute("aria-label", `张女士的共享档案，已授权给${member.name}`);
  const avatar = document.createElement("span");
  avatar.className = "member-avatar avatar-new";
  avatar.textContent = "张";
  const name = document.createElement("strong");
  name.className = "patient-chip-name";
  name.textContent = archive ? "张*士" : "张女士·共享";
  button.append(avatar, name);
  return button;
}

function syncFamilyShareChips() {
  document.querySelectorAll("[data-family-share-id]").forEach((chip) => chip.remove());
  const archiveSwitcher = document.querySelector(".archive-member-switcher");
  familyShareMembers.forEach((member) => {
    memberSwitcher?.insertBefore(makeFamilyChip(member, false), memberSwitcher.querySelector(".member-add"));
    archiveSwitcher?.insertBefore(makeFamilyChip(member, true), archiveSwitcher.querySelector(".member-add"));
  });
}

function renderFamilyShareList() {
  familyShareList.replaceChildren();
  familyShareCount.textContent = `（${familyShareMembers.length}）`;
  if (!familyShareMembers.length) {
    const empty = document.createElement("p");
    empty.className = "family-share-empty";
    empty.textContent = "还没有共享的家人，邀请后可在这里管理授权。";
    familyShareList.appendChild(empty);
    return;
  }
  familyShareMembers.forEach((member) => {
    const row = document.createElement("div");
    row.className = "family-share-person";
    const avatar = document.createElement("span");
    avatar.className = "family-share-avatar";
    avatar.textContent = member.name.slice(0, 1);
    const details = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = `${member.name}　${member.relation}`;
    const date = document.createElement("small");
    date.textContent = `共享时间：${member.date}`;
    details.append(name, date);
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "family-revoke-trigger";
    cancel.dataset.familyUnbindId = member.id;
    cancel.setAttribute("aria-label", `取消对${member.name}的授权`);
    cancel.textContent = "取消授权";
    row.append(avatar, details, cancel);
    familyShareList.appendChild(row);
  });
}

function updateFamilyQrCountdown() {
  if (!familyQrCountdown || !familyInviteExpiresAt) return;
  const seconds = Math.max(0, Math.ceil((familyInviteExpiresAt - Date.now()) / 1000));
  familyQrCountdown.textContent = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function familyInviteUrl() {
  // The QR uses the current origin. A 127.0.0.1 preview works only on this computer;
  // publish the page before expecting another device to open the invitation.
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("familyInviteExpires", String(familyInviteExpiresAt));
  if (authorizationRequestPatient) {
    url.searchParams.set("familyInviteMode", "request");
    url.searchParams.set("familyInvitePatient", authorizationRequestPatient.name);
    url.searchParams.set("familyInvitePatientId", authorizationRequestPatient.id);
  }
  url.hash = "family-invite-demo";
  return url.href;
}

function renderFamilyInviteQr() {
  if (!familyInviteQr || typeof qrcode !== "function") {
    familyShareToast("二维码生成失败，请刷新页面重试");
    return;
  }
  const qr = qrcode(0, "M");
  qr.addData(familyInviteUrl());
  qr.make();
  familyQrModel = qr;
  const size = qr.getModuleCount();
  const svgNamespace = "http://www.w3.org/2000/svg";
  familyInviteQr.setAttribute("viewBox", `0 0 ${size + 8} ${size + 8}`);
  familyInviteQr.replaceChildren();
  const background = document.createElementNS(svgNamespace, "rect");
  background.setAttribute("width", String(size + 8));
  background.setAttribute("height", String(size + 8));
  background.setAttribute("fill", "#fff");
  const modules = document.createElementNS(svgNamespace, "path");
  const squares = [];
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (qr.isDark(row, column)) squares.push(`M${column + 4} ${row + 4}h1v1h-1z`);
    }
  }
  modules.setAttribute("d", squares.join(""));
  modules.setAttribute("fill", "#172541");
  familyInviteQr.append(background, modules);
}

const familyInviteConsent = document.querySelector("#familyInviteConsent");
const familyInviteStart = document.querySelector("#familyInviteStart");
familyInviteConsent?.addEventListener("change", () => {
  familyInviteStart.disabled = !familyInviteConsent.checked;
});
familyInviteStart?.addEventListener("click", () => {
  if (!familyInviteConsent.checked) return;
  authorizationRequestPatient = null;
  const qrPage = document.querySelector("#familyInviteQrPage");
  qrPage.classList.remove("family-request-flow");
  qrPage.querySelector(".family-share-nav h1").textContent = "邀请家人";
  document.querySelector("#familyInviteQrPage .back-page").setAttribute("aria-label", "返回家人共享");
  document.querySelector("#familyQrTitle").textContent = "分享给家人";
  document.querySelector("#familyQrDescription").innerHTML = "家人扫码后，可以申请管理<br>您的健康档案";
  document.querySelector("#familyQrTip").textContent = "当前为前端流程演示，二维码不连接真实账号。家人接受邀请后即可建立共享关系。";
  document.querySelector("#familyDemoScan").textContent = "体验家属扫码后的流程 →";
  familyInviteExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  updateFamilyQrCountdown();
  renderFamilyInviteQr();
  openFamilyQrSheet();
});
window.setInterval(updateFamilyQrCountdown, 1000);

function startFamilyAcceptDemo() {
  if (familyInviteExpiresAt && Date.now() >= familyInviteExpiresAt) {
    familyShareToast("邀请已过期，请重新生成");
    return;
  }
  closeFamilyQrSheet();
  openFamilySubPage(authorizationRequestPatient ? "familyRequestConsentPage" : "familyAcceptPage");
}

document.querySelector("#familyRequestReject")?.addEventListener("click", () => {
  goBackPage();
  familyShareToast("患者暂未同意授权");
});
const familyRequestConsent = document.querySelector("#familyRequestConsent");
const familyRequestApprove = document.querySelector("#familyRequestApprove");
familyRequestConsent?.addEventListener("change", () => {
  familyRequestApprove.disabled = !familyRequestConsent.checked;
});
familyRequestApprove?.addEventListener("click", () => {
  if (!authorizationRequestPatient || !familyRequestConsent.checked) return;
  openFamilySubPage("familyFaceIntroPage");
});
let familyFaceStream = null;
let familyFaceTimers = [];
let familyFaceDemoOutcome = "success";
function stopFamilyFaceCamera() {
  familyFaceStream?.getTracks().forEach((track) => track.stop());
  familyFaceStream = null;
  const video = document.querySelector("#familyFaceVideo");
  video.srcObject = null;
  video.classList.remove("ready");
  document.querySelector("#familyFacePlaceholder").hidden = false;
}
function cancelFamilyFaceCheck() {
  familyFaceTimers.forEach(window.clearTimeout);
  familyFaceTimers = [];
}
async function openFamilyFaceCapture() {
  cancelFamilyFaceCheck();
  openFamilySubPage("familyFaceCapturePage");
  const hint = document.querySelector("#familyFaceCameraHint");
  hint.textContent = "摄像头预览仅在本机显示；本演示不采集或上传照片";
  if (!navigator.mediaDevices?.getUserMedia) {
    hint.textContent = "当前环境无法打开摄像头，可继续体验模拟核验流程";
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    if (!document.querySelector("#familyFaceCapturePage").classList.contains("active")) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    familyFaceStream = stream;
    const video = document.querySelector("#familyFaceVideo");
    video.srcObject = stream;
    video.classList.add("ready");
    document.querySelector("#familyFacePlaceholder").hidden = true;
  } catch (_) {
    hint.textContent = "未获得摄像头权限，可继续体验模拟核验流程";
  }
}
function finishFamilyFaceDemo() {
  if (!authorizationRequestPatient || !document.querySelector("#familyFaceCheckingPage").classList.contains("active")) return;
  if (familyFaceDemoOutcome === "authorization-failure") {
    openFamilySubPage("familyRequestFailurePage");
    pageStack = ["minePage"];
    cancelFamilyFaceCheck();
    return;
  }
  demoAuthorizedPatients.add(authorizationRequestPatient.id);
  document.querySelector("#familyRequestSuccessName").textContent = authorizationRequestPatient.name;
  authorizationRequestPatient = null;
  updateFamilyAuthorizationEntry();
  openFamilySubPage("familyRequestSuccessPage");
  pageStack = ["minePage"];
  cancelFamilyFaceCheck();
}
document.querySelector("#familyFaceStart")?.addEventListener("click", openFamilyFaceCapture);
function startFamilyFaceDemo(outcome) {
  if (!authorizationRequestPatient) return;
  familyFaceDemoOutcome = outcome;
  stopFamilyFaceCamera();
  document.querySelector("#familyFaceCompareStep").classList.remove("complete");
  document.querySelector("#familyFaceFinishStep").classList.remove("complete");
  openFamilySubPage("familyFaceCheckingPage");
  familyFaceTimers = [
    window.setTimeout(() => document.querySelector("#familyFaceCompareStep").classList.add("complete"), 1000),
    window.setTimeout(() => document.querySelector("#familyFaceFinishStep").classList.add("complete"), 2200),
    window.setTimeout(finishFamilyFaceDemo, 3600)
  ];
}
document.querySelector("#familyFaceVerify")?.addEventListener("click", () => startFamilyFaceDemo("success"));
document.querySelector("#familyFaceTestAuthFailure")?.addEventListener("click", () => startFamilyFaceDemo("authorization-failure"));
document.querySelector("#familyFaceTestFailure")?.addEventListener("click", () => {
  stopFamilyFaceCamera();
  openFamilySubPage("familyFaceFailedPage");
});
document.querySelector("#familyFaceRetry")?.addEventListener("click", openFamilyFaceCapture);
document.querySelector("#familyFaceFailedBack")?.addEventListener("click", () => {
  cancelFamilyFaceCheck();
  stopFamilyFaceCamera();
  openFamilySubPage("familyRequestConsentPage");
});
document.querySelector("#familyRequestFailureRetry")?.addEventListener("click", () => {
  if (!authorizationRequestPatient) return;
  openFamilySubPage("familyRequestConsentPage");
  pageStack = ["minePage"];
});
document.querySelector("#familyRequestFailureHome")?.addEventListener("click", () => {
  authorizationRequestPatient = null;
  familyShareReturnHome();
});
document.addEventListener("click", (event) => {
  const back = event.target.closest(".family-face-page .back-page, .family-face-capture-page .back-page");
  if (back) {
    cancelFamilyFaceCheck();
    stopFamilyFaceCamera();
  }
});
document.querySelector("#familyRequestView")?.addEventListener("click", familyShareReturnHome);
document.querySelector("#familyRequestHome")?.addEventListener("click", familyShareGoToHome);

document.querySelector("#familyDemoScan")?.addEventListener("click", startFamilyAcceptDemo);
document.querySelector("#familyShareWechat")?.addEventListener("click", async () => {
  if (!familyInviteExpiresAt || Date.now() >= familyInviteExpiresAt) {
    familyShareToast("二维码已过期，请重新邀请");
    return;
  }
  const inviteUrl = familyInviteUrl();
  try {
    if (navigator.share) {
      await navigator.share({ title: "健康档案邀请（演示）", text: "体验家人共享健康档案流程", url: inviteUrl });
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteUrl);
      familyShareToast("演示邀请链接已复制");
    } else {
      startFamilyAcceptDemo();
    }
  } catch (error) {
    if (error?.name !== "AbortError") familyShareToast("分享未完成，可体验下方演示流程");
  }
});
async function copyFamilyInviteLink(message) {
  if (!familyInviteExpiresAt || Date.now() >= familyInviteExpiresAt) {
    familyShareToast("二维码已过期，请重新生成");
    return;
  }
  try {
    await navigator.clipboard.writeText(familyInviteUrl());
    familyShareToast(message);
  } catch (_) {
    familyShareToast("复制失败，请使用保存本地或微信分享");
  }
}
document.querySelector("#familyCopyInviteLink")?.addEventListener("click", () => copyFamilyInviteLink("分享链接已复制"));
document.querySelector("#familyShareCancel")?.addEventListener("click", closeFamilyQrSheet);
document.querySelector("#familyQrClose")?.addEventListener("click", closeFamilyQrSheet);
familyQrBackdrop?.addEventListener("click", closeFamilyQrSheet);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && familyQrSheet.classList.contains("family-qr-sheet")) closeFamilyQrSheet();
});
document.querySelector("#familySaveQr")?.addEventListener("click", () => {
  if (!familyInviteExpiresAt || Date.now() >= familyInviteExpiresAt) {
    familyShareToast("二维码已过期，请重新邀请");
    return;
  }
  if (!familyQrModel) renderFamilyInviteQr();
  if (!familyQrModel) return;
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 510;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 400, 510);
  context.fillStyle = "#122e84";
  context.font = "bold 21px sans-serif";
  context.textAlign = "center";
  context.fillText(authorizationRequestPatient ? "健康档案授权申请" : "家人共享邀请", 200, 44);
  const size = familyQrModel.getModuleCount();
  const moduleSize = Math.floor(360 / (size + 8));
  const left = Math.floor((400 - (size + 8) * moduleSize) / 2);
  const top = 70;
  context.fillStyle = "#172541";
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (familyQrModel.isDark(row, column)) {
        context.fillRect(left + (column + 4) * moduleSize, top + (row + 4) * moduleSize, moduleSize, moduleSize);
      }
    }
  }
  context.fillStyle = "#8293ae";
  context.font = "14px sans-serif";
  context.fillText("扫码可打开邀请页面 · 当前为前端演示", 200, 475);
  const link = document.createElement("a");
  link.download = authorizationRequestPatient ? "健康档案授权申请二维码.png" : "家人共享邀请二维码.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  familyShareToast("二维码图片已保存");
});
document.querySelector("#familyDeclineInvite")?.addEventListener("click", () => {
  familyShareReturnToList();
  familyShareToast("已暂不接受邀请");
});

document.querySelector("#familyAcceptInvite")?.addEventListener("click", () => {
  // Front-end demo: a real account would supply the invitee identity automatically.
  const member = {
    id: `family-share-${Date.now()}`,
    name: "张小明",
    relation: "家人",
    date: new Date().toLocaleDateString("zh-CN")
  };
  familyShareMembers.push(member);
  saveFamilyShareMembers();
  syncFamilyShareChips();
  renderFamilyShareList();
  document.querySelector("#familySuccessName").textContent = member.name;
  openFamilySubPage("familySuccessPage");
  pageStack = ["familySharingPage"];
});

document.querySelector("#familyViewArchive")?.addEventListener("click", () => {
  const member = familyShareMembers[familyShareMembers.length - 1];
  familyShareReturnHome();
  const chip = document.querySelector(`.archive-member-switcher [data-family-share-id="${member?.id || ""}"]`);
  if (chip) switchArchivePatient(chip);
});
document.querySelector("#familyReturnHome")?.addEventListener("click", familyShareGoToHome);

familyShareList?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-family-unbind-id]");
  if (!trigger) return;
  familyUnbindId = trigger.dataset.familyUnbindId;
  const member = familyShareMembers.find((item) => item.id === familyUnbindId);
  if (!member) return;
  document.querySelector("#familyRevokeOverlay").hidden = false;
  document.querySelector("#familyRevokeConfirm")?.focus();
});
function closeFamilyRevokeDialog() {
  document.querySelector("#familyRevokeOverlay").hidden = true;
  familyUnbindId = null;
}
document.querySelector("#familyRevokeCancel")?.addEventListener("click", closeFamilyRevokeDialog);
document.querySelector("#familyRevokeOverlay")?.addEventListener("click", (event) => {
  if (event.target.id === "familyRevokeOverlay") closeFamilyRevokeDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !document.querySelector("#familyRevokeOverlay").hidden) closeFamilyRevokeDialog();
});
document.querySelector("#familyRevokeConfirm")?.addEventListener("click", () => {
  if (!familyUnbindId) return;
  familyShareMembers = familyShareMembers.filter((member) => member.id !== familyUnbindId);
  if (currentPatient.id === familyUnbindId) {
    const selfChip = document.querySelector('.archive-member-switcher [data-archive-patient-id="self"]');
    if (selfChip) switchArchivePatient(selfChip);
  }
  closeFamilyRevokeDialog();
  saveFamilyShareMembers();
  syncFamilyShareChips();
  renderFamilyShareList();
  familyShareToast("已取消授权");
});
syncFamilyShareChips();
renderFamilyShareList();
updateFamilyAuthorizationEntry();
if (window.location.hash === "#family-invite-demo") {
  const inviteParams = new URL(window.location.href).searchParams;
  const expiresAt = Number(inviteParams.get("familyInviteExpires"));
  if (inviteParams.get("familyInviteMode") === "request") {
    authorizationRequestPatient = {
      id: inviteParams.get("familyInvitePatientId") || "requested-patient",
      name: inviteParams.get("familyInvitePatient") || "患者"
    };
    document.querySelector("#familyRequestPatientName").textContent = authorizationRequestPatient.name;
  }
  window.history.replaceState(null, "", window.location.pathname);
  if (Number.isFinite(expiresAt) && expiresAt > Date.now()) {
    familyInviteExpiresAt = expiresAt;
    openFamilySubPage(authorizationRequestPatient ? "familyRequestConsentPage" : "familyAcceptPage");
  } else {
    familyShareToast("邀请二维码已过期，请联系家人重新发送");
  }
}
