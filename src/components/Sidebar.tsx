'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/location', label: 'Lokasi', icon: '📌' },
    { href: '/master', label: 'Master', icon: '📁' },
    { href: '/reports', label: 'Laporan', icon: '📝' },
    { href: '/settings', label: 'Pengaturan', icon: '⚙️' },
  ];

  return (
    <div className="w-64 h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sky Command</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-6 py-3 text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' : ''}
            `}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}