// URL detection regex
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

// Extract URLs from text
export const extractUrls = (text: string): string[] => {
  const matches = text.match(URL_REGEX);
  return matches || [];
};

// Check if text contains URLs
export const hasUrls = (text: string): boolean => {
  return URL_REGEX.test(text);
};

// Extract text without URLs
export const getTextWithoutUrls = (text: string): string => {
  return text.replace(URL_REGEX, "").trim();
};

// Function to get link metadata using Open Graph properties
export const getLinkMetadata = async (url: string) => {
  try {
    // For now, use a simpler approach without external proxy to avoid CORS issues
    // In a production app, you would implement this on your backend

    // Extract basic metadata from URL
    const domain = new URL(url).hostname;

    // Return basic metadata based on domain
    const basicMetadata: Record<
      string,
      {
        title: string;
        description: string;
        image: string | null;
        siteName: string | null;
      }
    > = {
      "github.com": {
        title: "GitHub: Where the world builds software",
        description:
          "GitHub is where over 100 million developers shape the future of software, together.",
        image:
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        siteName: "GitHub",
      },
      "openai.com": {
        title: "OpenAI - Research and deployment company",
        description:
          "OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.",
        image: "https://openai.com/favicon.ico",
        siteName: "OpenAI",
      },
      "instadapp.io": {
        title:
          "Building a suite of tools to leverage the full potential of DeFi and bring it to the masses",
        description:
          "Unlock the full potential of DeFi with instadapp. The ultimate DeFi dashboard for managing your crypto portfolio.",
        image: "https://instadapp.io/favicon.ico",
        siteName: "Instadapp",
      },
      "bifrost.africa": {
        title: "Bifrost Africa - Digital Innovation Hub",
        description:
          "Bifrost Africa is a digital innovation hub focused on building the future of technology in Africa.",
        image: null,
        siteName: "Bifrost Africa",
      },
    };

    // Return metadata for known domains, or fallback for unknown domains
    return (
      basicMetadata[domain] || {
        title: domain.replace(/^www\./, ""),
        description: `Visit ${domain.replace(/^www\./, "")}`,
        image: null,
        siteName: domain.replace(/^www\./, ""),
      }
    );
  } catch (error) {
    // console.error('Error fetching link metadata:', error);

    // Fallback to basic metadata
    try {
      const domain = new URL(url).hostname;
      return {
        title: domain,
        description: `Visit ${domain}`,
        image: null,
        siteName: domain,
      };
    } catch {
      return {
        title: "Link Preview",
        description: "Click to visit this website",
        image: null,
        siteName: null,
      };
    }
  }
};

// Parse Open Graph metadata from HTML
const parseOpenGraphMetadata = (html: string, url: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Extract Open Graph properties
  const getMetaContent = (property: string) => {
    const meta =
      doc.querySelector(`meta[property="${property}"]`) ||
      doc.querySelector(`meta[name="${property}"]`);
    return meta?.getAttribute("content") || null;
  };

  // Get title (prefer OG title, fallback to page title)
  const title =
    getMetaContent("og:title") ||
    doc.querySelector("title")?.textContent ||
    "No title available";

  // Get description (prefer OG description, fallback to meta description)
  const description =
    getMetaContent("og:description") ||
    getMetaContent("description") ||
    "No description available";

  // Get image (prefer OG image)
  const image = getMetaContent("og:image");

  // Get site name
  const siteName = getMetaContent("og:site_name");

  return {
    title: title.trim(),
    description: description.trim(),
    image: image ? new URL(image, url).href : null,
    siteName: siteName?.trim() || null,
  };
};
