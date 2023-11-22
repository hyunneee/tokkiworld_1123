import * as THREE from 'three';
console.log(THREE.REVISION);
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const textureLoader = new THREE.TextureLoader();
const backgroundImage = textureLoader.load('bg.jpeg');
scene.background = backgroundImage;

const planeGeometry = new THREE.PlaneGeometry(192, 108); // 가로 10, 세로 10 크기의 플레인 생성
const planeMaterial = new THREE.MeshBasicMaterial({ map: backgroundImage }); // 배경 이미지를 텍스처로 사용
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);

  const cubeMapLoader = new THREE.CubeTextureLoader();
  const cubeMap = cubeMapLoader.load([
   '/front.png', // Right,
   '/back.png','/top.png','/bottom.png','/right.png','/left.png'
]);
cubeMap.mapping = THREE.CubeRefractionMapping; // 필요에 따라 적절한 매핑 사용

// 큐브 맵을 배경으로 설정
scene.background = cubeMap;
const geometry = new THREE.BoxGeometry(1.5,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry,material);
// scene.add(cube);
const material2 = new THREE.LineBasicMaterial({color : 0x0000ff}, "Entrance");

  const ambientLight = new THREE.AmbientLight()
  scene.add(ambientLight)

  const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.2,
      1000
  )
  camera.position.set(3, 1, 3.0)

  const center = new THREE.Vector3(0, 0, 0);
  camera.lookAt(center);

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 1, 0)

  const loader = new GLTFLoader();
  let mixer;
  loader.load('/walking4.glb', (gltf) => {
      const model = gltf.scene;
      const animations = gltf.animations;
  
      if (model) {
          scene.add(model);
      }
  
      if (animations && animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
  
          animations.forEach((clip) => {
              mixer.clipAction(clip).play();
          });
      }
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

camera.position.z = 5;
  
const animate = () => {
    requestAnimationFrame(animate);

    // 모델에 대한 애니메이션 업데이트
    if (mixer) {
        mixer.update(0.01);
    }

    renderer.render(scene, camera);
};

animate();