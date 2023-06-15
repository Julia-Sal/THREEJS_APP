import * as THREE from 'three';
import { createBackground} from './background';

let camera, scene, renderer;
const originalBoxSize = 3;

let stack = [];
const boxHeight = 1;

let gameStarted = false;

// Scene
function init() {
  scene = new THREE.Scene();

  addLayer(0, 0, originalBoxSize, originalBoxSize);
  addLayer(-10, 0, originalBoxSize, originalBoxSize, "x")

  createBackground(scene);
  setLights(scene);

  // Camera
  const width = 10;
  const height = width * (window.innerHeight / window.innerWidth);
  camera = new THREE.OrthographicCamera(
    width / -1, // left
    width / 1, // right
    height / 1, // top
    height / -1, // bottom
    0.01, // near
    100
  );
  camera.position.set(3, 2, 3);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  animate(renderer);
}

function setLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 20, 0);
  scene.add(directionalLight);
}

function animate(renderer) {
  requestAnimationFrame(() => animate(renderer));
  renderer.render(scene, camera);
}

init();




function addLayer(x, z, width, depth, direction){
  const y = boxHeight * stack.length;

  const layer = generateBox(x, y, z, width, depth);
  layer.direction = direction;
  stack.push(layer);
}

function generateBox(x, y, z, width, depth) {
  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);

  const group = new THREE.Group(); // Tworzenie grupy

  const mainGeometry = new THREE.BoxGeometry(width, boxHeight, depth);
  const mainMaterial = new THREE.MeshLambertMaterial({ color: color });
  const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
  mainMesh.position.set(x, y, z);
  group.add(mainMesh); // Dodawanie głównego obiektu do grupy

  const windowColor = new THREE.Color(0x48D1FF);
  const windowGeometry = new THREE.BoxGeometry(width * 0.1, boxHeight * 0.5, depth * 0.1);
  const windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });

  const windowPositions = [
    { x: -width * 0.3, y: 0.15, z: depth * 0.5 },
    { x: width * 0.3, y: 0.15, z: depth * 0.5 },
    { x: width * -0.1, y: 0.15, z: depth * 0.5 },
    { x: width * 0.1, y: 0.15, z: depth * 0.5 },
    { x: width * 0.5, y: 0.15, z: depth * 0.1},
    { x: width * 0.5, y: 0.15, z: -depth * 0.3},
    { x: width * 0.5, y: 0.15, z: depth * 0.3},
    { x: width * 0.5, y: 0.15, z: -depth * 0.1},
    // Dodaj więcej pozycji okien, jeśli potrzebujesz
  ];

  windowPositions.forEach((pos) => {
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(x + pos.x, y + pos.y, z + pos.z);
    group.add(windowMesh); // Dodawanie okna do grupy
  });

  scene.add(group); // Dodawanie grupy do sceny

  return {
    threejs: group, // Zwracanie grupy zamiast głównego obiektu
    width,
    depth,
  };
}

window.addEventListener("click", () => {
  if(!gameStarted){
    renderer.setAnimationLoop(animation);
    gameStarted = true;
  }else{
    const topLayer = stack[stack.length - 1];
    const direction = topLayer.direction;
    // Next layer
    const nextX = direction == "x" ? 0 : -10;
    const nextZ = direction == "z" ? 0 : -10;
    const newWidth = originalBoxSize;
    const newDepth = originalBoxSize;
    const nextDirection = direction == "x" ? "z" : "x";
    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
  }

});

function animation(){
  const speed = 0.15;

  const topLayer = stack[stack.length -1];
  topLayer.threejs.position[topLayer.direction] += speed;

  if(camera.position.y <boxHeight *(stack.length -2) + 4){
    camera.position.y += speed;
  }
  renderer.render(scene, camera);
}