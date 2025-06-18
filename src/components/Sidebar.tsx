"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineBars3 } from "react-icons/hi2";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/location", label: "Lokasi", icon: "📌" },
    { href: "/master", label: "Master", icon: "📁" },
    { href: "/reports", label: "Laporan", icon: "📝" },
    // { href: "/tickets", label: "Tiket", icon: "🎫" },
  ];

  // Check if device is mobile and set initial sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768; // md breakpoint
      setIsMobile(isMobileView);

      // Set sidebar closed by default on mobile (showing only icons)
      if (isMobileView) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`${isOpen ? "w-64" : "w-16"
          } h-full transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative ${isMobile ? 'fixed left-0 top-0 z-50 md:relative' : ''
          }`}
      >
        {/* Header Section */}
        <div className="flex flex-col h-full">
          {/* Logo and Title Section */}
          <div className="flex flex-col items-center py-6 px-4 relative">
            {/* Logo */}
            <div className="flex justify-center items-center mb-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={isOpen ? 50 : 35}
                height={isOpen ? 50 : 35}
                className="dark:invert transition-all duration-300 ease-in-out"
              />
            </div>

            {/* Title - dengan animasi fade */}
            <div
              className={`transition-all duration-300 overflow-hidden ${isOpen ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
                }`}
            >
              <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center whitespace-nowrap">
                Sky Command
              </h1>
            </div>

            {/* Toggle Button - dengan posisi yang lebih baik dan tampilan yang lebih proporsional */}
            <button
              onClick={toggleSidebar}
              className={`absolute -right-10 top-4 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-105 shadow-md ${isMobile && !isOpen ? 'hidden' : ''
                }`}
              aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
            >
              <HiOutlineBars3 size={24} />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 mx-4 mb-4"></div>

          {/* Navigation */}
          <nav className="flex-1 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  ${pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : ""
                  }
                  ${!isOpen ? "justify-center" : ""}
                `}
                title={!isOpen ? item.label : ""}
                onClick={() => {
                  // Auto close sidebar on mobile when clicking menu item (only if expanded)
                  if (isMobile && isOpen) {
                    setIsOpen(false);
                  }
                }}
              >
                <span
                  className={`text-lg flex-shrink-0 transition-all duration-200 ${!isOpen ? "text-xl" : ""
                    }`}
                >
                  {item.icon}
                </span>

                {/* Label dengan animasi slide */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${isOpen
                      ? "opacity-100 max-w-full ml-3"
                      : "opacity-0 max-w-0 ml-0"
                    }`}
                >
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Collapsed state indicator */}
          {!isOpen && !isMobile && (
            <div className="px-2 pb-4">
              <div className="flex justify-center">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50"></div>
              </div>
            </div>
          )}

          {/* Footer space */}
          <div className="p-4">{/* Space for footer content if needed */}</div>
        </div>
      </div>

      {/* Mobile toggle button when sidebar is collapsed (icon-only mode) */}
      {isMobile && !isOpen && (
        <div className="fixed top-0 left-0 w-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Mobile toggle button */}
          <div className="flex justify-center items-center py-6 px-4">
            <button
              onClick={() => setIsOpen(true)}
              className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-105 shadow-md"
              aria-label="Buka sidebar"
            >
              <HiOutlineBars3 size={20} />
            </button>
          </div>

          {/* Mobile navigation icons only */}
          <nav className="flex-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-center px-2 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  ${pathname === item.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : ""
                  }
                `}
                title={item.label}
              >
                <span className="text-xl">
                  {item.icon}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}