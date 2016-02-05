# Post-Processing in ThreeJS

![images](http://i.imgur.com/bC1OMNR.jpg)

<sub>*before and after post-processing – click [here](http://jam3.github.io/threejs-post-process-example) for a live demo*</sub>

---

This is an example of post-processing effects in [ThreeJS](http://threejs.org/), including FXAA and Lookup Table color transforms.

This example also provides some insight into the development workflow at Jam3, and how we scale and re-use code across some of our WebGL experiences.

To build this demo, we used the following tools:

- [npm](https://www.npmjs.com/) to install dependencies
- [budo](https://www.npmjs.com/package/budo) for a fast development server
- [browserify](https://www.npmjs.com/package/browserify) to bundle dependencies
- [babelify](https://www.npmjs.com/package/babelify) for ES2015 transpiling
- [glslify](https://www.npmjs.com/package/glslify) to inline GLSL shaders into our JavaScript bundle

We bring together some of the following modules:

- [three-orbit-controls](https://www.npmjs.com/package/three-orbit-controls) – a modular OrbitControls for ThreeJS camera
- [three-effectcomposer](https://www.npmjs.com/package/three-effectcomposer) – a modular EffectComposer for ThreeJS post-processing
- [three-vignette-background](https://www.npmjs.com/package/three-vignette-background) – adds a simple gradient background to your ThreeJS application
- [three-shader-fxaa](https://www.npmjs.com/package/three-shader-fxaa) – an optimized FXAA shader for ThreeJS
- [glsl-lut](https://www.npmjs.com/package/glsl-lut) – a generic Lookup Table GLSL component for color transforms

## Running from Source

You can `git clone` this repo to run from source.

```sh
git clone https://github.com/Jam3/threejs-post-process-example.git
cd threejs-post-process-example

# install dependencies
npm install
```

Now you can run either demo:

```sh
# with post-processing
npm run start

# without post-processing
npm run no-post
```

Or build the static site:

```sh
npm run build
```

## Effects

##### FXAA

For an optimized Fast Approximate Antialiasing (FXAA) shader, we use [three-shader-fxaa](https://github.com/mattdesl/three-shader-fxaa).

##### Color Lookup Transforms

We use [glsl-lut](https://github.com/mattdesl/glsl-lut) for the efficient color lookup transforms.

- [pass.vert](./shaders/pass.vert) – a simple "pass through" vertex shader
- [lut.frag](./shaders/lut.frag) – a fragment shader which transforms colors with `glsl-lut`

The [images/](./images) folder includes various lookup table examples, including the ["identity" lookup table](./images/original.png), which can be adjusted for your own effects.

## Further Reading

- [npm Modules for Frontend JavaScript](https://github.com/jam3/jam3-lesson-module-basics)
- [Modular and Versioned GLSL with `glslify`](http://mattdesl.svbtle.com/glslify)
- [A Browserify Example for Fast Prototyping](https://github.com/mattdesl/browserify-example)