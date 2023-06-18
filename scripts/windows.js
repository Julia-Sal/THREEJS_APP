import * as THREE from 'three';
import * as CANNON from 'cannon';

const boxHeight = 1;

function generateWindows(width, depth, mesh, boxHeight){
    //podstawowe ustawienia okien
    //1
    const windowSize = Math.min(width, depth) * 0.1;
    const windowGeometryLeft = new THREE.BoxGeometry(0.25, boxHeight*0.4, 0.05); //lewa przód
    const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x78b0ff });
    //2
    const windowGeometryRight = new THREE.BoxGeometry(0.05, boxHeight*0.4, 0.25);
    
    const randomWindowPositionsLeft = decideHowManyWindowLeft(width, depth, windowSize); //zdecyduj ile okien ma powstać
    const randomWindowPositionsRight = decideHowManyWindowRight(width, depth, windowSize);
  
    //wygeneruj okna
    randomWindowPositionsLeft.forEach((windowPosition) => {
      const windowMeshLeft = new THREE.Mesh(windowGeometryLeft, windowMaterial);
      
      windowMeshLeft.position.set(
        windowPosition.x,
        windowPosition.y,
        windowPosition.z
      );
      mesh.add(windowMeshLeft);
    });
    
    randomWindowPositionsRight.forEach((windowPosition) => {
      const windowMeshRight = new THREE.Mesh(windowGeometryRight, windowMaterial);
      
      windowMeshRight.position.set(
        windowPosition.x,
        windowPosition.y,
        windowPosition.z
      );
      mesh.add(windowMeshRight);
    });
  }
  
  function decideHowManyWindowLeft(width, depth, windowSize){
    if(width>2){
    return [
      //tył
      // { x: width / 2 - windowSize / 2, y: 0, z: depth * 0.2 },
      // { x: -width / 2 - windowSize / 2, y: 0, z: -depth * 0.2 },
      // { x: width / 2 - windowSize / 2, y: 0, z: depth * 0.4 },
      // { x: -width / 2 - windowSize / 2, y: 0, z: -depth * 0.4 },
  
     //tył
      // { x: width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
      // { x: width * 0.4, y: 0, z: -depth / 2 - windowSize / 2 },
      // { x: -width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
      // { x: -width * 0.4, y: 0, z: -depth / 2 - windowSize / 2 },
  
      //przód lewa
      { x: width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
      { x: width * 0.4, y: 0, z: depth / 2 + windowSize / 2 },
      { x: -width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
      { x: -width * 0.4, y: 0, z: depth / 2 + windowSize / 2 },
      
      
    ];
    }else if(width>1){  //po dwa okna
      return [
        //tył
        // { x: width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
        // { x: -width * 0.2, y: 0, z: -depth / 2 - windowSize / 2 },
  
        { x: width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
        { x: -width * 0.2, y: 0, z: depth / 2 + windowSize / 2 },
      ]
    }else{  //po jednym oknie w losowym miejscu
      return [
        // { x: -width / 2 - windowSize / 2, y: 0, z: Math.random() * depth - depth / 2 }, //tył lewa
        // { x: width / 2 + windowSize / 2, y: 0, z: Math.random() * depth - depth / 2 }, //prawa przód
        // { x: Math.random() * width - width / 2, y: 0, z: -depth / 2 - windowSize / 2 }, //tył prawa
         { x: 0, y: 0, z: depth / 2 + windowSize / 2 }, //lewa przód
      ]
    }
  }
  
  function decideHowManyWindowRight(width, depth, windowSize){
    if(depth>2){ 
    return [
      //przód prawa
      { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.2 },
      { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.4 },
      { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.2 },
      { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.4 },
    ];
    }else if(depth>1){//po dwa okna
      return [
        { x: width / 2 + windowSize / 2, y: 0, z: depth * 0.2 },
        { x: width / 2 + windowSize / 2, y: 0, z: -depth * 0.2 },
  
      ]
    }else{//po jednym oknie
      return [
        { x: width / 2 + windowSize / 2, y: 0, z: 0 },
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
  
    generateWindows(width, depth, mesh, boxHeight); //wygeneruj okna
  
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

  

  export {generateWindows, generateBox};