import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const like = localStorage.getItem("like");
const color = localStorage.getItem("color");
    
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('/back.png');
scene.background = backgroundImage;

const planeGeometry = new THREE.PlaneGeometry(10, 20); // 가로 10, 세로 10 크기의 플레인 생성
const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundImage }); // 배경 이미지를 텍스처로 사용
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// scene.add(plane);

const geometry = new THREE.BoxGeometry(2, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const clickableObject = new THREE.Mesh(geometry, material);
// scene.add(clickableObject);
// scene.remove(clickableObject);
// Raycaster 생성
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// 클릭 이벤트 핸들러 함수
function onDocumentMouseDown(event) {
  event.preventDefault();

  // 마우스 좌표를 정규화
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycaster를 사용하여 클릭된 물체를 검출
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(clickableObject);

  if (intersects.length > 0) {
    // 클릭된 물체가 있을 경우, 다른 페이지로 이동
    // window.location.href = "tokkicard.html";
  }
}

// 클릭 이벤트 리스너 등록
document.addEventListener("mousedown", onDocumentMouseDown, false);

// 큐브 맵을 배경으로 설정
scene.background = cubeMap;

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
controls.enableDamping = true
controls.target.set(0, 1, 0)
const phone = new GLTFLoader();
phone.load('/src/phone.gltf', function (gltf) {

  gltf.scene.position.set(2, 1, 15);
  gltf.scene.rotation.set(0, Math.PI / 4, 0)
  gltf.scene.scale.set(5, 5, 5);
  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});

const vr = new GLTFLoader();
vr.load('/src/hmd.glb', function (gltf) {


  scene.add(gltf.scene);
  // 모델의 위치 및 크기 조정 (예: x축으로 2, y축으로 1, z축으로 -3 이동하고, 크기는 0.5배로 축소)
  gltf.scene.position.set(40, -1, -5);
  gltf.scene.rotation.set(0, Math.PI / 4, 0)
  gltf.scene.scale.set(0.03, 0.03, 0.03);


}, undefined, function (error) {

  console.error(error);

});
// table !!!
const table = new GLTFLoader();
table.load('/src/table.glb', function (gltf) {
  gltf.scene.position.set(20, 0, 1);
  gltf.scene.scale.set(1,1,1);

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

const loader = new GLTFLoader();
let mixer;
let player = { rotation: { x: 0, y: 0, z: 0 }, model: null, speed: 0.2 };
loader.load('/src/baedal_lambert.glb', (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;

    if (model) {
        scene.add(model);
        // model.position.set(15.550891422146924, 0, 8.30990758982472);
        model.position.set(19.97832139710467, 0, -1.4186422517307784)

        // model.rotation.set(0,Math.PI/4+0.2,0);
        model.scale.set(90, 90, 90);
    }

    if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);

        animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

   
      player.model = model;

      // 키보드 입력 감지
      document.addEventListener('keydown', (event) => {
          handleKeyDown(event, player);
      });
    }
});

function handleKeyDown(event, player) {
  switch (event.code) {
      case 'ArrowUp':
          moveForward(player);
          break;
      case 'ArrowDown':
          moveBackward(player);
          break;
      case 'ArrowLeft':
          rotateRight(player);
          break;
      case 'ArrowRight':
          rotateLeft(player);
          break;
  }

player.model.position.copy(player.model.position);
player.model.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z);
}


function moveForward(player) {
  const speed = player.speed;
  const angle = player.rotation.y;

  player.model.position.x -= speed * Math.sin(angle);
  player.model.position.z -= speed * Math.cos(angle);
}



function moveBackward(player) {
const speed = player.speed;
const angle = player.rotation.y;

player.model.position.x += speed * Math.sin(angle);
player.model.position.z += speed * Math.cos(angle);
}


function rotateLeft(player) {
player.rotation.y += player.speed; // 회전 속도만큼 각도 증가
}


function rotateRight(player) {
player.rotation.y -= player.speed; // 회전 속도만큼 각도 감소
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function render() {
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  clickableObject.position.y = Math.cos(Date.now() * 0.002) - 2;
  // 중심을 바라보도록 업데이트
  camera.lookAt(center);
  if (mixer) mixer.update(0.008);
// mixer.update(0.0167); // 매 프레임마다 업데이트 (60 FPS 기준)

  renderer.render(scene, camera);
  console.log("Camera Position:", camera.position);

  console.log(player.model.position);
  stats.update()
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);
// 클릭 이벤트 리스너 등록

animate();
