import React from "react";

export default function NoData({ message = "Tidak ada data ditemukan" }: { message?: string }) {
  return (
    <div className="text-center py-8 px-4">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5"
        />
      </svg>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  );
}