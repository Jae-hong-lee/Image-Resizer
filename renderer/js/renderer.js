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

/**
 * 이미지 파일 로드 함수
 * @param {*} e
 * @returns
 */
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    // alert을 이용하는게 아닌 toastify을 통한 에러 메세지출력
    alertError("이미지 파일을 선택해주세요.");
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

  // 선택한 파일이름(filename)과 홈디렉토리 어디로 출력되는지에 대한 경로(outputpath) 표시
  form.style.display = "block";
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), `imageresizer`);
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

// toastify를 통한 에러메세지 출력 (5초후 사라지게.)
function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}
// toastify를 통한 성공메세지 출력 (5초후 사라지게.)
function alertSucces(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

document.querySelector("#img").addEventListener("change", loadImage);
