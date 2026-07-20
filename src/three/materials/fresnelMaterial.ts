import { AdditiveBlending, Color, ShaderMaterial } from 'three';
import { FRESNEL } from '../shaders/chunks';

export interface FresnelMaterialOptions {
  color?: string;
  power?: number;
  intensity?: number;
}

/**
 * A rim-light / holographic fresnel material — brightest at glancing angles.
 * Great for glass, force-fields and highlighting interactive 3D objects.
 */
export function createFresnelMaterial(options: FresnelMaterialOptions = {}): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    blending: AdditiveBlending,
    uniforms: {
      uColor: { value: new Color(options.color ?? '#5b8cff') },
      uPower: { value: options.power ?? 2.5 },
      uIntensity: { value: options.intensity ?? 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      ${FRESNEL}
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float f = fresnel(vViewDir, vNormal, uPower) * uIntensity;
        gl_FragColor = vec4(uColor * f, f);
      }
    `,
  });
}
