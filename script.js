(function(){
  const loginBox = document.getElementById('loginBox');
  const content = document.getElementById('content');
  const unlockBtn = document.getElementById('unlockBtn');
  const input = document.getElementById('password');
  const error = document.getElementById('errorMsg');
  const protectedImg = document.getElementById('protectedImg');

  if(!content) return;
  const expected = content.dataset.password || '';
  const src = content.dataset.src || '';
  const type = (content.dataset.type || 'img').toLowerCase();
  const pageKey = 'unlocked:' + (location.pathname || location.href);

  function showError(msg){
    if(!error) return;
    error.textContent = msg;
    setTimeout(()=>{ if(error) error.textContent = ''; }, 3000);
    if(loginBox){ loginBox.classList.remove('shake'); void loginBox.offsetWidth; loginBox.classList.add('shake'); }
  }

  function createMedia(){
    // remove existing children
    const mediaWrap = content.querySelector('.media-wrap') || content;
    // clean previous media elements
    const existing = mediaWrap.querySelectorAll('img, iframe, video');
    existing.forEach(n=>n.remove());

    if(type === 'img'){
      const img = document.createElement('img');
      img.id = 'protectedImg';
      img.loading = 'lazy';
      img.alt = content.dataset.alt || 'Protected media';
      img.style.display = 'block';
      img.src = src;
      mediaWrap.appendChild(img);
    } else if(type === 'iframe'){
      const ifr = document.createElement('iframe');
      ifr.src = src;
      ifr.width = '100%';
      ifr.height = content.dataset.height || '480';
      ifr.frameBorder = '0';
      ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      ifr.allowFullscreen = true;
      mediaWrap.appendChild(ifr);
    } else if(type === 'video'){
      const video = document.createElement('video');
      video.controls = true;
      video.src = src;
      video.style.maxWidth = '100%';
      mediaWrap.appendChild(video);
    }
  }

  function unlock(){
    createMedia();
    content.classList.remove('hidden');
    content.setAttribute('aria-hidden','false');
    if(loginBox) loginBox.classList.add('hidden');
    try{ sessionStorage.setItem(pageKey,'1'); }catch(e){}
  }

  // auto-unlock if session exists
  try{ if(sessionStorage.getItem(pageKey) === '1') unlock(); }catch(e){}

  function attempt(){
    const val = input ? input.value : '';
    if(val === expected){ unlock(); }
    else { showError('❌ الباسورد غلط — حاول مرة ثانية.'); }
  }

  if(unlockBtn) unlockBtn.addEventListener('click', attempt);
  if(input) input.addEventListener('keydown', function(e){ if(e.key === 'Enter') attempt(); });
})();
