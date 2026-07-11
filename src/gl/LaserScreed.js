import * as THREE from 'three';

const STEEL = new THREE.MeshStandardMaterial({
  color: '#3c4145',
  roughness: 0.5,
  metalness: 0.55,
});
const OXIDE = new THREE.MeshStandardMaterial({
  color: '#ce5423',
  emissive: '#ce5423',
  emissiveIntensity: 1.4,
  roughness: 0.4,
});

/**
 * Règle laser stylisée : poutre transversale + 2 têtes + mât récepteur.
 * Glisse sur X (synchronisée avec l'uniform uLaserX de la dalle),
 * visible uniquement pendant la phase 1 → 2.
 */
export class LaserScreed {
  constructor() {
    this.group = new THREE.Group();

    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 34), STEEL);
    beam.position.y = 0.45;

    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 34), OXIDE);
    strip.position.set(-0.34, 0.3, 0);

    const headGeo = new THREE.BoxGeometry(1.5, 0.9, 1.5);
    const headL = new THREE.Mesh(headGeo, STEEL);
    headL.position.set(0, 0.65, -17.4);
    const headR = headL.clone();
    headR.position.z = 17.4;

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8), STEEL);
    mast.position.set(0, 2.0, -17.4);
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.3), OXIDE);
    receiver.position.set(0, 3.1, -17.4);

    this.group.add(beam, strip, headL, headR, mast, receiver);
    this.group.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    this.group.visible = false;
  }

  update(phase, time) {
    const active = phase > 0.98 && phase < 2.15;
    this.group.visible = active;
    if (!active) return;
    const t = THREE.MathUtils.clamp(phase - 1, 0, 1);
    this.group.position.x = -44 + 88 * t;
    this.group.position.y = 0.06 + Math.sin(time * 7) * 0.015; // vibration
  }
}
