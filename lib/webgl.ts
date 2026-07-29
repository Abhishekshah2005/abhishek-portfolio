"use client";

/**
 * A browser will drop a WebGL context when it decides the page is asking for
 * too much — and once it's gone, the canvas just paints blank forever. Every
 * scene binds this so a lost context triggers a clean remount instead of a
 * dead rectangle.
 *
 * `preventDefault` on the loss event is what makes recovery possible at all.
 */
export function bindContextLoss(
  canvas: HTMLCanvasElement,
  onLost?: () => void,
) {
  const handler = (event: Event) => {
    event.preventDefault();
    onLost?.();
  };
  canvas.addEventListener("webglcontextlost", handler, { once: true });
}
