import { HERO_DATA, WORKS_DATA, ACTIVITIES_DATA, BLOG_DATA, ABOUT_DATA } from './data.js';

console.log('Main.js loaded with v1.1');

function renderHero() {
  const heroSection = document.querySelector('#page-home .hero');
  if (!heroSection) return;

  heroSection.innerHTML = `
    <p class="h-eye">${HERO_DATA.eye}</p>
    <h1 class="h-title">${HERO_DATA.title}</h1>
    <div class="h-brand">
      <p class="hb-en">${HERO_DATA.slogan.en}</p>
      <p class="hb-ko">${HERO_DATA.slogan.ko}</p>
    </div>
    <div class="h-cta">
      <span class="btn-p" onclick="go('about')">About</span>
      <span class="btn-s" onclick="go('works')">music</span>
      <span class="btn-s" onclick="go('blog')">Blog</span>
    </div>
  `;
}

function renderWorks() {
  const worksContainer = document.querySelector('#page-works .pi');
  if (!worksContainer) return;

  const worksHtml = WORKS_DATA.map(album => `
    <div class="album-item">
      <div>
        <div class="a-year">${album.year}</div>
        <span class="a-genre">${album.genre}</span>
      </div>
      <div>
        <h3 class="a-title">${album.title}</h3>
        <p class="a-desc">${album.desc}</p>
        <p class="a-credit">${album.credit}</p>
      </div>
      <a href="${album.link}" class="a-link" target="_blank">Listen →</a>
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

  console.log('Rendering About section with image path: images/about.jpeg');

  aboutContainer.innerHTML = `
    <div class="p-header">
      <p class="p-eye">서의승 · Seo Eui-seung</p>
      <h2 class="p-title">About</h2>
    </div>
    <div class="about-verse">
      <p class="v-text">${ABOUT_DATA.verse}</p>
      <p class="v-ref">${ABOUT_DATA.verseRef}</p>
    </div>
    <div class="about-image">
      <img src="./images/about.jpeg" alt="Seo Eui-seung" onerror="console.error('Image load failed: images/about.jpeg')">
    </div>
    <div class="about-body">
      ${ABOUT_DATA.body.map(p => `<p>${p}</p>`).join('')}
    </div>
    <div class="about-close">
      <p class="close-text">For Thy Pleasure.</p>
    </div>
  `;
}


// Navigation functions (exposed to window for onclick handlers)
window.go = function(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.s-nav a').forEach(a => a.classList.remove('active'));
  const targetPage = document.getElementById('page-' + page);
  const targetNav = document.getElementById('nav-' + page);
  if (targetPage) targetPage.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
  
  const mainEl = document.getElementById('main');
  if (mainEl) mainEl.scrollTo(0, 0);
  
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) sidebarEl.classList.remove('open');
};

window.toggleSide = function() {
  const sidebarEl = document.getElementById('sidebar');
  if (sidebarEl) sidebarEl.classList.toggle('open');
};

document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderWorks();
  renderBlog();
  renderAbout();

  const mainEl = document.getElementById('main');
  if (mainEl) {
    mainEl.addEventListener('click', () => {
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl) sidebarEl.classList.remove('open');
    });
  }

  // Hard refresh on Ctrl+5
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '5') {
      location.reload(true);
    }
  });
});
