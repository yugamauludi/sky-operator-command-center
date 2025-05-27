/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  notifications: any[];
}

export default function Header({ notifications }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 shadow-sm">
      <div className="h-full px-6 flex justify-end">
        {/* <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Command Center
          </h2>
        </div> */}

        <div className="flex items-center align-end space-x-4">
          {/* Notifikasi */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
            >
              <span className="text-xl">🔔</span>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#222B36] dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Notifikasi
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada notifikasi baru</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <span className="text-xl">
              {isDarkMode ? '🌞' : '🌙'}
            </span>
          </button>

          {/* Profil */}
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
  );
}