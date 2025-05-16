'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

interface HelpRequest {
  id: string;
  gateId: string;
  type: 'help' | 'idle';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export default function Dashboard() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<HelpRequest[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [totalOpen, setTotalOpen] = useState(0);
  const [totalInProgress, setTotalInProgress] = useState(0);
  const [totalResolved, setTotalResolved] = useState(0);
  const [isPanduanVisible, setIsPanduanVisible] = useState(true);

  // Initialize audio after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/notification.mp3'));
    }
  }, []);

  useEffect(() => {
    // Calculate totals
    const open = helpRequests.filter(req => req.status === 'open').length;
    const inProgress = helpRequests.filter(req => req.status === 'in_progress').length;
    const resolved = helpRequests.filter(req => req.status === 'resolved').length;
    
    setTotalOpen(open);
    setTotalInProgress(inProgress);
    setTotalResolved(resolved);
  }, [helpRequests]);

  useEffect(() => {
    if (!socket) return;

    // Handle help request events
    const handleHelpRequest = (data: HelpRequest) => {
      setNotifications(prev => [data, ...prev]);
      audio?.play();
      
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      setHelpRequests(prev => [data, ...prev]);
    };

    // Handle idle customer events
    const handleIdleCustomer = (data: HelpRequest) => {
      setNotifications(prev => [data, ...prev]);
    };

    // Set up event listeners
    socket.on('help_request', handleHelpRequest);
    socket.on('idle_customer', handleIdleCustomer);

    // Cleanup event listeners
    return () => {
      socket.off('help_request', handleHelpRequest);
      socket.off('idle_customer', handleIdleCustomer);
    };
  }, [socket, audio]);

  const updateRequestStatus = (requestId: string, newStatus: HelpRequest['status']) => {
    setHelpRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header notifications={notifications} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {/* Panduan Cepat */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPanduanVisible(!isPanduanVisible)}>
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  📝 Panduan Cepat
                </h3>
                <button className="text-blue-700 dark:text-blue-300">
                  {isPanduanVisible ? '▼' : '▶'}
                </button>
              </div>
              {isPanduanVisible && (
                <ul className="list-disc list-inside text-sm text-blue-600 dark:text-blue-200 space-y-1 mt-2">
                  <li>Klik tombol {"Proses"} untuk mulai menangani bantuan</li>
                  <li>Klik tombol {"Selesai"} jika bantuan sudah diselesaikan</li>
                  <li>Suara akan berbunyi jika ada permintaan bantuan baru</li>
                </ul>
              )}
            </div>
            
            {/* Daftar Permintaan Bantuan */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <span className="mr-2">🎯</span> Daftar Permintaan Bantuan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kolom Perlu Bantuan */}
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
                    <span className="mr-2">🔴</span> Perlu Bantuan ({totalOpen})
                  </h3>
                  <div className="space-y-3">
                    {helpRequests
                      .filter(req => req.status === 'open')
                      .map(request => (
                        <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-red-100 dark:border-red-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Gate {request.gateId}</span>
                            <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                              Baru
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </p>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'in_progress')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            👉 Proses Sekarang
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Kolom Sedang Ditangani */}
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center">
                    <span className="mr-2">🟡</span> Sedang Ditangani ({totalInProgress})
                  </h3>
                  <div className="space-y-3">
                    {helpRequests
                      .filter(req => req.status === 'in_progress')
                      .map(request => (
                        <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Gate {request.gateId}</span>
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                              Proses
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </p>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'resolved')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            ✅ Selesai
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Kolom Selesai */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center">
                    <span className="mr-2">🟢</span> Selesai ({totalResolved})
                  </h3>
                  <div className="space-y-3">
                    {helpRequests
                      .filter(req => req.status === 'resolved')
                      .map(request => (
                        <div key={request.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-green-100 dark:border-green-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Gate {request.gateId}</span>
                            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                              Selesai
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}