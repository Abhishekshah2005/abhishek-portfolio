import { Material, Mesh, Object3D, Texture } from 'three';

/** Dispose a material and every texture it references. */
export function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    if (value instanceof Texture) value.dispose();
  }
  material.dispose();
}

/**
 * Recursively dispose an Object3D's geometries, materials and textures.
 *
 * Three does not free GPU memory automatically — call this when removing any
 * subtree to keep memory flat across scene transitions.
 */
export function disposeObject3D(object: Object3D): void {
  object.traverse((child) => {
    if (child instanceof Mesh) {
      child.geometry?.dispose();
      const material = child.material;
      if (Array.isArray(material)) material.forEach(disposeMaterial);
      else if (material) disposeMaterial(material);
    }
  });
  object.removeFromParent();
}
