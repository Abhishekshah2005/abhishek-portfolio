import { contact, person } from "@/lib/content";

/**
 * Shared across the homepage's Contact chapter and any standalone page
 * (`/services`) — one copy of the socials list and copyright line, so a
 * link added or fixed here can't drift out of sync between pages.
 */
export function Footer({ className = "" }: { className?: string }) {
  const year = 2026;

  return (
    <footer
      className={`mx-auto flex w-full max-w-[1320px] flex-col gap-6 border-t border-[var(--line)] px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {contact.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            data-cursor
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[13px] text-cream-2 transition-colors duration-300 hover:text-lime"
            {...(social.placeholder ? { "aria-disabled": true, tabIndex: -1 } : {})}
          >
            {social.label}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] tracking-[0.18em] text-cream-3 uppercase">
        <span>{person.location}</span>
        <span>
          © {year} {person.name}
        </span>
      </div>
    </footer>
  );
}
