import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// Create a scene
var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 0;
camera.position.y = 0;

const loader = new GLTFLoader();

loader.load('public/background.glb', function (gltf) {
  const model = gltf.scene;
    model.rotation.set(0, 0, 0);
    model.position.set(0, 0, 0);
    model.scale.set(1,1,10);
    scene.add(model);
}, undefined, function (error) {
  console.error(error);
});

//light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
light.intensity = 20;
scene.add( light );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();