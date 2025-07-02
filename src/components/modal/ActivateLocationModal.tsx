import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { fetchLocation, updateLocation } from "@/hooks/useLocation";
import SearchableSelect from "@/components/input/SearchableSelect";

interface Location {
  id: number;
  Name: string;
  Address?: string;
  IsActive?: boolean;
}

interface ActivateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ActivateLocationModal: React.FC<ActivateLocationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setLocations([]);
      setCurrentLimit(5);
      setHasMoreData(true);
      setTotalItems(0);
      fetchAllLocations(5, true);
    }
  }, [isOpen]);

  

  const fetchAllLocations = async (
    limit: number,
    isInitial: boolean = false
  ) => {
    try {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const locationData = await fetchLocation(1, limit);

      if (locationData && locationData.data) {
        if (isInitial) {
          setLocations(locationData.data);
        } else {
          // Only add new items that aren't already in the list
          setLocations((prev) => {
            const existingIds = new Set(prev.map((loc) => loc.id));
            const newItems = locationData.data.filter(
              (loc) => !existingIds.has(loc.id)
            );
            return [...prev, ...newItems];
          });
        }

        // Update total items and check if there's more data
        const total = locationData.meta?.totalItems || locationData.data.length;
        setTotalItems(total);

        // Check if there's more data available
        // hasMoreData is true if current data length equals the limit and we haven't reached total
        setHasMoreData(
          locationData.data.length === limit && locationData.data.length < total
        );
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Gagal memuat data lokasi");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreData && locations.length < totalItems) {
      const newLimit = currentLimit + 5;
      setCurrentLimit(newLimit);
      fetchAllLocations(newLimit, false);
    }
  };

  const handleActivateLocation = async () => {
    if (!selectedLocationId) {
      toast.error("Pilih lokasi terlebih dahulu");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateLocation({ id: selectedLocationId });
      toast.success("Lokasi berhasil diaktifkan!");

      setSelectedLocationId(null);
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error activating location:", error);
      toast.error("Gagal mengaktifkan lokasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedLocationId(null);
      setLocations([]);
      setCurrentLimit(5);
      setHasMoreData(true);
      setTotalItems(0);
      onClose();
    }
  };

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
            className="cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4">
            <label
              htmlFor="location-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Pilih Lokasi
            </label>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Memuat data lokasi...
                </span>
              </div>
            ) : (
              <SearchableSelect
                options={locations.map((loc) => ({
                  value: String(loc.id),
                  label: loc.Name,
                }))}
                value={selectedLocationId ? String(selectedLocationId) : ""}
                onChange={(val) => setSelectedLocationId(Number(val))}
                placeholder="-- Pilih Lokasi --"
                disabled={isSubmitting}
                onLoadMore={handleLoadMore}
                hasMoreData={hasMoreData}
                isLoadingMore={isLoadingMore}
                showLoadMoreInfo={true}
                loadMoreText={`Memuat lebih banyak... (${locations.length}${
                  totalItems > 0 ? `/${totalItems}` : ""
                })`}
              />
            )}
          </div>

          {selectedLocationId && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Lokasi yang dipilih akan diaktifkan dan dapat digunakan dalam
                sistem.
              </p>
            </div>
          )}

          {/* Info tentang data yang dimuat */}
          {locations.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Menampilkan {locations.length}
              {totalItems > 0 && ` dari ${totalItems}`} lokasi
              {hasMoreData && " (scroll untuk memuat lebih banyak)"}
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
              "Aktifkan Lokasi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateLocationModal;
