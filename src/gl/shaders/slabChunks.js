/**
 * Chunks GLSL injectés dans MeshStandardMaterial via onBeforeCompile.
 * La dalle vit à l'identité (pas de transform) : position objet == position monde.
 */

export const commonChunk = /* glsl */ `
uniform float uPhase;
uniform float uTime;
uniform float uLaserX;
varying vec3 vWPos;
varying vec3 vSlabN;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

/* Hauteur du béton frais — aplani derrière la règle laser (x < uLaserX). */
float slabHeight(vec2 xz) {
  float amp = smoothstep(uLaserX - 0.8, uLaserX + 0.8, xz.x);
  float h = fbm(xz * 0.16) * 1.15 + fbm(xz * 0.9) * 0.28;
  h += vnoise(xz * 0.45 + vec2(uTime * 0.06, uTime * 0.043)) * 0.16;
  return (h - 0.72) * amp;
}
`;

export const vertexDisplace = /* glsl */ `
#include <begin_vertex>
transformed.y += slabHeight(transformed.xz);
vWPos = transformed;

/* Normale par différences finies — au VERTEX (144k sommets),
   pas au fragment (millions de pixels) : ~10x moins cher. */
{
  float e = 0.4;
  float hL = slabHeight(transformed.xz - vec2(e, 0.0));
  float hR = slabHeight(transformed.xz + vec2(e, 0.0));
  float hD = slabHeight(transformed.xz - vec2(0.0, e));
  float hU = slabHeight(transformed.xz + vec2(0.0, e));
  vSlabN = normalize(vec3(hL - hR, 2.0 * e, hD - hU));
}
`;

export const normalPerturb = /* glsl */ `
{
  vec3 nW = normalize(vSlabN);

  /* micro-grain : disparaît avec le polissage */
  float polish = max(smoothstep(2.0, 3.1, uPhase), smoothstep(5.0, 5.9, uPhase));
  float g1 = vnoise(vWPos.xz * 7.0);
  float g2 = vnoise(vWPos.xz * 7.0 + 13.7);
  float micro = (1.0 - polish * 0.85) * 0.22;
  nW = normalize(nW + vec3((g1 - 0.5) * micro, 0.0, (g2 - 0.5) * micro));

  normal = normalize(mat3(viewMatrix) * nW);
}
`;

export const roughnessPhase = /* glsl */ `
{
  float pol = smoothstep(2.0, 3.1, uPhase);
  float pol2 = smoothstep(5.0, 5.9, uPhase);
  float r = mix(0.93, 0.46, pol);
  r = mix(r, 0.17, pol2);
  r += (vnoise(vWPos.xz * 3.0) - 0.5) * 0.10 * (1.0 - pol2);
  roughnessFactor = clamp(r, 0.05, 1.0);
}
`;

export const colorGrainJoints = /* glsl */ `
{
  /* Grain béton */
  float g = vnoise(vWPos.xz * 22.0);
  float g2 = vnoise(vWPos.xz * 3.5);
  diffuseColor.rgb *= 0.90 + 0.16 * g + 0.06 * g2;

  /* Joints sciés — se découpent en balayage gauche → droite (phase 3 → 4) */
  float reveal = smoothstep(3.05, 3.9, uPhase);
  float px = clamp((vWPos.x + 40.0) / 80.0, 0.0, 1.0);
  float jm = smoothstep(px - 0.12, px + 0.02, reveal);
  float gx = abs(fract(vWPos.x / 6.0 + 0.5) - 0.5) * 6.0;
  float gz = abs(fract(vWPos.z / 6.0 + 0.5) - 0.5) * 6.0;
  float jline = 1.0 - smoothstep(0.02, 0.09, min(gx, gz));
  diffuseColor.rgb *= 1.0 - jline * 0.5 * jm;
}
`;

export const laserEmissive = /* glsl */ `
{
  float win = smoothstep(1.02, 1.12, uPhase) * (1.0 - smoothstep(1.96, 2.08, uPhase));
  float d = vWPos.x - uLaserX;
  float line = exp(-d * d * 1.6);
  float ahead = exp(-max(d, 0.0) * 0.55) * 0.10;
  totalEmissiveRadiance += vec3(0.86, 0.30, 0.10) * (line * 1.8 + ahead) * win;
}
`;
