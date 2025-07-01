/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { TransactionResponse } from '@/hooks/useTransaction';
import formatTanggalUTC from '@/utils/formatDate';
import { useEffect } from 'react';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketData: TransactionResponse | null;
    error?: string | null;
}

export default function TicketModal({ isOpen, onClose, ticketData }: TicketModalProps) {
    const dataTicket = ticketData?.data || null;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'FREE':
            case 'COMPLETED':
                return 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-200';
            case 'PENDING':
                return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-200';
            case 'PAID':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-200';
        }
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} menit`;
        const jam = Math.floor(minutes / 60);
        const menit = minutes % 60;
        if (menit === 0) return `${jam} jam`;
        return `${jam} jam ${menit} menit`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/50"
                onClick={onClose}
            />

            {/* Modal - Less colorfull, more neutral */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Detail Tiket Parkir
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Informasi lengkap transaksi parkir
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {dataTicket ? (
                        <div className="p-4">
                            {/* Main Grid - 3 columns layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">

                                {/* Left Column - Transaction & Vehicle Info */}
                                <div className="space-y-4">
                                    {/* Transaction Info */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Transaksi
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Nomor Transaksi
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 py-1 rounded mt-1">
                                                    {dataTicket?.TransactionNo}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Status
                                                </label>
                                                <div className="mt-1">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dataTicket.PaymentStatus)}`}>
                                                        {dataTicket.PaymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Issuer Info */}
                                            {dataTicket.PaymentStatus === 'PAID' && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                        Issuer Name
                                                    </label>
                                                    <p className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 py-1 rounded mt-1">
                                                        {dataTicket.issuerInfo || '-'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Kendaraan
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Jenis Kendaraan
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white font-semibold">
                                                    {dataTicket.VehicleType}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Plat Masuk
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 py-1 rounded">
                                                    {dataTicket.LicensePlateIn}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Plat Keluar
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white font-mono bg-white dark:bg-gray-800 py-1 rounded">
                                                    {dataTicket.LicensePlateOut}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Column - Location & Time */}
                                <div className="space-y-4">
                                    {/* Location Info */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Lokasi
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Nama Lokasi
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white font-semibold">
                                                    {dataTicket.locationInfo?.Name || '-'}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                        Gate Masuk
                                                    </label>
                                                    <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 py-1 rounded">
                                                        {dataTicket.GateInCode}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                        Gate Keluar
                                                    </label>
                                                    <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 py-1 rounded">
                                                        {dataTicket.GateOutCode}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Grace Period
                                                </label>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {dataTicket?.gracePeriod ? `${dataTicket.gracePeriod} menit` : 'Tidak ada'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Info */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Waktu
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Waktu Masuk
                                                </label>
                                                <p className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    {formatTanggalUTC(dataTicket.InTime)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Waktu Keluar
                                                </label>
                                                <p className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    {formatTanggalUTC(dataTicket.OutTime)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Durasi Parkir
                                                </label>
                                                <p className="text-lg text-gray-700 dark:text-gray-200 font-bold text-center bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    {formatDuration(dataTicket.Duration)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Payment Info */}
                                <div className="space-y-4">
                                    {/* Payment Amount */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Tarif
                                        </h3>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg">
                                                {formatCurrency(Number(dataTicket?.TariffAmount))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Pembayaran
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    Status Pembayaran
                                                </label>
                                                <div className="mt-1">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dataTicket.PaymentStatus)}`}>
                                                        {dataTicket.PaymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            {dataTicket.PaymentStatus === 'PAID' && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                        Metode Pembayaran
                                                    </label>
                                                    <p className="text-sm text-gray-900 dark:text-white font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                        {dataTicket.paymentMethod}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                    Data tiket tidak ditemukan
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-white bg-red-500 rounded-lg transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}