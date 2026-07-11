import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { Slab } from './Slab.js';
import { LaserScreed } from './LaserScreed.js';
import { Trowel } from './Trowel.js';
import { Warehouse } from './Warehouse.js';
import { IndustrialHall } from './IndustrialHall.js';
import { CameraRig } from './CameraRig.js';
import { Lights } from './Lights.js';

const BG_LIGHT = new THREE.Color('#e7e4de');
const BG_DARK = new THREE.Color('#141518');

/**
 * Orchestrateur : un canvas fixe, une scène, une boucle.
 * Lit `state.phase` (écrit par les ScrollTriggers) à chaque frame.
 */
/** Détecte un rasterizer logiciel (SwiftShader, llvmpipe…) → tier « low ». */
function detectQuality() {
  const isMobile = window.innerWidth < 768;
  try {
    const c = document.createElement('canvas');
    const g = c.getContext('webgl2') || c.getContext('webgl');
    const d = g && g.getExtension('WEBGL_debug_renderer_info');
    const r = d ? String(g.getParameter(d.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|softpipe|software/i.test(r)) return 'low';
  } catch {
    /* opaque → on reste prudent sur mobile */
  }
  return isMobile ? 'mid' : 'high';
}

const QUALITY = {
  low: { dpr: 0.75, aa: false, shadows: false, segments: 140 },
  mid: { dpr: 1.5, aa: true, shadows: false, segments: 200 },
  high: { dpr: Math.min(window.devicePixelRatio || 1, 2), aa: true, shadows: true, segments: 380 },
};

export class Experience {
  constructor(canvas, state) {
    this.state = state;
    this.time = 0;
    this.quality = detectQuality();
    const q = QUALITY[this.quality];

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: q.aa,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(q.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = q.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = BG_LIGHT.clone();
    this.scene.fog = new THREE.Fog(BG_LIGHT.clone(), 16, 58);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      160
    );

    this.slab = new Slab(q.segments);
    this.laser = new LaserScreed();
    this.trowel = new Trowel();
    this.warehouse = new Warehouse();
    this.hall = new IndustrialHall();
    this.rig = new CameraRig(this.camera);
    this.lights = new Lights(this.scene);

    this.scene.add(
      this.slab.mesh,
      this.laser.group,
      this.trowel.group,
      this.warehouse.mesh,
      this.hall.group
    );

    window.addEventListener('resize', () => this.resize());

    if (state.reduced) {
      // Mode calme : une image fixe, état « réception »
      this.renderStatic();
      window.addEventListener('resize', () => this.renderStatic());
    } else {
      this._tick = (t, dtMs) => this.update(dtMs / 1000);
      gsap.ticker.add(this._tick);
    }

    canvas.classList.add('is-ready');
  }

  update(dt) {
    this.time += dt;
    const { phase } = this.state;

    // Dégradation adaptative : machine lente → résolution réduite (une fois)
    if (!this._dprAdjusted) {
      this._slowFrames = (this._slowFrames || 0) + (dt > 0.08 ? 1 : 0);
      this._frames = (this._frames || 0) + 1;
      if (this._frames > 30) {
        this._dprAdjusted = true;
        if (this._slowFrames > 12 && this.renderer.getPixelRatio() > 1) {
          this.renderer.setPixelRatio(1);
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
      }
    }

    this.slab.update(phase, this.time);
    this.laser.update(phase, this.time);
    this.trowel.update(phase, this.time, dt);
    this.warehouse.update(phase);
    this.hall.update(phase);
    this.lights.update(phase);
    this.rig.update(phase, this.time);

    // Atmosphère : fond + fog basculent en sombre pendant la phase entrepôt
    const dark =
      THREE.MathUtils.smoothstep(phase, 4.0, 4.35) *
      (1 - THREE.MathUtils.smoothstep(phase, 5.05, 5.5));
    this.scene.background.copy(BG_LIGHT).lerp(BG_DARK, dark);
    this.scene.fog.color.copy(this.scene.background);
    this.scene.fog.near = THREE.MathUtils.lerp(16, 9, dark);
    this.scene.fog.far = THREE.MathUtils.lerp(58, 40, dark);

    this.renderer.render(this.scene, this.camera);
  }

  renderStatic() {
    this.state.phase = 6;
    this.update(0);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    if (this._tick) gsap.ticker.remove(this._tick);
    this.slab.dispose();
    this.renderer.dispose();
  }
}
