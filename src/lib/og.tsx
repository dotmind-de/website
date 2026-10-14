import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph artwork: dark field, dot grid, oversized title. */
export function renderOg({
  eyebrow,
  title,
  footer,
  logo,
}: {
  eyebrow: string;
  title: string;
  footer: string;
  /** Data URI of the dotMind wordmark; replaces the text title (the brand never takes a trailing dot). */
  logo?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(242,160,91,0.28), transparent 45%), radial-gradient(rgba(237,235,230,0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "100% 100%, 28px 28px",
          color: "#edebe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, color: "#9a9893" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#f2a05b" }} />
          {eyebrow.toUpperCase()}
        </div>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>
          <img src={logo} alt={title} width={742} height={169} />
        ) : (
          <div style={{ display: "flex", fontSize: title.length > 18 ? 96 : 140, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>
            {title}
            <span style={{ color: "#f2a05b" }}>.</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(237,235,230,0.18)",
            paddingTop: 28,
            fontSize: 26,
            color: "#9a9893",
          }}
        >
          <span>{footer}</span>
          {/* With the logo already shown, the footer repeats only the domain. */}
          <span>{logo ? site.domain : `${site.name} by ${site.founder}`}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
