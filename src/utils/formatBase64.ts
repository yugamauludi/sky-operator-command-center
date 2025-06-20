export const formatBase64Image = (base64String: string | undefined): string => {
  if (!base64String) return "/images/Plat-Nomor-Motor-875.png";

  // If it's already a data URL, return as is
  if (base64String.startsWith("data:image/")) {
    return base64String;
  }

  // If it's just the base64 string without data URL prefix, add it
  if (
    base64String.startsWith("/9j/") ||
    base64String.startsWith("iVBOR") ||
    base64String.startsWith("UklGR") ||
    base64String.startsWith("R0lGOD")
  ) {
    return `data:image/jpeg;base64,${base64String}`;
  }

  // Fallback to dummy image if format is unrecognized
  return "/images/Plat-Nomor-Motor-875.png";
};
