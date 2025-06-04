"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/location", label: "Lokasi", icon: "📌" },
    { href: "/master", label: "Master", icon: "📁" },
    { href: "/reports", label: "Laporan", icon: "📝" },
    // { href: "/tickets", label: "Tiket", icon: "🎫" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } h-full shadow-lg transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } h-full shadow-lg transition-all duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <div className="flex justify-center items-center py-4">
          <Image
            onClick={toggleSidebar}
            src="/images/logo.png"
            alt="Logo"
            width={isOpen ? 50 : 30}
            height={isOpen ? 50 : 30}
            className="cursor-pointer dark:invert transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Header (Toggle Button & Title) */}
        <div
          className={`flex items-center ${
            isOpen ? "justify-center" : "justify-center"
          }`}
        >
          {/* <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            <span className="text-lg">≡</span>
          </button> */}
          {isOpen && (
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-opacity duration-300">
              Sky Command
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
              flex items-center px-6 py-3 text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${
                pathname === item.href
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                  : ""
              }
            `}
                title={!isOpen ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium ml-3">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </nav>
      </div>
    </div>
  );
}
