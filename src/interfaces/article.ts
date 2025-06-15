export default interface Article {
  id: number;
  attributes: {
    title: string;
    metaDescription?: string;
    slug: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    pageHeader?: {
      title: string;
      subtitle?: string;
    };
    infoSections?: Array<{
      title: string;
      subtitle?: string;
      content: string;
      sectionId?: string;
      displayOrder: number;
      accordions?: Array<{
        heading: string;
        details: string;
        displayOrder: number;
      }>;
    }>;
  };
}
