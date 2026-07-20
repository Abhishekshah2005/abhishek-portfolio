import { HeroWorld } from '@/sections/hero';

/**
 * Home route — mounts the Hero World (the opening level). The global shell
 * (engine, canvas stage, boot, overlays, cursor) is provided by the layout;
 * this renders the level content that dissolves into view after boot.
 */
export default function HomePage() {
  return <HeroWorld />;
}
