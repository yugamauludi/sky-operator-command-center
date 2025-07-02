// Validation function for Indonesian license plates
export function validateIndonesianLicensePlate(value: string): {
  isValid: boolean;
  message: string;
} {
  if (!value) {
    return {
      isValid: false,
      message: "Plat nomor wajib diisi",
    };
  }

  const normalizedPlate = value.toUpperCase().trim();

  // Format valid:
  // - B1234ABC
  // - AB1234ABC
  // - B 1234 ABC
  // - AB 1234 ABC
  // - RI 1
  // - B 1
  const plateRegex = /^([A-Z]{1,2})\s?(\d{1,4})(\s?[A-Z]{0,3})?$/;

  if (!plateRegex.test(normalizedPlate)) {
    return {
      isValid: false,
      message: "Format tidak valid. Contoh: B1234ABC, B 1, RI 1, atau AB 1234 ABC",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

export const validateLicensePlate = (plate: string): boolean => {
  const regex = /^[A-Za-z]{1,4}\s?\d{1,4}(\s?[A-Za-z]{1,3})?$/;
  return regex.test(plate.trim());
};
