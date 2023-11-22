import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const cubeMapLoader = new THREE.CubeTextureLoader();
const cubeMap = cubeMapLoader.load([
  '/front.png', // Right,
  '/back.png', '/top.png', '/bottom.png', '/right.png', '/left.png'
]);
cubeMap.mapping = THREE.CubeRefractionMapping; // 필요에 따라 적절한 매핑 사용
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

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
)
camera.position.set(38, 12, 24)

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
  gltf.scene.position.set(20, 1, 1);
  // gltf.scene.scale.set(0.05,0.05,0.05);

  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});
// chair 
const chair = new GLTFLoader();
chair.load('/src/chair.glb', function (gltf) {
  gltf.scene.position.set(20, 3, 3);
  gltf.scene.scale.set(5, 5, 5);

  scene.add(gltf.scene);

}, undefined, function (error) {

  console.error(error);

});

// const tokki = new GLTFLoader();
// tokki.load('/src/standing_lambert.glb', function (gltf) {
//   const model = gltf.scene;
//   const animations = gltf.animations;

//   model.scale.set(90,90,90);
//   model.rotation.set(0, Math.PI / 4, 0)

//   if (model) {
//     scene.add(model);
//   }

//   if (animations && animations.length > 0) {
//     mixer = new THREE.AnimationMixer(model);

//     animations.forEach((clip) => {
//       mixer.clipAction(clip).play();
//     });
//   }

//   model.traverse((node) => {
//     if (node.isMesh) {
//       node.material.color.set(0xff0000); // 빨간색
//     }
//   });

// }, undefined, function (error) {

//   console.error(error);

// });

const loader2 = new FontLoader();

// 캐릭터 메쉬
let character;

// FBX 로더 생성
const loader = new FBXLoader();

// 여러 개의 FBX 파일 경로
const animations = ['/src/Capoeira.fbx'];

// 모든 애니메이션을 저장할 Mixer
const mixer = new THREE.AnimationMixer();

// FBX 로드 함수
function loadFBX(url) {
  loader.load(url, (fbx) => {
    // 캐릭터의 위치, 크기, 회전 등을 설정
    fbx.scale.set(0.1, 0.1, 0.1);
    fbx.position.set(0, 0, 0);
    fbx.rotation.set(0, Math.PI / 2, 0);

    // 캐릭터를 씬에 추가
    scene.add(fbx);

    console.log(fbx.animations);
    // 캐릭터에 애니메이션을 추가
    const animation = mixer.clipAction(fbx.animations[1]);
    animation.play();

    // 첫 번째 애니메이션은 캐릭터에 바로 적용
    if (!character) {
      character = fbx;
    } else {
      // 두 번째 이후의 애니메이션은 현재 캐릭터에 결합
      const nextAnimation = mixer.clipAction(fbx.animations[1]);
      nextAnimation.play();
      character.animations.push(...fbx.animations);
    }
  });
}

// 각 애니메이션을 로드
animations.forEach((animation) => {
  loadFBX(animation);
});
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  clickableObject.position.y = Math.cos(Date.now() * 0.002) - 2;
  // 중심을 바라보도록 업데이트
  camera.lookAt(center);
  mixer.update(0.0167); // 매 프레임마다 업데이트 (60 FPS 기준)

  renderer.render(scene, camera);
  // console.log("Camera Position:", camera.position);
  //   stats.update()
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('3d-container').appendChild(renderer.domElement);
// 클릭 이벤트 리스너 등록
document.addEventListener("mousedown", onDocumentMouseDown, false);

animate();
