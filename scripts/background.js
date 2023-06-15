import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



function createBackground(scene) {
  const loader = new GLTFLoader();
  //tło
  loader.load('/background2.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  });
}



export { createBackground};