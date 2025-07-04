// Ganti tipe dan response agar sesuai dengan response baru

export interface LocationInfo {
  Code: string;
  Name: string;
}

export interface TransactionData {
  id: number;
  TransactionNo: string;
  InTime: string;
  OutTime: string;
  VehicleType: string;
  TariffAmount: string;
  PaymentStatus: string;
  GateInCode: string;
  GateOutCode: string;
  Duration: number;
  QRTicket: string;
  LicensePlateIn: string;
  LicensePlateOut: string;
  LocationCode: string;
  IssuerID: string;
  issuerInfo: {
    issuerId: string;
    issuerName: string;
    IssuerLongName: string;
  } | null;
  gracePeriod?: number;
  paymentMethod?: string;
  locationInfo: {
    Code: string;
    Name: string;
  };
}

export interface TransactionResponse {
  code: number;
  message: string;
  data: TransactionData;
}

export const fetchTransaction = async (
  keyword: string,
  locationCode: string,
  date: string // tambahkan parameter date
) => {
  try {
    // Gunakan date dari parameter, tidak mengambil date now
    const formattedDate = date;

    const response = await fetch(
      `/api/transaction/find-transaction?keyword=${keyword}&locationCode=${locationCode}&date=${formattedDate}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();

    if (data.data && typeof data.data === "object") {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching transaction: ", err);
    throw err;
  }
};
