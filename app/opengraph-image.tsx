import { ImageResponse } from "next/og";
import { person } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${person.name} — UAE, UK & US company registration and filings`;

const COAL = "#0a0a0b";
const CREAM = "#f2f1ec";
const CREAM_2 = "#b9b8b0";
const LIME = "#d9ff40";

/**
 * The link-preview card — what a shared search result or message actually
 * shows before anyone clicks through. Built with system fonts only: no
 * network font fetch at build time, nothing that can fail silently.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: COAL,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: LIME,
            }}
          />
          <span
            style={{
              color: CREAM_2,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {person.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              color: CREAM,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Register in Dubai.
          </span>
          <span
            style={{
              color: LIME,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Keep what you earn.
          </span>
        </div>

        <span
          style={{
            color: CREAM_2,
            fontSize: 28,
            letterSpacing: 2,
          }}
        >
          Company registration &amp; filings — UAE · UK · US
        </span>
      </div>
    ),
    { ...size },
  );
}
