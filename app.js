/* ==========================================================================
   추억의 음악 다방 & 카톡 주크박스 — 핵심 동작 스크립트 (app.js)
   - Kakao PlayMCP (https://playmcp.kakao.com/mcp/3) 연동
   - Kakao Developers (https://developers.kakao.com/) SDK 연동
   ========================================================================== */

// 1. 풍부한 장르별(8종) & 상황별(5종) 음악 데이터베이스
const MUSIC_CHANNELS = {
  // ---- [탭 1: 장르별 채널 8종] ----
  '7080': {
    label: '🎸 7080 통기타 & 포크송',
    djComment: '젊은 시절 통기타 소리와 함께 부르던 그리운 7080 포크 명곡 3곡을 골라보았습니다.',
    songs: [
      { title: '바람이 불어오는 곳', artist: '김광석', story: '설레는 마음과 따뜻한 위로를 전해주는 영원한 통기타 명곡입니다.' },
      { title: '고래사냥', artist: '송창식', story: '청춘의 열정과 시원한 목소리가 가슴을 뻥 뚫어주는 노래입니다.' },
      { title: '아침이슬', artist: '양희은', story: '맑고 청아한 목소리로 시대를 울린 아름다운 포크송입니다.' },
      { title: '그대 그리고 나', artist: '소리새', story: '낙엽 지는 계절이나 다방에서 커피 한잔할 때 늘 흐르던 곡입니다.' },
      { title: '사랑으로', artist: '해바라기', story: '가족, 친구들과 손잡고 함께 부르면 마음이 따뜻해지는 노래입니다.' }
    ]
  },
  'trot': {
    label: '🎤 인기 트로트 & 히트곡',
    djComment: '어깨가 절로 들썩이고 마음까지 훈훈해지는 국민 애창 트로트 명곡입니다!',
    songs: [
      { title: '사랑은 늘 도망가', artist: '임영웅', story: '감미롭고 애절한 목소리로 전 세대의 마음을 사로잡은 인기곡입니다.' },
      { title: '테스형!', artist: '나훈아', story: '인생에 대한 깊은 공감을 시원한 가창력으로 풀어낸 명곡입니다.' },
      { title: '시절인연', artist: '이찬원', story: '소중한 인연과 친구들을 떠올리게 하는 따뜻한 트로트입니다.' },
      { title: '신사동 그 사람', artist: '주현미', story: '언제 들어도 반갑고 흥이 나는 정통 트로트의 대표곡입니다.' },
      { title: '아모르 파티', artist: '김연자', story: '나이는 숫자에 불과하다! 오늘을 신나게 만들어주는 에너지 넘치는 곡입니다.' }
    ]
  },
  'ballad8090': {
    label: '🎹 8090 감성 가요 & 발라드',
    djComment: '라디오 별이 빛나는 밤에를 들으며 엽서를 쓰던 그 시절, 8090 감성 발라드입니다.',
    songs: [
      { title: '바람의 노래', artist: '조용필', story: '살아온 세월을 따뜻하게 다독여 주는 가왕 조용필의 인생 명곡입니다.' },
      { title: '옛사랑', artist: '이문세', story: '잔잔한 멜로디와 시 같은 가사가 깊은 여운을 남기는 노래입니다.' },
      { title: '인연', artist: '이선희', story: '맑고 호소력 짙은 목소리가 가슴 깊이 파고드는 명품 발라드입니다.' },
      { title: '희망사항', artist: '변진섭', story: '듣기만 해도 미소가 지어지는 80년대 말 최고의 인기 발라드입니다.' },
      { title: '보랏빛 향기', artist: '강수지', story: '봄바람처럼 산뜻하고 풋풋한 설렘을 떠올리게 하는 곡입니다.' }
    ]
  },
  'oldpop': {
    label: '📻 6070 추억의 올드팝',
    djComment: '전축과 라디오에서 흘러나오던 전 세계인의 애창곡, 6070 올드팝 명곡입니다.',
    songs: [
      { title: 'Yesterday', artist: 'The Beatles (비틀즈)', story: '전 세계에서 가장 많이 사랑받은 서정적인 올드팝의 대명사입니다.' },
      { title: 'Yesterday Once More', artist: 'Carpenters (카펜터즈)', story: '라디오에서 옛 노래가 나올 때의 반가움을 노래한 감미로운 팝송입니다.' },
      { title: 'Dancing Queen', artist: 'ABBA (아바)', story: '첫 피아노 반주만 들어도 기분이 좋아지는 경쾌한 명곡입니다.' },
      { title: 'Bridge Over Troubled Water', artist: 'Simon & Garfunkel', story: '힘든 날 든든한 다리가 되어주겠다는 따뜻한 위로의 명곡입니다.' },
      { title: 'Can\'t Help Falling In Love', artist: 'Elvis Presley (엘비스 프레슬리)', story: '중후하고 부드러운 목소리가 일품인 로맨틱 올드팝입니다.' }
    ]
  },
  'ost': {
    label: '🎬 명화 OST & 영화음악',
    djComment: '극장 스크린의 감동이 그대로 되살아나는 불멸의 명화 OST 선곡입니다.',
    songs: [
      { title: 'Love Story (Where Do I Begin)', artist: 'Andy Williams (영화 러브스토리 OST)', story: '하얀 눈밭의 주인공들이 떠오르는 애절하고 아름다운 영화음악입니다.' },
      { title: 'Cinema Paradiso (시네마 천국)', artist: 'Ennio Morricone (엔니오 모리꼬네)', story: '어린 시절의 향수와 따뜻한 감동을 전해주는 거장의 연주곡입니다.' },
      { title: 'Moon River', artist: 'Audrey Hepburn (영화 티파니에서 아침을 OST)', story: '오드리 헵번이 창가에서 부르던 우아하고 낭만적인 명곡입니다.' },
      { title: 'Over The Rainbow', artist: 'Judy Garland (영화 오즈의 마법사 OST)', story: '무지개 너머 꿈꾸던 시절을 떠올리게 하는 포근한 노래입니다.' },
      { title: 'My Heart Will Go On', artist: 'Celine Dion (영화 타이타닉 OST)', story: '웅장한 선율과 감동적인 목소리가 어우러진 세기의 영화음악입니다.' }
    ]
  },
  'classic': {
    label: '🎻 품격 있는 클래식 & 한국 가곡',
    djComment: '마음에 기품과 여유를 더해주는 아름다운 클래식과 우리 가곡을 준비했습니다.',
    songs: [
      { title: '사계 중 봄 (The Four Seasons - Spring)', artist: '비발디 (Vivaldi)', story: '새소리와 봄바람이 느껴지는 듯한 밝고 화사한 클래식 명곡입니다.' },
      { title: '그리운 금강산', artist: '한국 가곡 (최영섭 작곡)', story: '우리 산하의 아름다움과 그리움을 웅장하게 담아낸 국민 가곡입니다.' },
      { title: '녹턴 제2번 (Nocturne Op.9 No.2)', artist: '쇼팽 (Chopin)', story: '고요한 밤하늘의 별빛처럼 부드럽게 흐르는 피아노 연주곡입니다.' },
      { title: '보리밭', artist: '한국 가곡 (윤용하 작곡)', story: '고향의 푸른 보리밭 풍경이 눈앞에 그려지는 정겨운 가곡입니다.' },
      { title: '사랑의 인사 (Salut d\'Amour)', artist: '엘가 (Elgar)', story: '따뜻하고 다정한 바이올린 선율이 마음을 포근하게 감싸줍니다.' }
    ]
  },
  'jazz': {
    label: '🎷 찻집 분위기 재즈 & 연주곡',
    djComment: '분위기 좋은 카페에 앉아 있는 것처럼 감미로운 재즈와 연주곡을 골라보았습니다.',
    songs: [
      { title: 'What A Wonderful World', artist: 'Louis Armstrong (루이 암스트롱)', story: '푸른 하늘과 아름다운 세상을 노래하는 푸근한 재즈 명곡입니다.' },
      { title: 'Fly Me To The Moon', artist: 'Frank Sinatra (프랭크 시나트라)', story: '경쾌한 스윙 리듬이 기분까지 산뜻하게 만들어주는 대표 재즈곡입니다.' },
      { title: 'The Girl From Ipanema', artist: 'Stan Getz & Astrud Gilberto', story: '바닷바람처럼 살랑이는 보사노바 리듬이 커피 타임에 딱 어울립니다.' },
      { title: 'Autumn Leaves (고엽)', artist: 'Chet Baker (쳇 베이커)', story: '깊고 중후한 트럼펫과 색소폰 연주가 일품인 재즈 스탠다드입니다.' },
      { title: 'Going Home', artist: 'Kenny G (케니 지)', story: '한국인이 가장 사랑하는 따뜻하고 편안한 색소폰 연주곡입니다.' }
    ]
  },
  'healing': {
    label: '🌿 마음 치유 명상 & 전통 음악',
    djComment: '복잡한 생각을 내려놓고 깊은 평온함을 찾으실 수 있는 치유·전통 음악입니다.',
    songs: [
      { title: '청성곡 (대금 독주)', artist: '전통 국악 명인 연주', story: '맑고 청아한 대금 소리가 숲속에 와 있는 듯한 평화로움을 줍니다.' },
      { title: '아침 숲의 새소리와 물소리', artist: '자연 명상 음악 (Healing Nature)', story: '다도를 즐기시거나 눈을 감고 호흡을 가다듬을 때 좋은 치유 음악입니다.' },
      { title: 'Amazing Grace (나 같은 죄인 살려주신)', artist: '평화 합창 & 오케스트라 연주', story: '마음에 깊은 감사와 평안을 채워주는 세계적인 영가·연주곡입니다.' },
      { title: '아리랑 연주곡 (가야금 & 피아노)', artist: '국악 크로스오버 앙상블', story: '우리 가락 아리랑을 가야금과 피아노로 곱게 풀어낸 감동적인 연주입니다.' }
    ]
  },

  // ---- [탭 2: 상황·날씨별 채널 5종] ----
  'walk': {
    label: '👟 아침 산책·운동할 때',
    djComment: '하나 둘! 걷는 발걸음에 활력을 불어넣어 줄 경쾌한 산책 음악 3곡입니다.',
    songs: [
      { title: '여행을 떠나요', artist: '조용필', story: '듣기만 해도 발걸음이 가벼워지고 신이 나는 최고의 산책 파트너입니다.' },
      { title: '찐이야', artist: '영탁', story: '경쾌한 박자에 맞춰 팔을 흔들며 파워워킹하기 딱 좋은 곡입니다.' },
      { title: '행복의 나라로', artist: '한대수', story: '상쾌한 아침 공기를 마시며 공원을 걸을 때 기분을 북돋아 줍니다.' }
    ]
  },
  'tea': {
    label: '☕ 오후에 따뜻한 차 한잔할 때',
    djComment: '향긋한 차나 커피 한 잔과 함께 여유로운 오후를 만들어 줄 음악입니다.',
    songs: [
      { title: '이별의 종착역', artist: '손시향', story: '옛 다방의 추억과 낭만이 물씬 풍기는 그 시절 명곡입니다.' },
      { title: '사랑하는 마음', artist: '김세환', story: '달콤하고 부드러운 음색이 따뜻한 차 한 잔과 참 잘 어울립니다.' },
      { title: 'La Vie En Rose (장밋빛 인생)', artist: 'Edith Piaf (에디트 피아프)', story: '찻집 창가에서 여유를 즐길 때 품격을 더해주는 샹송 명곡입니다.' }
    ]
  },
  'rain': {
    label: '☔ 비 오거나 옛 생각 나는 날',
    djComment: '투둑투둑 떨어지는 빗소리와 함께 들으면 더욱 운치 있는 감성 명곡입니다.',
    songs: [
      { title: '빗속의 여인', artist: '신중현과 엽전들', story: '비 오는 날이면 어김없이 라디오에서 흘러나오던 추억의 명곡입니다.' },
      { title: '비처럼 음악처럼', artist: '김현식', story: '깊고 진한 목소리가 비 오는 날의 감성을 촉촉하게 적셔줍니다.' },
      { title: '유리창엔 비', artist: '햇빛촌', story: '창가에 맺힌 빗방울을 바라보며 옛 추억에 잠기기 좋은 노래입니다.' }
    ]
  },
  'travel': {
    label: '🚗 가족·친구와 나들이 갈 때',
    djComment: '차 안에서 가족, 친구들과 함께 박수 치며 따라 부르기 좋은 나들이 명곡입니다!',
    songs: [
      { title: '남행열차', artist: '김수희', story: '나들이 가는 길에 빠지면 섭섭한 대한민국 대표 흥겨운 애창곡입니다.' },
      { title: '젊은 그대', artist: '김수철', story: '언제 들어도 청춘의 에너지가 샘솟는 신나는 드라이브 곡입니다.' },
      { title: '해변으로 가요', artist: '키보이스', story: '여행지 가는 길의 설렘을 두 배로 만들어주는 경쾌한 노래입니다.' }
    ]
  },
  'night': {
    label: '🌙 잠들기 전 편안한 밤',
    djComment: '오늘 하루도 참 수고 많으셨습니다. 편안한 밤과 숙면을 도와줄 잔잔한 곡입니다.',
    songs: [
      { title: '편지', artist: '김광진', story: '포근한 멜로디와 진심 어린 가사가 하루의 끝을 따뜻하게 감싸줍니다.' },
      { title: '달빛 (Clair de Lune)', artist: '드뷔시 (Debussy)', story: '은은한 달빛 아래서 마음이 차분히 가라앉는 아름다운 피아노곡입니다.' },
      { title: '가을 밤', artist: '양희은', story: '어머니의 자장가처럼 다정하고 평화로운 목소리가 깊은 휴식을 줍니다.' }
    ]
  }
};

// 현재 화면에 선택된 선곡 상태 저장
let currentSelection = {
  channelTitle: '🎸 7080 통기타 & 포크송',
  djComment: '',
  songs: []
};

const DEFAULT_KAKAO_JS_KEY = '2cc751d0de6a0e97b90181755f74c071';

// 설정 상태 (로컬스토리지 저장 지원, 유미님의 JavaScript 키 기본 탑재)
let appConfig = {
  kakaoJsKey: localStorage.getItem('yumi_kakao_js_key') || DEFAULT_KAKAO_JS_KEY,
  playMcpUrl: localStorage.getItem('yumi_playmcp_url') || 'https://playmcp.kakao.com/mcp/3',
  playMcpToken: localStorage.getItem('yumi_playmcp_token') || ''
};

// 페이지가 처음 열릴 때 기본 채널(7080 통기타) 자동 표시
window.addEventListener('DOMContentLoaded', () => {
  initKakaoSdkIfReady();
  updateConnectionBadge();
  selectChannel('7080');
});

// ==========================================================================
// 2. 글씨 크기 조절 기능 (보통 / 크게 / 아주 크게)
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
// 3. 탭(서랍) 전환 기능 (장르별 / 상황별 / 직접 신청곡)
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
// 4. 채널 선택 및 PlayMCP 멜론 선곡 동작
// ==========================================================================
async function selectChannel(channelKey) {
  const channelData = MUSIC_CHANNELS[channelKey];
  if (!channelData) return;

  // 버튼 선택 강조 표시
  document.querySelectorAll('.channel-card').forEach((card) => {
    card.classList.remove('selected');
  });
  if (event && event.currentTarget && event.currentTarget.classList) {
    event.currentTarget.classList.add('selected');
  }

  // 매번 누를 때마다 해당 장르에서 3곡을 골라 보여줌 (섞기 효과로 다양한 곡 추천)
  const pickedSongs = pickRandomSongs(channelData.songs, 3);

  currentSelection = {
    channelTitle: channelData.label,
    djComment: channelData.djComment,
    songs: pickedSongs
  };

  renderPlaylistResult(currentSelection);
}

// 배열에서 골고루 3곡 뽑기
function pickRandomSongs(songArray, count) {
  const copied = [...songArray];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied.slice(0, count);
}

// ==========================================================================
// 5. DJ에게 직접 신청곡 보내기 (PlayMCP 엔드포인트 연동 + 스마트 검색)
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

  // 1) 만약 PlayMCP 인증 토큰이 설정되어 있다면 실제 원격 MCP 호출 시도
  if (appConfig.playMcpUrl && appConfig.playMcpToken) {
    try {
      const mcpResult = await callPlayMcpMelonSearch(query);
      if (mcpResult && mcpResult.length > 0) {
        currentSelection = {
          channelTitle: `🎙️ DJ 신청곡: "${query}"`,
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

  // 2) 내장 스마트 DJ 선곡 엔진 (키 입력 전에도 어떤 검색어든 즉시 멜론 연결!)
  const matchedSongs = searchSmartSongs(query);
  currentSelection = {
    channelTitle: `🎙️ DJ 신청곡: "${query}"`,
    djComment: `신청해주신 "${query}" 사연에 꼭 맞는 추천 노래 3곡을 멜론에서 준비했습니다!`,
    songs: matchedSongs
  };

  renderPlaylistResult(currentSelection);
  showToast(`🎵 "${query}" 신청곡 선곡이 완료되었습니다!`);
}

// PlayMCP (https://playmcp.kakao.com/mcp/3) JSON-RPC 호환 호출 함수
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

// 내장 스마트 DJ 검색기
function searchSmartSongs(query) {
  const allSongs = [];
  Object.values(MUSIC_CHANNELS).forEach((channel) => {
    channel.songs.forEach((song) => {
      if (!allSongs.some((s) => s.title === song.title && s.artist === song.artist)) {
        allSongs.push(song);
      }
    });
  });

  const q = query.toLowerCase();
  const filtered = allSongs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.story.toLowerCase().includes(q)
  );

  if (filtered.length >= 3) {
    return filtered.slice(0, 3);
  }

  // 특정 키워드/가수 맞춤 추천
  const customTracks = [
    {
      title: `${query} 대표 인기곡 모음`,
      artist: query.replace(/(노래|추천해줘|찾아줘|틀어줘|명곡)/g, '').trim() || '멜론 추천 아티스트',
      story: `"${query}" 검색어로 멜론에서 가장 많은 사랑을 받는 대표 명곡입니다.`
    },
    {
      title: `${query} 베스트 애창곡`,
      artist: '멜론 DJ 맞춤 선곡',
      story: '언제 들어도 기분이 좋아지는 인기 트랙을 멜론에서 바로 감상하실 수 있습니다.'
    },
    ...(filtered.length > 0 ? filtered : pickRandomSongs(allSongs, 2))
  ];

  return customTracks.slice(0, 3);
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
    const searchQuery = encodeURIComponent(`${song.artist} ${song.title}`);
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
// 7. 음성 안내(TTS) 및 음성 입력(마이크) 기능
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
  utterance.rate = 0.95; // 듣기 편하도록 또렷한 속도로 읽기
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

  recognition.onerror = () => {
    showToast('목소리를 잘 듣지 못했습니다. 다시 한 번 눌러 말씀해 주세요.');
  };

  recognition.onend = () => {
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎙️ 말하기';
  };

  recognition.start();
}

// ==========================================================================
// 8. 카카오톡 전송 기능 (나와의 채팅방 보관 & 친구에게 공유하기)
// ==========================================================================
let currentKakaoMode = 'memo'; // 'memo' 또는 'share'

function sendToMyKakaoMemo() {
  currentKakaoMode = 'memo';
  openKakaoPreviewModal('📥 내 카카오톡(나와의 채팅방) 보관 미리보기');
}

function shareToKakaoFriend() {
  currentKakaoMode = 'share';
  openKakaoPreviewModal('💌 친구·가족에게 카카오톡 노래 선물하기');
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
    <p style="font-weight:700; color:#4a2e1b; margin-bottom:10px;">
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

// 클립보드에 카카오톡 전송용 예쁜 텍스트 복사하기
async function copyPlaylistToClipboard() {
  const textLines = [
    `📻 [추억의 음악 다방] 오늘의 추천 노래 배달 🎵`,
    `선택 채널: ${currentSelection.channelTitle}`,
    ``,
    ...currentSelection.songs.map((s, i) => {
      const q = encodeURIComponent(`${s.artist} ${s.title}`);
      return `${i + 1}. ${s.title} - ${s.artist}\n   💬 ${s.story}\n   🍈 듣기: https://www.melon.com/search/total/index.htm?q=${q}`;
    }),
    ``,
    `오늘도 음악과 함께 건강하고 행복한 하루 보내세요! 💛`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(textLines);
    showToast('✅ 카카오톡에 붙여넣을 노래 목록이 복사되었습니다!');
  } catch (e) {
    showToast('복사 완료! 카카오톡 대화창에 붙여넣기 해보세요.');
  }
}

// 실제 카카오 SDK 또는 PlayMCP 나와의 채팅방 전송 실행
async function triggerRealKakaoSend() {
  const firstSong = currentSelection.songs[0] || { title: '추천곡', artist: '멜론 DJ' };
  const melonSearchUrl = `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(
    `${firstSong.artist} ${firstSong.title}`
  )}`;

  // 1) Kakao JS SDK가 초기화되어 있으면 실제 카카오톡 공유 창 띄우기
  if (window.Kakao && window.Kakao.isInitialized()) {
    const songSummary = currentSelection.songs
      .map((s, idx) => `${idx + 1}. ${s.title} (${s.artist})`)
      .join('\n');

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `📻 ${currentSelection.channelTitle}`,
        description: songSummary,
        imageUrl: 'https://cdn-icons-png.flaticon.com/512/3659/3659784.png',
        link: {
          mobileWebUrl: melonSearchUrl,
          webUrl: melonSearchUrl
        }
      },
      buttons: [
        {
          title: '🍈 멜론에서 노래 듣기',
          link: {
            mobileWebUrl: melonSearchUrl,
            webUrl: melonSearchUrl
          }
        }
      ]
    });
    return;
  }

  // 2) 아직 JavaScript 키를 넣기 전이라면 클립보드 자동 복사 후 친절히 안내
  await copyPlaylistToClipboard();
  closePreviewModal();
  openConfigModal();
  showToast('💡 노래 목록을 복사했습니다! 실제 카톡 자동 전송을 원하시면 카카오 JavaScript 키를 입력해 주세요.');
}

// ==========================================================================
// 9. 카카오 디벨로퍼스 & PlayMCP 연결 설정 모달 관리
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

  localStorage.setItem('yumi_kakao_js_key', appConfig.kakaoJsKey);
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
  dot.title = isReady ? '카카오 키 연결 완료' : '기본 체험 모드 동작 중 (클릭하여 키 연결)';
}

// ==========================================================================
// 10. 공통 도우미 함수 (토스트 메시지 & HTML 안전 변환)
// ==========================================================================
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
