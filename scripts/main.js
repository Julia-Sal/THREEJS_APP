import * as THREE from 'three';
import { createBackground} from './background';
import * as CANNON from 'cannon';


window.focus(); // Capture keys right away (by default focus is on editor)

let camera, scene, renderer; // ThreeJS globals
let world; // CannonJs world
let lastTime; // Last timestamp of animation
let stack; // Parts that stay solid on top of each other
let overhangs; // Overhanging parts that fall down
const boxHeight = 1; // Height of each layer
const originalBoxSize = 3; // Original width and height of a box
let gameEnded;

const scoreElement = document.getElementById("score");
const instructionsElement = document.getElementById("instructions");
const resultsElement = document.getElementById("results");
const restartBtn = document.getElementById("restartBtn");
const startBtn = document.getElementById("startBtn");

init();


function init() {
  gameEnded = false;
  lastTime = 0;
  stack = [];
  overhangs = [];

  // Initialize CannonJS
  world = new CANNON.World();
  world.gravity.set(0, -10, 0); // Gravity pulls things down
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 40;

  // Initialize ThreeJs
  const aspect = window.innerWidth / window.innerHeight;
  const width = 10;
  const height = width / aspect;
  

  camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    0, // near plane
    100 // far plane
  );

  camera.position.set(4, 4, 4);
  camera.lookAt(0, 1, 0);

  scene = new THREE.Scene();
  createBackground(scene);
  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 0);
  scene.add(dirLight);

  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  document.body.appendChild(renderer.domElement);
}

function firstStart(){
  // Foundation
  addLayer(0, 0, originalBoxSize, originalBoxSize);

  // First layer
  addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");

  renderer.setAnimationLoop(animation);
  instructionsElement.style.display = "none";
  
}

function startGame() {
  gameEnded = false;
  lastTime = 0;
  stack = [];
  overhangs = [];

  if (resultsElement) resultsElement.style.display = "none";
  scoreElement.innerText = 0;

  if (world) {
    // Remove every object from world
    while (world.bodies.length > 0) {
      world.remove(world.bodies[0]);
    }
  }

  if (scene) {
    // Remove every Mesh from the scene
    while (scene.children.find((c) => c.type == "Mesh")) {
      const mesh = scene.children.find((c) => c.type == "Mesh");
      scene.remove(mesh);
    }

    // Foundation
    addLayer(0, 0, originalBoxSize, originalBoxSize);

    // First layer
    addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");
  }

  if (camera) {
    // Reset camera positions
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 1, 0);
  }
}

function addLayer(x, z, width, depth, direction) {
  const y = boxHeight * stack.length; // Add the new box one layer higher
  const layer = generateBox(x, y, z, width, depth, false);
  layer.direction = direction;
  stack.push(layer);
}

function addOverhang(x, z, width, depth) {
  const y = boxHeight * (stack.length - 1); // Add the new box one the same layer
  const overhang = generateBox(x, y, z, width, depth, true);
  overhangs.push(overhang);
}

function generateWindows(width, depth, mesh){
  //podstawowe ustawienia okien
  const windowSize = Math.min(width, depth) * 0.1;
  const windowGeometry = new THREE.BoxGeometry(0.1, boxHeight*0.4, 0.1);
  const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x78b0ff });

  const randomWindowPositions = decideHowManyWindow(width, depth, windowSize); //zdecyduj ile okien ma powstać
  
  //wygeneruj okna
  randomWindowPositions.forEach((windowPosition) => {
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(
      windowPosition.x,
      windowPosition.y,
      windowPosition.z
    );
    mesh.add(windowMesh);
  });
}

function decideHowManyWindow(width, depth, windowSize){
  if(width>2){
  return [
    //tył
    { x: width / 2 - windowSize / 2, y: 0, z: depth * 0.2 },
    { x: -width / 2 - windowSize / 2, y: 0, z: -depth * 0.2 },
    { x: width / 2 - windowSize / 2, y: 0, z: depth * 0.4 },
    { x: -width / 2 - windowSize / 2, y: 0, z: -depth * 0.4 },

    //przód prawa
    { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.2 },
    { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.4 },
    { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.2 },
    { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.4 },
   // { x: width / 2 + windowSize / 2, y: 0, z: Math.random() * depth - depth / 2 },

   //tył
    { x: width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
    { x: width * 0.4, y: 0, z: -depth / 2 - windowSize / 2 },
    { x: -width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
    { x: -width * 0.4, y: 0, z: -depth / 2 - windowSize / 2 },

    //przód lewa
    { x: width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
    { x: width * 0.4, y: 0, z: depth / 2 + windowSize / 2 },
    { x: -width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
    { x: -width * 0.4, y: 0, z: depth / 2 + windowSize / 2 },
    
    
  ];
  }else if(width>1){  //po dwa okna
    return [
      { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.2 },
      { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.2 },

      { x: width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
      { x: -width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },

      { x: width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
      { x: -width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
    ]
  }else{  //po jednym oknie w losowym miejscu
    return [
      { x: -width / 2 - windowSize / 2, y: 0, z: Math.random() * depth - depth / 2 },
      { x: width / 2 + windowSize / 2, y: 0, z: Math.random() * depth - depth / 2 },
      { x: Math.random() * width - width / 2, y: 0, z: -depth / 2 - windowSize / 2 },
      { x: Math.random() * width - width / 2, y: 0, z: depth / 2 + windowSize / 2 },
    ]
  }
}


function generateBox(x, y, z, width, depth, falls) {
  // ThreeJS
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
  const material = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  generateWindows(width, depth, mesh); //wygeneruj okna

  scene.add(mesh);

  // CannonJS
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, boxHeight / 2, depth / 2)
  );
  let mass = falls ? 5 : 0;
  mass *= width / originalBoxSize;
  mass *= depth / originalBoxSize;
  const body = new CANNON.Body({ mass, shape });
  body.position.set(x, y, z);
  world.addBody(body);

  return {
    threejs: mesh,
    cannonjs: body,
    width,
    depth,
  };
}

function cutBox(topLayer, overlap, size, delta) {
  const direction = topLayer.direction;
  const newWidth = direction == "x" ? overlap : topLayer.width;
  const newDepth = direction == "z" ? overlap : topLayer.depth;

  // Update metadata
  topLayer.width = newWidth;
  topLayer.depth = newDepth;

  // Update ThreeJS model
  topLayer.threejs.scale[direction] = overlap / size;
  topLayer.threejs.position[direction] -= delta / 2;

  // Update CannonJS model
  topLayer.cannonjs.position[direction] -= delta / 2;

  // Replace shape to a smaller one (in CannonJS you can't simply just scale a shape)
  const shape = new CANNON.Box(
    new CANNON.Vec3(newWidth / 2, boxHeight / 2, newDepth / 2)
  );
  topLayer.cannonjs.shapes = [];
  topLayer.cannonjs.addShape(shape);
}

window.addEventListener("mousedown", splitBlockAndAddNextOneIfOverlaps);
window.addEventListener("touchstart", splitBlockAndAddNextOneIfOverlaps);
restartBtn.addEventListener("click", startGame);
startBtn.addEventListener("click", firstStart);

function splitBlockAndAddNextOneIfOverlaps() {
  if (gameEnded) return;

  const topLayer = stack[stack.length - 1];
  const previousLayer = stack[stack.length - 2];

  const direction = topLayer.direction;

  const size = direction == "x" ? topLayer.width : topLayer.depth;
  const delta =
    topLayer.threejs.position[direction] -
    previousLayer.threejs.position[direction];
  const overhangSize = Math.abs(delta);
  const overlap = size - overhangSize;

  if (overlap > 0) {
    cutBox(topLayer, overlap, size, delta);

    // Overhang
    const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta);
    const overhangX =
      direction == "x"
        ? topLayer.threejs.position.x + overhangShift
        : topLayer.threejs.position.x;
    const overhangZ =
      direction == "z"
        ? topLayer.threejs.position.z + overhangShift
        : topLayer.threejs.position.z;
    const overhangWidth = direction == "x" ? overhangSize : topLayer.width;
    const overhangDepth = direction == "z" ? overhangSize : topLayer.depth;

    addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);

    // Next layer
    const nextX = direction == "x" ? topLayer.threejs.position.x : -10;
    const nextZ = direction == "z" ? topLayer.threejs.position.z : -10;
    const newWidth = topLayer.width; // nowa warstwa ma takie same rozmiary jak ta odcięta
    const newDepth = topLayer.depth; // nowa warstwa ma takie same rozmiary jak ta odcięta
    const nextDirection = direction == "x" ? "z" : "x";

    if (scoreElement) scoreElement.innerText = stack.length - 1;
    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
  } else {
    missedTheSpot();
  }
}

function missedTheSpot() {
  const topLayer = stack[stack.length - 1];

  // Turn to top layer into an overhang and let it fall down
  addOverhang(
    topLayer.threejs.position.x,
    topLayer.threejs.position.z,
    topLayer.width,
    topLayer.depth
  );
  world.remove(topLayer.cannonjs);
  scene.remove(topLayer.threejs);

  gameEnded = true;
  if (resultsElement) resultsElement.style.display = "flex";
}

function animation(time) {
  if (lastTime) {
    const timePassed = time - lastTime;
    const speed = 0.008;

    const topLayer = stack[stack.length - 1];
    const previousLayer = stack[stack.length - 2];


    if (!gameEnded) {
      // Keep the position visible on UI and the position in the model in sync
      topLayer.threejs.position[topLayer.direction] += speed * timePassed;
      topLayer.cannonjs.position[topLayer.direction] += speed * timePassed;

      // If the box went beyond the stack then show up the fail screen
      if (topLayer.threejs.position[topLayer.direction] > 10) {
        missedTheSpot();
      }
    }

    // 4 is the initial camera height
    if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
      camera.position.y += speed * timePassed;
    }

    updatePhysics(timePassed);
    renderer.render(scene, camera);
  }
  lastTime = time;
}

function updatePhysics(timePassed) {
  world.step(timePassed / 1000); // Step the physics world

  // Copy coordinates from Cannon.js to Three.js
  overhangs.forEach((element) => {
    element.threejs.position.copy(element.cannonjs.position);
    element.threejs.quaternion.copy(element.cannonjs.quaternion);
  });
}

window.addEventListener("resize", () => {
  // Adjust camera
  console.log("resize", window.innerWidth, window.innerHeight);
  const aspect = window.innerWidth / window.innerHeight;
  const width = 10;
  const height = width / aspect;

  camera.top = height / 2;
  camera.bottom = height / -2;

  // Reset renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});
