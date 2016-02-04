/*
  ## LESSON 2

  Renders the scene into an offscreen framebuffer,
  and then applies the render target texture to a cube
  material.
 */

global.THREE = require('three');
const createLoop = require('raf-loop');
const createApp = require('./app');

const {
  mesh,
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp();

// Create a new render target to hold our scene texture
const target = new THREE.WebGLRenderTarget(512, 512);
target.texture.stencil = false;
target.texture.minFilter = THREE.LinearFilter;
target.texture.magFilter = THREE.LinearFilter;
target.texture.format = THREE.RGBFormat;
target.texture.generateMipmaps = false;

// A fixed perspective camera to show our torus knot
const altCamera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
altCamera.position.set(0, 0, -6);
altCamera.lookAt(new THREE.Vector3(0, 0, 0));

// A box to show the render target texture
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshLambertMaterial({
  map: new THREE.Texture()
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// Re-position the main camera for our box
camera.position.set(1, 1, -2);
camera.lookAt(new THREE.Vector3());

// Update loop
createLoop(() => {
  // Render 3D mesh into offscreen texture
  mesh.visible = true;
  box.visible = false;
  renderer.setClearColor('#000', 1);
  renderer.render(scene, altCamera, target);

  // Render box with the offscreen texture
  material.map = target;
  mesh.visible = false;
  box.visible = true;
  renderer.setClearColor('#fff', 1);
  updateProjectionMatrix();

  // Render scene directly to <canvas>
  renderer.render(scene, camera);
}).start();
