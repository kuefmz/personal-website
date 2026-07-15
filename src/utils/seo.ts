import { site } from "../data/site";

export type JsonLd = Record<string, unknown>;

export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;

export const ensureTrailingSlash = (url: string) => {
  const parsed = new URL(url, site.url);
  const lastSegment = parsed.pathname.split("/").filter(Boolean).at(-1) ?? "";
  const hasFileExtension = /\.[a-z0-9]+$/i.test(lastSegment);

  if (!hasFileExtension && !parsed.pathname.endsWith("/")) {
    parsed.pathname = `${parsed.pathname}/`;
  }

  return parsed.toString();
};

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

export const canonicalUrl = (pathname: string) => ensureTrailingSlash(absoluteUrl(pathname));

export const compactSchema = (schema: JsonLd): JsonLd => {
  const entries = Object.entries(schema).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });

  return Object.fromEntries(entries);
};

export const stripSchemaContext = (schema: JsonLd): JsonLd => {
  const { ["@context"]: _context, ...rest } = schema;
  return rest;
};

export const personSchema = (): JsonLd =>
  compactSchema({
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    image: absoluteUrl("/images/jenifer-ciuciu-kiss.jpg"),
    email: `mailto:${site.email}`,
    jobTitle: site.professionalRoles,
    description: site.description,
    homeLocation: {
      "@type": "Place",
      name: site.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Zurich",
        addressCountry: "CH",
      },
    },
    worksFor: {
      "@type": "Organization",
      name: "UBS",
    },
    affiliation: [
      {
        "@type": "CollegeOrUniversity",
        name: "Universidad Politecnica de Madrid",
      },
      {
        "@type": "Organization",
        name: "Ontology Engineering Group",
      },
    ],
    sameAs: [site.linkedin, site.github, site.orcid, site.googleScholar, site.researchGate],
    knowsAbout: site.expertise,
  });

export const websiteSchema = (): JsonLd => ({
  "@type": "WebSite",
  "@id": websiteId,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": personId },
});

export const webPageSchema = ({
  canonical,
  title,
  description,
  schemaType = "WebPage",
}: {
  canonical: string;
  title: string;
  description: string;
  schemaType?: string;
}): JsonLd =>
  compactSchema({
    "@type": schemaType,
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: "en",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: schemaType === "ProfilePage" || schemaType === "AboutPage" ? { "@id": personId } : undefined,
  });

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: ensureTrailingSlash(item.url),
  })),
});

export const itemListSchema = ({
  name,
  items,
}: {
  name: string;
  items: Array<{ name: string; url: string }>;
}): JsonLd => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: ensureTrailingSlash(item.url),
  })),
});
