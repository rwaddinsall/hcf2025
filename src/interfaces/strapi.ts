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

export interface InfoSection {
  title: string;
  subtitle?: string;
  content: string;
  sectionId?: string;
  accordions?: Accordion[];
  displayOrder: number;
}

export interface InfoPage extends StrapiEntity {
  title: string;
  slug: string;
  pageHeader?: PageHeader;
  faqs?: InfoSection[];
  metaDescription?: string;
  displayOrder?: number;
}

export type InfoPageResponse = StrapiResponse<InfoPage[]>;
export type SingleInfoPageResponse = StrapiResponse<InfoPage>;

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
