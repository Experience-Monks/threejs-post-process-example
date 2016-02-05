/*
  Example with post-processing.
  Renders the scene with an EffectComposer,
  using FXAA and Lookup Table color transforms.

    npm run start
 */

// Require our modules
global.THREE = require('three');
const createApp = require('./app');
const createLoop = require('raf-loop');
const createFXAA = require('three-shader-fxaa');
const EffectComposer = require('three-effectcomposer')(THREE);
const glslify = require('glslify');

// Create our basic ThreeJS application
const {
  renderer,
  camera,
  scene,
  updateProjectionMatrix
} = createApp();

// Create a new offscreen framebuffer
const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
target.texture.stencil = false;
target.texture.minFilter = THREE.LinearFilter;
target.texture.magFilter = THREE.LinearFilter;
target.texture.format = THREE.RGBFormat;
target.texture.generateMipmaps = false;

// Create a new composer for post-processing
const composer = new EffectComposer(renderer, target);

// Copy scene to framebuffer
composer.addPass(new EffectComposer.RenderPass(scene, camera));

// Add the FXAA shader
composer.addPass(new EffectComposer.ShaderPass(createFXAA()));

// Add the Lookup Table shader
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
const tLookup = new THREE.TextureLoader().load('images/lookup.png');
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

  // Render scene with post-processing
  updateProjectionMatrix();
  composer.render();
}).start();

window.addEventListener('resize', resize);

function resize () {
  // We need to resize the composer carefully to
  // make sure it looks good at all sizes!
  const dpr = renderer.getPixelRatio();
  const targets = [
    composer.renderTarget1,
    composer.renderTarget2
  ];
  targets.forEach(target => {
    target.setSize(dpr * window.innerWidth, dpr * window.innerHeight);
  });
}
