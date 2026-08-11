/* REBUILD TRUST KENYA V3.1 — motion, forms, team profiles */
document.addEventListener('DOMContentLoaded', () => {
  const nav=document.querySelector('.site-nav');
  const toggle=document.querySelector('.menu-toggle');
  const setScrolled=()=>nav&&nav.classList.toggle('scrolled',scrollY>20);
  setScrolled(); addEventListener('scroll',setScrolled,{passive:true});
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('menu-active');document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('menu-active');document.body.classList.remove('menu-open')}))}

  // reveal
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});reveals.forEach(e=>io.observe(e))}else reveals.forEach(e=>e.classList.add('visible'));

  // counters
  document.querySelectorAll('[data-count]').forEach(el=>{const target=+el.dataset.count;let done=false;const run=()=>{if(done)return;done=true;let t0=performance.now();const step=t=>{let p=Math.min((t-t0)/1500,1),v=1-Math.pow(1-p,4);el.textContent=Math.round(target*v).toLocaleString();if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)};if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){run();io.disconnect()}},{threshold:.5});io.observe(el)}else run()});

  // Homepage solar-system motion — true orbiting planets, not floating circles.
  if(window.gsap && document.querySelector('[data-solar]')){
    const solar=document.querySelector('[data-solar]');
    const planets=[
      {el:solar.querySelector('.planet-1'),duration:7,rotation:360},
      {el:solar.querySelector('.planet-2'),duration:11,rotation:-360},
      {el:solar.querySelector('.planet-3'),duration:16,rotation:360},
      {el:solar.querySelector('.planet-4'),duration:20,rotation:-360},
      {el:solar.querySelector('.planet-5'),duration:13,rotation:360}
    ];
    planets.forEach(p=>{
      if(!p.el)return;
      gsap.to(p.el,{rotation:p.rotation,duration:p.duration,repeat:-1,ease:'none',transformOrigin:'0 0'});
      gsap.to(p.el.querySelector('.planet-dot'),{scale:1.18,duration:1.5+(p.duration/10),repeat:-1,yoyo:true,ease:'sine.inOut'});
    });
    gsap.to(solar,{rotate:-4,duration:8,repeat:-1,yoyo:true,ease:'sine.inOut'});
    // Subtle cursor gravity/parallax.
    const hero=document.querySelector('.hero-v3');
    if(hero && matchMedia('(pointer:fine)').matches){
      hero.addEventListener('pointermove',e=>{
        const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        gsap.to(solar,{x:x*16,y:y*12,duration:.7,ease:'power3.out',overwrite:true});
      });
      hero.addEventListener('pointerleave',()=>gsap.to(solar,{x:0,y:0,duration:1,ease:'power3.out'}));
    }
  }

// homepage kinetic movement
  if(window.gsap){
    gsap.registerPlugin(window.ScrollTrigger||{});
    const q=s=>document.querySelectorAll(s);
    q('.hero-atmosphere .blob').forEach((b,i)=>gsap.to(b,{x:`random(-50,50)`,y:`random(-35,35)`,scale:`random(.9,1.15)`,duration:4+i,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    q('.hero-orbit').forEach(el=>gsap.to(el,{y:-18,duration:3.5,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    q('.orbit-node').forEach((el,i)=>gsap.to(el,{x:`random(-10,10)`,y:`random(-10,10)`,duration:2.2+i*.3,repeat:-1,yoyo:true,ease:'sine.inOut'}));
    q('.hero-title .word span').forEach((el,i)=>gsap.to(el,{y:0,opacity:1,duration:.9,delay:.12*i,ease:'power4.out'}));
    // V6 cinematic solar system: each body has its own orbit radius/speed.
    const solar=document.querySelector('.solar-system');
    if(solar){
      const bodies=[
        ['.body-dialogue',190,0,22],['.body-youth',205,72,30],
        ['.body-peace',170,150,25],['.body-account',220,218,34],
        ['.body-inclusion',145,286,20]
      ];
      bodies.forEach(([sel,r,start,dur])=>{
        const el=solar.querySelector(sel);
        if(!el)return;
        const proxy={a:start};
        gsap.to(proxy,{a:start+360,duration:dur,repeat:-1,ease:'none',
          onUpdate:()=>{
            const a=proxy.a*Math.PI/180;
            const x=Math.cos(a)*r, y=Math.sin(a)*r*.62;
            el.style.transform=`translate(${x}px,${y}px)`;
          }
        });
      });
      gsap.to('.solar-orbit-1',{rotation:360,duration:34,repeat:-1,ease:'none'});
      gsap.to('.solar-orbit-2',{rotation:-360,duration:25,repeat:-1,ease:'none'});
      gsap.to('.solar-orbit-3',{rotation:360,duration:42,repeat:-1,ease:'none'});
      gsap.to('.solar-orbit-4',{rotation:-360,duration:18,repeat:-1,ease:'none'});
      gsap.to('.solar-core',{scale:1.045,duration:2.8,repeat:-1,yoyo:true,ease:'sine.inOut'});
      gsap.to('.solar-system',{y:-12,duration:4.5,repeat:-1,yoyo:true,ease:'sine.inOut'});
      if(matchMedia('(pointer:fine)').matches){
        solar.addEventListener('pointermove',e=>{
          const r=solar.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
          gsap.to(solar,{rotationY:x*7,rotationX:-y*7,duration:.5,ease:'power2.out',overwrite:true});
        });
        solar.addEventListener('pointerleave',()=>gsap.to(solar,{rotationY:0,rotationX:0,duration:.8,ease:'power3.out'}));
      }
    }

    const track=document.querySelector('.story-track');
    if(track&&window.ScrollTrigger){gsap.to(track,{x:()=>-(track.scrollWidth-window.innerWidth+80),ease:'none',scrollTrigger:{trigger:'.story-rail',start:'top bottom',end:'bottom top',scrub:1}})}
    q('.parallax').forEach(el=>gsap.to(el,{y:()=>-60, ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
  }

  // program tabs
  const tabs=document.querySelectorAll('.program-index-list button'),details=document.querySelectorAll('.program-detail');
  tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');details.forEach(d=>d.hidden=d.dataset.program!==btn.dataset.program)}));

  // Google Forms silent submit
  const form=document.getElementById('gform');
  if(form){window.submitted=false;form.addEventListener('submit',()=>{window.submitted=true;const b=document.getElementById('submit-btn');if(b){b.disabled=true;b.querySelector('span').textContent='Sending…'}})}
});

function showSuccessMessage(){const form=document.getElementById('gform'),success=document.getElementById('form-success');if(form&&success){form.style.display='none';success.style.display='block'}window.submitted=false}
function resetForm(){const form=document.getElementById('gform'),success=document.getElementById('form-success'),b=document.getElementById('submit-btn');if(form&&success){form.reset();form.style.display='grid';success.style.display='none';if(b){b.disabled=false;b.querySelector('span').textContent='Submit Request'}}}

// Team modal data is injected into team.html.
function openBioModal(id){const d=window.teamData&&window.teamData[id];if(!d)return;document.getElementById('modalImg').src=d.img;document.getElementById('modalRole').textContent=d.role;document.getElementById('modalName').textContent=d.name;document.getElementById('modalBio').innerHTML=d.bio;document.getElementById('modalStrength').textContent=d.strength;document.getElementById('bioModal').classList.add('active');document.body.style.overflow='hidden'}
function closeBioModal(e){const m=document.getElementById('bioModal');if(!m)return;if(e&&e.target!==e.currentTarget&&!e.target.classList.contains('modal-close-btn'))return;m.classList.remove('active');document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBioModal()});


/* V7: subtle page entrance, intentionally restrained */
window.addEventListener("load", () => {
  if (!window.gsap) return;
  gsap.to("body", {opacity:1, duration:.45, ease:"power2.out"});
});
