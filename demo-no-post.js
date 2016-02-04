/*
  Example without any post-processing.
  Renders the scene directly to the <canvas>.

    npm run no-post
 */

// Require our modules
global.THREE = require('three');
const createApp = require('./app');
const createLoop = require('raf-loop');

// Create our basic ThreeJS application
// We can enable MSAA since there is no post-processing
const {
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp({ antialias: true });

// Render loop
createLoop(function () {
  // Render the scene directly to <canvas>
  updateProjectionMatrix();
  renderer.render(scene, camera);
}).start();
