export interface FAQItem {
  question: string;
  answer: string;
}

const SITE_URL = "https://pokerhelpercalculator.com";

const GESMINE_ORG = {
  "@type": "Organization",
  name: "Poker Helper Calculator",
  legalName: "Gesmine-Invest Limited",
  identifier: { "@type": "PropertyValue", propertyID: "UK Company Number", value: "14120136" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hardy House, 269 Poynders Gardens",
    addressLocality: "London",
    postalCode: "SW4 8PQ",
    addressCountry: "GB",
  },
};

export function getSoftwareApplicationSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    operatingSystem: "All",
    applicationCategory: "UtilitiesApplication",
    description,
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
    url,
  };
}

export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function getCollectionPageSchema(
  title: string,
  description: string,
  url: string,
  items: Array<{ name: string; url: string; description: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    hasPart: items.map((item, idx) => ({
      "@type": "WebPage",
      position: idx + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}

export { SITE_URL, GESMINE_ORG };
