/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { fetchLocation } from '@/hooks/useLocation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Location {
    Code: string;
    Name: string;
}

interface CheckTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (keyword: string, locationCode: string, date: string) => void;
    loading?: boolean;
}

export default function CheckTicketModal({ isOpen, onClose, onSubmit, loading }: CheckTicketModalProps) {
    const [keyword, setKeyword] = useState('');
    const [locationCode, setLocationCode] = useState('');
    const [date, setDate] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setKeyword('');
            setLocationCode('');
            setDate('');
            setIsDropdownOpen(false);
            fetchAllLocations();
        }
    }, [isOpen]);

    const fetchAllLocations = async () => {
        try {
            setLoadingLocations(true);
            const locationData = await fetchLocation(1, 1000);

            if (locationData && locationData.data) {
                setLocations(locationData.data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            toast.error('Gagal memuat data lokasi');
        } finally {
            setLoadingLocations(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!keyword.trim()) {
            toast.error('Silakan masukkan nomor polisi');
            return;
        }

        if (!locationCode) {
            toast.error('Silakan pilih lokasi');
            return;
        }

        if (!date) {
            toast.error('Silakan pilih tanggal');
            return;
        }

        onSubmit(keyword.trim(), locationCode, date);
    };

    const handleClose = () => {
        setKeyword('');
        setLocationCode('');
        setDate('');
        setIsDropdownOpen(false);
        onClose();
    };

    const handleSelectLocation = (code: string) => {
        setLocationCode(code);
        setIsDropdownOpen(false);
    };

    const selectedLocation = locations.find(loc => loc.Code === locationCode);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Cek Tiket Parkir
                    </h2>
                    <button
                        onClick={handleClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Keyword Input */}
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nomor Polisi
                        </label>
                        <input
                            type="text"
                            id="keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Contoh: B 1234 ABC"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    {/* Location Select */}
                    <div>
                        <label htmlFor="locationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Lokasi
                        </label>
                        {loadingLocations ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Memuat data lokasi...</span>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Custom Select Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="cursor-pointer w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white flex items-center justify-between"
                                >
                                    <span className={selectedLocation ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                        {selectedLocation ? selectedLocation.Name : '-- Pilih Lokasi --'}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Custom Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                        <div
                                            className="py-1 max-h-52 overflow-y-auto"
                                            style={{ maxHeight: '200px' }}
                                        >
                                            {locations.length === 0 ? (
                                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Tidak ada lokasi tersedia
                                                </div>
                                            ) : (
                                                locations.map((location) => (
                                                    <button
                                                        key={location.Code}
                                                        type="button"
                                                        onClick={() => handleSelectLocation(location.Code)}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 ${locationCode === location.Code
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200'
                                                            : 'text-gray-900 dark:text-white'
                                                            }`}
                                                    >
                                                        {location.Name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Overlay to close dropdown when clicking outside */}
                                {isDropdownOpen && (
                                    <div
                                        className="fixed inset-0 z-5"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Date Input */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Mencari...' : 'Cek Tiket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}