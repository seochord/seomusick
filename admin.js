import { HERO_DATA, WORKS_DATA, BLOG_DATA, ABOUT_DATA, RELEASE_DATA } from './data.js';

let currentWorks = [...WORKS_DATA];
let currentBlogs = [...BLOG_DATA];

function init() {
  // Load Hero
  document.getElementById('hero-eye').value = HERO_DATA.eye;
  document.getElementById('hero-title').value = HERO_DATA.title;

  // Load Release
  document.getElementById('rel-title').value = RELEASE_DATA.title;
  document.getElementById('rel-desc').value = RELEASE_DATA.desc;
  document.getElementById('rel-link').value = RELEASE_DATA.link;

  // Load About
  document.getElementById('about-verse').value = ABOUT_DATA.verse;
  document.getElementById('about-ref').value = ABOUT_DATA.verseRef;
  document.getElementById('about-body').value = ABOUT_DATA.body.join('\n');

  renderWorksList();
  renderBlogList();
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

function renderBlogList() {
  const list = document.getElementById('blog-list');
  list.innerHTML = currentBlogs.map((b, i) => `
    <div class="item-card">
      <button class="btn-del" onclick="deleteBlog(${i})">Delete</button>
      <div class="form-group"><label>Tag</label><input type="text" value="${b.tag}" onchange="updateBlog(${i}, 'tag', this.value)"></div>
      <div class="form-group"><label>Title</label><input type="text" value="${b.title}" onchange="updateBlog(${i}, 'title', this.value)"></div>
      <div class="form-group"><label>Date</label><input type="text" value="${b.date}" onchange="updateBlog(${i}, 'date', this.value)"></div>
      <div class="form-group"><label>URL</label><input type="text" value="${b.url}" onchange="updateBlog(${i}, 'url', this.value)"></div>
    </div>
  `).join('');
}

// Global functions for UI
window.updateWork = (i, field, val) => currentWorks[i][field] = val;
window.deleteWork = (i) => { if(confirm('Delete this album?')) { currentWorks.splice(i, 1); renderWorksList(); } };
window.addWork = () => { currentWorks.unshift({ year: new Date().getFullYear().toString(), genre: "", title: "New Album", desc: "", credit: "", link: "" }); renderWorksList(); };

window.updateBlog = (i, field, val) => currentBlogs[i][field] = val;
window.deleteBlog = (i) => { if(confirm('Delete this post?')) { currentBlogs.splice(i, 1); renderBlogList(); } };
window.addBlog = () => { currentBlogs.unshift({ tag: "Life", title: "New Post", date: new Date().toLocaleDateString(), url: "" }); renderBlogList(); };

window.saveHero = () => {
  const data = {
    eye: document.getElementById('hero-eye').value,
    title: document.getElementById('hero-title').value
  };
  console.log('Saving Hero:', data);
  alert('Hero section saved locally (check console for data to update data.js)');
};

window.saveRelease = () => {
  const data = {
    title: document.getElementById('rel-title').value,
    desc: document.getElementById('rel-desc').value,
    link: document.getElementById('rel-link').value
  };
  console.log('Saving Release:', data);
  alert('Latest Release saved locally (check console for data to update data.js)');
};

window.saveWorks = () => {
  console.log('Saving Works:', currentWorks);
  alert('Works saved locally (check console for data to update data.js)');
};

window.saveBlog = () => {
  console.log('Saving Blog:', currentBlogs);
  alert('Blog saved locally (check console for data to update data.js)');
};

window.saveAbout = () => {
  const data = {
    verse: document.getElementById('about-verse').value,
    verseRef: document.getElementById('about-ref').value,
    body: document.getElementById('about-body').value.split('\n').filter(p => p.trim())
  };
  console.log('Saving About:', data);
  alert('About section saved locally (check console for data to update data.js)');
};

document.addEventListener('DOMContentLoaded', init);
