import toast from "react-hot-toast";

export const uploadToBunny = async (
  file: File,
  contentType: string
): Promise<string> => {
  const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
  const storage = process.env.NEXT_PUBLIC_STORAGE;
  const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;

  if (!storageZoneName || !accessKey || !storage) {
    const errorMessage = "Bunny.net credentials are not configured.";
    toast.error(errorMessage);
    console.error(
      "Error: Make sure NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME, NEXT_PUBLIC_STORAGE, and NEXT_PUBLIC_BUNNY_ACCESS_KEY are set."
    );
    throw new Error(errorMessage);
  }

  const getContentTypeFolder = (type: string): string => {
    switch (type) {
      case "image":
        return "images";
      case "video":
        return "videos";
      case "gif":
        return "gifs";
      default:
        return "others";
    }
  };

  const folder = getContentTypeFolder(contentType);
  const path = `/main-content/${folder}`;

  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

  const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${path}/${uniqueFileName}`;
  const publicUrl = `https://${storage}.b-cdn.net/${path}/${uniqueFileName}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: accessKey,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    let errorDetails = "An unknown error occurred.";
    try {
      // Try to parse error response as text first, as it may not be JSON
      const errorText = await response.text();
      // Attempt to parse as JSON if it's a string that looks like a JSON object
      errorDetails = JSON.parse(errorText).Message || errorText;
    } catch (e) {
      // Fallback if parsing fails
      console.error("Could not parse Bunny.net error response", e);
    }
    console.error("Failed to upload to Bunny.net:", errorDetails);
    throw new Error(`Upload failed: ${errorDetails}`);
  }

  return publicUrl;
};

export const uploadFeaturedStoryMedia = async (
  file: File,
  storyTitle: string,
  index: number | string
): Promise<string> => {
  const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
  const storage = process.env.NEXT_PUBLIC_STORAGE;
  const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;

  if (!storageZoneName || !accessKey || !storage) {
    const errorMessage = "Bunny.net credentials are not configured.";
    toast.error(errorMessage);
    console.error(
      "Error: Make sure NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME, NEXT_PUBLIC_STORAGE, and NEXT_PUBLIC_BUNNY_ACCESS_KEY are set."
    );
    throw new Error(errorMessage);
  }

  const path = "/featured-stories";

  // Sanitize story title and create a consistent filename
  const sanitizedTitle = storyTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  const fileExtension = file.name.split(".").pop() || "jpg";
  const fileName = `${sanitizedTitle}-${index}.${fileExtension}`;

  const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${path}/${fileName}`;
  const publicUrl = `https://${storage}.b-cdn.net/${path}/${fileName}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: accessKey,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    let errorDetails = "An unknown error occurred.";
    try {
      const errorText = await response.text();
      errorDetails = JSON.parse(errorText).Message || errorText;
    } catch (e) {
      console.error("Could not parse Bunny.net error response", e);
    }
    console.error("Failed to upload to Bunny.net:", errorDetails);
    throw new Error(`Upload failed: ${errorDetails}`);
  }

  return publicUrl;
};

export const uploadCreatorMedia = async (
  file: File,
  storyTitle: string,
  index: number | string
): Promise<string> => {
  const storageZoneName = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME;
  const storage = process.env.NEXT_PUBLIC_STORAGE;
  const accessKey = process.env.NEXT_PUBLIC_BUNNY_ACCESS_KEY;

  if (!storageZoneName || !accessKey || !storage) {
    const errorMessage = "Bunny.net credentials are not configured.";
    toast.error(errorMessage);
    console.error(
      "Error: Make sure NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME, NEXT_PUBLIC_STORAGE, and NEXT_PUBLIC_BUNNY_ACCESS_KEY are set."
    );
    throw new Error(errorMessage);
  }

  const path = "creator-profile";

  // Sanitize story title and create a consistent filename
  const sanitizedTitle = storyTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  const fileExtension = file.name.split(".").pop() || "jpg";
  const fileName = `${sanitizedTitle}-${index}.${fileExtension}`;

  const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${path}/${fileName}`;
  const publicUrl = `https://${storage}.b-cdn.net/${path}/${fileName}`;

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      AccessKey: accessKey,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    let errorDetails = "An unknown error occurred.";
    try {
      const errorText = await response.text();
      errorDetails = JSON.parse(errorText).Message || errorText;
    } catch (e) {
      console.error("Could not parse Bunny.net error response", e);
    }
    console.error("Failed to upload to Bunny.net:", errorDetails);
    throw new Error(`Upload failed: ${errorDetails}`);
  }

  return publicUrl;
};
