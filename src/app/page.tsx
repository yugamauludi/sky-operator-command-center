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

  // Inisialisasi audio setelah komponen dimount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/sound/sound-effect-old-phone-191761.mp3'));
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

  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi untuk memfilter permintaan bantuan
  const filteredRequests = helpRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.gateId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const testNotificationSound = () => {
    audio?.play();
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header notifications={notifications} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#1B2028] dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {/* Panduan Cepat */}
            <div className="bg-[#222B36] p-4 rounded-lg mb-8">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPanduanVisible(!isPanduanVisible)}>
                <h3 className="text-lg font-semibold text-white flex items-center">
                  📝 Panduan Cepat
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testNotificationSound}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">🔊</span> Tes Suara
                  </button>
                  <button className="text-white">
                    {isPanduanVisible ? '▼' : '▶'}
                  </button>
                </div>
              </div>
              {isPanduanVisible && (
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mt-2">
                  <li>Klik tombol {"Proses"} untuk mulai menangani bantuan</li>
                  <li>Klik tombol {"Selesai"} jika bantuan sudah diselesaikan</li>
                  <li>Suara akan berbunyi jika ada permintaan bantuan baru</li>
                  <li>Klik tombol {"Tes Suara"} untuk menguji notifikasi suara dan getaran</li>
                </ul>
              )}
            </div>
            
            {/* Filter dan Pencarian */}
            <div className="bg-[#222B36] rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-white">Filter Status:</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${filterStatus === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#2A3441] text-gray-300 hover:bg-[#2F3B4B]'}`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setFilterStatus('open')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${filterStatus === 'open'
                          ? 'bg-red-500 text-white'
                          : 'bg-[#2A3441] text-gray-300 hover:bg-[#2F3B4B]'}`}
                    >
                      Perlu Bantuan
                    </button>
                    <button
                      onClick={() => setFilterStatus('in_progress')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${filterStatus === 'in_progress'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-[#2A3441] text-gray-300 hover:bg-[#2F3B4B]'}`}
                    >
                      Sedang Ditangani
                    </button>
                    <button
                      onClick={() => setFilterStatus('resolved')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${filterStatus === 'resolved'
                          ? 'bg-green-500 text-white'
                          : 'bg-[#2A3441] text-gray-300 hover:bg-[#2F3B4B]'}`}
                    >
                      Selesai
                    </button>
                  </div>
                </div>
                <div className="flex-1 md:max-w-xs">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nomor gate..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[#2A3441] border-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Summary dan Daftar */}
            <div className="grid grid-cols-4 gap-6">
              {/* Card Perlu Bantuan */}
              <div className="bg-[#222B36] rounded-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Perlu Bantuan</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">{totalOpen}</p>
                  </div>
                  <div className="text-red-500 text-2xl">⚠️</div>
                </div>
              </div>

              {/* Daftar Permintaan */}
              <div className="col-span-3 bg-[#222B36] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Daftar Permintaan Bantuan</h2>
                
                <div className="grid grid-cols-3 gap-6">
                  {/* Kolom Status */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white mb-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Perlu Bantuan
                      </span>
                      <span>({totalOpen})</span>
                    </div>
                    {filteredRequests
                      .filter(req => req.status === 'open')
                      .map(request => (
                        <div 
                          key={request.id} 
                          className="bg-[#2A3441] p-4 rounded-lg hover:bg-[#2F3B4B] transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Gate {request.gateId}</span>
                            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Baru</span>
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </div>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'in_progress')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium transition-colors duration-200"
                          >
                            Proses Sekarang
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Kolom Sedang Ditangani */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white mb-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        Sedang Ditangani
                      </span>
                      <span>({totalInProgress})</span>
                    </div>
                    {filteredRequests
                      .filter(req => req.status === 'in_progress')
                      .map(request => (
                        <div 
                          key={request.id} 
                          className="bg-[#2A3441] p-4 rounded-lg hover:bg-[#2F3B4B] transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Gate {request.gateId}</span>
                            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">Proses</span>
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </div>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'resolved')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition-colors duration-200"
                          >
                            Selesai
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Kolom Selesai */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white mb-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Selesai
                      </span>
                      <span>({totalResolved})</span>
                    </div>
                    {filteredRequests
                      .filter(req => req.status === 'resolved')
                      .map(request => (
                        <div 
                          key={request.id} 
                          className="bg-[#2A3441] p-4 rounded-lg hover:bg-[#2F3B4B] transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Gate {request.gateId}</span>
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Selesai</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </div>
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