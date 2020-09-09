const { ipcRenderer } = require('electron');
const Timer = require('timer.js');

let workTime = 60 * 25,
  restTime = 60 * 5,
  status = 1; // 1: 工作 2:休息
const $ = id => {
  return document.getElementById(id);
};
const progressLength = 437, //进度总长度
  startBtn = $('startBtn'),
  timerDom = $('text'),
  setting = $('setting'),
  settingWrap = $('settingWrap'),
  closeSetting = $('closeSetting'),
  workTimeDom = $('workTime'),
  restTimeDom = $('restTime'),
  saveTimeDom = $('saveTime'),
  tipTextDom = $('tipText'),
  path = $('path');

let timer = new Timer({
  ontick: function (ms) {
    updateTime(ms);
  },
  onend: function () {
    updateTime(0);
    if (status === 1) {
      notification();
    } else if (status === 2) {
      // 休息结束
      timer.stop();
      startBtn.children[0].innerText = '开始';
    }
  }
});

// 更新时间
function updateTime(ms) {
  let s = (ms / 1000).toFixed(0);
  let ss = s % 60;
  let mm = Math.floor((s / 60)).toFixed(0);

  timerDom.innerText = `${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)}`;
  setProgress(1 - ms / ((status === 1 ? workTime : restTime) * 1000));
}

// 更新文本内容
function updateTipText() {
  tipTextDom.innerText = `工作${workTime / 60}分钟,休息${restTime / 60}分钟`;
}

// 设置进度
function setProgress(num) {
  // 可获取路径的长度
  path.setAttribute('stroke-width', 8);
  path.setAttribute('stroke-dasharray', `${(progressLength * num).toFixed(2)}px ${progressLength}px`);
}

// 发送通知主进程
async function notification() {
  let res = await ipcRenderer.invoke('work-notification');
  if (res === 'rest') {
    //休息
    startBtn.children[0].innerText = '休息中';
    status = 2;
    timer.stop();
    timer.start(restTime);
  } else if (res === 'work') {
    //工作
    startBtn.children[0].innerText = '工作中';
    status = 1;
    timer.start(workTime);
  }
}

// 初始化数据
function init() {
  status = 1;
  setDefaultTime();
  updateTime(workTime * 1000);
  path.setAttribute('stroke-width', 0);
  updateTipText();
}

// 重置并开始计时
function reset() {
  init();
  timer.stop();
  timer.start(workTime);
}

// 设置默认时间
function setDefaultTime() {
  workTimeDom.value = workTime / 60;
  restTimeDom.value = restTime / 60;
}
// 绑定事件
function btnAddListener() {
  startBtn.addEventListener('click', () => {
    if (startBtn.children[0].innerText === '开始') {
      timer.start(workTime);
      startBtn.children[0].innerText = '工作中';
      status = 1;
    }
  });
  setting.addEventListener('click', () => {
    settingWrap.classList.toggle('show');
  });
  closeSetting.addEventListener('click', () => {
    settingWrap.classList.remove('show');
  });
  saveTimeDom.addEventListener('click', () => {
    restTime = (Number(restTimeDom.value) * 60).toFixed(0);
    workTime = (Number(workTimeDom.value) * 60).toFixed(0);
    settingWrap.classList.toggle('show');
    reset();
    startBtn.children[0].innerText = '工作中';
    status = 1;
  });
}
// 移除事件绑定
function removeDomListener() {
  window.onunload =  function () {
    startBtn.removeEventListener('click', null);
    setting.removeEventListener('click', null);
    closeSetting.removeEventListener('click', null);
    saveTimeDom.removeEventListener('click', null);
  }
}

// 入口
void function main() {
  init();
  btnAddListener();
  removeDomListener();
}();