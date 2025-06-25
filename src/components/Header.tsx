/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import Image from 'next/image';
import TicketModal, { TicketData } from './TicketModal';
import { useCheckTicket } from '../hooks/useCheckTicket';

interface HeaderProps {
  notifications: any[];
}

export default function Header({
  //  notifications
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const { checkTicket, loading, error } = useCheckTicket();

  const handleCheckTicket = async () => {
    if (!searchValue.trim()) {
      alert('Silakan masukkan nomor polisi atau nomor transaksi');
      return;
    }

    const data = await checkTicket(searchValue);
    setTicketData(data);
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheckTicket();
    }
  };

  return (
    <>
      <header className="h-16 shadow-sm">
        <div className="h-full px-6 flex justify-between items-center">
          {/* Left side - Ticket Check */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center w-full md:w-auto space-x-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm ml-0 md:ml-8">
              <input
                type="text"
                placeholder="Masukkan nopol atau nomor transaksi"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 w-full md:w-80"
              />
              <button
                onClick={handleCheckTicket}
                disabled={loading}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-1 rounded-md text-sm font-medium transition-colors shadow whitespace-nowrap"
              >
                {loading ? 'Mencari...' : 'Cek Tiket'}
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

      {/* Ticket Modal */}
      <TicketModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketData={ticketData}
        error={error}
      />
    </>
  );
}