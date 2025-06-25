import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Import hooks yang diperlukan
import { fetchLocation, updateLocation } from '@/hooks/useLocation';

interface Location {
    id: number;
    Name: string;
    Address?: string;
    IsActive?: boolean;
}

interface ActivateLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback ketika berhasil mengaktifkan location
}

const ActivateLocationModal: React.FC<ActivateLocationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch all locations ketika modal dibuka
    useEffect(() => {
        if (isOpen) {
            fetchAllLocations();
        }
    }, [isOpen]);

    const fetchAllLocations = async () => {
        try {
            setIsLoading(true);
            const locationData = await fetchLocation(1, 1000);

            if (locationData && locationData.data) {
                setLocations(locationData.data);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            toast.error('Gagal memuat data lokasi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateLocation = async () => {
        if (!selectedLocationId) {
            toast.error('Pilih lokasi terlebih dahulu');
            return;
        }

        try {
            setIsSubmitting(true);
            await updateLocation({ id: selectedLocationId });
            toast.success('Lokasi berhasil diaktifkan!');

            // Reset form
            setSelectedLocationId(null);
            onClose();

            // Call success callback jika ada
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error activating location:', error);
            toast.error('Gagal mengaktifkan lokasi');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setSelectedLocationId(null);
            setIsDropdownOpen(false);
            onClose();
        }
    };

    const handleSelectLocation = (locationId: number) => {
        setSelectedLocationId(locationId);
        setIsDropdownOpen(false);
    };

    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Aktifkan Lokasi
                    </h3>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih Lokasi
                        </label>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Memuat data lokasi...</span>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Custom Select Button */}
                                <button
                                    type="button"
                                    onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white flex items-center justify-between"
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
                                            className="py-1 max-h-20 overflow-y-auto"
                                            style={{ maxHeight: '200px' }}
                                        >
                                            {locations.length === 0 ? (
                                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Tidak ada lokasi tersedia
                                                </div>
                                            ) : (
                                                locations.map((location) => (
                                                    <button
                                                        key={location.id}
                                                        type="button"
                                                        onClick={() => handleSelectLocation(location.id)}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 ${selectedLocationId === location.id
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

                    {selectedLocationId && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Lokasi yang dipilih akan diaktifkan dan dapat digunakan dalam sistem.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleActivateLocation}
                        disabled={!selectedLocationId || isSubmitting || isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Mengaktifkan...
                            </>
                        ) : (
                            'Aktifkan Lokasi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivateLocationModal;