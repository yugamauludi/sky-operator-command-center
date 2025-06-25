/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect } from 'react';

export interface TicketData {
    transactionNo: string;
    transactionStatus: string;
    inTime: string;
    duration: string;
    tariffParking: number;
    vehicleType: string;
    codeGate: string;
    plateNumber: string;
    outTime: string;
    gateOut: string;
    gracePeriod: string;
    location: string;
    paymentStatus: string;
    paymentTime: string;
    paymentMethod: string;
    issueName: string;
    issuerCode: string;
}

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketData: TicketData | null;
    error?: string | null;
}

export default function TicketModal({ isOpen, onClose, ticketData }: TicketModalProps) {
    // Close modal when pressing Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'PAID':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Tiket Parkir
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Informasi lengkap transaksi parkir
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                {ticketData ? (
                    <div className="p-6 space-y-6">
                        {/* Transaction Info */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Informasi Transaksi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nomor Transaksi
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white font-mono">
                                        {ticketData.transactionNo}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status Transaksi
                                    </label>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticketData.transactionStatus)}`}>
                                        {ticketData.transactionStatus}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nomor Polisi
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white font-semibold">
                                        {ticketData.plateNumber}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Jenis Kendaraan
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.vehicleType}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Parking Details */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Detail Parkir
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Lokasi
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.location}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Gate Masuk
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.codeGate}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Gate Keluar
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.gateOut}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Grace Period
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.gracePeriod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Time & Duration */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Waktu & Durasi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Waktu Masuk
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDateTime(ticketData.inTime)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Waktu Keluar
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDateTime(ticketData.outTime)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Durasi Parkir
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white font-semibold">
                                        {ticketData.duration}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Tarif Parkir
                                    </label>
                                    <p className="text-lg text-green-600 dark:text-green-400 font-bold">
                                        {formatCurrency(ticketData.tariffParking)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Informasi Pembayaran
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Status Pembayaran
                                    </label>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticketData.paymentStatus)}`}>
                                        {ticketData.paymentStatus}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Metode Pembayaran
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.paymentMethod}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Waktu Pembayaran
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {formatDateTime(ticketData.paymentTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Issuer Info */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Penerbit Tiket
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nama Penerbit
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {ticketData.issueName}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Kode Penerbit
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white font-mono">
                                        {ticketData.issuerCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            Data tiket tidak ditemukan
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Tutup
                    </button>
                    {ticketData && (
                        <button
                            onClick={() => window.print()}
                            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Print Tiket
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}