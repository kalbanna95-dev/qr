document.addEventListener('DOMContentLoaded', function(){
  const loginCard = document.querySelector('.card');
  const input = document.querySelector('#pw');
  const submit = document.querySelector('#submitBtn');
  const error = document.querySelector('.error');
  const protectedEl = document.querySelector('#protected');
  if(!protectedEl) return;

  const expected = protectedEl.dataset.password || '';
  const pageKey = 'protected_unlocked:' + (location.pathname || location.href);

  function reveal(){
    const src = protectedEl.dataset.src || '';
    const type = (protectedEl.dataset.type || 'img').toLowerCase();
    const alt = protectedEl.dataset.alt || '';

    // clear previous
    protectedEl.innerHTML = '';

    if(type === 'img'){
      const img = document.createElement('img');
      img.alt = alt;
      img.loading = 'lazy';
      img.src = src;
      protectedEl.appendChild(img);
    } else if(type === 'iframe'){
      const ifr = document.createElement('iframe');
      ifr.src = src;
      ifr.width = '100%';
      ifr.height = '480';
      ifr.frameBorder = '0';
      ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      ifr.allowFullscreen = true;
      protectedEl.appendChild(ifr);
    } else if(type === 'video'){
      const video = document.createElement('video');
      video.controls = true;
      video.src = src;
      video.style.maxWidth = '100%';
      protectedEl.appendChild(video);
    }

    if(loginCard) loginCard.style.display = 'none';
    protectedEl.style.display = 'block';
    try{ sessionStorage.setItem(pageKey,'1'); }catch(e){}
  }

  function fail(){
    if(!error) return;
    error.style.display = 'block';
    error.textContent = 'Incorrect password';
    if(loginCard){
      loginCard.classList.remove('shake');
      // trigger reflow
      void loginCard.offsetWidth;
      loginCard.classList.add('shake');
    }
  }

  function attempt(){
    if(!input) return;
    const val = input.value || '';
    if(val === expected){
      reveal();
    } else {
      fail();
    }
  }

  // auto-unlock if session remembered
  try{
    if(sessionStorage.getItem(pageKey) === '1') reveal();
  }catch(e){}

  if(submit) submit.addEventListener('click', attempt);
  if(input) input.addEventListener('keydown', function(e){ if(e.key === 'Enter') attempt(); });
});
