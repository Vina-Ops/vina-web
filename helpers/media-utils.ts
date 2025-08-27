type MediaMetadata = {
  resolution: string;
  orientation: "landscape" | "portrait" | "square";
};

export const getMediaMetadata = (file: File): Promise<MediaMetadata> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith("image/")) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        let orientation: MediaMetadata["orientation"] = "square";
        if (width > height) {
          orientation = "landscape";
        } else if (height > width) {
          orientation = "portrait";
        }
        URL.revokeObjectURL(objectUrl);
        resolve({
          resolution: `${width}x${height}`,
          orientation: orientation,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not load image to determine dimensions."));
      };
      img.src = objectUrl;
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      const objectUrl = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        let orientation: MediaMetadata["orientation"] = "square";
        if (width > height) {
          orientation = "landscape";
        } else if (height > width) {
          orientation = "portrait";
        }
        URL.revokeObjectURL(objectUrl);
        resolve({
          resolution: `${width}x${height}`,
          orientation: orientation,
        });
      };
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not load video to determine dimensions."));
      };
      video.src = objectUrl;
    } else {
      reject(new Error("Unsupported file type for metadata extraction."));
    }
  });
};
