const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;
// 메인 윈도우 만드는 함수
function createMainWindow() {
  mainWindow = new BrowserWindow({
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

  // mainWindow 삭제
  // : (main.js 한정)전역변수(?)로 mainwindow 를 할당해놨기 때문에 메모리 누수가 될 수 있어서 삭제(null값 저장)
  mainWindow.on("closed", () => (mainWindow = null));

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
async function resizeImage({ imgPath, width, height, dest }) {
  try {
    // resize하기 위해 fs 모듈로 이미지 파일 동기화
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // 파일이름 생성
    const filename = path.basename(imgPath);

    // 저장될 대상폴더가 없다면 폴더생성
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // 파일을 대상에 쓰기(?) =  write file to dest
    fs.writeFileSync(path.join(dest, filename), newPath);

    // 성공하고 나면 렌더러에 성공메세지를 보낸다. -> 대상폴더를 열기 위해서
    mainWindow.webContents.send("image:done");
    // 대상폴더 열기
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
}

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
