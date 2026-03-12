import { HERO_DATA, WORKS_DATA, ACTIVITIES_DATA, NAV_DATA, ABOUT_DATA, SOCIAL_DATA, RELEASE_DATA } from './data.js';
import { firebaseConfig } from './firebase-config.js';

console.log('Main.js loaded with v2.4 - Secured YouTube API via Cloud Functions');

// --- FIREBASE INITIALIZATION ---
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const functions = firebase.functions();

// --- DATA INITIALIZATION (Prioritize Firestore, then LocalStorage, then data.js) ---
let finalNav = NAV_DATA;
let finalAbout = ABOUT_DATA;
let finalHero = HERO_DATA;
let finalRelease = RELEASE_DATA;
let finalWorks = WORKS_DATA;
let finalActivities = ACTIVITIES_DATA;

async function fetchInitialData() {
  try {
    const doc = await db.collection('settings').doc('site_data').get();
    if (doc.exists) {
      const data = doc.data();
      if (data.NAV_DATA) finalNav = data.NAV_DATA;
      if (data.ABOUT_DATA) finalAbout = data.ABOUT_DATA;
      if (data.HERO_DATA) finalHero = data.HERO_DATA;
      if (data.RELEASE_DATA) finalRelease = data.RELEASE_DATA;
      if (data.WORKS_DATA) finalWorks = data.WORKS_DATA;
      if (data.ACTIVITIES_DATA) finalActivities = data.ACTIVITIES_DATA;
      
      console.log("서버 데이터 로드 완료");
    } else {
      // Use local storage fallback if server is empty
      const localNav = localStorage.getItem('NAV_DATA');
      const localAbout = localStorage.getItem('ABOUT_DATA');
      const localHero = localStorage.getItem('HERO_DATA');
      const localRelease = localStorage.getItem('RELEASE_DATA');
      const localWorks = localStorage.getItem('WORKS_DATA');
      const localActivities = localStorage.getItem('ACTIVITIES_DATA');

      if (localNav) finalNav = JSON.parse(localNav);
      if (localAbout) finalAbout = JSON.parse(localAbout);
      if (localHero) finalHero = JSON.parse(localHero);
      if (localRelease) finalRelease = JSON.parse(localRelease);
      if (localWorks) finalWorks = JSON.parse(localWorks);
      if (localActivities) finalActivities = JSON.parse(localActivities);
    }
  } catch (err) {
    console.error("Firestore 로드 실패, 기본 데이터를 사용합니다:", err);
  } finally {
    renderAll();
  }
}

function renderAll() {
  renderNav();
  renderSidebar();
  renderHero();
  renderWorks();
  renderBlog();
  renderAbout();
  updateView();
}

function renderNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  
  if (!finalNav || !Array.isArray(finalNav) || finalNav.length === 0) {
    console.warn("NAV_DATA is invalid, using default.");
    finalNav = NAV_DATA;
  }

  nav.innerHTML = finalNav.filter(n => n && n.active).map(n => {
    if (n.url) {
      return `<li><a href="${n.url}" target="_blank" id="nav-ext-${n.name}">${n.name}</a></li>`;
    }
    return `<li><a onclick="go('${n.target}')" id="nav-${n.target}">${n.name}</a></li>`;
  }).join('');
}

function renderSidebar() {
  const player = document.querySelector('.s-player');
  if (!player) return;

  player.innerHTML = `
    <span class="sp-label">Latest Release</span>
    <div class="sp-title">${finalRelease.title || 'Loading...'}</div>
    <div class="sp-desc">${finalRelease.desc || ''}</div>
    <div class="sp-wave">
      <div class="wb"></div><div class="wb"></div><div class="wb"></div>
      <div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div>
    </div>
    <a href="${finalRelease.link || '#'}" class="sp-link" target="_blank">Listen →</a>
  `;
}

function renderHero() {
  const heroSection = document.querySelector('#page-home .hero');
  if (!heroSection) return;

  const ctaHtml = (finalNav || []).filter(n => n && n.active && n.target !== 'home').map(n => {
    const descHtml = n.desc ? `<p class="cta-desc">${n.desc}</p>` : '';
    const btnClass = n.target === 'about' ? 'btn-p' : 'btn-s';
    
    if (n.url) {
      return `
        <div class="cta-item">
          <a href="${n.url}" target="_blank" class="btn-s" style="text-decoration:none;">${n.name}</a>
          ${descHtml}
        </div>`;
    }
    return `
      <div class="cta-item">
        <span class="${btnClass}" onclick="go('${n.target}')">${n.name}</span>
        ${descHtml}
      </div>`;
  }).join('');

  const videoHtml = `
    <div class="h-video-wrap">
      <div id="yt-player" class="h-video-player"></div>
    </div>
  `;

  // We intentionally omit hero title, h-eye (eye catch), and youtube info labels as requested by the user.
  heroSection.innerHTML = `
    <div class="h-brand">
      <p class="hb-en">${finalHero.slogan ? finalHero.slogan.en : ''}</p>
      <p class="hb-ko">${finalHero.slogan ? finalHero.slogan.ko : ''}</p>
    </div>
    ${videoHtml}
    <div class="h-cta">
      ${ctaHtml}
    </div>
  `;

  if (finalHero.youtubePlaylistId) {
    loadLatestVideo(finalHero.youtubePlaylistId);
  }
}

async function loadLatestVideo(playlistLink) {
  let playlistId = playlistLink;
  if (playlistLink.includes('list=')) {
    playlistId = playlistLink.split('list=')[1].split('&')[0];
  }

  const playerEl = document.getElementById('yt-player');

  const fallbackEmbed = () => {
    if (playerEl) {
      playerEl.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=${playlistId}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
    }
  };

  try {
    // SECURITY FIX: Calling Firebase Cloud Function instead of direct YouTube API with a key
    const getLatestVideo = functions.httpsCallable('getLatestVideo');
    const result = await getLatestVideo({ playlistId: playlistId });
    
    if (result.data && result.data.videoId) {
      if (playerEl) {
        playerEl.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${result.data.videoId}?autoplay=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        `;
      }
    } else {
      fallbackEmbed();
    }
  } catch (err) {
    console.warn("Cloud Function 호출 실패 (아직 배포 전일 수 있습니다), 기본 임베드를 사용합니다:", err);
    fallbackEmbed();
  }
}

function renderWorks() {
  const worksContainer = document.querySelector('#page-works .pi');
  if (!worksContainer) return;

  const worksHtml = (finalWorks || []).map(album => `
    <div class="album-item" onclick="if('${album.link}') window.open('${album.link}', '_blank')">
      <div class="a-img">
        ${album.image ? `<img src="${album.image}" alt="${album.title}">` : '<div style="width:100%;height:100%;background:rgba(51,92,129,0.05);display:flex;align-items:center;justify-content:center;font-size:10px;color:rgba(51,92,129,0.2);font-family:var(--f-ui);">NO IMAGE</div>'}
      </div>
      <div>
        <div class="a-year">${album.year || ''}</div>
        <span class="a-genre">${album.genre || ''}</span>
      </div>
      <div>
        <h3 class="a-title">${album.title || 'Untitled'}</h3>
        <p class="a-desc">${album.desc || ''}</p>
        <p class="a-credit">${album.credit || ''}</p>
      </div>
    </div>
  `).join('');

  const sortedActivities = [...(finalActivities || [])].sort((a, b) => {
    const yearA = parseInt(a.period?.match(/\d{4}/)?.[0] || 0);
    const yearB = parseInt(b.period?.match(/\d{4}/)?.[0] || 0);
    return yearB - yearA;
  });

  const activitiesHtml = sortedActivities.map(act => `
    <div class="act-item">
      <p class="act-period">${act.period || ''}</p>
      <h4 class="act-name">${act.name || ''}</h4>
      <p class="act-desc">${act.desc || ''}</p>
      ${act.award ? `<span class="act-award">${act.award}</span>` : ''}
    </div>
  `).join('');

  worksContainer.innerHTML = `
    <div class="p-header">
      <p class="p-eye">Discography & Activities</p>
      <h2 class="p-title">Works</h2>
    </div>
    ${worksHtml}
    <div class="sub-h"><h3>Activities</h3></div>
    <div class="act-grid">
      ${activitiesHtml}
    </div>
  `;
}

function renderBlog() {
  const blogContainer = document.querySelector('#page-blog .pi');
  if (!blogContainer) return;

  blogContainer.innerHTML = `
    <div class="p-header">
      <p class="p-eye">Music · Faith · Life</p>
      <h2 class="p-title">Blog</h2>
    </div>
    <div class="blog-frame-container">
      <iframe src="https://seomusick.tistory.com/" class="blog-frame"></iframe>
    </div>
  `;
}

function renderAbout() {
  const aboutContainer = document.querySelector('#page-about .pi');
  if (!aboutContainer) return;

  aboutContainer.innerHTML = `
    <div class="p-header">
      <p class="p-eye">서의승 · Seo Euy-seung</p>
      <h2 class="p-title">About</h2>
    </div>
    <div class="about-verse">
      <p class="v-text">${finalAbout.verse || ''}</p>
      <p class="v-ref">${finalAbout.verseRef || ''}</p>
    </div>
    <div class="about-image">
      <img src="./images/about.jpeg" alt="Seo Eui-seung">
    </div>
    <div class="about-body">
      ${(finalAbout.body || []).map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="about-close">
      <p class="close-text">For Thy Pleasure.</p>
    </div>
  `;
}

window.go = function(page) {
  window.location.hash = page;
};

function updateView() {
  const hash = window.location.hash.replace('#', '') || 'home';
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.s-nav a').forEach(a => a.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + hash);
  const targetNav = document.getElementById('nav-' + hash);
  
  if (targetPage) targetPage.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
  
  const mainEl = document.getElementById('main');
  if (mainEl) mainEl.scrollTo(0, 0);
  
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) sidebarEl.classList.remove('open');
}

window.toggleSide = function() {
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) sidebarEl.classList.toggle('open');
};

document.addEventListener('DOMContentLoaded', () => {
  fetchInitialData();

  window.addEventListener('hashchange', updateView);

  const mainEl = document.getElementById('main');
  if (mainEl) {
    mainEl.addEventListener('click', () => {
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl) sidebarEl.classList.remove('open');
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '5') {
      location.reload(true);
    }
  });
});
