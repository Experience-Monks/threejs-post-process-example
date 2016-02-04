/*
  ## LESSON 1

  Renders the scene directly to the <canvas>, with
  MSAA and no post-processing.
 */

global.THREE = require('three');
const createLoop = require('raf-loop');
const createApp = require('./app');

// Create an application and request MSAA, since
// we are not using post-processing here.
const {
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp({ antialias: true });

createLoop(function () {
  updateProjectionMatrix();
  renderer.render(scene, camera);
}).start();
