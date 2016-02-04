/*
  ## LESSON 1

  Renders the scene directly to the <canvas>, with
  MSAA and no post-processing.
 */

global.THREE = require('three');
const glslify = require('glslify');
const createLoop = require('raf-loop');
const createApp = require('./app');
const createFXAA = require('three-shader-fxaa');
const EffectComposer = require('three-effectcomposer')(THREE);

const {
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp();

const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
target.texture.stencil = false;
target.texture.minFilter = THREE.LinearFilter;
target.texture.magFilter = THREE.LinearFilter;
target.texture.format = THREE.RGBFormat;
target.texture.generateMipmaps = false;

const composer = new EffectComposer(renderer, target);

// Copy scene to framebuffer
composer.addPass(new EffectComposer.RenderPass(scene, camera));

// Add the FXAA shader
composer.addPass(new EffectComposer.ShaderPass(createFXAA()));

// Add the Color Lookup Table shader
const lut = new EffectComposer.ShaderPass({
  vertexShader: glslify(__dirname + '/shaders/pass.vert'),
  fragmentShader: glslify(__dirname + '/shaders/lut.frag'),
  uniforms: {
    tDiffuse: { type: 't', value: new THREE.Texture() },
    tLookup: { type: 't', value: new THREE.Texture() }
  }
});
composer.addPass(lut);

// Setup our lookup table for the color transform shader
const tLookup = new THREE.TextureLoader().load('images/original.png');
tLookup.generateMipmaps = false;
tLookup.minFilter = THREE.LinearFilter;
lut.uniforms.tLookup.value = tLookup;

// Last pass should be rendered to screen!
composer.passes[composer.passes.length - 1].renderToScreen = true;

// Set initial size on our render targets
resize();

// Render loop
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

window.addEventListener('resize', resize);

function resize () {
  const dpr = renderer.getPixelRatio();
  const targets = [
    composer.renderTarget1,
    composer.renderTarget2
  ];
  targets.forEach(target => {
    target.setSize(dpr * window.innerWidth, dpr * window.innerHeight);
  });
}
