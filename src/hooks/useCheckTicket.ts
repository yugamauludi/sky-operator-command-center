/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface TicketData {
  transactionNo: string;
  transactionStatus: string;
  inTime: string;
  duration: string;
  tariffParking: number;
  vehicleType: string;
  codeGate: string;
  plateNumber: string;
  outTime: string;
  gateOut: string;
  gracePeriod: string;
  location: string;
  paymentStatus: string;
  paymentTime: string;
  paymentMethod: string;
  issueName: string;
  issuerCode: string;
}

interface UseCheckTicketReturn {
  checkTicket: (query: string) => Promise<TicketData | null>;
  loading: boolean;
  error: string | null;
}

export function useCheckTicket(): UseCheckTicketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dummy data for fallback
  const dummyTicketData: TicketData = {
    transactionNo: "TRX-2024-001234",
    transactionStatus: "COMPLETED",
    inTime: "2024-06-25T08:30:00Z",
    duration: "2h 30m",
    tariffParking: 5000,
    vehicleType: "MOTOR",
    codeGate: "GATE-A1",
    plateNumber: "B 1234 ABC",
    outTime: "2024-06-25T11:00:00Z",
    gateOut: "GATE-A2",
    gracePeriod: "15 minutes",
    location: "Mall Central Park",
    paymentStatus: "PAID",
    paymentTime: "2024-06-25T10:55:00Z",
    paymentMethod: "QRIS",
    issueName: "PT. Parking Solutions",
    issuerCode: "PK001",
  };

  const checkTicket = async (query: string): Promise<TicketData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Attempt to call the real API
      const response = await fetch(
        `/api/check-ticket?query=${encodeURIComponent(query)}`,
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

      // Return dummy data with modified plate number to match search query
      // if query looks like a plate number
      const modifiedDummyData = { ...dummyTicketData };

      // Simple check if query looks like a plate number (contains letters and numbers)
      const plateNumberPattern = /^[A-Za-z]\s*\d+\s*[A-Za-z]+$/;
      const transactionPattern = /^TRX-/i;

      if (plateNumberPattern.test(query.replace(/\s+/g, " ").trim())) {
        modifiedDummyData.plateNumber = query.toUpperCase();
      } else if (transactionPattern.test(query)) {
        modifiedDummyData.transactionNo = query.toUpperCase();
      }

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
