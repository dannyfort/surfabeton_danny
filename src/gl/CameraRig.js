import * as THREE from 'three';

/**
 * Rig caméra : deux courbes Catmull-Rom (position + cible) échantillonnées
 * sur la phase 1 → 6, plus dérive souris et respiration lente.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;

    this.posCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 1.35, 11), //  1 · hero — ras du béton frais
        new THREE.Vector3(2.5, 2.0, 10), // 2 · suit la règle laser
        new THREE.Vector3(0, 4.5, 10), //   3 · élévation (hélicoptère)
        new THREE.Vector3(0, 16, 5), //     4 · vue plan (joints sciés)
        new THREE.Vector3(7, 2.8, 9), //    5 · travelling entre les racks
        new THREE.Vector3(0, 1.7, 11.5), // 6 · réception, rasante
      ],
      false,
      'centripetal'
    );

    this.tgtCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0.7, 0),
        new THREE.Vector3(0, 0.4, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-2, 1.6, -5),
        new THREE.Vector3(0, 0.9, -6),
      ],
      false,
      'centripetal'
    );

    this.mouse = new THREE.Vector2(0, 0);
    this._mouseSmooth = new THREE.Vector2(0, 0);
    this._pos = new THREE.Vector3();
    this._tgt = new THREE.Vector3();

    window.addEventListener('pointermove', (e) => {
      this.mouse.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    });
  }

  update(phase, time) {
    const t = THREE.MathUtils.clamp((phase - 1) / 5, 0, 1);
    this.posCurve.getPoint(t, this._pos);
    this.tgtCurve.getPoint(t, this._tgt);

    // Dérive souris (discrète) + respiration lente
    this._mouseSmooth.lerp(this.mouse, 0.04);
    const parallax = 1 - THREE.MathUtils.smoothstep(phase, 3.2, 3.8); // pas en vue plan
    this._pos.x += this._mouseSmooth.x * 0.5 * parallax;
    this._pos.y += -this._mouseSmooth.y * 0.2 * parallax + Math.sin(time * 0.4) * 0.05;

    this.camera.position.copy(this._pos);
    this.camera.lookAt(this._tgt);
  }
}
