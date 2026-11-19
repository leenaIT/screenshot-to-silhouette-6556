export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} | بنيان` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | بنيان` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
