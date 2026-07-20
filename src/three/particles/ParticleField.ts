import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from 'three';

export interface ParticleFieldOptions {
  count?: number;
  /** Half-extent of the cube the particles fill. */
  radius?: number;
  size?: number;
  color?: string;
  /** Drift speed multiplier. */
  speed?: number;
}

export interface ParticleField {
  points: Points;
  material: ShaderMaterial;
  /** Advance the animation; call from the engine ticker. */
  update: (delta: number) => void;
  dispose: () => void;
}

/**
 * A reusable, additively-blended particle field.
 *
 * Framework-agnostic (returns a `THREE.Points`), so it can be added to any
 * scene graph. Particle count should be scaled by the performance tier by the
 * caller. Soft round sprites are drawn in-shader — no texture needed.
 */
export function createParticleField(options: ParticleFieldOptions = {}): ParticleField {
  const count = options.count ?? 800;
  const radius = options.radius ?? 8;
  const size = options.size ?? 6;
  const speed = options.speed ?? 1;

  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() * 2 - 1) * radius;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
    positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;
    seeds[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uColor: { value: new Color(options.color ?? '#8bb4ff') },
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uSize;
      void main() {
        vec3 p = position;
        p.y += sin(uTime + aSeed) * 0.3;
        p.x += cos(uTime * 0.6 + aSeed) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uSize * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;

  return {
    points,
    material,
    update: (delta: number) => {
      material.uniforms.uTime.value += delta * speed;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
