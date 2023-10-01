// 이미지를 로드하고 폼을 보여주는 JS임. 백엔드 기능은 없고 단순 UI이 일뿐이다.

// index.html에서의 id들을 가져옴
const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

// ✅
// 웹페이지는 보안상의 이유로 기본적으로 node.js 를 실행하지 않는다 .
// 그래서 서로 다른 프로세스 유형으로 연결하기 위해서 preload를 진행
// ex) contextBridge 라는 것을 사용해야한다.
// 그러면 기본os나 렌더링에서 특정기능을 도출가능
// 이 컨택스트는 bridge를 사용하여 이것을 렌더러에 노출시키는 것! 그럼 require같은 함수 사용가능.

// 그럼 이걸 어디서 적용? -> main.js 에서 처음 윈도우를 create 할때 preload 작업을 수행시킨다.
// 모든 항목에 내가 이것들을 사용한다는 것을 알리는 것.

// console.log(versions.node());
// main 에서 preload 적용시킨 후 렌더러에서 version node를 확인해보면 노드 버전 확인가능.

/**
 * 이미지 파일 로드 함수
 * @param {*} e
 * @returns
 */
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    // 이미지가 아닐경우 alert창을 통해 사용자에게 표시
    alert("Please select an image file");
    return;
  }

  // get original dimensions
  // 원래 치수를 구하다
  const image = new Image();
  // 이미지의 정보를 가져옴
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  // 파일 이름 UI에 표시
  document.querySelector("#filename").innerHTML = file.name;
}

/**
 * 파일이 이미지인지 체크
 * @param {*} file
 * @returns Boolean
 */
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  // 허용된 이미지 타입일 경우 return 'true'
  return file && acceptedImageTypes.includes(file["type"]);
}

document.querySelector("#img").addEventListener("change", loadImage);
