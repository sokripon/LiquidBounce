/*
  Dev-only fallback for item textures.
  In `npm run dev`, the preview page runs outside the LiquidBounce client,
  so `/api/v1/client/resource/itemTexture` 404s. This handler swaps the
  failing <img> to an inline SVG placeholder showing the first letter of
  the item's alt text on a muted background.
*/

function placeholderDataUrl(letter: string): string {
    const safe = letter.replace(/[<>&"']/g, "").slice(0, 1).toUpperCase() || "?";
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
        `<rect width="32" height="32" rx="4" fill="rgba(255,255,255,0.08)"/>` +
        `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" ` +
        `font-family="sans-serif" font-size="18" font-weight="600" ` +
        `fill="rgba(255,255,255,0.55)">${safe}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleIconError(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    if (img.dataset.fallback === "1") return;
    img.dataset.fallback = "1";
    const label = img.dataset.name || img.alt || "?";
    img.src = placeholderDataUrl(label);
}
