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
