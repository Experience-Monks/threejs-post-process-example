precision mediump float;

#define LUT_FLIP_Y

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tLookup;

#pragma glslify: lut = require('glsl-lut')

void main () {
  gl_FragColor = texture2D(tDiffuse, vUv);
  gl_FragColor.rgb = lut(gl_FragColor, tLookup).rgb;
}