import * as THREE from 'three';

const _dummy = new THREE.Object3D();

const HALF_W = 21; // demi-largeur de la halle
const ROOF_Y = 9.4; // hauteur charpente
const Z_FROM = -46;
const Z_TO = 13;
const BAY = 7.4; // entraxe des portiques

/**
 * La halle industrielle : poteaux, charpente (fermes + pannes) et bandes
 * de skydômes émissifs. Trois InstancedMesh + un mesh skylights = 4 draw calls.
 * La halle s'estompe pendant la vue plan (phase joints sciés) puis revient,
 * et ses éclairages baissent pendant la phase entrepôt sombre.
 */
export class IndustrialHall {
  constructor() {
    this.group = new THREE.Group();

    this.steelMat = new THREE.MeshStandardMaterial({
      color: '#2e3236',
      roughness: 0.5,
      metalness: 0.6,
      transparent: true,
    });
    this.skyMat = new THREE.MeshStandardMaterial({
      color: '#f5f2ea',
      emissive: '#fff6e6',
      emissiveIntensity: 2.0,
      roughness: 0.9,
      transparent: true,
    });

    const bays = [];
    for (let z = Z_FROM; z <= Z_TO; z += BAY) bays.push(z);

    // --- Poteaux (2 rangées) ---
    const colGeo = new THREE.BoxGeometry(0.55, ROOF_Y, 0.8);
    colGeo.translate(0, ROOF_Y / 2, 0);
    this.columns = new THREE.InstancedMesh(colGeo, this.steelMat, bays.length * 2);
    let i = 0;
    for (const z of bays) {
      for (const x of [-HALF_W, HALF_W]) {
        _dummy.position.set(x, 0, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, 1, 1);
        _dummy.updateMatrix();
        this.columns.setMatrixAt(i, _dummy.matrix);
        i += 1;
      }
    }
    this.columns.castShadow = true;

    // --- Fermes transversales (traverses portique) ---
    const beamGeo = new THREE.BoxGeometry(HALF_W * 2 + 0.6, 0.55, 0.4);
    this.beams = new THREE.InstancedMesh(beamGeo, this.steelMat, bays.length);
    bays.forEach((z, j) => {
      _dummy.position.set(0, ROOF_Y + 0.25, z);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      this.beams.setMatrixAt(j, _dummy.matrix);
    });

    // --- Pannes longitudinales ---
    const purlinXs = [-18, -12, -6, 0, 6, 12, 18];
    const purlinGeo = new THREE.BoxGeometry(0.22, 0.3, Z_TO - Z_FROM + 4);
    this.purlins = new THREE.InstancedMesh(purlinGeo, this.steelMat, purlinXs.length);
    purlinXs.forEach((x, j) => {
      _dummy.position.set(x, ROOF_Y + 0.68, (Z_FROM + Z_TO) / 2);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      this.purlins.setMatrixAt(j, _dummy.matrix);
    });

    // --- Bandes de skydômes (émissives) entre les pannes ---
    const skyXs = [-15, -3, 9, 15]; // rythme légèrement irrégulier, comme en vrai
    const skyGeo = new THREE.BoxGeometry(2.6, 0.1, Z_TO - Z_FROM + 2);
    this.skylights = new THREE.InstancedMesh(skyGeo, this.skyMat, skyXs.length);
    skyXs.forEach((x, j) => {
      _dummy.position.set(x, ROOF_Y + 0.95, (Z_FROM + Z_TO) / 2);
      _dummy.rotation.set(0, 0, 0);
      _dummy.scale.set(1, 1, 1);
      _dummy.updateMatrix();
      this.skylights.setMatrixAt(j, _dummy.matrix);
    });

    // --- Bardage du fond (silhouette, mangée par le fog) ---
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(HALF_W * 2 + 1, ROOF_Y + 1, 0.4),
      this.steelMat
    );
    wall.position.set(0, (ROOF_Y + 1) / 2, Z_FROM - 2);

    this.group.add(this.columns, this.beams, this.purlins, this.skylights, wall);
  }

  update(phase) {
    // S'estompe en vue plan (joints sciés), revient pour l'entrepôt
    const fadeOut = THREE.MathUtils.smoothstep(phase, 3.35, 3.85);
    const fadeIn = THREE.MathUtils.smoothstep(phase, 4.55, 4.95);
    const opacity = THREE.MathUtils.clamp(1 - fadeOut + fadeIn, 0, 1);

    this.group.visible = opacity > 0.01;
    if (!this.group.visible) return;

    this.steelMat.opacity = opacity;
    this.skyMat.opacity = opacity;

    // Les skydômes baissent pendant la phase entrepôt sombre
    const dark =
      THREE.MathUtils.smoothstep(phase, 4.0, 4.35) *
      (1 - THREE.MathUtils.smoothstep(phase, 5.05, 5.5));
    this.skyMat.emissiveIntensity = 2.0 - dark * 1.55;
  }
}
