
// url 파라미터 파싱 헬퍼 함수
function getURLParams() {
    const url = new URL(location.href);
    const res = {};

    for (const key of url.searchParams.keys()) {
        res[key] = url.searchParams.get(key);
    }
    return res;
}

// api에 데이터 요청해주는 함수
async function fetchRestaurants(pageNo, numOfRows, restaurantName=null) {
    const params = {
        serviceKey : RESTRUANT_API_KEY,
        pageNo : pageNo,
        numOfRows : numOfRows,
        resultType : 'json'
    }
    if (restaurantName) params["bsnsNm"] = restaurantName;

    const queryStr = new URLSearchParams(params).toString();

    const res = await fetch(RESTRUANT_API_URL + '?' + queryStr);
    const data = await res.json();
    return data;
}

// 음식점 클래스
// 음식점 데이터 처리 및 html 생성을 용이하게 해줌
class Restaurant {
    constructor(data) {
        if (!data) return;
        this.name = data.bsnsNm;
        this.addr = data.addrRoad;
        this.lat = data.lat;
        this.lng = data.lng;
        this.cond = data.bsnsCond; // 업태
        this.menu = data.menu;
        this.gugun = data.gugun.split(" ").at(-1); // 부산광역시 oo구/군
        this.tel = data.tel;
    }

    // 이 객체에 대한 div element를 생성하는 메소드
    getView(mapRef) {
        // DOM 이용해 div 생성
        const divEl = document.createElement("div");
        divEl.restaurantInfo = this;
        divEl.classList.add("restaurant-card")
        divEl.innerHTML = `
            <div class="info">
                <h3>${this.name}</h3>
                <p>${this.addr}</p>
            </div>
            <div class="buttons">
                <button class="button goto-location">지도</button>
                <button class="button chat">댓글</button>
            </div>
            <button class="favorite-btn" aria-label="즐겨찾기">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <!-- 빈 별 -->
                    <polygon class="star-outline" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="12 1.5 15.09 8.25 22.5 9.27 17.25 14.31 18.6 21.75 12 18 5.4 21.75 6.75 14.31 1.5 9.27 8.91 8.25 12 1.5"/>
                    <!-- 채워진 별 -->
                    <polygon class="star-filled" fill="currentColor" points="12 1.5 15.09 8.25 22.5 9.27 17.25 14.31 18.6 21.75 12 18 5.4 21.75 6.75 14.31 1.5 9.27 8.91 8.25 12 1.5"/>
                </svg>
            </button>
        `;
        // 지도 이동 기능 구현
        const gotoButton = divEl.querySelector(".goto-location");
        let marker = null;
        gotoButton.onclick = (e)=> {
            mapRef.setZoom(20);
            mapRef.panTo(new naver.maps.LatLng(this.lat, this.lng));  // 위-경도 이용해 이동

            // 마카 없으면 추가
            if (!marker) {
                marker = new naver.maps.Marker({
                    position : new naver.maps.LatLng(this.lat, this.lng),
                    map: mapRef
                });
                
                naver.maps.Event.addListener(marker, 'click', ()=>{
                    window.open(
                        `https://map.naver.com/p/search/${encodeURI(this.name + ' ' + this.gugun) }`
                    );
                });
                
            }

            if (window.outerWidth <= 700) {
                document.getElementById("map-container").scrollIntoView();
            }
        }

        // favorite 목록에 있으면 색칠된 상태로 보이게 하기
        const favoriteButton = divEl.querySelector(".favorite-btn");
        if (favoritesManager.has(this.name + this.gugun)) {
            favoriteButton.classList.toggle("active");
        }

        // 클릭에 따른 토글 및 데이터 처리
        favoriteButton.onclick = (e)=> {
            if (favoritesManager.has(this.name + this.gugun)) {
                favoritesManager.remove(this.name + this.gugun);
                favoriteButton.classList.toggle("active");
            }
            else {
                favoritesManager.set(this.name + this.gugun, this);
                favoriteButton.classList.toggle("active");
            }
        }

        // 댓글 기능 버튼
        const chatBtn = divEl.querySelector(".button.chat")
        chatBtn.onclick = ()=> {
            openRestaurantDialog("chat-dialog", this.name + ' ' + this.gugun);
        }

        // 완성된 div 반환
        return divEl;
    }
}

// window.localStoarge를 사용해 favorites 저장하기 위한 클래스
class FavoritesManager {
    constructor() {
        this.KEY_NAME = "random-matzip";
        const storageStr = localStorage.getItem(this.KEY_NAME);
        this.data = storageStr ? JSON.parse(storageStr) : {};
    }

    // 추가
    set(name, data) {
        this.data[name] = data;
        localStorage.setItem(this.KEY_NAME, JSON.stringify(this.data));
    }   

    // 조회
    get(name) {
        this.data[name];
    }
    // 삭제
    remove(name) {
        delete this.data[name];
        localStorage.setItem(this.KEY_NAME, JSON.stringify(this.data));
    }
    // 즐겨찾기 포함 여부 확인
    has(name) {
        return this.data[name] ? true : false;
    }
}

// 인스턴스화
const favoritesManager = new FavoritesManager();

// utterance api 사용, 댓글 기능 추가
function openRestaurantDialog(tagid, restaurantId) {
    const dialog = document.getElementById(tagid);
    const container = dialog.querySelector(".content");
    container.innerHTML = "";

    // 식당 이름
    const h2El = document.createElement("h2");
    h2El.textContent = restaurantId.split(" ")[0] + " 댓글 달기";
    container.appendChild(h2El);

    // utterance api js 파일 불러오기
    const scriptEl = document.createElement("script");
    scriptEl.src = 'https://utteranc.es/client.js';
    scriptEl.setAttribute("repo", "yuyeol3/iwb-term-chat");
    scriptEl.setAttribute("issue-term", restaurantId);
    scriptEl.setAttribute("label", "ut");
    scriptEl.setAttribute("theme", "github-light");
    scriptEl.setAttribute("crossorigin", "anonymous");
    scriptEl.setAttribute("async", true);
    container.appendChild(scriptEl);

    dialog.showModal();
}