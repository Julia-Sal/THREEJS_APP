import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loadModels, animate } from './loader';

// Scene
const scene = new THREE.Scene();

// Load the model
const loader = new GLTFLoader();
loader.load('/block.glb', function (gltf) {
  const model = gltf.scene;
  model.position.set(0, 0, 0);
  model.scale.set(0.5, 0.5, 0.5);
  scene.add(model);
}, undefined, function (error) {
  console.error(error);
});

//tło
loader.load('/background.glb', function (gltf) {
  const model = gltf.scene;
    model.position.set(0, 70, 0);
    model.scale.set(1, 0.5, 1);
    scene.add(model);
}, undefined, function (error) {
  console.error(error);
});

//ziemia
const geometry = new THREE.CircleGeometry( 7, 70 ); 
const material = new THREE.MeshBasicMaterial( { color: 0x30B65D, side: THREE.DoubleSide} ); 
const circle = new THREE.Mesh( geometry, material ); 
circle.rotation.set(80, 0, 0);
circle.position.set(2, -1, 2)
scene.add( circle );


// Set up lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 0);
scene.add(directionalLight);

// Camera
const width = 10;
const height = width * (window.innerHeight / window.innerWidth);
const camera = new THREE.OrthographicCamera(
  width / -2, // left
  width / 2, // right
  height / 2, // top
  height / -2, // bottom
  1, // near
  100
);

camera.position.set(4, 4, 4);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Render the scene with the camera
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
