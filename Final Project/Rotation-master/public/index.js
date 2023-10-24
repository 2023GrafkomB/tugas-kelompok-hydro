import * as THREE from "/node_modules/three/build/three.module.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";

//global declaration
let scene;
let camera;
let renderer;
const canvas = document.getElementsByTagName("canvas")[0];
scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;
camera.position.x = 0;
scene.add(camera);

//default renderer
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setClearColor(0x000000, 0.0);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 2; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//sun object
const color = new THREE.Color("#FFA500");
const geometry = new THREE.IcosahedronGeometry(3, 15);
const material = new THREE.MeshBasicMaterial({ color: color });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(-50, 20, -60);
sphere.layers.set(1);
scene.add(sphere);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("texture/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);

//earth geometry
const earthgeometry = new THREE.SphereGeometry(0.98, 32, 32);

//earth material
const earthMaterial = new THREE.MeshPhongMaterial({
  roughness: 1,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/earthmap1.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
  bumpScale: 0.3,
});

//earthMesh
const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthMesh.castShadow = true;
earthMesh.layers.set(0);
scene.add(earthMesh);


//cloud geometry
const cloudgeometry = new THREE.SphereGeometry(1, 32, 32);

//cloud material
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture("texture/earthCloud.png"),
  transparent: true,
});

//cloudMesh
const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
earthMesh.layers.set(0);
scene.add(cloud);

//moon geometry
const moongeometry = new THREE.SphereGeometry(0.2, 32, 32);

//moon material
const moonMaterial = new THREE.MeshPhongMaterial({
  roughness: 5,
  metalness: 0,
  map: THREE.ImageUtils.loadTexture("texture/moonmap4k.jpg"),
  bumpMap: THREE.ImageUtils.loadTexture("texture/moonbump4k.jpg"),
  bumpScale: 0.02,
});

//moonMesh
const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
moonMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.position.x = 2;
moonMesh.layers.set(0);
scene.add(moonMesh);

var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);

var cameraPivot = new THREE.Object3D();
earthMesh.add(cameraPivot);
cameraPivot.add(camera);

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

//point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.2;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);

//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

// Mendapat referensi audio
const audio = document.getElementById("backgroundMusic");

// Memutar audio
function playBackgroundMusic() {
  audio.play();
}

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add damping for smooth movement
controls.dampingFactor = 0.05; // Adjust the damping factor to control the damping effect
controls.rotateSpeed = 0.5; // Adjust the rotation speed

// Get the slider element and the text element displaying the value
const ambientLightSlider = document.getElementById("ambient-light-slider");
const ambientLightValue = document.getElementById("ambient-light-value");

// Function to update the ambient light intensity
function updateAmbientLightIntensity() {
  const intensity = parseFloat(ambientLightSlider.value);
  ambientlight.intensity = intensity;
  ambientLightValue.textContent = intensity.toFixed(2);
}

// Add an event listener to the slider to update the ambient light
ambientLightSlider.addEventListener("input", updateAmbientLightIntensity);

// Initialize the ambient light intensity
updateAmbientLightIntensity();

// Get the point light slider element and the text element displaying the value
const pointLightSlider = document.getElementById("point-light-slider");
const pointLightValue = document.getElementById("point-light-value");

// Function to update the point light intensity
function updatePointLightIntensity() {
  const intensity = parseFloat(pointLightSlider.value);
  pointLight.intensity = intensity;
  pointLightValue.textContent = intensity.toFixed(2);
}

// Add an event listener to the point light slider to update the point light
pointLightSlider.addEventListener("input", updatePointLightIntensity);

// Initialize the point light intensity
updatePointLightIntensity();

// Get the zoom slider element and the text element displaying the value
const zoomSlider = document.getElementById("zoom-slider");
const zoomValue = document.getElementById("zoom-value");

// Function to update the camera's position (zoom)
function updateCameraZoom() {
  const zoom = parseFloat(zoomSlider.value);
  camera.position.z = zoom;
  zoomValue.textContent = zoom.toFixed(1);
}

// Add an event listener to the zoom slider to update the camera's position
zoomSlider.addEventListener("input", updateCameraZoom);

// Initialize the camera's position (zoom)
updateCameraZoom();

//animation loop
const animate = () => {
  playBackgroundMusic();
  requestAnimationFrame(animate);
  controls.update(); // Update the controls in the animation loop

  cloud.rotation.y-=0.0002;
  moonPivot.rotation.y -= 0.005;
  moonPivot.rotation.x = 0.5;
  cameraPivot.rotation.y += 0.001;
  starMesh.rotation.y += 0.0002;
  camera.layers.set(1);
  bloomComposer.render();
  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
};

// Event listener untuk klik objek bumi
earthMesh.addEventListener("click", () => {
  // Tindakan yang ingin Anda lakukan ketika objek bumi diklik
  console.log("Objek bumi diklik");
});

// Event listener untuk mousedown (tahan mouse)
document.addEventListener("mousedown", (event) => {
  if (event.target === canvas) {
    canvas.requestPointerLock();
  }
});

// Event listener saat pointer dikunci
document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    // Pointer dikunci, aktifkan kontrol mouse
    isRotating = true;
  } else {
    // Pointer dilepas, nonaktifkan kontrol mouse
    isRotating = false;
  }
});

// Event listener untuk mousemove
document.addEventListener("mousemove", (event) => {
  if (isRotating) {
    // Rotasi kamera berdasarkan pergerakan mouse
    cameraPivot.rotation.y += event.movementX * 0.01;
    cameraPivot.rotation.x += event.movementY * 0.01;
  }
});

// Event listener untuk keydown (tombol keyboard ditekan)
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      // Geser kamera ke depan
      cameraPivot.position.z -= 0.1;
      break;
    case "s":
      // Geser kamera ke belakang
      cameraPivot.position.z += 0.1;
      break;
    case "a":
      // Geser kamera ke kiri
      cameraPivot.position.x -= 0.1;
      break;
    case "d":
      // Geser kamera ke kanan
      cameraPivot.position.x += 0.1;
      break;
    case "q":
      // Putar kamera ke kiri
      cameraPivot.rotation.y += 0.1;
      break;
    case "e":
      // Putar kamera ke kanan
      cameraPivot.rotation.y -= 0.1;
      break;
    case "+":
      // Zoom in (geser kamera lebih dekat)
      cameraPivot.position.y -= 0.1;
      break;
    case "-":
      // Zoom out (geser kamera lebih jauh)
      cameraPivot.position.y += 0.1;
      break;
    // Tambahkan kontrol keyboard lainnya sesuai kebutuhan
  }
});

// Event listener for mouse clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener("click", (event) => {
  // Calculate the mouse coordinates based on the click event
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Find intersected objects
  const intersects = raycaster.intersectObjects([moonMesh, earthMesh], true);

  const moonInfoBox = document.getElementById("moon-info-box");
  const earthInfoBox = document.getElementById("earth-info-box");

  // Hide both info boxes initially
  moonInfoBox.style.display = "none";
  earthInfoBox.style.display = "none";

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    if (clickedObject === moonMesh) {
      // The Moon was clicked
      // Set the text to display
      const orbitalPeriodElement = document.getElementById("orbital-period");
      const orbitalSpeedElement = document.getElementById("orbital-speed");
      const orbitalSatelliteOf = document.getElementById("satellite-of");
      const Radius = document.getElementById("radius");
      const SurfaceArea = document.getElementById("surface-area");
      const Volume = document.getElementById("volume");
      const Mass = document.getElementById("mass");

      orbitalPeriodElement.textContent = "27.321661 days";
      orbitalSpeedElement.textContent = "1.022 km/s";
      orbitalSatelliteOf.textContent = "Earth";
      Radius.textContent = "1737.4 km";
      SurfaceArea.textContent = "3.793×10^7 km2";
      Volume.textContent = "2.1958×10^10 km3";
      Mass.textContent = "7.342×10^22 kg";

      const moonInfoText = document.getElementById("moon-info-text");
      moonInfoBox.style.display = "block";
    } else if (clickedObject === earthMesh) {
      // The Earth was clicked
      // Set the text to display
      const orbitalPeriodElement = document.getElementById("orbital-period");
      const orbitalSpeedElement = document.getElementById("orbital-speed");
      const orbitalSatellites = document.getElementById("satellites");
      const Radius = document.getElementById("radius");
      const SurfaceArea = document.getElementById("surface-area");
      const Volume = document.getElementById("volume");
      const Mass = document.getElementById("mass");

      orbitalPeriodElement.textContent = "365.256363004 days";
      orbitalSpeedElement.textContent = "29.7827 km/s";
      orbitalSatellites.textContent = "1, the Moon";
      Radius.textContent = "6371.0 km";
      SurfaceArea.textContent = "510072000 km2";
      Volume.textContent = "1.08321×10^12 km3";
      Mass.textContent = "5.972168×10^24 kg";

      const earthInfoText = document.getElementById("earth-info-text");
      earthInfoBox.style.display = "block";
    }
  }
});

animate();
