const { ipcRenderer } = require('electron');
const Timer = require('timer.js');

function main() {
  let timer = new Timer({
    ontick: function (ms) {
      updateTime(ms);
    },
    onend: function () {
      notification();
    }
  });
  timer.start(10);
}

function updateTime(ms) {
  let timerDom = document.getElementById('timer');
  timerDom.innerText = ms;
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