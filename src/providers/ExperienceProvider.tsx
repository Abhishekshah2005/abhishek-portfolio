'use client';

import type { ReactNode } from 'react';
import { EngineProvider } from './EngineProvider';
import { ThemeProvider } from './ThemeProvider';
import { ViewportProvider } from './ViewportProvider';
import { A11yProvider } from './A11yProvider';
import { OverlayProvider } from './OverlayProvider';
import { TransitionProvider } from './TransitionProvider';
import { SceneProvider } from './SceneProvider';
import { TooltipProvider } from '@/ui';

export interface ExperienceProviderProps {
  children: ReactNode;
  debug?: boolean;
}

/**
 * The composition root for the entire experience. Nests every global provider
 * in dependency order (engine first so downstream providers can read it) and
 * keeps DOM content SSR-friendly via the engine's `eager` mode. Purely
 * context — visual layers are mounted by `<ExperienceShell>`.
 */
export function ExperienceProvider({ children, debug }: ExperienceProviderProps) {
  return (
    <EngineProvider eager debug={debug}>
      <ThemeProvider>
        <ViewportProvider>
          <A11yProvider>
            <OverlayProvider>
              <TransitionProvider>
                <SceneProvider>
                  <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                </SceneProvider>
              </TransitionProvider>
            </OverlayProvider>
          </A11yProvider>
        </ViewportProvider>
      </ThemeProvider>
    </EngineProvider>
  );
}
