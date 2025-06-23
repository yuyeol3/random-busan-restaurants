// 헤더 설정
function setHeader() {
    const headerEl = document.createElement("header");
    headerEl.innerHTML = `
        <h3 id="site-title">부산 랜덤맛집</h3>
        <nav>
            <span class="nav-item">
                <a href="./favorites.html">Favorites</a>
            </span>
            <span class="nav-item">
                <a href="./about.html">About</a>
            </span>
        </nav>
    `;

    headerEl.querySelector("#site-title").onclick = ()=> {location.href = "./main.html"}

    document.body.prepend(headerEl);
}

// 푸터 설정
function setFooter() {
    const footerEl = document.createElement("footer");
    footerEl.innerHTML = `
        <p>2025-1 인터넷과웹기초 텀프로젝트</p>
        <p>최유렬 & 박수민</p>
    `;
    document.body.appendChild(footerEl);
}

// DOM content 로드 완료시
document.addEventListener("DOMContentLoaded", ()=> {
    // 헤더, 푸터 추가
    setHeader();
    setFooter();
    // 스크롤 다운시 헤더가 숨는 효과
    const headerEl = document.querySelector("header");
    let throttleTimer = null;
    let lastScrollY = 0;
    const handleScroll = ()=>{
        let curScrollY = window.scrollY;

        // 새로 스크롤한 뒤 y가 더 크다면 숨기기
        if (curScrollY > lastScrollY) {
            headerEl.classList.add("hidden");
        } else {
            headerEl.classList.remove("hidden");
        }

        lastScrollY = curScrollY;
    }

    window.addEventListener('scroll', ()=> {
        if (throttleTimer) return;  // 등록된 작업이 있으면 추가하지 않음
        
        // 타이머 작업 추가
        throttleTimer = setTimeout(()=>{
            handleScroll();
            throttleTimer = null;
        }, 100)
    });

})



