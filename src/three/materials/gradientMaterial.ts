import { BackSide, Color, ShaderMaterial } from 'three';
import { SIMPLEX_NOISE_3D } from '../shaders/chunks';

export interface GradientMaterialOptions {
  colorTop?: string;
  colorBottom?: string;
  /** Adds animated grain to break up banding. */
  grain?: number;
}

/**
 * A vertical gradient material for sky domes / background spheres.
 *
 * Returns a raw `ShaderMaterial` (BackSide) so it works with or without R3F.
 * Advance `uTime` from the engine ticker for a living, subtly-grainy backdrop.
 */
export function createGradientMaterial(options: GradientMaterialOptions = {}): ShaderMaterial {
  return new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      uColorTop: { value: new Color(options.colorTop ?? '#0a0a12') },
      uColorBottom: { value: new Color(options.colorBottom ?? '#1a1030') },
      uGrain: { value: options.grain ?? 0.03 },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      ${SIMPLEX_NOISE_3D}
      uniform vec3 uColorTop;
      uniform vec3 uColorBottom;
      uniform float uGrain;
      uniform float uTime;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 color = mix(uColorBottom, uColorTop, smoothstep(0.0, 1.0, h));
        float grain = snoise(vec3(vWorldPosition.xy * 0.5, uTime * 0.05)) * uGrain;
        gl_FragColor = vec4(color + grain, 1.0);
      }
    `,
  });
}
