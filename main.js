const path = require("path");
const os = require("os");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain } = require("electron");

const isDev = process.env.NODE_ENV !== "development";
const isMac = process.platform === "darwin";

// 메인 윈도우 만드는 함수
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      // 컨텍스트 격리
      contextIsolation: true,
      // 노드통합
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 개발자모드로 실행시 개발자도구 오픈된 상태로 실행 env로 판단
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

// about 윈도우 생성 , 앱정보.
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About Image Resizer",
    width: 300,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

// 앱이 준비됨
app.whenReady().then(() => {
  createMainWindow();

  // 메뉴구현
  // 밑에서 만든 메뉴 템플릿을 통해 mac 과 window os 별로 메뉴를 구현하였음.
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// 메뉴 템플릿
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              // 괄호를 넣지 않는 이유 => 함수가 자동으로 실행되기 떄문에 click이라는 자체가 이벤트인듯.
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// ipcRenderer 이미지 크기 조정
ipcMain.on("image:resize", (e, options) => {
  // 우리가 resize 해서 저장할 곳
  options.dest = path.join(os.homedir(), "imageresizer");
  resizeImage(options);
  // renerer.js 에서 보낸 option을 ipcMain을 통해 받아서 출력
  console.log(options);
});

// 이미지 resize 함수
// 4가지 옵션
// 이미지 경로, width, height, dest(대상, 대상폴더)
// try catch 로 에러를 잡고 우리가 설치한 img 도구를 통해 resize 할거임
function resizeImage() {}

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
