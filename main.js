const { app, BrowserWindow, Notification, ipcMain } = require("electron");

let win = null;
// 创建窗体
function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // 加载index.html文件
  win.loadFile("index.html");

  //响应ipc事件
  
  handleIPC();
  // 打开开发工具
  win.webContents.openDevTools();
}

function handleIPC() {
  ipcMain.handle("work-notification", async function() {

    let res = new Promise((resolve, reject) => {
      let notification = new Notification({
        title: "任务结束",
        body: "是否开始休息",
        actions: [
          {
            text: "开始休息",
            type: "button",
          },
        ],
        closeButtonText: '继续工作'
      });
      notification.show();
      notification.on("action", () => {
        resolve('rest');
      });
      notification.on("close", () => {
        resolve('work');
      });
    });

    return res;

  });
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

