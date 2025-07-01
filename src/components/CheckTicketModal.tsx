/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { fetchLocation } from '@/hooks/useLocation';
import { validateLicensePlate } from '@/utils/validationNumberPlat';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SearchableSelect from './SearchableSelect';

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
    const [plateError, setPlateError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setKeyword('');
            setLocationCode('');
            setDate('');
            setPlateError('');
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

    const normalizeLicensePlate = (plate: string): string => {
        // Menghapus semua spasi dari string
        return plate.replace(/\s/g, '');
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedKeyword = keyword.trim();

        if (!trimmedKeyword) {
            toast.error('Silakan masukkan nomor polisi');
            return;
        }

        if (!validateLicensePlate(trimmedKeyword)) {
            setPlateError('Format nomor polisi tidak valid. Contoh: B 1234 ABC atau AB 123 CD');
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

        // Normalisasi plat nomor sebelum dikirim
        const normalizedPlate = normalizeLicensePlate(trimmedKeyword);
        onSubmit(normalizedPlate, locationCode, date);
    };

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Biarkan spasi untuk kemudahan input pengguna
        const value = e.target.value.toUpperCase();
        setKeyword(value);

        // Validasi real-time (gunakan versi tanpa spasi untuk validasi)
        if (value && !validateLicensePlate(value.replace(/\s/g, ''))) {
            setPlateError('Format nomor polisi tidak valid. Contoh: B 1234 ABC atau AB 123 CD');
        } else {
            setPlateError('');
        }
    };

    const handleClose = () => {
        setKeyword('');
        setLocationCode('');
        setDate('');
        setPlateError('');
        onClose();
    };

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
                            onChange={handleKeywordChange}
                            placeholder="Contoh: B 1234 ABC"
                            className={`w-full px-3 py-2 border ${plateError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                        />
                        {plateError && (
                            <div className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                                <svg className="w-4 h-4 mt-0.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{plateError}</span>
                            </div>
                        )}
                        {!plateError && keyword && (
                            <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                                Format nomor polisi valid
                            </div>
                        )}
                    </div>

                    {/* Location Select */}
                    <div>
                        {/* <label htmlFor="locationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Lokasi
                        </label> */}
                        <SearchableSelect
                            options={locations.map(loc => ({ value: loc.Code, label: loc.Name }))}
                            value={locationCode}
                            onChange={setLocationCode}
                            placeholder="-- Pilih Lokasi --"
                            label="Lokasi"
                            disabled={loadingLocations}
                        />
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
                            disabled={loading || !!plateError}
                            className={`cursor-pointer flex-1 px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading || plateError
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Mencari...' : 'Cek Tiket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}