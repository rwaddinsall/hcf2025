// Strapi v5 interfaces for info pages
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi v5 uses flattened response format - no attributes wrapper
export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
}

export interface PageHeader {
  title: string;
  subtitle?: string;
  backgroundImage?: {
    data?: {
      id: number;
      attributes: {
        name: string;
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
      };
    };
  };
}

export interface Accordion {
  title: string;
  content: string;
  isOpen?: boolean;
}

export interface AccordionSection {
  title: string;
  details: any; // Rich text content
  category?:
    | "general"
    | "lineup"
    | "tickets"
    | "transport"
    | "sustainability"
    | "accessibility";
}

export interface InfoPage extends StrapiEntity {
  heading: string;
  subheading?: string;
  slug: string;
  accordion?: AccordionSection[];
}

export type InfoPageResponse = StrapiResponse<InfoPage[]>;
export type SingleInfoPageResponse = StrapiResponse<InfoPage>;

// General page interfaces (for legal pages like Privacy Policy)
export interface GeneralPage extends StrapiEntity {
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

export type GeneralPageResponse = StrapiResponse<GeneralPage[]>;
export type SingleGeneralPageResponse = StrapiResponse<GeneralPage>;

// Article interfaces
export interface Article extends StrapiEntity {
  title: string;
  slug: string;
  content: any; // Rich text content
  excerpt?: string;
  image?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  category?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    documentId: string;
    name: string;
    email?: string;
  };
  metaDescription?: string;
  featured?: boolean;
}

// Artist interfaces
export interface Artist extends StrapiEntity {
  name: string;
  isLive?: boolean;
  country?: string;
  bio?: string; // Text content
  image?: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  socialLink?: string;
  displayOrder?: number;
}

// Response type exports
export type ArticleResponse = StrapiResponse<Article[]>;
export type SingleArticleResponse = StrapiResponse<Article>;
export type ArtistResponse = StrapiResponse<Artist[]>;
export type SingleArtistResponse = StrapiResponse<Artist>;

// UI Components
export interface ScrollingTextComponent {
  id: number;
  text: string;
}

// Scrolling text interfaces
export interface ScrollingHeaderText extends StrapiEntity {
  Text: string;
}

export interface AcknowledgementOfCountry extends StrapiEntity {
  Text: string;
}

export type ScrollingHeaderTextResponse = StrapiResponse<ScrollingHeaderText>;
export type AcknowledgementOfCountryResponse =
  StrapiResponse<AcknowledgementOfCountry>;

// General purpose interfaces for dynamic content
export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Page Header component interface
export interface PageHeaderComponent {
  id: number;
  title?: string;
  subheading?: string;
}

// Text Block component interface
export interface TextBlockComponent {
  id: number;
  Content: any; // Strapi blocks content
}

// Accordion component interface
export interface AccordionComponent {
  id: number;
  title: string;
  details: string;
  category?:
    | "general"
    | "lineup"
    | "tickets"
    | "transport"
    | "sustainability"
    | "accessibility"
    | "applications"; // Added this
  // New fields for applications
  form_url?: string;
  deadline?: string; // Date field comes as string from Strapi
  is_closed?: boolean;
  closed_message?: string;
}

// Info Section component interface
export interface InfoSectionComponent {
  id: number;
  accordions?: AccordionComponent[];
}

// Applications Page interfaces
export interface ApplicationsPage extends StrapiEntity {
  Header?: PageHeaderComponent;
  Body?: TextBlockComponent;
  FAQ?: InfoSectionComponent[];
}

export type ApplicationsPageResponse = StrapiResponse<ApplicationsPage>;

// Sustainability Page interfaces
export interface SustainabilityPage extends StrapiEntity {
  Header?: PageHeaderComponent[];
  Body?: TextBlockComponent;
  Accordion?: AccordionComponent[];
}

export type SustainabilityPageResponse = StrapiResponse<SustainabilityPage>;
