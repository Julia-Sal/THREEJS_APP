import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function createBox(scene){
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
}

function createBackground(scene){
    const loader = new GLTFLoader();
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
}


export{createBackground, createBox};