import * as THREE from 'three';
import {
  commonChunk,
  vertexDisplace,
  normalPerturb,
  roughnessPhase,
  colorGrainJoints,
  laserEmissive,
} from './shaders/slabChunks.js';

const SLAB_SIZE = 80;

/**
 * La dalle : PlaneGeometry haute densité + MeshStandardMaterial augmenté.
 * Un seul uniform maître (uPhase) pilote displacement, roughness,
 * joints sciés et ligne laser.
 */
export class Slab {
  constructor(segments = 380) {
    const geometry = new THREE.PlaneGeometry(SLAB_SIZE, SLAB_SIZE, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a8a399'),
      roughness: 0.93,
      metalness: 0.0,
      envMapIntensity: 0.4,
    });

    this.uniforms = {
      uPhase: { value: 1 },
      uTime: { value: 0 },
      uLaserX: { value: -44 },
    };

    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);

      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${commonChunk}`)
        .replace('#include <begin_vertex>', vertexDisplace);

      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${commonChunk}`)
        .replace(
          '#include <normal_fragment_begin>',
          `#include <normal_fragment_begin>\n${normalPerturb}`
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>\n${roughnessPhase}`
        )
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>\n${colorGrainJoints}`
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>\n${laserEmissive}`
        );
    };
    material.customProgramCacheKey = () => 'surfabeton-slab';

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
  }

  /** laserX dérivé de la phase : balayage -44 → +44 pendant la phase 1 → 2 */
  update(phase, time) {
    this.uniforms.uPhase.value = phase;
    this.uniforms.uTime.value = time;
    this.uniforms.uLaserX.value =
      -44 + 88 * THREE.MathUtils.clamp(phase - 1, 0, 1);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
