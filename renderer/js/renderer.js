// 이미지를 로드하고 폼을 보여주는 JS임. 백엔드 기능은 없고 단순 UI이 일뿐이다.
const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");

// 이미지 파일 로드
function loadImage(e) {
  const file = e.target.files[0];
  // 이미지가 아닐경우 alert
  if (!isFileImage(file)) {
    alert("Please select an image file");
    return;
  }

  // get original dimensions
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = "block";
  // 파일 이름 표시
  document.querySelector("#filename").innerHTML = file.name;
}

// 파일이 이미지인지 체크
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/jpeg", "image/png"];
  // 허용된 이미지 타입일 경우 return 'true'
  return file && acceptedImageTypes.includes(file["type"]);
}

document.querySelector("#img").addEventListener("change", loadImage);
