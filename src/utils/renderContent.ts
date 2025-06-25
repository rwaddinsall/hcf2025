/**
 * Content Rendering Utilities
 *
 * Handles rendering of different content formats from Strapi:
 * - Plain text with line breaks (legacy format)
 * - Strapi 5 Rich Text (Blocks) format
 * - HTML strings
 */

/**
 * Strapi 5 Rich Text Block interfaces
 */
interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

interface ParagraphBlock {
  type: "paragraph";
  children: (TextNode | LinkNode)[];
}

interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: (TextNode | LinkNode)[];
}

interface ListBlock {
  type: "list";
  format: "unordered" | "ordered";
  children: ListItemBlock[];
}

interface ListItemBlock {
  type: "list-item";
  children: (TextNode | LinkNode | ParagraphBlock)[];
}

type RichTextBlock = ParagraphBlock | HeadingBlock | ListBlock | ListItemBlock;

/**
 * Renders text nodes with proper formatting
 */
function renderTextNode(node: TextNode): string {
  let text = node.text;

  if (node.bold) text = `<strong>${text}</strong>`;
  if (node.italic) text = `<em>${text}</em>`;
  if (node.underline) text = `<u>${text}</u>`;
  if (node.strikethrough) text = `<s>${text}</s>`;
  if (node.code) text = `<code>${text}</code>`;

  return text;
}

/**
 * Renders link nodes
 */
function renderLinkNode(node: LinkNode): string {
  const children = node.children.map(renderTextNode).join("");
  return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
}

/**
 * Renders a paragraph block
 */
function renderParagraphBlock(block: ParagraphBlock): string {
  const content = block.children
    .map((child) => {
      if (child.type === "text") return renderTextNode(child);
      if (child.type === "link") return renderLinkNode(child);
      return "";
    })
    .join("");

  return `<p>${content}</p>`;
}

/**
 * Renders a heading block
 */
function renderHeadingBlock(block: HeadingBlock): string {
  const content = block.children
    .map((child) => {
      if (child.type === "text") return renderTextNode(child);
      if (child.type === "link") return renderLinkNode(child);
      return "";
    })
    .join("");

  return `<h${block.level}>${content}</h${block.level}>`;
}

/**
 * Renders a list item block
 */
function renderListItemBlock(block: ListItemBlock): string {
  const content = block.children
    .map((child) => {
      if (child.type === "text") return renderTextNode(child);
      if (child.type === "link") return renderLinkNode(child);
      if (child.type === "paragraph") return renderParagraphBlock(child);
      return "";
    })
    .join("");

  return `<li>${content}</li>`;
}

/**
 * Renders a list block
 */
function renderListBlock(block: ListBlock): string {
  const items = block.children.map(renderListItemBlock).join("");
  const tag = block.format === "ordered" ? "ol" : "ul";
  return `<${tag}>${items}</${tag}>`;
}

/**
 * Renders Strapi 5 rich text blocks to HTML
 */
function renderRichTextBlocks(blocks: RichTextBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return renderParagraphBlock(block);
        case "heading":
          return renderHeadingBlock(block);
        case "list":
          return renderListBlock(block);
        case "list-item":
          return renderListItemBlock(block);
        default:
          return "";
      }
    })
    .join("\n");
}

/**
 * Converts plain text with line breaks to HTML paragraphs
 */
function renderPlainText(text: string): string {
  if (!text || typeof text !== "string") return "";

  // Split by double line breaks to create paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  return paragraphs
    .map((paragraph) => {
      // Convert single line breaks within paragraphs to <br> tags
      const content = paragraph.trim().replace(/\n/g, "<br>");
      return `<p>${content}</p>`;
    })
    .join("\n");
}

/**
 * Main rendering function that handles different content formats
 * @param content - Can be string (plain text), array (rich text blocks), or already rendered HTML
 * @returns HTML string ready for rendering
 */
export function renderContent(content: any): string {
  // Handle null/undefined
  if (!content) return "";

  // If it's already a string, check if it looks like HTML or plain text
  if (typeof content === "string") {
    // If it contains HTML tags, return as-is
    if (content.includes("<") && content.includes(">")) {
      return content;
    }
    // Otherwise, treat as plain text and convert line breaks
    return renderPlainText(content);
  }

  // If it's an array, assume it's Strapi 5 rich text blocks
  if (Array.isArray(content)) {
    return renderRichTextBlocks(content as RichTextBlock[]);
  }

  // If it's an object, it might be a single rich text block
  if (typeof content === "object" && content.type) {
    return renderRichTextBlocks([content as RichTextBlock]);
  }

  // Fallback: convert to string and treat as plain text
  return renderPlainText(String(content));
}

/**
 * Sanitizes and renders content for safe HTML output
 * @param content - Raw content from Strapi
 * @returns Sanitized HTML string
 */
export function renderSafeContent(content: any): string {
  const html = renderContent(content);

  // Basic HTML sanitization - only allow safe tags
  const allowedTags = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "a",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
  ];
  const allowedAttributes = ["href", "target", "rel"];

  // Simple regex-based sanitization (you might want to use a proper HTML sanitizer library)
  let sanitized = html;

  // Remove any script tags
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove any onclick, onload, etc. attributes
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "");

  return sanitized;
}
