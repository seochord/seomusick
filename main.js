import { HERO_DATA, WORKS_DATA, ACTIVITIES_DATA, NAV_DATA, ABOUT_DATA, SOCIAL_DATA, RELEASE_DATA } from './data.js';

console.log('Main.js loaded with v1.5 - Full Persistent Local Data');

// --- DATA INITIALIZATION (Prioritize LocalStorage) ---
const localNav = localStorage.getItem('NAV_DATA');
const localAbout = localStorage.getItem('ABOUT_DATA');
const localHero = localStorage.getItem('HERO_DATA');
const localRelease = localStorage.getItem('RELEASE_DATA');
const localWorks = localStorage.getItem('WORKS_DATA');

const finalNav = localNav ? JSON.parse(localNav) : NAV_DATA;
const finalAbout = localAbout ? JSON.parse(localAbout) : ABOUT_DATA;
const finalHero = localHero ? JSON.parse(localHero) : HERO_DATA;
const finalRelease = localRelease ? JSON.parse(localRelease) : RELEASE_DATA;
const finalWorks = localWorks ? JSON.parse(localWorks) : WORKS_DATA;

function renderNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  
  nav.innerHTML = finalNav.filter(n => n.active).map(n => `
    <li><a onclick="go('${n.target}')" id="nav-${n.target}">${n.name}</a></li>
  `).join('');
}

function renderSidebar() {
  const player = document.querySelector('.s-player');
  if (!player) return;

  player.innerHTML = `
    <span class="sp-label">Latest Release</span>
    <div class="sp-title">${finalRelease.title}</div>
    <div class="sp-desc">${finalRelease.desc}</div>
    <div class="sp-wave">
      <div class="wb"></div><div class="wb"></div><div class="wb"></div>
      <div class="wb"></div><div class="wb"></div><div class="wb"></div><div class="wb"></div>
    </div>
    <a href="${finalRelease.link}" class="sp-link" target="_blank">Listen →</a>
  `;
}

function renderHero() {
  const heroSection = document.querySelector('#page-home .hero');
  if (!heroSection) return;

  const ctaHtml = finalNav.filter(n => n.active && n.target !== 'home').map(n => `
    <span class="btn-${n.target === 'about' ? 'p' : 's'}" onclick="go('${n.target}')">${n.name}</span>
  `).join('');

  heroSection.innerHTML = `
    <p class="h-eye">${finalHero.eye}</p>
    <h1 class="h-title">${finalHero.title}</h1>
    <div class="h-brand">
      <p class="hb-en">${finalHero.slogan ? finalHero.slogan.en : ''}</p>
      <p class="hb-ko">${finalHero.slogan ? finalHero.slogan.ko : ''}</p>
    </div>
    
    <div class="h-cta">
      ${ctaHtml}
    </div>
  `;
}

function renderWorks() {
  const worksContainer = document.querySelector('#page-works .pi');
  if (!worksContainer) return;

  const worksHtml = finalWorks.map(album => `
    <div class="album-item" onclick="if('${album.link}') window.open('${album.link}', '_blank')">
      <div>
        <div class="a-year">${album.year}</div>
        <span class="a-genre">${album.genre}</span>
      </div>
      <div>
        <h3 class="a-title">${album.title}</h3>
        <p class="a-desc">${album.desc}</p>
        <p class="a-credit">${album.credit}</p>
      </div>
      <a href="${album.link}" class="a-link" target="_blank" onclick="event.stopPropagation()">Listen →</a>
    </div>
  `).join('');

  const activitiesHtml = ACTIVITIES_DATA.map(act => `
    <div class="act-item">
      <p class="act-period">${act.period}</p>
      <h4 class="act-name">${act.name}</h4>
      <p class="act-desc">${act.desc}</p>
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
      <p class="v-text">${finalAbout.verse}</p>
      <p class="v-ref">${finalAbout.verseRef}</p>
    </div>
    <div class="about-image">
      <img src="./images/about.jpeg" alt="Seo Eui-seung">
    </div>
    <div class="about-body">
      ${finalAbout.body.map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="about-close">
      <p class="close-text">For Thy Pleasure.</p>
    </div>
  `;
}

// --- Navigation with Browser History support ---
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
  renderNav();
  renderSidebar();
  renderHero();
  renderWorks();
  renderBlog();
  renderAbout();

  updateView();

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
