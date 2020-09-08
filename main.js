const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const notifier = require('node-notifier');

let win = null;
// 创建窗体
function createWindow() {
  win = new BrowserWindow({
    width: 240,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
    minimizable: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    icon: './static/favicon.ico',
    title: '番茄时钟',
  });

  // 加载index.html文件
  win.loadFile("index.html");

  //响应ipc事件
  handleIPC();
  
  // 打开开发工具
  // win.webContents.openDevTools();
  // 关门菜单
  Menu.setApplicationMenu(null);
  // 置顶
  win.setAlwaysOnTop(true);
}

function handleIPC() {

  ipcMain.handle("work-notification", async function() {
    return new Promise((resolve, reject) => {
      notifier.notify({
        title: '任务结束',
        message: '是否开始休息?',
        actions: ['Confirm', 'Cancel'],
        type: 'info'
      }, (error, action) => {
        if (action === 'confirm') {
          resolve('rest');
        } else if (action === 'cancel') {
          resolve('work');
        }
      });

    });

  });
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    ipcMain.removeAllListeners();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
