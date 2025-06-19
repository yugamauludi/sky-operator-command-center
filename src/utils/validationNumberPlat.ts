// Validation function for Indonesian license plates
export function validateIndonesianLicensePlate(value: string): { isValid: boolean; message: string } {
  if (!value) {
    return { 
      isValid: false, 
      message: "Plat nomor wajib diisi" 
    };
  }

  // Hapus spasi berlebih dan normalize input
  const normalizedPlate = value.trim().replace(/\s+/g, ' ').toUpperCase();
  
  // Format yang valid:
  // B 1234 ABC
  // AB 1234 ABC
  const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/;

  if (!plateRegex.test(normalizedPlate)) {
    return {
      isValid: false,
      message: "Format tidak valid. Contoh: B 1234 ABC atau AB 1234 ABC"
    };
  }

  return { 
    isValid: true, 
    message: "" 
  };
}