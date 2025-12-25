import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogImageUrl?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const SITE_NAME = "MindWell";
const DEFAULT_DESC =
  "MindWell - Nền tảng chăm sóc sức khỏe tinh thần toàn diện. Kết nối chuyên gia, thấu hiểu bản thân và tìm lại sự cân bằng.";
const DEFAULT_OG = "/og-image.png";

function getSiteOrigin() {
  const env = (import.meta as any).env?.VITE_SITE_URL as string | undefined;
  return (env ?? window.location.origin).replace(/\/+$/, "");
}

function toAbsUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin = getSiteOrigin();
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${p}`;
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProp(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string | undefined) {
  const existing = document.querySelector<HTMLLinkElement>(
    `link[rel="canonical"]`
  );
  if (!href) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement("link");
  el.setAttribute("rel", "canonical");
  el.setAttribute("href", href);
  if (!existing) document.head.appendChild(el);
}

function setJsonLd(jsonLd: SeoProps["jsonLd"]) {
  const id = "mw-jsonld";
  const existing = document.getElementById(id);
  if (!jsonLd) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement("script");
  el.id = id;
  (el as HTMLScriptElement).type = "application/ld+json";
  el.textContent = JSON.stringify(jsonLd);
  if (!existing) document.head.appendChild(el);
}

export default function Seo({
  title,
  description,
  canonicalPath,
  ogImageUrl,
  ogType = "website",
  noindex,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    const desc = description?.trim() || DEFAULT_DESC;

    document.title = fullTitle;

    setMetaByName("description", desc);

    if (noindex) setMetaByName("robots", "noindex,nofollow");
    else {
      const robots = document.querySelector(`meta[name="robots"]`);
      robots?.remove();
    }

    const canonical =
      canonicalPath && canonicalPath.trim()
        ? toAbsUrl(
            canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`
          )
        : undefined;

    setCanonical(canonical);

    const ogImage = toAbsUrl(ogImageUrl || DEFAULT_OG);
    setMetaByProp("og:type", ogType);
    setMetaByProp("og:title", fullTitle);
    setMetaByProp("og:description", desc);
    if (canonical) setMetaByProp("og:url", canonical);
    setMetaByProp("og:image", ogImage);

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", fullTitle);
    setMetaByName("twitter:description", desc);
    setMetaByName("twitter:image", ogImage);

    setJsonLd(jsonLd);
  }, [title, description, canonicalPath, ogImageUrl, ogType, noindex, jsonLd]);

  return null;
}
