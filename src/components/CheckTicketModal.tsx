/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { fetchLocation } from '@/hooks/useLocation';
import { fetchTransaction } from '@/hooks/useTransaction';
import { validateLicensePlate } from '@/utils/validationNumberPlat';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SearchableSelect from './SearchableSelect';
import formatTanggalUTC from '@/utils/formatDate';
import { formatDuration } from '@/utils/formatDuration';
import { formatCurrency } from '@/utils/formatCurrency';
import { getStatusColor } from '@/utils/statusColorBedge';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Location {
    Code: string;
    Name: string;
}

interface TransactionResponse {
    // Sesuaikan dengan struktur data tiket kamu
    TransactionNo: string;
    [key: string]: any;
}

interface CheckTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckTicketModal({ isOpen, onClose }: CheckTicketModalProps) {
    const getToday = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [keyword, setKeyword] = useState('');
    const [locationCode, setLocationCode] = useState('');
    const [date, setDate] = useState(getToday());
    const [dateObj, setDateObj] = useState<Date | null>(new Date());
    const [locations, setLocations] = useState<Location[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [plateError, setPlateError] = useState('');
    const [loading, setLoading] = useState(false);

    // State untuk hasil pencarian tiket
    const [ticketData, setTicketData] = useState<TransactionResponse | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setKeyword('');
            setLocationCode('');
            setDate(getToday());
            setDateObj(new Date());
            setPlateError('');
            setTicketData(null);
            setNotFound(false);
            fetchAllLocations();
        }
    }, [isOpen]);

    // Sinkronisasi date string dan dateObj
    useEffect(() => {
        if (dateObj) {
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            setDate(`${yyyy}-${mm}-${dd}`);
        }
    }, [dateObj]);

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
        return plate.replace(/\s/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        setLoading(true);
        setTicketData(null);
        setNotFound(false);

        try {
            const normalizedPlate = normalizeLicensePlate(trimmedKeyword);
            const data = await fetchTransaction(normalizedPlate, locationCode, date);

            if (
                !data ||
                !data.data ||
                (Array.isArray(data.data) && data.data.length === 0) ||
                (data.data && typeof data.data === 'object' && Object.keys(data.data).length === 0)
            ) {
                setNotFound(true);
                setTicketData(null);
                return;
            }

            setTicketData(data.data);
            setNotFound(false);
        } catch (error) {
            console.error('Error fetching transaction:', error);
            toast.error('Data tidak ditemukan');
            setNotFound(true);
            setTicketData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setKeyword(value);

        if (value && !validateLicensePlate(value.replace(/\s/g, ''))) {
            setPlateError('Format nomor polisi tidak valid. Contoh: B 1234 ABC atau AB 123 CD atau RI 1');
        } else {
            setPlateError('');
        }
    };

    const handleClose = () => {
        setKeyword('');
        setLocationCode('');
        setDate(getToday());
        setDateObj(new Date());
        setPlateError('');
        setTicketData(null);
        setNotFound(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-5xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
                style={{ minHeight: 0, height: 'auto', maxHeight: '80vh' }} // Modal lebih pendek
            >
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

                {/* Form input nopol, lokasi, tanggal dibuat horizontal */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Nomor Polisi */}
                        <div className="flex-1">
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nomor Polisi
                            </label>
                            <div className="h-[44px]">
                                <input
                                    type="text"
                                    id="keyword"
                                    value={keyword}
                                    onChange={handleKeywordChange}
                                    placeholder="Contoh: B 1234 ABC"
                                    className={`w-full h-full px-3 py-2 border ${plateError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100`}
                                />
                            </div>
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

                        {/* Lokasi */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Lokasi
                            </label>
                            <div className="h-[44px]">
                                <SearchableSelect
                                    options={locations.map(loc => ({ value: loc.Code, label: loc.Name }))}
                                    value={locationCode}
                                    onChange={setLocationCode}
                                    placeholder="-- Pilih Lokasi --"
                                    disabled={loadingLocations}
                                    className="h-full"
                                />
                            </div>
                        </div>

                        {/* Tanggal */}
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tanggal
                            </label>
                            <div className="h-[44px] relative">
                                <DatePicker
                                    selected={dateObj}
                                    onChange={(date: Date | null) => setDateObj(date)}
                                    dateFormat="dd MMM yyyy"
                                    className="w-full h-[44px] px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 leading-none"
                                    placeholderText="Pilih tanggal"
                                    maxDate={new Date()}
                                    id="date"
                                    showPopperArrow={true}
                                    autoComplete="off"
                                    wrapperClassName="block w-full h-[44px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tombol */}
                    <div className="flex flex-row gap-4 pt-2 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            style={{ minWidth: 120 }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !!plateError}
                            className={`px-6 py-2 rounded-md text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${loading || plateError
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            style={{ minWidth: 120 }}
                        >
                            {loading ? 'Mencari...' : 'Cek Tiket'}
                        </button>
                    </div>
                </form>

                {/* Hasil Pencarian */}
                <div className="mt-6 overflow-y-auto" style={{ maxHeight: '45vh' }}>
                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">Memuat data tiket...</div>
                    ) : notFound ? (
                        <div className="text-center text-red-500 dark:text-red-400 font-semibold py-8">
                            Data tiket tidak ditemukan.
                        </div>
                    ) : ticketData ? (
                        <div className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                {/* Transaksi */}
                                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-md p-3 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Transaksi
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Nomor Transaksi</div>
                                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1">{ticketData?.TransactionNo}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Status Pembayaran</div>
                                        <div className="mt-1">
                                            {ticketData.PaymentStatus ? (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticketData.PaymentStatus)}`}>
                                                    {ticketData.PaymentStatus}
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                                    tidak ada data
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Tarif</div>
                                        <div className="text-base font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                            {formatCurrency(Number(ticketData?.TariffAmount))}
                                        </div>
                                    </div>
                                    {ticketData.PaymentStatus === 'PAID' && (
                                        <>
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Metode Pembayaran</div>
                                                <div className="text-sm font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded">{ticketData.paymentMethod}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Issuer Name</div>
                                                <div className="text-sm font-mono bg-white dark:bg-gray-800 py-1 rounded">{ticketData.issuerInfo || '-'}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {/* Kendaraan */}
                                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-md p-3 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Kendaraan
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Jenis Kendaraan</div>
                                        <div className="text-sm font-semibold">{ticketData.VehicleType}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Plat Masuk</div>
                                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1">{ticketData.LicensePlateIn}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Plat Keluar</div>
                                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1">{ticketData.LicensePlateOut}</div>
                                    </div>
                                </div>
                                {/* Lokasi */}
                                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-md p-3 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Lokasi
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Nama Lokasi</div>
                                        <div className="text-sm font-semibold">{ticketData.locationInfo?.Name || '-'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Gate Masuk</div>
                                            <div className="text-sm bg-white dark:bg-gray-800 rounded px-2 py-1">{ticketData.GateInCode}</div>
                                        </div>
                                        {ticketData.GateOutCode && (
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Gate Keluar</div>
                                                <div className="text-sm bg-white dark:bg-gray-800 rounded px-2 py-1">{ticketData.GateOutCode}</div>
                                            </div>
                                        )}
                                    </div>
                                    {ticketData?.gracePeriod && (
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Grace Period</div>
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {ticketData?.gracePeriod ? `${ticketData.gracePeriod} menit` : 'Tidak ada'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Waktu */}
                                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-md p-3 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Waktu
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600 dark:text-gray-400">Waktu Masuk</div>
                                        <div className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                            {formatTanggalUTC(ticketData.InTime)}
                                        </div>
                                    </div>
                                    {ticketData.OutTime && (
                                        <div className="space-y-1">
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Waktu Keluar</div>
                                            <div className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                {formatTanggalUTC(ticketData.OutTime)}
                                            </div>
                                        </div>
                                    )}
                                    {ticketData.Duration != null && typeof ticketData.Duration === 'number' ? (
                                        ticketData.Duration > 0 ? (
                                            <div className="space-y-1">
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Durasi Parkir</div>
                                                <div className="text-lg text-orange-700 dark:text-orange-300 font-bold text-center bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    {formatDuration(ticketData.Duration)}
                                                </div>
                                            </div>
                                        ) : null
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}