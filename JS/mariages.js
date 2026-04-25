const cur=document.getElementById("cursor"),ring=document.getElementById("cursorRing");let rx=0,ry=0,cx=0,cy=0;window.matchMedia("(pointer: fine)").matches&&(document.addEventListener("mousemove",e=>{cx=e.clientX,cy=e.clientY,cur.style.left=cx+"px",cur.style.top=cy+"px"}),function e(){rx+=.12*(cx-rx),ry+=.12*(cy-ry),ring.style.left=rx+"px",ring.style.top=ry+"px",requestAnimationFrame(e)}());const obs=new IntersectionObserver(e=>{e.forEach((e,t)=>{e.isIntersecting&&(setTimeout(()=>e.target.classList.add("visible"),80*t),obs.unobserve(e.target))})},{threshold:.1});document.querySelectorAll(".reveal").forEach(e=>obs.observe(e));const burger=document.getElementById("burger"),nav=document.getElementById("navOverlay");burger.addEventListener("click",()=>{burger.classList.toggle("open"),nav.classList.toggle("open"),document.body.style.overflow=nav.classList.contains("open")?"hidden":""}),document.querySelectorAll(".nav-overlay-link").forEach(e=>{e.addEventListener("click",()=>{burger.classList.remove("open"),nav.classList.remove("open"),document.body.style.overflow=""})});const cta=document.getElementById("floatingCta"),contactSection=document.querySelector(".contact-cta");let contactVisible=!1;if(cta&&contactSection){function updateCta(){window.scrollY>400&&!contactVisible?(cta.style.opacity="1",cta.style.transform="translateY(0)",cta.style.pointerEvents="all"):(cta.style.opacity="0",cta.style.transform="translateY(12px)",cta.style.pointerEvents="none")}new IntersectionObserver(e=>{e.forEach(e=>{contactVisible=e.isIntersecting,updateCta()})},{threshold:0}).observe(contactSection),window.addEventListener("scroll",updateCta,{passive:true})}!function(){const e=document.getElementById("date"),t=document.getElementById("dateCal");if(!e||!t)return;const n=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],o=["Lu","Ma","Me","Je","Ve","Sa","Di"],a=new Date;a.setHours(0,0,0,0);let r=a.getFullYear(),c=a.getMonth(),l=null;function s(){const i=new Date(r,c,1),d=new Date(r,c+1,0);let m=i.getDay()-1;m<0&&(m=6);let u=`\n      <div class="cal-header">\n        <button class="cal-nav" id="calPrev" type="button">&#8249;</button>\n        <span class="cal-title">${n[c]} ${r}</span>\n        <button class="cal-nav" id="calNext" type="button">&#8250;</button>\n      </div>\n      <div class="cal-grid">\n        ${o.map(e=>`<div class="cal-dow">${e}</div>`).join("")}\n        ${Array(m).fill('<div class="cal-empty"></div>').join("")}\n    `;for(let e=1;e<=d.getDate();e++){const t=new Date(r,c,e).getTime();u+=`<div class="cal-day${t<a.getTime()?" past":""}${t===l?" selected":""}" data-ts="${t}">${e}</div>`}u+='</div><div style="height:.4rem;"></div>',t.innerHTML=u,document.getElementById("calPrev").addEventListener("click",e=>{e.stopPropagation(),c--,c<0&&(c=11,r--),s()}),document.getElementById("calNext").addEventListener("click",e=>{e.stopPropagation(),c++,c>11&&(c=0,r++),s()}),t.querySelectorAll(".cal-day:not(.past)").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation(),l=+o.dataset.ts;const r=new Date(l);e.value=`${r.getDate()} ${n[r.getMonth()]} ${r.getFullYear()}`,t.style.display="none"})})}e.addEventListener("click",e=>{e.stopPropagation(),"block"!==t.style.display?(t.style.display="block",s()):t.style.display="none"}),document.addEventListener("click",()=>{t.style.display="none"}),t.addEventListener("click",e=>e.stopPropagation())}(),document.getElementById("formSubmit").addEventListener("click",async function(){if(""!==document.getElementById("hpot").value)return;const e=localStorage.getItem("sc_last_submit_mariage");if(e&&Date.now()-Number(e)<6e4){const e=document.getElementById("formError");return e.style.display="block",void(e.textContent="Veuillez patienter 1 minute entre deux envois.")}const t=document.getElementById("prenom").value.trim(),n=document.getElementById("email").value.trim(),n2=document.getElementById("nom").value.trim(),d=document.getElementById("date").value.trim(),l=document.getElementById("lieu").value.trim();if(!t||!n){const e=document.getElementById("formError");return e.style.display="block",void(e.textContent="Merci de renseigner au minimum votre prénom et votre email.")}if(!n2||!d||!l){const e=document.getElementById("formError");return e.style.display="block",void(e.textContent="Merci de renseigner votre nom, la date et le lieu du mariage.")}const o=document.getElementById("formSubmit"),a=document.getElementById("submitLabel"),r=document.getElementById("submitArrow");o.disabled=!0,a.textContent="Envoi en cours...",r.textContent="⟳";try{const e=await fetch("/.netlify/functions/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({website:document.getElementById("hpot").value,form_type:"mariage",prenom:t,nom:document.getElementById("nom").value.trim(),prenom2:document.getElementById("prenom2").value.trim(),nom2:document.getElementById("nom2").value.trim(),email:n,date:document.getElementById("date").value.trim(),lieu:document.getElementById("lieu").value.trim(),formule:document.getElementById("formule").value,message:document.getElementById("message").value.trim()})}),o=await e.json();if(!e.ok||!o.ok)throw new Error(o.error||"Erreur inconnue");localStorage.setItem("sc_last_submit_mariage",Date.now()),document.getElementById("formSuccess").style.display="block",document.getElementById("formError").style.display="none",["prenom","nom","prenom2","nom2","email","date","lieu","formule","message"].forEach(function(id){var el=document.getElementById(id);if(el)el.value="";}),a.textContent="Demande envoyée",r.textContent="✓"}catch(e){console.error(e);const t=document.getElementById("formError");t.style.display="block",t.textContent=e.message||"Une erreur s'est produite. Réessayez ou contactez-moi directement.",o.disabled=!1,a.textContent="Envoyer ma demande",r.textContent="→"}});
// ─── Vidéo hero : autoplay fiable + pause hors viewport ──────────────────
(function initHeroVideos() {
  document.querySelectorAll('video[autoplay]').forEach(function(video) {
    var started = false;

    function tryPlay() {
      var p = video.play();
      if (p !== undefined) p.catch(function() {});
    }

    // 1. Démarrage immédiat, sans IO
    tryPlay();
    video.addEventListener('loadedmetadata', tryPlay, { once: true });
    video.addEventListener('canplay', tryPlay, { once: true });

    // 2. L'IO s'attache seulement après le premier play réussi
    video.addEventListener('playing', function() {
      if (started) return;
      started = true;
      new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            video.play().catch(function() {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 }).observe(video);
    });
  });
}());

// ─── Capitalisation automatique des champs (sauf email) ───────────────────
(function initAutoCapitalize() {
  function capWords(str) {
    return str.replace(/(^|\s)\S/g, function(c) { return c.toUpperCase(); });
  }
  function capFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }
  // Prénom / Nom → première lettre de chaque mot
  ["prenom","nom"].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function() { el.value = capWords(el.value); });
  });
  // Message → première lettre de la saisie
  var msg = document.getElementById("message");
  if (msg) msg.addEventListener("input", function() { msg.value = capFirst(msg.value); });
}());

// ─── Pré-sélection formule depuis les CTA formules ─────────────────────────
(function initFormulePreselect() {
  var select = document.getElementById('formule');
  if (!select) return;
  document.querySelectorAll('.btn-primary[data-formule]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      select.value = btn.dataset.formule; // "essentielle" ou "cinema"
    });
  });
}());
