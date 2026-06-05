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
    change: "较上次 ↑ 6 分",
    visual: "illustration-shield",
    middle: `<div class="focus-row"><span>BMI超重</span><span>血压偏高</span><span>血糖偏高</span></div>`,
    advice: "建议控制饮食，规律运动，3个月后重新评估，关注血压变化。",
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
    advice: "建议保持下降趋势，继续保持！建议增加力量训练，有助于提升基础代谢。",
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
        <p><i></i>血压连续3天偏高 <span>148/95 mmHg</span></p>
        <p><i></i>空腹血糖偏高 <span>7.2 mmol/L</span></p>
      </div>
    `,
    advice: "建议减少盐油摄入，规律服药，今日尽快完成血压记录并复查。",
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
    advice: "太棒了！继续保持良好的生活习惯，巩固健康成果，加油！",
    link: "查看健康报告 〉"
  }
};

const mainCard = document.querySelector("#mainCard");
const stateButtons = document.querySelectorAll(".state-switcher button");
const taskPanel = document.querySelector("#taskPanel");
const addButton = document.querySelector("#addButton");

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

  const visual = state.visual === "progress"
    ? `<div class="progress-ring" aria-label="膳食遵循36%"><span>膳食遵循</span><strong>36%</strong></div>`
    : `<div class="card-illustration ${state.visual}" aria-hidden="true"></div>`;

  mainCard.innerHTML = `
    <article class="score-card ${state.className}">
      <div class="score-top">
        <span class="card-label">${state.label}</span>
        <div class="score-line">
          <strong class="score-number">${state.score}</strong>
          <span class="score-unit">分</span>
          <span class="score-status ${state.statusClass}">${state.status}</span>
        </div>
        <p class="score-change">${state.change}</p>
        ${visual}
      </div>
      ${state.middle}
      <div class="ai-block">
        <strong>AI建议</strong>
        <p>${state.advice}</p>
      </div>
      <a class="detail-link" href="#">${state.link}</a>
    </article>
  `;
}

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stateButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderMainCard(button.dataset.state);
  });
});

addButton.addEventListener("click", () => {
  const isOpen = taskPanel.classList.toggle("open");
  addButton.setAttribute("aria-expanded", String(isOpen));
});

renderMainCard("empty");
