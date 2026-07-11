import * as THREE from 'three';

/**
 * Le « soleil de chantier » : directionnelle rasante qui tourne au fil des
 * phases (crue au hero → rasante dorée à la réception) + hémisphérique douce.
 */
export class Lights {
  constructor(scene) {
    this.hemi = new THREE.HemisphereLight('#e7e4de', '#5a564e', 0.55);

    this.sun = new THREE.DirectionalLight('#fff4e6', 2.3);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -26;
    this.sun.shadow.camera.right = 26;
    this.sun.shadow.camera.top = 26;
    this.sun.shadow.camera.bottom = -26;
    this.sun.shadow.camera.near = 4;
    this.sun.shadow.camera.far = 80;
    this.sun.shadow.bias = -0.0015;

    scene.add(this.hemi, this.sun, this.sun.target);
  }

  update(phase) {
    const n = THREE.MathUtils.clamp((phase - 1) / 5, 0, 1);
    // Élévation basse aux extrémités (lumière rasante), plus haute au milieu
    const elev = 0.32 + 0.5 * Math.sin(Math.PI * n);
    const az = 1.15 + n * 1.7;
    const r = 30;
    this.sun.position.set(
      Math.cos(az) * Math.cos(elev) * r,
      Math.sin(elev) * r,
      Math.sin(az) * Math.cos(elev) * r
    );

    // Chaleur dorée en fin de parcours (réception)
    const warm = THREE.MathUtils.smoothstep(phase, 5.0, 5.9);
    this.sun.color.setRGB(1, 0.955 - warm * 0.13, 0.9 - warm * 0.28);
    this.sun.intensity = 2.3 - warm * 0.4;

    // Assombrissement pendant la phase entrepôt
    const dark =
      THREE.MathUtils.smoothstep(phase, 4.0, 4.35) *
      (1 - THREE.MathUtils.smoothstep(phase, 5.05, 5.5));
    this.hemi.intensity = 0.55 - dark * 0.38;
  }
}
