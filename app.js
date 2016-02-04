const OrbitControls = require('three-orbit-controls')(THREE);
const createBackground = require('three-vignette-background');

module.exports = createApp;
function createApp (opt = {}) {
  // Scale for retina
  const dpr = window.devicePixelRatio;

  // Our WebGL renderer with alpha and device-scaled
  const renderer = new THREE.WebGLRenderer(opt);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor('#222023', 1);

  // Show the <canvas> on screen
  const canvas = renderer.domElement;
  document.body.appendChild(canvas);

  // 3D camera looking at [ 0, 0, 0 ]
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.position.set(0, 0, -6);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 3D scene
  const scene = new THREE.Scene();

  // Add a gradient background to highlight our tonemap effects
  var background = createBackground();
  scene.add(background);

  // Simple 3D geometry
  const material = new THREE.MeshPhongMaterial();
  const geometry = new THREE.TorusKnotGeometry(1, 0.025, 64, 64, 14, 3, 6);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.y += Math.PI / 2;
  scene.add(mesh);

  // 3D orbit controller
  const controls = new OrbitControls(camera, canvas);

  // Basic lighting
  const light = new THREE.HemisphereLight('#f9b641', '#361448', 1);
  scene.add(light);

  // Update frame size
  window.addEventListener('resize', resize);
  resize();

  // Create a requestAnimationFrame loop
  return {
    renderer,
    camera,
    controls,
    scene,
    mesh,
    updateProjectionMatrix
  };

  function updateProjectionMatrix () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    // Add styling to our background element
    background.style({
      aspect: aspect,
      aspectCorrection: true,
      grainScale: 1.5 / Math.min(width, height)
    });

    // Update camera matrices
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function resize () {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
