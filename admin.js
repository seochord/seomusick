import { HERO_DATA, WORKS_DATA, NAV_DATA, ABOUT_DATA, RELEASE_DATA, ACTIVITIES_DATA } from './data.js';
import { firebaseConfig } from './firebase-config.js';

// --- FIREBASE INITIALIZATION ---
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- DATA INITIALIZATION (Prioritize LocalStorage, then Firestore, then data.js) ---
const localNav = localStorage.getItem('NAV_DATA');
const localAbout = localStorage.getItem('ABOUT_DATA');
const localHero = localStorage.getItem('HERO_DATA');
const localRelease = localStorage.getItem('RELEASE_DATA');
const localWorks = localStorage.getItem('WORKS_DATA');
const localActivities = localStorage.getItem('ACTIVITIES_DATA');

let currentWorks = localWorks ? JSON.parse(localWorks) : [...WORKS_DATA];
let currentActivities = localActivities ? JSON.parse(localActivities) : [...ACTIVITIES_DATA];
let currentMenus = localNav ? JSON.parse(localNav) : [...NAV_DATA];
let persistentAbout = localAbout ? JSON.parse(localAbout) : { ...ABOUT_DATA };
let persistentHero = localHero ? JSON.parse(localHero) : { ...HERO_DATA };
let persistentRelease = localRelease ? JSON.parse(localRelease) : { ...RELEASE_DATA };

// --- PASSWORD PROTECTION ---
const ADMIN_PW = "seomusick2026"; // 임시 비밀번호

function checkAuth() {
  if (sessionStorage.getItem('admin_auth') === 'true') return;
  
  const pw = prompt('관리자 비밀번호를 입력하세요:');
  if (pw === ADMIN_PW) {
    sessionStorage.setItem('admin_auth', 'true');
  } else {
    alert('비밀번호가 틀렸습니다.');
    window.location.href = '/';
  }
}

async function fetchFromFirestore() {
  try {
    const doc = await db.collection('settings').doc('site_data').get();
    if (doc.exists) {
      const data = doc.data();
      if (data.WORKS_DATA) currentWorks = data.WORKS_DATA;
      if (data.ACTIVITIES_DATA) currentActivities = data.ACTIVITIES_DATA;
      if (data.NAV_DATA) currentMenus = data.NAV_DATA;
      if (data.ABOUT_DATA) persistentAbout = data.ABOUT_DATA;
      if (data.HERO_DATA) persistentHero = data.HERO_DATA;
      if (data.RELEASE_DATA) persistentRelease = data.RELEASE_DATA;
      
      // Update UI with Firestore data
      updateUI();
    } else {
      console.log("Firestore에 데이터가 없습니다. 초기 데이터를 업로드합니다.");
      await saveToFirestore(); // Upload default data
    }
  } catch (err) {
    console.error("Firestore 로딩 실패:", err);
  }
}

function updateUI() {
  // Load Hero
  document.getElementById('hero-eye').value = persistentHero.eye;
  document.getElementById('hero-title').value = persistentHero.title;
  document.getElementById('hero-slogan-en').value = persistentHero.slogan ? persistentHero.slogan.en : '';
  document.getElementById('hero-slogan-ko').value = persistentHero.slogan ? persistentHero.slogan.ko : '';
  document.getElementById('hero-youtube').value = persistentHero.youtubePlaylistId || '';

  // Load Release
  document.getElementById('rel-title').value = persistentRelease.title;
  document.getElementById('rel-desc').value = persistentRelease.desc;
  document.getElementById('rel-link').value = persistentRelease.link;

  // Load About
  document.getElementById('about-verse').value = persistentAbout.verse;
  document.getElementById('about-ref').value = persistentAbout.verseRef;
  document.getElementById('about-body').value = persistentAbout.body.join('\n');

  renderWorksList();
  renderActivitiesList();
  renderMenuList();
}

async function saveToFirestore() {
  try {
    await db.collection('settings').doc('site_data').set({
      HERO_DATA: persistentHero,
      RELEASE_DATA: persistentRelease,
      WORKS_DATA: currentWorks,
      ACTIVITIES_DATA: currentActivities,
      ABOUT_DATA: persistentAbout,
      NAV_DATA: currentMenus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("Firestore 저장 성공!");
  } catch (err) {
    console.error("Firestore 저장 실패:", err);
    alert("서버 저장에 실패했습니다. 권한 설정을 확인해주세요.");
  }
}

function init() {
  checkAuth();
  updateUI();
  fetchFromFirestore(); // Try fetching real-time data
}

function renderWorksList() {
  const list = document.getElementById('works-list');
  list.innerHTML = currentWorks.map((w, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteWork(${i})">삭제</button>
      <h2>앨범 #${currentWorks.length - i}</h2>
      
      <div style="display:flex; gap:32px; align-items:start; margin-bottom:20px;">
        <div style="width:140px;">
          <label style="display:block; margin-bottom:12px;">커버 이미지</label>
          <div style="width:140px; height:140px; background:#f0f4f8; border-radius:12px; overflow:hidden; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin-bottom:12px;">
            ${w.image ? `<img src="${w.image}" style="width:100%; height:100%; object-fit:cover;">` : `<span style="font-size:10px; color:var(--muted); font-family:var(--f-ui);">IMAGE EMPTY</span>`}
          </div>
          <input type="text" value="${w.image || ''}" placeholder="images/..." onchange="updateWork(${i}, 'image', this.value); renderWorksList();" style="font-size:11px; padding:10px;">
        </div>
        
        <div style="flex:1;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            <div class="form-group"><label>발매 연도</label><input type="text" value="${w.year}" onchange="updateWork(${i}, 'year', this.value)"></div>
            <div class="form-group"><label>장르</label><input type="text" value="${w.genre}" onchange="updateWork(${i}, 'genre', this.value)"></div>
          </div>
          <div class="form-group"><label>제목</label><input type="text" value="${w.title}" onchange="updateWork(${i}, 'title', this.value)"></div>
          <div class="form-group"><label>설명</label><textarea onchange="updateWork(${i}, 'desc', this.value)" rows="3">${w.desc}</textarea></div>
          <div class="form-group"><label>크레딧</label><input type="text" value="${w.credit}" onchange="updateWork(${i}, 'credit', this.value)"></div>
          <div class="form-group"><label>링크</label><input type="text" value="${w.link}" onchange="updateWork(${i}, 'link', this.value)"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderActivitiesList() {
  const list = document.getElementById('activities-list');
  list.innerHTML = currentActivities.map((a, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteActivity(${i})">삭제</button>
      <h2>활동 #${currentActivities.length - i}</h2>
      <div class="form-group"><label>기간 (Period)</label><input type="text" value="${a.period}" onchange="updateActivity(${i}, 'period', this.value)"></div>
      <div class="form-group"><label>활동명 (Name)</label><input type="text" value="${a.name}" onchange="updateActivity(${i}, 'name', this.value)"></div>
      <div class="form-group"><label>설명 (Description)</label><textarea onchange="updateActivity(${i}, 'desc', this.value)" rows="3">${a.desc}</textarea></div>
      <div class="form-group"><label>수상/기타 (Award/Note)</label><input type="text" value="${a.award || ''}" onchange="updateActivity(${i}, 'award', this.value)"></div>
    </div>
  `).join('');
}

function renderMenuList() {
  const list = document.getElementById('menu-list');
  list.innerHTML = currentMenus.map((m, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteMenu(${i})">삭제</button>
      <div class="form-group"><label>메뉴 이름</label><input type="text" value="${m.name}" onchange="updateMenu(${i}, 'name', this.value)"></div>
      
      <div class="form-group">
        <label>메뉴 설명 (Works처럼 상세 정보를 적어주세요)</label>
        <textarea onchange="updateMenu(${i}, 'desc', this.value)" placeholder="이 메뉴에 대한 설명을 입력하세요...">${m.desc || ''}</textarea>
      </div>

      <div class="form-group">
        <label>유형</label>
        <select onchange="toggleMenuType(${i}, this.value)">
          <option value="section" ${!m.url ? 'selected' : ''}>내부 섹션 이동</option>
          <option value="link" ${m.url ? 'selected' : ''}>외부 링크 연결</option>
        </select>
      </div>

      <div class="form-group" id="menu-target-group-${i}" style="display: ${m.url ? 'none' : 'block'}">
        <label>이동 섹션 ID (home, works, blog, about)</label>
        <input type="text" value="${m.target || ''}" onchange="updateMenu(${i}, 'target', this.value)">
      </div>

      <div class="form-group" id="menu-url-group-${i}" style="display: ${m.url ? 'block' : 'none'}">
        <label>외부 링크 URL (https://...)</label>
        <input type="text" value="${m.url || ''}" onchange="updateMenu(${i}, 'url', this.value)">
      </div>

      <div class="form-group">
        <label>활성화 상태</label>
        <select onchange="updateMenu(${i}, 'active', this.value === 'true')">
          <option value="true" ${m.active ? 'selected' : ''}>표시</option>
          <option value="false" ${!m.active ? 'selected' : ''}>숨김</option>
        </select>
      </div>
    </div>
  `).join('');
}

window.toggleMenuType = (i, type) => {
  if (type === 'section') {
    currentMenus[i].url = "";
    if (!currentMenus[i].target) currentMenus[i].target = "home";
  } else {
    currentMenus[i].target = "";
    if (!currentMenus[i].url) currentMenus[i].url = "https://";
  }
  renderMenuList();
};

// Global functions for UI
window.updateWork = (i, field, val) => currentWorks[i][field] = val;
window.deleteWork = (i) => { if(confirm('이 앨범을 삭제하시겠습니까?')) { currentWorks.splice(i, 1); renderWorksList(); } };
window.addWork = () => { currentWorks.unshift({ year: new Date().getFullYear().toString(), genre: "", title: "새 앨범", desc: "", credit: "", link: "", image: "" }); renderWorksList(); };

window.updateActivity = (i, field, val) => currentActivities[i][field] = val;
window.deleteActivity = (i) => { if(confirm('이 활동을 삭제하시겠습니까?')) { currentActivities.splice(i, 1); renderActivitiesList(); } };
window.addActivity = () => { currentActivities.unshift({ period: "2026", name: "새 활동", desc: "", award: "" }); renderActivitiesList(); };

window.updateMenu = (i, field, val) => currentMenus[i][field] = val;
window.deleteMenu = (i) => { if(confirm('이 메뉴 항목을 삭제하시겠습니까?')) { currentMenus.splice(i, 1); renderMenuList(); } };
window.addMenu = () => { currentMenus.push({ name: "새 메뉴", desc: "", target: "home", url: "", active: true }); renderMenuList(); };

const extractPlaylistId = (input) => {
  if (input.includes('list=')) {
    return input.split('list=')[1].split('&')[0];
  }
  return input.trim();
};

window.testYoutube = () => {
  const input = document.getElementById('hero-youtube').value;
  const id = extractPlaylistId(input);
  const msg = document.getElementById('yt-test-msg');
  
  if (!id) {
    msg.innerHTML = "ID를 입력해주세요.";
    return;
  }
  
  msg.innerHTML = `검증된 ID: <strong>${id}</strong> (저장 후 메인 페이지에서 확인 가능)`;
  msg.style.color = "var(--gold)";
};

window.saveHero = async () => {
  const ytInput = document.getElementById('hero-youtube').value;
  persistentHero = {
    eye: document.getElementById('hero-eye').value,
    title: document.getElementById('hero-title').value,
    slogan: {
      en: document.getElementById('hero-slogan-en').value,
      ko: document.getElementById('hero-slogan-ko').value
    },
    youtubePlaylistId: extractPlaylistId(ytInput)
  };
  localStorage.setItem('HERO_DATA', JSON.stringify(persistentHero));
  await saveToFirestore();
  alert('Hero 섹션이 서버에 저장되었습니다!');
};

window.saveRelease = async () => {
  persistentRelease = {
    title: document.getElementById('rel-title').value,
    desc: document.getElementById('rel-desc').value,
    link: document.getElementById('rel-link').value
  };
  localStorage.setItem('RELEASE_DATA', JSON.stringify(persistentRelease));
  await saveToFirestore();
  alert('최신 발매 섹션이 서버에 저장되었습니다!');
};

window.saveWorks = async () => {
  localStorage.setItem('WORKS_DATA', JSON.stringify(currentWorks));
  await saveToFirestore();
  alert('Works 데이터가 서버에 저장되었습니다!');
};

window.saveActivities = async () => {
  currentActivities.sort((a, b) => {
    const yearA = parseInt(a.period.match(/\d{4}/)?.[0] || 0);
    const yearB = parseInt(b.period.match(/\d{4}/)?.[0] || 0);
    return yearB - yearA;
  });
  localStorage.setItem('ACTIVITIES_DATA', JSON.stringify(currentActivities));
  await saveToFirestore();
  alert('활동 데이터가 서버에 저장되었습니다!');
  renderActivitiesList();
};

window.saveMenu = async () => {
  localStorage.setItem('NAV_DATA', JSON.stringify(currentMenus));
  await saveToFirestore();
  alert('메뉴가 서버에 저장되었습니다!');
};

window.saveAbout = async () => {
  persistentAbout = {
    verse: document.getElementById('about-verse').value,
    verseRef: document.getElementById('about-ref').value,
    body: document.getElementById('about-body').value.split('\n').filter(p => p.trim())
  };
  localStorage.setItem('ABOUT_DATA', JSON.stringify(persistentAbout));
  await saveToFirestore();
  alert('About 섹션이 서버에 저장되었습니다!');
};

document.addEventListener('DOMContentLoaded', init);
