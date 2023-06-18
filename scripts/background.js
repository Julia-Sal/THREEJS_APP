import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

function createBackground(scene) {
  //tło
  loader.load('/background.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  });
}

function createPlane(scene){
  //tło
  loader.load('/plane.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0); //do zmiany
    model.scale.set(1, 1, 1);    //do zmiany
    scene.add(model);
  }, undefined, function (error) {
    console.error(error);
  });
}



export {createBackground};