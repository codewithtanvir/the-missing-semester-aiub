// JSON-LD Structured Data for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Missing Semester AIUB",
  "description": "Comprehensive course materials and resources platform for AIUB students",
  "url": "https://aiubfiles.app",
  "logo": "https://aiubfiles.app/icon-512x512.png",
  "sameAs": [
    // Add social media links here when available
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BD"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Missing Semester AIUB",
  "description": "Access comprehensive course materials, lecture notes, and resources for AIUB students",
  "url": "https://aiubfiles.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aiubfiles.app/courses?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const courseCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AIUB Courses",
  "description": "Browse all available courses and resources for AIUB students",
  "url": "https://aiubfiles.app/courses"
};
