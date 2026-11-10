/* ==========================================================================
   전국 여행지 추천 & 나만의 카톡 보물지도첩 — 핵심 동작 스크립트 (app.js)
   - Kakao Developers (https://developers.kakao.com/) 카카오맵 & 카톡 공유 연동
   - Kakao PlayMCP (https://playmcp.kakao.com/mcp/3) 장소 검색 도구 연동
   - 전국 팔도 8대 테마 · 45곳 + 지역별 실존 명소/맛집 스마트 검색 엔진
   ========================================================================== */

const DEFAULT_KAKAO_JS_KEY = '8cfedd32f1478e4dc67d8b1ca3fe1aad';

// 1. 8대 테마 · 전국 45곳 추천 여행지 데이터베이스
// (mapX, mapY는 대한민국 8도 정밀 지도 SVG 위 실제 지리적 위치 비율 %)
const TRAVEL_THEMES = {
  flower: {
    title: '🌸 꽃길 · 수목원 추천 명소 (6곳)',
    places: [
      {
        id: 'fl-1',
        name: '서울식물원',
        kakaoQuery: '서울식물원',
        region: '서울 강서구',
        category: '🌸 꽃길·수목원',
        address: '서울특별시 강서구 마곡동로 161',
        desc: '사계절 푸른 열대·지중해 온실과 넓은 호수공원이 평지로 이어져 여유롭게 꽃구경하기 좋은 도심 속 식물원입니다.',
        seniorTip: '💡 산책 코스 전체가 평탄한 데크길이며, 곳곳에 포토존과 휴식 벤치, 카페가 잘 갖춰져 있습니다.',
        lat: 37.5693,
        lng: 126.8351,
        mapX: 33,
        mapY: 23
      },
      {
        id: 'fl-2',
        name: '경기도 물향기수목원',
        kakaoQuery: '물향기수목원',
        region: '경기 오산시',
        category: '🌸 꽃길·수목원',
        address: '경기도 오산시 청학로 211',
        desc: '1호선 수청역에서 도보 5분 거리에 있는 울창한 수목원으로, 수생식물원과 메타세쿼이아 숲길이 아름답습니다.',
        seniorTip: '💡 지하철역 바로 앞이라 대중교통 접근성이 뛰어나고 숲길 경사가 완만해 산책하기 편안합니다.',
        lat: 37.1666,
        lng: 127.0575,
        mapX: 36,
        mapY: 29
      },
      {
        id: 'fl-3',
        name: '가평 아침고요수목원',
        kakaoQuery: '아침고요수목원',
        region: '경기 가평군',
        category: '🌸 꽃길·수목원',
        address: '경기도 가평군 상면 수목원로 432',
        desc: '축령산 자락 아래 한국적인 정원과 계절마다 화려한 꽃 축제가 펼쳐지는 수도권 대표 힐링 정원입니다.',
        seniorTip: '💡 산책로가 잘 정비되어 있고 베이커리 카페와 한옥 쉼터가 많아 여유롭게 둘러보기 좋습니다.',
        lat: 37.7439,
        lng: 127.3526,
        mapX: 43,
        mapY: 21
      },
      {
        id: 'fl-4',
        name: '태안 천리포수목원',
        kakaoQuery: '천리포수목원',
        region: '충남 태안군',
        category: '🌸 꽃길·수목원',
        address: '충청남도 태안군 소원면 천리포1길 187',
        desc: '서해 바다 바로 옆에 자리한 아름다운 수목원으로, 파도 소리를 들으며 해안 데크 숲길을 걸을 수 있습니다.',
        seniorTip: '💡 계단이 없는 평탄한 해안 산책 데크길이 바다를 따라 이어져 풍경이 일품입니다.',
        lat: 36.7989,
        lng: 126.1489,
        mapX: 21,
        mapY: 40
      },
      {
        id: 'fl-5',
        name: '대구 수목원',
        kakaoQuery: '대구수목원',
        region: '대구 달서구',
        category: '🌸 꽃길·수목원',
        address: '대구광역시 달서구 화암로 342',
        desc: '도심 속에서 울창한 숲과 화려한 계절 꽃밭, 선인장 온실을 무료로 즐길 수 있는 대표 산책 명소입니다.',
        seniorTip: '💡 입구부터 온실까지 완만한 흙길과 산책로로 조성되어 있어 가벼운 산책 코스로 인기가 높습니다.',
        lat: 35.7997,
        lng: 128.5227,
        mapX: 62,
        mapY: 57
      },
      {
        id: 'fl-6',
        name: '순천만 국가정원',
        kakaoQuery: '순천만국가정원',
        region: '전남 순천시',
        category: '🌸 꽃길·수목원',
        address: '전라남도 순천시 국가정원1호길 47',
        desc: '세계 각국의 정원과 봄꽃·가을 억새를 관람차(정원드림호·스카이큐브)와 함께 둘러볼 수 있는 대한민국 1호 국가정원입니다.',
        seniorTip: '💡 정원 내부 관람 열차와 수상 보트를 이용하면 넓은 정원 풍경을 한눈에 편하게 감상할 수 있습니다.',
        lat: 34.9277,
        lng: 127.4988,
        mapX: 43,
        mapY: 71
      }
    ]
  },
  sea: {
    title: '🌊 바다 · 호수 산책길 추천 명소 (6곳)',
    places: [
      {
        id: 'sea-1',
        name: '강릉 경포호수 & 경포해변 솔밭길',
        kakaoQuery: '강릉 경포호',
        region: '강원 강릉시',
        category: '🌊 바다·호수길',
        address: '강원특별자치도 강릉시 저동 94',
        desc: '바닷바람과 소나무 향기를 맡으며 호수 둘레를 걷는 평탄한 산책로로, 근처 초당순두부 마을과 함께 가기 좋습니다.',
        seniorTip: '💡 부드러운 흙길과 나무 데크길로 되어 있어 걷기 편하고 자전거 대여소도 함께 운영됩니다.',
        lat: 37.7955,
        lng: 128.9086,
        mapX: 66,
        mapY: 20
      },
      {
        id: 'sea-2',
        name: '부산 해운대 블루라인파크 해변열차',
        kakaoQuery: '해운대블루라인파크 미포정거장',
        region: '부산 해운대구',
        category: '🌊 바다·호수길',
        address: '부산광역시 해운대구 달맞이길62번길 13',
        desc: '미포에서 송정까지 푸른 동해 바다 바로 옆을 달리는 해변열차·스카이캡슐과 해안 데크 산책로입니다.',
        seniorTip: '💡 해변열차 통유리 창문으로 청사포와 해운대 절경을 감상할 수 있어 부산 여행 필수 코스입니다.',
        lat: 35.1587,
        lng: 129.1794,
        mapX: 72,
        mapY: 67
      },
      {
        id: 'sea-3',
        name: '예산 예당호 출렁다리 & 모노레일',
        kakaoQuery: '예당호출렁다리',
        region: '충남 예산군',
        category: '🌊 바다·호수길',
        address: '충청남도 예산군 응봉면 후사리 39',
        desc: '넓고 잔잔한 호수 위를 걷는 수변 산책길과 음악분수, 모노레일이 어우러진 나들이 명소입니다.',
        seniorTip: '💡 예당호 모노레일을 탑승하면 호수 주변 조각공원과 수변 경관을 편안하게 둘러볼 수 있습니다.',
        lat: 36.6431,
        lng: 126.8012,
        mapX: 31,
        mapY: 42
      },
      {
        id: 'sea-4',
        name: '포항 호미곶 해맞이광장',
        kakaoQuery: '호미곶해맞이광장',
        region: '경북 포항시',
        category: '🌊 바다·호수길',
        address: '경상북도 포항시 남구 호미곶면 해맞이로 136',
        desc: '한반도 동쪽 끝에 위치한 탁 트인 바다 광장으로, 상생의 손 조형물과 봄 유채꽃밭이 장관을 이룹니다.',
        seniorTip: '💡 광장 전체가 넓은 평지이고 주차장에서 바닷가 전망대까지 바로 연결되어 이동이 편리합니다.',
        lat: 36.0769,
        lng: 129.5656,
        mapX: 77,
        mapY: 51
      },
      {
        id: 'sea-5',
        name: '여수 오동도 & 동백열차',
        kakaoQuery: '여수 오동도',
        region: '전남 여수시',
        category: '🌊 바다·호수길',
        address: '전라남도 여수시 오동도로 222',
        desc: '예쁜 동백열차를 타고 방파제를 건너 들어가 동백나무 숲과 남해 바다 절경을 감상하는 명소입니다.',
        seniorTip: '💡 입구에서 동백열차를 타면 섬 안쪽까지 빠르게 이동할 수 있고 등대 전망대 엘리베이터도 있습니다.',
        lat: 34.7456,
        lng: 127.7669,
        mapX: 48,
        mapY: 73
      },
      {
        id: 'sea-6',
        name: '춘천 공지천 & 의암호 수변공원',
        kakaoQuery: '춘천 공지천유원지',
        region: '강원 춘천시',
        category: '🌊 바다·호수길',
        address: '강원특별자치도 춘천시 이디오피아길 25',
        desc: '잔잔한 호수를 따라 평탄한 수변 데크길이 이어지고, 호수 전망 로스터리 카페에서 커피를 즐기기 좋습니다.',
        seniorTip: '💡 춘천역에서 가까우며 호숫가 산책로와 오리배 선착장, 피크닉 공원이 잘 조성되어 있습니다.',
        lat: 37.8742,
        lng: 127.7051,
        mapX: 48,
        mapY: 18
      }
    ]
  },
  hanok: {
    title: '🍵 한옥마을 · 숲속 사찰 추천 명소 (6곳)',
    places: [
      {
        id: 'hk-1',
        name: '전주 한옥마을 & 경기전',
        kakaoQuery: '전주한옥마을',
        region: '전북 전주시',
        category: '🍵 한옥·사찰',
        address: '전북특별자치도 전주시 완산구 태조로 44',
        desc: '고풍스러운 한옥 골목길과 경기전의 푸른 대나무 숲길을 걸으며 전통 차와 한옥 카페의 여유를 즐길 수 있습니다.',
        seniorTip: '💡 골목 전체가 평지이고 한옥 카페, 길거리 간식, 맛집이 모여 있어 천천히 걸으며 구경하기 좋습니다.',
        lat: 35.8147,
        lng: 127.1526,
        mapX: 36,
        mapY: 57
      },
      {
        id: 'hk-2',
        name: '평창 월정사 전나무 숲길',
        kakaoQuery: '월정사 전나무숲길',
        region: '강원 평창군',
        category: '🍵 한옥·사찰',
        address: '강원특별자치도 평창군 진부면 오대산로 374-8',
        desc: '수백 년 된 아름드리 전나무가 뿜어내는 맑은 공기를 마시며 평탄한 흙길을 걷는 우리나라 대표 힐링 숲길입니다.',
        seniorTip: '💡 계단이 없는 1km 평지 황톳길로 이루어져 있어 누구나 가장 편안하게 걷는 숲길입니다.',
        lat: 37.7321,
        lng: 128.5928,
        mapX: 60,
        mapY: 22
      },
      {
        id: 'hk-3',
        name: '경주 대릉원 & 교촌한옥마을',
        kakaoQuery: '경주 대릉원',
        region: '경북 경주시',
        category: '🍵 한옥·사찰',
        address: '경상북도 경주시 황남동 31-1',
        desc: '부드러운 곡선의 고분군 사이로 소나무 산책길이 펼쳐지고, 바로 옆 황리단길과 교촌마을에서 맛집·카페를 즐깁니다.',
        seniorTip: '💡 대릉원 내부가 넓고 평탄하며 첨성대·동궁과월지 야경 코스까지 도보로 이어집니다.',
        lat: 35.8394,
        lng: 129.2119,
        mapX: 71,
        mapY: 55
      },
      {
        id: 'hk-4',
        name: '안동 하회마을',
        kakaoQuery: '안동하회마을',
        region: '경북 안동시',
        category: '🍵 한옥·사찰',
        address: '경상북도 안동시 풍천면 전서로 186',
        desc: '낙동강이 마을을 부드럽게 감싸 안은 유네스코 세계유산 전통 마을로, 고택과 만송정 소나무 숲길이 아름답습니다.',
        seniorTip: '💡 매표소에서 마을 입구까지 셔틀버스가 수시로 운행하며 마을 내부는 모두 평탄한 흙길입니다.',
        lat: 36.5392,
        lng: 128.5181,
        mapX: 61,
        mapY: 43
      },
      {
        id: 'hk-5',
        name: '합천 해인사 소리길',
        kakaoQuery: '해인사 소리길',
        region: '경남 합천군',
        category: '🍵 한옥·사찰',
        address: '경상남도 합천군 가야면 해인사길 122',
        desc: '가야산 홍류동 계곡의 맑은 물소리와 새소리를 들으며 완만한 나무 데크길을 따라 걷는 명품 산책길입니다.',
        seniorTip: '💡 계곡 옆으로 안전한 평지형 목재 데크가 잘 깔려 있어 풍경을 보며 걷기에 아주 쾌적합니다.',
        lat: 35.8014,
        lng: 128.0981,
        mapX: 54,
        mapY: 58
      },
      {
        id: 'hk-6',
        name: '순천 선암사 & 승선교',
        kakaoQuery: '순천 선암사',
        region: '전남 순천시',
        category: '🍵 한옥·사찰',
        address: '전라남도 순천시 승주읍 선암사길 450',
        desc: '아름다운 무지개 다리(승선교)와 수백 년 된 매화나무, 야생 차밭이 어우러진 고즈넉한 천년 고찰입니다.',
        seniorTip: '💡 주차장에서 사찰까지 이어지는 숲길이 넓고 완만하여 삼림욕 산책으로 최고입니다.',
        lat: 34.9958,
        lng: 127.3311,
        mapX: 41,
        mapY: 69
      }
    ]
  },
  market: {
    title: '🍲 전통시장 · 노포 미식 여행 (6곳)',
    places: [
      {
        id: 'mk-1',
        name: '속초 관광수산시장 (중앙시장)',
        kakaoQuery: '속초관광수산시장',
        region: '강원 속초시',
        category: '🍲 전통시장·미식',
        address: '강원특별자치도 속초시 중앙로147번길 12',
        desc: '동해안의 싱싱한 해산물과 닭강정, 오징어순대 등 명물 먹거리를 맛보고 아바이마을 갯배도 체험할 수 있는 활기찬 시장입니다.',
        seniorTip: '💡 대형 공영주차장과 아케이드 지붕이 잘 되어 있어 날씨에 상관없이 편하게 구경할 수 있습니다.',
        lat: 38.2044,
        lng: 128.5901,
        mapX: 62,
        mapY: 13
      },
      {
        id: 'mk-2',
        name: '단양 구경시장',
        kakaoQuery: '단양구경시장',
        region: '충북 단양군',
        category: '🍲 전통시장·미식',
        address: '충청북도 단양군 단양읍 도전5길 31',
        desc: '남한강 절경과 함께 단양 특산물 마늘 떡갈비, 마늘 순대, 흑마늘 빵을 맛볼 수 있는 대표 전통시장입니다.',
        seniorTip: '💡 시장 바로 옆이 남한강 수변 산책로와 만천하 스카이워크 방향이라 여행 코스로 묶기 좋습니다.',
        lat: 36.9847,
        lng: 128.3688,
        mapX: 56,
        mapY: 35
      },
      {
        id: 'mk-3',
        name: '정선 아리랑시장 (5일장)',
        kakaoQuery: '정선아리랑시장',
        region: '강원 정선군',
        category: '🍲 전통시장·미식',
        address: '강원특별자치도 정선군 정선읍 봉양7길 39',
        desc: '강원도 산나물과 곤드레 나물밥, 수수부꾸미, 메밀전병을 맛보며 장터 공연도 구경하는 전국 대표 5일장입니다.',
        seniorTip: '💡 청량리역에서 기차로 방문하기 좋고, 근처 병방치 스카이워크와 아리힐스 전망대가 유명합니다.',
        lat: 37.3806,
        lng: 128.6608,
        mapX: 62,
        mapY: 28
      },
      {
        id: 'mk-4',
        name: '서울 광장시장 먹자골목',
        kakaoQuery: '광장시장',
        region: '서울 종로구',
        category: '🍲 전통시장·미식',
        address: '서울특별시 종로구 창경궁로 88',
        desc: '고소한 녹두빈대떡, 육회, 마약김밥과 함께 종로 일대 전통 맛집들이 모여 있는 서울 대표 미식 명소입니다.',
        seniorTip: '💡 지하철 1호선 종로5가역 바로 앞이며, 식사 후 청계천 산책로를 따라 걷기 좋습니다.',
        lat: 37.5701,
        lng: 126.9997,
        mapX: 36,
        mapY: 23
      },
      {
        id: 'mk-5',
        name: '예산 상설시장',
        kakaoQuery: '예산시장',
        region: '충남 예산군',
        category: '🍲 전통시장·미식',
        address: '충청남도 예산군 예산읍 형제고개로 967',
        desc: '레트로 장터 분위기를 살린 시장 광장에서 파기름 국수, 숯불 바비큐, 사과 디저트를 즐길 수 있는 핫플레이스입니다.',
        seniorTip: '💡 시장 앞 대형 주차장이 넓고, 근처 예당호 출렁다리나 수덕사와 함께 둘러보기 좋습니다.',
        lat: 36.6811,
        lng: 126.8489,
        mapX: 32,
        mapY: 41
      },
      {
        id: 'mk-6',
        name: '담양 창평전통시장 & 죽녹원 국수거리',
        kakaoQuery: '담양 죽녹원',
        region: '전남 담양군',
        category: '🍲 전통시장·미식',
        address: '전라남도 담양군 담양읍 죽녹원로 119',
        desc: '깊은 국물의 전통 국밥과 담양 떡갈비, 대통밥, 댓잎 아이스크림을 만날 수 있는 남도 미식 일번지입니다.',
        seniorTip: '💡 죽녹원 대나무숲과 관방제림 강변 산책로가 바로 옆에 있어 식사 후 산책 코스로 완벽합니다.',
        lat: 35.3278,
        lng: 126.9856,
        mapX: 34,
        mapY: 66
      }
    ]
  },
  train: {
    title: '🚂 기차 · 케이블카 나들이 추천 명소 (6곳)',
    places: [
      {
        id: 'tr-1',
        name: '춘천 삼악산 호수케이블카',
        kakaoQuery: '춘천삼악산호수케이블카',
        region: '강원 춘천시',
        category: '🚂 기차·케이블카',
        address: '강원특별자치도 춘천시 스포츠타운길 245',
        desc: 'ITX-청춘 열차를 타고 가볍게 다녀올 수 있는 호수 여행지로, 국내 최장 호수케이블카에서 내려다보는 의암호가 장관입니다.',
        seniorTip: '💡 기차역에서 택시나 버스로 10분 거리이며, 케이블카 상부 정차장 전망대 데크길이 잘 정비되어 있습니다.',
        lat: 37.8659,
        lng: 127.6924,
        mapX: 47,
        mapY: 19
      },
      {
        id: 'tr-2',
        name: '양평 두물머리 & 세미원',
        kakaoQuery: '양평 두물머리',
        region: '경기 양평군',
        category: '🚂 기차·케이블카',
        address: '경기도 양평군 양서면 두물머리길 145',
        desc: '경의중앙선 양수역에서 내려 걸어갈 수 있는 북한강·남한강 합수머리로, 400년 느티나무와 세미원 연꽃 정원이 아름답습니다.',
        seniorTip: '💡 코스 전체가 강변 평지 산책로이며, 명물 연잎 핫도그와 강변 뷰 카페를 즐기며 쉬어가기 좋습니다.',
        lat: 37.5327,
        lng: 127.3175,
        mapX: 41,
        mapY: 25
      },
      {
        id: 'tr-3',
        name: '제천 청풍호반 케이블카',
        kakaoQuery: '청풍호반케이블카',
        region: '충북 제천시',
        category: '🚂 기차·케이블카',
        address: '충청북도 제천시 청풍면 문화재길 166',
        desc: '청량리역에서 KTX-이음으로 1시간이면 닿는 제천에서, 내륙의 바다라 불리는 청풍호를 360도로 조망하는 케이블카입니다.',
        seniorTip: '💡 정상까지 걸어 올라갈 필요 없이 케이블카에서 내리면 바로 넓고 탁 트인 전망대와 카페로 연결됩니다.',
        lat: 37.0012,
        lng: 128.1782,
        mapX: 52,
        mapY: 34
      },
      {
        id: 'tr-4',
        name: '곡성 섬진강 기차마을',
        kakaoQuery: '섬진강기차마을',
        region: '전남 곡성군',
        category: '🚂 기차·케이블카',
        address: '전라남도 곡성군 오곡면 기차마을로 232',
        desc: '옛 곡성역에서 레트로 증기기관차를 타고 섬진강 변을 달리며 수만 송이 장미공원과 레일바이크를 즐기는 낭만 코스입니다.',
        seniorTip: '💡 KTX 곡성역 바로 옆에 위치해 기차에서 내리자마자 도보로 바로 입장하실 수 있습니다.',
        lat: 35.2764,
        lng: 127.3025,
        mapX: 40,
        mapY: 65
      },
      {
        id: 'tr-5',
        name: '통영 케이블카 & 동피랑 벽화마을',
        kakaoQuery: '통영케이블카',
        region: '경남 통영시',
        category: '🚂 기차·케이블카',
        address: '경상남도 통영시 발개로 205',
        desc: '케이블카를 타고 미륵산 전망대에 올라가 보석처럼 빛나는 한려수도 다도해 섬들을 한눈에 감상합니다.',
        seniorTip: '💡 상부 승강장에서 전망대까지 완만한 나무 데크로 연결되어 누구나 쉽게 바다 파노라마를 볼 수 있습니다.',
        lat: 34.8125,
        lng: 128.4239,
        mapX: 57,
        mapY: 73
      },
      {
        id: 'tr-6',
        name: '목포 해상케이블카 & 고하도 전망대',
        kakaoQuery: '목포해상케이블카 북항스테이션',
        region: '전남 목포시',
        category: '🚂 기차·케이블카',
        address: '전라남도 목포시 해양대학로 240',
        desc: '유달산에서 고하도까지 다도해 바다 위를 가로지르는 국내 최장 해상케이블카와 해안 데크길 코스입니다.',
        seniorTip: '💡 케이블카를 타고 고하도에 내리면 해안가를 따라 평탄한 해상 데크 산책로가 멋지게 펼쳐집니다.',
        lat: 34.7876,
        lng: 126.3821,
        mapX: 25,
        mapY: 73
      }
    ]
  },
  spa: {
    title: '♨️ 온천 · 숲속 힐링 여행 추천 명소 (5곳)',
    places: [
      {
        id: 'sp-1',
        name: '아산 온양온천 & 곡교천 은행나무길',
        kakaoQuery: '곡교천은행나무길',
        region: '충남 아산시',
        category: '♨️ 온천·숲속힐링',
        address: '충청남도 아산시 염치읍 백암리 502-3',
        desc: '전철 1호선과 기차로 바로 닿는 역사 깊은 온천 휴양지로, 온천 스파와 아름다운 곡교천 은행나무길 산책을 함께 즐깁니다.',
        seniorTip: '💡 온양온천역 바로 앞 광장에 무료 야외 족욕장이 있어 가볍게 체험하기에도 좋습니다.',
        lat: 36.7812,
        lng: 127.0028,
        mapX: 34,
        mapY: 39
      },
      {
        id: 'sp-2',
        name: '충주 수안보 온천 & 족욕길',
        kakaoQuery: '수안보족욕길',
        region: '충북 충주시',
        category: '♨️ 온천·숲속힐링',
        address: '충청북도 충주시 수안보면 물탕2길 17',
        desc: '천연 미네랄 온천수가 솟아나는 대표 온천 마을로, 수안보 물탕공원과 석문천변에서 무료 야외 족욕을 즐길 수 있습니다.',
        seniorTip: '💡 족욕길 주변이 평탄한 벚꽃·단풍 산책로로 꾸며져 있어 온천과 산책을 한 번에 즐기기 좋습니다.',
        lat: 36.8477,
        lng: 127.9912,
        mapX: 49,
        mapY: 38
      },
      {
        id: 'sp-3',
        name: '울진 덕구온천 & 죽변 해안스카이레일',
        kakaoQuery: '덕구온천리조트스파월드',
        region: '경북 울진군',
        category: '♨️ 온천·숲속힐링',
        address: '경상북도 울진군 북면 덕구온천로 924',
        desc: '응봉산 계곡에서 자연 용출되는 온천수가 흐르는 리조트 스파로, 근처 동해 바다 위를 달리는 해안 모노레일도 인기입니다.',
        seniorTip: '💡 온천 스파 후 죽변 해안스카이레일을 타면 에메랄드빛 울진 바다를 바로 위에서 감상할 수 있습니다.',
        lat: 37.0789,
        lng: 129.2814,
        mapX: 72,
        mapY: 35
      },
      {
        id: 'sp-4',
        name: '장성 축령산 편백숲 (치유의 숲)',
        kakaoQuery: '축령산편백숲',
        region: '전남 장성군',
        category: '♨️ 온천·숲속힐링',
        address: '전라남도 장성군 서삼면 모암길 292',
        desc: '하늘을 찌를 듯 뻗은 수만 그루의 편백나무 숲에서 피톤치드 삼림욕을 즐기며 몸과 마음을 재충전하는 명소입니다.',
        seniorTip: '💡 숲 입구에서 이어지는 데크 산책로와 숲속 쉼터 벤치에서 맑은 공기를 마시며 휴식하기 좋습니다.',
        lat: 35.3822,
        lng: 126.7433,
        mapX: 30,
        mapY: 64
      },
      {
        id: 'sp-5',
        name: '제주 사려니숲길',
        kakaoQuery: '사려니숲길',
        region: '제주 제주시',
        category: '♨️ 온천·숲속힐링',
        address: '제주특별자치도 제주시 조천읍 교래리 산 137-1',
        desc: '삼나무와 편백나무가 우거진 제주 대표 힐링 숲길로, 붉은 화산송이 흙길과 평탄한 나무 데크가 아름답게 이어집니다.',
        seniorTip: '💡 경사가 거의 없는 평탄한 숲속 나무 데크길이 조성되어 있어 비 오는 날이나 맑은 날 모두 운치 있습니다.',
        lat: 33.4228,
        lng: 126.6264,
        mapX: 32,
        mapY: 91
      }
    ]
  },
  island: {
    title: '🏝️ 아름다운 섬 · 해안 비경 추천 명소 (5곳)',
    places: [
      {
        id: 'is-1',
        name: '제주 섭지코지 & 성산일출봉',
        kakaoQuery: '섭지코지',
        region: '제주 서귀포시',
        category: '🏝️ 섬·해안비경',
        address: '제주특별자치도 서귀포시 성산읍 고성리',
        desc: '푸른 제주 바다 너머로 성산일출봉이 한눈에 보이는 완만한 해안 언덕길로, 봄 유채꽃과 가을 억새가 일품입니다.',
        seniorTip: '💡 해안가를 따라 포장된 산책로가 잘 되어 있어 가파른 오르막 없이도 일출봉과 바다 절경을 감상할 수 있습니다.',
        lat: 33.4242,
        lng: 126.9311,
        mapX: 37,
        mapY: 92
      },
      {
        id: 'is-2',
        name: '거제 바람의언덕 & 외도 보타니아',
        kakaoQuery: '거제 바람의언덕',
        region: '경남 거제시',
        category: '🏝️ 섬·해안비경',
        address: '경상남도 거제시 남부면 갈곶리 산14-47',
        desc: '풍차가 돌아가는 시원한 바닷가 언덕과 유람선을 타고 들어가는 해상 식물원 외도 보타니아 코스입니다.',
        seniorTip: '💡 도장포 유람선 선착장이 바로 옆에 있어 유람선을 타고 해금강과 외도를 함께 둘러보기 좋습니다.',
        lat: 34.7447,
        lng: 128.6631,
        mapX: 62,
        mapY: 71
      },
      {
        id: 'is-3',
        name: '남해 독일마을 & 물건리 방조어부림',
        kakaoQuery: '남해독일마을',
        region: '경남 남해군',
        category: '🏝️ 섬·해안비경',
        address: '경상남도 남해군 삼동면 독일로 92',
        desc: '주황색 지붕의 이국적인 마을 전망대와 바닷가 바로 앞 초승달 모양의 해안 숲길(방조어부림)을 함께 즐깁니다.',
        seniorTip: '💡 전망대 광장까지 차량으로 바로 올라갈 수 있어 남해 바다와 마을 전경을 한눈에 담을 수 있습니다.',
        lat: 34.7942,
        lng: 128.0469,
        mapX: 52,
        mapY: 73
      },
      {
        id: 'is-4',
        name: '신안 퍼플섬 (반월도 · 박지도)',
        kakaoQuery: '신안 퍼플교',
        region: '전남 신안군',
        category: '🏝️ 섬·해안비경',
        address: '전라남도 신안군 안좌면 소곡두리길 257-35',
        desc: '유엔세계관광기구가 선정한 최우수 관광마을로, 섬 전체와 바다 위 목교가 온통 보라색으로 꾸며진 동화 같은 섬입니다.',
        seniorTip: '💡 보라색 옷이나 소품을 착용하고 방문하면 무료입장 혜택이 있으며, 해안 일주 전동 카트도 운행됩니다.',
        lat: 34.7311,
        lng: 126.1086,
        mapX: 20,
        mapY: 73
      },
      {
        id: 'is-5',
        name: '울릉도 내수전 일출전망대 & 태하 모노레일',
        kakaoQuery: '울릉도 내수전일출전망대',
        region: '경북 울릉군',
        category: '🏝️ 섬·해안비경',
        address: '경상북도 울릉군 울릉읍 저동리 산33',
        desc: '대형 크루즈 여객선으로 갈 수 있는 동해의 보석 울릉도와 에메랄드빛 해안 절경을 보여주는 모노레일 코스입니다.',
        seniorTip: '💡 주요 해안 절경 구간에 모노레일과 전망 엘리베이터가 설치되어 있어 편하게 비경을 감상할 수 있습니다.',
        lat: 37.5081,
        lng: 130.9108,
        mapX: 86,
        mapY: 30
      }
    ]
  },
  history: {
    title: '🏛️ 고궁 · 역사문화 산책 추천 명소 (5곳)',
    places: [
      {
        id: 'hi-1',
        name: '서울 경복궁 & 청와대 산책로',
        kakaoQuery: '경복궁',
        region: '서울 종로구',
        category: '🏛️ 고궁·역사산책',
        address: '서울특별시 종로구 사직로 161',
        desc: '웅장한 근정전과 연못 위의 경회루, 그리고 북악산 아래 푸른 잔디밭이 펼쳐진 청와대 경내를 걷는 품격 있는 코스입니다.',
        seniorTip: '💡 경복궁 신무문을 통과하면 청와대 산책로와 바로 이어지며, 서촌·북촌 카페거리와 함께 가기 좋습니다.',
        lat: 37.5796,
        lng: 126.977,
        mapX: 35,
        mapY: 22
      },
      {
        id: 'hi-2',
        name: '국립중앙박물관 (사유의 방 & 거울못)',
        kakaoQuery: '국립중앙박물관',
        region: '서울 용산구',
        category: '🏛️ 고궁·역사산책',
        address: '서울특별시 용산구 서빙고로 137',
        desc: '두 반가사유상을 만나는 고요한 사유의 방과 아름다운 야외 거울못 정원을 무료로 감상할 수 있는 세계적 박물관입니다.',
        seniorTip: '💡 이촌역 지하 통로(박물관 나들길)와 바로 연결되어 비나 더위를 피해 쾌적하게 방문할 수 있습니다.',
        lat: 37.5239,
        lng: 126.9803,
        mapX: 35,
        mapY: 25
      },
      {
        id: 'hi-3',
        name: '수원 화성 방화수류정 & 행궁동 카페거리',
        kakaoQuery: '방화수류정',
        region: '경기 수원시',
        category: '🏛️ 고궁·역사산책',
        address: '경기도 수원시 팔달구 정조로 825',
        desc: '관광열차(화성어차)를 타고 유네스코 세계유산 수원 화성과 연못(용연), 행궁동 카페거리를 둘러보는 인기 코스입니다.',
        seniorTip: '💡 화성어차를 이용하면 성곽 주요 명소를 앉아서 오디오 해설과 함께 구경할 수 있고 야경도 멋집니다.',
        lat: 37.2827,
        lng: 127.0135,
        mapX: 35,
        mapY: 28
      },
      {
        id: 'hi-4',
        name: '부여 궁남지',
        kakaoQuery: '부여 궁남지',
        region: '충남 부여군',
        category: '🏛️ 고궁·역사산책',
        address: '충청남도 부여군 부여읍 궁남로 52',
        desc: '우리나라 최초의 인공 정원으로, 연못 한가운데 포룡정 정자와 버드나무·연꽃 산책길이 그림처럼 펼쳐집니다.',
        seniorTip: '💡 호수 둘레 전체가 평지 산책로이고 밤에는 조명이 켜져 야간 산책과 사진 촬영 명소로 유명합니다.',
        lat: 36.2694,
        lng: 126.9128,
        mapX: 34,
        mapY: 48
      },
      {
        id: 'hi-5',
        name: '공주 공산성 & 무령왕릉 왕릉원',
        kakaoQuery: '공산성',
        region: '충남 공주시',
        category: '🏛️ 고궁·역사산책',
        address: '충청남도 공주시 웅진로 280',
        desc: '1500년 백제의 숨결이 살아있는 왕릉원 소나무 숲길과 유유히 흐르는 금강을 내려다보는 역사 나들이 명소입니다.',
        seniorTip: '💡 잘 가꾸어진 잔디와 솔숲 산책로가 아름다우며, 근처 제민천 카페거리와 밤 디저트가 유명합니다.',
        lat: 36.4661,
        lng: 127.1128,
        mapX: 37,
        mapY: 45
      }
    ]
  }
};

// AI 검색용 추가 실존 명소 & 지역 대표 맛집 데이터베이스 (지역 검색 시 오직 해당 지역만 정확히 추천!)
const EXTRA_FAMOUS_PLACES = [
  // ---- [강릉] ----
  {
    id: 'ex-gn-1',
    name: '강릉 초당순두부마을 (전통 순두부 & 짬뽕순두부)',
    kakaoQuery: '강릉 초당순두부마을',
    region: '강원 강릉시',
    category: '🍲 강릉 대표 맛집',
    address: '강원특별자치도 강릉시 초당순두부길 89',
    desc: '바닷물로 간수한 고소하고 부드러운 전통 초당순두부 정식과 얼큰한 짬뽕순두부, 순두부 젤라또가 유명한 강릉 1순위 미식 거리입니다.',
    seniorTip: '💡 경포호수와 허균·허난설헌 기념공원 솔숲 바로 옆이라 식사 전후 산책 코스로 완벽합니다.',
    lat: 37.7911,
    lng: 128.9145,
    mapX: 65,
    mapY: 21
  },
  {
    id: 'ex-gn-2',
    name: '강릉 중앙시장 먹자골목 (감자옹심이 · 장칼국수 · 닭강정)',
    kakaoQuery: '강릉중앙시장',
    region: '강원 강릉시',
    category: '🍲 강릉 전통시장 맛집',
    address: '강원특별자치도 강릉시 금성로 21',
    desc: '강릉 토속 음식인 쫄깃한 감자옹심이, 얼큰한 장칼국수, 배니닭강정, 수제 어묵고로케 등 강릉의 모든 맛집이 모인 중심 시장입니다.',
    seniorTip: '💡 공영주차장이 잘 갖춰져 있고 비가림 아케이드 지붕 덕분에 날씨와 상관없이 편하게 맛집 투어를 할 수 있습니다.',
    lat: 37.754,
    lng: 128.8986,
    mapX: 64,
    mapY: 23
  },
  {
    id: 'ex-gn-3',
    name: '강릉 안목해변 커피거리 & 해안 횟집 거리',
    kakaoQuery: '강릉 안목해변 커피거리',
    region: '강원 강릉시',
    category: '☕ 강릉 오션뷰 카페·횟집',
    address: '강원특별자치도 강릉시 창해로14번길 20-1',
    desc: '푸른 동해 바다 바로 앞에 통유리 오션뷰 카페들과 신선한 활어회·해물찜 식당들이 줄지어 있는 강릉 대표 해변 거리입니다.',
    seniorTip: '💡 해변 백사장 옆으로 평탄한 산책로가 이어져 식사 후 바다를 보며 커피 한잔하기 최고입니다.',
    lat: 37.7726,
    lng: 128.9472,
    mapX: 68,
    mapY: 22
  },
  {
    id: 'ex-gn-4',
    name: '강릉 경포해변 & 사천 물회 마을',
    kakaoQuery: '강릉 사천항 물회',
    region: '강원 강릉시',
    category: '🍲 강릉 해산물 맛집',
    address: '강원특별자치도 강릉시 사천면 진리항구길 47',
    desc: '동해안에서 갓 잡은 싱싱한 가자미·오징어로 만든 시원한 강릉식 물회와 섭국, 전복죽으로 유명한 해안 미식 명소입니다.',
    seniorTip: '💡 항구 바로 앞 무료 주차장이 넓고 경포호수 산책길과 차로 5분 거리입니다.',
    lat: 37.8412,
    lng: 128.8765,
    mapX: 65,
    mapY: 18
  },

  // ---- [전주] ----
  {
    id: 'ex-jj-1',
    name: '전주 한옥마을 전주비빔밥 & 떡갈비 골목',
    kakaoQuery: '전주한옥마을 비빔밥 맛집',
    region: '전북 전주시',
    category: '🍲 전주 대표 맛집',
    address: '전북특별자치도 전주시 완산구 어진길 119',
    desc: '놋그릇에 정갈하게 담아낸 정통 전주 육회비빔밥과 숯불 향 가득한 한우 떡갈비를 맛볼 수 있는 한옥마을 중심 미식 골목입니다.',
    seniorTip: '💡 경기전 바로 옆 평지 골목에 위치해 식사 후 한옥마을 산책으로 바로 이어집니다.',
    lat: 35.8165,
    lng: 127.1512,
    mapX: 36,
    mapY: 56
  },
  {
    id: 'ex-jj-2',
    name: '전주 남부시장 콩나물국밥 & 한옥 전망대 카페거리',
    kakaoQuery: '전주 남부시장 콩나물국밥',
    region: '전북 전주시',
    category: '🍲 전주 전통시장·찻집',
    address: '전북특별자치도 전주시 완산구 풍남문2길 63',
    desc: '시원하고 개운한 전주 남부시장식 콩나물국밥과 한옥 기와지붕이 한눈에 내려다보이는 전통 찻집·루프탑 카페 거리입니다.',
    seniorTip: '💡 전주 한옥마을에서 도보 5분 거리이며 천변 산책로와 함께 둘러보기 좋습니다.',
    lat: 35.8122,
    lng: 127.1476,
    mapX: 38,
    mapY: 58
  },
  {
    id: 'ex-jj-3',
    name: '전주 덕진공원 연꽃 산책로 & 연화정도서관',
    kakaoQuery: '전주 덕진공원',
    region: '전북 전주시',
    category: '🌸 전주 호수·한옥도서관',
    address: '전북특별자치도 전주시 덕진구 권삼득로 390',
    desc: '넓은 호수 위를 가로지르는 연화교와 물 위에 떠 있는 아름다운 한옥 도서관(연화정도서관)이 있는 전주 대표 명소입니다.',
    seniorTip: '💡 호수 위 다리와 도서관 내부가 모두 평지로 연결되어 사진 찍기와 휴식에 최고입니다.',
    lat: 35.8475,
    lng: 127.1223,
    mapX: 34,
    mapY: 55
  },

  // ---- [여수] ----
  {
    id: 'ex-ys-1',
    name: '여수 이순신광장 게장백반 골목 & 낭만포차거리',
    kakaoQuery: '여수 게장백반거리',
    region: '전남 여수시',
    category: '🍲 여수 대표 맛집',
    address: '전라남도 여수시 봉산남4길 23-26',
    desc: '감칠맛 나는 여수 돌게장 백반, 갈치조림, 서대회무침과 바닷가 이순신광장의 딸기모찌·해풍쑥 아이스크림을 즐기는 미식 코스입니다.',
    seniorTip: '💡 식당들이 한 골목에 모여 있고 오동도·여수 해상케이블카와 차로 5~10분 거리입니다.',
    lat: 34.7352,
    lng: 127.7261,
    mapX: 46,
    mapY: 74
  },
  {
    id: 'ex-ys-2',
    name: '여수 해상케이블카 & 돌산공원 전망대',
    kakaoQuery: '여수해상케이블카 돌산탑승장',
    region: '전남 여수시',
    category: '🌊 여수 바다 전망·야경',
    address: '전라남도 여수시 돌산읍 돌산로 3600-1',
    desc: '바다 위를 건너 돌산도와 자산공원을 잇는 해상케이블카로, 여수 밤바다 야경과 다도해 일몰이 아름답습니다.',
    seniorTip: '💡 오동도 및 이순신광장 먹거리 골목과 가까워 여수 여행 핵심 코스로 꼽힙니다.',
    lat: 34.7289,
    lng: 127.7425,
    mapX: 49,
    mapY: 75
  },

  // ---- [부산] ----
  {
    id: 'ex-bs-1',
    name: '부산 자갈치시장 & 남포동 국제시장 먹자골목',
    kakaoQuery: '부산 자갈치시장',
    region: '부산 중구',
    category: '🍲 부산 대표 맛집',
    address: '부산광역시 중구 자갈치해안로 52',
    desc: '싱싱한 생선회와 꼼장어구이, 부산 돼지국밥, 밀면, 씨앗호떡까지 부산의 대표 별미를 한자리에서 맛보는 미식 명소입니다.',
    seniorTip: '💡 지하철 자갈치역·남포역 바로 앞이며, 자갈치 현대화 건물 엘리베이터와 바다 전망대가 편리합니다.',
    lat: 35.0966,
    lng: 129.0306,
    mapX: 70,
    mapY: 69
  },
  {
    id: 'ex-bs-2',
    name: '부산 해동용궁사 & 기장 연화리 해녀촌 맛집',
    kakaoQuery: '부산 해동용궁사',
    region: '부산 기장군',
    category: '🌊 부산 바다사찰·맛집',
    address: '부산광역시 기장군 기장읍 용궁길 86',
    desc: '푸른 동해 바다 절벽 위의 아름다운 해동용궁사와 바로 근처 기장 연화리의 고소한 전복죽·해산물 모둠 맛집 코스입니다.',
    seniorTip: '💡 해운대 블루라인파크 송정역에서 가까워 해변열차 코스와 함께 둘러보기 좋습니다.',
    lat: 35.1884,
    lng: 129.2233,
    mapX: 74,
    mapY: 66
  },

  // ---- [제주] ----
  {
    id: 'ex-jeju-1',
    name: '제주 동문재래시장 & 흑돼지·갈치조림 맛집 거리',
    kakaoQuery: '제주동문시장',
    region: '제주 제주시',
    category: '🍲 제주 대표 맛집',
    address: '제주특별자치도 제주시 관덕로14길 20',
    desc: '제주 은갈치조림, 고기국수, 흑돼지 구이, 오메기떡, 천혜향 주스 등 제주의 산해진미가 모두 모인 대표 시장입니다.',
    seniorTip: '💡 제주공항에서 차로 15분 거리이며 대형 주차 빌딩과 평지 아케이드 통로가 잘 갖춰져 있습니다.',
    lat: 33.5127,
    lng: 126.5282,
    mapX: 31,
    mapY: 90
  },
  {
    id: 'ex-jeju-2',
    name: '제주 애월 한담해안산책로 & 오션뷰 카페거리',
    kakaoQuery: '제주 한담해안산책로',
    region: '제주 제주시',
    category: '🏝️ 제주 해안·카페',
    address: '제주특별자치도 제주시 애월읍 곽지리 1359',
    desc: '에메랄드빛 애월 바다를 따라 구불구불 이어지는 평탄한 해안 산책로와 해물라면·전복김밥 맛집, 오션뷰 카페거리입니다.',
    seniorTip: '💡 해안 바로 옆을 따라 포장된 보행 전용 산책로라 파도 소리를 들으며 걷기 좋습니다.',
    lat: 33.4589,
    lng: 126.3105,
    mapX: 28,
    mapY: 92
  },

  // ---- [속초 / 춘천 / 경주 / 단양] ----
  {
    id: 'ex-sc-1',
    name: '속초 영금정 해안전망대 & 동명항 물회·대게 거리',
    kakaoQuery: '속초 영금정',
    region: '강원 속초시',
    category: '🌊 속초 전망·맛집',
    address: '강원특별자치도 속초시 영금정로 43',
    desc: '엘리베이터를 타고 바다 위 정자(영금정)에 올라 동해 절경을 감상하고, 바로 옆 항구에서 물회와 대게, 생선구이를 맛봅니다.',
    seniorTip: '💡 계단 대신 무료 전망 엘리베이터가 설치되어 있어 누구나 편하게 바다 위 구름다리를 건널 수 있습니다.',
    lat: 38.2124,
    lng: 128.5992,
    mapX: 63,
    mapY: 12
  },
  {
    id: 'ex-cc-1',
    name: '춘천 명동 닭갈비골목 & 막국수 맛집 거리',
    kakaoQuery: '춘천명동닭갈비골목',
    region: '강원 춘천시',
    category: '🍲 춘천 대표 맛집',
    address: '강원특별자치도 춘천시 금강로62번길 12',
    desc: '춘천 여행에 빠질 수 없는 원조 철판·숯불 닭갈비와 향긋한 메밀 막국수를 맛볼 수 있는 대표 미식 골목입니다.',
    seniorTip: '💡 경춘선 춘천역·남춘천역에서 가까우며 식사 후 공지천이나 삼악산 케이블카로 이동하기 편리합니다.',
    lat: 37.8794,
    lng: 127.7282,
    mapX: 49,
    mapY: 20
  },
  {
    id: 'ex-gj-1',
    name: '경주 황리단길 맛집 & 경주 쌈밥·한정식 거리',
    kakaoQuery: '경주 황리단길 맛집',
    region: '경북 경주시',
    category: '🍲 경주 대표 맛집',
    address: '경상북도 경주시 포석로 1080',
    desc: '대릉원 돌담길 옆으로 푸짐한 경주 한우 떡갈비, 연잎 쌈밥 한정식, 황남빵, 십원빵과 한옥 카페가 이어진 명소입니다.',
    seniorTip: '💡 거리 전체가 평지이고 대릉원·첨성대 산책 코스와 바로 맞닿아 있습니다.',
    lat: 35.8375,
    lng: 129.2097,
    mapX: 70,
    mapY: 56
  },
  {
    id: 'ex-dy-1',
    name: '단양 도담삼봉 유람선 & 마늘 떡갈비 한정식 거리',
    kakaoQuery: '단양 도담삼봉',
    region: '충북 단양군',
    category: '🌊 단양 명승·맛집',
    address: '충청북도 단양군 매포읍 삼봉로 644',
    desc: '남한강 한가운데 솟은 도담삼봉 절경을 유람선과 평지 광장에서 감상하고, 단양 명물 마늘 떡갈비·쏘가리매운탕을 즐깁니다.',
    seniorTip: '💡 주차장에서 전망대까지 평지로 바로 연결되어 걸음 부담 없이 절경을 감상할 수 있습니다.',
    lat: 37.0014,
    lng: 128.3431,
    mapX: 55,
    mapY: 36
  }
];

// 기본 초기 보물지도첩 데이터 (처음 열었을 때 바로 보이는 대표 명소 3곳)
const DEFAULT_SAVED_PLACES = [
  {
    id: 'sea-1',
    name: '강릉 경포호수 & 경포해변 솔밭길',
    kakaoQuery: '강릉 경포호',
    region: '강원 강릉시',
    category: '⭐ 내 별표 명소',
    address: '강원특별자치도 강릉시 저동 94',
    desc: '바닷바람과 소나무 향기를 맡으며 호수 둘레를 걷는 평탄한 산책로입니다.',
    seniorTip: '📝 내 메모: 호수 산책로도 넓고 근처 초당순두부가 정말 맛있었음!',
    lat: 37.7955,
    lng: 128.9086,
    mapX: 66,
    mapY: 20
  },
  {
    id: 'hk-1',
    name: '전주 한옥마을 & 경기전',
    kakaoQuery: '전주한옥마을',
    region: '전북 전주시',
    category: '⭐ 내 별표 명소',
    address: '전북특별자치도 전주시 완산구 태조로 44',
    desc: '고풍스러운 한옥 골목길과 경기전의 푸른 대나무 숲길을 걸으며 전통 차를 즐길 수 있습니다.',
    seniorTip: '📝 내 메모: 한옥 골목 야경도 예쁘고 전망대 카페가 참 좋았던 곳.',
    lat: 35.8147,
    lng: 127.1526,
    mapX: 36,
    mapY: 57
  },
  {
    id: 'sea-2',
    name: '부산 해운대 블루라인파크 해변열차',
    kakaoQuery: '해운대블루라인파크 미포정거장',
    region: '부산 해운대구',
    category: '⭐ 내 별표 명소',
    address: '부산광역시 해운대구 달맞이길62번길 13',
    desc: '푸른 동해 바다 바로 옆을 달리는 해변열차와 해안 산책로입니다.',
    seniorTip: '📝 내 메모: 해변열차 타고 바다 구경하기가 너무 좋고 노을 풍경이 최고였음!',
    lat: 35.1587,
    lng: 129.1794,
    mapX: 72,
    mapY: 67
  }
];

// 지역 이름 -> 대한민국 팔도 지도 좌표 & 실제 위경도 자동 매핑 도우미
const REGION_COORD_MAP = [
  { keywords: ['서울', '종로', '강서', '용산', '강남', '마포', '은평', '잠실', '홍대', '성수'], mapX: 35, mapY: 23, lat: 37.5665, lng: 126.978 },
  { keywords: ['인천', '강화', '송도', '영종도', '을왕리'], mapX: 26, mapY: 24, lat: 37.4563, lng: 126.7052 },
  { keywords: ['경기', '수원', '오산', '양평', '가평', '파주', '일산', '분당', '포천', '용인'], mapX: 38, mapY: 26, lat: 37.2827, lng: 127.0135 },
  { keywords: ['춘천', '홍천', '원주', '인제'], mapX: 48, mapY: 21, lat: 37.8742, lng: 127.7051 },
  { keywords: ['강릉', '속초', '양양', '동해', '삼척', '평창', '정선', '강원', '고성'], mapX: 63, mapY: 21, lat: 37.7955, lng: 128.9086 },
  { keywords: ['태안', '보령', '서산', '당진', '안면도', '대천'], mapX: 21, mapY: 41, lat: 36.7989, lng: 126.1489 },
  { keywords: ['충남', '예산', '아산', '천안', '공주', '부여', '대전', '세종', '논산'], mapX: 35, mapY: 43, lat: 36.4661, lng: 127.1128 },
  { keywords: ['충북', '청주', '충주', '제천', '단양', '보은'], mapX: 50, mapY: 37, lat: 36.9847, lng: 128.3688 },
  { keywords: ['전북', '전주', '군산', '익산', '남원', '정읍', '부안', '무주'], mapX: 36, mapY: 57, lat: 35.8147, lng: 127.1526 },
  { keywords: ['광주', '담양', '장성', '곡성', '나주', '구례'], mapX: 34, mapY: 65, lat: 35.3278, lng: 126.9856 },
  { keywords: ['목포', '신안', '해남', '진도', '강진', '완도', '영암'], mapX: 25, mapY: 73, lat: 34.7876, lng: 126.3821 },
  { keywords: ['여수', '순천', '광양', '보성', '고흥', '전남'], mapX: 45, mapY: 71, lat: 34.7456, lng: 127.7669 },
  { keywords: ['경북', '안동', '영주', '문경', '구미', '상주'], mapX: 59, mapY: 44, lat: 36.5392, lng: 128.5181 },
  { keywords: ['경주', '포항', '울진', '영덕', '청송'], mapX: 73, mapY: 52, lat: 35.8394, lng: 129.2119 },
  { keywords: ['대구', '경산', '청도'], mapX: 62, mapY: 57, lat: 35.7997, lng: 128.5227 },
  { keywords: ['울릉', '독도'], mapX: 86, mapY: 30, lat: 37.5081, lng: 130.9108 },
  { keywords: ['부산', '해운대', '기장', '광안리', '송정', '울산'], mapX: 72, mapY: 67, lat: 35.1587, lng: 129.1794 },
  { keywords: ['경남', '통영', '거제', '남해', '합천', '진주', '창원', '김해', '밀양', '하동'], mapX: 57, mapY: 68, lat: 34.8125, lng: 128.4239 },
  { keywords: ['제주', '서귀포', '성산', '애월', '한라산', '우도', '중문'], mapX: 33, mapY: 92, lat: 33.4242, lng: 126.9311 }
];

function inferKoreaMapPosition(text, offsetIndex = 0) {
  const str = String(text || '');
  // 핀들이 서로 겹치지 않도록 순번(offsetIndex)에 따라 위치를 자연스럽게 분산
  const offsets = [
    { dx: 0, dy: 0 },
    { dx: 5, dy: -4 },
    { dx: -5, dy: 4 },
    { dx: 6, dy: 4 }
  ];
  const off = offsets[offsetIndex % offsets.length];

  for (const item of REGION_COORD_MAP) {
    if (item.keywords.some((kw) => str.includes(kw))) {
      return {
        mapX: Math.min(88, Math.max(15, item.mapX + off.dx)),
        mapY: Math.min(94, Math.max(12, item.mapY + off.dy)),
        lat: item.lat + offsetIndex * 0.008,
        lng: item.lng + offsetIndex * 0.008
      };
    }
  }
  return {
    mapX: Math.min(82, Math.max(20, 42 + off.dx * 2)),
    mapY: Math.min(88, Math.max(18, 45 + off.dy * 2)),
    lat: 36.5 + offsetIndex * 0.02,
    lng: 127.8 + offsetIndex * 0.02
  };
}

// 현재 앱 상태 관리
let currentThemeKey = 'flower';
let currentDisplayedPlaces = [];
let selectedBannerPlace = null;
let mySavedPlaces = loadSavedPlacesFromStorage();
let currentSharePayload = null;
let realKakaoMapInstance = null;
let realKakaoMarkers = [];
let isShowingRealKakaoMap = false;

let mapAppConfig = {
  kakaoKey: localStorage.getItem('yumi_kakao_js_key_v2') || DEFAULT_KAKAO_JS_KEY,
  mcpEndpoint: localStorage.getItem('yumi_playmcp_url') || 'https://playmcp.kakao.com/mcp/3',
  mcpToken: localStorage.getItem('yumi_playmcp_token') || ''
};

// 초기 실행
window.addEventListener('DOMContentLoaded', () => {
  // 만약 카카오톡 공유 카드의 [카카오맵 길찾기] 버튼으로 접속(?goMap=장소명)했다면 즉시 카카오맵으로 이동
  const urlParams = new URLSearchParams(window.location.search);
  const goMapQuery = urlParams.get('goMap');
  if (goMapQuery) {
    window.location.replace(`https://map.kakao.com/link/search/${encodeURIComponent(goMapQuery)}`);
    return;
  }

  initKakaoServices();
  updateSavedCountBadge();
  selectTravelTheme('flower');
  renderMyBookList();
});

// ==========================================================================
// 2. 글씨 크기 조절 (보통 / 크게 / 아주 크게)
// ==========================================================================
function setFontSize(size) {
  document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
  document.body.classList.add(`font-${size}`);

  document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.size === size);
  });

  const label = { normal: '보통 크기', large: '큰 글씨', xlarge: '아주 큰 글씨' }[size];
  showToast(`🔍 글씨 크기를 [${label}]로 조절했습니다.`);
}

// ==========================================================================
// 3. 상단 3개 탭 전환 (테마 추천 / AI 장소 검색 / 내 별표 보물지도첩)
// ==========================================================================
function switchTab(tabName) {
  const map = {
    recommend: { btn: 'tabRecommendBtn', panel: 'panelRecommend' },
    search: { btn: 'tabSearchBtn', panel: 'panelSearch' },
    mybook: { btn: 'tabMyBookBtn', panel: 'panelMyBook' }
  };

  Object.keys(map).forEach((k) => {
    const active = k === tabName;
    document.getElementById(map[k].btn).classList.toggle('active', active);
    document.getElementById(map[k].btn).setAttribute('aria-selected', active ? 'true' : 'false');
    document.getElementById(map[k].panel).classList.toggle('active', active);
  });

  if (tabName === 'recommend') {
    selectTravelTheme(currentThemeKey);
  } else if (tabName === 'search') {
    if (currentDisplayedPlaces && currentDisplayedPlaces.length > 0) {
      updateMapPins(currentDisplayedPlaces, '🔍 AI 여행지·맛집 추천 지도');
      focusPlaceOnMap(currentDisplayedPlaces[0]);
    }
  } else if (tabName === 'mybook') {
    renderMyBookList();
    if (mySavedPlaces.length > 0) {
      updateMapPins(mySavedPlaces, '⭐ 내가 모아둔 별표 보물지도');
      focusPlaceOnMap(mySavedPlaces[0]);
    }
  }
}

// ==========================================================================
// 4. 테마별 여행지 선택 및 지도 핀 표시
// ==========================================================================
function selectTravelTheme(themeKey) {
  currentThemeKey = themeKey;
  const themeObj = TRAVEL_THEMES[themeKey];
  if (!themeObj) return;

  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === themeKey);
  });

  document.getElementById('recommendListTitle').textContent = themeObj.title;
  currentDisplayedPlaces = themeObj.places;

  renderPlaceCards(themeObj.places, 'recommendListContainer', false);
  updateMapPins(themeObj.places, themeObj.title);
  if (themeObj.places.length > 0) {
    focusPlaceOnMap(themeObj.places[0]);
  }
}

// 장소 카드 렌더링 공통 함수
function renderPlaceCards(places, containerId, isMyBook) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!places || places.length === 0) {
    container.innerHTML = `
      <div class="place-card" style="text-align:center; padding:30px;">
        <p style="font-weight:700; color:#4b5563;">아직 저장된 별표 장소가 없습니다. 추천 여행지에서 [⭐ 별표 저장]을 눌러보세요!</p>
      </div>
    `;
    return;
  }

  places.forEach((place) => {
    const isSaved = mySavedPlaces.some((item) => item.name === place.name);
    const searchTarget = place.kakaoQuery || place.name;
    const kakaoMapRouteUrl = `https://map.kakao.com/link/search/${encodeURIComponent(searchTarget)}`;

    const card = document.createElement('article');
    card.className = 'place-card';
    card.dataset.placeId = place.id;

    card.innerHTML = `
      <div class="place-card-top">
        <h4 class="place-card-title">${escapeHtml(place.name)}</h4>
        <span class="region-badge">📍 ${escapeHtml(place.region)}</span>
      </div>
      <p class="place-card-desc">${escapeHtml(place.desc)}</p>
      <div class="senior-point-box">${escapeHtml(place.seniorTip)}</div>
      <div class="card-btn-row">
        <button type="button" class="card-btn btn-focus-map" onclick="focusPlaceById('${escapeHtml(place.id)}')">
          📍 지도에서 위치 보기
        </button>
        <a href="${kakaoMapRouteUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-focus-map">
          🗺️ 카카오맵 길찾기
        </a>
        ${
          isMyBook
            ? `<button type="button" class="card-btn btn-delete-star" onclick="removePlaceFromBook('${escapeHtml(place.id)}')">🗑️ 삭제</button>`
            : `<button type="button" class="card-btn btn-save-star ${isSaved ? 'saved' : ''}" onclick="toggleBookmarkPlace('${escapeHtml(place.id)}')">
                ${isSaved ? '⭐ 내 지도첩에 저장됨' : '⭐ 내 지도첩에 별표 저장'}
              </button>`
        }
        <button type="button" class="card-btn btn-kakao-card" onclick="sharePlaceById('${escapeHtml(place.id)}')">
          💛 카톡으로 보내기
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================================================
// 5. 지도 위 핀(마커) 표시 & 대한민국 지도 <-> 실제 카카오맵 전환
// ==========================================================================
function toggleMapMode() {
  const canvas = document.getElementById('kakaoMapCanvas');
  const board = document.getElementById('interactiveMapBoard');

  if (realKakaoMapInstance && window.kakao && window.kakao.maps) {
    isShowingRealKakaoMap = !isShowingRealKakaoMap;
    canvas.classList.toggle('hidden', !isShowingRealKakaoMap);
    board.classList.toggle('hidden', isShowingRealKakaoMap);
    if (isShowingRealKakaoMap) {
      realKakaoMapInstance.relayout();
      updateMapPins(currentDisplayedPlaces, document.getElementById('currentMapTitle').textContent);
      showToast('🗺️ 실제 카카오맵 지도 화면으로 전환했습니다.');
    } else {
      showToast('🧭 대한민국 팔도 여행지도 화면으로 전환했습니다.');
    }
  } else {
    showToast('🧭 현재 대한민국 팔도 정밀 지도 모드로 동작 중입니다.');
  }
}

function updateMapPins(places, mapHeaderTitle) {
  document.getElementById('currentMapTitle').textContent = mapHeaderTitle;

  // 1) 대한민국 팔도 지도 위에 핀 버튼 배치 (인접 핀 겹침 방지 보정 포함)
  const layer = document.getElementById('mapMarkersLayer');
  layer.innerHTML = '';

  const usedPositions = [];
  places.forEach((place, idx) => {
    let px = place.mapX || 45;
    let py = place.mapY || 45;

    // 이미 같은 좌표 근처에 핀이 있으면 살짝 옆으로 띄워서 두 핀 모두 잘 보이게 처리
    for (const prev of usedPositions) {
      if (Math.abs(prev.x - px) < 6 && Math.abs(prev.y - py) < 5) {
        px = Math.min(86, Math.max(14, px + (idx % 2 === 0 ? 7 : -7)));
        py = Math.min(92, Math.max(12, py + (idx % 2 === 0 ? -5 : 5)));
      }
    }
    usedPositions.push({ x: px, y: py });

    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'map-pin-btn';
    pin.dataset.placeId = place.id;
    pin.style.left = `${px}%`;
    pin.style.top = `${py}%`;
    const shortLabel = place.name.split('(')[0].split('&')[0].trim().slice(0, 9);
    pin.textContent = `📍 ${shortLabel}`;
    pin.onclick = () => focusPlaceOnMap(place);
    layer.appendChild(pin);
  });

  // 2) 만약 실제 Kakao Map SDK가 활성화되어 있다면 실제 마커도 함께 렌더링
  if (realKakaoMapInstance && window.kakao && window.kakao.maps) {
    realKakaoMarkers.forEach((m) => m.setMap(null));
    realKakaoMarkers = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    places.forEach((place) => {
      if (place.lat && place.lng) {
        const pos = new window.kakao.maps.LatLng(place.lat, place.lng);
        const marker = new window.kakao.maps.Marker({
          position: pos,
          map: realKakaoMapInstance,
          title: place.name
        });
        window.kakao.maps.event.addListener(marker, 'click', () => focusPlaceOnMap(place));
        realKakaoMarkers.push(marker);
        bounds.extend(pos);
      }
    });
    if (places.length > 0) {
      realKakaoMapInstance.setBounds(bounds);
    }
  }
}

function focusPlaceById(placeId) {
  const allPool = [...currentDisplayedPlaces, ...mySavedPlaces];
  const target = allPool.find((p) => p.id === placeId);
  if (target) {
    focusPlaceOnMap(target);
    // 모바일이나 작은 화면에서 지도가 보이도록 부드럽게 스크롤
    const mapViewport = document.getElementById('mapViewport');
    if (mapViewport && window.innerWidth <= 1024) {
      mapViewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`📍 지도에서 [${target.name}] 위치를 표시합니다.`);
  }
}

function focusPlaceOnMap(place) {
  selectedBannerPlace = place;

  // 핀 강조
  document.querySelectorAll('.map-pin-btn').forEach((pin) => {
    pin.classList.toggle('active-pin', pin.dataset.placeId === place.id);
  });

  // 카드 강조
  document.querySelectorAll('.place-card').forEach((card) => {
    card.classList.toggle('focused-card', card.dataset.placeId === place.id);
  });

  // 지도 하단 상세 배너 업데이트
  document.getElementById('bannerCategory').textContent = place.category || '📍 추천 여행지';
  document.getElementById('bannerTitle').textContent = place.name;
  document.getElementById('bannerAddr').textContent = `📍 주소: ${place.address || place.region}`;
  document.getElementById('bannerTip').textContent = place.seniorTip || place.desc;

  const searchTarget = place.kakaoQuery || place.name;
  const kakaoSearchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(searchTarget)}`;
  document.getElementById('bannerRouteBtn').href = kakaoSearchUrl;
  document.getElementById('openKakaoMapExternalBtn').href = kakaoSearchUrl;

  const isSaved = mySavedPlaces.some((p) => p.name === place.name);
  const saveBtn = document.getElementById('bannerSaveBtn');
  saveBtn.textContent = isSaved ? '✅ 내 보물지도에 저장된 장소입니다' : '⭐ 내 보물지도에 별표 저장';

  // 실제 카카오맵 중심 이동
  if (realKakaoMapInstance && window.kakao && window.kakao.maps && place.lat && place.lng) {
    realKakaoMapInstance.panTo(new window.kakao.maps.LatLng(place.lat, place.lng));
  }
}

// ==========================================================================
// 6. 탭 2: AI & PlayMCP 카카오맵 장소 검색 기능 (실존 명소 스마트 매칭)
// ==========================================================================
function quickSearchPlace(queryText) {
  document.getElementById('placeSearchInput').value = queryText;
  executeAiPlaceSearch();
}

async function executeAiPlaceSearch() {
  const input = document.getElementById('placeSearchInput');
  const query = input.value.trim();

  if (!query) {
    showToast('🔍 찾고 싶은 지역 이름이나 여행지, 맛집을 입력해 주세요!');
    input.focus();
    return;
  }

  const statusEl = document.getElementById('searchStatusMsg');
  statusEl.textContent = `⏳ PlayMCP 카카오맵 도구를 통해 "${query}" 맞춤 장소를 찾고 있습니다...`;

  // 1) PlayMCP 원격 엔드포인트 연동 호출 시도 (토큰 설정 시)
  if (mapAppConfig.mcpEndpoint && mapAppConfig.mcpToken) {
    try {
      const remotePlaces = await callPlayMcpKakaoMap(query);
      if (remotePlaces && remotePlaces.length > 0) {
        currentDisplayedPlaces = remotePlaces;
        statusEl.innerHTML = `✅ PlayMCP 카카오맵에서 <strong>"${escapeHtml(query)}"</strong> 추천 장소 ${remotePlaces.length}곳을 찾았습니다!`;
        renderPlaceCards(remotePlaces, 'searchResultContainer', false);
        updateMapPins(remotePlaces, `🔍 "${query}" 검색 결과`);
        focusPlaceOnMap(remotePlaces[0]);
        return;
      }
    } catch (e) {
      console.warn('PlayMCP 원격 호출 대신 내장 카카오맵 여행 비서로 검색합니다:', e);
    }
  }

  // 2) Kakao Map Places 서비스가 로드되어 있으면 실시간 카카오맵 키워드 검색 활용
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    try {
      const kakaoLivePlaces = await searchViaKakaoPlacesSdk(query);
      if (kakaoLivePlaces && kakaoLivePlaces.length > 0) {
        currentDisplayedPlaces = kakaoLivePlaces;
        statusEl.innerHTML = `✅ 카카오맵 실시간 검색으로 <strong>"${escapeHtml(query)}"</strong> 명소 ${kakaoLivePlaces.length}곳을 찾았습니다!`;
        renderPlaceCards(kakaoLivePlaces, 'searchResultContainer', false);
        updateMapPins(kakaoLivePlaces, `🔍 "${query}" 추천 지도`);
        focusPlaceOnMap(kakaoLivePlaces[0]);
        showToast(`🗺️ "${query}" 실시간 검색이 완료되었습니다!`);
        return;
      }
    } catch (e) {
      console.warn('카카오 실시간 검색 폴백:', e);
    }
  }

  // 3) 내장 스마트 여행·맛집 검색 엔진 (단어 단위 매칭 + 전국 다양성 보장, 서울식물원 중복 고정 제거!)
  const results = buildSmartPlaceSearchResults(query);
  currentDisplayedPlaces = results;
  statusEl.innerHTML = `✅ <strong>"${escapeHtml(query)}"</strong> 조건에 딱 맞는 추천 장소 ${results.length}곳을 찾았습니다!`;

  renderPlaceCards(results, 'searchResultContainer', false);
  updateMapPins(results, `🔍 "${query}" 추천 지도`);
  if (results.length > 0) {
    focusPlaceOnMap(results[0]);
  }
  showToast(`🗺️ "${query}" 장소 검색이 완료되었습니다!`);
}

// 카카오맵 Places SDK 실시간 검색 래퍼
function searchViaKakaoPlacesSdk(rawQuery) {
  return new Promise((resolve) => {
    const cleanQ = rawQuery
      .replace(/(추천해줘|추천해달라고|추천|찾아줘|알려줘|어디가|좋을까|갈만한곳|보이는|걷기|좋은|곳)/g, ' ')
      .trim() || '명소';
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(cleanQ, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && Array.isArray(data) && data.length > 0) {
        const mapped = data.slice(0, 4).map((item, idx) => {
          const pos = inferKoreaMapPosition(`${item.address_name} ${item.place_name}`, idx);
          return {
            id: `kakao-live-${Date.now()}-${idx}`,
            name: item.place_name,
            kakaoQuery: item.place_name,
            region: (item.address_name || '').split(' ').slice(0, 2).join(' ') || cleanQ,
            category: item.category_group_name || '🔍 카카오맵 추천',
            address: item.road_address_name || item.address_name,
            desc: `${item.category_name || cleanQ} · 카카오맵에서 인기 있는 추천 장소입니다.`,
            seniorTip: item.phone
              ? `📞 전화번호: ${item.phone} · [🗺️ 카카오맵 길찾기]를 누르면 상세 경로가 열립니다.`
              : '💡 [🗺️ 카카오맵 길찾기] 버튼을 누르면 정확한 위치와 길 안내를 보실 수 있습니다.',
            lat: parseFloat(item.y),
            lng: parseFloat(item.x),
            mapX: pos.mapX,
            mapY: pos.mapY
          };
        });
        resolve(mapped);
      } else {
        resolve(null);
      }
    });
  });
}

async function callPlayMcpKakaoMap(query) {
  const res = await fetch(mapAppConfig.mcpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(mapAppConfig.mcpToken ? { Authorization: `Bearer ${mapAppConfig.mcpToken}` } : {})
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'kakao_map_search_places',
        arguments: { query: query, limit: 4 }
      }
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data && data.result && Array.isArray(data.result.places)) {
    return data.result.places.map((p, idx) => {
      const pos = inferKoreaMapPosition(p.address_name || query, idx);
      return {
        id: `mcp-${Date.now()}-${idx}`,
        name: p.place_name || query,
        kakaoQuery: p.place_name || query,
        region: p.address_name || '추천 지역',
        category: '🔍 PlayMCP 카카오맵',
        address: p.road_address_name || p.address_name || query,
        desc: p.category_name || `"${query}" 관련 카카오맵 실시간 추천 장소입니다.`,
        seniorTip: '💡 [카카오맵 길찾기]를 누르시면 상세 위치와 전화번호를 바로 확인하실 수 있습니다.',
        lat: parseFloat(p.y) || pos.lat,
        lng: parseFloat(p.x) || pos.lng,
        mapX: pos.mapX,
        mapY: pos.mapY
      };
    });
  }
  return null;
}

// 스마트 키워드 분석 및 전국 명소 매칭 엔진 (지역 검색 시 100% 해당 지역만 반환!)
function buildSmartPlaceSearchResults(query) {
  // 1) 전체 실존 명소 풀 생성
  const allPlaces = [];
  Object.values(TRAVEL_THEMES).forEach((theme) => {
    theme.places.forEach((p) => allPlaces.push(p));
  });
  EXTRA_FAMOUS_PLACES.forEach((p) => allPlaces.push(p));

  // 2) 알려진 모든 지역 키워드 목록
  const knownRegionKeywords = [];
  REGION_COORD_MAP.forEach((group) => {
    group.keywords.forEach((kw) => knownRegionKeywords.push(kw));
  });

  // 3) 사용자 검색어 안에 특정 지역명(예: "강릉", "전주", "부산", "제주" 등)이 들어있는지 먼저 확인!
  const detectedRegions = knownRegionKeywords.filter((rk) => query.includes(rk));

  // 4) 불용어 제거 후 핵심 키워드 토큰 추출
  const stopWords = [
    '추천해줘', '추천해달라고', '추천해주세요', '추천해', '추천', '찾아줘', '알려줘', '보여줘',
    '어디가', '어디', '좋을까', '갈만한', '갈만한곳', '가고싶어', '보이는', '걷기',
    '좋은', '곳', '여행지', '여행', '코스', '나들이', '근처', '주변', '에서', '과', '와', '이랑'
  ];

  let cleaned = query;
  stopWords.forEach((sw) => {
    cleaned = cleaned.replaceAll(sw, ' ');
  });

  const tokens = cleaned
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length >= 2);

  // 5) 만약 지역명(예: "강릉")이 감지되었다면, 다른 지역(속초, 단양, 서울 등)은 절대 섞이지 않도록 100% 해당 지역 장소만 필터링!
  let candidatePool = allPlaces;
  if (detectedRegions.length > 0) {
    candidatePool = allPlaces.filter((place) =>
      detectedRegions.some(
        (rk) => place.region.includes(rk) || place.name.includes(rk) || place.address.includes(rk)
      )
    );
  }

  // 6) 후보군 안에서 키워드(맛집, 바다, 카페, 한옥, 숲 등) 점수 계산
  const wantsFood = query.includes('맛집') || query.includes('먹거리') || query.includes('시장') || query.includes('식당');
  const wantsCafe = query.includes('카페') || query.includes('커피') || query.includes('찻집');

  const scored = candidatePool.map((place) => {
    let score = detectedRegions.length > 0 ? 10 : 0; // 지역이 이미 일치하면 기본 10점 부여
    const targetText = `${place.name} ${place.region} ${place.category} ${place.desc} ${place.address} ${place.seniorTip}`.toLowerCase();

    tokens.forEach((tk) => {
      if (place.region.toLowerCase().includes(tk) || place.name.toLowerCase().includes(tk)) {
        score += 6;
      } else if (targetText.includes(tk)) {
        score += 3;
      }
    });

    if (wantsFood && (place.category.includes('맛집') || place.category.includes('미식') || place.desc.includes('맛집') || place.desc.includes('순두부') || place.desc.includes('시장'))) {
      score += 8;
    }
    if (wantsCafe && (place.category.includes('카페') || place.name.includes('커피') || place.desc.includes('카페'))) {
      score += 8;
    }

    return { place, score };
  });

  const matched = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.place);

  // 7) 지역 없이 그냥 "추천해줘"라고만 입력한 경우: 전국 명소 중 4곳을 랜덤 추천
  if (tokens.length === 0 && detectedRegions.length === 0) {
    const shuffled = [...allPlaces].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }

  // 8) 해당 지역의 매칭된 실존 명소가 충분하면 바로 반환 (오직 그 지역만!)
  if (matched.length >= 3) {
    return matched.slice(0, 4);
  }

  // 9) 해당 지역의 매칭 결과가 1~2개뿐이거나 새로운 동네를 검색한 경우,
  //    부족한 개수는 무조건 "그 지역(keywordLabel)"의 카카오맵 맞춤 코스로만 채워서 타 지역이 섞이지 않게 보장!
  const regionLabel = detectedRegions[0] || tokens[0] || query.trim();
  const pos1 = inferKoreaMapPosition(regionLabel, 0);
  const pos2 = inferKoreaMapPosition(regionLabel, 1);
  const pos3 = inferKoreaMapPosition(regionLabel, 2);

  const regionSpecificExtras = [
    {
      id: `srch-${Date.now()}-1`,
      name: `${regionLabel} 현지인 추천 베스트 맛집 거리`,
      kakaoQuery: `${regionLabel} 맛집`,
      region: regionLabel,
      category: `🍲 ${regionLabel} 대표 맛집`,
      address: `${regionLabel} 중심 미식 거리`,
      desc: `"${regionLabel}"에서 방문객 평점과 리뷰가 가장 좋은 대표 맛집 모음입니다.`,
      seniorTip: `💡 [🗺️ 카카오맵 길찾기]를 누르면 카카오맵에서 "${regionLabel} 맛집" 실제 식당 목록과 위치를 바로 보여줍니다.`,
      lat: pos1.lat,
      lng: pos1.lng,
      mapX: pos1.mapX,
      mapY: pos1.mapY
    },
    {
      id: `srch-${Date.now()}-2`,
      name: `${regionLabel} 전망 좋은 인기 카페 & 디저트`,
      kakaoQuery: `${regionLabel} 카페`,
      region: regionLabel,
      category: `☕ ${regionLabel} 인기 카페`,
      address: `${regionLabel} 감성 카페 거리`,
      desc: `식사 후 여유롭게 커피와 디저트를 즐기기 좋은 "${regionLabel}" 대표 카페 코스입니다.`,
      seniorTip: `💡 [🗺️ 카카오맵 길찾기]를 누르면 카카오맵에서 "${regionLabel} 카페" 인기 매장을 바로 확인하실 수 있습니다.`,
      lat: pos2.lat,
      lng: pos2.lng,
      mapX: pos2.mapX,
      mapY: pos2.mapY
    },
    {
      id: `srch-${Date.now()}-3`,
      name: `${regionLabel} 가볼만한 대표 산책 명소`,
      kakaoQuery: `${regionLabel} 가볼만한곳`,
      region: regionLabel,
      category: `📍 ${regionLabel} 추천 코S`,
      address: `${regionLabel} 대표 관광 명소`,
      desc: `"${regionLabel}" 여행에서 빠질 수 없는 아름다운 풍경과 산책 코스입니다.`,
      seniorTip: `💡 [⭐ 내 지도첩에 별표 저장]을 눌러두시면 카카오톡으로 친구들과 코스를 공유하실 수 있습니다.`,
      lat: pos3.lat,
      lng: pos3.lng,
      mapX: pos3.mapX,
      mapY: pos3.mapY
    }
  ];

  const combined = [...matched];
  for (const extra of regionSpecificExtras) {
    if (combined.length >= 4) break;
    combined.push(extra);
  }
  return combined;
}

// 음성으로 여행지 검색하기
function startVoicePlaceSearch() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('이 브라우저는 음성 인식을 지원하지 않습니다. 검색창에 글자로 입력해 주세요!');
    return;
  }

  const btn = document.getElementById('voiceSearchBtn');
  const recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';

  btn.textContent = '👂 듣는 중...';
  showToast('🎙️ 가고 싶은 여행지나 맛집을 말씀해 보세요!');

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById('placeSearchInput').value = text;
    executeAiPlaceSearch();
  };

  recognition.onend = () => {
    btn.textContent = '🎙️ 말하기';
  };

  recognition.start();
}

// 음성으로 현재 추천 리스트 읽어주기 (TTS)
function speakCurrentRecommendations() {
  if (!('speechSynthesis' in window)) {
    showToast('이 브라우저에서는 음성 읽기 기능을 지원하지 않습니다.');
    return;
  }
  window.speechSynthesis.cancel();
  const names = currentDisplayedPlaces.map((p, i) => `${i + 1}번, ${p.region}에 있는 ${p.name}`).join('. ');
  const msg = new SpeechSynthesisUtterance(`추천 여행지를 안내해 드립니다. ${names} 입니다.`);
  msg.lang = 'ko-KR';
  msg.rate = 0.95;
  window.speechSynthesis.speak(msg);
  showToast('🔊 추천 여행지 목록을 소리로 읽어드립니다.');
}

// ==========================================================================
// 7. 탭 3: ⭐ 내 별표 보물지도첩 저장 · 직접 추가 · 삭제
// ==========================================================================
function loadSavedPlacesFromStorage() {
  try {
    const raw = localStorage.getItem('yumi_saved_treasure_map_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('저장된 지도첩 불러오기 오류:', e);
  }
  return [...DEFAULT_SAVED_PLACES];
}

function savePlacesToStorage() {
  localStorage.setItem('yumi_saved_treasure_map_v2', JSON.stringify(mySavedPlaces));
  updateSavedCountBadge();
}

function updateSavedCountBadge() {
  const badge = document.getElementById('savedCountBadge');
  if (badge) badge.textContent = mySavedPlaces.length;
}

function toggleBookmarkPlace(placeId) {
  const pool = [...currentDisplayedPlaces, ...mySavedPlaces];
  const place = pool.find((p) => p.id === placeId);
  if (!place) return;

  const existingIndex = mySavedPlaces.findIndex((p) => p.name === place.name);
  if (existingIndex >= 0) {
    mySavedPlaces.splice(existingIndex, 1);
    showToast(`⭐ [${place.name}] 장소를 보물지도첩에서 뺐습니다.`);
  } else {
    mySavedPlaces.unshift({
      ...place,
      id: `saved-${Date.now()}`,
      category: '⭐ 내 별표 명소'
    });
    showToast(`⭐ [${place.name}] 장소를 내 보물지도첩에 저장했습니다!`);
  }

  savePlacesToStorage();
  renderPlaceCards(currentDisplayedPlaces, 'recommendListContainer', false);
  const searchContainer = document.getElementById('searchResultContainer');
  if (searchContainer && searchContainer.children.length > 0) {
    renderPlaceCards(currentDisplayedPlaces, 'searchResultContainer', false);
  }
  renderMyBookList();
  if (selectedBannerPlace && selectedBannerPlace.name === place.name) {
    focusPlaceOnMap(place);
  }
}

function saveCurrentBannerPlace() {
  if (!selectedBannerPlace) return;
  toggleBookmarkPlace(selectedBannerPlace.id);
}

function addCustomPlaceToBook() {
  const nameInput = document.getElementById('customPlaceName');
  const regionInput = document.getElementById('customPlaceRegion');
  const memoInput = document.getElementById('customPlaceMemo');

  const name = nameInput.value.trim();
  const region = regionInput.value.trim() || '내 추천 지역';
  const memo = memoInput.value.trim() || '내가 다녀와서 참 좋았던 기억하고 싶은 장소입니다.';

  if (!name) {
    showToast('📌 장소 이름을 먼저 적어주세요!');
    nameInput.focus();
    return;
  }

  const pos = inferKoreaMapPosition(`${region} ${name}`, mySavedPlaces.length);

  const newPlace = {
    id: `custom-${Date.now()}`,
    name: name,
    kakaoQuery: `${region} ${name}`.trim(),
    region: region,
    category: '📌 내가 직접 적은 장소',
    address: `${region} ${name}`,
    desc: memo,
    seniorTip: `📝 내 메모: ${memo}`,
    lat: pos.lat,
    lng: pos.lng,
    mapX: pos.mapX,
    mapY: pos.mapY
  };

  mySavedPlaces.unshift(newPlace);
  savePlacesToStorage();
  renderMyBookList();
  updateMapPins(mySavedPlaces, '⭐ 내가 모아둔 별표 보물지도');
  focusPlaceOnMap(newPlace);

  nameInput.value = '';
  regionInput.value = '';
  memoInput.value = '';
  showToast(`⭐ [${name}] 장소가 내 보물지도첩에 새로 등록되었습니다!`);
}

function removePlaceFromBook(placeId) {
  mySavedPlaces = mySavedPlaces.filter((p) => p.id !== placeId);
  savePlacesToStorage();
  renderMyBookList();
  updateMapPins(mySavedPlaces, '⭐ 내가 모아둔 별표 보물지도');
  showToast('🗑️ 보물지도첩에서 삭제했습니다.');
}

function renderMyBookList() {
  renderPlaceCards(mySavedPlaces, 'myBookListContainer', true);
}

// ==========================================================================
// 8. 카카오톡으로 여행지·보물지도첩 공유하기
// ==========================================================================
function sharePlaceById(placeId) {
  const pool = [...currentDisplayedPlaces, ...mySavedPlaces];
  const target = pool.find((p) => p.id === placeId);
  if (target) {
    openKakaoShareModalForPlaces([target], `🗺️ [${target.name}] 나들이 위치 안내`);
  }
}

function openKakaoShareForCurrentPlace() {
  if (!selectedBannerPlace) return;
  openKakaoShareModalForPlaces([selectedBannerPlace], `🗺️ [${selectedBannerPlace.name}] 나들이 위치 안내`);
}

function shareEntireBookToKakao() {
  if (mySavedPlaces.length === 0) {
    showToast('보물지도첩에 저장된 장소가 없습니다. 먼저 별표로 장소를 담아주세요!');
    return;
  }
  openKakaoShareModalForPlaces(mySavedPlaces, `⭐ 나만의 별표 보물지도첩 (${mySavedPlaces.length}곳)`);
}

function openKakaoShareModalForPlaces(placesArray, title) {
  currentSharePayload = { title, places: placesArray };
  const previewBody = document.getElementById('kakaoPreviewBody');

  const itemsHtml = placesArray
    .map(
      (p, idx) => `
      <div style="margin-bottom:12px; padding-bottom:10px; border-bottom:1px dashed #d1d5db;">
        <strong style="color:#1b4332; font-size:1.05em;">${idx + 1}. ${escapeHtml(p.name)}</strong>
        <span style="color:#4b5563;">(${escapeHtml(p.region)})</span><br/>
        <span style="font-size:0.92em; color:#374151;">${escapeHtml(p.seniorTip || p.desc)}</span>
      </div>
    `
    )
    .join('');

  previewBody.innerHTML = `
    <p style="font-weight:800; color:#1b4332; margin-bottom:10px;">${escapeHtml(title)}</p>
    ${itemsHtml}
    <p style="color:#2563eb; font-weight:700; margin-top:6px;">📍 카카오맵 길찾기 바로가기 링크 포함</p>
  `;

  document.getElementById('kakaoModal').classList.remove('hidden');
}

function closeKakaoModal() {
  document.getElementById('kakaoModal').classList.add('hidden');
}

async function copyShareTextToClipboard() {
  if (!currentSharePayload) return;

  const lines = [
    `🗺️ [나만의 카톡 보물지도첩] ${currentSharePayload.title}`,
    ``,
    ...currentSharePayload.places.map((p, i) => {
      const q = p.kakaoQuery || p.name;
      const mapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(q)}`;
      return `${i + 1}. ${p.name} (${p.region})\n   💬 ${p.seniorTip || p.desc}\n   📍 카카오맵 길찾기: ${mapUrl}`;
    }),
    ``,
    `기분 좋은 날, 함께 나들이 다녀와요! 💛`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(lines);
    showToast('✅ 카카오톡 대화창에 붙여넣을 안내문이 복사되었습니다!');
  } catch (e) {
    showToast('복사 완료! 카카오톡 채팅방에 붙여넣기 해보세요.');
  }
}

async function sendViaKakaoSdk() {
  if (!currentSharePayload || currentSharePayload.places.length === 0) return;

  const first = currentSharePayload.places[0];
  const q = first.kakaoQuery || first.name;
  const directKakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(q)}`;

  // 중요: 카카오 디벨로퍼스 정책상 link.webUrl은 반드시 [내 애플리케이션 > 플랫폼 > Web]에 등록된 내 사이트 도메인이어야 합니다!
  // 따라서 내 웹앱 주소(?goMap=장소명)를 링크로 걸고, 클릭 시 카카오맵으로 자동 이동하도록 처리합니다.
  const baseAppUrl = window.location.protocol.startsWith('http')
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://kakaomcp-ashen.vercel.app/';
  const redirectMapUrl = `${baseAppUrl}?goMap=${encodeURIComponent(q)}`;

  const descText = currentSharePayload.places
    .slice(0, 3)
    .map((p, i) => `${i + 1}. ${p.name} (${p.region})`)
    .join(' / ');

  // 1) Kakao JS SDK를 통한 공식 카카오톡 공유 창 호출
  if (window.Kakao && window.location.protocol.startsWith('http')) {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(mapAppConfig.kakaoKey || DEFAULT_KAKAO_JS_KEY);
      }
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: currentSharePayload.title,
          description: `${descText}\n📍 ${first.address || first.region}`,
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
          link: {
            mobileWebUrl: redirectMapUrl,
            webUrl: redirectMapUrl
          }
        },
        buttons: [
          {
            title: '🗺️ 카카오맵 위치·길찾기',
            link: {
              mobileWebUrl: redirectMapUrl,
              webUrl: redirectMapUrl
            }
          },
          {
            title: '⭐ 보물지도첩 열기',
            link: {
              mobileWebUrl: baseAppUrl,
              webUrl: baseAppUrl
            }
          }
        ]
      });
      showToast('💛 카카오톡 공유 창을 열었습니다! (창이 안 뜨면 카카오 디벨로퍼스에 도메인을 등록해 주세요)');
      return;
    } catch (err) {
      console.warn('Kakao.Share 호출 오류, 시스템 공유로 전환합니다:', err);
    }
  }

  // 2) 스마트폰/윈도우 기본 공유 창(navigator.share) 지원 시 즉시 실행
  if (navigator.share) {
    try {
      await navigator.share({
        title: currentSharePayload.title,
        text: `${currentSharePayload.title}\n${descText}\n📍 카카오맵 길찾기:`,
        url: directKakaoMapUrl
      });
      return;
    } catch (e) {
      // 사용자가 공유 창을 닫은 경우
    }
  }

  // 3) 클립보드 복사 폴백
  await copyShareTextToClipboard();
  closeKakaoModal();
  showToast('💡 안내문과 카카오맵 링크를 복사했습니다! 카카오톡 대화창에 붙여넣어 보내실 수 있습니다.');
}

// ==========================================================================
// 9. 카카오 디벨로퍼스 (카카오맵 & 공유 SDK) 및 PlayMCP 설정 관리
// ==========================================================================
function openConfigModal() {
  document.getElementById('kakaoKeyInput').value = mapAppConfig.kakaoKey;
  document.getElementById('mcpEndpointInput').value = mapAppConfig.mcpEndpoint;
  document.getElementById('mcpTokenInput').value = mapAppConfig.mcpToken;
  document.getElementById('configModal').classList.remove('hidden');
}

function closeConfigModal() {
  document.getElementById('configModal').classList.add('hidden');
}

function saveMapAppConfig() {
  mapAppConfig.kakaoKey =
    document.getElementById('kakaoKeyInput').value.trim() || DEFAULT_KAKAO_JS_KEY;
  mapAppConfig.mcpEndpoint =
    document.getElementById('mcpEndpointInput').value.trim() || 'https://playmcp.kakao.com/mcp/3';
  mapAppConfig.mcpToken = document.getElementById('mcpTokenInput').value.trim();

  localStorage.setItem('yumi_kakao_js_key_v2', mapAppConfig.kakaoKey);
  localStorage.setItem('yumi_playmcp_url', mapAppConfig.mcpEndpoint);
  localStorage.setItem('yumi_playmcp_token', mapAppConfig.mcpToken);

  initKakaoServices();
  closeConfigModal();
  showToast('💾 카카오맵 & PlayMCP 설정이 저장되었습니다!');
}

function initKakaoServices() {
  const dot = document.getElementById('connectionDot');
  const hasKey = Boolean(mapAppConfig.kakaoKey);
  if (dot) {
    dot.classList.toggle('connected', hasKey);
  }

  if (!hasKey) return;

  // 1) 카카오톡 공유 SDK 초기화
  if (window.Kakao) {
    try {
      if (window.Kakao.isInitialized()) window.Kakao.cleanup();
      window.Kakao.init(mapAppConfig.kakaoKey);
    } catch (e) {
      console.warn('Kakao Share SDK 초기화 확인:', e);
    }
  }

  // 2) 카카오맵 Web SDK (Places 검색 라이브러리 포함) 동적 로드
  if (window.location.protocol.startsWith('http')) {
    const existingScript = document.getElementById('kakaoMapSdkScript');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'kakaoMapSdkScript';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
        mapAppConfig.kakaoKey
      )}&libraries=services&autoload=false`;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const canvas = document.getElementById('kakaoMapCanvas');
            realKakaoMapInstance = new window.kakao.maps.Map(canvas, {
              center: new window.kakao.maps.LatLng(36.3, 127.8),
              level: 12
            });
            updateMapPins(currentDisplayedPlaces, document.getElementById('currentMapTitle').textContent);
          });
        }
      };
      document.head.appendChild(script);
    }
  }
}

// ==========================================================================
// 10. 공통 유틸리티 (토스트 알림 & HTML 안전 처리)
// ==========================================================================
let toastTimeout = null;
function showToast(msg) {
  const box = document.getElementById('toastBox');
  box.textContent = msg;
  box.classList.remove('hidden');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => box.classList.add('hidden'), 3400);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
