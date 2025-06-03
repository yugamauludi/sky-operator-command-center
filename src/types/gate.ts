export interface Location {
  Name: string;
  // tambahkan properti location lainnya sesuai kebutuhan
}

export interface GateStatusUpdate {
  gateId: string;
  gateStatus: string;
  location?: Location;
}

export interface CallEndResponse {
  success: boolean;
  message: string;
}