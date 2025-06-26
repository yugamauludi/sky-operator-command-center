/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Image from 'next/image';
import TicketModal from './TicketModal';
import CheckTicketModal from './CheckTicketModal';
import { useCheckTicket } from '../hooks/useCheckTicket';
import { fetchTransaction } from '@/hooks/useTransaction';
import type { TransactionResponse } from '@/hooks/useTransaction'; // Import tipe response

interface HeaderProps {
  notifications: any[];
}

export default function Header({
  // notifications
}: HeaderProps) {
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<TransactionResponse | null>(null); // Gunakan tipe TransactionResponse
  const { checkTicket, loading, error } = useCheckTicket();

  const handleCheckTicket = async (keyword: string, locationCode: string, date: string) => {
    try {
      const data = await fetchTransaction(keyword, locationCode, date);
      setTicketData(data);
      setIsCheckModalOpen(false);
      setIsResultModalOpen(true);
    } catch (error) {
      console.error('Error checking ticket:', error);
    }
  };

  return (
    <>
      <header className="h-16 shadow-sm">
        <div className="h-full px-6 flex justify-between items-center">
          {/* Left side - Ticket Check */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center w-full md:w-auto space-x-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm ml-0 md:ml-8">
              <button
                onClick={() => setIsCheckModalOpen(true)}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow whitespace-nowrap"
              >
                Cek Tiket
              </button>
            </div>
          </div>

          {/* Right side - Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Notification section (commented out as per original) */}
            </div>
            
            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Profile"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Check Ticket Modal */}
      <CheckTicketModal 
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        onSubmit={handleCheckTicket}
        loading={loading}
      />

      {/* Ticket Result Modal - This displays the API response */}
      <TicketModal 
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        ticketData={ticketData}
        error={error}
      />
    </>
  );
}