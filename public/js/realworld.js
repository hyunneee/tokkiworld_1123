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
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 25, 20); // 수정: 초기 카메라 위치 조정
camera.lookAt(new THREE.Vector3(0, 0, 0));
//camera.position.z = 5;
//camera.position.y = 6;
//camera.lookAt(center);

// 큐브의 중심을 포커스로 설정
// const boundingBox = new THREE.Box3().setFromObject(cube);
// const target = new THREE.Vector3();
// boundingBox.getCenter(target);
//camera.lookAt(target);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.target.set(0, 40, 30);
controls.maxPolarAngle = Math.PI/1.2;
  // const material = new THREE.MeshNormalMaterial()

  const loader = new GLTFLoader();

  loader.load('/src/low_poly_city.glb', (gltf) => {
    scene.add(gltf.scene);
  
    const yourMesh = gltf.scene.children[0];
  
    yourMesh.position.set(0, 0, 0);

    yourMesh.scale.set(4, 4, 4);
    
    //yourMesh.rotation.set(0, 0, 0);
  
    animate();
  }, undefined, (error) => {
    console.error(error);
  });



// GLB 파일 로드
loader.load('/src/cafe_soca.glb', (gltf) => {
  scene.add(gltf.scene);

  const yourMesh = gltf.scene.children[0]; // 로드된 모델의 첫 번째 메쉬를 가져옴

  yourMesh.position.set(-85, 10, -155);

  yourMesh.scale.set(0.4, 0.4, 0.4);
  
  //yourMesh.rotation.set(0, 0, 0);

  animate();
}, undefined, (error) => {
  console.error(error);
});

let pointer; // Declare pointer variable


let pointerModels = [];

function createAnimatedPointer(x, y, z) {
  // Load pointer model
  loader.load('/src/map_pointer.glb', (gltf) => {
    // Create a new instance of the loaded model
    const pointer = gltf.scene.clone();

    // Set the position and scale of the pointer
    pointer.position.set(x, y, z);
    pointer.scale.set(0.6, 0.6, 0.6);

    // Add the pointer to the scene
    scene.add(pointer);

    // Store the initial position and rotation for reference
    const initialY = pointer.position.y;

    // Animation parameters
    const amplitude = 0.5; // Adjust the amplitude of the animation
    const frequency = 1; // Adjust the frequency of the animation
    const rotationSpeed = 0.015; // Adjust the speed of rotation

    // Function to animate the pointer
    function animatePointer() {
      const time = performance.now() * 0.001; // Get the current time

      // Calculate the new Y position using a sine function for periodic motion
      const newY = initialY + amplitude * Math.sin(frequency * time);

      // Update the pointer's Y position
      pointer.position.y = newY;

      // Rotate the pointer around the Y-axis
      pointer.rotation.y += rotationSpeed;

      // Request the next frame for smooth animation
      requestAnimationFrame(animatePointer);
    }

    // Start the animation
    animatePointer();

    // Handle click event for the pointer
    pointer.addEventListener('click', () => {
      console.log('Pointer Clicked!');

      // Check if the pointer is already in pickup mode
      const isPickupMode = pointerModels.includes(pointer);

      // Remove existing pickup models
      pointerModels.forEach((ptr) => scene.remove(ptr));
      pointerModels = [];

      if (!isPickupMode) {
        // Change the model to pickup.glb
        loader.load(models[color]+'pickup.glb', (pickupGltf) => {
          const pickupModel = pickupGltf.scene;
          pickupModel.position.copy(pointer.position);
          pickupModel.scale.set(0.6, 0.6, 0.6);
          scene.add(pickupModel);
          pointerModels.push(pickupModel);
        });
      }
    });
  }, undefined, (error) => {
    console.error(error);
  });
}

// Create multiple animated pointers
createAnimatedPointer(18, 37.3, -10);
createAnimatedPointer(76.6, 36, -33);
//createAnimatedPointer(-16, 38, -24);

let mixer;
let isWalking = false;
let isSitting = false;
let isSkateboard = false;
let skateboardSpeed = 0.25;
let skateboardModel = null;
let walkSpeed = 0.06;
let walkModel = null;
let pickup = false;
let RunModel = null;
let runSpeed = 0.2;
let isRunning = false;
let sittingAnimationDuration = 70;
let talkingAnimationDuration = 250;
let npcMixer;
let npc2Mixer;
let npc3Mixer;
let npc4Mixer;
let npc5Mixer;
const clickableObjects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let npc;
let npc2;
let npc3;

loader.load('/src/glb_npc/standing_npc.glb', (gltf) => {
  npc = gltf.scene;
  const npcanimations = gltf.animations;

  if (npc) {
    scene.add(npc);
    npc.position.set(18,21,-10);
    npc.scale.set(100, 100, 100);
    npc.rotation.set(0,-0.5,0)

    clickableObjects.push(npc);
  }

  if ( npcanimations && npcanimations.length > 0) {
      npcMixer = new THREE.AnimationMixer(npc);

      npcanimations.forEach((clip) => {
        npcMixer.clipAction(clip).play();
      }); 
    }
})

loader.load('/src/glb_npc/sitting_npc.glb', (gltf) => {
  npc2 = gltf.scene;
  const npc2animations = gltf.animations;

  if (npc2) {
    scene.add(npc2);
    npc2.position.set(76.5,21,-30);
    npc2.scale.set(100, 100, 100);
    npc2.rotation.set(0,-1.9,0)

    clickableObjects.push(npc2);
  }

  if ( npc2animations && npc2animations.length > 0) {
      npc2Mixer = new THREE.AnimationMixer(npc2);

      npc2animations.forEach((clip) => {
        npc2Mixer.clipAction(clip).play();
      }); 
    }
})

loader.load('/src/glb_npc/sitting_npc.glb', (gltf) => {
  npc3 = gltf.scene;
  const npc3animations = gltf.animations;

  if (npc3) {
    scene.add(npc3);
    npc3.position.set(76.5,21,-35);
    npc3.scale.set(100, 100, 100);
    npc3.rotation.set(0,-1.2,0)

    clickableObjects.push(npc3);
  }

  if ( npc3animations && npc3animations.length > 0) {
      npc3Mixer = new THREE.AnimationMixer(npc3);

      npc3animations.forEach((clip) => {
        npc3Mixer.clipAction(clip).play();
      }); 
    }
})

loader.load('/src/glb_purple/talking.glb', (gltf) => {
  const npc4 = gltf.scene;
  const npc4animations = gltf.animations;

  if (npc4) {
    scene.add(npc4);
    npc4.position.set(163,21,-25);
    npc4.scale.set(100, 100, 100);
    npc4.rotation.set(0,7.02,0)

    clickableObjects.push(npc4);
  }

  if ( npc4animations && npc4animations.length > 0) {
      npc4Mixer = new THREE.AnimationMixer(npc4);

      npc4animations.forEach((clip) => {
        npc4Mixer.clipAction(clip).play();
      }); 
    }
})

loader.load('/src/glb_yellow/komin.glb', (gltf) => {
  const npc5 = gltf.scene;
  const npc5animations = gltf.animations;

  if (npc5) {
    scene.add(npc5);
    npc5.position.set(170,21,-21);
    npc5.scale.set(100, 100, 100);
    npc5.rotation.set(0,4.16,0)

    clickableObjects.push(npc5);
  }

  if ( npc5animations && npc5animations.length > 0) {
      npc5Mixer = new THREE.AnimationMixer(npc5);

      npc5animations.forEach((clip) => {
        npc5Mixer.clipAction(clip).play();
      }); 
    }
})

const player = {
  model: null,
  speed: 0.26,
  position: new THREE.Vector3(0, 21, 10),
  rotation: new THREE.Quaternion(),
  initialRotation: new THREE.Quaternion(),
};

loadCharacter(models[color]+'standing.glb');

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

      if (modelPath === models[color]+'sittingarmdown.glb') {
        setTimeout(() => {
          loadCharacter(models[color]+'keepsittingarmdown.glb');
        }, sittingAnimationDuration * 1000 / 60); // 프레임당 60프레임을 기준으로 계산
      }

      if (modelPath === models[color]+'talking.glb') {
        setTimeout(() => {
          loadCharacter(models[color]+'standing.glb');
        }, talkingAnimationDuration * 1000 / 60); // 프레임당 60프레임을 기준으로 계산
      }
    
    
      player.model = model;
    }
  });
}

function updatePlayerRotation() {
  player.model.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z, 'YXZ');
}

function handleKeyDown(event) {
  console.log('Key down:', event.code);

  switch (event.code) {
    case 'Space':
      isWalking = !isWalking;
      if (isWalking) {
        player.initialRotation.copy(player.rotation);
        loadCharacter(models[color]+'walking.glb');
      } else {
        player.rotation.copy(player.rotation);
        updatePlayerRotation();
        loadCharacter(models[color]+'standing.glb');
        isWalking = false;

        // 토끼 모델 삭제 또는 숨김
        if (walkModel) {
          scene.remove(walkModel);
          walkModel = null;
        }
      }
      break;
    case 'KeyA':
        isSitting = !isSitting;
        if (isSitting) {
          // Store the current rotation as the initial rotation
          player.initialRotation.copy(player.rotation);
          loadCharacter(models[color]+'sittingarmdown.glb');
        } else {
          // Use the initial rotation stored as a quaternion
          player.rotation.copy(player.rotation);
          updatePlayerRotation();
          loadCharacter(models[color]+'standing.glb');
          isWalking = false;
        }
        break;
        case 'KeyS':
          isSkateboard = !isSkateboard;
          if (isSkateboard) {
            player.initialRotation.copy(player.rotation);
            loadCharacter(models[color]+'skatejump.glb');
          } else {
            player.rotation.copy(player.rotation);
            updatePlayerRotation();
            loadCharacter(models[color]+'standing.glb');
            isWalking = false;
    
            // 토끼 모델 삭제 또는 숨김
            if (skateboardModel) {
              scene.remove(skateboardModel);
              skateboardModel = null;
            }
          }
          break;
          case 'KeyD':
            pickup = !pickup;
            if (pickup) {
              // Store the current rotation as the initial rotation
              player.initialRotation.copy(player.rotation);
              loadCharacter(models[color]+'pickup.glb');
            } else {
              // Use the initial rotation stored as a quaternion
              player.rotation.copy(player.rotation);
              updatePlayerRotation();
              loadCharacter(models[color]+'standing.glb');
              isWalking = false;
            }
            break;
            case 'KeyF':
              isRunning = !isRunning;
              if (isRunning) {
                player.initialRotation.copy(player.rotation);
                loadCharacter(models[color]+'running.glb');
              } else {
                player.rotation.copy(player.rotation);
                updatePlayerRotation();
                loadCharacter(models[color]+'standing.glb');
                isWalking = false;
        
                // 토끼 모델 삭제 또는 숨김
                if (RunModel) {
                  scene.remove(RunModel);
                  RunModel = null;
                }
              }
              break;
    // case 'ArrowUp':
    //   moveBackward();
    //   break;
    // case 'ArrowDown':
    //   moveForward();
      break;
    case 'ArrowLeft':
      rotateLeft();
      break;
    case 'ArrowRight':
      rotateRight();
      break;
  }
}

const targetPosition = new THREE.Vector3();

function moveForward() {
  const currentSpeed = isRunning ? player.speed + 0.7 : player.speed;
  const angle = player.rotation.y;

  // 계산된 새로운 위치
  const newX = player.position.x - currentSpeed * Math.sin(angle);
  const newZ = player.position.z - currentSpeed * Math.cos(angle);

  // 새로운 위치가 허용된 범위를 벗어나지 않으면 갱신
  if (isWithinBounds(newX, newZ)) {
    player.position.x = newX;
    player.position.z = newZ;

    // Y 좌표 유지
    const targetY = player.position.y;
    player.position.lerp(new THREE.Vector3(player.position.x, targetY, player.position.z), 0.2);

    player.model.position.copy(player.position);
  }
}

function moveBackward() {
  const currentSpeed = isRunning ? player.speed + 0.6 : player.speed;
  const angle = player.rotation.y;

  // 계산된 새로운 위치
  const newX = player.position.x + currentSpeed * Math.sin(angle);
  const newZ = player.position.z + currentSpeed * Math.cos(angle);

  // 새로운 위치가 허용된 범위를 벗어나지 않으면 갱신
  if (isWithinBounds(newX, newZ)) {
    player.position.x = newX;
    player.position.z = newZ;

    // Y 좌표 유지
    const targetY = player.position.y;
    player.position.lerp(new THREE.Vector3(player.position.x, targetY, player.position.z), 0.2);

    player.model.position.copy(player.position);
  }
}

function isWithinBounds(x, z) {
  const withinFirstBounds = (x >= 31 && x <= 212 && z >= -157 && z <= 169.6);
  const withinSecondBounds = (x >= -85 && x <= 31 && z >= -210 && z <= 169.6);
  const additionalBounds = (x >= 14.7 && x <= 120 && (z >= -157 && z <= -124));

  return (withinFirstBounds || withinSecondBounds) && !additionalBounds;
}
function rotateLeft() {
  player.rotation.y += player.speed;
  updatePlayerRotation();
}

function rotateRight() {
  player.rotation.y -= player.speed;
  updatePlayerRotation();
}

function smoothMove() {
  const smoothness = 0.1; // 부드러움 정도를 조절할 수 있는 값

  player.position.lerp(targetPosition, smoothness);
  player.model.position.copy(player.position);
}

document.addEventListener('keydown', handleKeyDown);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
});

  function render() {
    renderer.render(scene, camera)
}

document.addEventListener('click', onDocumentClick);

function onDocumentClick(event) {
  event.preventDefault();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 마우스 좌표 설정
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 레이캐스터 업데이트
  raycaster.setFromCamera(mouse, camera);

  // 특정 객체들과의 교차 여부 확인
  const intersects = raycaster.intersectObjects([npc, npc2, npc3]); // 수정: 클릭 이벤트에 npc 추가

  if (intersects.length > 0) {
    // 클릭한 객체가 npc일 경우
    console.log('Clicked NPC!');
    
    let mixerToAdjust;
    if (intersects[0].object === npc) {
      mixerToAdjust = npcMixer;
    } else if (intersects[0].object === npc2) {
      mixerToAdjust = npc2Mixer;
    } else if (intersects[0].object === npc3) {
      mixerToAdjust = npc3Mixer;
    }

    // AnimationMixer가 존재하고 유효한 경우 속도 조절
    if (mixerToAdjust) {
      mixerToAdjust.timeScale = 0.2; // 예시에서는 0.5로 조절
    }
    loadCharacter(models[color]+'talking.glb')
  } else {
    // 클릭한 객체가 npc가 아닌 경우
    console.log('Clicked another object.');
  }
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  if (mixer) {
    // isRunning 상태일 때만 mixer의 속도를 높입니다.
    const mixerSpeed = isRunning ? 0.015 : 0.005;
    mixer.update(mixerSpeed);
  }

  if (npcMixer) npcMixer.update(0.003);
  if (npc2Mixer) npc2Mixer.update(0.003);
  if (npc3Mixer) npc3Mixer.update(0.004);
  if (npc4Mixer) npc4Mixer.update(0.003);
  if (npc5Mixer) npc5Mixer.update(0.004);
  if (isSkateboard) {
    moveSkateboard();
  }
  if (isWalking) {
    walk();
  }
  if (isRunning) {
    run();
  }
  console.log('Character Position:', player.position);
  console.log('Character Rotation:', player.rotation);
  camera.position.copy(player.position);
  camera.position.z += 25;
  camera.position.y += 15;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
  stats.update();
}

function moveSkateboard() {
  // 캐릭터를 기준으로 이동할 방향 계산
  const angle = player.rotation.y;
  const speed = skateboardSpeed;

  // 이동 전 위치 저장
  const previousPosition = player.position.clone();

  // 보드를 타는 동안 캐릭터의 위치를 조정
  player.position.x += speed * Math.sin(angle);
  player.position.z += speed * Math.cos(angle);

  // 허용된 범위를 확인하고, 허용되지 않으면 이전 위치로 되돌림
  if (!isWithinBounds(player.position.x, player.position.z)) {
    player.position.copy(previousPosition);
    player.model.position.copy(previousPosition);
  } else {
    // 캐릭터의 모델도 위치 갱신
    player.model.position.copy(player.position);
  }
}
  function walk() {
    // 캐릭터를 기준으로 이동할 방향 계산
    const angle = player.rotation.y;
    const speed = walkSpeed;
  
    // 이동 전 위치 저장
    const previousPosition = player.position.clone();
  
    // 보드를 타는 동안 캐릭터의 위치를 조정
    player.position.x += speed * Math.sin(angle);
    player.position.z += speed * Math.cos(angle);
  
    // 허용된 범위를 확인하고, 허용되지 않으면 이전 위치로 되돌림
    if (!isWithinBounds(player.position.x, player.position.z)) {
      player.position.copy(previousPosition);
      player.model.position.copy(previousPosition);
    } else {
      // 캐릭터의 모델도 위치 갱신
      player.model.position.copy(player.position);
    }
  }
    function run() {
      // 캐릭터를 기준으로 이동할 방향 계산
      const angle = player.rotation.y;
      const speed = runSpeed;
    
      // 이동 전 위치 저장
      const previousPosition = player.position.clone();
    
      // 보드를 타는 동안 캐릭터의 위치를 조정
      player.position.x += speed * Math.sin(angle);
      player.position.z += speed * Math.cos(angle);
    
      // 허용된 범위를 확인하고, 허용되지 않으면 이전 위치로 되돌림
      if (!isWithinBounds(player.position.x, player.position.z)) {
        player.position.copy(previousPosition);
        player.model.position.copy(previousPosition);
      } else {
        // 캐릭터의 모델도 위치 갱신
        player.model.position.copy(player.position);
      }
  // 토끼 모델 생성 또는 위치 갱신
  // if (!skateboardModel) {
  //   loader.load('/src/skate.glb', (gltf) => {
  //     skateboardModel = gltf.scene;
  //     skateboardModel.position.copy(player.position);
  //     scene.add(skateboardModel);
  //   });
  // } else {
  //   skateboardModel.position.copy(player.position);
  // }
}
  animate();
