document.addEventListener("DOMContentLoaded", function () {
    // "뒤로 가기" 이미지 클릭 시 이전 페이지로 이동
    const back_tokki = document.getElementById('tokki');
    back_tokki.addEventListener('click', function () {
      window.location.href = '/html/info.html';
      // window.history.back();
    });
    const to_carrot = document.getElementById('carrot');
    to_carrot.addEventListener('click', function () {
      localStorage.setItem("color", color);
      // 다음 페이지로 이동할 URL을 설정합니다.
      let nextPageURL;
      nextPageURL = '/html/q1.html'
      window.location.href = nextPageURL;
    });

  });

  
import * as THREE from "/node_modules/three";
// ./node_modules/three/build/three.module.js";
// console.log(THREE.REVISION);
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5));


scene.background = new THREE.Color(0xFFE7E0); // 여기에서 적절한 색상을 선택하세요.

const geometry = new THREE.BoxGeometry(1.5, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xF2F2F2 });
const cube = new THREE.Mesh(geometry, material);
const material2 = new THREE.LineBasicMaterial({ color: 0xF2F2F2 }, "Entrance");

const ambientLight = new THREE.AmbientLight(0xffffff, 1.7)
scene.add(ambientLight)

// Directional Light 추가
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// camera.position.set(3.1395840874964187, 4.306009350071414, 33.1594603628173)
// camera.position.set(2.0574297272114754, 3.0836104414265253, 20.891128470988416)
// camera.position.set(13.73102415826073, 4.574175745639389, 15.610827705471467)
// camera.position.set(115.68747567015163, 30.450522444870796, 124.96014430792287)
// camera.rotation.set(0,0,Math.PI);
camera.position.set(0, 8, 110);
// camera.lookAt(0,0,-Math.PI);

const center = new THREE.Vector3(0, 0, 0);
// camera.lookAt(center);

const renderer = new THREE.WebGLRenderer()
// renderer.setSize(640, 864)
renderer.setSize(window.innerWidth*0.8, window.innerHeight*0.8);

document.body.appendChild(renderer.domElement)

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.target.set(0, 1, 0)

// 원기둥 생성
// 원기둥 생성
const cylinderGeometry = new THREE.CylinderGeometry(3, 3, 1, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xE6E6E6 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
// cylinder.position.set(29.322429031925957, -1, 30.990402737891607); // 가운데 밑에 위치
cylinder.position.set(0,0,0);
scene.add(cylinder);

const loader = new GLTFLoader();
let mixer;
let player = { rotation: { x: 0, y: 0, z: 0 }, model: null, speed: 0.2 };
let first = true;

function loadCharacter(glbPath) {
  loader.load(glbPath, (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;
    // console.log(gltf);
    
    // 기존 캐릭터가 있다면 제거
    if (player.model && !first) {
      scene.remove(player.model);
    }

    if (model) {
      scene.add(model);
      model.position.set(0,0.2,0);
      console.log(model.position);
      model.scale.set(100, 100, 100);
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
var color;

window.addEventListener('load', () => {
  updatePositionWithCSS();
  loadCharacter('/src/glb_pink/standing.glb'); // 또는 다른 초기 캐릭터 경로
  color = 'pink';
  // localStorage.setItem("color", 'pink');
});

document.getElementById('character1').addEventListener('click', () => {
  loadCharacter('/src/glb_pink/standing.glb');
  color = 'pink';
  // localStorage.setItem("color", 'pink');
});
// Handle clicks on circles to change characters
document.getElementById('character2').addEventListener('click', () => {
  loadCharacter('/src/glb_yellow/standing.glb');
  color = 'yellow';
  // localStorage.setItem("color", 'yellow');
});

document.getElementById('character3').addEventListener('click', () => {
  loadCharacter('/src/glb_green/standing.glb');
  color = 'green';
  // localStorage.setItem("color", 'green');
});

document.getElementById('character4').addEventListener('click', () => {
  loadCharacter('/src/glb_blue/standing.glb');
  color = 'blue';
  // localStorage.setItem("color", 'blue');
});

document.getElementById('character5').addEventListener('click', () => {
  loadCharacter('/src/glb_purple/standing.glb');
  color = 'purple';
  // localStorage.setItem("color", 'purple');
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    // renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
// document.body.appendChild(stats.dom)

function render() {
  renderer.render(scene, camera)
}

// CSS를 사용하여 3D 객체의 위치를 변경합니다.
function updatePositionWithCSS() {
  const cubeDiv = document.getElementById('3d-container');
}

document.getElementById('3d-container').appendChild(renderer.domElement);

const animate = () => {
  requestAnimationFrame(animate);

  // controls.update()

  // 각 로드된 메쉬에 대해 애니메이션 Mixer 업데이트
  if (mixer) mixer.update(0.008);

  //render()
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // camera.rotation.y += 0.01;
  // camera.position.x = Math.cos(Date.now() * 0.0005) * 4;
  // camera.position.z = Math.sin(Date.now() * 0.0005) * 4;

  // 중심을 바라보도록 업데이트
  // camera.lookAt(center);
  // console.log(camera.position);
  
  renderer.render(scene, camera);
  // console.log(color);
  stats.update()
};

animate();