/**
 * Schema.org JSON-LD Structured Data
 * Provides Google Knowledge Graph, Rich Snippets, Local Business, and AI Agents
 * (Gemini, Claude, Perplexity, SearchGPT) with comprehensive semantic data.
 */
export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pezustandardmedics.com";

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": `${baseUrl}/#organization`,
        "name": "Pezu Standard Medics Concern",
        "alternateName": [
          "Pezu Medics",
          "Pezu Standard Medical Supplies",
          "Pezu Medics Lagos"
        ],
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "image": `${baseUrl}/open-graph.png`,
        "description": "Leading Nigerian distributor of certified medical equipment, diagnostic laboratory test kits, and surgical disposable consumables. Located in Idumota, Lagos Island with express nationwide dispatch.",
        "telephone": "+2348105117437",
        "email": "pezustandardmedicsconcerns@gmail.com",
        "priceRange": "₦₦",
        "currenciesAccepted": "NGN",
        "paymentAccepted": "Bank Transfer, Cash, Corporate Purchase Order",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "24 Alubomimu street, off Imaro Street",
          "addressLocality": "Idumota, Lagos Island",
          "addressRegion": "Lagos State",
          "postalCode": "101223",
          "addressCountry": "NG"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 6.4550,
          "longitude": 3.3841
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          }
        ],
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Lagos State"
          },
          {
            "@type": "Country",
            "name": "Nigeria"
          },
          {
            "@type": "GeoShape",
            "name": "West Africa"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Medical Supplies & Equipment Catalog",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Medical & Surgical Consumables & Disposables",
              "description": "Disposable syringes, sterile surgical gloves, needles, IV cannulas, surgical drapes, and wound care dressings."
            },
            {
              "@type": "OfferCatalog",
              "name": "Laboratory Diagnostic Products",
              "description": "Rapid diagnostic test kits for Malaria, Hepatitis, HIV, Typhoid, specimen bottles, vacuum tubes, and laboratory reagents."
            },
            {
              "@type": "OfferCatalog",
              "name": "Hospital & Clinical Medical Equipment",
              "description": "Centrifuges, autoclaves, patient monitors, diagnostic ultrasound machines, suction machines, and theatre lighting."
            }
          ]
        },
        "sameAs": [
          "https://wa.me/2348105117437"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Pezu Standard Medics Concern",
        "description": "Certified Medical Equipment, Diagnostic Laboratory Test Kits & Surgical Consumables Catalog in Nigeria",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "inLanguage": "en-NG",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where can I buy certified medical equipment in Idumota, Lagos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pezu Standard Medics Concern is located at 24 Alubomimu street, off Imaro Street, Idumota, Lagos Island, Nigeria. We supply authentic clinical diagnostic equipment, surgical instruments, and medical consumables with verified manufacturer quality."
            }
          },
          {
            "@type": "Question",
            "name": "How do I place an order or get an official quotation from Pezu Medics?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Browse our online catalog at pezustandardmedics.com and click 'Enquire on WhatsApp' on any product, or contact our sales and dispatch desk directly on WhatsApp at +234 810 511 7437 or email pezustandardmedicsconcerns@gmail.com for instant proforma invoices and order confirmation."
            }
          },
          {
            "@type": "Question",
            "name": "Does Pezu Standard Medics deliver medical supplies outside Lagos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide same-day dispatch within Lagos metropolis and rapid nationwide courier delivery across all 36 states of Nigeria including Abuja, Port Harcourt, Ibadan, Kano, and Enugu."
            }
          },
          {
            "@type": "Question",
            "name": "What categories of medical products are available at Pezu Medics?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide three core categories: (1) Medical & Surgical Consumables and Disposables including syringes, surgical gloves, needles, and cannulas; (2) Laboratory Diagnostic Products including rapid test kits (Malaria, Hepatitis, HIV, Typhoid) and blood collection tubes; (3) Medical Equipment including autoclaves, centrifuges, suction units, and diagnostic monitors."
            }
          },
          {
            "@type": "Question",
            "name": "Are prices listed on the Pezu Medics catalog wholesale or retail?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our transparent catalog displays competitive prices in Nigerian Naira (NGN) suitable for both unit retail purchases and carton wholesale volumes. Additional volume discounts are provided for hospitals, clinics, and laboratory tenders upon inquiry."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Medical Product Catalog",
            "item": `${baseUrl}/#our-product-price`
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
