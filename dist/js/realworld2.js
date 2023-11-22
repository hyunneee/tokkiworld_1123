import * as THREE from 'three';
console.log(THREE.REVISION);
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { AxesHelper } from 'three';


// if (WebGL.isWebGLAvailable()) {
  const scene = new THREE.Scene();
//scene.add(new THREE.AxesHelper(5));

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('/back.png');
scene.background = backgroundImage;

const planeGeometry = new THREE.PlaneGeometry(10, 20); // 가로 10, 세로 10 크기의 플레인 생성
const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundImage }); // 배경 이미지를 텍스처로 사용
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//scene.add(plane);

  const cubeMapLoader = new THREE.CubeTextureLoader();
  const cubeMap = cubeMapLoader.load([
   '/front.png', // Right,
   '/back.png','/top.png','/bottom.png','/right.png','/left.png'
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
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 1, 3.0);
camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(center);

// 큐브의 중심을 포커스로 설정
const boundingBox = new THREE.Box3().setFromObject(cube);
const target = new THREE.Vector3();
boundingBox.getCenter(target);
camera.lookAt(target);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.5, 0);

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



  // loader.load('src/walking2.glb', (gltf) => {
  //   model = gltf.scene;
  //   scene.add(model);

  //   // Extract animations from the loaded model
  //   mixer = new THREE.AnimationMixer(model);
  //   const animations = gltf.animations;
  //   if (animations && animations.length) {
  //     animations.forEach((clip) => {
  //       mixer.clipAction(clip).play();
  //     });
  //   }
  // });



// GLB 파일 로드
loader.load('/src/cafe_soca.glb', (gltf) => {
  // 모델의 씬을 현재 씬에 추가
  scene.add(gltf.scene);

  // 로드된 메쉬에 대한 조작
  const yourMesh = gltf.scene.children[0]; // 로드된 모델의 첫 번째 메쉬를 가져옴

  // 메쉬의 위치 변경
  yourMesh.position.set(-85, 5, -155);

  // 메쉬의 크기 변경
  yourMesh.scale.set(0.8, 0.8, 0.8);
  
  //yourMesh.rotation.set(0, 0, 0);

  animate();
}, undefined, (error) => {
  console.error(error);
});


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
    requestAnimationFrame(animate)

    controls.update()

    //render()
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // camera.rotation.y += 0.01;
    // camera.position.x = Math.cos(Date.now() * 0.0005) * 4;
    // camera.position.z = Math.sin(Date.now() * 0.0005) * 4;

    // 중심을 바라보도록 업데이트
    // camera.lookAt(center);
  //  if (mixer) mixer.update(0.016); 
    renderer.render(scene,camera);
    
    stats.update()
}
  animate();
  

// } else {
//   var warning = WebGL.getWebGLErrorMessage()
//   document.body.appendChild(warning)
// }