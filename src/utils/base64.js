export function getBase64FromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// 호출시 Promise 객체 반환
// 반환값에 대해 .then 혹은 await 사용 가능함
// resolve : 정상처리가 된 로직에서 호출
// reject : 에러상황일 때 호출
