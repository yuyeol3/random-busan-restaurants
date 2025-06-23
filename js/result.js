// console.log(getURLParams());

// 총 식당 개수를 반환하는 함수
async function checkRestaurantNums() {
    try {
        const data = await fetchRestaurants(1, 1);
        return data.response.body.totalCount;
    }
    catch (error) {
        console.error("fetch error: ", error)
        return 0;
    }
}

// API에서 모든 식당 데이터를 받아오는 함수
async function getAllRestaurantData() {
    // try {
    //     const rNums = await checkRestaurantNums();
    //     const data = await fetchRestaurants(1, rNums);
    //     console.log(data);
    //     return data.response.body.items.item;
    // }
    // catch (error) {
    //     console.log('fetch error: ', error);
    // }

    return RESTAURANTS
}


// 랜덤 추출
function randomPick(dataNum) {
    const rand = [];
    for (let i =0; i < dataNum; i++) {
        const rNum = Math.random();
        rand.push({rNum, i});
    }
    // 랜덤값을 오름차순 정렬
    rand.sort((a, b)=>b.rNum - a.rNum);
    // 확률 크기가 큰 아이템 5개 추출
    return rand.slice(0, 5);
}

// 로딩화면을 토글하는 함수
let loadingOn = false;
function toggleLoading() {
    const loadingEl = document.getElementById("loading-container");
    loadingEl.style.display = loadingOn ? "none" : "";
    loadingOn = !loadingOn;
}


// 데이터를 받아 무작위로 식당 5곳을 추출해, 그 결과를 화면에 보여주는 함수
// 파라미터에 따라 지역 기준으로 데이터를 필터링할 수 있음
async function addRandomRestaurants() {
    const params = getURLParams();
    const data = await getAllRestaurantData();
    const targetData = params.isTotal == "1" ? data : data.filter((e)=> {
        const restriction = RESTRICT_OPTIONS[parseInt(params.restriction)];
        for (const r of restriction) {
            console.log(e.gugun, r);
            if (e.gugun == "부산광역시 " + r || e.gugun == r) return true;
        }

        return false;
    });
    console.log(targetData);
    const restaurantsEl = document.getElementById("restaurants");
    const picks = randomPick(targetData.length);
    for (const pick of picks) {
        const view = new Restaurant(targetData[pick.i]).getView(map);
        restaurantsEl.appendChild(view);
    }
}

// 지도 콜백함수
// addRandomRestaurant가 실행시점에 지도 객체가 존재함을 보장받기 위해 이 함수 안으로 들어갔음
let map = null;
async function mapCallBack() {
    toggleLoading();
    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.230449, 129.070540),
        zoom: 10
    });    
    await addRandomRestaurants();
    toggleLoading();
}
