import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x22222222);
scene.fog = new THREE.Fog(0x22222222, 10, 80);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//camera
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 5);
controls.update();

let clock = new THREE.Clock();
const mixers = [];

// lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 20, 10);
scene.add(dirLight);

// ground
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshPhongMaterial({ color: 0x22222222, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

const grid = new THREE.GridHelper(200, 40, 0x6f6f6f, 0xc3a159);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  for (const mixer of mixers) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

function person() {
  const loader = new GLTFLoader();

  // Load a glTF resource
  loader.load(
    "models/capoeira.glb",
    function (gltf) {
      let model = gltf.scene;
      const model1 = SkeletonUtils.clone(model);
      const mixer1 = new THREE.AnimationMixer(model1);
      mixer1.clipAction(gltf.animations[0]).play();
      scene.add(model1);
      mixers.push(mixer1);
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log("An error happened");
    }
  );
}
person();
animate();
