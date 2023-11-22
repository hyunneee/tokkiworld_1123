import * as THREE from '/node_modules/three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';


// if (WebGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();
//scene.add(new THREE.AxesHelper(5));

var color = localStorage.getItem("color");
const models = {
  pink: '/src/glb_pink/',
  yellow: '/src/glb_yellow/',
  green: '/src/glb_green/',
  blue: '/src/glb_blue/',
  purple: '/src/glb_purple/',
  default: '/src/glb_pink/'
};
const stats = new Stats();
// document.body.appendChild(stats.dom);

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('/sky.jpg');
scene.background = backgroundImage;

const planeGeometry = new THREE.PlaneGeometry(10, 20); // 가로 10, 세로 10 크기의 플레인 생성
const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundImage }); // 배경 이미지를 텍스처로 사용
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//scene.add(plane);

  const cubeMapLoader = new THREE.CubeTextureLoader();
  const cubeMap = cubeMapLoader.load([
   'front.png', // Right,
   'back.png','top.png','bottom.png','right.png','left.png'
]);
cubeMap.mapping = THREE.CubeRefractionMapping; // 필요에 따라 적절한 매핑 사용


// 큐브 맵을 배경으로 설정
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
const material2 = new THREE.LineBasicMaterial({color : 0x0000ff}, "Entrance");

// 큐브의 꼭짓점을 중심으로 하는 축 생성
const center = new THREE.Vector3();
const axesHelper = new THREE.AxesHelper(1);
axesHelper.position.copy(center);
scene.add(axesHelper);

// Ambient Light 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 5, 3);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-4.304699580651681, 35.55257650431413, -15.538032137184072);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// 각도 수정
controls.target.set(0, 21, 35); // 중점 수정
controls.maxPolarAngle = Math.PI / 1.2; // 최대 위쪽 각도 조절

  const loader = new GLTFLoader();

// GLB 파일 로드
loader.load('/src/cafe.glb', (gltf) => {
  scene.add(gltf.scene);

  const yourMesh = gltf.scene.children[0]; // 로드된 모델의 첫 번째 메쉬를 가져옴

  yourMesh.position.set(0, 21, 0);

  yourMesh.scale.set(0.09, 0.07, 0.07);
  
  //yourMesh.rotation.set(0, 0, 0);

  animate();
}, undefined, (error) => {
  console.error(error);
});

loader.load('/src/laptop.glb', (gltf) => {
  const laptop = gltf.scene;

  if (laptop) {
    scene.add(laptop);
    laptop.position.set(-20.5,26.65,6);
    laptop.scale.set(0.17, 0.17, 0.17);
    laptop.rotation.set(0,-1.55,0)
  }
});

loader.load('/src/coffee_cup.glb', (gltf) => {
  const cup = gltf.scene;

  if (cup) {
    scene.add(cup);
    cup.position.set(24,27,6);
    cup.scale.set(10, 10, 10);
    cup.rotation.set(0,0,0)
  }
});

let mixer;
let isWalking = false;
let isSitting = false;
let sittingAnimationDuration = 460;
let npcMixer;
let npc2Mixer;

loader.load('/src/glb_npc/sitting_npc.glb', (gltf) => {
  const npc = gltf.scene;
  const npcanimations = gltf.animations;

  if (npc) {
    scene.add(npc);
    npc.position.set(25.8,22.6,5.8);
    npc.scale.set(100, 100, 100);
    npc.rotation.set(0,11.1,0)
  }

  if ( npcanimations && npcanimations.length > 0) {
      npcMixer = new THREE.AnimationMixer(npc);

      npcanimations.forEach((clip) => {
        npcMixer.clipAction(clip).play();
      }); 
    }
})

loader.load('/src/glb_npc/eating_npc.glb', (gltf) => {
  const npc2 = gltf.scene;
  const npc2animations = gltf.animations;

  if (npc2) {
    scene.add(npc2);
    npc2.position.set(44.2,22,-11.3);
    npc2.scale.set(100, 100, 100);
    npc2.rotation.set(0,-19.4,0)
  }

  if ( npc2animations && npc2animations.length > 0) {
      npc2Mixer = new THREE.AnimationMixer(npc2);

      npc2animations.forEach((clip) => {
        npc2Mixer.clipAction(clip).play();
      }); 
    }
})
const player = {
  model: null,
  speed: 0.2,
  position: new THREE.Vector3(-22.2, 22.6, 6),
  rotation: new THREE.Quaternion(0,1.65,0),
  initialRotation: new THREE.Quaternion(),
};

loadCharacter(models[color]+'typing.glb');


function loadCharacter(modelPath) {
  if (player.model) {
    mixer.stopAllAction();
    scene.remove(player.model);
  }

  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;

    if (model) {
      // Set the initial rotation when loading the character
      //model.rotation.setFromQuaternion(player.rotation);

      scene.add(model);
      model.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z, 'YXZ');
      
      model.position.copy(player.position);
      model.scale.set(100, 100, 100);

      if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);

        animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }

      if (modelPath === models[color]+'sitting.glb') {
        setTimeout(() => {
          loadCharacter(models[color]+'typing.glb');
        }, sittingAnimationDuration * 1000 / 60); // 프레임당 60프레임을 기준으로 계산
      }
    
      player.model = model;
    }
  });
}

function updatePlayerRotation() {
  player.model.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z, 'YXZ');
}

// function handleKeyDown(event) {
//   console.log('Key down:', event.code);

//     switch (event.code) {
//       case 'Space':
//         isWalking = !isWalking;
//         if (isWalking) {
//           // Store the current rotation as the initial rotation
//           player.initialRotation.copy(player.rotation);
//           loadCharacter('src/walking_pink.glb');
//         } else {
//           // Use the initial rotation stored as a quaternion
//           player.rotation.copy(player.rotation);
//           updatePlayerRotation();
//           loadCharacter('src/standing_pink.glb');
//           isWalking = false;
//         }
        
//         break;
//       case 'KeyA':
//           isSitting = !isSitting;
//           if (isSitting) {
//             // Store the current rotation as the initial rotation
//             player.initialRotation.copy(player.rotation);
//             loadCharacter('src/sittingarmdown_pink.glb');
//           } else {
//             // Use the initial rotation stored as a quaternion
//             player.rotation.copy(player.rotation);
//             updatePlayerRotation();
//             loadCharacter('src/standing_pink.glb');
//             isWalking = false;
//           }
//           break;
//       case 'KeyS':
//           isSkateboard = !isSkateboard;
//           if (isSkateboard) {
//               player.initialRotation.copy(player.rotation);
//               loadCharacter('src/skatejump_pink.glb');
//           } else {
//             player.rotation.copy(player.rotation);
//             updatePlayerRotation();
//             loadCharacter('src/standing_pink.glb');
//             isWalking = false;
      
//               // 토끼 모델 삭제 또는 숨김
//             if (skateboardModel) {
//               scene.remove(skateboardModel);
//               skateboardModel = null;
//               }
//             }
//             break;
//         case 'KeyD':
//               pickup = !pickup;
//               if (pickup) {
//                 // Store the current rotation as the initial rotation
//                 player.initialRotation.copy(player.rotation);
//                 loadCharacter('src/pickup_pink.glb');
//               } else {
//                 // Use the initial rotation stored as a quaternion
//                 player.rotation.copy(player.rotation);
//                 updatePlayerRotation();
//                 loadCharacter('src/standing_pink.glb');
//                 isWalking = false;
//               }
//               break;
//           case 'KeyF':
//                 isRunning = !isRunning;
//                 if (isRunning) {
//                   // Store the current rotation as the initial rotation
//                   player.initialRotation.copy(player.rotation);
//                   loadCharacter('src/running_pink.glb');
//                 } else {
//                   // Use the initial rotation stored as a quaternion
//                   player.rotation.copy(player.rotation);
//                   updatePlayerRotation();
//                   loadCharacter('src/standing_pink.glb');
//                   isWalking = false;
//                 }
//                 break;
//     case 'ArrowUp':
//       moveBackward();
//       break;
//     case 'ArrowDown':
//       moveForward();
//       break;
//     case 'ArrowLeft':
//       rotateLeft();
//       break;
//     case 'ArrowRight':
//       rotateRight();
//       break;
//   }
// }


// function moveForward() {
//   const speed = player.speed;
//   const angle = player.rotation.y;

//   player.position.x -= speed * Math.sin(angle);
//   player.position.z -= speed * Math.cos(angle);

//   player.model.position.copy(player.position);
// }

// function moveBackward() {
//   const speed = player.speed;
//   const angle = player.rotation.y;

//   player.position.x += speed * Math.sin(angle);
//   player.position.z += speed * Math.cos(angle);

//   player.model.position.copy(player.position);
// }

// function rotateLeft() {
//   player.rotation.y += player.speed;
//   updatePlayerRotation();
// }

// function rotateRight() {
//   player.rotation.y -= player.speed;
//   updatePlayerRotation();
// }

// document.addEventListener('keydown', handleKeyDown);



window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
});


  function render() {
    renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate);
console.log(camera.position);
  controls.update();

  if (mixer) mixer.update(0.005);
  if (npcMixer) npcMixer.update(0.003);
  if (npc2Mixer) npc2Mixer.update(0.003);
  
  renderer.render(scene, camera);
  stats.update();
}

  animate();