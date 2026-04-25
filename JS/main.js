const cur=document.getElementById("cursor"),ring=document.getElementById("cursorRing");let rx=0,ry=0,cx=0,cy=0;window.matchMedia("(pointer: fine)").matches&&(document.addEventListener("mousemove",e=>{cx=e.clientX,cy=e.clientY,cur.style.left=cx+"px",cur.style.top=cy+"px"}),function e(){rx+=.12*(cx-rx),ry+=.12*(cy-ry),ring.style.left=rx+"px",ring.style.top=ry+"px",requestAnimationFrame(e)}());const obs=new IntersectionObserver(e=>{e.forEach((e,t)=>{e.isIntersecting&&(setTimeout(()=>e.target.classList.add("visible"),80*t),obs.unobserve(e.target))})},{threshold:.1});document.querySelectorAll(".reveal").forEach(e=>obs.observe(e));const burger=document.getElementById("burger"),nav=document.getElementById("navOverlay");burger.addEventListener("click",()=>{burger.classList.toggle("open"),nav.classList.toggle("open"),document.body.style.overflow=nav.classList.contains("open")?"hidden":""}),document.querySelectorAll(".nav-overlay-link").forEach(e=>{e.addEventListener("click",()=>{burger.classList.remove("open"),nav.classList.remove("open"),document.body.style.overflow=""})}),document.querySelectorAll(".accordion-trigger").forEach(e=>{e.addEventListener("click",()=>{const t=e.closest(".accordion-item"),n=t.classList.contains("active");document.querySelectorAll(".accordion-item").forEach(e=>e.classList.remove("active")),n||t.classList.add("active")})});const cta=document.getElementById("floatingCta"),contactSection=document.querySelector(".contact");let contactVisible=!1;const contactObs=new IntersectionObserver(e=>{e.forEach(e=>{contactVisible=e.isIntersecting,updateCta()})},{threshold:0});function updateCta(){window.scrollY>400&&!contactVisible?(cta.style.opacity="1",cta.style.transform="translateY(0)",cta.style.pointerEvents="all"):(cta.style.opacity="0",cta.style.transform="translateY(12px)",cta.style.pointerEvents="none")}contactObs.observe(contactSection),window.addEventListener("scroll",updateCta,{passive:true});const TESTIMONIALS=[{quote:"Ponctuel, à l'écoute, sensible et rigoureux. C'est un plaisir de travailler avec lui, car il est passionné !",name:"LOUISE SOULIÉ",role:"Compagnie l'Êttre-Louve · Captation de performance"},{quote:"Merci infiniment pour ton implication, ta rapidité, et toutes tes idées. C'est génial pour moi d'avoir quelqu'un comme toi dans mon entourage pour tous ces projets.",name:"TOM D.",role:"Seven et Tom"},{quote:"Vous avez montré avec tellement de finesse tout ce que nous essayons de transmettre par la musique. L'image, le son, les transitions, la qualité.. tout est vraiment très professionnel. Merci du fond du cœur !",name:"VITOL LIUBOV",role:"L'Éloge du Silence · Concert franco-ukrainien"},{quote:"Maxence a fait preuve d'une très bonne communication qui a fluidifié nos échanges. Il a su être force de proposition pour les idées concernant la direction artistique et s'adapter aux besoins du film malgré tous les aléas rencontrés. Merci beaucoup !",name:"MANON DA COSTA MALLET",role:"Réalisatrice · 17H35"}],tQuote=document.getElementById("testimonialQuote"),tName=document.getElementById("testimonialName"),tRole=document.getElementById("testimonialRole"),tNum=document.getElementById("testimonialNum"),tDots=document.getElementById("testimonialDots");
if(tQuote&&tDots){
  let timer,current=0;
  function pad(n){return n<10?"0"+(n+1):""+( n+1);}
  function goTo(idx){
    [tQuote,tName,tRole,tNum].forEach(function(el){el.style.opacity="0";});
    setTimeout(function(){
      current=idx;
      var t=TESTIMONIALS[current];
      tQuote.textContent=t.quote;
      tName.textContent=t.name;
      tRole.textContent=t.role;
      tNum.textContent=(current+1)<10?"0"+(current+1):""+(current+1);
      [tQuote,tName,tRole,tNum].forEach(function(el){el.style.opacity="1";});
      tDots.querySelectorAll(".testimonial-dot").forEach(function(d,i){d.classList.toggle("active",i===current);});
    },350);
  }
  function resetTimer(){clearInterval(timer);timer=setInterval(function(){goTo((current+1)%TESTIMONIALS.length);},6000);}
  [tQuote,tName,tRole,tNum].forEach(function(el){el.style.transition="opacity .35s ease";});
  TESTIMONIALS.forEach(function(t,i){
    var d=document.createElement("button");
    d.className="testimonial-dot"+(i===0?" active":"");
    d.setAttribute("aria-label","Témoignage "+(i+1));
    d.addEventListener("click",function(){goTo(i);resetTimer();});
    tDots.appendChild(d);
  });
  var prev=document.getElementById("tPrev"),next=document.getElementById("tNext");
  if(prev)prev.addEventListener("click",function(){goTo((current-1+TESTIMONIALS.length)%TESTIMONIALS.length);resetTimer();});
  if(next)next.addEventListener("click",function(){goTo((current+1)%TESTIMONIALS.length);resetTimer();});
  resetTimer();
  var tSection=document.querySelector(".testimonial");
  var touchX=0;
  if(tSection){
    tSection.addEventListener("touchstart",function(e){touchX=e.touches[0].clientX;},{passive:true});
    tSection.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>40){goTo(dx<0?(current+1)%TESTIMONIALS.length:(current-1+TESTIMONIALS.length)%TESTIMONIALS.length);resetTimer();}},{passive:true});
  }
}
!function(){const e=document.getElementById("date_tournage"),t=document.getElementById("dateTournageCal");if(!e||!t)return;const n=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],o=["Lu","Ma","Me","Je","Ve","Sa","Di"],a=new Date;a.setHours(0,0,0,0);let s=a.getFullYear(),c=a.getMonth(),r=null;function l(){const i=new Date(s,c,1),d=new Date(s,c+1,0);let u=i.getDay()-1;u<0&&(u=6);let m=`\n      <div class="cal-header">\n        <button class="cal-nav" id="calTournagePrev" type="button">&#8249;</button>\n        <span class="cal-title">${n[c]} ${s}</span>\n        <button class="cal-nav" id="calTournageNext" type="button">&#8250;</button>\n      </div>\n      <div class="cal-grid">\n        ${o.map(e=>`<div class="cal-dow">${e}</div>`).join("")}\n        ${Array(u).fill("<div></div>").join("")}\n    `;for(let e=1;e<=d.getDate();e++){const t=new Date(s,c,e).getTime();m+=`<div class="cal-day${t<a.getTime()?" past":""}${t===r?" selected":""}" data-ts="${t}">${e}</div>`}m+='</div><div style="height:.4rem;"></div>',t.innerHTML=m,document.getElementById("calTournagePrev").addEventListener("click",e=>{e.stopPropagation(),c--,c<0&&(c=11,s--),l()}),document.getElementById("calTournageNext").addEventListener("click",e=>{e.stopPropagation(),c++,c>11&&(c=0,s++),l()}),t.querySelectorAll(".cal-day:not(.past)").forEach(o=>{o.addEventListener("click",a=>{a.stopPropagation(),r=+o.dataset.ts;const s=new Date(r);e.value=`${s.getDate()} ${n[s.getMonth()]} ${s.getFullYear()}`,t.style.display="none"})})}e.addEventListener("click",e=>{e.stopPropagation(),"block"!==t.style.display?(t.style.display="block",l()):t.style.display="none"}),document.addEventListener("click",()=>{t.style.display="none"}),t.addEventListener("click",e=>e.stopPropagation())}(),document.getElementById("formSubmit").addEventListener("click",async function(){if(""!==document.getElementById("hpot").value)return;const e=localStorage.getItem("sc_last_submit");if(e&&Date.now()-Number(e)<6e4){const e=document.getElementById("formError");return e.style.display="block",void(e.textContent="Veuillez patienter 1 minute entre deux envois.")}const t=document.getElementById("prenom").value.trim(),n=document.getElementById("nom").value.trim(),o=document.getElementById("email").value.trim(),a=document.getElementById("projet").value,s=document.getElementById("date_tournage").value.trim(),c=document.getElementById("budget").value,r=document.getElementById("message").value.trim();if(!(t&&n&&o&&a)){const e=document.getElementById("formError");return e.style.display="block",void(e.textContent="Merci de remplir les champs obligatoires (prénom, nom, email, type de projet).")}const l=document.getElementById("formSubmit"),i=document.getElementById("submitLabel"),d=document.getElementById("submitArrow");l.disabled=!0,i.textContent="Envoi en cours...",d.textContent="⟳";try{const e=await fetch("/.netlify/functions/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({website:document.getElementById("hpot").value,form_type:"contact",prenom:t,nom:n,email:o,projet:a,date_tournage:s||"Non précisée",budget:c||"Non précisé",message:r||"Aucune description."})}),l=await e.json();if(!e.ok||!l.ok)throw new Error(l.error||"Erreur inconnue");localStorage.setItem("sc_last_submit",Date.now()),document.getElementById("formSuccess").style.display="block",document.getElementById("formError").style.display="none",["prenom","nom","email","projet","date_tournage","budget","message"].forEach(function(id){var el=document.getElementById(id);if(el)el.value="";}),i.textContent="Message envoyé",d.textContent="✓"}catch(e){console.error(e);const t=document.getElementById("formError");t.style.display="block",t.textContent=e.message||"Une erreur s'est produite. Réessayez ou contactez-moi directement.",l.disabled=!1,i.textContent="Envoyer le message",d.textContent="→"}});

// ─── Fallback images (remplace onerror inline, compatible CSP) ─────────────
(function initImageFallbacks() {
  // Miniatures YouTube : maxresdefault → hqdefault si 404
  document.querySelectorAll('img[data-fallback]').forEach(function(img) {
    img.addEventListener('error', function() {
      if (this.dataset.fallback && this.src !== this.dataset.fallback) {
        this.src = this.dataset.fallback;
      }
    });
  });
  // Portrait : fond crème si image absente
  document.querySelectorAll('img[data-fallback-bg]').forEach(function(img) {
    img.addEventListener('error', function() {
      this.style.background = 'var(--cream-dark)';
    });
  });
}());
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
    //    → ne peut jamais appeler pause() avant que la vidéo tourne
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

// ─── Testimonial : verrouille la hauteur sur la quote la plus haute ────────
(function lockTestimonialBody() {
  var body   = document.querySelector('.testimonial-body');
  var qEl    = document.getElementById('testimonialQuote');
  var nEl    = document.getElementById('testimonialName');
  var rEl    = document.getElementById('testimonialRole');
  if (!body || !qEl || typeof TESTIMONIALS === 'undefined') return;

  function measure() {
    // Réinitialiser pour mesurer librement
    body.style.minHeight = '';
    var maxH = 0;
    var savedQ = qEl.textContent;
    var savedN = nEl ? nEl.textContent : '';
    var savedR = rEl ? rEl.textContent : '';

    TESTIMONIALS.forEach(function(t) {
      qEl.textContent = t.quote;
      if (nEl) nEl.textContent = t.name;
      if (rEl) rEl.textContent = t.role;
      maxH = Math.max(maxH, body.offsetHeight);
    });

    // Restaurer la quote courante
    qEl.textContent = savedQ;
    if (nEl) nEl.textContent = savedN;
    if (rEl) rEl.textContent = savedR;

    body.style.minHeight = maxH + 'px';
  }

  // Mesurer après chargement des polices
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  } else {
    measure();
  }

  // Re-mesurer au resize (debounce 150ms)
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 150);
  }, { passive: true });
}());
