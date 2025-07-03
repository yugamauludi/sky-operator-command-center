/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';

interface ComplaintDetail {
    nomor: string;
    date: string;
    location: string;
    gate: string;
    description: string;
}

interface ComplaintModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategory: string;
    fetchComplainCategory?: (category: string) => Promise<any>; // Add your actual return type here
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
    isOpen,
    onClose,
    selectedCategory,
    fetchComplainCategory
}) => {
    const [complaintDetails, setComplaintDetails] = useState<ComplaintDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
    const [isLoading, setIsLoading] = useState(false);

    // Dummy data sebagai fallback
    const dummyComplaintData: Record<string, ComplaintDetail[]> = {
        "Informasi": [
            { nomor: "1", date: "2025-06-01", location: "Lokasi A1", gate: "Gate PM 1", description: "Kurang informasi jam operasional" },
            { nomor: "2", date: "2025-06-01", location: "Lokasi B2", gate: "Gate PM 2", description: "Papan informasi tidak jelas" },
            { nomor: "3", date: "2025-06-01", location: "Lokasi C3", gate: "Gate PK 3", description: "Tidak ada petunjuk arah yang memadai" },
            { nomor: "4", date: "2025-06-01", location: "Lokasi D1", gate: "Gate PM 4", description: "Informasi tarif tidak update" },
            { nomor: "5", date: "2025-06-01", location: "Lokasi E2", gate: "Gate PK 5", description: "Kurang sosialisasi aturan baru" },
        ],
        "Teknikal": [
            { nomor: "1", date: "2025-06-01", location: "Lokasi A2", gate: "Gate PK 1", description: "Sistem pembayaran error" },
            { nomor: "2", date: "2025-06-01", location: "Lokasi B1", gate: "Gate PM 2", description: "Palang pintu tidak berfungsi" },
            { nomor: "3", date: "2025-06-01", location: "Lokasi C2", gate: "Gate PM 3", description: "Scanner kartu rusak" },
            { nomor: "4", date: "2025-06-01", location: "Lokasi D3", gate: "Gate PK 4", description: "Lampu traffic light mati" },
            { nomor: "5", date: "2025-06-01", location: "Lokasi E1", gate: "Gate PM 5", description: "CCTV tidak berfungsi" },
        ],
        "Fasilitas": [
            { nomor: "1", date: "2025-06-01", location: "Lokasi A", gate: "Gate PK 1", description: "Toilet kotor dan bau" },
            { nomor: "2", date: "2025-06-01", location: "Lokasi B", gate: "Gate PM 2", description: "Penerangan kurang terang" },
            { nomor: "3", date: "2025-06-01", location: "Lokasi C", gate: "Gate PM 3", description: "Tempat sampah penuh" },
            { nomor: "4", date: "2025-06-01", location: "Lokasi D", gate: "Gate PK 4", description: "Jalur pejalan kaki rusak" },
            { nomor: "5", date: "2025-06-01", location: "Lokasi E", gate: "Gate PM 5", description: "Kantin tidak bersih" },
        ],
        "Layanan": [
            { nomor: "1", date: "2025-06-01", location: "Lokasi a", gate: "Gate PK 1", description: "Pelayanan petugas lambat" },
            { nomor: "2", date: "2025-06-01", location: "lokasi b", gate: "Gate PM 2", description: "Petugas keamanan tidak responsif" },
            { nomor: "3", date: "2025-06-01", location: "lokasi c", gate: "Gate PM 3", description: "Respon perbaikan terlalu lama" },
            { nomor: "4", date: "2025-06-01", location: "lokasi d", gate: "Gate PM 4", description: "Antrian terlalu panjang" },
            { nomor: "5", date: "2025-06-01", location: "lokasi w", gate: "Gate PK 5", description: "Petugas kurang ramah" },
        ],
    };

    // Function to fetch complaint data
    const fetchComplaintData = async (category: string) => {
        if (!category) return;

        setIsLoading(true);
        try {
            if (fetchComplainCategory) {
                const response = await fetchComplainCategory(category);

                // Transform API response to match ComplaintDetail interface
                // Adjust this mapping based on your actual API response structure
                const transformedData: ComplaintDetail[] = response.data?.map((item: any, index: number) => ({
                    nomor: (index + 1).toString(),
                    date: item.created_at || item.date || new Date().toISOString(),
                    location: item.location || `Lokasi ${index + 1}`,
                    gate: item.gate || `Gate ${index + 1}`,
                    description: item.description || item.complaint || 'Tidak ada deskripsi'
                })) || [];

                setComplaintDetails(transformedData);
            } else {
                // Fallback to dummy data if no fetch function provided
                setComplaintDetails(dummyComplaintData[category] || []);
            }
        } catch (error) {
            console.error('Error fetching complaint data:', error);
            // Fallback to dummy data on error
            setComplaintDetails(dummyComplaintData[category] || []);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when modal opens or category changes
    useEffect(() => {
        if (isOpen && selectedCategory) {
            setCurrentPage(1); // Reset to first page when category changes
            fetchComplaintData(selectedCategory);
        }
    }, [isOpen, selectedCategory, fetchComplainCategory]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = complaintDetails.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(complaintDetails.length / itemsPerPage);

    // Pagination handlers
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const getPaginationRange = () => {
        const range = [];
        const showPages = 3;

        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        const end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gradient-to-br dark:from-[#1a2332] dark:to-[#222b36] rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">

                {/* Enhanced Modal Header - FIXED HEIGHT */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Detail Komplain</h2>
                                <p className="text-blue-100">Kategori: {selectedCategory}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="cursor-pointer w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-sm text-blue-100">Total Komplain</div>
                            <div className="text-2xl font-bold">{complaintDetails.length}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-sm text-blue-100">Halaman</div>
                            <div className="text-2xl font-bold">{currentPage} dari {totalPages}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-sm text-blue-100">Menampilkan</div>
                            <div className="text-2xl font-bold">{currentItems.length} item</div>
                        </div>
                    </div>
                </div>

                {/* Controls Bar - FIXED HEIGHT */}
                <div className="bg-gray-50 dark:bg-[#1e2632] p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tampilan:</span>
                            <div className="flex bg-white dark:bg-[#2a3441] rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'table'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-9 8h9" />
                                    </svg>
                                    Tabel
                                </button>
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`cursor-pointer px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${viewMode === 'card'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                    </svg>
                                    Kartu
                                </button>
                            </div>
                        </div>

                        {/* Items per page selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tampilkan:</span>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2a3441] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm text-gray-600 dark:text-gray-400">per halaman</span>
                        </div>
                    </div>
                </div>

                {/* Modal Body - SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6">
                        {isLoading ? (
                            // Loading State
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Memuat data komplain...</p>
                                </div>
                            </div>
                        ) : viewMode === 'table' ? (
                            // Table View with Fixed Header
                            <div className="h-full flex flex-col">
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-[#2a3441] sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    <div className="flex items-center space-x-1">
                                                        <span>Nomor</span>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                        </svg>
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Lokasi
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Gate
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Deskripsi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-[#222b36] divide-y divide-gray-200 dark:divide-gray-700">
                                            {currentItems.map((complaint, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#2a3441] transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                    {complaint.nomor}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {new Date(complaint.date).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {complaint.location}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                            {complaint.gate}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                        <div className="max-w-xs" title={complaint.description}>
                                                            {complaint.description}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            // Card View with Scrollable Grid
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentItems.map((complaint, index) => (
                                    <div key={index} className="bg-white dark:bg-[#2a3441] rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">{complaint.nomor}</span>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                {complaint.gate}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tanggal</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(complaint.date).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lokasi</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{complaint.location}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Deskripsi</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {complaint.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No data state */}
                        {!isLoading && currentItems.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 dark:text-gray-400">Tidak ada data komplain untuk ditampilkan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Pagination Footer - ALWAYS VISIBLE & FIXED HEIGHT */}
                {!isLoading && totalPages > 0 && (
                    <div className="bg-gray-50 dark:bg-[#1e2632] px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Pagination Info */}
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(indexOfLastItem, complaintDetails.length)}</span> from{' '}
                                <span className="font-medium">{complaintDetails.length}</span> results
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-1">
                                {/* First Page Button */}
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    title="Halaman Pertama"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Page Numbers */}
                                <div className="flex space-x-1">
                                    {getPaginationRange()[0] > 1 && (
                                        <>
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#323b4a]"
                                            >
                                                1
                                            </button>
                                            {getPaginationRange()[0] > 2 && (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            )}
                                        </>
                                    )}

                                    {getPaginationRange().map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 min-w-[40px] ${currentPage === pageNumber
                                                ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300 dark:ring-blue-700'
                                                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}

                                    {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
                                        <>
                                            {getPaginationRange()[getPaginationRange().length - 1] < totalPages - 1 && (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#323b4a]"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="cursor-pointer px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="cursor-pointer px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a3441] hover:bg-gray-50 dark:hover:bg-[#323b4a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    title="Halaman Terakhir"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Direct Page Input */}
                                <div className="flex items-center space-x-2 ml-4 border-l border-gray-300 dark:border-gray-600 pl-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Ke:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            if (page >= 1 && page <= totalPages) {
                                                handlePageChange(page);
                                            }
                                        }}
                                        className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-center bg-white dark:bg-[#2a3441] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">dari {totalPages}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-white dark:bg-[#222b36] px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex space-x-3">
                        <button className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Data
                        </button>
                        <button className="cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="cursor-pointer px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    )
}