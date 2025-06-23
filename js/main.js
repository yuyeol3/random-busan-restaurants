const diceEl = document.getElementById("dice-img");
const totalOpt = document.getElementById("total-opt");
const selectedRestriction = document.getElementById("selected-restriction");


diceEl.draggable =false;

// 주사위 클릭시
diceEl.onclick = ()=> {
    // form 태그에 있는 설정값 읽어오기
    const isTotal = totalOpt.checked;
    const restirction = selectedRestriction.value;
    // 설정값에 따라 query 다르게 지정해 result page로 이동
    if (isTotal) {
        location.href = "./result.html?isTotal=1";
    } else {
        location.href = `./result.html?isTotal=0&restriction=${restirction}`;
    }
}