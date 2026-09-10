import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { animate, utils } from 'animejs';
import 'animejs/adapters/three';

// === SETUP ===
const container = document.getElementById('canvas-container');
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f0f0f');

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
camera.position.set(3.2, 2.4, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(5, 8, 4);
dirLight.castShadow = true;
scene.add(dirLight);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2.5;
controls.maxDistance = 10;
controls.target.set(0, 0.5, 0);

// === PRODUCTO ===
const geometry = new THREE.BoxGeometry(1.7, 1.05, 1.3);
const material = new THREE.MeshStandardMaterial({
  color: '#3b82f6',
  roughness: 0.32,
  metalness: 0.12
});

const product = new THREE.Mesh(geometry, material);
product.castShadow = true;
product.receiveShadow = true;
product.position.y = 0.52;
scene.add(product);

// Suelo
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 14),
  new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// === ANIMACIÓN DE ENTRADA ===
utils.set(product, { scale: 0.25, y: -1.2, rotateY: -120 });

animate(product, {
  scale: 1,
  y: 0.52,
  rotateY: 0,
  duration: 1500,
  ease: 'out(3)'
});

// Rotación suave automática
animate(product, {
  rotateY: 360,
  duration: 20000,
  ease: 'linear',
  loop: true
});

// === CAMBIO DE COLOR ===
const priceEl = document.getElementById('price');
const basePrice = 249;

document.querySelectorAll('.ui button').forEach(btn => {
  btn.addEventListener('click', () => {
    const newColor = btn.dataset.color;

    animate(product, {
      color: newColor,
      duration: 550,
      ease: 'inOut(2)'
    });

    animate(product, {
      scale: [1, 1.09, 1],
      duration: 380,
      ease: 'out(3)'
    });

    priceEl.textContent = basePrice + Math.floor(Math.random() * 45);
  });
});

// === LOOP ===
function loop() {
  requestAnimationFrame(loop);
  controls.update();
  renderer.render(scene, camera);
}
loop();

// Responsive
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
