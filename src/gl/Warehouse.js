import * as THREE from 'three';

const _dummy = new THREE.Object3D();
const easeExpoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * L'entrepôt : racks logistiques (montants + lisses) en un seul
 * InstancedMesh. Les instances s'extrudent de la dalle en stagger
 * radial pendant la phase 4 → 5, puis se retirent avant la phase 6.
 */
export class Warehouse {
  constructor() {
    this.instances = [];

    // 2 allées de racks, 8 travées chacune
    const rows = [-9, -15];
    const bayW = 4.6;
    const levels = [1.0, 2.2, 3.4];

    for (const z of rows) {
      for (let i = 0; i < 8; i += 1) {
        const x = -16.5 + i * bayW;
        // 2 montants par travée
        for (const dx of [0, bayW * 0.92]) {
          this.instances.push({
            pos: [x + dx - bayW * 0.46, 0, z],
            scale: [0.14, 3.9, 1.15],
          });
        }
        // 3 niveaux de lisses
        for (const y of levels) {
          this.instances.push({
            pos: [x, y, z],
            scale: [bayW * 0.86, 0.12, 1.15],
            isShelf: true,
          });
        }
      }
    }

    // Colonnes de structure au fond
    for (let i = 0; i < 6; i += 1) {
      this.instances.push({
        pos: [-20 + i * 8, 0, -22],
        scale: [0.5, 7.5, 0.5],
      });
    }

    // Délai radial : les instances proches du centre montent d'abord
    for (const inst of this.instances) {
      const d = Math.hypot(inst.pos[0], inst.pos[2] + 9);
      inst.delay = THREE.MathUtils.clamp(d / 34, 0, 1) * 0.55;
    }

    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0.5, 0); // pivot au sol → scale.y = extrusion
    const mat = new THREE.MeshStandardMaterial({
      color: '#2a2e33',
      roughness: 0.55,
      metalness: 0.4,
    });

    this.mesh = new THREE.InstancedMesh(geo, mat, this.instances.length);
    this.mesh.castShadow = true;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = this.instances.length;
    this.mesh.visible = false;
    this._lastP = -1;
    this.update(1);
  }

  update(phase) {
    const rise = THREE.MathUtils.smoothstep(phase, 4.05, 4.95);
    const retreat = 1 - THREE.MathUtils.smoothstep(phase, 5.35, 5.8);
    const p = rise * retreat;

    if (Math.abs(p - this._lastP) < 0.001) {
      this.mesh.visible = p > 0.001;
      return;
    }
    this._lastP = p;
    this.mesh.visible = p > 0.001;
    if (!this.mesh.visible) return;

    this.instances.forEach((inst, i) => {
      const local = THREE.MathUtils.clamp((p - inst.delay) / 0.45, 0, 1);
      const s = easeExpoOut(local);
      _dummy.position.set(inst.pos[0], inst.pos[1] * s, inst.pos[2]);
      _dummy.scale.set(inst.scale[0], Math.max(inst.scale[1] * s, 0.001), inst.scale[2]);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      this.mesh.setMatrixAt(i, _dummy.matrix);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
