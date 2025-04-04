import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, rov, keys = {};
let velocity = new THREE.Vector3();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00334d);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('sim-canvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', onWindowResize);

  const pool = new THREE.Mesh(
    new THREE.BoxGeometry(20, 1, 20),
    new THREE.MeshPhongMaterial({ color: 0x225577 })
  );
  pool.position.y = -0.5;
  scene.add(pool);

  rov = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 1),
    new THREE.MeshPhongMaterial({ color: 0xffaa00 })
  );
  rov.position.y = 1;
  scene.add(rov);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  handleMovement();
  camera.position.lerp(new THREE.Vector3(
    rov.position.x + 5,
    rov.position.y + 5,
    rov.position.z + 5
  ), 0.05);
  camera.lookAt(rov.position);
  renderer.render(scene, camera);
}

function handleMovement() {
  velocity.set(0, 0, 0);
  if (keys['w']) velocity.z -= 0.05;
  if (keys['s']) velocity.z += 0.05;
  if (keys['a']) velocity.x -= 0.05;
  if (keys['d']) velocity.x += 0.05;
  if (keys[' ']) velocity.y += 0.03;
  if (keys['shift']) velocity.y -= 0.03;
  rov.position.add(velocity);
}
