// ===============================
// ELEMENTOS
// ===============================
const desk = document.getElementById('desk');
const monitor = document.getElementById('monitor-screen');
const monitorContent = document.getElementById('monitor-content');
const powerBtn = document.getElementById('power-button');
const led = document.getElementById('led-light');
const desktopIcons = document.getElementById('desktop-icons');
const scene = document.getElementById('scene-desktop');
const monitorFlash = document.getElementById('monitor-flash');
const monitorWallpaper = document.getElementById('monitor-wallpaper');
const monitorShutdown = document.getElementById('crt-shutdown');

const windowDocs = document.getElementById('window-documents');
const iconFolder = document.getElementById('icon-folder');

const soundPower = document.getElementById('sound-power');
const soundAmbient = document.getElementById('sound-ambient');
const soundClick = document.getElementById('sound-click');
const soundWindow = document.getElementById('sound-window');

// ===============================
// ESCALAR MONITOR
// ===============================
function scaleMonitor(scale) {
  monitor.style.transition = 'transform 1.8s ease-out';
  monitor.style.transform = `scale(${scale})`;

  monitorContent.style.transition = 'transform 1.8s ease-out';
  monitorContent.style.transform = `scale(${1 / scale})`;
}

// ===============================
// POWER BUTTON
// ===============================
let monitorOn = false;

powerBtn.addEventListener('click', () => {
  soundClick.currentTime = 0;
  soundClick.play();

  if (!monitorOn) {
    // ENCENDER
    monitorOn = true;
    led.classList.remove('led-red-blink');
    led.classList.add('led-green');
    soundPower.currentTime = 0;
    soundPower.play();

    setTimeout(() => {
      // EFECTOS VISUALES
      monitor.classList.add('monitor-on');
      monitor.classList.add('crt-on');
      desktopIcons.classList.add('visible');
      
      // WALLPAPER
      monitorWallpaper.classList.remove('hidden');
      monitorWallpaper.classList.add('visible');
      
      // FLASH ENCENDIDO
      monitorFlash.classList.add('flash-on');
      setTimeout(() => monitorFlash.classList.remove('flash-on'), 800);
      
      soundAmbient.play();

      // ZOOM
      scene.style.transition = 'transform 1.8s ease-out';
      scene.style.transform = 'translateY(-60px) scale(1.6)';
      scaleMonitor(1.6);

    }, 800);

  } else {
    // APAGAR
    monitorOn = false;
    led.classList.remove('led-green');
    led.classList.add('led-red-blink');
    soundAmbient.pause();

    // EFECTO APAGADO BREVE
    monitorShutdown.classList.remove('hidden');
    monitorShutdown.classList.add('flash-off');
    setTimeout(() => {
      monitorShutdown.classList.remove('flash-off');
      monitorShutdown.classList.add('hidden');
    }, 800);

    // OCULTAR WALLPAPER
    monitorWallpaper.classList.remove('visible');
    setTimeout(() => monitorWallpaper.classList.add('hidden'), 800);

    // QUITAR EFECTOS
    monitor.classList.remove('monitor-on');
    monitor.classList.remove('crt-on');
    desktopIcons.classList.remove('visible');

    // REVERTIR ZOOM
    scene.style.transition = 'transform 1.5s ease-in';
    scene.style.transform = 'translateY(0) scale(1)';
    scaleMonitor(1);

    soundPower.currentTime = 0;
    soundPower.play();
  }
});

// ===============================
// SONIDOS CLICK
// ===============================
document.querySelectorAll('.icon, .window-close, .icon-doc').forEach(el => {
  el.addEventListener('click', () => {
    soundClick.currentTime = 0;
    soundClick.play();
  });
});

// ===============================
iconFolder.addEventListener('click', () => {
  windowDocs.classList.remove('hidden');
  soundWindow.currentTime = 0;
  soundWindow.play();
});

windowDocs.querySelector('.window-close').addEventListener('click', () => {
  windowDocs.classList.add('hidden');
  soundClick.currentTime = 0;
  soundClick.play();
});