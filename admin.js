import { HERO_DATA, WORKS_DATA, NAV_DATA, ABOUT_DATA, RELEASE_DATA } from './data.js';

// --- DATA INITIALIZATION (Prioritize LocalStorage for session persistence) ---
const localNav = localStorage.getItem('NAV_DATA');
const localAbout = localStorage.getItem('ABOUT_DATA');

let currentWorks = [...WORKS_DATA];
let currentMenus = localNav ? JSON.parse(localNav) : [...NAV_DATA];
let persistentAbout = localAbout ? JSON.parse(localAbout) : { ...ABOUT_DATA };

function init() {
  // Load Hero
  document.getElementById('hero-eye').value = HERO_DATA.eye;
  document.getElementById('hero-title').value = HERO_DATA.title;

  // Load Release
  document.getElementById('rel-title').value = RELEASE_DATA.title;
  document.getElementById('rel-desc').value = RELEASE_DATA.desc;
  document.getElementById('rel-link').value = RELEASE_DATA.link;

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
      <button class="btn-del" onclick="deleteWork(${i})">Delete</button>
      <h2>Album #${currentWorks.length - i}</h2>
      <div class="form-group"><label>Year</label><input type="text" value="${w.year}" onchange="updateWork(${i}, 'year', this.value)"></div>
      <div class="form-group"><label>Genre</label><input type="text" value="${w.genre}" onchange="updateWork(${i}, 'genre', this.value)"></div>
      <div class="form-group"><label>Title</label><input type="text" value="${w.title}" onchange="updateWork(${i}, 'title', this.value)"></div>
      <div class="form-group"><label>Desc</label><textarea onchange="updateWork(${i}, 'desc', this.value)">${w.desc}</textarea></div>
      <div class="form-group"><label>Credit</label><input type="text" value="${w.credit}" onchange="updateWork(${i}, 'credit', this.value)"></div>
      <div class="form-group"><label>Link</label><input type="text" value="${w.link}" onchange="updateWork(${i}, 'link', this.value)"></div>
    </div>
  `).join('');
}

function renderMenuList() {
  const list = document.getElementById('menu-list');
  list.innerHTML = currentMenus.map((m, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteMenu(${i})">Delete</button>
      <div class="form-group"><label>Menu Name</label><input type="text" value="${m.name}" onchange="updateMenu(${i}, 'name', this.value)"></div>
      <div class="form-group"><label>Target Section ID (e.g., home, works, about)</label><input type="text" value="${m.target}" onchange="updateMenu(${i}, 'target', this.value)"></div>
      <div class="form-group">
        <label>Active</label>
        <select onchange="updateMenu(${i}, 'active', this.value === 'true')">
          <option value="true" ${m.active ? 'selected' : ''}>Active</option>
          <option value="false" ${!m.active ? 'selected' : ''}>Hidden</option>
        </select>
      </div>
    </div>
  `).join('');
}

// Global functions for UI
window.updateWork = (i, field, val) => currentWorks[i][field] = val;
window.deleteWork = (i) => { if(confirm('Delete this album?')) { currentWorks.splice(i, 1); renderWorksList(); } };
window.addWork = () => { currentWorks.unshift({ year: new Date().getFullYear().toString(), genre: "", title: "New Album", desc: "", credit: "", link: "" }); renderWorksList(); };

window.updateMenu = (i, field, val) => currentMenus[i][field] = val;
window.deleteMenu = (i) => { if(confirm('Delete this menu item?')) { currentMenus.splice(i, 1); renderMenuList(); } };
window.addMenu = () => { currentMenus.push({ name: "New Menu", target: "home", active: true }); renderMenuList(); };

window.saveHero = () => {
  const data = {
    eye: document.getElementById('hero-eye').value,
    title: document.getElementById('hero-title').value
  };
  console.log('Saving Hero:', data);
  alert('Hero section saved for preview (check console for data to update data.js)');
};

window.saveRelease = () => {
  const data = {
    title: document.getElementById('rel-title').value,
    desc: document.getElementById('rel-desc').value,
    link: document.getElementById('rel-link').value
  };
  console.log('Saving Release:', data);
  alert('Latest Release saved for preview (check console for data to update data.js)');
};

window.saveWorks = () => {
  console.log('Saving Works:', currentWorks);
  alert('Works saved for preview (check console for data to update data.js)');
};

window.saveMenu = () => {
  localStorage.setItem('NAV_DATA', JSON.stringify(currentMenus));
  console.log('Saving Menu:', currentMenus);
  alert('Menu saved for preview! Changes will appear on the main site. (To save permanently, copy the data from the console to data.js)');
};

window.saveAbout = () => {
  const data = {
    verse: document.getElementById('about-verse').value,
    verseRef: document.getElementById('about-ref').value,
    body: document.getElementById('about-body').value.split('\n').filter(p => p.trim())
  };
  localStorage.setItem('ABOUT_DATA', JSON.stringify(data));
  console.log('Saving About:', data);
  alert('About section saved for preview! Changes will appear on the main site. (To save permanently, copy the data from the console to data.js)');
};

document.addEventListener('DOMContentLoaded', init);
