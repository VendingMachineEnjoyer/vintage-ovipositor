// ===============================
// ELEMENTOS
// ===============================
const scene = document.getElementById('scene-desktop');
const monitor = document.getElementById('monitor-screen');
const monitorContent = document.getElementById('monitor-content');
const powerBtn = document.getElementById('power-button');
const led = document.getElementById('led-light');
const desktopIcons = document.getElementById('desktop-icons');
const monitorFlash = document.getElementById('monitor-flash');
const monitorWallpaper = document.getElementById('monitor-wallpaper');
const monitorShutdown = document.getElementById('crt-shutdown');
const taskbar = document.getElementById('taskbar');

const windowDocs = document.getElementById('window-documents');
const iconFolder = document.getElementById('icon-folder');

const soundPower = document.getElementById('sound-power');
const soundAmbient = document.getElementById('sound-ambient');
const soundClick = document.getElementById('sound-click');
const soundWindow = document.getElementById('sound-window');

// ===============================
// POWER BUTTON
// ===============================
let monitorOn = false;

powerBtn.addEventListener('click', () => {
  soundClick.currentTime = 0;
  soundClick.play();

  if (!monitorOn) {
    monitorOn = true;
    led.classList.remove('led-red-blink');
    led.classList.add('led-green');
    soundPower.currentTime = 0;
    soundPower.play();

    setTimeout(() => {
      monitor.classList.add('monitor-on', 'crt-on');
      desktopIcons.classList.add('visible');
      monitorWallpaper.classList.remove('hidden');
      monitorWallpaper.classList.add('visible');
      monitorFlash.classList.add('flash-on');
      taskbar.classList.add('visible');
      setTimeout(() => monitorFlash.classList.remove('flash-on'), 800);
      soundAmbient.currentTime = 0;
      soundAmbient.play();
      scene.style.transform = 'scale(1.6)';
    }, 800);

  } else {
    monitorOn = false;
    led.classList.remove('led-green');
    led.classList.add('led-red-blink');
    soundAmbient.pause();
    soundAmbient.currentTime = 0;
    monitorShutdown.classList.remove('hidden');
    monitorShutdown.classList.add('flash-off');
    taskbar.classList.remove('visible');

    setTimeout(() => {
      monitorShutdown.classList.remove('flash-off');
      monitorShutdown.classList.add('hidden');
    }, 800);

    monitorWallpaper.classList.remove('visible');
    setTimeout(() => monitorWallpaper.classList.add('hidden'), 800);

    monitor.classList.remove('monitor-on', 'crt-on');
    desktopIcons.classList.remove('visible');
    scene.style.transform = 'scale(1)';
    soundPower.currentTime = 0;
    soundPower.play();
  }
});

// ===============================
// SONIDOS
// ===============================
document.querySelectorAll('.icon, .window-close, .icon-doc').forEach(el => {
  el.addEventListener('click', e => {
    e.stopPropagation();
    soundClick.currentTime = 0;
    soundClick.play();
  });
});

// ===============================
// ABRIR / CERRAR VENTANA
// ===============================
iconFolder.addEventListener('click', () => {
  windowDocs.classList.remove('hidden');
  soundWindow.currentTime = 0;
  soundWindow.play();
});

windowDocs.querySelector('.window-close').addEventListener('click', e => {
  e.stopPropagation();
  windowDocs.classList.add('hidden');
});

// ===============================
// ARRASTE DE VENTANA
// ===============================
function makeDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  const container = monitorContent;

  let isDragging = false;
  let currentX = 40, currentY = 40;
  let targetX = currentX, targetY = currentY;
  let startX, startY;

  const winWidth = windowEl.offsetWidth;
  const winHeight = windowEl.offsetHeight;
  const CONTAINER_WIDTH = 150;
  const CONTAINER_HEIGHT = 125;
  const SMOOTHNESS = 0.18;
  windowEl.style.transform = 'translateZ(0)';

  const getScale = () => {
    const computed = window.getComputedStyle(scene);
    const matrix = computed.transform;
    if (matrix === 'none') return 1;
    const values = matrix.split('(')[1].split(')')[0].split(',');
    return parseFloat(values[0]);
  };

  header.addEventListener('mousedown', e => {
    if (e.target.classList.contains('window-close')) return;
    e.preventDefault();
    const scale = getScale();
    const rect = container.getBoundingClientRect();
    startX = (e.clientX - rect.left) / scale - currentX;
    startY = (e.clientY - rect.top) / scale - currentY;
    isDragging = true;
    header.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const scale = getScale();
    const rect = container.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;
    targetX = Math.max(0, Math.min(mouseX - startX, CONTAINER_WIDTH - winWidth));
    targetY = Math.max(0, Math.min(mouseY - startY, CONTAINER_HEIGHT - winHeight));
  });

  let rafId;
  const update = () => {
    if (isDragging) {
      currentX += (targetX - currentX) * SMOOTHNESS;
      currentY += (targetY - currentY) * SMOOTHNESS;
      windowEl.style.left = `${currentX}px`;
      windowEl.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(update);
    }
  };

  const startAnim = () => { if (!rafId) rafId = requestAnimationFrame(update); };
  const stopAnim = () => { if (rafId) cancelAnimationFrame(rafId); rafId = null; };

  header.addEventListener('mousedown', startAnim);
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'grab';
      stopAnim();
    }
  });
}

makeDraggable(windowDocs);

// ===============================
// RELOJ EN TIEMPO REAL
// ===============================
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  document.querySelector('.taskbar-clock').textContent = time;
}

setInterval(updateClock, 1000);
updateClock();
