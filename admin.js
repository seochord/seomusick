import { HERO_DATA, WORKS_DATA, NAV_DATA, ABOUT_DATA, RELEASE_DATA } from './data.js';

// --- DATA INITIALIZATION (Prioritize LocalStorage for session persistence) ---
const localNav = localStorage.getItem('NAV_DATA');
const localAbout = localStorage.getItem('ABOUT_DATA');
const localHero = localStorage.getItem('HERO_DATA');
const localRelease = localStorage.getItem('RELEASE_DATA');
const localWorks = localStorage.getItem('WORKS_DATA');

let currentWorks = localWorks ? JSON.parse(localWorks) : [...WORKS_DATA];
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

function init() {
  checkAuth();

  // Load Hero
  document.getElementById('hero-eye').value = persistentHero.eye;
  document.getElementById('hero-title').value = persistentHero.title;
  document.getElementById('hero-slogan-en').value = persistentHero.slogan ? persistentHero.slogan.en : '';
  document.getElementById('hero-slogan-ko').value = persistentHero.slogan ? persistentHero.slogan.ko : '';

  // Load Release
  document.getElementById('rel-title').value = persistentRelease.title;
  document.getElementById('rel-desc').value = persistentRelease.desc;
  document.getElementById('rel-link').value = persistentRelease.link;

  // Load About
  document.getElementById('about-verse').value = persistentAbout.verse;
  document.getElementById('about-ref').value = persistentAbout.verseRef;
  document.getElementById('about-body').value = persistentAbout.body.join('\n');

  renderWorksList();
  renderMenuList();
}

function renderWorksList() {
  const list = document.getElementById('works-list');
  list.innerHTML = currentWorks.map((w, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteWork(${i})">삭제</button>
      <h2>앨범 #${currentWorks.length - i}</h2>
      <div class="form-group"><label>발매 연도</label><input type="text" value="${w.year}" onchange="updateWork(${i}, 'year', this.value)"></div>
      <div class="form-group"><label>장르</label><input type="text" value="${w.genre}" onchange="updateWork(${i}, 'genre', this.value)"></div>
      <div class="form-group"><label>제목</label><input type="text" value="${w.title}" onchange="updateWork(${i}, 'title', this.value)"></div>
      <div class="form-group"><label>설명</label><textarea onchange="updateWork(${i}, 'desc', this.value)">${w.desc}</textarea></div>
      <div class="form-group"><label>크레딧</label><input type="text" value="${w.credit}" onchange="updateWork(${i}, 'credit', this.value)"></div>
      <div class="form-group"><label>링크</label><input type="text" value="${w.link}" onchange="updateWork(${i}, 'link', this.value)"></div>
    </div>
  `).join('');
}

function renderMenuList() {
  const list = document.getElementById('menu-list');
  list.innerHTML = currentMenus.map((m, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteMenu(${i})">삭제</button>
      <div class="form-group"><label>메뉴 이름</label><input type="text" value="${m.name}" onchange="updateMenu(${i}, 'name', this.value)"></div>
      <div class="form-group"><label>이동 섹션 ID (예: home, works, blog, about)</label><input type="text" value="${m.target}" onchange="updateMenu(${i}, 'target', this.value)"></div>
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

// Global functions for UI
window.updateWork = (i, field, val) => currentWorks[i][field] = val;
window.deleteWork = (i) => { if(confirm('이 앨범을 삭제하시겠습니까?')) { currentWorks.splice(i, 1); renderWorksList(); } };
window.addWork = () => { currentWorks.unshift({ year: new Date().getFullYear().toString(), genre: "", title: "새 앨범", desc: "", credit: "", link: "" }); renderWorksList(); };

window.updateMenu = (i, field, val) => currentMenus[i][field] = val;
window.deleteMenu = (i) => { if(confirm('이 메뉴 항목을 삭제하시겠습니까?')) { currentMenus.splice(i, 1); renderMenuList(); } };
window.addMenu = () => { currentMenus.push({ name: "새 메뉴", target: "home", active: true }); renderMenuList(); };

window.saveHero = () => {
  const data = {
    eye: document.getElementById('hero-eye').value,
    title: document.getElementById('hero-title').value,
    slogan: {
      en: document.getElementById('hero-slogan-en').value,
      ko: document.getElementById('hero-slogan-ko').value
    }
  };
  localStorage.setItem('HERO_DATA', JSON.stringify(data));
  console.log('Hero 데이터:', data);
  alert('Hero 섹션이 미리보기에 저장되었습니다! 메인 사이트에서 확인 가능합니다.');
};

window.saveRelease = () => {
  const data = {
    title: document.getElementById('rel-title').value,
    desc: document.getElementById('rel-desc').value,
    link: document.getElementById('rel-link').value
  };
  localStorage.setItem('RELEASE_DATA', JSON.stringify(data));
  console.log('최신 발매 데이터:', data);
  alert('최신 발매 섹션이 미리보기에 저장되었습니다! 메인 사이트에서 확인 가능합니다.');
};

window.saveWorks = () => {
  localStorage.setItem('WORKS_DATA', JSON.stringify(currentWorks));
  console.log('Works 데이터:', currentWorks);
  alert('Works 데이터가 미리보기에 저장되었습니다! 메인 사이트에서 확인 가능합니다.');
};

window.saveMenu = () => {
  localStorage.setItem('NAV_DATA', JSON.stringify(currentMenus));
  console.log('메뉴 데이터:', currentMenus);
  alert('메뉴가 미리보기에 저장되었습니다! 메인 사이트에서 변경 사항을 확인할 수 있습니다.');
};

window.saveAbout = () => {
  const data = {
    verse: document.getElementById('about-verse').value,
    verseRef: document.getElementById('about-ref').value,
    body: document.getElementById('about-body').value.split('\n').filter(p => p.trim())
  };
  localStorage.setItem('ABOUT_DATA', JSON.stringify(data));
  console.log('About 데이터:', data);
  alert('About 섹션이 미리보기에 저장되었습니다! 메인 사이트에서 변경 사항을 확인할 수 있습니다.');
};

document.addEventListener('DOMContentLoaded', init);
