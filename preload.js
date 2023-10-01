const { contextBridge } = require("electron");

// 노드와 크롬을 액세스 하게만듬
// doc: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});

// ✅
// 웹페이지는 보안상의 이유로 기본적으로 node.js 를 실행하지 않는다 .
// 그래서 서로 다른 프로세스 유형으로 연결하기 위해서 preload를 진행
// ex) contextBridge 라는 것을 사용해야한다.
// 그러면 기본os나 렌더링에서 특정기능을 도출가능
// 이 컨택스트는 bridge를 사용하여 이것을 렌더러에 노출시키는 것! 그럼 require같은 함수 사용가능.
// 그럼 이걸 어디서 적용? -> main.js 에서 처음 윈도우를 create 할때 preload 작업을 수행시킨다.
