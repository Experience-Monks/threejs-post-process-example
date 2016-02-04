/*
  ## LESSON 1

  Renders the scene directly to the <canvas>, with
  MSAA and no post-processing.
 */

global.THREE = require('three');
const createLoop = require('raf-loop');
const createApp = require('./app');
const createFXAA = require('three-shader-fxaa');
const EffectComposer = require('three-effectcomposer')(THREE);

const {
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp({ antialias: false });

const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
target.texture.stencil = false;
target.texture.minFilter = THREE.LinearFilter;
target.texture.magFilter = THREE.LinearFilter;
target.texture.format = THREE.RGBFormat;
target.texture.generateMipmaps = false;

const composer = new EffectComposer(renderer, target);

// Copy scene to framebuffer
composer.addPass(new EffectComposer.RenderPass(scene, camera));

// Add the FXAA
composer.addPass(new EffectComposer.ShaderPass(createFXAA()));

// Last pass should be rendered to screen!
composer.passes[composer.passes.length - 1].renderToScreen = true;

createLoop(() => {
  // Update shader passes with new screen resolution
  composer.passes.forEach(pass => {
    if (pass.uniforms && pass.uniforms.resolution) {
      pass.uniforms.resolution.value.set(
        target.width, target.height
      );
    }
  });

  updateProjectionMatrix();
  if (composer.passes.length > 1) composer.render();
  else renderer.render(scene, camera);
}).start();
