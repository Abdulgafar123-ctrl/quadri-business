/* Glimpaxe Momento enhancement layer — original interactions remain supported. */
(function(){
  const menu=document.querySelector('.menu'), links=document.querySelector('.links');
  if(menu && links){menu.addEventListener('click',()=>links.classList.toggle('open'));links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')))}

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  const config=window.GLIMPAXE_CONFIG||{};
  const apiBase=(config.API_BASE_URL||'').replace(/\/$/,'');
  const api=(path)=>apiBase+path;
  const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  async function getJSON(path){
    const response=await fetch(api(path),{headers:{Accept:'application/json'}});
    const text=await response.text();
    if(!text.trim()) throw new Error('Empty API response');
    let data; try{data=JSON.parse(text)}catch(e){throw new Error('Invalid JSON response')}
    if(!response.ok || data.success===false) throw new Error(data.message||'Request failed');
    return data;
  }

  function productCard(p){
    const image=p.image||'assets/img1.jpg';
    return `<article class="product"><img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" loading="lazy"><div><span class="eyebrow">${escapeHtml(p.category||'Glimpaxe Collection')}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||'Customized around your occasion, style and requirements.')}</p>${p.price?`<p><strong>${escapeHtml(p.price)}</strong></p>`:''}<a class="text" href="contact.html">Enquire on WhatsApp →</a></div></article>`;
  }

  async function loadLiveProducts(){
    const targets=document.querySelectorAll('#live-products'); if(!targets.length)return;
    try{const data=await getJSON('/api/public/products');const products=(data.products||[]).slice(0,9);targets.forEach(target=>{target.innerHTML=products.length?products.map(productCard).join(''):`<div class="loading-card">Your latest products will appear here when the admin catalogue is connected.</div>`})}
    catch(e){targets.forEach(target=>target.innerHTML='<div class="loading-card">Browse the collection above or contact us for the latest product options.</div>')}
  }
  loadLiveProducts();

  // Quote form: attempts admin API first; always falls back to WhatsApp so customers are never blocked.
  const form=document.querySelector('#quote');
  if(form){form.addEventListener('submit',async e=>{
    e.preventDefault();
    const button=form.querySelector('button[type=submit]'); const original=button?button.textContent:''; if(button){button.disabled=true;button.textContent='Sending enquiry…'}
    const d=new FormData(form); const payload={name:d.get('name'),phone:d.get('phone'),event:d.get('event'),quantity:d.get('quantity'),budget:d.get('budget'),requirements:d.get('details')};
    try{await getJSON('/api/enquiries');}catch(_){}
    try{if(apiBase) await fetch(api('/api/enquiries'),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});}catch(_){}
    const text=`Hello Glimpaxe Momento, I want a quote.%0AName: ${encodeURIComponent(payload.name||'')}%0AWhatsApp: ${encodeURIComponent(payload.phone||'')}%0AEvent: ${encodeURIComponent(payload.event||'')}%0AQuantity: ${encodeURIComponent(payload.quantity||'')}%0ABudget: ${encodeURIComponent(payload.budget||'')}%0ADetails: ${encodeURIComponent(payload.requirements||'')}`;
    window.location.href='https://wa.me/2348135200799?text='+text;
    if(button){button.disabled=false;button.textContent=original}
  })}
})();
