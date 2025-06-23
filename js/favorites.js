// window.localStorage에 있는 저장한 데이터 모두 추출
function getAllFavoritesData() {
    const res = [];
    for (const datum of Object.values(favoritesManager.data)) {
        const r = new Restaurant();
        r.addr = datum.addr;
        r.cond = datum.cond;
        r.gugun = datum.gugun;
        r.lat = datum.lat;
        r.lng = datum.lng;
        r.menu = datum.menu;
        r.name = datum.name;
        r.tel = datum.tel;

        res.push(r);
    }

    return res;
}

// 로딩화면 토글 함수
let loadingOn = false;
function toggleLoading() {
    const loadingEl = document.getElementById("loading-container");
    loadingEl.style.display = loadingOn ? "none" : "";
    loadingOn = !loadingOn;
}

// 저장한 식당 데이터를 불러와 화면에 추가
function addFavoriteRestaurants() {

    const restaurants = getAllFavoritesData();
    const restaurantsEl = document.getElementById("restaurants");

    for (const restaurant of restaurants) {
        const view = restaurant.getView(map);
        restaurantsEl.append(view);
    }


}

// 지도 콜백 함수
let map = null;
async function mapCallBack() {
    toggleLoading();
    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.230449, 129.070540),
        zoom: 10
    });   
    addFavoriteRestaurants();
    toggleLoading();
}
