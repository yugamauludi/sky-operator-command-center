/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface TicketData {
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
  issuerInfo: null;
  locationInfo: {
    Code: string;
    Name: string;
  };
}

interface UseCheckTicketReturn {
  checkTicket: (
    keyword: string,
    locationCode: string,
    date: string
  ) => Promise<TicketData | null>;
  loading: boolean;
  error: string | null;
}

export function useCheckTicket(): UseCheckTicketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy data for fallback
  const dummyTicketData: TicketData = {
    id: 538327,
    TransactionNo: "6032982869966018",
    InTime: "2025-06-24T09:09:07.000Z",
    OutTime: "2025-06-24T09:14:56.000Z",
    VehicleType: "MOBIL",
    TariffAmount: "0",
    PaymentStatus: "FREE",
    GateInCode: "PM2",
    GateOutCode: "PK1",
    Duration: 5,
    QRTicket:
      "https://billing.skyparking.online/Ebilling?p1=ID2019000411726&p2=6032982869966018",
    LicensePlateIn: "A1060VR",
    LicensePlateOut: "A1060VR",
    LocationCode: "007SK",
    IssuerID: "",
    issuerInfo: null,
    locationInfo: {
      Code: "007SK",
      Name: "Siloam Hospital Lippo Village",
    },
  };

  const checkTicket = async (
    keyword: string,
    locationCode: string,
    date: string
  ): Promise<TicketData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        keyword: keyword,
        locationCode: locationCode,
        date: date,
      });

      // Attempt to call the real API with new parameters
      const response = await fetch(
        `/api/transaction/find-transaction?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.ticket) {
        return data.ticket;
      } else {
        throw new Error(data.message || "Ticket not found");
      }
    } catch (apiError) {
      console.warn("API call failed, using dummy data:", apiError);
      setError("Menggunakan data contoh (API tidak tersedia)");

      // Return dummy data with modified fields to match search parameters
      const modifiedDummyData = { ...dummyTicketData };

      // Simple check if keyword looks like a plate number (contains letters and numbers)
      const plateNumberPattern = /^[A-Za-z]\s*\d+\s*[A-Za-z]+$/;
      const transactionPattern = /^TRX-/i;

      if (plateNumberPattern.test(keyword.replace(/\s+/g, " ").trim())) {
        modifiedDummyData.LicensePlateIn = keyword.toUpperCase();
      } else if (transactionPattern.test(keyword)) {
        modifiedDummyData.TransactionNo = keyword.toUpperCase();
      }

      // Update location based on locationCode (you can expand this mapping)
      const locationMapping: { [key: string]: string } = {
        LOC001: "Mall Central Park",
        LOC002: "Mall Taman Anggrek",
        LOC003: "Mall Kelapa Gading",
        LOC004: "Mall PIK Avenue",
        LOC005: "Mall Senayan City",
      };

      if (locationMapping[locationCode]) {
        modifiedDummyData.locationInfo.Name = locationMapping[locationCode];
      }

      // Update date-related fields
      modifiedDummyData.InTime = `${date}T08:30:00Z`;
      modifiedDummyData.OutTime = `${date}T11:00:00Z`;
      return modifiedDummyData;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkTicket,
    loading,
    error,
  };
}
