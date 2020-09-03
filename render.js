const { ipcRenderer } = require('electron');
const Timer = require('timer.js');
const workTime = 6;
const restTime = 6;
const progressLength = 437;
const startBtn = document.getElementById('startBtn');
const timerDom = document.getElementById('text');
const path = document.querySelector('#path');
let status = 1; // 1: 工作 2:休息

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

  timerDom.innerText = `${mm.toString().padStart(2, 0)}: ${ss.toString().padStart(2, 0)}`;
  setProgress(1 - ms / ((status === 1 ? workTime : restTime) * 1000));
}

// 设置进度
function setProgress(num) {
  // 可获取路径的长度
  path.setAttribute('stroke-width', 8);
  path.setAttribute('stroke-dasharray', `${(progressLength * num).toFixed(2)}px ${progressLength}px`);
}

// 发送通知
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

// 入口
void function main() {
  updateTime(workTime * 1000);
  path.setAttribute('stroke-width', 0);
  btnAddListener();
}();

// 绑定事件
function btnAddListener() {
  startBtn.addEventListener('click', () => {
    if (startBtn.children[0].innerText === '开始') {
      timer.start(workTime);
      startBtn.children[0].innerText = '工作中';
      status = 1;
    }
  });
}
