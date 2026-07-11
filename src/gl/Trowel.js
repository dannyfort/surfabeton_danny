import * as THREE from 'three';

const STEEL = new THREE.MeshStandardMaterial({
  color: '#3c4145',
  roughness: 0.45,
  metalness: 0.6,
});
const BLADE = new THREE.MeshStandardMaterial({
  color: '#8e8a81',
  roughness: 0.3,
  metalness: 0.8,
});

/**
 * Taloche mécanique (« hélicoptère ») stylisée : rotor 4 pales + cage +
 * guidon. Trajectoire de Lissajous sur la dalle, rotor en rotation rapide.
 * Visible pendant la phase 2 → 3 (expertises).
 */
export class Trowel {
  constructor() {
    this.group = new THREE.Group();
    this.rotor = new THREE.Group();

    const bladeGeo = new THREE.BoxGeometry(2.3, 0.03, 0.34);
    for (let i = 0; i < 4; i += 1) {
      const blade = new THREE.Mesh(bladeGeo, BLADE);
      blade.rotation.y = (i * Math.PI) / 2;
      blade.rotation.x = 0.06; // léger angle d'attaque
      blade.position.y = 0.1;
      this.rotor.add(blade);
    }

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 12), STEEL);
    hub.position.y = 0.28;

    const cage = new THREE.Mesh(
      new THREE.TorusGeometry(1.35, 0.045, 8, 40),
      STEEL
    );
    cage.rotation.x = Math.PI / 2;
    cage.position.y = 0.35;

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6, 8), STEEL);
    handle.rotation.z = Math.PI / 3.2;
    handle.position.set(-1.5, 1.05, 0);

    this.group.add(this.rotor, hub, cage, handle);
    this.group.traverse((o) => {
      if (o.isMesh) o.castShadow = true;
    });
    this.group.visible = false;
  }

  update(phase, time, dt) {
    const active = phase > 2.05 && phase < 3.2;
    this.group.visible = active;
    if (!active) return;

    // Trajectoire de lissage (Lissajous) dans le champ caméra
    this.group.position.x = 5.5 * Math.sin(time * 0.5);
    this.group.position.z = 3.0 * Math.sin(time * 0.9 + 1.2) - 2.0;
    this.group.position.y = 0.02;
    this.group.rotation.y = Math.sin(time * 0.4) * 0.4;
    this.rotor.rotation.y += dt * 11; // rotor rapide
  }
}
