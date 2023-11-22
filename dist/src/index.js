import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { WEBGL } from './webgl'


if (WEBGL.isWebGLAvailable()) {
  // code here
//   console.log(THREE);
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//   const renderer = new THREE.WebGLRenderer();
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   document.body.appendChild( renderer.domElement );
//   const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//   const cube = new THREE.Mesh( geometry, material );
//   scene.add( cube );
  
//   camera.position.z = 5;
//   function animate() {
//     requestAnimationFrame( animate );
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render( scene, camera );
//   }
//   animate();

//   const loader = new GLTFLoader();

//   loader.load( './src/Xbot.glb', function ( gltf ) {

// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );


  const scene = new THREE.Scene()
  scene.add(new THREE.AxesHelper(5))

  const light = new THREE.PointLight(0xffffff, 1000)
  light.position.set(0.8, 1.4, 1.0)
  scene.add(light)

  const ambientLight = new THREE.AmbientLight()
  scene.add(ambientLight)

  const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.set(0.8, 1.4, 1.0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(0, 1, 0)

  //const material = new THREE.MeshNormalMaterial()

  const fbxLoader = new FBXLoader()
  fbxLoader.load(
      './src/X_Bot.fbx',
      (object) => {
          // object.traverse(function (child) {
          //     if ((child as THREE.Mesh).isMesh) {
          //         // (child as THREE.Mesh).material = material
          //         if ((child as THREE.Mesh).material) {
          //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
          //         }
          //     }
          // })
          // object.scale.set(.01, .01, .01)
          // object.scale.set(.01,.01,.01)
          scene.add(object)
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
          console.log(error)
      }
  )

  const loader = new GLTFLoader();
  loader.load( './src/Xbot.glb', function ( gltf ) {
  
    scene.add( gltf.scene );
  
  }, undefined, function ( error ) {
  
    console.error( error );
  
  } );

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

      render()

      stats.update()
  }



  animate()


} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
