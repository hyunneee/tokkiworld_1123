import * as THREE from '/node_modules/three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';

const like = localStorage.getItem("like");
var color = localStorage.getItem("color");

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5));

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('/back.png');
scene.background = backgroundImage;

const planeGeometry = new THREE.PlaneGeometry(10, 20); // 가로 10, 세로 10 크기의 플레인 생성
const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundImage }); // 배경 이미지를 텍스처로 사용
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//scene.add(plane);

// Raycaster 생성
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 나머지 코드는 그대로 유지
const ambientLight = new THREE.AmbientLight(0xffffff, 1.7)
scene.add(ambientLight)
// Directional Light 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
)
camera.position.set(32.58024999999986, 12, 24)

const center = new THREE.Vector3(0, 0, 0);
//   camera.lookAt(center);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = false; // 카메라 회전 비활성화
controls.enableZoom = false;   // 확대, 축소 비활성화
controls.enableDamping = true
controls.target.set(0, 1, 0)

// model load
const phone = new GLTFLoader();
phone.load('/src/phone.glb', function (gltf) {

  gltf.scene.position.set(2, 1, 15);
  gltf.scene.rotation.set(0,0.7, 0)
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});

const vr = new GLTFLoader();
let vrModel;
vr.load('/src/hmd.glb', function (gltf) {

  vrModel = gltf.scene;
  scene.add(gltf.scene);
  // const vrmesh = gltf.scene;
  // 모델의 위치 및 크기 조정 (예: x축으로 2, y축으로 1, z축으로 -3 이동하고, 크기는 0.5배로 축소)
  gltf.scene.position.set(10, -8, 15);
  gltf.scene.rotation.set(0, 0, 0)
  gltf.scene.scale.set(80, 80, 80);


}, undefined, function (error) {

  console.error(error);

});
// table !!!
const table = new GLTFLoader();
table.load('/src/table.glb', function (gltf) {
  gltf.scene.position.set(20, 0, 1);
  gltf.scene.scale.set(1, 1, 1);

  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});
// chair 
const chair = new GLTFLoader();
chair.load('/src/chair2.glb', function (gltf) {
  gltf.scene.position.set(20, 2, -3);
  gltf.scene.scale.set(2, 2, 2);

  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});
const arrow = new GLTFLoader();
let arrowModel; // 배달
arrow.load('/src/mouse_arrow.glb', function (gltf) {
  arrowModel = gltf.scene;
  gltf.scene.position.set(22, 2, 5);
  gltf.scene.rotation.set(0, Math.PI / 4, 0)
  // gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});

const arrow2 = new GLTFLoader();
let arrowModel2; //폰
arrow.load('/src/mouse_arrow.glb', function (gltf) {
  arrowModel2 = gltf.scene;
  gltf.scene.position.set(5, 2, 15);
  gltf.scene.rotation.set(0, Math.PI / 4, 0)
  // gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

}); const arrow3 = new GLTFLoader();
let arrowModel3; // vr
arrow.load('/src/mouse_arrow.glb', function (gltf) {
  arrowModel3 = gltf.scene;
  gltf.scene.position.set(15, 1, 17);
  gltf.scene.rotation.set(0, Math.PI / 4, 0)
  // gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});
// 장식 model load
const wifi = new FBXLoader();
let wifiModel;

wifi.load('/src/wifi.fbx', (fbx) => {
  wifiModel = fbx;
  // 모델의 초기 위치, 회전 및 크기 조정
  wifiModel.position.set(-10, 15, 30);
  wifiModel.rotation.set(0, Math.PI / 2, 0);
  // wifiModel.scale.set(1, 1, 1);

  scene.add(wifiModel);

  // 애니메이트 함수에 모델을 회전시키는 로직 추가
  animate();
});

const call = new FBXLoader();
let callModel;
call.load('/src/call.fbx', (fbx) => {
  callModel = fbx;
  // Adjust the position, rotation, and scale of the loaded model as needed
  callModel.position.set(-50, 15, -40);
  callModel.rotation.set(0, Math.PI / 4, 0);
  callModel.scale.set(3, 3, 3);

  scene.add(callModel);
  animate();
});

const msg = new FBXLoader();
let msgModel;
msg.load('/src/msg2.fbx', (fbx) => {
  msgModel = fbx;
  // Adjust the position, rotation, and scale of the loaded model as needed
  msgModel.position.set(-5, -15, 35);
  msgModel.rotation.set(0, Math.PI / 2, 0);
  msgModel.scale.set(1, 1, 1);
  scene.add(msgModel);
  animate();
});

const message = new FBXLoader();
let messageModel;
message.load('/src/message.fbx', (fbx) => {
  messageModel = fbx;
  // Adjust the position, rotation, and scale of the loaded model as needed
  messageModel.position.set(30, 3, 10);
  messageModel.rotation.set(0, Math.PI / 5, 0);
  messageModel.scale.set(1, 1, 1);

  scene.add(messageModel);
  animate();
});

const airplane = new FBXLoader();
let airplaneModel;
let airplaneGroup = new THREE.Group();

airplane.load('/src/plane.fbx', (fbx) => {
  airplaneModel = fbx;
  // Adjust the position, rotation, and scale of the loaded model as needed
  airplaneModel.position.set(-20, 2, -150);
  airplaneModel.rotation.set(0, 0, 0);
  airplaneModel.scale.set(30, 30, 30);

  // Add the airplane model to the group
  airplaneGroup.add(airplaneModel);

  // (Optional) If the model has animations, you can play them
  const mixer = new THREE.AnimationMixer(airplaneModel);
  const animations = airplaneModel.animations;

  if (animations && animations.length > 0) {
    const action = mixer.clipAction(animations[0]); // Adjust the index if your model has multiple animations
    action.play();
  }

  scene.add(airplaneGroup);

  // Animate function to rotate the airplane group around the camera
  animate();
});


const folder = new FBXLoader();
let folderModel;
let folderDelta = 0.01; // 띠용띠용 움직임의 속도 및 방향을 조절

folder.load('/src/folder.fbx', (fbx) => {
  folderModel = fbx;
  // Adjust the position, rotation, and scale of the loaded model as needed
  folderModel.position.set(22, -2, 18);
  folderModel.rotation.set(0, Math.PI / 3, 0);
  folderModel.scale.set(1, 1, 1);

  scene.add(folderModel);

  animate();
});

// character model load
const loader = new GLTFLoader();
let mixer;
let player = { rotation: { x: 0, y: 0, z: 0 }, model: null, speed: 0.2 };
let first = true;

const models = {
  pink: '/src/glb_pink/',
  yellow: '/src/glb_yellow/',
  green: '/src/glb_green/',
  blue: '/src/glb_blue/',
  purple: '/src/glb_purple/',
  default: '/src/glb_pink/'
};

const interactions = {
  default: 'standing.glb',
  baedal: 'baedal.glb',
  phone1: 'komin.glb',
  phone2: 'talking.glb',
  vr: 'vrgame.glb'
}

console.log("vrmesh", vrModel)
function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    var clickedObject = intersects[0].object;
    console.log("Clicked Object:", clickedObject);

    switch (clickedObject.name) {
      case vrModel:
        loadCharacter(models[color] + interactions['vr'], 'vr');
        console.log(models[color] + interactions['vr'], 'vr')
        break;
      case "pCylinder6_blinn1_0": // table
      // 모델1에 대한 애니메이션 실행
      case "defaultMaterial": // chair
        loadCharacter(models[color] + interactions['baedal'], 'baedal')
        console.log(models[color] + interactions['baedal'], 'baedal')
        // 모델2에 대한 애니메이션 실행
        break;
      // 다른 모델에 대한 경우 추가
      case "Object_3": //iphone
        loadCharacter(models[color] + interactions['phone2'], 'phone2')
        console.log(models[color] + interactions['phone1'], 'phone1')
        break;
      case "pasted__polySurface162":
      case "pasted__polySurface146":
      case "pasted__polySurface131":
      case "pasted__polySurface172":
      case "pasted__polySurface166":
      case "pasted__polySurface146":
      case "pasted__polySurface163":
        loadCharacter(models[color] + interactions['vr'], 'vr')
        break;

    }
  }
}

var path = models[color] + 'standing.glb';

console.log(path)

function loadCharacter(glbPath, like) {
  loader.load(glbPath, (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;
    console.log("Loaded Character:", model, like); // 추가된 부분
    console.log("Animations:", animations); // 추가된 부분

    console.log(gltf);

    // 기존 캐릭터가 있다면 제거
    if (player.model && !first) {
      console.log("Removing Previous Character"); // 추가된 부분
      scene.remove(player.model);
    }
    console.log(player.model);

    if (model) {
      scene.add(model);
      console.log("Setting Position, Rotation, Scale"); // 추가된 부분

      model.position.set(15.550891422146924, 0, 8.30990758982472);
      model.rotation.set(0, Math.PI / 4 + 0.2, 0);
      // model.position.set(19.97832139710467, 0, -1.4186422517307784)

      model.scale.set(90, 90, 90);
      if (like == 'baedal') {
        // model.position.set(15.550891422146924, 0, 8.30990758982472);
        model.position.set(19.97832139710467, 0, -1.4186422517307784)
        console.log('baedal check')
        vrModel.visible = true;
        arrowModel.visible = false;  // 수정된 부분
        arrowModel2.visible = true;  // 추가된 부분
        arrowModel3.visible = true; // 추가된 부분

        // model.rotation.set(0,,0);
        model.rotation.set(0, -(Math.PI / 4 - 0.6), 0);
      } else if (like == 'phone1') {
        model.rotation.set(0, Math.PI + 0.7, 0)
        model.position.set(6, 0, 20)
        vrModel.visible = true;
        arrowModel.visible = true;  // 수정된 부분
        arrowModel2.visible = false;  // 추가된 부분
        arrowModel3.visible = true; // 추가된 부분

      } else if (like == 'phone2') {
        model.rotation.set(0, Math.PI + 0.7, 0)
        model.position.set(6, 0, 20)
        vrModel.visible = true;
        arrowModel.visible = true;  // 수정된 부분
        arrowModel2.visible = false;  // 추가된 부분
        arrowModel3.visible = true; // 추가된 부분
      } else if (like == 'vr') {
        model.position.set(10, 0, 15);
        vrModel.visible = false;
        arrowModel.visible = true;  // 추가된 부분
        arrowModel2.visible = true; // 추가된 부분
        arrowModel3.visible = false; // 추가된 부분
      } else {
        // 추가된 부분: 기본적으로 다 보이게 설정
        // arrowModel.visible = true;
        // arrowModel2.visible = true;
        // arrowModel3.visible = true;
      }
    }

    if (animations && animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);

      animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      player.model = model;
      first = false;
    }
  });
}

document.addEventListener("mousedown", onDocumentMouseDown, false);

window.addEventListener('load', () => {
  updatePositionWithCSS();
  loadCharacter(); // 또는 다른 초기 캐릭터 경로
  color = 'pink';
  // localStorage.setItem("color", 'pink');
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const stats = new Stats()
// document.body.appendChild(stats.dom)

function render() {
  renderer.render(scene, camera)
}
let delta = 0.001; // 띠용띠용 움직임의 속도 및 방향을 조절

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  // 모델 회전 처리
  if (arrow.model) {
    arrow.model.rotation.y += 0.01; // 회전 속도 조절
  }
  // clickableObject.position.y = Math.cos(Date.now() * 0.002) - 2;
  // 중심을 바라보도록 업데이트
  camera.lookAt(center);
  if (mixer) mixer.update(0.0008);
  // mixer.update(0.0167); // 매 프레임마다 업데이트 (60 FPS 기준)
  airplaneGroup.position.sub(center); // Translate the group to the origin
  airplaneGroup.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005); // Rotate the group
  airplaneGroup.position.add(center); // Translate the group back to its original position
  if (arrowModel) {
    arrowModel.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (arrowModel.position.y > 3 || arrowModel.position.y < 2) {
      delta = -delta;
    }
  }

  // arrowModel2 띠용띠용 움직임
  if (arrowModel2) {
    arrowModel2.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (arrowModel2.position.y > 3 || arrowModel2.position.y < 2) {
      delta = -delta;
    }
  }

  // arrowModel3 띠용띠용 움직임
  if (arrowModel3) {
    arrowModel3.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (arrowModel3.position.y > 3 || arrowModel3.position.y < 2) {
      delta = -delta;
    }
  }
  if (wifiModel) {
    // wifiModel.rotation.y += 0.01; // 적절한 회전 속도를 선택하세요.

    wifiModel.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (wifiModel.position.y > 15.5 || wifiModel.position.y < 14.5) {
      delta = -delta;
    }
  }
  if (callModel) {
    // wifiModel.rotation.y += 0.01; // 적절한 회전 속도를 선택하세요.
    callModel.position.y += delta;
    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (callModel.position.y > 15.5 || callModel.position.y < 14.5) {
      delta = -delta;
    }
  }
  if (msgModel) {
    // wifiModel.rotation.y += 0.01; // 적절한 회전 속도를 선택하세요.
    msgModel.position.y += delta;
    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (msgModel.position.y > -10 || msgModel.position.y < -16) {
      delta = -delta;
    }
  }
  if (folderModel) {
    folderModel.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (folderModel.position.y > 0 || folderModel.position.y < -4) {
      folderDelta = -folderDelta;
    }
  }

  if (messageModel) {
    messageModel.position.y += delta;

    // 모델의 y 위치가 일정 범위를 벗어나면 방향을 반대로 변경하여 띠용띠용 효과 생성
    if (messageModel.position.y > 20 || messageModel.position.y < 10) {
      delta = -delta;
    }
  }
  const distance = 180; // 근처를 돌면서 공전하는 반경
  const angleSpeed = 0.001; // 회전 속도

  const x = Math.sin(Date.now() * angleSpeed) * distance;
  const z = Math.cos(Date.now() * angleSpeed) * distance;

  airplaneGroup.position.set(-x, 0, -z);
  airplaneGroup.rotation.y -= 0.001; // 적절한 회전 속도를 선택하세요.

  // console.log("Camera Position:", camera.position);
  if (first) {
    loadCharacter(models[color] + interactions['default'], 'default');
    first = false;
  }
  renderer.render(scene, camera);

  // console.log(player.model.position);
  stats.update()
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);
// 클릭 이벤트 리스너 등록

animate();
