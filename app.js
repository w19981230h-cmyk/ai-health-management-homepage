const states = {
  empty: {
    type: "empty"
  },
  initial: {
    type: "score",
    className: "initial",
    label: "健康评分",
    score: 78,
    status: "需关注",
    statusClass: "status-warning",
    change: "较上次 ↓ 6 分",
    visual: "illustration-shield",
    middle: `<div class="focus-row"><span>BMI超重</span><span>血压偏高</span><span>血糖偏高</span></div>`,
    advice: "建议控制饮食，规律运动，3个月后重新评估，并持续关注血压变化。",
    link: "查看健康分析报告 〉"
  },
  improving: {
    type: "score",
    className: "improving",
    label: "健康评分",
    score: 86,
    status: "良好",
    statusClass: "status-good",
    change: "较上次 ↑ 8 分",
    visual: "progress",
    middle: `
      <div class="metric-grid">
        <div><span>体重</span><strong>68.5kg</strong><em>↓ 1.6kg</em></div>
        <div><span>BMI</span><strong>24.1</strong><em>正常</em></div>
        <div><span>体脂率</span><strong>27.2%</strong><em>↓ 2.1%</em></div>
      </div>
    `,
    advice: "建议保持下降趋势，继续坚持当前计划；可增加力量训练，帮助提升基础代谢。",
    link: "查看健康趋势 〉"
  },
  risk: {
    type: "score",
    className: "risk",
    label: "健康评分",
    score: 65,
    status: "重点关注",
    statusClass: "status-risk",
    change: "较上次 ↓ 5 分",
    visual: "illustration-risk",
    middle: `
      <div class="risk-list">
        <strong>主要风险</strong>
        <p><i></i>血压连续7天偏高<span>148/95 mmHg</span></p>
        <p><i></i>空腹血糖偏高<span>7.2 mmol/L</span></p>
      </div>
    `,
    advice: "建议减少盐油摄入，规律服药，今日尽快完成血压记录并安排复查。",
    link: "查看风险详情 〉"
  },
  complete: {
    type: "score",
    className: "complete",
    label: "健康评分",
    score: 92,
    status: "优秀",
    statusClass: "status-excellent",
    change: "较上次 ↑ 4 分",
    visual: "illustration-trophy",
    middle: "",
    advice: "太棒了！继续保持良好的生活习惯，巩固健康成果，保持当前节奏。",
    link: "查看健康报告 〉"
  }
};

const mainCard = document.querySelector("#mainCard");
const memberSwitcher = document.querySelector(".member-switcher");
const currentPatientName = document.querySelector("#currentPatientName");
const currentPatientMeta = document.querySelector("#currentPatientMeta");
const homeServiceSection = document.querySelector(".service-section.home-only");
const taskPanel = document.querySelector("#taskPanel");
const taskPanelMask = document.querySelector("#taskPanelMask");
const addButton = document.querySelector("#addButton");
const tabbarLinks = document.querySelectorAll(".tabbar a");
const homeOnlySections = document.querySelectorAll(".home-only");
const planPage = document.querySelector("#planPage");
const schedulePatientButton = document.querySelector("#schedulePatientButton");
const scheduleAvatar = document.querySelector("#scheduleAvatar");
const schedulePatientName = document.querySelector("#schedulePatientName");
const scheduleMonthLabel = document.querySelector("#scheduleMonthLabel");
const scheduleExpand = document.querySelector("#scheduleExpand");
const scheduleToday = document.querySelector("#scheduleToday");
const scheduleWeek = document.querySelector("#scheduleWeek");
const scheduleMonthPanel = document.querySelector("#scheduleMonthPanel");
const scheduleContent = document.querySelector("#scheduleContent");
const schedulePatientSheet = document.querySelector("#schedulePatientSheet");
const scheduleCheckinSheet = document.querySelector("#scheduleCheckinSheet");
const scheduleAddButton = document.querySelector("#scheduleAddButton");
const allPlansButton = document.querySelector("#allPlansButton");
const servicePage = document.querySelector("#servicePage");
const serviceDetailPage = document.querySelector("#serviceDetailPage");
const detailPatientAvatar = document.querySelector("#detailPatientAvatar");
const detailPatientName = document.querySelector("#detailPatientName");
const detailPatientMeta = document.querySelector("#detailPatientMeta");
const detailProductCover = document.querySelector("#detailProductCover");
const detailServiceTitle = document.querySelector("#detailServiceTitle");
const detailServiceTags = document.querySelector("#detailServiceTags");
const detailServicePrice = document.querySelector("#detailServicePrice");
const detailServiceSales = document.querySelector("#detailServiceSales");
const detailServiceDesc = document.querySelector("#detailServiceDesc");
const minePage = document.querySelector("#minePage");
const subPages = document.querySelectorAll(".sub-page");
const packageList = document.querySelector("#packageList");
const serviceFilters = document.querySelectorAll(".service-filter button");
const serviceFab = document.querySelector("#serviceFab");
const sheetMask = document.querySelector("#sheetMask");
const serviceActionSheet = document.querySelector("#serviceActionSheet");
const supportSheet = document.querySelector("#supportSheet");
const shareSheet = document.querySelector("#shareSheet");
const uploadSheet = document.querySelector("#uploadSheet");
const cameraPage = document.querySelector("#cameraPage");
const cameraBack = document.querySelector("#cameraBack");
const cameraShutter = document.querySelector("#cameraShutter");
const cameraHint = document.querySelector("#cameraPage .camera-preview > p");
const albumPicker = document.querySelector("#albumPicker");
const documentPicker = document.querySelector("#documentPicker");
const medicalReportList = document.querySelector("#medicalReportList");
const medicalCategoryTabs = document.querySelector("#medicalCategoryTabs");
const parseTaskEntry = document.querySelector("#parseTaskEntry");
const parseTaskList = document.querySelector("#parseTaskList");
const selectedFiles = document.querySelector("#selectedFiles");
const uploadMergeOption = document.querySelector("#uploadMergeOption");
const mergeReportImages = document.querySelector("#mergeReportImages");
const uploadTypeSelect = document.querySelector("#uploadTypeSelect");
const uploadTypePills = document.querySelector("#uploadTypePills");
const orderStatusTabs = document.querySelector(".order-status-tabs");
const orderPanels = document.querySelectorAll("[data-order-panel]");
const submitUpload = document.querySelector("#submitUpload");
const submitAndParse = document.querySelector("#submitAndParse");
const detailReportName = document.querySelector("#detailReportName");
const detailReportType = document.querySelector("#detailReportType");
const detailReportOrg = document.querySelector("#detailReportOrg");
const detailReportDate = document.querySelector("#detailReportDate");
const detailUploadTime = document.querySelector("#detailUploadTime");
const detailReportTitle = document.querySelector("#detailReportTitle");
const detailOrgText = document.querySelector("#detailOrgText");
const detailTypeText = document.querySelector("#detailTypeText");
const detailDateText = document.querySelector("#detailDateText");
const detailUploadText = document.querySelector("#detailUploadText");
const saveReportInfo = document.querySelector("#saveReportInfo");
const editReportName = document.querySelector("#editReportName");
const editReportType = document.querySelector("#editReportType");
const editReportOrg = document.querySelector("#editReportOrg");
const editReportDate = document.querySelector("#editReportDate");
const saveReportEdit = document.querySelector("#saveReportEdit");
const supplementDialog = document.querySelector("#supplementDialog");
const supplementName = document.querySelector("#supplementName");
const supplementType = document.querySelector("#supplementType");
const supplementOrg = document.querySelector("#supplementOrg");
const supplementDate = document.querySelector("#supplementDate");
const supplementError = document.querySelector("#supplementError");
const reportDeleteDialog = document.querySelector("#reportDeleteDialog");
const taskDeleteDialog = document.querySelector("#taskDeleteDialog");
const purchaseDialog = document.querySelector("#purchaseDialog");
const detailBack = document.querySelector("#detailBack");
const detailShare = document.querySelector("#detailShare");
const serviceSupport = document.querySelector("#serviceSupport");
const favoriteBtn = document.querySelector("#favoriteBtn");
const buyButton = document.querySelector("#buyButton");
const toast = document.querySelector("#toast");
const logoutDialog = document.querySelector("#logoutDialog");
const logoutBtn = document.querySelector("#logoutBtn");
const settingsUserName = document.querySelector("#settingsUserName");
const personalNickname = document.querySelector("#personalNickname");
const savePersonalSettings = document.querySelector("#savePersonalSettings");
const profileNameButton = document.querySelector("#profileNameButton");
const profileGenderAge = document.querySelector("#profileGenderAge");
const cycleReminder = document.querySelector("#cycleReminder");
const cycleReminderText = document.querySelector("#cycleReminderText");
const cycleAction = document.querySelector("#cycleAction");
const cycleClose = document.querySelector("#cycleClose");
const cycleSheet = document.querySelector("#cycleSheet");
const cycleSheetTitle = document.querySelector("#cycleSheetTitle");
const cycleSheetDesc = document.querySelector("#cycleSheetDesc");
const cycleDate = document.querySelector("#cycleDate");
const profileTabs = document.querySelectorAll("[data-profile-tab]");
const profilePanels = document.querySelectorAll("[data-profile-panel]");
const medicalFab = document.querySelector("#medicalFab");
const uploadFab = document.querySelector("#uploadFab");
const periodCard = document.querySelector("#periodCard");
const periodStatusLine = document.querySelector("#periodStatusLine");
const periodForecastLine = document.querySelector("#periodForecastLine");
const periodAverageLine = document.querySelector("#periodAverageLine");
const periodActionButton = document.querySelector("#periodActionButton");
const periodDetailCurrent = document.querySelector("#periodDetailCurrent");
const periodAvgCycle = document.querySelector("#periodAvgCycle");
const periodAvgLength = document.querySelector("#periodAvgLength");
const periodHistoryList = document.querySelector("#periodHistoryList");
const periodConfirmDialog = document.querySelector("#periodConfirmDialog");
const periodEditDialog = document.querySelector("#periodEditDialog");
const periodDeleteDialog = document.querySelector("#periodDeleteDialog");
const periodEditStart = document.querySelector("#periodEditStart");
const periodEditEnd = document.querySelector("#periodEditEnd");
const periodEditError = document.querySelector("#periodEditError");
const focusMetricGrid = document.querySelector("#focusMetricGrid");
const metricDetailTitle = document.querySelector("#metricDetailTitle");
const metricDetailValue = document.querySelector("#metricDetailValue");
const metricDetailUnit = document.querySelector("#metricDetailUnit");
const metricDetailStatus = document.querySelector("#metricDetailStatus");
const metricDetailTime = document.querySelector("#metricDetailTime");
const metricRangeTabs = document.querySelector("#metricRangeTabs");
const metricDateNav = document.querySelector("#metricDateNav");
const metricDateCurrent = document.querySelector("#metricDateCurrent span");
const metricDatePicker = document.querySelector("#metricDatePicker");
const metricTrendCaption = document.querySelector("#metricTrendCaption");
const metricLineChart = document.querySelector("#metricLineChart");
const metricStatAverage = document.querySelector("#metricStatAverage");
const metricAllRecords = document.querySelector("#metricAllRecords");
const metricRecordsGroups = document.querySelector("#metricRecordsGroups");
const metricDeleteDialog = document.querySelector("#metricDeleteDialog");
const metricRecordEntry = document.querySelector("#metricRecordEntry");
const metricRecordSheet = document.querySelector("#metricRecordSheet");
const metricRecordSheetTitle = document.querySelector("#metricRecordSheetTitle");
const metricRecordFields = document.querySelector("#metricRecordFields");
const metricRecordTime = document.querySelector("#metricRecordTime");
const metricRecordError = document.querySelector("#metricRecordError");
const metricRecordConfirm = document.querySelector("#metricRecordConfirm");
const dietUploadSheet = document.querySelector("#dietUploadSheet");
const dietUploadActionSheet = document.querySelector("#dietUploadActionSheet");
const dietUploadArea = document.querySelector("#dietUploadArea");
const dietImageGrid = document.querySelector("#dietImageGrid");
const dietImagePicker = document.querySelector("#dietImagePicker");
const dietMealOptions = document.querySelector("#dietMealOptions");
const dietMealTime = document.querySelector("#dietMealTime");
const dietNoteInput = document.querySelector("#dietNoteInput");
const dietCancelUpload = document.querySelector("#dietCancelUpload");
const dietStartRecognize = document.querySelector("#dietStartRecognize");
const dietRecognizeStep = document.querySelector("#dietRecognizeStep");
const dietRecognizeProgress = document.querySelector("#dietRecognizeProgress");
const dietRecognizeThumbs = document.querySelector("#dietRecognizeThumbs");
const dietAiStatus = document.querySelector("#dietAiStatus");
const dietFailCard = document.querySelector("#dietFailCard");
const dietRetryRecognize = document.querySelector("#dietRetryRecognize");
const dietManualFill = document.querySelector("#dietManualFill");
const dietResultTabs = document.querySelector("#dietResultTabs");
const dietFoodList = document.querySelector("#dietFoodList");
const dietMealTitle = document.querySelector("#dietMealTitle");
const dietRecordTimeText = document.querySelector("#dietRecordTimeText");
const dietResultTime = document.querySelector("#dietResultTime");
const dietResultNoteInput = document.querySelector("#dietResultNoteInput");
const dietGramSheet = document.querySelector("#dietGramSheet");
const dietGramFoodName = document.querySelector("#dietGramFoodName");
const dietFoodNameInput = document.querySelector("#dietFoodNameInput");
const dietGramInput = document.querySelector("#dietGramInput");
const dietGramConfirm = document.querySelector("#dietGramConfirm");
const dietFoodSheetDelete = document.querySelector("#dietFoodSheetDelete");
const dietTotalCalories = document.querySelector("#dietTotalCalories");
const dietProteinTotal = document.querySelector("#dietProteinTotal");
const dietFatTotal = document.querySelector("#dietFatTotal");
const dietCarbTotal = document.querySelector("#dietCarbTotal");
const dietConfirmCheckin = document.querySelector("#dietConfirmCheckin");
const dietDetailRangeTabs = document.querySelector("#dietDetailRangeTabs");
const dietDetailRangeTrigger = document.querySelector("#dietDetailRangeTrigger");
const dietDetailRangeText = document.querySelector("#dietDetailRangeText");
const dietDetailDayInput = document.querySelector("#dietDetailDayInput");
const dietDetailMonthInput = document.querySelector("#dietDetailMonthInput");
const dietDetailSummary = document.querySelector("#dietDetailSummary");
const dietDetailRecords = document.querySelector("#dietDetailRecords");
const dietDetailCheckin = document.querySelector("#dietDetailCheckin");
const dietDetailRecordFood = document.querySelector("#dietDetailRecordFood");
const medicineCheckinSheet = document.querySelector("#medicineCheckinSheet");
const medicineClose = document.querySelector("#medicineClose");
const medicineTime = document.querySelector("#medicineTime");
const medicineTimeTrigger = document.querySelector("#medicineTimeTrigger");
const medicineTimeText = document.querySelector("#medicineTimeText");
const medicineTimePicker = document.querySelector("#medicineTimePicker");
const medicinePickerDate = document.querySelector("#medicinePickerDate");
const medicinePickerHour = document.querySelector("#medicinePickerHour");
const medicinePickerMinute = document.querySelector("#medicinePickerMinute");
const medicineNote = document.querySelector("#medicineNote");
const medicineNoteCount = document.querySelector("#medicineNoteCount");
const medicineListTitle = document.querySelector("#medicineListTitle");
const medicineListDesc = document.querySelector("#medicineListDesc");
const medicineList = document.querySelector("#medicineList");
const medicineAdd = document.querySelector("#medicineAdd");
const medicineConfirm = document.querySelector("#medicineConfirm");
const medicineImagePicker = document.querySelector("#medicineImagePicker");
const medicineRecordsList = document.querySelector("#medicineRecordsList");
const medicineDetailSummary = document.querySelector("#medicineDetailSummary");
const medicineDetailList = document.querySelector("#medicineDetailList");
const medicineDetailEdit = document.querySelector("#medicineDetailEdit");
const medicineDetailDelete = document.querySelector("#medicineDetailDelete");
const medicineImageCount = document.querySelector("#medicineImageCount");
const medicineImageClose = document.querySelector("#medicineImageClose");
const medicineImageLarge = document.querySelector("#medicineImageLarge");
const medicineImageThumbs = document.querySelector("#medicineImageThumbs");
const medicineImagePrev = document.querySelector("#medicineImagePrev");
const medicineImageNext = document.querySelector("#medicineImageNext");
const sportCheckinSheet = document.querySelector("#sportCheckinSheet");
const sportClose = document.querySelector("#sportClose");
const sportTypeGrid = document.querySelector("#sportTypeGrid");
const sportOtherField = document.querySelector("#sportOtherField");
const sportOtherInput = document.querySelector("#sportOtherInput");
const sportOtherCount = document.querySelector("#sportOtherCount");
const sportOtherLabel = document.querySelector("#sportOtherLabel");
const sportDurationText = document.querySelector("#sportDuration");
const sportMinus = document.querySelector("#sportMinus");
const sportPlus = document.querySelector("#sportPlus");
const sportTimeTrigger = document.querySelector("#sportTimeTrigger");
const sportTimeText = document.querySelector("#sportTimeText");
const sportNoteInput = document.querySelector("#sportNoteInput");
const sportNoteCount = document.querySelector("#sportNoteCount");
const sportTimePicker = document.querySelector("#sportTimePicker");
const sportPickerDate = document.querySelector("#sportPickerDate");
const sportPickerHour = document.querySelector("#sportPickerHour");
const sportPickerMinute = document.querySelector("#sportPickerMinute");
const sportSubmit = document.querySelector("#sportSubmit");
const sportSuccessDialog = document.querySelector("#sportSuccessDialog");
const sportSuccessSummary = document.querySelector("#sportSuccessSummary");
const sportCalories = document.querySelector("#sportCalories");
const sportSuccessDone = document.querySelector("#sportSuccessDone");
const weightCheckinPage = document.querySelector("#weightCheckinPage");
const weightValueInput = document.querySelector("#weightValueInput");
const weightFatInput = document.querySelector("#weightFatInput");
const weightValueHint = document.querySelector("#weightValueHint");
const weightFatHint = document.querySelector("#weightFatHint");
const weightTimeTrigger = document.querySelector("#weightTimeTrigger");
const weightTimeText = document.querySelector("#weightTimeText");
const weightTimePicker = document.querySelector("#weightTimePicker");
const weightPickerDate = document.querySelector("#weightPickerDate");
const weightPickerHour = document.querySelector("#weightPickerHour");
const weightPickerMinute = document.querySelector("#weightPickerMinute");
const weightNoteInput = document.querySelector("#weightNoteInput");
const weightNoteCount = document.querySelector("#weightNoteCount");
const weightSubmit = document.querySelector("#weightSubmit");
const waistCheckinSheet = document.querySelector("#waistCheckinSheet");
const waistValueInput = document.querySelector("#waistValueInput");
const waistTimeTrigger = document.querySelector("#waistTimeTrigger");
const waistTimeText = document.querySelector("#waistTimeText");
const waistTimePicker = document.querySelector("#waistTimePicker");
const waistPickerDate = document.querySelector("#waistPickerDate");
const waistPickerHour = document.querySelector("#waistPickerHour");
const waistPickerMinute = document.querySelector("#waistPickerMinute");
const waistNoteInput = document.querySelector("#waistNoteInput");
const waistError = document.querySelector("#waistError");
const waistSubmit = document.querySelector("#waistSubmit");
const pressureCheckinSheet = document.querySelector("#pressureCheckinSheet");
const pressureClose = document.querySelector("#pressureClose");
const pressureSystolicInput = document.querySelector("#pressureSystolicInput");
const pressureDiastolicInput = document.querySelector("#pressureDiastolicInput");
const pressurePulseInput = document.querySelector("#pressurePulseInput");
const pressureSystolicHint = document.querySelector("#pressureSystolicHint");
const pressureDiastolicHint = document.querySelector("#pressureDiastolicHint");
const pressurePulseHint = document.querySelector("#pressurePulseHint");
const pressureTimeTrigger = document.querySelector("#pressureTimeTrigger");
const pressureTimeText = document.querySelector("#pressureTimeText");
const pressureTimePicker = document.querySelector("#pressureTimePicker");
const pressurePickerDate = document.querySelector("#pressurePickerDate");
const pressurePickerHour = document.querySelector("#pressurePickerHour");
const pressurePickerMinute = document.querySelector("#pressurePickerMinute");
const pressureNoteInput = document.querySelector("#pressureNoteInput");
const pressureNoteCount = document.querySelector("#pressureNoteCount");
const pressureError = document.querySelector("#pressureError");
const pressureSubmit = document.querySelector("#pressureSubmit");
const pressureSuccessDialog = document.querySelector("#pressureSuccessDialog");
const pressureSuccessBp = document.querySelector("#pressureSuccessBp");
const pressureSuccessPulse = document.querySelector("#pressureSuccessPulse");
const pressureSuccessDone = document.querySelector("#pressureSuccessDone");
const sugarCheckinSheet = document.querySelector("#sugarCheckinSheet");
const sugarClose = document.querySelector("#sugarClose");
const sugarPeriodGrid = document.querySelector("#sugarPeriodGrid");
const sugarValueInput = document.querySelector("#sugarValueInput");
const sugarValueHint = document.querySelector("#sugarValueHint");
const sugarTimeTrigger = document.querySelector("#sugarTimeTrigger");
const sugarTimeText = document.querySelector("#sugarTimeText");
const sugarTimePicker = document.querySelector("#sugarTimePicker");
const sugarPickerDate = document.querySelector("#sugarPickerDate");
const sugarPickerHour = document.querySelector("#sugarPickerHour");
const sugarPickerMinute = document.querySelector("#sugarPickerMinute");
const sugarNoteInput = document.querySelector("#sugarNoteInput");
const sugarNoteCount = document.querySelector("#sugarNoteCount");
const sugarError = document.querySelector("#sugarError");
const sugarSubmit = document.querySelector("#sugarSubmit");
const sugarSuccessDialog = document.querySelector("#sugarSuccessDialog");
const sugarSuccessPeriod = document.querySelector("#sugarSuccessPeriod");
const sugarSuccessValue = document.querySelector("#sugarSuccessValue");
const checkinSuccessDialog = document.querySelector("#checkinSuccessDialog");
const checkinSuccessSummary = document.querySelector("#checkinSuccessSummary");
const checkinSuccessDone = document.querySelector("#checkinSuccessDone");
let pageStack = [];
let addedMemberCount = 0;
let currentPatient = { id: "self", name: "张女士", sex: "female", age: "32" };
let cycleSheetMode = "start";
let editingPeriodId = "";
let deletingPeriodId = "";
let selectedMedicalCategory = "全部";
let selectedReportId = "r1";
let selectedTaskId = "";
let selectedUploadFiles = [];
let deletingReportId = "";
let deletingTaskId = "";
let serviceDetailSource = "service";
let selectedFocusPlan = "weight90";
let selectedFocusMetric = "weight";
let selectedMetricRange = "day";
let selectedMetricDate = new Date(2026, 5, 14);
let metricRecordsByPatient = {};
let deletedMetricRecordIdsByPatient = {};
let deletingMetricRecordId = "";
let dietUploadImages = [];
let dietSelectedMeal = "";
let dietRecognitionIndex = 0;
let dietRecognitionTimer = null;
let dietResultIndex = 0;
let dietResults = [];
let dietCheckinSummary = null;
let dietReturnView = "plan";
let dietResultMode = "checkin";
let dietDetailHasRecords = false;
let editingDietFoodId = "";
let editingDietFoodContext = "result";
let dietDetailMealGroups = null;
let dietDetailRangeMode = "day";
let dietDetailRangeDate = new Date();
let cameraMode = "report";
let medicineItems = [];
let medicineIdSeed = 1;
let medicineImageTargetId = "";
let medicineRecordsByPatient = {};
let selectedMedicineRecordId = "";
let editingMedicineRecordId = "";
let medicinePreviewImages = [];
let medicinePreviewIndex = 0;
let sportSelectedType = "walk";
let sportOtherName = "";
let sportDuration = 30;
let sportTimeValue = "";
let weightCheckinTimeValue = "";
let waistCheckinTimeValue = "";
let pressureCheckinTimeValue = "";
let sugarCheckinTimeValue = "";
let sugarSelectedPeriod = "空腹";

const sportTypes = {
  walk: { label: "步行", kcal: 4 },
  run: { label: "跑步", kcal: 8 },
  cycle: { label: "骑行", kcal: 6 },
  rope: { label: "跳绳", kcal: 10 },
  swim: { label: "游泳", kcal: 9 },
  fitness: { label: "健身", kcal: 7 },
  other: { label: "其他", kcal: 4 }
};

const focusPlanDashboards = {
  weight90: {
    name: "90天减肥计划",
    metrics: [
      { id: "sugar", name: "血糖", value: 5.0, display: "5.0", unit: "mmol/L", status: "正常", values: [5.4, 5.2, 5.1, 5.3, 5.0, 4.9, 5.0] },
      { id: "bp", name: "血压", value: 130, display: "130/85", unit: "mmHg", status: "正常", values: [134, 132, 131, 129, 133, 128, 130] },
      { id: "weight", name: "体重", value: 68.5, display: "68.5", unit: "kg", status: "下降 1.6kg", values: [70.1, 69.8, 69.6, 69.3, 69.0, 68.8, 68.5] },
      { id: "waist", name: "腰围", value: 82.5, display: "82.5", unit: "cm", status: "正常", values: [84.2, 83.9, 83.6, 83.2, 82.9, 82.7, 82.5] },
      { id: "height", name: "身高", value: 165, display: "165", unit: "cm", status: "稳定", values: [165, 165, 165, 165, 165, 165, 165] },
      { id: "heart", name: "心率", value: 76, display: "76", unit: "次/分", status: "正常", values: [78, 75, 77, 74, 76, 73, 76] },
      { id: "lipid", name: "血脂", value: 1.6, display: "TG 1.6 / LDL-C 2.5", unit: "mmol/L", status: "正常", values: [1.9, 1.8, 1.8, 1.7, 1.7, 1.6, 1.6] },
      { id: "uric", name: "尿酸", value: 368, display: "368", unit: "μmol/L", status: "正常", values: [354, 360, 365, 358, 370, 372, 368] },
      { id: "fat", name: "体脂", value: 28.4, display: "28.4", unit: "%", status: "下降 2.1%", values: [30.5, 30.1, 29.8, 29.4, 29.0, 28.7, 28.4] },
      { id: "bmi", name: "BMI", value: 25.2, display: "25.2", unit: "", status: "较上次下降 0.6", values: [25.8, 25.7, 25.6, 25.5, 25.4, 25.3, 25.2] }
    ]
  },
  kidney: {
    name: "慢性肾病管理",
    metrics: [
      { id: "bp-kidney", name: "血压", value: 132, display: "132/86", unit: "mmHg", status: "需关注", attention: true, values: [136, 134, 138, 132, 130, 135, 132] },
      { id: "sugar-kidney", name: "血糖", value: 6.2, display: "6.2", unit: "mmol/L", status: "正常", values: [6.5, 6.3, 6.4, 6.1, 6.0, 6.3, 6.2] },
      { id: "egfr", name: "肾小球过滤率", value: 58, display: "58", unit: "mL/min", status: "偏低", attention: true, values: [62, 61, 60, 59, 60, 58, 58] },
      { id: "kidney-size", name: "肾脏大小", value: 10.4, display: "10.4", unit: "cm", status: "左肾纵径", values: [10.5, 10.5, 10.4, 10.4, 10.4, 10.4, 10.4] },
      { id: "creatinine", name: "肌酐", value: 92, display: "92", unit: "μmol/L", status: "正常", values: [88, 90, 91, 89, 93, 94, 92] },
      { id: "serum-creatinine", name: "血肌酐", value: 98.7, display: "98.7", unit: "μmol/L", status: "需关注", attention: true, values: [94, 95, 96, 97, 99, 100, 98.7] },
      { id: "uric", name: "尿酸", value: 368, display: "368", unit: "μmol/L", status: "正常高值", values: [354, 360, 365, 358, 370, 372, 368] }
    ]
  },
  cardiovascular: {
    name: "心血管风险看板",
    metrics: [
      { id: "bp-cardio", name: "血压", value: 138, display: "138/88", unit: "mmHg", status: "偏高", attention: true, values: [142, 139, 141, 136, 140, 137, 138] },
      { id: "sugar-cardio", name: "血糖", value: 6.0, display: "6.0", unit: "mmol/L", status: "正常", values: [6.3, 6.1, 6.2, 5.9, 6.0, 5.8, 6.0] },
      { id: "heart-cardio", name: "心率", value: 82, display: "82", unit: "次/分", status: "正常", values: [80, 84, 81, 79, 83, 85, 82] }
    ]
  },
  diabetes: {
    name: "糖尿病管理",
    metrics: [
      { id: "bp-diabetes", name: "血压", value: 128, display: "128/82", unit: "mmHg", status: "正常", values: [130, 128, 132, 127, 129, 126, 128] },
      { id: "sugar-diabetes", name: "血糖", value: 7.1, display: "7.1", unit: "mmol/L", status: "偏高", attention: true, values: [7.6, 7.4, 7.2, 7.5, 7.0, 6.9, 7.1] }
    ]
  }
};

const packages = [
  {
    id: "weight",
    title: "90天减重管理服务包",
    tags: "科学减重｜饮食管理｜运动指导",
    desc: "通过个性化饮食和运动方案，帮助您健康减重，塑造理想体型。",
    price: "¥299",
    sales: "月销量 9,860+",
    img: "img-weight"
  },
  {
    id: "sugar",
    title: "90天控糖管理服务包",
    tags: "血糖监测｜饮食干预｜生活管理",
    desc: "科学管理血糖水平，帮助您稳定血糖，降低并发风险。",
    price: "¥299",
    sales: "月销量 7,560+",
    img: "img-sugar"
  },
  {
    id: "pressure",
    title: "90天控压管理服务包",
    tags: "血压监测｜生活干预｜风险评估",
    desc: "个性化血压管理方案，帮助您稳定血压，守护心脑血管健康。",
    price: "¥299",
    sales: "月销量 6,230+",
    img: "img-pressure"
  },
  {
    id: "nutrition",
    title: "90天营养管理服务包",
    tags: "营养评估｜膳食指导｜营养补充",
    desc: "专业营养师定制营养方案，改善饮食结构，提升身体健康。",
    price: "¥199",
    sales: "月销量 5,120+",
    img: "img-nutrition"
  },
  {
    id: "comprehensive",
    title: "90天综合健康管理包",
    tags: "全面评估｜多维管理｜专属服务",
    desc: "全方位健康管理，涵盖多项指标，为您提供一站式健康解决方案。",
    price: "¥399",
    sales: "月销量 3,420+",
    img: "img-comprehensive"
  }
];

const storedPeriodRecords = (() => {
  try {
    return JSON.parse(window.localStorage?.getItem("periodRecordsByPatient") || "{}");
  } catch {
    return {};
  }
})();

const periodRecordsByPatient = {
  self: [],
  mother: [
    { id: "m1", start: "2026-04-05", end: "2026-04-09" },
    { id: "m2", start: "2026-05-03", end: "2026-05-07" }
  ],
  ...storedPeriodRecords
};

function savePeriodRecords() {
  window.localStorage?.setItem("periodRecordsByPatient", JSON.stringify(periodRecordsByPatient));
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayString() {
  return formatDate(new Date());
}

function addDays(value, days) {
  const date = typeof value === "string" ? parseDate(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

const scheduleBaseToday = "2025-03-23";
let scheduleSelectedDate = scheduleBaseToday;
let scheduleCurrentWeekStart = formatDate(startOfWeek(parseDate(scheduleSelectedDate)));
let scheduleMonthOpen = false;
let schedulePatientId = "zhang";

const schedulePatients = [
  { id: "zhang", name: "张患者", sex: "男", age: "24", relation: "本人", state: "improving", avatar: "man" },
  { id: "li", name: "李先生", sex: "男", age: "68", relation: "父亲", state: "risk", avatar: "elder" },
  { id: "wang", name: "王女士", sex: "女", age: "35", relation: "本人", state: "improving", avatar: "woman" }
];

const scheduleTasks = {
  zhang: {
    "2025-03-23": {
      reminders: ["复诊提醒", "用药提醒", "报告查看"],
      followups: [
        { type: "随访量表", plan: "高血压服务包", title: "出院随访跟踪量表", range: "2025/05/01 至 2025/05/10", status: "进行中", action: "立即查看" }
      ],
      assessments: [
        { title: "糖尿病风险评估", desc: "健康管理师邀请您完成健康评估，了解健康状况。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "当日摄入 430 kcal", count: "已记录 1 次", value: "430 kcal", totalCalories: 430, latestRecordTime: "08:10" },
        { type: "sport", title: "运动打卡", desc: "记录每日运动，帮助保持习惯", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 2 次", value: "降压药 12:20" },
        { type: "period", title: "经期打卡", desc: "记录经期状态，辅助周期管理", count: "未开始" },
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "已记录 1 次", value: "128/82 mmHg 08:30" },
        { type: "sugar", title: "血糖打卡", desc: "记录空腹/餐后血糖", count: "待完成" }
      ]
    },
    "2025-03-24": {
      reminders: ["用药提醒"],
      followups: [],
      assessments: [],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" }
      ]
    },
    "2025-03-25": {
      reminders: ["复诊提醒"],
      followups: [
        { type: "随访问卷", plan: "术后康复计划", title: "疼痛与活动能力问卷", range: "2025/03/25 至 2025/03/31", status: "已完成", action: "查看结果" }
      ],
      assessments: [],
      checkins: []
    },
    "2025-03-26": {
      reminders: ["报告查看"],
      followups: [
        { type: "随访量表", plan: "高血压服务包", title: "血压稳定性随访量表", range: "2025/03/20 至 2025/03/26", status: "已逾期", action: "继续填写" }
      ],
      assessments: [
        { title: "睡眠质量评估", desc: "完成评估，了解近期睡眠状态", status: "已完成", action: "查看结果" }
      ],
      checkins: [
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "待完成" }
      ]
    },
    "2025-03-27": {
      reminders: ["用药提醒", "饮食记录"],
      followups: [
        { type: "随访量表", plan: "减重管理计划", title: "本周饮食与运动执行反馈", range: "2025/03/27 至 2025/03/30", status: "进行中", action: "立即查看" }
      ],
      assessments: [
        { title: "心血管风险自评", desc: "结合近期血压、饮食和运动记录，生成风险建议。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录今日饮食，获取饮食建议", count: "待完成" },
        { type: "sport", title: "运动打卡", desc: "今日建议快走 30 分钟", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 1 次", value: "降压药 08:10" },
        { type: "weight", title: "体重打卡", desc: "记录体重变化，关注健康趋势", count: "待完成" },
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "已记录 1 次", value: "126/80 mmHg 07:40" },
        { type: "sugar", title: "血糖打卡", desc: "记录空腹/餐后血糖", count: "待完成" }
      ]
    },
    "2025-03-28": {
      reminders: ["复诊提醒"],
      followups: [
        { type: "随访问卷", plan: "控压管理计划", title: "居家血压监测问卷", range: "2025/03/28 至 2025/04/02", status: "进行中", action: "继续填写" }
      ],
      assessments: [],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" },
        { type: "waist", title: "腰围打卡", desc: "记录腰围变化", count: "待完成" },
        { type: "heart", title: "心率打卡", desc: "记录静息心率", count: "待完成" }
      ]
    },
    "2025-03-29": {
      reminders: ["运动提醒", "用药提醒"],
      followups: [],
      assessments: [
        { title: "睡眠质量评估", desc: "记录最近一周睡眠情况，获取睡眠建议。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "diet", title: "饮食打卡", desc: "记录周末饮食，避免热量超标", count: "待完成" },
        { type: "sport", title: "运动打卡", desc: "记录每日运动，帮助保持习惯", count: "待完成" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "待完成" },
        { type: "fat", title: "体脂打卡", desc: "记录体脂变化", count: "待完成" }
      ]
    }
  },
  li: {
    "2025-03-23": {
      reminders: ["用药提醒", "血压复测"],
      followups: [
        { type: "随访量表", plan: "控压管理计划", title: "居家血压随访量表", range: "2025/03/21 至 2025/03/27", status: "进行中", action: "继续填写" }
      ],
      assessments: [],
      checkins: [
        { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏", count: "待完成", value: "146/92 mmHg 07:50" },
        { type: "medicine", title: "用药打卡", desc: "记录每日用药，帮助按时服药", count: "已记录 1 次" }
      ]
    }
  },
  wang: {
    "2025-03-23": {
      reminders: ["经期提醒"],
      followups: [],
      assessments: [
        { title: "女性健康评估", desc: "健康管理师邀请您完成健康评估，了解健康状况。", status: "待完成", action: "开始评估" }
      ],
      checkins: [
        { type: "period", title: "经期打卡", desc: "记录经期状态，辅助周期管理", count: "第 2 天", value: "轻微腹痛" },
        { type: "diet", title: "饮食打卡", desc: "记录每日饮食，帮助健康管理", count: "待完成" }
      ]
    }
  }
};

const dietMockImages = [
  "linear-gradient(135deg, #f8b26a 0 35%, #f4d5a1 35% 58%, #67c99a 58% 100%)",
  "linear-gradient(135deg, #cf6f52 0 32%, #f7d275 32% 54%, #83d2ff 54% 100%)",
  "linear-gradient(135deg, #7ccf8e 0 30%, #fff1a6 30% 60%, #f08a94 60% 100%)",
  "linear-gradient(135deg, #b36d43 0 38%, #f5e4c0 38% 62%, #a4d879 62% 100%)"
];

const dietFoodTemplates = [
  [
    { name: "香煎三文鱼配轻食沙拉", calories: 155, protein: 18, fat: 3.2, carb: 9, image: "fish" },
    { name: "水煮西兰花", calories: 64, protein: 4, fat: 0.6, carb: 10, image: "green" }
  ],
  [
    { name: "鸡胸肉全麦三明治", calories: 360, protein: 28, fat: 8, carb: 42, image: "sandwich" },
    { name: "无糖酸奶", calories: 120, protein: 9, fat: 3, carb: 12, image: "yogurt" }
  ],
  [
    { name: "番茄牛肉意面", calories: 520, protein: 32, fat: 12, carb: 68, image: "pasta" },
    { name: "时令水果杯", calories: 95, protein: 1, fat: 0.3, carb: 23, image: "fruit" }
  ]
];

const medicineMockImages = [
  "linear-gradient(135deg, #f3f7ff 0 28%, #8cc8ff 28% 36%, #ffffff 36% 58%, #2f7bdc 58% 68%, #f6fbff 68% 100%)",
  "linear-gradient(135deg, #e7f8ec 0 36%, #54bd72 36% 52%, #ffffff 52% 66%, #7bd48f 66% 100%)",
  "radial-gradient(circle at 35% 35%, #222 0 12%, transparent 13%), radial-gradient(circle at 65% 35%, #222 0 12%, transparent 13%), radial-gradient(circle at 35% 65%, #222 0 12%, transparent 13%), radial-gradient(circle at 65% 65%, #222 0 12%, transparent 13%), #eef2f7"
];

const defaultMedicineRecords = {
  zhang: [
    {
      id: "med-20260617-1705",
      time: "2026-06-17T17:05",
      note: "饭后服用，温水送服",
      items: [
        { id: "med-i-1", type: "medicine", name: "二甲双胍片", images: [medicineMockImages[0], medicineMockImages[1]] },
        { id: "med-i-2", type: "medicine", name: "阿托伐他汀钙片", images: [medicineMockImages[2]] },
        { id: "med-i-3", type: "nutrition", name: "维生素D3软胶囊", images: [] }
      ]
    },
    {
      id: "med-20260616-2030",
      time: "2026-06-16T20:30",
      note: "",
      items: [
        { id: "med-i-4", type: "medicine", name: "缬沙坦胶囊", images: [medicineMockImages[1]] },
        { id: "med-i-5", type: "nutrition", name: "钙片", images: [] }
      ]
    },
    {
      id: "med-20260615-0800",
      time: "2026-06-15T08:00",
      note: "早餐后",
      items: [
        { id: "med-i-6", type: "nutrition", name: "多种维生素片", images: [medicineMockImages[2]] }
      ]
    }
  ]
};

function startOfWeek(date) {
  const target = new Date(date);
  target.setDate(target.getDate() - target.getDay());
  return target;
}

function schedulePatient() {
  return schedulePatients.find((patient) => patient.id === schedulePatientId) || schedulePatients[0];
}

function scheduleDataFor(date = scheduleSelectedDate) {
  return scheduleTasks[schedulePatientId]?.[date] || { reminders: [], followups: [], assessments: [], checkins: [] };
}

function hasScheduleData(date) {
  const data = scheduleTasks[schedulePatientId]?.[date];
  return Boolean(data && (data.reminders.length || data.followups.length || data.assessments.length || data.checkins.length));
}

function daysBetween(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000);
}

function formatMonthDay(value) {
  const date = typeof value === "string" ? parseDate(value) : value;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function currentPeriodRecords() {
  if (!periodRecordsByPatient[currentPatient.id]) {
    periodRecordsByPatient[currentPatient.id] = [];
  }
  return periodRecordsByPatient[currentPatient.id];
}

function sortedPeriodRecords() {
  return [...currentPeriodRecords()].sort((a, b) => parseDate(b.start) - parseDate(a.start));
}

function averageRounded(values, fallback) {
  return values.length ? Math.round(values.reduce((sum, item) => sum + item, 0) / values.length) : fallback;
}

function calculatePeriodSummary() {
  const recordsDesc = sortedPeriodRecords();
  const recordsAsc = [...recordsDesc].reverse();
  const complete = recordsAsc.filter((record) => record.end);
  const cycleValues = [];
  for (let index = 1; index < recordsAsc.length; index += 1) {
    cycleValues.push(daysBetween(recordsAsc[index - 1].start, recordsAsc[index].start));
  }
  const avgCycle = averageRounded(cycleValues, 28);
  const avgLength = averageRounded(complete.map((record) => daysBetween(record.start, record.end) + 1), 5);
  const latest = recordsDesc[0];

  if (!latest) {
    return {
      hasRecords: false,
      inPeriod: false,
      phase: "暂无记录",
      avgCycle,
      avgLength,
      records: recordsDesc,
      action: "经期来了",
      status: "暂未记录经期",
      forecast: "记录后可帮你预测下次经期时间",
      average: ""
    };
  }

  const today = todayString();
  const latestEnd = latest.end || formatDate(addDays(latest.start, avgLength - 1));
  const realInPeriod = !latest.end;

  if (realInPeriod) {
    const remaining = Math.max(0, daysBetween(today, latestEnd));
    return {
      hasRecords: true,
      inPeriod: true,
      phase: "经期",
      avgCycle,
      avgLength,
      records: recordsDesc,
      action: "经期结束",
      activeRecord: latest,
      status: "当前阶段：经期",
      forecast: `预计 ${remaining} 天后经期结束，预计结束日：${formatMonthDay(latestEnd)}`,
      average: `平均周期：${avgCycle}天｜平均经期：${avgLength}天`
    };
  }

  let nextStart = addDays(latest.start, avgCycle);
  while (nextStart < parseDate(today)) {
    nextStart = addDays(nextStart, avgCycle);
  }
  const daysToStart = Math.max(0, daysBetween(today, formatDate(nextStart)));
  const distanceFromLatest = Math.max(0, daysBetween(latest.start, today));
  const cycleDay = (distanceFromLatest % avgCycle) + 1;
  const ovulationDay = Math.max(1, avgCycle - 14);
  let phase = "黄体期";
  if (cycleDay <= avgLength) {
    phase = "经期";
  } else if (cycleDay <= ovulationDay - 3) {
    phase = "卵泡期";
  } else if (cycleDay <= ovulationDay + 1) {
    phase = "排卵期";
  }

  return {
    hasRecords: true,
    inPeriod: false,
    phase,
    avgCycle,
    avgLength,
    records: recordsDesc,
    action: "经期来了",
    status: `当前阶段：${phase}`,
    forecast: `预计 ${daysToStart} 天后经期开始，预计开始日：${formatMonthDay(nextStart)}`,
    average: `平均周期：${avgCycle}天｜平均经期：${avgLength}天`
  };
}

const defaultMedicalReports = [
  {
    id: "r1",
    name: "血常规 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-06-01T09:30",
    uploadTime: "2025-06-01T10:05",
    thumb: "doc",
    ai: {
      summary: "本次血常规结果整体较平稳，个别指标需结合既往报告观察趋势。",
      conclusion: "暂未看到明显急性风险信号，建议按医生要求结合症状和既往病史综合判断。",
      focus: "白细胞和血红蛋白结果建议关注参考范围变化，如近期有发热、乏力等症状需进一步咨询医生。",
      notice: "保持规律作息，近期如有感染症状、用药变化或明显不适，应及时复查。",
      advice: "建议按医生要求定期复查；如出现明显不适，请及时就医。",
      next: "建议补充上传既往血常规报告，便于进行趋势对比。"
    }
  },
  {
    id: "r2",
    name: "肝功能 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-28T14:20",
    uploadTime: "2025-05-28T15:12",
    thumb: "doc",
    ai: {
      summary: "报告提示肝功能部分指标需要关注，建议结合近期饮食、饮酒、用药情况判断。",
      conclusion: "AI未直接给出疾病诊断，建议结合医生意见确认异常指标意义。",
      focus: "肝功能部分指标异常，建议关注近期用药、饮酒、基础疾病等情况。",
      notice: "近期避免饮酒和熬夜，减少高脂饮食，遵医嘱复查相关指标。",
      advice: "建议携带报告咨询专科医生。",
      next: "建议在 1-3 个月内复查肝功能，并补充上传既往同类报告。"
    }
  },
  {
    id: "r3",
    name: "胸部CT 检查报告",
    type: "检查报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-20T10:15",
    uploadTime: "2025-05-20T10:56",
    thumb: "ct",
    ai: {
      summary: "本次胸部CT报告建议结合影像结论和临床症状进行判断。",
      conclusion: "暂未替代医生阅片结论，需以影像科和临床医生意见为准。",
      focus: "如报告出现结节、炎症或阴影描述，建议关注大小、位置及随访建议。",
      notice: "若有咳嗽、胸痛、发热等症状，应及时就医确认。",
      advice: "建议按医生要求定期复查。",
      next: "建议保留并上传既往胸部影像报告，便于趋势对比。"
    }
  },
  {
    id: "r4",
    name: "血糖 检验报告",
    type: "检验报告",
    org: "南宁市第一人民医院",
    reportTime: "2025-05-18T08:45",
    uploadTime: "2025-05-18T09:20",
    thumb: "doc",
    ai: {
      summary: "血糖结果需要结合空腹或餐后时段判断。",
      conclusion: "如血糖高于参考范围，建议结合既往血糖、糖化血红蛋白等指标确认。",
      focus: "血糖结果高于参考范围时需关注饮食、运动和用药情况。",
      notice: "建议保持规律饮食，避免短期高糖摄入，按医嘱监测血糖。",
      advice: "建议按医生要求定期复查。",
      next: "建议补充上传既往血糖或糖化血红蛋白报告，便于趋势对比。"
    }
  },
  {
    id: "r5",
    name: "体检报告",
    type: "体检报告",
    org: "南宁市爱康体检中心",
    reportTime: "2025-05-10T09:00",
    uploadTime: "2025-05-10T11:30",
    thumb: "exam",
    ai: {
      summary: "体检报告包含多项指标，建议重点查看异常项和复查建议。",
      conclusion: "整体健康情况需结合年龄、既往史和医生建议综合判断。",
      focus: "关注血压、血糖、血脂、肝肾功能等异常指标。",
      notice: "保持规律作息、均衡饮食和适量运动，异常指标按建议复查。",
      advice: "暂无明显异常时可继续观察；异常项建议咨询医生。",
      next: "建议加入对应健康管理计划，持续跟踪关键指标。"
    }
  }
];

const defaultParseTasks = [
  { id: "t1", fileName: "image1", status: "parsing", thumb: "doc", createdAt: "2026-06-07T09:20" },
  { id: "t2", fileName: "image2", name: "尿常规 检验报告", type: "检验报告", org: "南宁市第一人民医院", status: "pending", thumb: "doc", createdAt: "2026-06-07T09:10" },
  { id: "t3", fileName: "image3", status: "failed", thumb: "doc", reason: "报告信息识别失败，请重新解析或删除", createdAt: "2026-06-07T08:55" },
  { id: "t4", fileName: "image4", name: "心电图 检查报告", type: "检查报告", org: "南宁市第一人民医院", reportTime: "2025-04-30T11:00", status: "completed", thumb: "doc", createdAt: "2026-06-06T16:20" }
];

function loadJsonStore(key, fallback) {
  try {
    return JSON.parse(window.localStorage?.getItem(key) || "null") || fallback;
  } catch {
    return fallback;
  }
}

let medicalReports = loadJsonStore("medicalReports", defaultMedicalReports);
let parseTasks = loadJsonStore("parseTasks", defaultParseTasks);
metricRecordsByPatient = loadJsonStore("metricRecordsByPatient", {});
deletedMetricRecordIdsByPatient = loadJsonStore("deletedMetricRecordIdsByPatient", {});
medicineRecordsByPatient = loadJsonStore("medicineRecordsByPatient", defaultMedicineRecords);

function saveMetricRecords() {
  window.localStorage?.setItem("metricRecordsByPatient", JSON.stringify(metricRecordsByPatient));
  window.localStorage?.setItem("deletedMetricRecordIdsByPatient", JSON.stringify(deletedMetricRecordIdsByPatient));
}

function saveMedicineRecords() {
  window.localStorage?.setItem("medicineRecordsByPatient", JSON.stringify(medicineRecordsByPatient));
}

function saveMedicalStores() {
  window.localStorage?.setItem("medicalReports", JSON.stringify(medicalReports));
  window.localStorage?.setItem("parseTasks", JSON.stringify(parseTasks));
}

function normalizeReportType(type) {
  if (type === "报告单") return "检验报告";
  return type;
}

function thumbForType(type, fallback = "doc") {
  if (type === "检查报告") return "ct";
  if (type === "门诊病历" || type === "门诊处方" || type === "住院记录") return "medical";
  if (type === "体检报告") return "exam";
  if (type === "检验报告" || type === "报告单") return "doc";
  return fallback;
}

function reportDateValue(report) {
  return report.reportTime || "";
}

function isNewReport(report) {
  return Date.now() - parseDateTime(report.uploadTime).getTime() < 86400000;
}

function parseDateTime(value) {
  return value ? new Date(value) : new Date(0);
}

function formatDateTime(value) {
  if (!value) return "待补充";
  const date = parseDateTime(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function sexText(sex) {
  if (sex === "female") return "女";
  if (sex === "male") return "男";
  return "未知";
}

function formatYearMonth(value) {
  if (!value) return "日期待补充";
  const date = parseDateTime(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}年${m}月`;
}

function reportCardTypeLabel(report) {
  if (report.type === "门诊病历") return "门(急)诊病历";
  return "报告单";
}

function renderMainCard(stateKey) {
  const state = states[stateKey];

  if (state.type === "empty") {
    mainCard.innerHTML = `
      <article class="welcome-card">
        <div>
          <h1>欢迎开启<br>健康管理之旅</h1>
          <p>完善档案后，获取个性化<br>健康评估和AI建议</p>
        </div>
        <div class="welcome-illustration" aria-hidden="true"></div>
        <div class="card-actions">
          <button class="primary-action" type="button">完善健康档案</button>
          <button class="secondary-action" type="button">开始健康评估</button>
        </div>
      </article>
    `;
    return;
  }

  mainCard.innerHTML = `
    <article class="score-card ${state.className}">
      <div class="score-top">
        <span class="card-label">${state.label}</span>
        <div class="score-line">
          <strong class="score-number">${state.score}</strong>
          <span class="score-unit">分</span>
          <span class="score-status ${state.statusClass}">${state.status}</span>
        </div>
      </div>
      <div class="ai-block">
        <strong>AI建议</strong>
        <p>${state.advice}</p>
      </div>
      <a class="detail-link" href="#">查看档案信息</a>
    </article>
  `;
}

function renderSchedule() {
  if (!scheduleWeek || !scheduleContent) return;
  const patient = schedulePatient();
  const selected = parseDate(scheduleSelectedDate);
  schedulePatientName.textContent = `${patient.name} ${patient.sex} ${patient.age}`;
  scheduleAvatar.className = `schedule-avatar ${patient.avatar}`;
  scheduleMonthLabel.textContent = `${selected.getFullYear()}年${String(selected.getMonth() + 1).padStart(2, "0")}月`;
  renderScheduleWeek();
  renderScheduleMonth();
  renderScheduleTasks();
  renderSchedulePatientSheet();
  renderScheduleCheckinSheet();
}

function renderScheduleWeek() {
  const weekStart = parseDate(scheduleCurrentWeekStart);
  const labels = ["日", "一", "二", "三", "四", "五", "六"];
  scheduleWeek.innerHTML = labels.map((label, index) => {
    const date = addDays(weekStart, index);
    const value = formatDate(date);
    const selected = value === scheduleSelectedDate;
    const today = value === scheduleBaseToday;
    const hasTask = hasScheduleData(value);
    const hasAlert = scheduleDataFor(value).followups.some((task) => task.status === "已逾期");
    return `
      <button class="schedule-day ${selected ? "selected" : ""} ${today ? "today" : ""} ${hasTask ? "has-task" : ""} ${hasAlert ? "has-alert" : ""}" type="button" data-schedule-date="${value}">
        <span>${label}</span>
        <strong>${String(date.getDate()).padStart(2, "0")}</strong>
      </button>
    `;
  }).join("");
}

function renderScheduleMonth() {
  if (!scheduleMonthPanel) return;
  const selected = parseDate(scheduleSelectedDate);
  const first = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const start = startOfWeek(first);
  scheduleMonthPanel.classList.toggle("open", scheduleMonthOpen);
  scheduleExpand?.setAttribute("aria-expanded", String(scheduleMonthOpen));
  scheduleExpand.textContent = scheduleMonthOpen ? "收起" : "展开";
  scheduleMonthPanel.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const value = formatDate(date);
    const muted = date.getMonth() !== selected.getMonth();
    return `<button class="month-day ${muted ? "muted" : ""} ${value === scheduleSelectedDate ? "selected" : ""}" type="button" data-schedule-date="${value}">${date.getDate()}</button>`;
  }).join("");
}

function renderScheduleTasks() {
  const data = scheduleDataFor();
  const hasAny = data.reminders.length || data.followups.length || data.assessments.length || data.checkins.length;
  try {
    if (!hasAny) {
      scheduleContent.innerHTML = renderCheckinSection([]);
      return;
    }
    scheduleContent.innerHTML = `
      ${renderReminderSection(data.reminders)}
      ${renderAssessmentSection(data.assessments)}
      ${renderFollowupSection(data.followups)}
      ${renderCheckinSection(data.checkins)}
    `;
  } catch (error) {
    scheduleContent.innerHTML = renderCheckinSection([]);
  }
}

function renderSection(title, body, action = "") {
  return `
    <section class="schedule-section">
      <div class="schedule-section-head">
        <h3>${title}</h3>
        ${action}
      </div>
      ${body}
    </section>
  `;
}

function renderReminderSection(reminders) {
  if (!reminders.length) return "";
  const body = `
    <article class="reminder-card registration-reminder" data-schedule-action="registration" role="button" tabindex="0">
      <span>
        <strong>预约就诊：皮肤科-张医生</strong>
        <em>本人&nbsp;&nbsp;张患者｜03-11 12:30</em>
      </span>
      <i aria-hidden="true"></i>
    </article>
  `;
  return renderSection("今日提醒", body);
}

function renderFollowupSection(followups) {
  const body = followups.length ? followups.map((task) => {
    const statusClass = task.status === "已完成" ? "done" : task.status === "已逾期" ? "overdue" : "";
    const buttonClass = task.status === "已完成" ? "done" : "";
    return `
      <article class="schedule-card follow-card" data-schedule-action="follow">
        <div class="follow-head">
          <span class="task-tag-small">${task.type}</span>
          <span class="task-plan-tag">${task.plan}</span>
        </div>
        <strong>${task.title}</strong>
        <p>${task.range} · <span class="task-status ${statusClass}">${task.status}</span></p>
        <button class="task-primary ${buttonClass}" type="button" data-schedule-action="follow">${task.action}</button>
      </article>
    `;
  }).join("") : `<div class="empty-card"><strong>暂无随访任务</strong></div>`;
  return renderSection("健康任务", body, `<button type="button" data-schedule-plans>全部计划 〉</button>`);
}

function renderAssessmentSection(assessments) {
  if (!assessments.length) return "";
  const body = assessments.map((task) => `
    <article class="schedule-card assessment-card" data-schedule-action="assessment">
      <i class="assessment-icon">评</i>
      <div>
        <strong>${task.title}</strong>
        <p>${task.desc}</p>
      </div>
      <button type="button" data-schedule-action="assessment">${task.action}</button>
    </article>
  `).join("");
  return body;
}

function renderCheckinSection(checkins) {
  const checkinMap = new Map();
  (checkins || []).forEach((item) => checkinMap.set(item.type, item));
  const wallItems = ["diet", "sport", "medicine", "weight", "pressure", "sugar", "lipid", "uric", "waist", "heart", "fat", "period"]
    .map((type) => checkinMap.get(type) || defaultCheckinItem(type));
  const body = `<div class="checkin-wall">${wallItems.map(renderCheckinCard).join("")}</div>`;
  return renderSection("健康打卡", body, `<button type="button" data-schedule-records>全部打卡 〉</button>`);
}

function defaultCheckinItem(type) {
  const defaults = {
    diet: { type: "diet", title: "饮食打卡", count: "暂无记录", desc: "" },
    sport: { type: "sport", title: "运动打卡", count: "暂无记录", desc: "" },
    medicine: { type: "medicine", title: "用药/补充记录", count: "暂无记录", desc: "" },
    weight: { type: "weight", title: "体重打卡", count: "暂无记录", desc: "" },
    pressure: { type: "pressure", title: "血压打卡", count: "暂无记录", desc: "" },
    sugar: { type: "sugar", title: "血糖打卡", count: "暂无记录", desc: "" },
    lipid: { type: "lipid", title: "血脂打卡", count: "暂无记录", desc: "" },
    uric: { type: "uric", title: "尿酸打卡", count: "暂无记录", desc: "" },
    waist: { type: "waist", title: "腰围打卡", count: "暂无记录", desc: "" },
    heart: { type: "heart", title: "心率打卡", count: "暂无记录", desc: "" },
    fat: { type: "fat", title: "体脂打卡", count: "暂无记录", desc: "" },
    period: { type: "period", title: "经期打卡", count: "暂无记录", desc: "" }
  };
  return defaults[type] || defaults.diet;
}

function checkinTimeText(value) {
  if (!value) return "";
  const text = String(value).trim();
  const timeMatch = text.match(/(\d{1,2}:\d{2})/);
  if (timeMatch) return timeMatch[1];
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  return text;
}

function checkinRecordTime(item) {
  return checkinTimeText(
    item?.latestRecordTime
      || item?.latestTime
      || item?.recordTime
      || item?.records?.[0]?.time
      || item?.value
      || ""
  );
}

function checkinValueWithoutTime(value) {
  return String(value || "")
    .replace(/\s*\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}\s*$/, "")
    .replace(/\s*\d{1,2}:\d{2}\s*$/, "")
    .trim();
}

function hasCheckinRecord(item) {
  if (!item) return false;
  if (Array.isArray(item.records) && item.records.length) return true;
  if (item.totalCalories || item.totalWater || item.duration || item.calories || item.values) return true;
  if (String(item.value || "").trim()) return true;
  const count = String(item.count || "").trim();
  return Boolean(count && !["暂无记录", "待完成", "未开始"].includes(count));
}

function numericKcal(value) {
  const matched = String(value || "").match(/(\d+(?:\.\d+)?)\s*kcal/i);
  return matched ? Number(matched[1]) : NaN;
}

function metricCheckinValue(item) {
  const values = item.values || {};
  const display = item.display || item.latestValue || checkinValueWithoutTime(item.value);
  if (item.type === "pressure" && (values.systolic || values.diastolic)) {
    const pulse = values.pulse ? ` · 脉搏 ${values.pulse}` : "";
    return `${values.systolic}/${values.diastolic} mmHg${pulse}`;
  }
  if (item.type === "weight") return `${display || values.value} kg`;
  if (item.type === "waist") return `${display || values.value} cm`;
  if (item.type === "heart") return `${display || values.value} 次/分`;
  if (item.type === "sugar") {
    const period = values.period || item.period || "";
    return `${display || values.value} mmol/L${period ? ` · ${period}` : ""}`;
  }
  if (item.type === "lipid") {
    if (values.tg || values.ldl) {
      const parts = [];
      if (values.tg) parts.push(`TG ${values.tg} mmol/L`);
      if (values.ldl) parts.push(`LDL-C ${values.ldl} mmol/L`);
      return parts.join(" · ");
    }
    return display ? `${display} mmol/L` : "";
  }
  if (item.type === "uric") return `${display || values.value} μmol/L`;
  return display;
}

function checkinDisplay(item) {
  if (!hasCheckinRecord(item)) return { main: "暂无记录", meta: "", empty: true };
  const valueText = checkinValueWithoutTime(item.value);
  const recordTime = checkinRecordTime(item);
  let main = valueText || item.count || "已记录";

  if (item.type === "diet") {
    const calorieValue = Number(item.totalCalories ?? item.calories ?? item.values?.calories);
    const calories = Number.isFinite(calorieValue) && calorieValue > 0 ? calorieValue : numericKcal(item.value);
    main = Number.isFinite(calories) && calories > 0 ? `${Math.round(calories)} kcal` : main;
  }

  if (item.type === "water") {
    const total = Number(item.totalWater ?? item.water ?? item.values?.water);
    main = Number.isFinite(total) && total > 0 ? `${Math.round(total)} ml` : main;
  }

  if (item.type === "sport") {
    const records = Array.isArray(item.records) ? item.records : [];
    const duration = records.reduce((sum, record) => sum + Number(record.duration || 0), 0) || Number(item.duration || 0);
    const calories = records.reduce((sum, record) => sum + Number(record.calories || 0), 0)
      || Number(item.calories || 0)
      || numericKcal(item.value);
    if (duration && calories) main = `总时长 ${duration}分钟 · 消耗 ${Math.round(calories)} kcal`;
    else if (duration) main = `总时长 ${duration}分钟`;
    else if (Number.isFinite(calories) && calories > 0) main = `消耗 ${Math.round(calories)} kcal`;
  }

  if (item.type === "medicine") {
    main = valueText || item.latestMedicineName || item.latestName || item.count || "已记录";
  }

  if (item.type === "sleep") {
    main = valueText || item.sleepDuration || item.duration || item.count || "已记录";
  }

  const metricTypes = new Set(["weight", "waist", "hip", "pressure", "heart", "sugar", "height", "lipid", "uric", "ketone", "psych", "fat", "period"]);
  if (metricTypes.has(item.type)) {
    main = metricCheckinValue(item) || valueText || item.display || item.latestValue || item.count || "已记录";
  }

  return {
    main,
    meta: `最新记录 ${recordTime || "--:--"}`,
    empty: false
  };
}

const scheduleMetricCheckins = {
  bp: { type: "pressure", title: "血压打卡", desc: "记录收缩压、舒张压、脉搏" },
  weight: { type: "weight", title: "体重打卡", desc: "记录体重变化，关注健康趋势" },
  waist: { type: "waist", title: "腰围打卡", desc: "记录腰围变化" },
  heart: { type: "heart", title: "心率打卡", desc: "记录静息心率" },
  sugar: { type: "sugar", title: "血糖打卡", desc: "记录血糖值和测量时段" },
  lipid: { type: "lipid", title: "血脂打卡", desc: "记录甘油三酯和低密度脂蛋白" },
  uric: { type: "uric", title: "尿酸打卡", desc: "记录尿酸变化" },
  fat: { type: "fat", title: "体脂打卡", desc: "记录体脂变化" }
};

function scheduleMetricKey(metricId) {
  const key = String(metricId || "").split("-")[0];
  if (key === "pressure") return "bp";
  return key;
}

function scheduleCheckinTypeForMetric(metricId) {
  return scheduleMetricCheckins[scheduleMetricKey(metricId)]?.type || "";
}

function updateScheduleMetricCheckin(metricId, record) {
  const config = scheduleMetricCheckins[scheduleMetricKey(metricId)];
  if (!config || !record) return;
  const timeText = checkinTimeText(record.time) || "--:--";
  const itemForDisplay = {
    type: config.type,
    display: record.display,
    value: record.display,
    values: record.values || {},
    latestRecordTime: timeText
  };
  const main = metricCheckinValue(itemForDisplay) || record.display || "已记录";
  const data = scheduleDataFor();
  const existing = data.checkins.find((item) => item.type === config.type);
  const payload = {
    type: config.type,
    title: config.title,
    desc: config.desc,
    count: "已记录 1 次",
    value: `${main} ${timeText}`,
    display: record.display,
    values: record.values || {},
    latestRecordTime: timeText,
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function renderCheckinCard(item) {
  const display = checkinDisplay(item);
  const config = {
    diet: {
      title: "饮食记录",
      main: display.main,
      meta: display.meta,
      art: "trend",
      icon: "食"
    },
    sport: {
      title: "运动",
      main: display.main,
      meta: display.meta,
      art: "bars",
      icon: "动"
    },
    medicine: {
      title: "用药/补充",
      main: display.main,
      meta: display.meta,
      art: "pill",
      icon: "药"
    },
    weight: {
      title: "体重",
      main: display.main,
      meta: display.meta,
      art: "scale",
      icon: "重"
    },
    pressure: {
      title: "血压",
      main: display.main,
      meta: display.meta,
      art: "heartline",
      icon: "压"
    },
    sugar: {
      title: "血糖",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "糖"
    },
    lipid: {
      title: "血脂",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "脂"
    },
    uric: {
      title: "尿酸",
      main: display.main,
      meta: display.meta,
      art: "drop",
      icon: "尿"
    },
    waist: {
      title: "腰围",
      main: display.main,
      meta: display.meta,
      art: "tape",
      icon: "围"
    },
    heart: {
      title: "心率",
      main: display.main,
      meta: display.meta,
      art: "heartline",
      icon: "心"
    },
    fat: {
      title: "体脂",
      main: display.main,
      meta: display.meta,
      art: "tube",
      icon: "脂"
    },
    period: {
      title: "经期管理",
      main: display.main,
      meta: display.meta,
      art: "flower",
      icon: "经"
    }
  }[item.type] || {
    title: item.title,
    main: display.main,
    meta: display.meta,
    art: "trend",
    icon: "记"
  };
  const checkinMainClass = `checkin-main${display.empty ? " empty" : ""}`;
  const largeClass = item.type === "diet" || item.type === "period" ? " large" : "";
  const plusLabel = `新增${config.title}`;
  return `
    <article class="checkin-card${largeClass}" data-type="${item.type}" data-schedule-action="records">
      <div class="checkin-card-head">
        <i class="checkin-symbol" aria-hidden="true">${config.icon}</i>
        <span>
          <strong>${config.title}</strong>
        </span>
        <button class="checkin-plus" type="button" data-type="${item.type}" data-schedule-action="checkin" aria-label="${plusLabel}">+</button>
      </div>
      <div class="checkin-card-body">
        <span class="${checkinMainClass}">${config.main}</span>
        ${config.meta ? `<span class="checkin-sub">${config.meta}</span>` : ""}
      </div>
    </article>
  `;
}

function renderSchedulePatientSheet() {
  if (!schedulePatientSheet) return;
  schedulePatientSheet.innerHTML = `
    <h3>切换就诊人</h3>
    ${schedulePatients.map((patient) => `
      <button class="patient-option ${patient.id === schedulePatientId ? "active" : ""}" type="button" data-schedule-patient="${patient.id}">
        <span class="schedule-avatar ${patient.avatar}" aria-hidden="true"></span>
        <b>${patient.name}<span>${patient.sex} · ${patient.age}岁 · ${patient.relation}</span></b>
        <i class="patient-check">✓</i>
      </button>
    `).join("")}
  `;
}

function renderScheduleCheckinSheet() {
  if (!scheduleCheckinSheet) return;
  const options = [
    ["diet", "饮食打卡", "记录每日饮食"],
    ["sport", "运动打卡", "记录每日运动"],
    ["medicine", "用药打卡", "记录每日用药"],
    ["period", "经期打卡", "记录经期状态"]
  ];
  scheduleCheckinSheet.innerHTML = `
    <h3>新增打卡</h3>
    ${options.map(([type, title, desc]) => `
      <button class="checkin-option" type="button" data-add-checkin="${type}">
        <i class="checkin-icon">${title.slice(0, 1)}</i>
        <b>${title}<span>${desc}</span></b>
        <span>添加</span>
      </button>
    `).join("")}
  `;
}

function selectScheduleDate(value) {
  scheduleSelectedDate = value;
  scheduleCurrentWeekStart = formatDate(startOfWeek(parseDate(value)));
  scheduleMonthOpen = false;
  renderSchedule();
}

function openScheduleSheet(sheet) {
  if (!sheet) return;
  closeOverlays();
  sheetMask.classList.add("active");
  sheet.classList.add("active");
}

function showScheduleToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
}

function localDateTimeValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDietTime(value) {
  if (!value) return "现在";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function mealByTime(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 10) return "早餐";
  if (hour >= 10 && hour < 14) return "午餐";
  if (hour >= 17 && hour < 21) return "晚餐";
  return "加餐";
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resetDietUploadState() {
  dietReturnView = document.querySelector("#dietDetailPage")?.classList.contains("active")
    ? "dietDetail"
    : planPage?.classList.contains("active") ? "plan" : "home";
  dietUploadImages.forEach((image) => {
    if (image.preview?.startsWith("blob:")) URL.revokeObjectURL(image.preview);
  });
  dietUploadImages = [];
  const now = new Date();
  dietSelectedMeal = mealByTime(now);
  dietResults = [];
  dietResultIndex = 0;
  if (dietMealTime) dietMealTime.value = localDateTimeValue(now);
  if (dietNoteInput) dietNoteInput.value = "";
  renderDietUploadImages();
  renderDietMealOptions();
}

function showDietUploadSheet() {
  sheetMask.classList.add("active");
  dietUploadSheet?.classList.add("active");
}

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
    <article class="diet-food-card" data-food-id="${food.id}">
      <i class="food-thumb ${food.image}" aria-hidden="true"></i>
      <div>
        <strong>${food.name}</strong>
        <p>${food.calories} kcal · ${formatFoodNumber(food.grams || 100)}g</p>
      </div>
      <menu class="diet-food-actions">
        ${readonlyResult ? "" : `<button class="diet-food-edit" type="button" data-edit-food="${food.id}" aria-label="编辑${escapeAttr(food.name)}"></button>`}
      </menu>
    </article>
  `).join("") || `<div class="diet-empty-result">当前图片的食物已删除</div>`;
  if (dietResultNoteInput) {
    dietResultNoteInput.readOnly = readonlyResult;
    dietResultNoteInput.setAttribute("aria-readonly", String(readonlyResult));
  }
  if (dietConfirmCheckin) {
    dietConfirmCheckin.textContent = readonlyResult ? "删除" : "确认打卡";
    dietConfirmCheckin.classList.toggle("danger", readonlyResult);
  }
}

function findDietFood(foodId) {
  return dietResults.flatMap((result) => result.foods).find((item) => item.id === foodId);
}

function findDietDetailFood(foodId) {
  return (dietDetailMealGroups || []).flatMap((group) => group.foods).find((item) => item.id === foodId);
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
  if (dietGramFoodName) dietGramFoodName.textContent = food.name;
  if (dietFoodNameInput) dietFoodNameInput.value = food.name;
  if (dietGramInput) dietGramInput.value = food.grams || detailFoodGrams(food) || 100;
  sheetMask.classList.add("active");
  dietGramSheet?.classList.add("active");
  window.setTimeout(() => dietFoodNameInput?.focus(), 80);
}

function closeDietGramSheet() {
  editingDietFoodId = "";
  editingDietFoodContext = "result";
  dietGramSheet?.classList.remove("active");
  if (!document.querySelector(".diet-upload-sheet.active, .medicine-checkin-sheet.active, .sport-checkin-sheet.active, .weight-checkin-page.active, .waist-checkin-sheet.active, .pressure-checkin-sheet.active, .sugar-checkin-sheet.active, .checkin-success-dialog.active, .sport-success-dialog.active, .pressure-success-dialog.active, .sugar-success-dialog.active")) {
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
  if (editingDietFoodContext === "detail") food.amount = `${formatFoodNumber(food.grams || 100)}g`;
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
  dietDetailHasRecords = true;
  if (dietReturnView === "dietDetail") {
    renderDietDetailPage();
    openSubPage("dietDetailPage");
    showToast("饮食打卡已完成");
    return;
  }
  const nextView = dietReturnView === "home" ? "home" : "plan";
  tabbarLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === nextView));
  switchView(nextView);
  showToast("饮食打卡已完成");
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
  const mealGroups = dietDetailFoodsForRender();
  const foods = mealGroups.flatMap((group) => group.foods);
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
    dietDetailRecords.innerHTML = mealGroups.map((group, groupIndex) => `
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
  const today = new Date(2026, 5, 17);
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

function medicineItemTypeLabel(type) {
  return type === "nutrition" ? "营养素" : "药品";
}

function medicineThumbStyle(image) {
  if (!image) return "";
  return image.startsWith("blob:") || /^https?:/.test(image) || image.startsWith("data:")
    ? `background-image:url('${image}')`
    : `background:${image}`;
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
  const records = sortedMedicineRecords();
  if (!records.length) {
    medicineRecordsList.innerHTML = `
      <div class="medicine-record-empty">
        <strong>暂无用药/补充记录</strong>
        <span>从健康打卡卡片右上角添加本次记录。</span>
      </div>
    `;
    return;
  }
  let currentGroup = "";
  medicineRecordsList.innerHTML = records.map((record) => {
    const parts = medicineDateParts(record.time);
    const summary = medicineRecordSummary(record);
    const groupTitle = parts.group !== currentGroup ? `<h2>${parts.group}</h2>` : "";
    currentGroup = parts.group;
    const firstItems = record.items.slice(0, 3).map((item) => item.name).join("、");
    return `
      ${groupTitle}
      <button class="medicine-record-row" type="button" data-medicine-record="${record.id}">
        <span>
          <em>${parts.time}</em>
          <strong>${summary.count}</strong>
          <b>${medicineItemTypeLabel(record.items[0]?.type)}：${escapeAttr(firstItems || "用药/补充记录")}</b>
          <small>${record.note ? `备注：${escapeAttr(record.note)}` : "无备注"}</small>
        </span>
        <i aria-hidden="true"></i>
      </button>
    `;
  }).join("");
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
  const summary = medicineRecordSummary(record);
  if (medicineDetailSummary) {
    medicineDetailSummary.innerHTML = `
      <p><span>用药时间</span><strong>${parts.full}</strong></p>
      <p><span>记录数量</span><strong>${summary.count}</strong></p>
      <p><span>备注</span><strong>${escapeAttr(record.note || "无")}</strong></p>
    `;
  }
  if (medicineDetailList) {
    let imageCursor = 0;
    medicineDetailList.innerHTML = (record.items || []).map((item) => {
      const images = item.images || [];
      return `
        <article class="medicine-detail-item">
          <span>${medicineItemTypeLabel(item.type)}</span>
          <strong>${escapeAttr(item.name)}</strong>
          ${images.length ? `
            <div class="medicine-detail-images">
              ${images.map((image) => `<button type="button" data-medicine-image="${record.id}" data-image-index="${imageCursor++}" style="${medicineThumbStyle(image)}" aria-label="查看${escapeAttr(item.name)}图片"></button>`).join("")}
            </div>
          ` : ""}
        </article>
      `;
    }).join("");
  }
}

function openMedicineDetailPage(recordId) {
  selectedMedicineRecordId = recordId;
  renderMedicineDetailPage();
  openSubPage("medicineDetailPage");
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
  if (medicineConfirm) medicineConfirm.textContent = editingMedicineRecordId ? "保存记录" : "确认打卡";
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
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择用药时间";
  const today = new Date();
  const dateKey = (item) => `${item.getFullYear()}-${item.getMonth()}-${item.getDate()}`;
  const timeText = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  if (dateKey(date) === dateKey(today)) return timeText;
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${timeText}`;
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
  populateMedicineTimePicker();
  medicineTimePicker?.classList.add("active");
}

function closeMedicineTimePicker() {
  medicineTimePicker?.classList.remove("active");
}

function confirmMedicineTimePicker() {
  if (!medicinePickerDate?.value || !medicinePickerHour?.value || !medicinePickerMinute?.value || !medicineTime) return;
  medicineTime.value = `${medicinePickerDate.value}T${medicinePickerHour.value}:${medicinePickerMinute.value}`;
  updateMedicineTimeText();
  closeMedicineTimePicker();
}

function updateMedicineNoteCount() {
  if (!medicineNoteCount || !medicineNote) return;
  medicineNoteCount.textContent = `${medicineNote.value.length}/200`;
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
        <span class="medicine-field-title">${copy.fieldTitle} <b>*</b></span>
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
    showToast("请选择用药时间");
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
  showToast(hasMedicine && hasNutrition ? "用药/补充记录已完成" : hasNutrition ? "营养素记录已完成" : "用药记录已完成");
}

function formatSportTimeText(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择记录时间";
  const today = new Date();
  const sameDay = dateInputValue(date) === dateInputValue(today);
  const dateText = `${date.getFullYear()}-${padDateNumber(date.getMonth() + 1)}-${padDateNumber(date.getDate())}`;
  const timeText = `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
  return sameDay ? timeText : `${dateText} ${timeText}`;
}

function updateSportNoteCount() {
  if (!sportNoteInput || !sportNoteCount) return;
  sportNoteCount.textContent = `${sportNoteInput.value.length}/100`;
}

function currentSportName() {
  if (sportSelectedType !== "other") return sportTypes[sportSelectedType]?.label || "步行";
  return sportOtherName || "其他";
}

function renderSportCheckin() {
  if (!sportTypeGrid) return;
  sportTypeGrid.querySelectorAll("[data-sport-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sportType === sportSelectedType);
  });
  if (sportOtherField) sportOtherField.classList.toggle("active", sportSelectedType === "other");
  if (sportOtherLabel) sportOtherLabel.textContent = sportSelectedType === "other" && sportOtherName ? sportOtherName : "其他";
  if (sportOtherCount && sportOtherInput) sportOtherCount.textContent = `${sportOtherInput.value.length}/10`;
  if (sportDurationText) sportDurationText.textContent = String(sportDuration);
  if (sportTimeText) sportTimeText.textContent = formatSportTimeText(sportTimeValue);
}

function openSportCheckinSheet() {
  closeOverlays();
  sportSelectedType = "walk";
  sportOtherName = "";
  sportDuration = 30;
  sportTimeValue = localDateTimeValue();
  if (sportOtherInput) sportOtherInput.value = "";
  if (sportNoteInput) sportNoteInput.value = "";
  updateSportNoteCount();
  renderSportCheckin();
  sheetMask.classList.add("active");
  sportCheckinSheet?.classList.add("active");
}

function populateSportTimePicker() {
  if (!sportPickerDate || !sportPickerHour || !sportPickerMinute) return;
  const selected = sportTimeValue ? new Date(sportTimeValue) : new Date();
  const pad = (value) => String(value).padStart(2, "0");
  sportPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  sportPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => `<option value="${pad(hour)}">${pad(hour)}</option>`).join("");
  sportPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const minute = pad(index * 5);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  sportPickerDate.value = `${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`;
  sportPickerHour.value = pad(selected.getHours());
  sportPickerMinute.value = pad(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openSportTimePicker() {
  populateSportTimePicker();
  sportTimePicker?.classList.add("active");
}

function closeSportTimePicker() {
  sportTimePicker?.classList.remove("active");
}

function confirmSportTimePicker() {
  if (!sportPickerDate?.value || !sportPickerHour?.value || !sportPickerMinute?.value) return;
  sportTimeValue = `${sportPickerDate.value}T${sportPickerHour.value}:${sportPickerMinute.value}`;
  renderSportCheckin();
  closeSportTimePicker();
}

function submitSportCheckin() {
  if (sportSelectedType === "other" && !sportOtherName) {
    showToast("请输入运动名称");
    sportOtherInput?.focus();
    return;
  }
  const rule = sportTypes[sportSelectedType] || sportTypes.walk;
  const calories = sportDuration * rule.kcal;
  const record = {
    id: `sport-${Date.now()}`,
    name: currentSportName(),
    duration: sportDuration,
    calories,
    time: sportTimeValue || localDateTimeValue()
  };
  const data = scheduleDataFor();
  const sportItem = data.checkins.find((item) => item.type === "sport");
  const records = Array.isArray(sportItem?.records) ? [...sportItem.records] : [];
  records.unshift(record);
  const totalDuration = records.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const totalCalories = records.reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const nextSportItem = {
    type: "sport",
    title: "运动打卡",
    desc: `总时长 ${totalDuration}分钟`,
    count: `已记录 ${records.length} 次`,
    value: `消耗 ${totalCalories} kcal`,
    latestRecordTime: formatSportTimeText(record.time),
    records
  };
  if (sportItem) Object.assign(sportItem, nextSportItem);
  else data.checkins.unshift(nextSportItem);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
  renderSchedule();
  if (sportSuccessSummary) sportSuccessSummary.textContent = `本次运动：${currentSportName()} ${sportDuration}分钟`;
  if (sportCalories) sportCalories.textContent = `${calories} kcal`;
  sportCheckinSheet?.classList.remove("active");
  sportTimePicker?.classList.remove("active");
  sheetMask.classList.add("active");
  sportSuccessDialog?.classList.add("active");
}

function closeSportSuccessDialog() {
  closeOverlays();
  showToast("运动打卡已完成");
}

function formatWeightTimeText(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择记录时间";
  const today = new Date();
  const sameDay = dateInputValue(date) === dateInputValue(today);
  const dateText = `${date.getFullYear()}-${padDateNumber(date.getMonth() + 1)}-${padDateNumber(date.getDate())}`;
  const timeText = `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
  return sameDay ? timeText : `${dateText} ${timeText}`;
}

function updateWeightTimeText() {
  if (weightTimeText) weightTimeText.textContent = formatWeightTimeText(weightCheckinTimeValue);
}

function updateWeightNoteCount() {
  if (!weightNoteInput || !weightNoteCount) return;
  weightNoteCount.textContent = `${weightNoteInput.value.length}/100`;
}

function normalizeDecimal(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function setWeightField(field, value) {
  const input = field === "fat" ? weightFatInput : weightValueInput;
  if (!input) return;
  input.value = Number(value).toFixed(1);
  validateWeightInputs(false);
}

function stepWeightField(field, delta) {
  const input = field === "fat" ? weightFatInput : weightValueInput;
  const min = field === "fat" ? 3 : 20;
  const max = field === "fat" ? 70 : 300;
  const fallback = field === "fat" ? 24.5 : 68.5;
  const current = normalizeDecimal(input?.value, fallback);
  const next = Math.min(max, Math.max(min, current + delta));
  setWeightField(field, next);
}

function validateWeightInputs(showError = true) {
  const weight = Number(weightValueInput?.value);
  const fatRaw = weightFatInput?.value?.trim() || "";
  const fat = Number(fatRaw);
  let valid = true;
  if (!weightValueInput?.value) {
    if (showError) showToast("请输入体重");
    valid = false;
  } else if (!Number.isFinite(weight) || weight < 20 || weight > 300) {
    weightValueHint.textContent = "请输入 20.0 ~ 300.0 kg 范围内的体重";
    weightValueHint.classList.add("error");
    valid = false;
  } else {
    weightValueHint.textContent = "建议范围：20.0 ~ 300.0 kg";
    weightValueHint.classList.remove("error");
  }
  if (fatRaw && (!Number.isFinite(fat) || fat < 3 || fat > 70)) {
    weightFatHint.textContent = "请输入 3.0 ~ 70.0 % 范围内的体脂率";
    weightFatHint.classList.add("error");
    valid = false;
  } else {
    weightFatHint.textContent = "建议范围：3.0 ~ 70.0 %";
    weightFatHint.classList.remove("error");
  }
  return valid;
}

function openWeightCheckinPage() {
  closeOverlays();
  weightCheckinTimeValue = localDateTimeInputValue();
  if (weightValueInput) weightValueInput.value = "68.5";
  if (weightFatInput) weightFatInput.value = "24.5";
  if (weightNoteInput) weightNoteInput.value = "";
  updateWeightTimeText();
  updateWeightNoteCount();
  validateWeightInputs(false);
  sheetMask?.classList.add("active");
  weightCheckinPage?.classList.add("active");
}

function populateWeightTimePicker() {
  if (!weightPickerDate || !weightPickerHour || !weightPickerMinute) return;
  const selected = weightCheckinTimeValue ? new Date(weightCheckinTimeValue) : new Date();
  weightPickerDate.innerHTML = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  weightPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => `<option value="${padDateNumber(hour)}">${padDateNumber(hour)}</option>`).join("");
  weightPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const minute = padDateNumber(index * 5);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  weightPickerDate.value = dateInputValue(selected);
  weightPickerHour.value = padDateNumber(selected.getHours());
  weightPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openWeightTimePicker() {
  populateWeightTimePicker();
  sheetMask?.classList.add("active");
  weightTimePicker?.classList.add("active");
}

function closeWeightTimePicker() {
  weightTimePicker?.classList.remove("active");
  if (!weightCheckinPage?.classList.contains("active")) sheetMask?.classList.remove("active");
}

function confirmWeightTimePicker() {
  if (!weightPickerDate?.value || !weightPickerHour?.value || !weightPickerMinute?.value) return;
  weightCheckinTimeValue = `${weightPickerDate.value}T${weightPickerHour.value}:${weightPickerMinute.value}`;
  updateWeightTimeText();
  closeWeightTimePicker();
}

function submitWeightCheckin() {
  if (!validateWeightInputs(true)) return;
  if (!weightCheckinTimeValue) {
    showToast("请选择记录时间");
    return;
  }
  const weightValue = Number(weightValueInput.value);
  const fatValue = weightFatInput.value ? Number(weightFatInput.value) : null;
  const records = [
    {
      metricId: "weight",
      value: weightValue,
      display: formatMetricNumber(weightValue),
      unit: "kg",
      values: { value: weightValue }
    }
  ];
  if (Number.isFinite(fatValue)) {
    records.push({
      metricId: "fat",
      value: fatValue,
      display: formatMetricNumber(fatValue),
      unit: "%",
      values: { value: fatValue }
    });
  }
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  records.forEach((record) => {
    const status = metricStatus(record.metricId, record.values);
    if (!metricRecordsByPatient[currentPatient.id][record.metricId]) metricRecordsByPatient[currentPatient.id][record.metricId] = [];
    const savedRecord = {
      id: `metric-${record.metricId}-${Date.now()}`,
      time: weightCheckinTimeValue,
      display: record.display,
      chartValue: record.value,
      unit: record.unit,
      status: status.text,
      attention: status.attention,
      values: record.values,
      note: weightNoteInput?.value.trim() || ""
    };
    metricRecordsByPatient[currentPatient.id][record.metricId].unshift(savedRecord);
    updateScheduleMetricCheckin(record.metricId, savedRecord);
  });
  saveMetricRecords();
  renderFocusPlans();
  renderSchedule();
  closeOverlays();
  showToast("打卡成功");
}

function waistMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "waist");
}

function formatWaistTimeText(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择记录时间";
  return `${dateInputValue(date)} ${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function updateWaistTimeText() {
  if (waistTimeText) waistTimeText.textContent = formatWaistTimeText(waistCheckinTimeValue);
}

function openWaistCheckinSheet() {
  closeOverlays();
  const latest = metricRecordsFor("waist")[0];
  const metric = waistMetric();
  if (waistValueInput) waistValueInput.value = latest?.display || metric?.display || "82.5";
  waistCheckinTimeValue = localDateTimeInputValue();
  if (waistNoteInput) waistNoteInput.value = "";
  if (waistError) waistError.textContent = "";
  updateWaistTimeText();
  sheetMask.classList.add("active");
  waistCheckinSheet?.classList.add("active");
  window.setTimeout(() => waistValueInput?.select(), 80);
}

function populateWaistTimePicker() {
  if (!waistPickerDate || !waistPickerHour || !waistPickerMinute) return;
  const selected = waistCheckinTimeValue ? new Date(waistCheckinTimeValue) : new Date();
  waistPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  waistPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  waistPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  waistPickerDate.value = dateInputValue(selected);
  waistPickerHour.value = padDateNumber(selected.getHours());
  waistPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openWaistTimePicker() {
  populateWaistTimePicker();
  waistTimePicker?.classList.add("active");
}

function closeWaistTimePicker() {
  waistTimePicker?.classList.remove("active");
}

function confirmWaistTimePicker() {
  if (!waistPickerDate?.value || !waistPickerHour?.value || !waistPickerMinute?.value) return;
  waistCheckinTimeValue = `${waistPickerDate.value}T${waistPickerHour.value}:${waistPickerMinute.value}`;
  updateWaistTimeText();
  closeWaistTimePicker();
}

function saveWaistCheckin() {
  const value = Number(waistValueInput?.value);
  if (!waistValueInput?.value || !Number.isFinite(value) || value < 40 || value > 200) {
    if (waistError) waistError.textContent = "请填写 40.0 ~ 200.0 cm 范围内的腰围";
    waistValueInput?.focus();
    return;
  }
  if (!waistCheckinTimeValue) {
    if (waistError) waistError.textContent = "请选择记录时间";
    return;
  }
  const metric = waistMetric();
  const display = formatMetricNumber(value);
  const status = metricStatus("waist", { value });
  const record = {
    id: `metric-waist-${Date.now()}`,
    time: waistCheckinTimeValue,
    display,
    chartValue: value,
    unit: "cm",
    status: status.text,
    attention: status.attention,
    values: { value },
    note: waistNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].waist) metricRecordsByPatient[currentPatient.id].waist = [];
  metricRecordsByPatient[currentPatient.id].waist.unshift(record);
  updateScheduleMetricCheckin("waist", record);
  saveMetricRecords();
  if (metric) {
    metric.value = value;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, value].slice(-7);
  }
  selectedFocusMetric = "waist";
  selectedMetricDate = new Date(waistCheckinTimeValue);
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  if (checkinSuccessSummary) checkinSuccessSummary.textContent = `当日腰围：${display} cm`;
  sheetMask.classList.add("active");
  checkinSuccessDialog?.classList.add("active");
}

function formatPressureTimeText(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择记录时间";
  const today = new Date();
  const timeText = `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
  return dateInputValue(date) === dateInputValue(today) ? timeText : `${dateInputValue(date)} ${timeText}`;
}

function updatePressureTimeText() {
  if (pressureTimeText) pressureTimeText.textContent = formatPressureTimeText(pressureCheckinTimeValue);
}

function updatePressureNoteCount() {
  if (pressureNoteCount) pressureNoteCount.textContent = `${pressureNoteInput?.value.length || 0}/100`;
}

function pressureFieldConfig(field) {
  return {
    systolic: { input: pressureSystolicInput, hint: pressureSystolicHint, min: 60, max: 250, unit: "mmHg", label: "收缩压" },
    diastolic: { input: pressureDiastolicInput, hint: pressureDiastolicHint, min: 40, max: 150, unit: "mmHg", label: "舒张压" },
    pulse: { input: pressurePulseInput, hint: pressurePulseHint, min: 40, max: 200, unit: "次/分", label: "脉搏", optional: true }
  }[field];
}

function validatePressureInputs(showError = false) {
  const fields = ["systolic", "diastolic", "pulse"];
  let valid = true;
  fields.forEach((field) => {
    const config = pressureFieldConfig(field);
    if (!config?.input || !config.hint) return;
    const emptyOptional = config.optional && !config.input.value;
    const value = Number(config.input.value);
    const invalid = !emptyOptional && (!config.input.value || !Number.isFinite(value) || value < config.min || value > config.max);
    config.hint.classList.toggle("error", invalid);
    config.hint.textContent = invalid && showError
      ? `请填写 ${config.min} ~ ${config.max} ${config.unit} 范围内的${config.label}`
      : `建议范围：${config.min} ~ ${config.max} ${config.unit}`;
    if (invalid) valid = false;
  });
  if (pressureError) pressureError.textContent = valid ? "" : "请检查血压数值是否在建议范围内";
  return valid;
}

function stepPressureField(field, delta) {
  const config = pressureFieldConfig(field);
  if (!config?.input) return;
  const fallback = field === "systolic" ? 120 : field === "diastolic" ? 80 : 72;
  const current = Number(config.input.value || fallback);
  const next = Math.min(config.max, Math.max(config.min, Math.round(current + delta)));
  config.input.value = String(next);
  validatePressureInputs(false);
}

function pressureMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "bp");
}

function openPressureCheckinSheet() {
  closeOverlays();
  const latest = metricRecordsFor("bp")[0];
  const metric = pressureMetric();
  const latestValues = latest?.values || {};
  const displayParts = String(latest?.display || metric?.display || "120/80").split("/");
  if (pressureSystolicInput) pressureSystolicInput.value = String(latestValues.systolic || Number(displayParts[0]) || 120);
  if (pressureDiastolicInput) pressureDiastolicInput.value = String(latestValues.diastolic || Number(displayParts[1]) || 80);
  if (pressurePulseInput) pressurePulseInput.value = String(latestValues.pulse || 72);
  pressureCheckinTimeValue = localDateTimeInputValue();
  if (pressureNoteInput) pressureNoteInput.value = "";
  if (pressureError) pressureError.textContent = "";
  updatePressureTimeText();
  updatePressureNoteCount();
  validatePressureInputs(false);
  sheetMask.classList.add("active");
  pressureCheckinSheet?.classList.add("active");
  window.setTimeout(() => pressureSystolicInput?.select(), 80);
}

function populatePressureTimePicker() {
  if (!pressurePickerDate || !pressurePickerHour || !pressurePickerMinute) return;
  const selected = pressureCheckinTimeValue ? new Date(pressureCheckinTimeValue) : new Date();
  pressurePickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  pressurePickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  pressurePickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  pressurePickerDate.value = dateInputValue(selected);
  pressurePickerHour.value = padDateNumber(selected.getHours());
  pressurePickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openPressureTimePicker() {
  populatePressureTimePicker();
  pressureTimePicker?.classList.add("active");
}

function closePressureTimePicker() {
  pressureTimePicker?.classList.remove("active");
}

function confirmPressureTimePicker() {
  if (!pressurePickerDate?.value || !pressurePickerHour?.value || !pressurePickerMinute?.value) return;
  pressureCheckinTimeValue = `${pressurePickerDate.value}T${pressurePickerHour.value}:${pressurePickerMinute.value}`;
  updatePressureTimeText();
  closePressureTimePicker();
}

function updateSchedulePressureCheckin(display, pulse) {
  const data = scheduleDataFor();
  const timeText = checkinTimeText(pressureCheckinTimeValue) || "--:--";
  const existing = data.checkins.find((item) => item.type === "pressure");
  const payload = {
    type: "pressure",
    title: "血压打卡",
    desc: "记录收缩压、舒张压、脉搏",
    count: "已记录 1 次",
    value: `${display} mmHg ${timeText}`,
    values: { systolic: Number(pressureSystolicInput?.value), diastolic: Number(pressureDiastolicInput?.value), pulse },
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function submitPressureCheckin() {
  if (!validatePressureInputs(true)) return;
  if (!pressureCheckinTimeValue) {
    if (pressureError) pressureError.textContent = "请选择记录时间";
    return;
  }
  const systolic = Number(pressureSystolicInput?.value);
  const diastolic = Number(pressureDiastolicInput?.value);
  const pulse = pressurePulseInput?.value ? Number(pressurePulseInput.value) : null;
  const display = `${systolic}/${diastolic}`;
  const values = { systolic, diastolic };
  if (Number.isFinite(pulse)) values.pulse = pulse;
  const status = metricStatus("bp", values);
  const record = {
    id: `metric-bp-${Date.now()}`,
    time: pressureCheckinTimeValue,
    display,
    chartValue: systolic,
    unit: "mmHg",
    status: status.text,
    attention: status.attention,
    values,
    note: pressureNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].bp) metricRecordsByPatient[currentPatient.id].bp = [];
  metricRecordsByPatient[currentPatient.id].bp.unshift(record);
  saveMetricRecords();
  const metric = pressureMetric();
  if (metric) {
    metric.value = systolic;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, systolic].slice(-7);
  }
  updateSchedulePressureCheckin(display, Number.isFinite(pulse) ? pulse : null);
  selectedFocusMetric = "bp";
  selectedMetricDate = new Date(pressureCheckinTimeValue);
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  if (pressureSuccessBp) pressureSuccessBp.textContent = display;
  if (pressureSuccessPulse) pressureSuccessPulse.textContent = Number.isFinite(pulse) ? String(pulse) : "--";
  sheetMask.classList.add("active");
  pressureSuccessDialog?.classList.add("active");
}

function sugarMetric() {
  return focusPlanDashboards.weight90.metrics.find((metric) => metric.id === "sugar");
}

function recommendedSugarPeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return "凌晨";
  if (hour < 9) return "空腹";
  if (hour < 11) return "早餐后2h";
  if (hour < 15) return "午餐后2h";
  if (hour < 21) return "晚餐后2h";
  return "睡前";
}

function formatSugarTimeText(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "请选择测量时间";
  return `${dateInputValue(date)} ${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function renderSugarPeriodGrid() {
  sugarPeriodGrid?.querySelectorAll("[data-sugar-period]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sugarPeriod === sugarSelectedPeriod);
  });
}

function updateSugarTimeText() {
  if (sugarTimeText) sugarTimeText.textContent = formatSugarTimeText(sugarCheckinTimeValue);
}

function updateSugarNoteCount() {
  if (sugarNoteCount) sugarNoteCount.textContent = `${sugarNoteInput?.value.length || 0}/100`;
}

function validateSugarInput(showError = false) {
  const value = Number(sugarValueInput?.value);
  const valid = Boolean(sugarValueInput?.value) && Number.isFinite(value) && value >= 1 && value <= 33.3;
  sugarValueInput?.closest(".sugar-value-field")?.classList.toggle("error", !valid && showError);
  if (sugarValueHint) {
    sugarValueHint.classList.toggle("error", !valid && showError);
    sugarValueHint.textContent = !valid && showError ? "请填写 1.0 ~ 33.3 mmol/L 范围内的血糖值" : "建议范围：1.0 ~ 33.3 mmol/L";
  }
  if (sugarError) sugarError.textContent = valid ? "" : (showError ? "请填写血糖值" : "");
  return valid;
}

function openSugarCheckinSheet() {
  closeOverlays();
  const now = new Date();
  sugarSelectedPeriod = recommendedSugarPeriod(now);
  sugarCheckinTimeValue = localDateTimeInputValue(now);
  if (sugarValueInput) sugarValueInput.value = "";
  if (sugarNoteInput) sugarNoteInput.value = "";
  if (sugarError) sugarError.textContent = "";
  sugarValueInput?.closest(".sugar-value-field")?.classList.remove("error");
  updateSugarTimeText();
  updateSugarNoteCount();
  validateSugarInput(false);
  renderSugarPeriodGrid();
  sheetMask.classList.add("active");
  sugarCheckinSheet?.classList.add("active");
  window.setTimeout(() => sugarValueInput?.focus(), 80);
}

function populateSugarTimePicker() {
  if (!sugarPickerDate || !sugarPickerHour || !sugarPickerMinute) return;
  const selected = sugarCheckinTimeValue ? new Date(sugarCheckinTimeValue) : new Date();
  sugarPickerDate.innerHTML = [-1, 0, 1, 2, 3].map((offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const value = dateInputValue(date);
    const label = offset === 0 ? "今天" : offset === -1 ? "昨天" : `${padDateNumber(date.getMonth() + 1)}/${padDateNumber(date.getDate())}`;
    return `<option value="${value}">${label}</option>`;
  }).join("");
  sugarPickerHour.innerHTML = Array.from({ length: 24 }, (_, hour) => {
    const value = padDateNumber(hour);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  sugarPickerMinute.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const value = padDateNumber(index * 5);
    return `<option value="${value}">${value}</option>`;
  }).join("");
  sugarPickerDate.value = dateInputValue(selected);
  sugarPickerHour.value = padDateNumber(selected.getHours());
  sugarPickerMinute.value = padDateNumber(Math.min(55, Math.round(selected.getMinutes() / 5) * 5));
}

function openSugarTimePicker() {
  populateSugarTimePicker();
  sugarTimePicker?.classList.add("active");
}

function closeSugarTimePicker() {
  sugarTimePicker?.classList.remove("active");
}

function confirmSugarTimePicker() {
  if (!sugarPickerDate?.value || !sugarPickerHour?.value || !sugarPickerMinute?.value) return;
  sugarCheckinTimeValue = `${sugarPickerDate.value}T${sugarPickerHour.value}:${sugarPickerMinute.value}`;
  updateSugarTimeText();
  closeSugarTimePicker();
}

function updateScheduleSugarCheckin(record) {
  const data = scheduleDataFor();
  const existing = data.checkins.find((item) => item.type === "sugar");
  const timeText = checkinTimeText(record.time) || "--:--";
  const payload = {
    type: "sugar",
    title: "血糖打卡",
    desc: "记录空腹/餐后血糖",
    count: "已记录 1 次",
    value: `${record.values.period} ${record.display} mmol/L ${timeText}`,
    display: record.display,
    values: record.values,
    recordTime: timeText
  };
  if (existing) Object.assign(existing, payload);
  else data.checkins.unshift(payload);
  if (!scheduleTasks[schedulePatientId]) scheduleTasks[schedulePatientId] = {};
  scheduleTasks[schedulePatientId][scheduleSelectedDate] = data;
}

function hideSugarSuccessLater() {
  window.setTimeout(() => {
    sugarSuccessDialog?.classList.remove("active");
    if (!document.querySelector(".diet-upload-sheet.active, .medicine-checkin-sheet.active, .sport-checkin-sheet.active, .weight-checkin-page.active, .waist-checkin-sheet.active, .pressure-checkin-sheet.active, .sugar-checkin-sheet.active, .checkin-success-dialog.active, .sport-success-dialog.active, .pressure-success-dialog.active")) {
      sheetMask.classList.remove("active");
    }
  }, 1600);
}

function submitSugarCheckin() {
  if (!validateSugarInput(true)) {
    sugarValueInput?.focus();
    return;
  }
  if (!sugarCheckinTimeValue) {
    if (sugarError) sugarError.textContent = "请选择测量时间";
    return;
  }
  const value = Number(sugarValueInput.value);
  const display = formatMetricNumber(value);
  const values = { value, period: sugarSelectedPeriod };
  const status = metricStatus("sugar", values);
  const record = {
    id: `metric-sugar-${Date.now()}`,
    time: sugarCheckinTimeValue,
    display,
    chartValue: value,
    unit: "mmol/L",
    status: status.text,
    attention: status.attention,
    values,
    note: sugarNoteInput?.value.trim() || ""
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id].sugar) metricRecordsByPatient[currentPatient.id].sugar = [];
  metricRecordsByPatient[currentPatient.id].sugar.unshift(record);
  saveMetricRecords();
  const metric = sugarMetric();
  if (metric) {
    metric.value = value;
    metric.display = display;
    metric.status = status.text;
    metric.attention = status.attention;
    metric.values = [...metric.values, value].slice(-7);
  }
  updateScheduleSugarCheckin(record);
  selectedFocusMetric = "sugar";
  selectedMetricDate = new Date(sugarCheckinTimeValue);
  sugarCheckinSheet?.classList.remove("active");
  sugarTimePicker?.classList.remove("active");
  renderFocusPlans();
  renderSchedule();
  if (metricDetailPage?.classList.contains("active")) renderMetricDetail();
  if (sugarSuccessPeriod) sugarSuccessPeriod.textContent = sugarSelectedPeriod;
  if (sugarSuccessValue) sugarSuccessValue.textContent = display;
  sheetMask.classList.add("active");
  sugarSuccessDialog?.classList.add("active");
  hideSugarSuccessLater();
}

function sortedMedicalReports() {
  return [...medicalReports]
    .filter((report) => selectedMedicalCategory === "全部" || report.type === selectedMedicalCategory)
    .sort((a, b) => {
      const dateDiff = parseDateTime(reportDateValue(b)) - parseDateTime(reportDateValue(a));
      if (dateDiff !== 0) return dateDiff;
      return parseDateTime(b.uploadTime) - parseDateTime(a.uploadTime);
    });
}

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
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "diet") {
    openDietCameraPage(true);
    return;
  }
  if (target.dataset.scheduleAction === "checkin" && target.dataset.type === "sport") {
    openSportCheckinSheet();
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
  if ((target.dataset.scheduleAction === "checkin" || target.dataset.scheduleAction === "records") && target.dataset.type === "pressure") {
    openPressureCheckinSheet();
    return;
  }
  if ((target.dataset.scheduleAction === "checkin" || target.dataset.scheduleAction === "records") && target.dataset.type === "sugar") {
    openSugarCheckinSheet();
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
    openDietDetailPage();
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

function renderFocusPlans() {
  if (!focusMetricGrid) return;
  selectedFocusPlan = "weight90";
  const plan = focusPlanDashboards.weight90;
  applyLatestMetricRecords(plan);
  focusMetricGrid.innerHTML = plan.metrics.map((metric) => `
    <button class="focus-metric-card${metric.attention ? " attention" : ""}" type="button" data-focus-metric="${metric.id}">
      <span>${metric.name}</span>
      <strong>${metric.display}<em>${metric.unit}</em></strong>
    </button>
  `).join("");
}

const metricRecordConfigs = {
  sugar: [{ key: "value", label: "血糖值", unit: "mmol/L", step: "0.1", min: "0.1", max: "40" }],
  bp: [
    { key: "systolic", label: "收缩压", unit: "mmHg", step: "1", min: "40", max: "260" },
    { key: "diastolic", label: "舒张压", unit: "mmHg", step: "1", min: "30", max: "180" }
  ],
  weight: [{ key: "value", label: "体重", unit: "kg", step: "0.1", min: "1", max: "500" }],
  waist: [{ key: "value", label: "腰围", unit: "cm", step: "0.1", min: "40", max: "200" }],
  height: [{ key: "value", label: "身高", unit: "cm", step: "0.1", min: "30", max: "250" }],
  heart: [{ key: "value", label: "心率", unit: "次/分", step: "1", min: "20", max: "250" }],
  lipid: [
    { key: "tg", label: "甘油三酯 TG", unit: "mmol/L", step: "0.1", min: "0.1", max: "20" },
    { key: "ldl", label: "低密度脂蛋白 LDL-C", unit: "mmol/L", step: "0.1", min: "0.1", max: "20" }
  ],
  uric: [{ key: "value", label: "尿酸值", unit: "μmol/L", step: "1", min: "1", max: "1500" }],
  fat: [{ key: "value", label: "体脂", unit: "%", step: "0.1", min: "1", max: "70" }],
  bmi: [{ key: "value", label: "BMI", unit: "", step: "0.1", min: "5", max: "80" }]
};

function metricRecordsFor(metricId) {
  const patientRecords = metricRecordsByPatient[currentPatient.id] || {};
  return patientRecords[metricId] || [];
}

function deletedMetricRecordIdsFor(metricId) {
  const patientRecords = deletedMetricRecordIdsByPatient[currentPatient.id] || {};
  return patientRecords[metricId] || [];
}

function applyLatestMetricRecords(plan) {
  plan.metrics.forEach((metric) => {
    if (!metric.initialState) {
      metric.initialState = {
        value: metric.value,
        display: metric.display,
        status: metric.status,
        attention: Boolean(metric.attention),
        values: [...metric.values]
      };
    }
    metric.value = metric.initialState.value;
    metric.display = metric.initialState.display;
    metric.status = metric.initialState.status;
    metric.attention = metric.initialState.attention;
    metric.values = [...metric.initialState.values];
    const latest = allMetricRecords(metric)[0];
    if (!latest) return;
    metric.value = latest.chartValue;
    metric.display = latest.display;
    metric.status = latest.status;
    metric.attention = latest.attention;
    if (metric.values.at(-1) !== latest.chartValue) {
      metric.values = [...metric.values, latest.chartValue].slice(-7);
    }
  });
}

function localDateTimeInputValue(date = new Date()) {
  return `${dateInputValue(date)}T${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function displayMetricRecordTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace("T", " ").replaceAll("-", "/");
  return `${dateInputValue(date).replaceAll("-", "/")} ${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`;
}

function baselineMetricRecords(metric) {
  const baseDate = new Date();
  baseDate.setHours(8, 20, 0, 0);
  return [...metric.initialState.values].reverse().map((value, index) => {
    const time = new Date(baseDate);
    time.setDate(baseDate.getDate() - index);
    const display = metric.id === "bp"
      ? `${formatMetricNumber(value)}/${Math.round(value * 0.65)}`
      : formatMetricNumber(value);
    return {
      id: `baseline-${metric.id}-${index}`,
      time: localDateTimeInputValue(time),
      display,
      chartValue: value,
      unit: metric.unit,
      status: "正常",
      attention: false,
      baseline: true
    };
  });
}

function allMetricRecords(metric) {
  const deletedIds = new Set(deletedMetricRecordIdsFor(metric.id));
  return [...metricRecordsFor(metric.id), ...baselineMetricRecords(metric)]
    .filter((record) => !deletedIds.has(record.id))
    .sort((a, b) => new Date(b.time) - new Date(a.time));
}

function metricRecordDateParts(value) {
  const date = new Date(value);
  return {
    key: dateInputValue(date),
    label: `${date.getFullYear()}年${padDateNumber(date.getMonth() + 1)}月${padDateNumber(date.getDate())}日`,
    time: `${padDateNumber(date.getHours())}:${padDateNumber(date.getMinutes())}`
  };
}

function renderAllMetricRecords() {
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
  metricRecordsGroups.innerHTML = allMetricRecords(metric).map((record) => {
    const date = metricRecordDateParts(record.time);
    return `
      <article class="metric-record-item">
        <div class="metric-record-date"><strong>${date.label}</strong><span>${date.time}</span></div>
        <div class="metric-record-value"><strong>${record.display}</strong><em>${record.unit}</em></div>
        <button class="metric-record-delete" type="button" data-delete-metric-record="${record.id}" aria-label="删除${date.label}${date.time}的${metric.name}记录"></button>
      </article>
    `;
  }).join("");
}

function openMetricDeleteDialog(recordId) {
  deletingMetricRecordId = recordId;
  closeOverlays();
  sheetMask.classList.add("active");
  metricDeleteDialog.classList.add("active");
}

function confirmMetricRecordDelete() {
  if (!deletingMetricRecordId) return;
  const metric = getSelectedMetric();
  if (deletingMetricRecordId.startsWith("baseline-")) {
    if (!deletedMetricRecordIdsByPatient[currentPatient.id]) deletedMetricRecordIdsByPatient[currentPatient.id] = {};
    if (!deletedMetricRecordIdsByPatient[currentPatient.id][metric.id]) deletedMetricRecordIdsByPatient[currentPatient.id][metric.id] = [];
    deletedMetricRecordIdsByPatient[currentPatient.id][metric.id].push(deletingMetricRecordId);
  } else if (metricRecordsByPatient[currentPatient.id]?.[metric.id]) {
    metricRecordsByPatient[currentPatient.id][metric.id] = metricRecordsByPatient[currentPatient.id][metric.id]
      .filter((record) => record.id !== deletingMetricRecordId);
  }
  deletingMetricRecordId = "";
  saveMetricRecords();
  closeOverlays();
  renderFocusPlans();
  renderMetricDetail();
  renderAllMetricRecords();
  toast.textContent = "指标记录已删除";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function metricStatus(metricId, values) {
  const primary = values.value ?? values.systolic;
  const attention = (
    (metricId === "sugar" && primary > 6.1) ||
    (metricId === "bp" && (values.systolic >= 140 || values.diastolic >= 90)) ||
    (metricId === "heart" && (primary < 60 || primary > 100)) ||
    (metricId === "fat" && primary > 30) ||
    (metricId === "bmi" && primary >= 24)
  );
  return { text: attention ? "需关注" : "正常", attention };
}

function openMetricRecordSheet() {
  const metric = getSelectedMetric();
  const fields = metricRecordConfigs[metric.id] || metricRecordConfigs.weight;
  metricRecordSheetTitle.textContent = `记录${metric.name}`;
  metricRecordFields.innerHTML = fields.map((field) => `
    <label>
      <span>${field.label}</span>
      <div><input type="number" inputmode="decimal" data-metric-input="${field.key}" step="${field.step}" min="${field.min}" max="${field.max}" placeholder="请输入"><em>${field.unit}</em></div>
    </label>
  `).join("");
  metricRecordTime.value = localDateTimeInputValue();
  metricRecordError.textContent = "";
  closeOverlays();
  sheetMask.classList.add("active");
  metricRecordSheet.classList.add("active");
  metricRecordFields.querySelector("input")?.focus();
}

function saveMetricRecord() {
  const metric = getSelectedMetric();
  const config = metricRecordConfigs[metric.id];
  const values = {};
  for (const field of config) {
    const input = metricRecordFields.querySelector(`[data-metric-input="${field.key}"]`);
    const value = Number(input?.value);
    if (!input?.value || !Number.isFinite(value) || value < Number(field.min) || value > Number(field.max)) {
      metricRecordError.textContent = `请正确填写${field.label}`;
      input?.focus();
      return;
    }
    values[field.key] = value;
  }
  if (!metricRecordTime.value) {
    metricRecordError.textContent = "请选择记录时间";
    return;
  }
  if (metric.id === "sugar" && !values.period) values.period = "空腹";
  const display = metric.id === "bp"
    ? `${values.systolic}/${values.diastolic}`
    : metric.id === "lipid"
      ? `TG ${formatMetricNumber(values.tg)} / LDL-C ${formatMetricNumber(values.ldl)}`
      : formatMetricNumber(values.value);
  const chartValue = metric.id === "bp" ? values.systolic : metric.id === "lipid" ? values.tg : values.value;
  const status = metricStatus(metric.id, values);
  const record = {
    id: `metric-${Date.now()}`,
    time: metricRecordTime.value,
    display,
    chartValue,
    unit: metric.unit,
    status: status.text,
    attention: status.attention,
    values
  };
  if (!metricRecordsByPatient[currentPatient.id]) metricRecordsByPatient[currentPatient.id] = {};
  if (!metricRecordsByPatient[currentPatient.id][metric.id]) metricRecordsByPatient[currentPatient.id][metric.id] = [];
  metricRecordsByPatient[currentPatient.id][metric.id].unshift(record);
  updateScheduleMetricCheckin(metric.id, record);
  saveMetricRecords();
  metric.value = chartValue;
  metric.display = display;
  metric.status = status.text;
  metric.attention = status.attention;
  metric.values = [...metric.values, chartValue].slice(-7);
  selectedMetricDate = new Date(metricRecordTime.value);
  closeOverlays();
  renderFocusPlans();
  renderSchedule();
  renderMetricDetail();
  toast.textContent = `${metric.name}记录已保存`;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function getSelectedMetric() {
  const plan = focusPlanDashboards[selectedFocusPlan];
  return plan.metrics.find((metric) => metric.id === selectedFocusMetric) || plan.metrics[0];
}

function rangeMetricValues(metric, range) {
  const base = metric.values;
  if (range === "day") return base;
  const offsets = range === "week" ? [-0.8, 0.4, -0.2, 0.7, -0.4, 0.3, 0] : [1.1, 0.7, 0.3, -0.1, -0.4, 0];
  return offsets.map((offset, index) => {
    const source = base[Math.min(index, base.length - 1)];
    const value = source + offset * Math.max(Math.abs(source) * 0.012, 0.2);
    return Number(value.toFixed(source >= 100 ? 0 : 1));
  });
}

function metricRangeLabels(range, length) {
  const labels = {
    day: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    week: ["周一", "周二", "周三", "周四", "周五", "周六", "今天"],
    month: ["1日", "6日", "12日", "18日", "24日", "30日"]
  };
  return labels[range].slice(0, length);
}

function formatMetricNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function padDateNumber(value) {
  return String(value).padStart(2, "0");
}

function dateInputValue(date) {
  return `${date.getFullYear()}-${padDateNumber(date.getMonth() + 1)}-${padDateNumber(date.getDate())}`;
}

function metricDateLabel() {
  const year = selectedMetricDate.getFullYear();
  const month = selectedMetricDate.getMonth() + 1;
  const day = selectedMetricDate.getDate();
  if (selectedMetricRange === "day") return `${year}年${month}月${day}日`;
  if (selectedMetricRange === "month") return `${year}年${month}月`;
  const end = new Date(selectedMetricDate);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  const startText = start.getFullYear() === year
    ? `${start.getMonth() + 1}月${start.getDate()}日`
    : `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`;
  return `${startText} - ${month}月${day}日`;
}

function shiftMetricDate(step) {
  const next = new Date(selectedMetricDate);
  if (selectedMetricRange === "day") next.setDate(next.getDate() + step);
  if (selectedMetricRange === "week") next.setDate(next.getDate() + step * 7);
  if (selectedMetricRange === "month") next.setMonth(next.getMonth() + step);
  selectedMetricDate = next;
  renderMetricDetail();
}

function renderMetricDetail() {
  applyLatestMetricRecords(focusPlanDashboards[selectedFocusPlan]);
  const metric = getSelectedMetric();
  selectedFocusMetric = metric.id;
  const values = rangeMetricValues(metric, selectedMetricRange);
  const labels = metricRangeLabels(selectedMetricRange, values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const spread = max - min || 1;
  const points = values.map((value, index) => {
    const x = 24 + index * (272 / Math.max(values.length - 1, 1));
    const y = 132 - ((value - min) / spread) * 82;
    return { x, y, value, label: labels[index] };
  });
  metricDetailTitle.textContent = `${metric.name}详情`;
  metricDetailValue.textContent = metric.display;
  metricDetailUnit.textContent = metric.unit;
  metricDetailStatus.textContent = metric.status;
  metricDetailStatus.classList.toggle("attention", Boolean(metric.attention));
  const savedRecords = metricRecordsFor(metric.id);
  metricDetailTime.textContent = savedRecords.length
    ? `最近记录 ${displayMetricRecordTime(savedRecords[0].time)}`
    : `最近记录 ${dateInputValue(selectedMetricDate).replaceAll("-", "/")} 08:20`;
  metricDateCurrent.textContent = metricDateLabel();
  metricDatePicker.value = dateInputValue(selectedMetricDate);
  metricTrendCaption.textContent = selectedMetricRange === "day" ? "近24小时" : selectedMetricRange === "week" ? "近7天" : "近30天";
  metricStatAverage.textContent = `${formatMetricNumber(average)} ${metric.unit}`.trim();
  metricLineChart.innerHTML = `
    <svg viewBox="0 0 320 170" role="img" aria-label="${metric.name}变化趋势">
      <defs><linearGradient id="metricArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3671ff" stop-opacity=".22"/><stop offset="1" stop-color="#3671ff" stop-opacity="0"/></linearGradient></defs>
      <path d="M24 50H296M24 91H296M24 132H296" stroke="#e7edf7" stroke-width="1" stroke-dasharray="4 4"/>
      <path d="M${points.map((point) => `${point.x} ${point.y}`).join(" L")} L296 140 L24 140 Z" fill="url(#metricArea)"/>
      <polyline points="${points.map((point) => `${point.x},${point.y}`).join(" ")}" fill="none" stroke="#3671ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#fff" stroke="#3671ff" stroke-width="2"/><text x="${point.x}" y="158" text-anchor="middle">${point.label}</text>`).join("")}
    </svg>`;
}

function openMetricDetail(metricId) {
  selectedFocusMetric = metricId;
  selectedMetricRange = "day";
  const latest = metricRecordsFor(metricId)[0];
  selectedMetricDate = latest ? new Date(latest.time) : new Date();
  metricRangeTabs?.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.metricRange === "day"));
  renderMetricDetail();
  openSubPage("metricDetailPage");
}

function currentPageId() {
  const activeSub = [...subPages].find((page) => page.classList.contains("active"));
  if (activeSub) return activeSub.id;
  if (minePage.classList.contains("active")) return "minePage";
  if (servicePage.classList.contains("active")) return "servicePage";
  if (planPage.classList.contains("active")) return "planPage";
  return "home";
}

function openSubPage(pageId) {
  const page = document.querySelector(`#${pageId}`);
  if (!page) return;
  pageStack.push(currentPageId());
  document.body.classList.toggle(
    "detail-page-open",
    pageId === "reportDetailPage" || pageId === "aiReparsePage" || pageId === "metricDetailPage" || pageId === "metricRecordsPage" || pageId === "dietRecognizePage" || pageId === "dietResultPage" || pageId === "dietDetailPage" || pageId === "medicineRecordsPage" || pageId === "medicineDetailPage" || pageId === "medicineImagePage"
  );
  homeOnlySections.forEach((item) => item.classList.add("hidden"));
  planPage.classList.remove("active");
  servicePage.classList.remove("active");
  serviceDetailPage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((item) => item.classList.remove("active"));
  page.classList.add("active");
  if (pageId === "reportEditPage") populateReportEditForm();
  medicalFab?.classList.remove("active");
  closeOverlays();
}

function goBackPage() {
  const previous = pageStack.pop() || "minePage";
  document.body.classList.remove("detail-page-open");
  subPages.forEach((item) => item.classList.remove("active"));
  const previousSubPage = document.querySelector(`#${previous}.sub-page`);
  if (previousSubPage) {
    previousSubPage.classList.add("active");
    document.body.classList.toggle(
      "detail-page-open",
      previous === "reportDetailPage" || previous === "aiReparsePage" || previous === "metricDetailPage" || previous === "metricRecordsPage" || previous === "dietRecognizePage" || previous === "dietResultPage" || previous === "dietDetailPage" || previous === "medicineRecordsPage" || previous === "medicineDetailPage" || previous === "medicineImagePage"
    );
  } else if (previous === "minePage") {
    minePage.classList.add("active");
    setProfileTab([...profileTabs].find((tab) => tab.classList.contains("active"))?.dataset.profileTab || "medical");
  } else if (previous === "servicePage") {
    servicePage.classList.add("active");
  } else if (previous === "planPage") {
    planPage.classList.add("active");
  } else {
    homeOnlySections.forEach((item) => item.classList.remove("hidden"));
  }
  closeOverlays();
}

document.addEventListener("click", (event) => {
  const reportButton = event.target.closest("[data-report-id]");
  if (reportButton) {
    openReportDetail(reportButton.dataset.reportId);
    return;
  }
  const deleteReportButton = event.target.closest("[data-delete-report]");
  if (deleteReportButton) {
    deletingReportId = deleteReportButton.dataset.deleteReport;
    closeOverlays();
    sheetMask.classList.add("active");
    reportDeleteDialog.classList.add("active");
    return;
  }
  const opener = event.target.closest("[data-open-page]");
  if (opener) {
    openSubPage(opener.dataset.openPage);
    return;
  }
  if (event.target.closest(".back-page")) {
    goBackPage();
  }
});

document.querySelectorAll(".pill-tabs button, .line-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

document.querySelectorAll(".family-list button:not(.add-family-entry)").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".family-list button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentPatient = {
      id: button.dataset.patientId,
      name: button.dataset.name,
      sex: button.dataset.sex,
      age: button.dataset.age
    };
    updateCurrentPatientView();
    goBackPage();
  });
});

document.querySelector("#saveFamily").addEventListener("click", () => {
  document.querySelectorAll(".sub-page").forEach((page) => page.classList.remove("active"));
  document.querySelector("#familySwitchPage").classList.add("active");
  pageStack = ["minePage"];
});

document.querySelector("#downloadReport")?.addEventListener("click", () => {
  toast.textContent = "报告已保存";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});

document.querySelector("#shareReport")?.addEventListener("click", () => {
  openSubPage("aiReparsePage");
  window.setTimeout(() => {
    document.querySelector("#aiReparsePage")?.classList.remove("active");
    document.querySelector("#reportDetailPage")?.classList.add("active");
    document.body.classList.add("detail-page-open");
  }, 1600);
});
logoutBtn.addEventListener("click", () => {
  closeOverlays();
  sheetMask.classList.add("active");
  logoutDialog.classList.add("active");
});

savePersonalSettings?.addEventListener("click", () => {
  const nickname = personalNickname?.value.trim() || "用户6162";
  if (settingsUserName) settingsUserName.textContent = nickname;
  toast.textContent = "个人设置已保存";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
  goBackPage();
});

document.querySelector("[data-personal-phone]")?.addEventListener("click", () => {
  toast.textContent = "进入手机号绑定";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
});

const cycleRules = {
  none: {
    text: "记录经期后，可预测周期",
    action: "去记录"
  },
  soon: {
    text: "月经快来啦，记得记录哦",
    action: "去记录"
  },
  due: {
    text: "今天可能是经期开始日，要不要记录一下？",
    action: "记录经期"
  },
  stale: {
    text: "好久没更新经期啦",
    action: "去更新"
  }
};

function updateCurrentPatientView() {
  if (profileNameButton) {
    profileNameButton.textContent = currentPatient.name;
  }
  if (profileGenderAge) {
    const sexLabel = currentPatient.sex === "female" ? "女" : currentPatient.sex === "male" ? "男" : "未知";
    profileGenderAge.textContent = currentPatient.age ? `${sexLabel}｜${currentPatient.age}岁` : `${sexLabel}｜待完善`;
  }
  renderPeriodCard();
  renderPeriodDetail();
  updateCycleReminderVisibility();
}

function updateCycleReminderVisibility() {
  if (!cycleReminder) return;
  cycleReminder.classList.toggle("hidden", currentPatient.sex !== "female");
}

function renderPeriodCard() {
  if (!periodCard) return;
  const isFemale = currentPatient.sex === "female";
  periodCard.classList.toggle("hidden", !isFemale);
  if (!isFemale) return;

  const summary = calculatePeriodSummary();
  periodStatusLine.textContent = summary.status;
  periodForecastLine.textContent = summary.forecast;
  periodAverageLine.textContent = summary.average;
  periodAverageLine.hidden = !summary.average;
  periodActionButton.textContent = summary.action;
}

function renderPeriodDetail() {
  if (!periodDetailCurrent) return;
  const summary = calculatePeriodSummary();
  periodDetailCurrent.innerHTML = `
    <strong>${summary.hasRecords ? summary.status : "暂未记录经期"}</strong>
    <p>${summary.forecast}</p>
    ${summary.average ? `<p>${summary.average}</p>` : ""}
    <button type="button" id="periodDetailAction">${summary.action}</button>
  `;
  periodAvgCycle.textContent = `${summary.avgCycle}天`;
  periodAvgLength.textContent = `${summary.avgLength}天`;
  periodHistoryList.innerHTML = summary.records.length ? summary.records.map((record) => {
    const lengthText = record.end ? `${daysBetween(record.start, record.end) + 1}天` : "经期中";
    const cycleText = getCycleText(record, summary.records);
    return `
      <article class="period-record" data-period-id="${record.id}">
        <div class="period-record-main">
          <strong>${formatMonthDay(record.start)} - ${record.end ? formatMonthDay(record.end) : "未结束"}</strong>
          <span>经期天数：${lengthText}${cycleText ? `｜周期：${cycleText}` : ""}</span>
        </div>
        <div class="period-record-actions">
          <button type="button" data-period-edit="${record.id}">编辑</button>
          <button class="delete" type="button" data-period-delete="${record.id}">删除</button>
        </div>
      </article>
    `;
  }).join("") : `<p class="period-empty">暂无经期记录</p>`;
}

function getCycleText(record, recordsDesc) {
  const recordsAsc = [...recordsDesc].reverse();
  const index = recordsAsc.findIndex((item) => item.id === record.id);
  if (index <= 0) return "";
  return `${daysBetween(recordsAsc[index - 1].start, record.start)}天`;
}

function openCycleSheet(mode) {
  cycleSheetMode = mode;
  cycleDate.value = todayString();
  cycleSheetTitle.textContent = mode === "end" ? "记录经期结束" : "记录经期";
  cycleSheetDesc.textContent = mode === "end" ? "请选择本次月经结束日期" : "请选择本次月经开始日期";
  closeOverlays();
  sheetMask.classList.add("active");
  cycleSheet.classList.add("active");
}

function activePeriodRecord() {
  return sortedPeriodRecords().find((record) => !record.end);
}

function startPeriod(startDate) {
  const records = currentPeriodRecords();
  records.push({
    id: `period-${Date.now()}`,
    start: startDate,
    end: null
  });
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function finishPeriod(endDate) {
  const active = activePeriodRecord();
  if (!active) return;
  active.end = endDate;
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function cancelActivePeriod() {
  const active = activePeriodRecord();
  if (!active) return;
  periodRecordsByPatient[currentPatient.id] = currentPeriodRecords().filter((record) => record.id !== active.id);
  savePeriodRecords();
  renderPeriodCard();
  renderPeriodDetail();
}

function openPeriodEdit(recordId) {
  const record = currentPeriodRecords().find((item) => item.id === recordId);
  if (!record) return;
  editingPeriodId = recordId;
  periodEditStart.value = record.start;
  periodEditEnd.value = record.end || "";
  periodEditError.textContent = "";
  closeOverlays();
  sheetMask.classList.add("active");
  periodEditDialog.classList.add("active");
}

function hasOverlap(recordId, start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end || start);
  return currentPeriodRecords().some((record) => {
    if (record.id === recordId) return false;
    const otherStart = parseDate(record.start);
    const otherEnd = parseDate(record.end || record.start);
    return startDate <= otherEnd && endDate >= otherStart;
  });
}

function savePeriodEdit() {
  const record = currentPeriodRecords().find((item) => item.id === editingPeriodId);
  if (!record) return;
  const start = periodEditStart.value;
  const end = periodEditEnd.value;
  const today = todayString();
  let error = "";
  if (!start) error = "经期开始时间不能为空";
  else if (start > today) error = "经期开始时间不能晚于今天";
  else if (end && end < start) error = "经期结束时间不能早于经期开始时间";
  else if (end && end > today) error = "经期结束时间不能晚于今天";
  else if (hasOverlap(record.id, start, end)) error = "当前记录时间范围不能与其他记录重叠";
  if (error) {
    periodEditError.textContent = error;
    return;
  }
  record.start = start;
  record.end = end || null;
  savePeriodRecords();
  closeOverlays();
  renderPeriodCard();
  renderPeriodDetail();
}

function requestPeriodDelete(recordId) {
  deletingPeriodId = recordId;
  closeOverlays();
  sheetMask.classList.add("active");
  periodDeleteDialog.classList.add("active");
}

function confirmPeriodDelete() {
  periodRecordsByPatient[currentPatient.id] = currentPeriodRecords().filter((record) => record.id !== deletingPeriodId);
  deletingPeriodId = "";
  savePeriodRecords();
  closeOverlays();
  renderPeriodCard();
  renderPeriodDetail();
}

function initCycleReminder() {
  if (!cycleReminder || !cycleReminderText || !cycleAction) return;
  const hiddenDate = window.localStorage?.getItem("cycleReminderHiddenDate");
  if (hiddenDate === todayString()) {
    cycleReminder.classList.add("hidden");
    return;
  }
  const rule = cycleRules[cycleReminder.dataset.rule] || cycleRules.soon;
  cycleReminderText.textContent = rule.text;
  cycleAction.textContent = rule.action;
  cycleDate.value = todayString();
}

cycleAction?.addEventListener("click", () => {
  openCycleSheet("start");
});

cycleClose?.addEventListener("click", () => {
  window.localStorage?.setItem("cycleReminderHiddenDate", todayString());
  cycleReminder?.classList.add("hidden");
});

document.querySelector(".cycle-cancel").addEventListener("click", closeOverlays);
document.querySelector(".cycle-confirm").addEventListener("click", () => {
  const selectedDate = cycleDate.value || todayString();
  closeOverlays();
  if (cycleSheetMode === "end") {
    const active = activePeriodRecord();
    if (active && selectedDate < active.start) {
      toast.textContent = "结束时间不能早于开始时间";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    if (active && daysBetween(active.start, selectedDate) === 0) {
      sheetMask.classList.add("active");
      periodConfirmDialog.classList.add("active");
      return;
    }
    finishPeriod(selectedDate);
  } else {
    if (selectedDate > todayString()) {
      toast.textContent = "开始时间不能晚于今天";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    if (hasOverlap("", selectedDate, selectedDate)) {
      toast.textContent = "当前记录时间范围不能与其他记录重叠";
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1600);
      return;
    }
    startPeriod(selectedDate);
    if (cycleReminderText && cycleAction && cycleClose && cycleReminder) {
      cycleReminderText.textContent = "已记录，后续我会帮你持续关注周期变化";
      cycleAction.classList.add("hidden");
      cycleClose.classList.add("hidden");
      window.setTimeout(() => cycleReminder.classList.add("hidden"), 3000);
    }
  }
});

function renderPackages(filter = "all") {
  const visible = filter === "all" ? packages : packages.filter((item) => item.id === filter);
  packageList.innerHTML = visible.map((item) => `
    <article class="package-card" data-id="${item.id}">
      <div class="package-cover service-img ${item.img}" aria-hidden="true"></div>
      <div class="package-info">
        <h3>${item.title}</h3>
        <p class="package-tags">${item.tags}</p>
        <p class="package-sales"><strong>${item.price}</strong><span>${item.sales}</span></p>
      </div>
      <i class="package-arrow"></i>
    </article>
  `).join("");
}

function serviceTagsHtml(tags) {
  const parts = String(tags || "").split("｜").filter(Boolean);
  if (parts.length <= 1) return tags || "";
  const last = parts.pop();
  return `${parts.join("｜")}｜<span>${last}</span>`;
}

function renderServiceDetail(service, source = "service") {
  if (!service) return;
  serviceDetailSource = source;
  const ageText = currentPatient.age ? `${currentPatient.age}岁` : "年龄待完善";
  if (detailPatientName) detailPatientName.textContent = currentPatient.name || "就诊人";
  if (detailPatientMeta) detailPatientMeta.textContent = `${sexText(currentPatient.sex)}｜${ageText}`;
  if (detailPatientAvatar) {
    detailPatientAvatar.className = `detail-patient-avatar ${currentPatient.sex === "male" ? "male" : currentPatient.sex === "female" ? "female" : ""}`;
  }
  if (detailProductCover) detailProductCover.className = `detail-product service-img ${service.img}`;
  if (detailServiceTitle) detailServiceTitle.textContent = service.title;
  if (detailServiceTags) detailServiceTags.innerHTML = serviceTagsHtml(service.tags);
  if (detailServicePrice) detailServicePrice.textContent = service.price;
  if (detailServiceSales) detailServiceSales.textContent = service.sales;
  if (detailServiceDesc) detailServiceDesc.textContent = service.desc;
  if (buyButton) buyButton.textContent = source === "orders" ? "进入服务" : `立即购买 ${service.price}`;
}

function openServiceDetail(serviceId, source = "service") {
  const service = packages.find((item) => item.id === serviceId) || packages[0];
  renderServiceDetail(service, source);
  servicePage.classList.remove("active");
  minePage.classList.remove("active");
  subPages.forEach((page) => page.classList.remove("active"));
  serviceDetailPage.classList.add("active");
  closeOverlays();
}

serviceFilters.forEach((button) => {
  button.addEventListener("click", () => {
    serviceFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderPackages(button.dataset.filter);
  });
});

packageList.addEventListener("click", (event) => {
  const card = event.target.closest(".package-card");
  if (card) openServiceDetail(card.dataset.id, "service");
});

document.querySelector(".orders-panel")?.addEventListener("click", (event) => {
  const card = event.target.closest(".archive-service-card");
  if (!card) return;
  openServiceDetail(card.dataset.serviceId, "orders");
});

function openSheet(sheet) {
  closeOverlays();
  sheetMask.classList.add("active");
  sheet.classList.add("active");
}

function closeOverlays() {
  sheetMask.classList.remove("active");
  cameraPage?.classList.remove("active");
  cameraPage?.classList.remove("diet-camera");
  metricRecordSheet?.classList.remove("active");
  serviceActionSheet.classList.remove("active");
  supportSheet.classList.remove("active");
  shareSheet.classList.remove("active");
  uploadSheet.classList.remove("active");
  purchaseDialog.classList.remove("active");
  logoutDialog.classList.remove("active");
  cycleSheet.classList.remove("active");
  periodConfirmDialog.classList.remove("active");
  periodEditDialog.classList.remove("active");
  periodDeleteDialog.classList.remove("active");
  metricDeleteDialog?.classList.remove("active");
  supplementDialog.classList.remove("active");
  reportDeleteDialog.classList.remove("active");
  taskDeleteDialog.classList.remove("active");
  schedulePatientSheet?.classList.remove("active");
  scheduleCheckinSheet?.classList.remove("active");
  dietUploadSheet?.classList.remove("active");
  dietUploadActionSheet?.classList.remove("active");
  dietGramSheet?.classList.remove("active");
  medicineCheckinSheet?.classList.remove("active");
  medicineTimePicker?.classList.remove("active");
  sportCheckinSheet?.classList.remove("active");
  sportTimePicker?.classList.remove("active");
  sportSuccessDialog?.classList.remove("active");
  weightCheckinPage?.classList.remove("active");
  weightTimePicker?.classList.remove("active");
  waistCheckinSheet?.classList.remove("active");
  waistTimePicker?.classList.remove("active");
  pressureCheckinSheet?.classList.remove("active");
  pressureTimePicker?.classList.remove("active");
  pressureSuccessDialog?.classList.remove("active");
  sugarCheckinSheet?.classList.remove("active");
  sugarTimePicker?.classList.remove("active");
  sugarSuccessDialog?.classList.remove("active");
  checkinSuccessDialog?.classList.remove("active");
}

function setProfileTab(tabName) {
  profileTabs.forEach((tab) => {
    const isActive = tab.dataset.profileTab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  profilePanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.profilePanel === tabName);
  });
  if (medicalFab) {
    medicalFab.classList.toggle("active", tabName === "medical");
  }
}

if (serviceFab) {
  serviceFab.addEventListener("click", () => openSheet(serviceActionSheet));
}
if (uploadFab) {
  uploadFab.addEventListener("click", () => openSheet(uploadSheet));
}
document.querySelector(".archive-detail-btn")?.addEventListener("click", () => {
  setProfileTab("medical");
  toast.textContent = "已切换到健康档案详情";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
});
medicalCategoryTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedMedicalCategory = button.dataset.category;
  medicalCategoryTabs.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderMedicalReports();
});
parseTaskEntry?.addEventListener("click", () => {
  openSubPage("parseTaskPage");
  renderParseTasks();
});
document.querySelectorAll("[data-mock-file]").forEach((button) => {
  button.addEventListener("click", () => addMockFile(button.dataset.mockFile));
});
uploadTypePills?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upload-type]");
  if (!button) return;
  uploadTypePills.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  uploadTypeSelect.value = button.dataset.uploadType;
  renderSelectedFiles();
});
selectedFiles?.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-file]");
  const picker = event.target.closest("[data-mock-file]");
  const camera = event.target.closest("[data-open-camera]");
  const document = event.target.closest("[data-open-document]");
  if (remove) {
    const [removed] = selectedUploadFiles.splice(Number(remove.dataset.removeFile), 1);
    if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
    renderSelectedFiles();
  }
  if (picker) {
    addMockFile(picker.dataset.mockFile);
  }
  if (camera) {
    openCameraPage();
  }
  if (document) {
    documentPicker?.click();
  }
});
cameraBack?.addEventListener("click", returnToUploadSheet);
cameraShutter?.addEventListener("click", captureReportImage);
albumPicker?.addEventListener("change", () => {
  if (albumPicker.files?.length) {
    if (cameraMode === "diet") {
      addDietFiles(albumPicker.files);
      returnToUploadSheet();
    } else {
      addSelectedImages(albumPicker.files);
    }
  }
  albumPicker.value = "";
});
documentPicker?.addEventListener("change", () => {
  if (documentPicker.files?.length) addSelectedDocuments(documentPicker.files);
  documentPicker.value = "";
});
submitUpload?.addEventListener("click", () => {
  if (!selectedUploadFiles.length) return;
  if (hasOversizeFile()) {
    toast.textContent = "文件超过50MB，请重新选择";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  createParseTasks("parsing");
  closeOverlays();
  openSubPage("parseTaskPage");
  toast.textContent = "资料正在上传，AI 正在解析";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
});
submitAndParse?.addEventListener("click", () => {
  if (!selectedUploadFiles.length) {
    addMockFile("上传文件");
  }
  if (hasOversizeFile()) {
    toast.textContent = "文件超过50MB，请重新选择";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
    return;
  }
  createParseTasks("parsing");
  closeOverlays();
  openSubPage("parseTaskPage");
});
parseTaskList?.addEventListener("click", (event) => {
  const supplement = event.target.closest("[data-supplement-task]");
  const reparse = event.target.closest("[data-reparse-task]");
  const deleteTask = event.target.closest("[data-delete-task]");
  const completed = event.target.closest("[data-completed-task]");
  const card = event.target.closest("[data-task-card]");
  if (supplement) openSupplementDialog(supplement.dataset.supplementTask);
  if (completed) {
    openCompletedTaskReport(completed.dataset.completedTask);
    return;
  }
  if (reparse) {
    const task = parseTasks.find((item) => item.id === reparse.dataset.reparseTask);
    if (task) {
      task.status = "parsing";
      task.reason = "";
      saveMedicalStores();
      renderParseTasks();
    }
  }
  if (deleteTask) {
    deletingTaskId = deleteTask.dataset.deleteTask;
    closeOverlays();
    sheetMask.classList.add("active");
    taskDeleteDialog.classList.add("active");
  }
  if (!supplement && !reparse && !deleteTask && card) {
    if (card.dataset.taskStatus === "pending") {
      openSupplementDialog(card.dataset.taskCard);
    }
    if (card.dataset.taskStatus === "completed") {
      openCompletedTaskReport(card.dataset.taskCard);
    }
  }
});
profileTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setProfileTab(tab.dataset.profileTab);
    renderPeriodCard();
  });
});

focusMetricGrid?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-focus-metric]");
  if (card) openMetricDetail(card.dataset.focusMetric);
});

metricRangeTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-metric-range]");
  if (!button) return;
  selectedMetricRange = button.dataset.metricRange;
  metricRangeTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  renderMetricDetail();
});

metricDateNav?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-metric-date-step]");
  if (stepButton) {
    shiftMetricDate(Number(stepButton.dataset.metricDateStep));
    return;
  }
  if (event.target.closest("#metricDateCurrent")) {
    if (typeof metricDatePicker.showPicker === "function") metricDatePicker.showPicker();
    else metricDatePicker.click();
  }
});

metricDatePicker?.addEventListener("change", () => {
  if (!metricDatePicker.value) return;
  const [year, month, day] = metricDatePicker.value.split("-").map(Number);
  selectedMetricDate = new Date(year, month - 1, day);
  renderMetricDetail();
});

metricRecordEntry?.addEventListener("click", openMetricRecordSheet);
metricAllRecords?.addEventListener("click", () => {
  renderAllMetricRecords();
  openSubPage("metricRecordsPage");
});
metricRecordsGroups?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-metric-record]");
  if (deleteButton) openMetricDeleteDialog(deleteButton.dataset.deleteMetricRecord);
});
document.querySelector(".metric-record-close")?.addEventListener("click", closeOverlays);
metricRecordConfirm?.addEventListener("click", saveMetricRecord);
document.querySelector(".metric-delete-confirm")?.addEventListener("click", confirmMetricRecordDelete);

dietUploadArea?.addEventListener("click", () => openDietCameraPage());
dietImageGrid?.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove-diet-image]");
  const add = event.target.closest("[data-add-diet-image]");
  if (remove) {
    const [removed] = dietUploadImages.splice(Number(remove.dataset.removeDietImage), 1);
    if (removed?.preview?.startsWith("blob:")) URL.revokeObjectURL(removed.preview);
    renderDietUploadImages();
  }
  if (add) openDietCameraPage();
});
dietUploadActionSheet?.addEventListener("click", (event) => {
  if (event.target.closest(".diet-action-cancel")) {
    dietUploadActionSheet.classList.remove("active");
    return;
  }
  const action = event.target.closest("[data-diet-upload-action]");
  if (!action) return;
  dietUploadActionSheet.classList.remove("active");
  if (action.dataset.dietUploadAction === "camera") {
    addDietMockImage();
  } else {
    dietImagePicker?.click();
  }
});
dietImagePicker?.addEventListener("change", () => {
  if (dietImagePicker.files?.length) addDietFiles(dietImagePicker.files);
  dietImagePicker.value = "";
});
dietMealOptions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-meal]");
  if (!button) return;
  dietSelectedMeal = button.dataset.dietMeal;
  renderDietMealOptions();
});
dietMealTime?.addEventListener("change", () => {
  const selectedTime = dietMealTime.value ? new Date(dietMealTime.value) : new Date();
  if (Number.isNaN(selectedTime.getTime())) return;
  dietSelectedMeal = mealByTime(selectedTime);
  renderDietMealOptions();
});
dietCancelUpload?.addEventListener("click", closeOverlays);
dietStartRecognize?.addEventListener("click", startDietRecognition);
dietRetryRecognize?.addEventListener("click", () => {
  dietRecognitionIndex = 0;
  runDietRecognitionStep();
});
dietManualFill?.addEventListener("click", () => {
  if (!dietResults.length) dietResults = buildDietResults();
  openDietResultPage();
});
dietResultTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-result-index]");
  if (!button) return;
  dietResultIndex = Number(button.dataset.dietResultIndex);
  renderDietResult();
});
dietFoodList?.addEventListener("click", (event) => {
  const editFood = event.target.closest("[data-edit-food]");
  if (editFood) openDietGramSheet(editFood.dataset.editFood);
});
dietDetailRecords?.addEventListener("click", (event) => {
  const mealButton = event.target.closest("[data-detail-meal-index]");
  if (mealButton) {
    openDietMealResult(Number(mealButton.dataset.detailMealIndex));
    return;
  }
  const row = event.target.closest("[data-detail-food]");
  if (row) openDietDetailFoodSheet(row.dataset.detailFood);
});
dietDetailRecords?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const mealButton = event.target.closest("[data-detail-meal-index]");
  if (mealButton) {
    event.preventDefault();
    openDietMealResult(Number(mealButton.dataset.detailMealIndex));
    return;
  }
  const row = event.target.closest("[data-detail-food]");
  if (!row) return;
  event.preventDefault();
  openDietDetailFoodSheet(row.dataset.detailFood);
});
document.querySelector(".diet-gram-close")?.addEventListener("click", closeDietGramSheet);
document.querySelector(".diet-gram-cancel")?.addEventListener("click", closeDietGramSheet);
dietGramConfirm?.addEventListener("click", confirmDietGramEdit);
dietFoodSheetDelete?.addEventListener("click", deleteEditingDietFood);
dietResultTime?.addEventListener("change", renderDietResult);
dietConfirmCheckin?.addEventListener("click", confirmDietCheckin);
dietDetailCheckin?.addEventListener("click", () => openDietUploadSheet());
dietDetailRecordFood?.addEventListener("click", () => openDietUploadSheet());
dietDetailRangeTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-diet-range]");
  if (!button) return;
  dietDetailRangeMode = button.dataset.dietRange;
  dietDetailRangeDate = new Date();
  renderDietDetailRange();
});
dietDetailRangeTrigger?.addEventListener("click", () => {
  if (dietDetailRangeMode === "month") {
    if (typeof dietDetailMonthInput?.showPicker === "function") dietDetailMonthInput.showPicker();
    else dietDetailMonthInput?.click();
    return;
  }
  if (dietDetailRangeMode === "year") {
    const nextYear = window.prompt("请选择年份", String(dietDetailRangeDate.getFullYear()));
    if (!nextYear) return;
    const year = Number(nextYear);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      showToast("请输入正确年份");
      return;
    }
    dietDetailRangeDate = new Date(year, 0, 1);
    renderDietDetailRange();
    return;
  }
  if (typeof dietDetailDayInput?.showPicker === "function") dietDetailDayInput.showPicker();
  else dietDetailDayInput?.click();
});
dietDetailDayInput?.addEventListener("change", () => {
  if (!dietDetailDayInput.value) return;
  const [year, month, day] = dietDetailDayInput.value.split("-").map(Number);
  dietDetailRangeDate = new Date(year, month - 1, day);
  renderDietDetailRange();
});
dietDetailMonthInput?.addEventListener("change", () => {
  if (!dietDetailMonthInput.value) return;
  const [year, month] = dietDetailMonthInput.value.split("-").map(Number);
  dietDetailRangeDate = new Date(year, month - 1, 1);
  renderDietDetailRange();
});
medicineClose?.addEventListener("click", closeOverlays);
medicineTimeTrigger?.addEventListener("click", openMedicineTimePicker);
document.querySelector(".medicine-picker-cancel")?.addEventListener("click", closeMedicineTimePicker);
document.querySelector(".medicine-picker-confirm")?.addEventListener("click", confirmMedicineTimePicker);
medicineNote?.addEventListener("input", updateMedicineNoteCount);
medicineAdd?.addEventListener("click", () => {
  saveMedicineNamesFromDom();
  addMedicineItem();
});
medicineList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-medicine-name]");
  if (!input) return;
  const item = medicineItems.find((medicine) => medicine.id === input.dataset.medicineName);
  if (item) item.name = input.value;
});
medicineList?.addEventListener("click", (event) => {
  const typeButton = event.target.closest("[data-medicine-item-type]");
  const deleteButton = event.target.closest("[data-delete-medicine]");
  const addImage = event.target.closest("[data-add-medicine-image]");
  const removeImage = event.target.closest("[data-remove-medicine-image]");
  if (typeButton) {
    saveMedicineNamesFromDom();
    const item = medicineItems.find((medicine) => medicine.id === typeButton.dataset.medicineItemType);
    if (!item) return;
    item.type = typeButton.dataset.itemType === "nutrition" ? "nutrition" : "medicine";
    renderMedicineItems();
    return;
  }
  if (deleteButton) {
    saveMedicineNamesFromDom();
    deleteMedicineItem(deleteButton.dataset.deleteMedicine);
    return;
  }
  if (addImage) {
    saveMedicineNamesFromDom();
    medicineImageTargetId = addImage.dataset.addMedicineImage;
    medicineImagePicker?.click();
    return;
  }
  if (removeImage) {
    const item = medicineItems.find((medicine) => medicine.id === removeImage.dataset.removeMedicineImage);
    const index = Number(removeImage.dataset.imageIndex);
    if (!item || Number.isNaN(index)) return;
    const [removed] = item.images.splice(index, 1);
    if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
    renderMedicineItems();
  }
});
medicineImagePicker?.addEventListener("change", () => {
  if (medicineImagePicker.files?.length) addMedicineImages(medicineImagePicker.files);
  medicineImagePicker.value = "";
});
medicineConfirm?.addEventListener("click", confirmMedicineCheckin);
medicineRecordsList?.addEventListener("click", (event) => {
  const row = event.target.closest("[data-medicine-record]");
  if (!row) return;
  openMedicineDetailPage(row.dataset.medicineRecord);
});
medicineDetailList?.addEventListener("click", (event) => {
  const image = event.target.closest("[data-medicine-image]");
  if (!image) return;
  openMedicineImagePage(image.dataset.medicineImage, Number(image.dataset.imageIndex || 0));
});
medicineDetailEdit?.addEventListener("click", () => openMedicineCheckinSheet(selectedMedicineRecordId));
medicineDetailDelete?.addEventListener("click", deleteSelectedMedicineRecord);
medicineImageClose?.addEventListener("click", goBackPage);
medicineImagePrev?.addEventListener("click", () => stepMedicineImage(-1));
medicineImageNext?.addEventListener("click", () => stepMedicineImage(1));
medicineImageThumbs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preview-index]");
  if (!button) return;
  medicinePreviewIndex = Number(button.dataset.previewIndex || 0);
  renderMedicineImagePage();
});
sportClose?.addEventListener("click", closeOverlays);
sportTypeGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sport-type]");
  if (!button) return;
  sportSelectedType = button.dataset.sportType;
  renderSportCheckin();
  if (sportSelectedType === "other") {
    window.setTimeout(() => sportOtherInput?.focus(), 80);
  }
});
sportOtherInput?.addEventListener("input", () => {
  sportOtherName = sportOtherInput.value.trim();
  renderSportCheckin();
});
sportNoteInput?.addEventListener("input", updateSportNoteCount);
sportMinus?.addEventListener("click", () => {
  sportDuration = Math.max(5, sportDuration - 5);
  renderSportCheckin();
});
sportPlus?.addEventListener("click", () => {
  sportDuration = Math.min(180, sportDuration + 5);
  renderSportCheckin();
});
sportTimeTrigger?.addEventListener("click", openSportTimePicker);
document.querySelector(".sport-picker-cancel")?.addEventListener("click", closeSportTimePicker);
document.querySelector(".sport-picker-confirm")?.addEventListener("click", confirmSportTimePicker);
sportSubmit?.addEventListener("click", submitSportCheckin);
sportSuccessDone?.addEventListener("click", closeSportSuccessDialog);
weightCheckinPage?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-weight-step]");
  if (!stepButton) return;
  stepWeightField(stepButton.dataset.weightStep, Number(stepButton.dataset.delta));
});
weightValueInput?.addEventListener("input", () => validateWeightInputs(false));
weightFatInput?.addEventListener("input", () => validateWeightInputs(false));
weightTimeTrigger?.addEventListener("click", openWeightTimePicker);
document.querySelector(".weight-picker-cancel")?.addEventListener("click", closeWeightTimePicker);
document.querySelector(".weight-picker-confirm")?.addEventListener("click", confirmWeightTimePicker);
document.querySelector(".weight-sheet-close")?.addEventListener("click", closeOverlays);
weightNoteInput?.addEventListener("input", updateWeightNoteCount);
weightSubmit?.addEventListener("click", submitWeightCheckin);
waistValueInput?.addEventListener("input", () => {
  if (waistError) waistError.textContent = "";
});
waistTimeTrigger?.addEventListener("click", openWaistTimePicker);
document.querySelector(".waist-picker-cancel")?.addEventListener("click", closeWaistTimePicker);
document.querySelector(".waist-picker-confirm")?.addEventListener("click", confirmWaistTimePicker);
waistSubmit?.addEventListener("click", saveWaistCheckin);
pressureCheckinSheet?.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-pressure-step]");
  if (!stepButton) return;
  stepPressureField(stepButton.dataset.pressureStep, Number(stepButton.dataset.delta));
});
pressureSystolicInput?.addEventListener("input", () => validatePressureInputs(false));
pressureDiastolicInput?.addEventListener("input", () => validatePressureInputs(false));
pressurePulseInput?.addEventListener("input", () => validatePressureInputs(false));
pressureTimeTrigger?.addEventListener("click", openPressureTimePicker);
document.querySelector(".pressure-picker-cancel")?.addEventListener("click", closePressureTimePicker);
document.querySelector(".pressure-picker-confirm")?.addEventListener("click", confirmPressureTimePicker);
pressureClose?.addEventListener("click", closeOverlays);
pressureNoteInput?.addEventListener("input", updatePressureNoteCount);
pressureSubmit?.addEventListener("click", submitPressureCheckin);
pressureSuccessDone?.addEventListener("click", closeOverlays);
sugarPeriodGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sugar-period]");
  if (!button) return;
  sugarSelectedPeriod = button.dataset.sugarPeriod;
  renderSugarPeriodGrid();
});
sugarValueInput?.addEventListener("input", () => validateSugarInput(false));
sugarTimeTrigger?.addEventListener("click", openSugarTimePicker);
document.querySelector(".sugar-picker-cancel")?.addEventListener("click", closeSugarTimePicker);
document.querySelector(".sugar-picker-confirm")?.addEventListener("click", confirmSugarTimePicker);
sugarClose?.addEventListener("click", closeOverlays);
sugarNoteInput?.addEventListener("input", updateSugarNoteCount);
sugarSubmit?.addEventListener("click", submitSugarCheckin);
checkinSuccessDone?.addEventListener("click", closeOverlays);

orderStatusTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order-tab]");
  if (!button) return;
  const tab = button.dataset.orderTab;
  orderStatusTabs.querySelectorAll("[data-order-tab]").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  orderPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.orderPanel === tab);
  });
});

periodCard?.addEventListener("click", (event) => {
  if (event.target.closest("#periodActionButton")) return;
  openSubPage("periodDetailPage");
  renderPeriodDetail();
});
periodActionButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  openCycleSheet(calculatePeriodSummary().inPeriod ? "end" : "start");
});
periodDetailCurrent?.addEventListener("click", (event) => {
  if (event.target.closest("#periodDetailAction")) {
    openCycleSheet(calculatePeriodSummary().inPeriod ? "end" : "start");
  }
});
periodHistoryList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-period-edit]");
  const deleteButton = event.target.closest("[data-period-delete]");
  if (editButton) openPeriodEdit(editButton.dataset.periodEdit);
  if (deleteButton) requestPeriodDelete(deleteButton.dataset.periodDelete);
});
let periodTouchX = 0;
periodHistoryList?.addEventListener("touchstart", (event) => {
  periodTouchX = event.touches[0]?.clientX || 0;
});
periodHistoryList?.addEventListener("touchend", (event) => {
  const record = event.target.closest(".period-record");
  if (!record) return;
  const endX = event.changedTouches[0]?.clientX || periodTouchX;
  const delta = endX - periodTouchX;
  periodHistoryList.querySelectorAll(".period-record").forEach((item) => {
    if (item !== record) item.classList.remove("swiped");
  });
  if (delta < -30) record.classList.add("swiped");
  if (delta > 30) record.classList.remove("swiped");
});
let reportTouchX = 0;
medicalReportList?.addEventListener("touchstart", (event) => {
  reportTouchX = event.touches[0]?.clientX || 0;
});
medicalReportList?.addEventListener("touchend", (event) => {
  const row = event.target.closest(".report-row");
  if (!row) return;
  const endX = event.changedTouches[0]?.clientX || reportTouchX;
  const delta = endX - reportTouchX;
  medicalReportList.querySelectorAll(".report-row").forEach((item) => {
    if (item !== row) item.classList.remove("swiped");
  });
  if (delta > 30) row.classList.add("swiped");
  if (delta < -30) row.classList.remove("swiped");
});
document.querySelector(".period-end-confirm")?.addEventListener("click", () => {
  cancelActivePeriod();
  closeOverlays();
});
document.querySelector(".period-edit-save")?.addEventListener("click", savePeriodEdit);
document.querySelector(".period-delete-confirm")?.addEventListener("click", confirmPeriodDelete);
saveReportInfo?.addEventListener("click", () => {
  const report = medicalReports.find((item) => item.id === selectedReportId);
  if (!report) return;
  report.name = detailReportName.value || report.name;
  report.type = normalizeReportType(detailReportType.value || report.type);
  report.org = detailReportOrg.value || report.org;
  report.reportTime = detailReportDate.value || report.reportTime;
  saveMedicalStores();
  renderMedicalReports();
  toast.textContent = "资料信息已更新";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
});

saveReportEdit?.addEventListener("click", saveReportEditAndBack);
document.querySelector(".supplement-save")?.addEventListener("click", saveSupplement);
document.querySelector(".report-delete-confirm")?.addEventListener("click", () => {
  medicalReports = medicalReports.filter((report) => report.id !== deletingReportId);
  deletingReportId = "";
  saveMedicalStores();
  closeOverlays();
  renderMedicalReports();
});
document.querySelector(".task-delete-confirm")?.addEventListener("click", () => {
  parseTasks = parseTasks.filter((task) => task.id !== deletingTaskId);
  deletingTaskId = "";
  saveMedicalStores();
  closeOverlays();
  renderParseTasks();
});
serviceSupport?.addEventListener("click", () => openSheet(supportSheet));
detailShare.addEventListener("click", () => openSheet(shareSheet));
buyButton.addEventListener("click", () => {
  closeOverlays();
  sheetMask.classList.add("active");
  purchaseDialog.classList.add("active");
});
sheetMask.addEventListener("click", closeOverlays);
document.querySelectorAll(".sheet-cancel, .dialog-cancel, .dialog-confirm").forEach((button) => {
  button.addEventListener("click", closeOverlays);
});

favoriteBtn?.addEventListener("click", () => {
  favoriteBtn.classList.toggle("active");
  favoriteBtn.querySelector("i").classList.toggle("active");
  favoriteBtn.lastChild.textContent = favoriteBtn.classList.contains("active") ? "已收藏" : "收藏";
  if (favoriteBtn.classList.contains("active")) {
    favoriteBtn.setAttribute("aria-label", "已加入收藏");
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
  }
});

detailBack.addEventListener("click", () => {
  serviceDetailPage.classList.remove("active");
  if (serviceDetailSource === "orders") {
    minePage.classList.add("active");
    setProfileTab("orders");
  } else {
    servicePage.classList.add("active");
  }
  closeOverlays();
});

renderMainCard("improving");
updateHomeServiceState("improving");
setProfileTab("medical");
updateCurrentPatientView();
renderMedicalReports();
renderParseTasks();
renderSelectedFiles();
renderPackages();
updateMedicineScheduleCard();
initCycleReminder();
renderFocusPlans();

const initialView = window.location.hash.replace("#", "");
if (["home", "plan", "service", "mine"].includes(initialView)) {
  tabbarLinks.forEach((item) => item.classList.toggle("active", item.dataset.view === initialView));
  switchView(initialView);
}
