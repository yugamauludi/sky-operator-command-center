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
import { endCall, pingArduino } from "@/hooks/useIOT";
import Image from "next/image";
import { Category, fetchCategories } from "@/hooks/useCategories";
import { Description, fetchDescriptions } from "@/hooks/useDescriptions";
import { openGate } from "@/hooks/useLocation";

interface SocketContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
  connectionStatus: string;
  activeCall: GateStatusUpdate | null;
  userNumber: number | null;
  setUserNumber: (num: number) => void;
  endCallFunction: () => void;
}

// interface Category {
//   id: string;
//   category: string;
// }


const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectionStatus: "Disconnected",
  activeCall: null,
  userNumber: null,
  setUserNumber: () => {},
  endCallFunction: () => {},
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

  const endCallFunction = async () => {
    if (!socket || !activeCall) return;
    try {
      const response = await endCall(socket.id)
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
      if (userNumber) {
        socket.emit("register", userNumber);
      }
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setActiveCall(null);
      setCallInTime(null);
    });

    socket.on("gate-status-update", (data: GateStatusUpdate) => {
      console.log("📡 Gate Update:", data);
      setActiveCall(data);
      setCallInTime(new Date()); // Set call in time when call comes in

      // Play notification
      audio?.play();
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// Global Call Popup Component
export function GlobalCallPopup() {
  const { activeCall, endCallFunction } = useGlobalSocket();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [description, setDescription] = useState<Description[]>([]);
  const [isOpeningGate, setIsOpeningGate] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [callInTime] = useState<Date>(new Date());

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        const response = await fetchCategories(1, 1000)
        setCategories(response.data);
        
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchDataDescription = async () => {
      try {
        const response = await fetchDescriptions(1, 1000)
        setDescription(response.data);

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (activeCall) {
      fetchDataCategories();
      fetchDataDescription();
    }
  }, [activeCall]);

  const handleOpenGate = async () => {
    if (!activeCall || !selectedCategory) return;

    setIsOpeningGate(true);
    try {
      await pingArduino(parseInt(activeCall.gateId))
      const response = await openGate(activeCall.gateId,);

      if (response.ok) {
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

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!activeCall) return null;

  // Get photo URLs or use dummy images
  const photoInUrl = activeCall?.photoIn || "/images/Plat-Nomor-Motor-875.png";
  const photoOutUrl = activeCall?.photoOut || "/images/Plat-Nomor-Motor-875.png";
  const locationName = activeCall?.location?.Name || "Unknown Location";

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            📞 Incoming Call!
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Location:</p>
              <p className="text-gray-600 dark:text-gray-400">{locationName}</p>
            </div>
            <div>
              <p className="font-medium">Gate ID:</p>
              <p className="text-gray-600 dark:text-gray-400">{activeCall.gateId}</p>
            </div>
            <div>
              <p className="font-medium">Call In Time:</p>
              <p className="text-gray-600 dark:text-gray-400">{formatDateTime(callInTime)}</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <p className="text-gray-600 dark:text-gray-400">{activeCall.gateStatus}</p>
            </div>
          </div>
        </div>

        {/* Photo Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Photos:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Photo In:</p>
              <Image
                src={photoInUrl}
                alt="Photo In"
                width={32}
                height={32}
                className="w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/dummy-photo-in.jpg";
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Photo Out:</p>
              <Image
                src={photoOutUrl}
                alt="Photo Out"
                width={32}
                height={32}
                className="w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/dummy-photo-out.jpg";
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-4 mb-6">
          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Pilih Lokasi: <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">-- Pilih Lokasi --</option>
              <option value="entrance">Entrance</option>
              <option value="exit">Exit</option>
              <option value="parking">Parking</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-2">
              Kategori: <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi: <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">-- Pilih Kategori --</option>
              {description?.map((desc) => (
                <option key={desc.id} value={desc.id}>
                  {desc.object}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi tambahan..."
              rows={3}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 resize-none"
            />
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleOpenGate}
            disabled={!selectedCategory || isOpeningGate}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isOpeningGate ? "Opening..." : "Open Gate"}
          </button>
          <button
            onClick={endCallFunction}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}

// User Number Setup Modal
export function UserNumberSetup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userNumber, setUserNumber } = useGlobalSocket();
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal jika belum ada user number
    setShowModal(userNumber === null);
  }, [userNumber]);

  const handleSubmit = () => {
    const num = parseInt(inputValue);
    if (![1, 2, 3].includes(num)) {
      alert("User number harus 1, 2, atau 3");
      return;
    }
    setUserNumber(num);
    setShowModal(false);
  };

  const handleChangeUserNumber = () => {
    setShowModal(true);
    setInputValue("");
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem("id");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();

    // Listen untuk custom event
    const handleLoginSuccess = () => {
      checkLoginStatus();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, []);  

  if (!isLoggedIn) {
    return null;
  }

  // Render modal setup
  if (showModal) {
    return (
      <div className="fixed inset-0 backdrop-blur-md bg-opacity-200 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-xl font-semibold mb-4">Setup Agent Number</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              User Number (1-3):
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter number between 1-3"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              min="1"
              max="3"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Simpan
            </button>
            {userNumber !== null && (
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render button to change user number (optional)
  return (
    <button
      onClick={handleChangeUserNumber}
      className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-40"
      title="Change User Number"
    >
      👤
    </button>
  );
}