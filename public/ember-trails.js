const canvas = document.createElement('canvas');
canvas.classList.add('ember-trails');
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const particles = [];
const colors = ['#ffb347', '#ff944d', '#ff7733', '#e65c00', '#993d00'];

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 2,
      life: 100
    });
  }
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 100;
    ctx.fill();
    ctx.globalAlpha = 1;

    p.x += p.velocityX;
    p.y += p.velocityY;
    p.size *= 0.96;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}
animate();
/*Feed your ember-trails with the ignition logs*/
document.querySelectorAll('.ember-script').forEach(block=>{
  block.addEventListener('mouseenter', ()=>spawnFlare('#ffb347'));
});
function spawnFlare(color){
  for(let i=0;i<15;i++){
    particles.push({
      x: Math.random()*width,
      y: Math.random()*height,
      size: Math.random()*6+2,
      color,
      velocityX:(Math.random()-0.5)*3,
      velocityY:(Math.random()-0.5)*3,
      life:120
    });
  }
}
/*Make each [ section ] a glowing plate */
document.querySelectorAll('p').forEach(p=>{
  if(p.textContent.trim().startsWith('[')){
    p.classList.add('section-marker');
  }
});


