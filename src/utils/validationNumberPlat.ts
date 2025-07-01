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

  // Hapus semua spasi dan normalize input ke uppercase
  const normalizedPlate = value.replace(/\s+/g, "").toUpperCase();

  // Format yang valid:
  // B1234ABC
  // AB1234ABC
  const plateRegex = /^[A-Z]{1,2}\d{1,4}[A-Z]{1,3}$/;

  if (!plateRegex.test(normalizedPlate)) {
    return {
      isValid: false,
      message: "Format tidak valid. Contoh: B1234ABC atau AB1234ABC",
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
