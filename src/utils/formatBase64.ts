export const formatBase64Image = (base64String: string | undefined): string => {
  if (!base64String) return "/images/Plat-Nomor-Motor-875.png";

  if (base64String.startsWith("data:image/")) {
    return base64String;
  }

  if (
    base64String.startsWith("/9j/") ||
    base64String.startsWith("iVBOR") ||
    base64String.startsWith("UklGR") ||
    base64String.startsWith("R0lGOD")
  ) {
    return `data:image/jpeg;base64,${base64String}`;
  }

  return "/images/Plat-Nomor-Motor-875.png";
};
