const states = {
  empty: {
    type: "empty"
  },
  initial: {
    type: "score",
    className: "initial",
    label: "健康评分",
    score: 78,
    abnormalCount: 3,
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
    abnormalCount: 7,
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
    abnormalCount: 6,
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
    abnormalCount: 0,
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
const homeServiceList = document.querySelector("#homeServiceList");
const homeServiceViewAll = document.querySelector("#homeServiceViewAll");
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
const refundApplicationPage = document.querySelector("#refundApplicationPage");
const refundProgressPage = document.querySelector("#refundProgressPage");
const refundSuccessPage = document.querySelector("#refundSuccessPage");
const refundFailedPage = document.querySelector("#refundFailedPage");
const servicePurchaseSuccessPage = document.querySelector("#servicePurchaseSuccessPage");
const purchaseSuccessBack = document.querySelector("#purchaseSuccessBack");
const purchaseSuccessServiceTitle = document.querySelector("#purchaseSuccessServiceTitle");
const purchaseSuccessQuantity = document.querySelector("#purchaseSuccessQuantity");
const purchaseSuccessAmount = document.querySelector("#purchaseSuccessAmount");
const bindServiceUserButton = document.querySelector("#bindServiceUserButton");
const purchaseSuccessMore = document.querySelector("#purchaseSuccessMore");
const purchaseSuccessBindingHint = document.querySelector("#purchaseSuccessBindingHint");
const detailBoundPatient = document.querySelector("#detailBoundPatient");
const serviceUserMask = document.querySelector("#serviceUserMask");
const serviceUserSheet = document.querySelector("#serviceUserSheet");
const serviceUserClose = document.querySelector("#serviceUserClose");
const serviceUserList = document.querySelector("#serviceUserList");
const serviceUserConfirm = document.querySelector("#serviceUserConfirm");
const bindingConfirmMask = document.querySelector("#bindingConfirmMask");
const bindingConfirmDialog = document.querySelector("#bindingConfirmDialog");
const bindingConfirmCancel = document.querySelector("#bindingConfirmCancel");
const bindingConfirmSubmit = document.querySelector("#bindingConfirmSubmit");
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
const orderServiceList = document.querySelector("#orderServiceList");
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
const aiKeyResultStats = document.querySelector("#aiKeyResultStats");
const aiKeyResultMore = document.querySelector("#aiKeyResultMore");
const aiKeyResultsSheet = document.querySelector("#aiKeyResultsSheet");
const aiKeyResultsSheetStats = document.querySelector("#aiKeyResultsSheetStats");
const aiKeyResultsAll = document.querySelector("#aiKeyResultsAll");
const aiKeyResultsClose = document.querySelector("#aiKeyResultsClose");
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
const purchasePackageCover = document.querySelector("#purchasePackageCover");
const purchasePackageTitle = document.querySelector("#purchasePackageTitle");
const purchasePackageTags = document.querySelector("#purchasePackageTags");
const purchasePackagePrice = document.querySelector("#purchasePackagePrice");
const purchasePhoneInput = document.querySelector("#purchasePhoneInput");
const purchasePhoneError = document.querySelector("#purchasePhoneError");
const purchaseCodeInput = document.querySelector("#purchaseCodeInput");
const purchaseCodeSend = document.querySelector("#purchaseCodeSend");
const purchaseCodeHint = document.querySelector("#purchaseCodeHint");
const purchaseCodeError = document.querySelector("#purchaseCodeError");
const purchaseAgreementCheck = document.querySelector("#purchaseAgreementCheck");
const purchaseAgreementError = document.querySelector("#purchaseAgreementError");
const purchaseTotalQuantity = document.querySelector("#purchaseTotalQuantity");
const purchaseTotalAmount = document.querySelector("#purchaseTotalAmount");
const purchaseConfirmButton = document.querySelector("#purchaseConfirmButton");
const purchaseAgreementSheet = document.querySelector("#purchaseAgreementSheet");
const purchaseAgreementMask = document.querySelector("#purchaseAgreementMask");
const purchaseAgreementTitle = document.querySelector("#purchaseAgreementTitle");
const purchaseAgreementContent = document.querySelector("#purchaseAgreementContent");
const purchaseAgreementClose = document.querySelector("#purchaseAgreementClose");
const detailBack = document.querySelector("#detailBack");
const detailShare = document.querySelector("#detailShare");
const serviceSupport = document.querySelector("#serviceSupport");
const favoriteBtn = document.querySelector("#favoriteBtn");
const buyButton = document.querySelector("#buyButton");
const refundAfterSalesButton = document.querySelector("#refundAfterSalesButton");
const detailFooterPrice = document.querySelector("#detailFooterPrice");
const refundApplicationForm = document.querySelector("#refundApplicationForm");
const refundApplicationCover = document.querySelector("#refundApplicationCover");
const refundApplicationTitle = document.querySelector("#refundApplicationTitle");
const refundApplicationTags = document.querySelector("#refundApplicationTags");
const refundApplicationPrice = document.querySelector("#refundApplicationPrice");
const refundApplicationQuantity = document.querySelector("#refundApplicationQuantity");
const refundReasonSelect = document.querySelector("#refundReasonSelect");
const refundReasonError = document.querySelector("#refundReasonError");
const refundAmountInput = document.querySelector("#refundAmountInput");
const refundAmountHint = document.querySelector("#refundAmountHint");
const refundAmountError = document.querySelector("#refundAmountError");
const refundDescriptionInput = document.querySelector("#refundDescriptionInput");
const refundDescriptionCount = document.querySelector("#refundDescriptionCount");
const refundDescriptionError = document.querySelector("#refundDescriptionError");
const refundSubmitAmount = document.querySelector("#refundSubmitAmount");
const refundProgressCover = document.querySelector("#refundProgressCover");
const refundProgressTitle = document.querySelector("#refundProgressTitle");
const refundProgressAmount = document.querySelector("#refundProgressAmount");
const refundProgressMoney = document.querySelector("#refundProgressMoney");
const refundProgressOrderNo = document.querySelector("#refundProgressOrderNo");
const refundProgressOrderTime = document.querySelector("#refundProgressOrderTime");
const refundProgressReason = document.querySelector("#refundProgressReason");
const refundProgressSubmittedAt = document.querySelector("#refundProgressSubmittedAt");
const refundWithdrawButton = document.querySelector("#refundWithdrawButton");
const refundWithdrawMask = document.querySelector("#refundWithdrawMask");
const refundWithdrawDialog = document.querySelector("#refundWithdrawDialog");
const refundWithdrawCancel = document.querySelector("#refundWithdrawCancel");
const refundWithdrawConfirm = document.querySelector("#refundWithdrawConfirm");
const refundSuccessCover = document.querySelector("#refundSuccessCover");
const refundSuccessTitle = document.querySelector("#refundSuccessTitle");
const refundSuccessAmount = document.querySelector("#refundSuccessAmount");
const refundSuccessMoney = document.querySelector("#refundSuccessMoney");
const refundSuccessReason = document.querySelector("#refundSuccessReason");
const refundSuccessSubmittedAt = document.querySelector("#refundSuccessSubmittedAt");
const refundSuccessOrderNo = document.querySelector("#refundSuccessOrderNo");
const refundSuccessOrderTime = document.querySelector("#refundSuccessOrderTime");
const refundFailedCover = document.querySelector("#refundFailedCover");
const refundFailedTitle = document.querySelector("#refundFailedTitle");
const refundFailedAmount = document.querySelector("#refundFailedAmount");
const refundFailedMoney = document.querySelector("#refundFailedMoney");
const refundFailedRequestReason = document.querySelector("#refundFailedRequestReason");
const refundFailedSubmittedAt = document.querySelector("#refundFailedSubmittedAt");
const refundFailedAt = document.querySelector("#refundFailedAt");
const refundFailedReason = document.querySelector("#refundFailedReason");
const refundFailedOrderNo = document.querySelector("#refundFailedOrderNo");
const refundFailedOrderTime = document.querySelector("#refundFailedOrderTime");
const refundRetryButton = document.querySelector("#refundRetryButton");
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
const portraitFigure = document.querySelector("#portraitFigure");
const portraitCurrentIcon = document.querySelector("#portraitCurrentIcon");
const portraitOrganPanelTitle = document.querySelector("#portraitOrganPanelTitle");
const portraitOrganPanelHint = document.querySelector("#portraitOrganPanelHint");
const portraitOrganList = document.querySelector("#portraitOrganList");
const portraitRegionList = document.querySelector("#portraitRegionList");
const portraitMarkerLayer = document.querySelector("#portraitMarkerLayer");
const portraitOrganInfo = document.querySelector("#portraitOrganInfo");
const portraitInfoIcon = document.querySelector("#portraitInfoIcon");
const portraitInfoTitle = document.querySelector("#portraitInfoTitle");
const portraitInfoRisk = document.querySelector("#portraitInfoRisk");
const portraitInfoDesc = document.querySelector("#portraitInfoDesc");
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
const focusPlanSwitch = document.querySelector("#focusPlanSwitch");
const focusMetricGrid = document.querySelector("#focusMetricGrid");
const metricDetailPage = document.querySelector("#metricDetailPage");
const metricDetailTitle = document.querySelector("#metricDetailTitle");
const metricDetailSummary = document.querySelector(".metric-detail-summary");
const metricDetailValue = document.querySelector("#metricDetailValue");
const metricDetailUnit = document.querySelector("#metricDetailUnit");
const metricDetailStatus = document.querySelector("#metricDetailStatus");
const metricDetailTime = document.querySelector("#metricDetailTime");
const metricRangeTabs = document.querySelector("#metricRangeTabs");
const metricDateNav = document.querySelector("#metricDateNav");
const metricDateCurrent = document.querySelector("#metricDateCurrent span");
const metricDatePicker = document.querySelector("#metricDatePicker");
const metricTrendCaption = document.querySelector("#metricTrendCaption");
const metricTrendCard = document.querySelector(".metric-trend-card");
const metricLineChart = document.querySelector("#metricLineChart");
const metricStatAverage = document.querySelector("#metricStatAverage");
const metricAverageCard = document.querySelector(".metric-average-card");
const metricDetailActions = document.querySelector(".metric-detail-actions");
const metricAllRecords = document.querySelector("#metricAllRecords");
const heartOverviewCard = document.querySelector("#heartOverviewCard");
const heartRecordsSection = document.querySelector("#heartRecordsSection");
const heartRecordsList = document.querySelector("#heartRecordsList");
const allCheckinFilters = document.querySelector("#allCheckinFilters");
const metricRecordsGroups = document.querySelector("#metricRecordsGroups");
const metricDeleteDialog = document.querySelector("#metricDeleteDialog");
const weightDetailRecordsSection = document.querySelector("#weightDetailRecordsSection");
const weightDetailRecords = document.querySelector("#weightDetailRecords");
const weightRecordDetailDialog = document.querySelector("#weightRecordDetailDialog");
const weightRecordDetailBody = document.querySelector("#weightRecordDetailBody");
const weightRecordDeleteAction = document.querySelector("#weightRecordDeleteAction");
const weightRecordSaveAction = document.querySelector("#weightRecordSaveAction");
const heartRecordDetailDialog = document.querySelector("#heartRecordDetailDialog");
const heartRecordDetailBody = document.querySelector("#heartRecordDetailBody");
const heartRecordDeleteAction = document.querySelector("#heartRecordDeleteAction");
const heartRecordSaveAction = document.querySelector("#heartRecordSaveAction");
const metricRecordEntry = document.querySelector("#metricRecordEntry");
const metricRecordSheet = document.querySelector("#metricRecordSheet");
const metricRecordSheetTitle = document.querySelector("#metricRecordSheetTitle");
const metricRecordFields = document.querySelector("#metricRecordFields");
const metricRecordTime = document.querySelector("#metricRecordTime");
const metricRecordTimeLabel = document.querySelector("#metricRecordTimeLabel");
const metricRecordTimeText = document.querySelector("#metricRecordTimeText");
const metricRecordTimeTrigger = document.querySelector("#metricRecordTimeTrigger");
const metricRecordTimePicker = document.querySelector("#metricRecordTimePicker");
const metricRecordPickerDate = document.querySelector("#metricRecordPickerDate");
const metricRecordPickerHour = document.querySelector("#metricRecordPickerHour");
const metricRecordPickerMinute = document.querySelector("#metricRecordPickerMinute");
const metricRecordNoteField = document.querySelector("#metricRecordNoteField");
const metricRecordNote = document.querySelector("#metricRecordNote");
const metricRecordNoteCount = document.querySelector("#metricRecordNoteCount");
const metricRecordError = document.querySelector("#metricRecordError");
const metricRecordConfirm = document.querySelector("#metricRecordConfirm");
const metricRecordTimeField = document.querySelector(".metric-record-time");
const dietUploadSheet = document.querySelector("#dietUploadSheet");
const dietUploadActionSheet = document.querySelector("#dietUploadActionSheet");
const dietUploadArea = document.querySelector("#dietUploadArea");
const dietImageGrid = document.querySelector("#dietImageGrid");
const dietImagePicker = document.querySelector("#dietImagePicker");
const dietMealOptions = document.querySelector("#dietMealOptions");
const dietMealTime = document.querySelector("#dietMealTime");
const dietMealTimeText = document.querySelector("#dietMealTimeText");
const dietMealTimeTrigger = document.querySelector("#dietMealTimeTrigger");
const dietTimePicker = document.querySelector("#dietTimePicker");
const dietPickerDate = document.querySelector("#dietPickerDate");
const dietPickerHour = document.querySelector("#dietPickerHour");
const dietPickerMinute = document.querySelector("#dietPickerMinute");
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
const dietResultPage = document.querySelector("#dietResultPage");
const dietFoodList = document.querySelector("#dietFoodList");
const dietMealTitle = document.querySelector("#dietMealTitle");
const dietRecordTimeText = document.querySelector("#dietRecordTimeText");
const dietResultTime = document.querySelector("#dietResultTime");
const dietResultNoteInput = document.querySelector("#dietResultNoteInput");
const dietGramSheet = document.querySelector("#dietGramSheet");
const dietEditTitle = document.querySelector("#dietEditTitle");
const dietEditFoodThumb = document.querySelector("#dietEditFoodThumb");
const dietEditFoodMeta = document.querySelector("#dietEditFoodMeta");
const dietFoodNameInput = document.querySelector("#dietFoodNameInput");
const dietEditMealSelect = document.querySelector("#dietEditMealSelect");
const dietEditTimeInput = document.querySelector("#dietEditTimeInput");
const dietEditTimeTrigger = document.querySelector("#dietEditTimeTrigger");
const dietEditTimeText = document.querySelector("#dietEditTimeText");
const dietGramInput = document.querySelector("#dietGramInput");
const dietGramConfirm = document.querySelector("#dietGramConfirm");
const dietFoodSheetDelete = document.querySelector("#dietFoodSheetDelete");
const dietTaskBindSheet = document.querySelector("#dietTaskBindSheet");
const dietTaskBindSummary = document.querySelector("#dietTaskBindSummary");
const dietTaskBindList = document.querySelector("#dietTaskBindList");
const dietTaskBindClose = document.querySelector("#dietTaskBindClose");
const dietTaskBindCancel = document.querySelector("#dietTaskBindCancel");
const dietTaskBindConfirm = document.querySelector("#dietTaskBindConfirm");
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
const dietGramCancel = document.querySelector("#dietGramCancel");
const waterCheckinSheet = document.querySelector("#waterCheckinSheet");
const waterClose = document.querySelector("#waterClose");
const waterAmountInput = document.querySelector("#waterAmountInput");
const waterTypeGrid = document.querySelector("#waterTypeGrid");
const waterTypeValue = document.querySelector("#waterTypeValue");
const waterOtherTypeInput = document.querySelector("#waterOtherTypeInput");
const waterTimeInput = document.querySelector("#waterTimeInput");
const waterNoteInput = document.querySelector("#waterNoteInput");
const waterSubmit = document.querySelector("#waterSubmit");
const waterDetailOverview = document.querySelector("#waterDetailOverview");
const waterGoalValue = document.querySelector("#waterGoalValue");
const waterRemainValue = document.querySelector("#waterRemainValue");
const waterGoalSet = document.querySelector("#waterGoalSet");
const waterDetailRecords = document.querySelector("#waterDetailRecords");
const waterDetailAdd = document.querySelector("#waterDetailAdd");
const waterRecordDetailPage = document.querySelector("#waterRecordDetailPage");
const waterRecordDetailBody = document.querySelector("#waterRecordDetailBody");
const waterRecordDetailDelete = document.querySelector("#waterRecordDetailDelete");
const waterRecordDetailSave = document.querySelector("#waterRecordDetailSave");
const waterGoalPickerSheet = document.querySelector("#waterGoalPickerSheet");
const waterGoalPickerList = document.querySelector("#waterGoalPickerList");
const waterGoalPickerCancel = document.querySelector("#waterGoalPickerCancel");
const waterGoalPickerConfirm = document.querySelector("#waterGoalPickerConfirm");
const sportDetailSummary = document.querySelector("#sportDetailSummary");
const sportDetailRecords = document.querySelector("#sportDetailRecords");
const sportDetailCheckin = document.querySelector("#sportDetailCheckin");
const sportRecordEditor = document.querySelector("#sportRecordEditor");
const sportRecordDelete = document.querySelector("#sportRecordDelete");
const sportRecordClose = document.querySelector("#sportRecordClose");
const sportRecordEditorTitle = document.querySelector("#sportRecordEditorTitle");
const sportRecordIcon = document.querySelector("#sportRecordIcon");
const sportRecordName = document.querySelector("#sportRecordName");
const sportRecordMeta = document.querySelector("#sportRecordMeta");
const sportRecordCalories = document.querySelector("#sportRecordCalories");
const sportRecordDurationInput = document.querySelector("#sportRecordDurationInput");
const sportRecordIntensityOptions = document.querySelector("#sportRecordIntensityOptions");
const sportRecordTimeInput = document.querySelector("#sportRecordTimeInput");
const sportRecordTimeTrigger = document.querySelector("#sportRecordTimeTrigger");
const sportRecordTimeText = document.querySelector("#sportRecordTimeText");
const sportRecordNoteInput = document.querySelector("#sportRecordNoteInput");
const sportRecordSave = document.querySelector("#sportRecordSave");
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
const medicineItemDetailSheet = document.querySelector("#medicineItemDetailSheet");
const medicineItemDetailClose = document.querySelector("#medicineItemDetailClose");
const medicineItemDetailBody = document.querySelector("#medicineItemDetailBody");
const medicineItemDelete = document.querySelector("#medicineItemDelete");
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
const sportIntensityOptions = document.querySelector("#sportIntensityOptions");
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
const weightPhotoButton = document.querySelector("#weightPhotoButton");
const weightPhotoInput = document.querySelector("#weightPhotoInput");
const weightPhotoStatus = document.querySelector("#weightPhotoStatus");
const weightPhotoPreviewRow = document.querySelector("#weightPhotoPreviewRow");
const weightPhotoList = document.querySelector("#weightPhotoList");
const weightSubmit = document.querySelector("#weightSubmit");
const waistCheckinSheet = document.querySelector("#waistCheckinSheet");
const waistClose = document.querySelector("#waistClose");
const waistValueInput = document.querySelector("#waistValueInput");
const waistTimeTrigger = document.querySelector("#waistTimeTrigger");
const waistTimeText = document.querySelector("#waistTimeText");
const waistTimePicker = document.querySelector("#waistTimePicker");
const waistPickerDate = document.querySelector("#waistPickerDate");
const waistPickerHour = document.querySelector("#waistPickerHour");
const waistPickerMinute = document.querySelector("#waistPickerMinute");
const waistNoteInput = document.querySelector("#waistNoteInput");
const waistNoteCount = document.querySelector("#waistNoteCount");
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
const pressureTimeCard = pressureTimeTrigger?.closest(".pressure-time-card");
const pressureValueCard = pressureCheckinSheet?.querySelector(".pressure-value-card");
const pressureTimePicker = document.querySelector("#pressureTimePicker");
const pressurePickerDate = document.querySelector("#pressurePickerDate");
const pressurePickerHour = document.querySelector("#pressurePickerHour");
const pressurePickerMinute = document.querySelector("#pressurePickerMinute");
const pressureNoteInput = document.querySelector("#pressureNoteInput");
const pressureNoteCard = pressureNoteInput?.closest(".pressure-note-card");
const pressureNoteCount = document.querySelector("#pressureNoteCount");
const pressureError = document.querySelector("#pressureError");
const pressurePhotoButton = document.querySelector("#pressurePhotoButton");
const pressurePhotoInput = document.querySelector("#pressurePhotoInput");
const pressurePhotoPreviewRow = document.querySelector("#pressurePhotoPreviewRow");
const pressurePhotoList = document.querySelector("#pressurePhotoList");
const pressureSubmit = document.querySelector("#pressureSubmit");
const pressureSuccessDialog = document.querySelector("#pressureSuccessDialog");
const pressureSuccessBp = document.querySelector("#pressureSuccessBp");
const pressureSuccessPulse = document.querySelector("#pressureSuccessPulse");
const pressureSuccessDone = document.querySelector("#pressureSuccessDone");
const sugarCheckinSheet = document.querySelector("#sugarCheckinSheet");
const sugarClose = document.querySelector("#sugarClose");
const sugarPeriodSelect = document.querySelector("#sugarPeriodSelect");
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
const unifiedCheckinSuccessDialog = document.querySelector("#unifiedCheckinSuccessDialog");
const unifiedCheckinSuccessBody = document.querySelector("#unifiedCheckinSuccessBody");
const unifiedCheckinSuccessDone = document.querySelector("#unifiedCheckinSuccessDone");
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
let selectedHospitalEncounterId = "";
let selectedHospitalRecordGroup = "病案首页";
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
let allCheckinFilter = "all";
let metricRecordsByPatient = {};
let deletedMetricRecordIdsByPatient = {};
let deletingMetricRecordId = "";
let editingMetricRecordId = "";
let selectedWeightRecordKey = "";
let selectedHeartRecordId = "";
let selectedLipidRecordId = "";
let uricDetailMode = "list";
let selectedUricRecordId = "";
let dietUploadImages = [];
let dietSelectedMeal = "";
let dietRecognitionIndex = 0;
let dietRecognitionTimer = null;
let dietResultIndex = 0;
let dietResults = [];
let dietCheckinSummary = null;
let dietReturnView = "plan";
let dietResultMode = "checkin";
let dietResultReadonly = false;
let dietResultMealGroupIndex = -1;
let dietDetailHasRecords = false;
let editingDietFoodId = "";
let editingDietFoodContext = "result";
let selectedDietTaskBindingId = "";
let pendingDietTaskBinding = false;
let activeDietTaskBindingId = "";
let dietDetailMealGroups = null;
let dietDetailRangeMode = "day";
let dietDetailRangeDate = new Date();
let cameraMode = "report";
let medicineItems = [];
let medicineIdSeed = 1;
let medicineImageTargetId = "";
let medicineRecordsByPatient = {};
let selectedMedicineRecordId = "";
let selectedMedicineItemRecordId = "";
let selectedMedicineItemId = "";
let editingMedicineRecordId = "";
let medicineTimePickerMode = "checkin";
let dietTimePickerMode = "checkin";
let medicinePreviewImages = [];
let medicinePreviewIndex = 0;
let sportSelectedType = "walk";
let sportOtherName = "";
let sportDuration = 30;
let sportSelectedIntensity = "medium";
let sportTimeValue = "";
let editingSportRecordId = "";
let editingSportRecordIntensity = "medium";
let expandedSportReviewIds = new Set();
let expandedWaterReviewIds = new Set();
let weightCheckinTimeValue = "";
let weightPhotoPreviewUrl = "";
let waistCheckinTimeValue = "";
let editingWaistRecordId = "";
let waistDetailMode = "list";
let selectedWaistRecordId = "";
let pressureCheckinTimeValue = "";
let pressurePhotoPreviewUrl = "";
let sugarCheckinTimeValue = "";
let sugarSelectedPeriod = "空腹";
