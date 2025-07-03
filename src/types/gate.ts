export interface Location {
  Name: string;
  // tambahkan properti location lainnya sesuai kebutuhan
}

export interface GateStatusUpdate {
  gate: string;
  gateId: string;
  gateStatus: string;
  // photoIn?: string;
  // photoOut?: string;
  // capture?: string
  // imageBase64?: string;
  location: {
    Name: string;
    Code: string;
  };
  imageFile: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
  detailGate: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    id: number;
    ticket: string;
    gate: string;
    lokasi: string;
    foto_in: string;
    number_plate: string;
    payment_status: string;
    payment_method: string;
    issuer_name: string;
    payment_time: string;
  };
}

export interface CallEndResponse {
  success: boolean;
  message: string;
}
