export interface Location {
  Name: string;
  // tambahkan properti location lainnya sesuai kebutuhan
}

export interface GateStatusUpdate {
  gate: string
  gateId: string;
  gateStatus: string;
  location?: Location;
  photoIn?: string;
  photoOut?: string;
  capture?: string
  imageBase64?: string;
}

export interface CallEndResponse {
  success: boolean;
  message: string;
}