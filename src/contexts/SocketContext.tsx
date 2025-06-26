"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSocket } from "@/hooks/useSocket";
import { GateStatusUpdate } from "@/types/gate";
import { toast } from "react-toastify";
import { changeStatusGate, endCall } from "@/hooks/useIOT";
import Image from "next/image";
import { Category, fetchCategories } from "@/hooks/useCategories";
import { Description, fetchDescriptionByCategoryId } from "@/hooks/useDescriptions";
import { addIssue } from "@/hooks/useIssues";
import { formatTanggalLocal } from "@/utils/formatDate";

interface SocketContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  connectionStatus: string;
  activeCall: GateStatusUpdate | null;
  userNumber: number | null;
  setUserNumber: (num: number) => void;
  endCallFunction: () => void;
}

const SocketContext = createContext<SocketContextType & {
  muteRingtone?: () => void;
  unmuteRingtone?: () => void;

}>({
  socket: null,
  connectionStatus: "Disconnected",
  activeCall: null,
  userNumber: null,
  setUserNumber: () => { },
  endCallFunction: () => { },
  muteRingtone: undefined,
  unmuteRingtone: undefined,
});

export const useGlobalSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [activeCall, setActiveCall] = useState<GateStatusUpdate | null>(null);
  const [userNumber, setUserNumberState] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [, setCallInTime] = useState<Date | null>(null);

  // Load user number from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserNumber = localStorage.getItem("admin_user_number");
      if (savedUserNumber) {
        setUserNumberState(parseInt(savedUserNumber));
      }
      setAudio(new Audio("/sound/sound-effect-old-phone-191761.mp3"));
    }
  }, []);

  const setUserNumber = (num: number) => {
    setUserNumberState(num);
    localStorage.setItem("admin_user_number", num.toString());
    
    if (socket) {
      socket.emit("register", num);
    }
  };

  const muteRingtone = () => {
    if (audio) {
      audio.volume = 0;
      audio.muted = true;
    }
  };
  const unmuteRingtone = () => {
    if (audio) {
      audio.volume = 1;
      audio.muted = false;
    }
  };

  const endCallFunction = async () => {
    if (!socket || !activeCall) return;

    // Stop the ringtone immediately when ending call
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset audio to beginning
    }

    try {
      const response = await endCall(socket.id);
      toast.success(response.message);
      setActiveCall(null);
      setCallInTime(null);
    } catch (err) {
      console.error("Error ending call:", err);
      toast.error("Failed to end call");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setConnectionStatus("Connected");
      // Auto-register if user number exists
      // console.log(userNumber, "<<<< userNumber in socket provider");
      
      if (userNumber) {
        socket.emit("register", userNumber);
      }
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setActiveCall(null);
      setCallInTime(null);
      // Stop audio when disconnected
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    socket.on("gate-status-update", (data: GateStatusUpdate) => {
      console.log("📡 Gate Update:", data);
      setActiveCall(data);
      setCallInTime(new Date()); // Set call in time when call comes in

      // Play notification
      if (audio) {
        audio.currentTime = 0; // Reset to beginning
        audio.play().catch(console.error);
      }
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("gate-status-update");
    };
  }, [socket, userNumber, audio]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectionStatus,
        activeCall,
        userNumber,
        setUserNumber,
        endCallFunction,
        muteRingtone,
        unmuteRingtone
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

interface DataIssue {
  idCategory?: number;
  idGate?: number;
  description?: string;
  action?: string;
  foto?: string;
  number_plate?: string;
  TrxNo?: string;
}

// Updated GlobalCallPopup Component with base64 image support
export function GlobalCallPopup() {
  const { activeCall, endCallFunction, muteRingtone, unmuteRingtone } = useGlobalSocket();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [description, setDescription] = useState<Description[]>([]);
  const [isOpeningGate, setIsOpeningGate] = useState(false);
  const [isCreateIssue, setIsCreateIssue] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [callInTime] = useState<Date>(new Date());
  const [dataIssue, setDataIssue] = useState<DataIssue>({});
  const [imageErrors, setImageErrors] = useState({
    photoIn: false,
    photoOut: false,
    photoCapture: false,
  });
  const tryDate = "Thu Jun 26 2025 13:35:25 GMT+0700"
  // console.log(formatTanggalLocal(tryDate), "<<<< tryDate local");


  // console.log(callInTime, "callInTime in GlobalCallPopup");

  // Add mute state
  const [isMuted, setIsMuted] = useState(false);

  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingDescriptions, setIsLoadingDescriptions] = useState(false);

  // Check if gate is PM type
  const isPMGate = activeCall?.gate?.toUpperCase().includes("PM") || false;

  // Function to handle ringtone mute/unmute
  const handleMuteRingtone = () => {
    if (isMuted) {
      unmuteRingtone?.();
    } else {
      muteRingtone?.();
    }
    setIsMuted(!isMuted);
  };

  // Function to handle modal close and stop audio
  const handleCloseModal = () => {
    // Stop any playing audio (you may need to adjust this based on your audio implementation)
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    // End the call
    endCallFunction();
  };

  // Reset all form inputs when modal opens/closes
  useEffect(() => {
    if (activeCall) {
      // Reset form when modal opens
      setSelectedCategory("");
      setSelectedDescription("");
      setDescription([]);
      setDataIssue({});
      setImageErrors({
        photoIn: false,
        photoOut: false,
        photoCapture: false,
      });
      // Reset mute state when new call comes in
      setIsMuted(false);
    }
  }, [activeCall]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchDataCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetchCategories(1, 1000);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Gagal memuat kategori");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (activeCall) {
      fetchDataCategories();
    }
  }, [activeCall]);

  // Fetch descriptions when category changes
  useEffect(() => {
    const fetchDescriptionsDataByCategoryId = async (categoryId: number) => {
      // console.log(categoryId, "<<<<ini id category");

      setIsLoadingDescriptions(true);
      try {
        const response = await fetchDescriptionByCategoryId(categoryId);
        // Check if response is array or single object
        if (Array.isArray(response)) {
          setDescription(response);
        } else {
          setDescription([response]);
        }
      } catch (error) {
        console.error("Error fetching description by category ID:", error);
        toast.error("Gagal memuat deskripsi untuk kategori ini");
        setDescription([]); // Clear descriptions on error
      } finally {
        setIsLoadingDescriptions(false);
      }
    };

    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      if (!isNaN(categoryId)) {
        fetchDescriptionsDataByCategoryId(categoryId);
        // Reset selected description when category changes
        setSelectedDescription("");
      }
    } else {
      // Clear descriptions when no category is selected
      setDescription([]);
      setSelectedDescription("");
    }
  }, [selectedCategory]);

  const handleCreateIssue = async () => {
    if (!activeCall || !selectedCategory || !selectedDescription) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsCreateIssue(true);

    try {
      const issueData = {
        idCategory: parseInt(selectedCategory),
        idGate: parseInt(activeCall.gateId),
        description: selectedDescription,
        action: "CREATE_ISSUE",
        // foto: activeCall.photoIn || "-",
        number_plate: dataIssue.number_plate?.toUpperCase() || "DUM 111 YYY",
        TrxNo: dataIssue.TrxNo || "123DUMYYY345",
      };
      const response = await addIssue(issueData);

      if (response && response.message.includes("created")) {
        toast.success("Issue berhasil dibuat");
        setDataIssue({
          idCategory: 0,
          idGate: 0,
          description: "",
          action: "",
          foto: "",
          number_plate: "",
          TrxNo: "",
        });
      } else {
        toast.error("Gagal membuat issue report");
      }
    } catch (error) {
      console.error("Error create issue:", error);
      toast.error("Terjadi kesalahan saat membuat issue report");
    } finally {
      setIsCreateIssue(false);
    }
  };

  const handleOpenGate = async () => {
    if (!activeCall || !selectedCategory) return;

    setIsOpeningGate(true);
    try {
      const response = await changeStatusGate(activeCall.gateId, "OPEN");

      if (response.message === "Gate opened") {
        toast.success("Gate berhasil dibuka");
        endCallFunction();
      } else {
        toast.error("Gagal membuka gate");
      }
    } catch (error) {
      console.error("Error opening gate:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsOpeningGate(false);
    }
  };

  // const formatDateTime = (date: Date) => {
  //   return date.toLocaleString("id-ID", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  // };

  // Check if all required fields are filled for Open Gate button
  const isOpenGateDisabled = !selectedCategory ||
    !selectedDescription ||
    isOpeningGate ||
    isLoadingCategories ||
    isLoadingDescriptions;

  // Check if all required fields are filled for Submit button
  const isSubmitDisabled = !selectedCategory ||
    !selectedDescription ||
    isCreateIssue ||
    isLoadingCategories ||
    isLoadingDescriptions;

  if (!activeCall) return null;
  // const imageUrl = (path: string) => {
  //   if (!path) return '';
  //   return `/api/proxy/image?path=${encodeURIComponent(path)}`;
  // };

  // Mapping for detailGate
  const detailGate = activeCall?.detailGate || {};
  const locationName = activeCall?.location?.Name || "Unknown Location";
  const gateName = activeCall?.gate || detailGate.gate || "-";
  const gateId = activeCall?.gateId || detailGate.id || "-";
  const ticketNo = detailGate.ticket || "-";
  const numberPlate = detailGate.number_plate.toUpperCase() || "-";

  // Foto In
  const fotoInUrl = detailGate.foto_in
    ? `https://devtest09.skyparking.online/uploads/${detailGate.foto_in}`
    : "/images/Plat-Nomor-Motor-875.png";

  // Foto Capture
  const photoCaptureUrl = activeCall?.imageFile?.filename
    ? `https://devtest09.skyparking.online/uploads/${activeCall.imageFile.filename}`
    : "/images/Plat-Nomor-Motor-875.png";

  return (
    <div className="modal fixed inset-0 backdrop-blur-md flex items-center justify-center z-100 p-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header Controls - Close Button and Mute Button */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          {/* Mute Ringtone Button */}
          <button
            onClick={handleMuteRingtone}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isMuted
              ? 'bg-red-200 hover:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500 text-red-600 dark:text-red-200'
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'
              } hover:text-gray-800 dark:hover:text-white`}
            title={isMuted ? "Nyalakan suara ringtone" : "Matikan suara ringtone"}
          >
            {isMuted ? (
              // Muted icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              // Unmuted icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={handleCloseModal}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            title="Tutup modal dan hentikan audio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-4 pr-16">
          <h2 className="text-lg font-semibold text-red-600 mb-1">
            📞 Incoming Call!
          </h2>
          {/* Ringtone Status Indicator */}
          {isMuted && (
            <p className="text-xs text-red-500 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              Ringtone dimatikan
            </p>
          )}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Left Column - Information */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold border-b pb-1">
              Information
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Location Name</span>
                <span>:</span>
                <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                  {locationName || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Gate</span>
                <span>:</span>
                <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                  {gateName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Gate ID</span>
                <span>:</span>
                <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                  {gateId}
                </span>
              </div>
              {!isPMGate && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">No Transaction</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {ticketNo || "-"}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="font-medium">No Plat Number</span>
                <span>:</span>
                <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                  {numberPlate || "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">In Time</span>
                <span>:</span>
                <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                  {callInTime
                    ? formatTanggalLocal(callInTime.toString()) : "-"}
                </span>
              </div>

              {!isPMGate && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Out Time</span>
                    <span>:</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Payment Status</span>
                    <span>:</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                      {detailGate.payment_status === "PAID" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  {detailGate.payment_status === "PAID" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Payment Time</span>
                        <span>:</span>
                        <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                          {detailGate.payment_time
                            ? formatTanggalLocal(detailGate.payment_time)
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Payment Method</span>
                        <span>:</span>
                        <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                          {detailGate.payment_method || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Issuer Name</span>
                        <span>:</span>
                        <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                          {detailGate.issuer_name || "-"}
                        </span>
                      </div>
                    </>
                  )}
                  {/* <div className="flex justify-between items-center">
                    <span className="font-medium">Tariff</span>
                    <span>:</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                      -
                    </span>
                  </div> */}
                </>
              )}
            </div>
          </div>

          {/* Right Column - Input Issue */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold border-b pb-1">
              Input Issue
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Object <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={isLoadingCategories}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCategories ? (
                    <option value="">⏳ Memuat kategori...</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Kategori --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {isLoadingCategories && (
                  <div className="flex items-center mt-1 text-xs text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Memuat data kategori...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDescription}
                  onChange={(e) => setSelectedDescription(e.target.value)}
                  disabled={isLoadingDescriptions || !selectedCategory}
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingDescriptions ? (
                    <option value="">⏳ Memuat deskripsi...</option>
                  ) : !selectedCategory ? (
                    <option value="">-- Pilih kategori terlebih dahulu --</option>
                  ) : description.length === 0 ? (
                    <option value="">-- Tidak ada deskripsi tersedia --</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Deskripsi --</option>
                      {description.map((desc) => (
                        <option key={desc.id} value={desc.id}>
                          {desc.object}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {isLoadingDescriptions && (
                  <div className="flex items-center mt-1 text-xs text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Memuat data deskripsi...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Action
                </label>
                <input
                  type="text"
                  value={dataIssue.action || ""}
                  onChange={(e) =>
                    setDataIssue((prev) => ({
                      ...prev,
                      action: e.target.value,
                    }))
                  }
                  placeholder="Enter action"
                  className="w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
                />
              </div>

              {/* Action Buttons - Updated with proper disable logic */}
              <div className="flex flex-col space-y-2 pt-2">
                <button
                  onClick={handleOpenGate}
                  disabled={isOpenGateDisabled}
                  className="w-full px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                  title={isOpenGateDisabled ? "Pilih kategori dan deskripsi terlebih dahulu" : ""}
                >
                  {isOpeningGate ? "Opening..." : "Open Gate"}
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={endCallFunction}
                    className="flex-1 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    End Call
                  </button>
                  <button
                    onClick={() => {
                      handleCreateIssue();
                      endCallFunction();
                    }}
                    disabled={isSubmitDisabled}
                    className="flex-1 px-4 py-2 text-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                    title={isSubmitDisabled ? "Pilih kategori dan deskripsi terlebih dahulu" : ""}
                  >
                    {isCreateIssue ? "Creating..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Photos - Enhanced with base64 support */}
        <div className="border-t pt-4">
          {isPMGate ? (
            // For PM gates - only show capture photo with larger size
            <div className="flex justify-center">
              <div className="text-center w-full max-w-md">
                <p className="text-sm font-medium mb-2">Foto Capture</p>
                <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                  {!imageErrors.photoCapture ? (
                    <Image
                      src={photoCaptureUrl}
                      alt="Foto Capture"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover rounded-lg"
                      onError={() => {
                        setImageErrors((prev) => ({
                          ...prev,
                          photoCapture: true,
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Foto Capture</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // For non-PM gates - show photos in a better grid layout
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Foto In */}
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Foto In</p>
                  <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                    {!imageErrors.photoIn ? (
                      <Image
                        src={fotoInUrl}
                        alt="Foto In"
                        width={400}
                        height={225}
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => {
                          setImageErrors((prev) => ({
                            ...prev,
                            photoIn: true,
                          }));
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Foto In</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Foto Capture - Now using base64 image */}
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">
                    Foto Capture
                    {activeCall?.imageFile?.filename && (
                      <span className="text-xs text-green-600 ml-1">(Live)</span>
                    )}
                  </p>
                  <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                    {!imageErrors.photoCapture ? (
                      <Image
                        src={photoCaptureUrl}
                        alt="Foto Capture"
                        width={400}
                        height={225}
                        className="w-full h-full object-cover rounded-lg"
                        onError={() => {
                          setImageErrors((prev) => ({
                            ...prev,
                            photoCapture: true,
                          }));
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Foto Capture</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export function UserNumberSetup() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { userNumber, setUserNumber } = useGlobalSocket();
//   const [inputValue, setInputValue] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     setShowModal(userNumber === null);
//   }, [userNumber]);

//   const handleSubmit = () => {
//     const num = parseInt(inputValue);
//     if (![1, 2, 3].includes(num)) {
//       alert("User number harus 1, 2, atau 3");
//       return;
//     }
//     setUserNumber(num);
//     setShowModal(false);
//   };

//   const checkLoginStatus = () => {
//     const token = localStorage.getItem("id");
//     setIsLoggedIn(!!token);
//   };

//   useEffect(() => {
//     checkLoginStatus();

//     const handleLoginSuccess = () => {
//       checkLoginStatus();
//     };

//     window.addEventListener("loginSuccess", handleLoginSuccess);

//     return () => {
//       window.removeEventListener("loginSuccess", handleLoginSuccess);
//     };
//   }, []);

//   if (!isLoggedIn) {
//     return null;
//   }

//   if (showModal) {
//     return (
//       <div className="fixed inset-0 backdrop-blur-md bg-opacity-200 flex items-center justify-center z-50">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
//           <h2 className="text-xl font-semibold mb-4">Setup Agent Number</h2>
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">
//               User Number (1-3):
//             </label>
//             <input
//               type="number"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="Enter number between 1-3"
//               className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//               min="1"
//               max="3"
//             />
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={handleSubmit}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
//             >
//               Simpan
//             </button>
//             {userNumber !== null && (
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
//               >
//                 Batal
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }