"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineBars3 } from "react-icons/hi2";
import { DashboardIcon, LocationIcon, LogoutIcon, MasterIcon, ReportsIcon } from "@/public/icons/Icons";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: DashboardIcon },
    { href: "/location", label: "Lokasi", icon: LocationIcon },
    { href: "/master", label: "Master", icon: MasterIcon },
    { href: "/reports", label: "Laporan", icon: ReportsIcon },
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

  const handleLogout = () => {
    // Lakukan proses logout di sini, misal clear token dan redirect
    // Contoh:
    // localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Alternative: Logika isActive yang lebih strict
  const isActiveStrict = (href: string) => {
    if (href === "/") {
      // Dashboard hanya aktif jika benar-benar di root
      return pathname === "/";
    }

    // Untuk route lainnya, cek apakah pathname dimulai dengan href
    // dan pastikan karakter setelah href adalah "/" atau akhir string
    if (pathname.startsWith(href)) {
      const nextChar = pathname[href.length];
      return nextChar === "/" || nextChar === undefined;
    }

    return false;
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`${isOpen ? "w-64" : "w-16"
          } h-full transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative ${isMobile ? 'fixed left-0 top-0 z-50 md:relative' : ''
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
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
            <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "opacity-100 max-h-10" : "opacity-0 max-h-0"}`}>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white text-center whitespace-nowrap">
                Sky Command
              </h1>
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className={`
                cursor-pointer absolute -right-12 top-3 w-10 h-10 flex items-center justify-center
                bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                rounded-md shadow-md transition-all duration-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                active:scale-95
                ${isMobile && !isOpen ? 'hidden' : ''}
              `}
              aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
            >
              <span
                className={`
                  transition-transform duration-300
                  ${isOpen ? "rotate-0" : "rotate-90"}
                  text-black dark:text-white
                `}
              >
                <HiOutlineBars3 size={26} />
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 mx-4 mb-4"></div>

          {/* Navigation */}
          <nav className="flex-1 px-3">
            {menuItems.map((item) => {
              const itemIsActive = isActiveStrict(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98]
                    ${itemIsActive ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" : ""}
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
                  <IconComponent
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${!isOpen ? "w-6 h-6" : ""}`}
                  />

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
              );
            })}
          </nav>

          {/* Collapsed state indicator */}
          {!isOpen && !isMobile && (
            <div className="px-2 pb-4">
              <div className="flex justify-center">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50"></div>
              </div>
            </div>
          )}

          {/* Logout menu item (sticky at bottom) */}
          <div className="mt-auto px-3 pb-4">
            <button
              onClick={handleLogout}
              className={`
              cursor-pointer flex items-center w-full px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300
              hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400
              transition-all duration-200 font-medium
              ${!isOpen ? "justify-center" : ""}
            `}
            >
              <LogoutIcon className={`w-5 h-5 flex-shrink-0 ${!isOpen ? "w-6 h-6" : ""}`} />
              <span
                className={`transition-all duration-300 overflow-hidden ${isOpen ? "opacity-100 max-w-full ml-3" : "opacity-0 max-w-0 ml-0"
                  }`}
              >
                Logout
              </span>
            </button>
          </div>

          {/* Footer space */}
          <div className="p-4"></div>
        </div>
      </div>

      {/* Mobile collapsed sidebar */}
      {isMobile && !isOpen && (
        <div className="fixed top-0 left-0 w-16 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Mobile toggle button */}
          <div className="flex justify-center items-center py-6 px-4">
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-all duration-200 hover:scale-105 shadow-md"
              aria-label="Buka sidebar"
            >
              <HiOutlineBars3 size={20} />
            </button>
          </div>

          {/* Mobile navigation icons only */}
          <nav className="flex-1 px-2">
            {menuItems.map((item) => {
              const itemIsActive = isActiveStrict(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-center px-2 py-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                    hover:scale-[1.02] active:scale-[0.98]
                    ${itemIsActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : ""
                    }
                  `}
                  title={item.label}
                >
                  <IconComponent className="w-6 h-6" />
                </Link>
              );
            })}
          </nav>

          {/* Logout for collapsed mobile */}
          <div className="px-2 pb-4 mt-auto">
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center justify-center w-full px-2 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 font-medium"
              title="Logout"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}