const os = require("os");
const path = require("path");
const Toastify = require("toastify-js");
const { contextBridge, ipcRenderer } = require("electron");
// 노드와 크롬을 액세스 하게만듬
// doc: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});
contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});
// 이제 렌더러에서 os.homedir 와 path.join 을 액세스해서 사용할 수 있다.

// toastify 옵션을 취하는 함수인 toastify를 toast 라는 메소드에 저장
contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  // ipcrenderer 를 통해 채널과 데이터를 전송
  send: (chanel, data) => ipcRenderer.send(chanel, data),
  // 함수를 전달하고 그것을 수행하면서 다른 인수를 취해서 그 인수를 호출할 것임
  on: (chanel, func) =>
    ipcRenderer.on(chanel, (event, ...atgs) => func(...args)),
});
