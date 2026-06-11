const grid = document.getElementById('extensionGrid');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
let extensions = [];

function clean(v){ return (v ?? '').toString().trim(); }
function escapeHtml(str=''){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

async function loadExtensions(){
  try{
    const res = await fetch('extensions.json', {cache:'no-store'});
    if(!res.ok) throw new Error('Could not load extensions.json');
    extensions = await res.json();
  }catch(err){
    console.warn(err);
    extensions = [];
  }
  render();
}

function render(){
  const q = clean(searchInput.value).toLowerCase();
  const list = extensions.filter(ext => {
    const hay = [ext.name, ext.description, ext.category, ext.status, ext.version].map(clean).join(' ').toLowerCase();
    return !q || hay.includes(q);
  });
  emptyState.hidden = list.length > 0;
  grid.innerHTML = list.map(ext => `
    <article class="card">
      <div class="cardTop"><img src="${escapeHtml(ext.icon || 'assets/default-icon.svg')}" alt="${escapeHtml(ext.name)} icon" onerror="this.src='assets/default-icon.svg'"></div>
      <div class="cardBody">
        <h3>${escapeHtml(ext.name || 'Untitled Extension')}</h3>
        <p class="desc">${escapeHtml(ext.description || 'No description yet.')}</p>
        <div class="badges">
          ${ext.featured ? '<span class="badge good">Featured</span>' : ''}
          <span class="badge">${escapeHtml(ext.status || 'Unknown')}</span>
          <span class="badge">v${escapeHtml(ext.version || '0.0.0')}</span>
          <span class="badge">${escapeHtml(ext.category || 'Extension')}</span>
        </div>
        <div class="actions">
          <a href="${escapeHtml(ext.page || '#')}">Info Page</a>
          <a class="download" href="${escapeHtml(ext.download || '#')}">Download ZIP</a>
        </div>
      </div>
    </article>
  `).join('');
}

searchInput.addEventListener('input', render);
loadExtensions();
