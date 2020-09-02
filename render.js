const { ipcRenderer } = require('electron');
const Timer = require('timer.js');
const totalTime = 100;
const progressLength = 437;

function main() {
  let timer = new Timer({
    ontick: function (ms) {
      updateTime(ms);
    },
    onend: function () {
      notification();
    }
  });
  timer.start(totalTime);
}

function updateTime(ms) {
  let timerDom = document.getElementById('text');
  let s = (ms / 1000).toFixed(0);
  let ss = s % 60;
  let mm = (s / 60).toFixed(0);

  timerDom.innerText = `${mm.toString().padStart(2, 0)}: ${ss.toString().padStart(2, 0)}`;
  setProgress(1 - ms / (totalTime * 1000));
}

function setProgress(num) {
  let path = document.querySelector('#path');
  // 可获取路径的长度
  path.setAttribute('stroke-dasharray', `${(progressLength * num).toFixed(2)}px ${progressLength}px`);
}

async function notification() {
  let res = await ipcRenderer.invoke('work-notification');
  if (res === 'rest') {
    //休息
    alert('休息');
  } else if (res === 'work') {
    //工作
    main();
  }
}

main();