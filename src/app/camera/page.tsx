'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Image from 'next/image';

interface CameraFeed {
  id: string;
  gateId: string;
  imageUrl: string;
  timestamp: string;
  type: 'idle' | 'help';
}

export default function CameraFeedPage() {
  const socket = useSocket();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>([]);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Mendengarkan event kamera baru
    socket.on('camera_snapshot', (data: CameraFeed) => {
      setCameraFeeds(prev => [data, ...prev]);
    });

    // Mendengarkan update URL live stream
    socket.on('live_stream_url', (data: { gateId: string; url: string }) => {
      if (data.gateId === selectedGate) {
        setLiveUrl(data.url);
      }
    });

    return () => {
      socket.off('camera_snapshot');
      socket.off('live_stream_url');
    };
  }, [socket, selectedGate]);

  const handleGateSelect = (gateId: string) => {
    setSelectedGate(gateId);
    // Meminta URL live stream untuk gate yang dipilih
    socket?.emit('request_live_stream', { gateId });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Monitoring Kamera Gate
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Pilih gate untuk melihat live camera dan histori gambar
        </p>
      </div>

      {/* Panel Live Camera */}
      <div className={`bg-[#222B36] dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {selectedGate ? `Live Camera - Gate ${selectedGate}` : 'Pilih Gate'}
          </h2>
          {liveUrl && (
            <button
              onClick={toggleFullscreen}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {isFullscreen ? '🔄 Kembali' : '🔍 Perbesar'}
            </button>
          )}
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {liveUrl ? (
            <video
              src={liveUrl}
              className="w-full h-full object-contain"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              {selectedGate ? 'Memuat video...' : 'Silakan pilih gate terlebih dahulu'}
            </div>
          )}
        </div>
      </div>

      {/* Daftar Gate */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((gate) => (
          <button
            key={gate}
            onClick={() => handleGateSelect(`${gate}`)}
            className={`p-4 rounded-lg text-center transition-colors duration-200
              ${selectedGate === `${gate}`
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
          >
            Gate {gate}
          </button>
        ))}
      </div>

      {/* Histori Gambar */}
      <div className="bg-[#222B36] dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Histori Gambar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cameraFeeds
            .filter(feed => !selectedGate || feed.gateId === selectedGate)
            .map((feed) => (
              <div
                key={feed.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <Image
                  src={feed.imageUrl}
                  alt={`Gate ${feed.gateId} - ${feed.timestamp}`}
                  className="w-full aspect-video object-cover"
                  width={300}
                  height={200}
                />
                <div className="p-3">
                  <p className="font-medium text-gray-800 dark:text-white">
                    Gate {feed.gateId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(feed.timestamp).toLocaleString('id-ID')}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2
                    ${feed.type === 'help'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {feed.type === 'help' ? 'Bantuan' : 'Idle'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}