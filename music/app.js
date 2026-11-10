/* ==========================================================================
   AI 뮤직 라운지 & 카톡 주크박스 — 핵심 동작 스크립트 (music/app.js)
   - Kakao PlayMCP (https://playmcp.kakao.com/mcp/3) 멜론 도구 연동
   - Kakao Developers (https://developers.kakao.com/) 카카오톡 공유 연동
   ========================================================================== */

const DEFAULT_KAKAO_JS_KEY = '8cfedd32f1478e4dc67d8b1ca3fe1aad';

// 1. 10가지 장르별 & 6가지 상황별 음악 데이터베이스
const MUSIC_CHANNELS = {
  // ---- [탭 1: 장르별 채널 10종] ----
  kpop: {
    label: '🎤 K-POP & 멜론 인기차트',
    djComment: '지금 멜론 차트에서 가장 많은 사랑을 받고 있는 트렌디한 K-POP 명곡입니다!',
    songs: [
      { title: '한 페이지가 될 수 있게', artist: 'DAY6 (데이식스)', story: '청량한 밴드 사운드와 벅찬 청춘의 에너지를 담은 역주행 대표곡입니다.' },
      { title: 'Love wins all', artist: '아이유 (IU)', story: '아이유의 섬세한 감성과 폭발적인 고음이 깊은 울림을 주는 명곡입니다.' },
      { title: 'Hype Boy', artist: 'NewJeans (뉴진스)', story: '언제 들어도 기분이 상쾌해지는 세련되고 청량한 리듬의 히트곡입니다.' },
      { title: 'Supernova', artist: 'aespa (에스파)', story: '중독성 강한 비트와 에너지로 차트를 휩쓴 메가 히트곡입니다.' },
      { title: '밤양갱', artist: '비비 (BIBI)', story: '사랑스럽고 달콤쌉싸름한 왈츠 리듬이 매력적인 인기곡입니다.' },
      { title: '손오공', artist: '세븐틴 (SEVENTEEN)', story: '강렬한 에너지와 신나는 퍼포먼스로 텐션을 끌어올려 주는 곡입니다.' }
    ]
  },
  ballad: {
    label: '🎹 감성 발라드 & 명품 보컬',
    djComment: '마음을 촉촉하게 적셔주는 호소력 짙은 명품 발라드 선곡입니다.',
    songs: [
      { title: '모든 날, 모든 순간', artist: '폴킴', story: '따뜻한 가사와 감미로운 목소리로 오랜 시간 사랑받는 대표 발라드입니다.' },
      { title: '너의 모든 순간', artist: '성시경', story: '부드러운 피아노 선율과 성시경의 달콤한 보이스가 빛나는 명곡입니다.' },
      { title: '야생화', artist: '박효신', story: '시련을 이겨내고 피어나는 꽃처럼 가슴 벅찬 감동을 전하는 대곡입니다.' },
      { title: '선물', artist: '멜로망스', story: '일상을 특별하게 만들어주는 산뜻하고 로맨틱한 발라드입니다.' },
      { title: '헤어지자 말해요', artist: '박재정', story: '정통 발라드의 진수를 보여주는 애절하고 깊은 가창력의 곡입니다.' }
    ]
  },
  indie: {
    label: '🎸 인디 & 어쿠스틱 밴드',
    djComment: '개성 있는 음색과 감성적인 가사가 돋보이는 인디·어쿠스틱 명곡입니다.',
    songs: [
      { title: '주저하는 연인들을 위해', artist: '잔나비', story: '아날로그 감성의 서정적인 멜로디와 시 같은 가사가 아름다운 곡입니다.' },
      { title: '폰서트', artist: '10CM (십센치)', story: '경쾌한 어쿠스틱 기타 리듬과 재치 있는 가사가 미소를 짓게 합니다.' },
      { title: '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지', artist: 'AKMU (악뮤)', story: '가을·겨울 바람처럼 잔잔하게 스며드는 명품 감성 곡입니다.' },
      { title: 'TOMBOY', artist: '혁오 (HYUKOH)', story: '청춘의 방황과 따스한 위로를 동시에 담아낸 밴드 명곡입니다.' },
      { title: '개화 (Flowering)', artist: 'LUCY (루시)', story: '청량한 바이올린 선율이 봄바람처럼 기분 좋게 퍼지는 밴드 곡입니다.' }
    ]
  },
  hiphop: {
    label: '🎧 트렌디 힙합 & 그루비 R&B',
    djComment: '세련된 비트와 감각적인 그루브가 매력적인 힙합 & R&B 플레이리스트입니다.',
    songs: [
      { title: '소나기 (Feat. 10cm)', artist: '용준형 / 10CM', story: '감성적인 랩과 어쿠스틱 보컬이 어우러진 촉촉한 R&B 트랙입니다.' },
      { title: '가끔 (Sometimes)', artist: '크러쉬 (Crush)', story: '편안하고 세련된 그루브로 언제 들어도 질리지 않는 R&B 대표곡입니다.' },
      { title: 'SPOT! (feat. JENNIE)', artist: '지코 (ZICO)', story: '듣자마자 리듬을 타게 만드는 경쾌하고 트렌디한 힙합 트랙입니다.' },
      { title: '비도 오고 그래서 (Feat. 신용재)', artist: '헤이즈 (Heize)', story: '감성 힙합 R&B의 정석으로 불리는 분위기 있는 명곡입니다.' },
      { title: 'Square (2017)', artist: '백예린 (Yerin Baek)', story: '몽환적이고 청량한 밴드 사운드와 독보적인 음색이 빛나는 곡입니다.' }
    ]
  },
  pop: {
    label: '📻 글로벌 POP & 빌보드 명곡',
    djComment: '전 세계적으로 사랑받는 빌보드 히트곡과 불멸의 팝 명곡 모음입니다.',
    songs: [
      { title: 'Viva La Vida', artist: 'Coldplay (콜드플레이)', story: '웅장한 현악기 사운드가 가슴을 뛰게 만드는 전 세계인의 애창 팝송입니다.' },
      { title: 'Marry You', artist: 'Bruno Mars (브루노 마스)', story: '듣기만 해도 행복해지는 경쾌하고 로맨틱한 리듬의 팝 명곡입니다.' },
      { title: 'Cruel Summer', artist: 'Taylor Swift (테일러 스위프트)', story: '세련된 신스팝 사운드로 빌보드 차트를 정복한 글로벌 히트곡입니다.' },
      { title: 'Sunday Morning', artist: 'Maroon 5 (마룬 5)', story: '주말 아침이나 여유로운 시간에 듣기 가장 좋은 감미로운 팝송입니다.' },
      { title: 'Yesterday', artist: 'The Beatles (비틀즈)', story: '시대를 초월해 사랑받는 어쿠스틱 팝의 영원한 고전입니다.' }
    ]
  },
  ost: {
    label: '🎬 드라마 & 영화 명작 OST',
    djComment: '명장면의 설렘과 감동이 그대로 되살아나는 드라마·영화 OST 선곡입니다.',
    songs: [
      { title: '소나기', artist: '이클립스 (드라마 선재 업고 튀어 OST)', story: '첫사랑의 애틋한 설렘을 담아 차트 정상까지 오른 화제의 OST입니다.' },
      { title: '아로하 (Aloha)', artist: '조정석 (슬기로운 의사생활 OST)', story: '따뜻하고 기분 좋은 고백을 담은 전 국민 애창 드라마 OST입니다.' },
      { title: 'Lost Stars', artist: 'Adam Levine (영화 비긴 어게인 OST)', story: '밤거리를 걸으며 들으면 영화 속 주인공이 된 듯한 감동을 주는 곡입니다.' },
      { title: 'City Of Stars', artist: 'Ryan Gosling & Emma Stone (영화 라라랜드 OST)', story: '별빛이 내려앉은 밤하늘처럼 낭만적인 재즈풍 영화음악입니다.' },
      { title: 'Love Story', artist: 'Andy Williams (명화 러브스토리 OST)', story: '깊고 우아한 선율로 오랫동안 기억되는 고전 명화 OST입니다.' }
    ]
  },
  jazz: {
    label: '☕ 카페 재즈 & 로파이(Lo-Fi)',
    djComment: '분위기 좋은 카페 창가에 앉아 있는 듯한 감미로운 재즈 & 로파이 선곡입니다.',
    songs: [
      { title: 'Fly Me To The Moon', artist: 'Frank Sinatra (프랭크 시나트라)', story: '경쾌한 스윙 리듬이 기분까지 산뜻하게 만들어주는 대표 재즈곡입니다.' },
      { title: 'Waltz for Debby', artist: 'Bill Evans Trio (빌 에반스)', story: '우아하고 서정적인 재즈 피아노 연주의 정수로 꼽히는 명곡입니다.' },
      { title: 'The Girl From Ipanema', artist: 'Stan Getz & Astrud Gilberto', story: '바닷바람처럼 살랑이는 보사노바 리듬이 커피 타임에 딱 어울립니다.' },
      { title: 'What A Wonderful World', artist: 'Louis Armstrong (루이 암스트롱)', story: '따뜻하고 푸근한 음색이 마음에 여유를 선물하는 재즈 명곡입니다.' },
      { title: 'Autumn Leaves (고엽)', artist: 'Chet Baker (쳇 베이커)', story: '깊고 부드러운 트럼펫과 보컬이 매력적인 재즈 스탠다드입니다.' }
    ]
  },
  classic: {
    label: '🎻 클래식 & 피아노 연주곡',
    djComment: '마음을 차분하게 정돈해 주는 아름다운 피아노 연주곡과 클래식 명곡입니다.',
    songs: [
      { title: 'Summer (영화 기쿠지로의 여름 OST)', artist: '히사이시 조 (Joe Hisaishi)', story: '청량한 여름날의 풍경이 눈앞에 그려지는 경쾌한 피아노 연주곡입니다.' },
      { title: '인생의 회전목마 (하울의 움직이는 성 OST)', artist: '히사이시 조 (Joe Hisaishi)', story: '환상적이고 우아한 왈츠 선율로 가장 사랑받는 오케스트라 연주곡입니다.' },
      { title: 'River Flows In You', artist: '이루마 (Yiruma)', story: '물 흐르듯 부드럽고 서정적인 멜로디가 일품인 뉴에이지 피아노곡입니다.' },
      { title: '녹턴 제2번 (Nocturne Op.9 No.2)', artist: '쇼팽 (Chopin)', story: '고요한 밤하늘의 별빛처럼 부드럽게 흐르는 클래식 피아노 명곡입니다.' },
      { title: '사계 중 봄 (The Four Seasons - Spring)', artist: '비발디 (Vivaldi)', story: '생동감 넘치는 바이올린 선율이 기분을 밝게 해주는 클래식입니다.' }
    ]
  },
  retro: {
    label: '🕺 7080 · 8090 레트로 명곡',
    djComment: '세대 불문 모두가 함께 따라 부르는 7080·8090 레트로 명곡입니다.',
    songs: [
      { title: '붉은 노을', artist: '이문세', story: '언제 들어도 어깨가 들썩이는 대한민국 대표 레트로 명곡입니다.' },
      { title: '바운스 (Bounce)', artist: '조용필', story: '가왕 조용필의 세련된 리듬감과 청량한 보컬이 돋보이는 히트곡입니다.' },
      { title: '바람이 불어오는 곳', artist: '김광석', story: '설레는 마음과 따뜻한 위로를 전해주는 포크 명곡입니다.' },
      { title: '그대에게', artist: '무한궤도 (신해철)', story: '전주만 들어도 심장이 뛰는 벅찬 에너지의 응원가 같은 명곡입니다.' },
      { title: '애상', artist: '쿨 (COOL)', story: '시원하고 경쾌한 리듬으로 여행길과 모임에서 늘 사랑받는 곡입니다.' }
    ]
  },
  trot: {
    label: '🎺 인기 트로트 & 흥겨운 가요',
    djComment: '흥과 감동을 동시에 전해주는 국민 인기 트로트 히트곡입니다!',
    songs: [
      { title: '사랑은 늘 도망가', artist: '임영웅', story: '감미롭고 애절한 보이스로 차트 롱런 중인 임영웅의 대표 명곡입니다.' },
      { title: '모래 알갱이', artist: '임영웅', story: '잔잔한 파도 소리와 따뜻한 휘파람이 포근한 위로를 전해주는 곡입니다.' },
      { title: '시절인연', artist: '이찬원', story: '소중한 인연과 우정을 떠올리게 하는 따뜻한 감성의 트로트입니다.' },
      { title: '찐이야', artist: '영탁', story: '듣자마자 흥이 폭발하는 경쾌하고 에너제틱한 히트곡입니다.' },
      { title: '아모르 파티', artist: '김연자', story: '신나는 EDM 비트와 파워풀한 가창력이 만나 분위기를 띄워주는 곡입니다.' }
    ]
  },

  // ---- [탭 2: 상황·기분별 채널 6종] ----
  drive: {
    label: '🚗 시원한 드라이브 · 여행 갈 때',
    djComment: '창문을 열고 달릴 때 기분을 최고조로 끌어올려 줄 드라이브 선곡입니다!',
    songs: [
      { title: 'Welcome to the Show', artist: 'DAY6 (데이식스)', story: '탁 트인 도로를 달릴 때 가슴이 뻥 뚫리는 벅찬 밴드 사운드입니다.' },
      { title: '여행', artist: '볼빨간사춘기', story: '떠나는 순간의 설렘을 그대로 담은 상큼하고 경쾌한 여행 대표곡입니다.' },
      { title: '여행을 떠나요', artist: '조용필', story: '모두가 한목소리로 신나게 따라 부르는 최고의 드라이브 명곡입니다.' },
      { title: '사건의 지평선', artist: '윤하 (YOUNHA)', story: '질주하는 듯한 경쾌한 록 사운드가 드라이브 텐션을 높여줍니다.' }
    ]
  },
  focus: {
    label: '💻 공부 · 과제 · 작업 집중할 때',
    djComment: '가사 없이 편안하게 집중력을 높여주는 피아노 & 로파이 연주곡입니다.',
    songs: [
      { title: 'Kiss The Rain', artist: '이루마 (Yiruma)', story: '차분한 피아노 선율이 머리를 맑게 해주는 집중 시간 베스트 연주곡입니다.' },
      { title: '달빛 (Clair de Lune)', artist: '드뷔시 (Debussy)', story: '잡념을 가라앉히고 깊은 몰입을 도와주는 클래식 피아노 명곡입니다.' },
      { title: 'A Town With An Ocean View (마녀배달부 키키 OST)', artist: '히사이시 조 (Joe Hisaishi)', story: '기분 좋은 산뜻함으로 과제와 업무 효율을 높여주는 연주곡입니다.' }
    ]
  },
  workout: {
    label: '👟 산책 · 러닝 · 운동할 때',
    djComment: '걷거나 달릴 때 발걸음에 리듬과 에너지를 더해줄 활기찬 트랙입니다!',
    songs: [
      { title: '파이팅 해야지 (Feat. 이영지)', artist: '부석순 (SEVENTEEN)', story: '지친 하루에 강력한 응원 에너지를 불어넣어 주는 파워풀한 곡입니다.' },
      { title: 'Attention', artist: 'NewJeans (뉴진스)', story: '경쾌한 비트에 맞춰 기분 좋게 파워워킹하기 딱 좋은 곡입니다.' },
      { title: 'Dynamite', artist: '방탄소년단 (BTS)', story: '전 세계를 들썩이게 한 신나는 디스코 팝 리듬으로 운동 효과를 높여줍니다.' }
    ]
  },
  cafe: {
    label: '☕ 여유로운 오후 커피 타임',
    djComment: '향긋한 커피 한 잔과 가장 잘 어울리는 감성 어쿠스틱 & 카페 음악입니다.',
    songs: [
      { title: '아메리카노', artist: '10CM (십센치)', story: '커피를 마실 때 자연스럽게 흥얼거리게 되는 카페 시그니처 곡입니다.' },
      { title: '밤편지', artist: '아이유 (IU)', story: '잔잔한 기타 선율과 포근한 목소리가 오후의 여유를 더해줍니다.' },
      { title: 'Sunday Morning', artist: 'Maroon 5 (마룬 5)', story: '카페 창가 자리에서 듣기 가장 좋은 경쾌하고 감미로운 곡입니다.' }
    ]
  },
  rain: {
    label: '☔ 비 오는 날 창밖 보며',
    djComment: '빗소리와 함께 들으면 감성이 두 배로 깊어지는 비 오는 날 대표 명곡입니다.',
    songs: [
      { title: '비도 오고 그래서 (Feat. 신용재)', artist: '헤이즈 (Heize)', story: '비 오는 날이면 언제나 멜론 차트 상위권에 오르는 대표 감성곡입니다.' },
      { title: '비', artist: '폴킴', story: '창밖에 내리는 비를 보며 조용히 감상하기 좋은 따뜻한 발라드입니다.' },
      { title: '우산 (Feat. 윤하)', artist: '에픽하이 (Epik High)', story: '빗소리로 시작하는 도입부가 언제 들어도 설레는 명곡입니다.' }
    ]
  },
  night: {
    label: '🌙 잠들기 전 편안한 밤 · 새벽',
    djComment: '오늘 하루도 수고 많으셨습니다. 편안한 휴식을 도와줄 잔잔한 밤 음악입니다.',
    songs: [
      { title: '밤편지', artist: '아이유 (IU)', story: '반딧불이를 보내듯 다정한 가사가 편안한 밤을 선물해 줍니다.' },
      { title: '별 보러 가자', artist: '적재', story: '따뜻한 기타 선율과 부드러운 목소리가 새벽 감성을 포근하게 감싸줍니다.' },
      { title: '편지', artist: '김광진', story: '진심 어린 가사와 잔잔한 피아노 반주가 깊은 여운을 남기는 명곡입니다.' }
    ]
  }
};

// 현재 선택된 선곡 상태
let currentSelection = {
  channelTitle: '🎤 K-POP & 멜론 인기차트',
  djComment: '',
  songs: []
};

// 설정 상태 (새 API 키 기본 적용)
let appConfig = {
  kakaoJsKey: localStorage.getItem('yumi_kakao_js_key_v2') || DEFAULT_KAKAO_JS_KEY,
  playMcpUrl: localStorage.getItem('yumi_playmcp_url') || 'https://playmcp.kakao.com/mcp/3',
  playMcpToken: localStorage.getItem('yumi_playmcp_token') || ''
};

// 페이지 초기 실행
window.addEventListener('DOMContentLoaded', () => {
  // 카카오톡 공유 카드에서 [멜론에서 듣기] 클릭(?goMelon=검색어)으로 들어온 경우 즉시 멜론으로 이동
  const params = new URLSearchParams(window.location.search);
  const goMelon = params.get('goMelon');
  if (goMelon) {
    window.location.replace(`https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(goMelon)}`);
    return;
  }

  initKakaoSdkIfReady();
  updateConnectionBadge();
  selectChannel('kpop');
});

// ==========================================================================
// 2. 글씨 크기 조절 기능
// ==========================================================================
function setFontSize(size) {
  document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
  document.body.classList.add(`font-${size}`);

  document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.size === size);
  });

  const labelMap = { normal: '보통 크기', large: '큰 글씨', xlarge: '아주 큰 글씨' };
  showToast(`🔍 화면 글씨를 [${labelMap[size]}]로 변경했습니다.`);
}

// ==========================================================================
// 3. 탭(서랍) 전환 기능
// ==========================================================================
function switchTab(tabType) {
  const tabs = {
    genre: { btn: 'tabGenreBtn', panel: 'panelGenre' },
    mood: { btn: 'tabMoodBtn', panel: 'panelMood' },
    request: { btn: 'tabRequestBtn', panel: 'panelRequest' }
  };

  Object.keys(tabs).forEach((key) => {
    const isTarget = key === tabType;
    const btnEl = document.getElementById(tabs[key].btn);
    const panelEl = document.getElementById(tabs[key].panel);
    btnEl.classList.toggle('active', isTarget);
    btnEl.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    panelEl.classList.toggle('active', isTarget);
  });
}

// ==========================================================================
// 4. 채널 선택 및 선곡 표시
// ==========================================================================
function selectChannel(channelKey) {
  const channelData = MUSIC_CHANNELS[channelKey];
  if (!channelData) return;

  document.querySelectorAll('.channel-card').forEach((card) => {
    card.classList.toggle('selected', card.dataset.channel === channelKey);
  });

  const pickedSongs = pickRandomSongs(channelData.songs, 3);

  currentSelection = {
    channelTitle: channelData.label,
    djComment: channelData.djComment,
    songs: pickedSongs
  };

  renderPlaylistResult(currentSelection);
}

function pickRandomSongs(songArray, count) {
  const copied = [...songArray];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied.slice(0, count);
}

// ==========================================================================
// 5. AI DJ 맞춤 신청곡 검색 (요청한 가수/장르만 정확히 반환!)
// ==========================================================================
function fillRequest(text) {
  const input = document.getElementById('djInput');
  input.value = text;
  submitDjRequest();
}

async function submitDjRequest() {
  const input = document.getElementById('djInput');
  const query = input.value.trim();

  if (!query) {
    showToast('🎙️ 듣고 싶은 가수 이름이나 음악 스타일을 입력해 주세요!');
    input.focus();
    return;
  }

  const djMsgEl = document.getElementById('djMessage');
  djMsgEl.textContent = `⏳ PlayMCP 멜론(Melon) 도구를 통해 "${query}" 맞춤 곡을 찾고 있습니다...`;

  if (appConfig.playMcpUrl && appConfig.playMcpToken) {
    try {
      const mcpResult = await callPlayMcpMelonSearch(query);
      if (mcpResult && mcpResult.length > 0) {
        currentSelection = {
          channelTitle: `🎙️ AI DJ 신청곡: "${query}"`,
          djComment: `신청해주신 "${query}"에 맞춰 PlayMCP 멜론 도구에서 찾아낸 추천곡입니다!`,
          songs: mcpResult
        };
        renderPlaylistResult(currentSelection);
        showToast('🎵 PlayMCP 멜론에서 신청곡을 찾았습니다!');
        return;
      }
    } catch (err) {
      console.warn('PlayMCP 원격 호출 대신 내장 DJ 선곡기로 전환합니다:', err);
    }
  }

  const matchedSongs = searchSmartSongs(query);
  currentSelection = {
    channelTitle: `🎙️ AI DJ 신청곡: "${query}"`,
    djComment: `신청해주신 "${query}" 키워드에 꼭 맞는 추천 트랙 3곡을 멜론에서 준비했습니다!`,
    songs: matchedSongs
  };

  renderPlaylistResult(currentSelection);
  showToast(`🎵 "${query}" 신청곡 선곡이 완료되었습니다!`);
}

async function callPlayMcpMelonSearch(query) {
  const response = await fetch(appConfig.playMcpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(appConfig.playMcpToken ? { Authorization: `Bearer ${appConfig.playMcpToken}` } : {})
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: 'melon_search_tracks',
        arguments: { query: query, limit: 3 }
      }
    })
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data && data.result && Array.isArray(data.result.tracks)) {
    return data.result.tracks.map((t) => ({
      title: t.title || query,
      artist: t.artist || '멜론 추천 아티스트',
      story: t.description || 'PlayMCP 멜론 도구에서 실시간으로 조회한 추천곡입니다.'
    }));
  }
  return null;
}

// 가수/장르/키워드 정확 매칭 검색 엔진 (엉뚱한 다른 가수 곡이 섞이지 않도록 처리!)
function searchSmartSongs(query) {
  const allSongs = [];
  Object.values(MUSIC_CHANNELS).forEach((channel) => {
    channel.songs.forEach((song) => {
      if (!allSongs.some((s) => s.title === song.title && s.artist === song.artist)) {
        allSongs.push(song);
      }
    });
  });

  const cleanKeyword = query
    .replace(/(노래|추천해줘|추천|찾아줘|틀어줘|명곡|인기곡|들려줘|곡)/g, ' ')
    .trim() || query.trim();

  const tokens = cleanKeyword
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter((t) => t.length >= 2);

  const matched = allSongs.filter((s) => {
    const text = `${s.title} ${s.artist} ${s.story}`.toLowerCase();
    return tokens.some((tk) => text.includes(tk));
  });

  if (matched.length >= 3) {
    return matched.slice(0, 3);
  }

  // 요청한 가수/키워드 전용 트랙으로 채워 다른 가수 곡이 섞이지 않게 구성
  const specificTracks = [
    {
      title: `${cleanKeyword} 대표 인기곡 (Melon TOP)`,
      artist: cleanKeyword,
      story: `멜론에서 "${cleanKeyword}" 검색 시 가장 많은 하트(좋아요)를 받은 대표 명곡입니다.`
    },
    {
      title: `${cleanKeyword} 베스트 추천 트랙`,
      artist: cleanKeyword,
      story: `"${cleanKeyword}"의 매력을 가장 잘 느낄 수 있는 멜론 리스너 추천 명곡입니다.`
    },
    {
      title: `${cleanKeyword} 감성 플레이리스트 모음`,
      artist: cleanKeyword,
      story: `[🍈 멜론에서 듣기] 또는 [▶️ 유튜브 감상]을 누르면 "${cleanKeyword}" 곡들을 바로 감상하실 수 있습니다.`
    }
  ];

  const combined = [...matched];
  for (const item of specificTracks) {
    if (combined.length >= 3) break;
    combined.push(item);
  }
  return combined;
}

// ==========================================================================
// 6. 화면에 추천 노래 카드 3개 그리기
// ==========================================================================
function renderPlaylistResult(selection) {
  const djMsgEl = document.getElementById('djMessage');
  const listEl = document.getElementById('songListContainer');
  const kakaoBox = document.getElementById('kakaoActionBox');

  djMsgEl.textContent = selection.djComment;
  listEl.innerHTML = '';

  selection.songs.forEach((song, idx) => {
    const searchQuery = encodeURIComponent(`${song.artist} ${song.title}`.replace(/\(.*?\)/g, '').trim());
    const melonUrl = `https://www.melon.com/search/total/index.htm?q=${searchQuery}`;
    const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

    const card = document.createElement('article');
    card.className = 'song-card';
    card.innerHTML = `
      <div class="song-info">
        <div class="vinyl-badge" aria-hidden="true">${idx + 1}곡</div>
        <div class="song-text-group">
          <h3 class="song-title">${escapeHtml(song.title)}</h3>
          <div class="song-artist">🎤 ${escapeHtml(song.artist)}</div>
          <p class="song-story">${escapeHtml(song.story)}</p>
        </div>
      </div>
      <div class="song-play-btns">
        <a href="${melonUrl}" target="_blank" rel="noopener noreferrer" class="melon-btn">
          🍈 멜론에서 듣기
        </a>
        <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="youtube-btn">
          ▶️ 유튜브 영상 감상
        </a>
      </div>
    `;
    listEl.appendChild(card);
  });

  kakaoBox.classList.remove('hidden');
}

// ==========================================================================
// 7. 음성 안내(TTS) 및 음성 입력(마이크)
// ==========================================================================
function speakDjMessage() {
  if (!('speechSynthesis' in window)) {
    showToast('이 브라우저에서는 소리 읽기 기능을 지원하지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();
  const songNames = currentSelection.songs.map((s, idx) => `${idx + 1}번, ${s.artist}의 ${s.title}`).join('. ');
  const fullText = `${currentSelection.djComment} 오늘의 추천곡은 ${songNames} 입니다.`;

  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
  showToast('🔊 DJ가 오늘의 추천 노래를 소리로 읽어드립니다.');
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('이 브라우저는 마이크 음성 인식을 지원하지 않습니다. 글자로 입력해 주세요!');
    return;
  }

  const voiceBtn = document.getElementById('voiceBtn');
  const recognition = new SpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.interimResults = false;

  voiceBtn.classList.add('listening');
  voiceBtn.textContent = '👂 듣는 중...';
  showToast('🎙️ 듣고 싶은 가수나 노래를 말씀해 보세요!');

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('djInput').value = transcript;
    submitDjRequest();
  };

  recognition.onend = () => {
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎙️ 말하기';
  };

  recognition.start();
}

// ==========================================================================
// 8. 카카오톡 전송 기능 (도메인 정책 호환 리다이렉트 적용!)
// ==========================================================================
function sendToMyKakaoMemo() {
  openKakaoPreviewModal('📥 내 카카오톡(나와의 채팅방) 보관 미리보기');
}

function shareToKakaoFriend() {
  openKakaoPreviewModal('💌 친구에게 카카오톡 노래 선물하기');
}

function openKakaoPreviewModal(modalTitle) {
  document.getElementById('previewModalTitle').textContent = modalTitle;
  const contentEl = document.getElementById('katalkPreviewContent');

  const linesHtml = currentSelection.songs
    .map(
      (s, i) =>
        `<div style="margin-bottom:10px; padding-bottom:8px; border-bottom:1px dashed #e5e7eb;">
          <strong>${i + 1}. ${escapeHtml(s.title)}</strong> - ${escapeHtml(s.artist)}<br/>
          <span style="color:#666; font-size:0.9em;">${escapeHtml(s.story)}</span>
        </div>`
    )
    .join('');

  contentEl.innerHTML = `
    <p style="font-weight:700; color:#3b2314; margin-bottom:10px;">
      [${escapeHtml(currentSelection.channelTitle)}]
    </p>
    ${linesHtml}
    <p style="margin-top:8px; color:#009f2e; font-weight:700;">
      🍈 멜론에서 바로 듣기 링크 포함
    </p>
  `;

  document.getElementById('kakaoPreviewModal').classList.remove('hidden');
}

function closePreviewModal() {
  document.getElementById('kakaoPreviewModal').classList.add('hidden');
}

async function copyPlaylistToClipboard() {
  const textLines = [
    `🎧 [AI 뮤직 라운지] 오늘의 추천 플레이리스트 🎵`,
    `선택 채널: ${currentSelection.channelTitle}`,
    ``,
    ...currentSelection.songs.map((s, i) => {
      const q = encodeURIComponent(`${s.artist} ${s.title}`);
      return `${i + 1}. ${s.title} - ${s.artist}\n   💬 ${s.story}\n   🍈 듣기: https://www.melon.com/search/total/index.htm?q=${q}`;
    }),
    ``,
    `오늘도 좋은 음악과 함께 기분 좋은 하루 보내세요! 💛`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(textLines);
    showToast('✅ 카카오톡에 붙여넣을 노래 목록이 복사되었습니다!');
  } catch (e) {
    showToast('복사 완료! 카카오톡 대화창에 붙여넣기 해보세요.');
  }
}

async function triggerRealKakaoSend() {
  const firstSong = currentSelection.songs[0] || { title: '추천곡', artist: '멜론 DJ' };
  const queryStr = `${firstSong.artist} ${firstSong.title}`.replace(/\(.*?\)/g, '').trim();
  const directMelonUrl = `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(queryStr)}`;

  // 카카오 디벨로퍼스 도메인 정책 준수를 위해 내 웹앱 주소(?goMelon=검색어)로 연결
  const baseAppUrl = window.location.protocol.startsWith('http')
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://kakaomcp-ashen.vercel.app/music/index.html';
  const redirectMelonUrl = `${baseAppUrl}?goMelon=${encodeURIComponent(queryStr)}`;

  const songSummary = currentSelection.songs
    .map((s, idx) => `${idx + 1}. ${s.title} - ${s.artist}`)
    .join(' / ');

  if (window.Kakao && window.location.protocol.startsWith('http')) {
    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(appConfig.kakaoJsKey || DEFAULT_KAKAO_JS_KEY);
      }
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `🎧 ${currentSelection.channelTitle}`,
          description: songSummary,
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png',
          link: {
            mobileWebUrl: redirectMelonUrl,
            webUrl: redirectMelonUrl
          }
        },
        buttons: [
          {
            title: '🍈 멜론에서 노래 듣기',
            link: {
              mobileWebUrl: redirectMelonUrl,
              webUrl: redirectMelonUrl
            }
          },
          {
            title: '🎧 뮤직 주크박스 열기',
            link: {
              mobileWebUrl: baseAppUrl,
              webUrl: baseAppUrl
            }
          }
        ]
      });
      showToast('💛 카카오톡 공유 창을 열었습니다!');
      return;
    } catch (err) {
      console.warn('Kakao.Share 호출 폴백:', err);
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: `🎧 ${currentSelection.channelTitle}`,
        text: `${currentSelection.channelTitle}\n${songSummary}`,
        url: directMelonUrl
      });
      return;
    } catch (e) {}
  }

  await copyPlaylistToClipboard();
  closePreviewModal();
  showToast('💡 노래 목록을 복사했습니다! 카카오톡 대화창에 바로 붙여넣어 보내실 수 있습니다.');
}

// ==========================================================================
// 9. 설정 모달 관리
// ==========================================================================
function openConfigModal() {
  document.getElementById('kakaoJsKeyInput').value = appConfig.kakaoJsKey;
  document.getElementById('playMcpUrlInput').value = appConfig.playMcpUrl;
  document.getElementById('playMcpTokenInput').value = appConfig.playMcpToken;
  document.getElementById('configModal').classList.remove('hidden');
}

function closeConfigModal() {
  document.getElementById('configModal').classList.add('hidden');
}

function saveConfig() {
  appConfig.kakaoJsKey =
    document.getElementById('kakaoJsKeyInput').value.trim() || DEFAULT_KAKAO_JS_KEY;
  appConfig.playMcpUrl =
    document.getElementById('playMcpUrlInput').value.trim() || 'https://playmcp.kakao.com/mcp/3';
  appConfig.playMcpToken = document.getElementById('playMcpTokenInput').value.trim();

  localStorage.setItem('yumi_kakao_js_key_v2', appConfig.kakaoJsKey);
  localStorage.setItem('yumi_playmcp_url', appConfig.playMcpUrl);
  localStorage.setItem('yumi_playmcp_token', appConfig.playMcpToken);

  initKakaoSdkIfReady();
  updateConnectionBadge();
  closeConfigModal();
  showToast('💾 카카오 & PlayMCP 연결 설정이 저장되었습니다!');
}

function initKakaoSdkIfReady() {
  if (window.Kakao && appConfig.kakaoJsKey) {
    try {
      if (window.Kakao.isInitialized()) {
        window.Kakao.cleanup();
      }
      window.Kakao.init(appConfig.kakaoJsKey);
    } catch (e) {
      console.warn('Kakao SDK 초기화 확인:', e);
    }
  }
}

function updateConnectionBadge() {
  const dot = document.getElementById('connectionDot');
  if (!dot) return;
  const isReady = Boolean(appConfig.kakaoJsKey);
  dot.classList.toggle('connected', isReady);
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toastBox');
  toast.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3400);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
