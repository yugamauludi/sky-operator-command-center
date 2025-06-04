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
import { toast, ToastContainer } from "react-toastify";
import { endCall, pingArduino } from "@/hooks/useIOT";
import Image from "next/image";
import { Category, fetchCategories } from "@/hooks/useCategories";
import { Description, fetchDescriptions } from "@/hooks/useDescriptions";
import { openGate } from "@/hooks/useLocation";
import { addIssue } from "@/hooks/useIssues";

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

interface DataIssue {
  idCategory?: number;
  idGate?: number;
  description?: string;
  action?: string;
  foto?: string;
  number_plate?: string;
  TrxNo?: string;
}

// Global Call Popup Component
// Updated GlobalCallPopup Component with new layout
export function GlobalCallPopup() {
  const { activeCall, endCallFunction } = useGlobalSocket();
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

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        const response = await fetchCategories(1, 1000);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchDataDescription = async () => {
      try {
        const response = await fetchDescriptions(1, 1000);
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
        foto: activeCall.photoIn || "-",
        number_plate: dataIssue.number_plate || "DUM 111 YYY",
        TrxNo: dataIssue.TrxNo || "123DUMYYY345",
      };
      const response = await addIssue(issueData);
      console.log(response, "response");

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
      await pingArduino(parseInt(activeCall.gateId));
      const response = await openGate(activeCall.gateId);

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
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (!activeCall) return null;

  // Get photo URLs or use dummy images
  const photoInUrl = activeCall?.photoIn || "/images/Plat-Nomor-Motor-875.png";
  const photoOutUrl =
    activeCall?.photoOut || "/images/Plat-Nomor-Motor-875.png";
  const photoCaptureurl =
    activeCall?.capture || "/images/Plat-Nomor-Motor-875.png";
  const locationName = activeCall?.location?.Name || "Unknown Location";

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-100 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              📞 Incoming Call!
            </h2>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left Column - Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Information
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
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
                    {activeCall.gate || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Gate ID</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {activeCall.gateId || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">No Transaction</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {dataIssue.TrxNo || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">No Plat Number</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {dataIssue.number_plate || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Date</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {formatDateTime(callInTime).split(" ")[0]}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">In Time</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    {formatDateTime(callInTime).split(" ")[1]}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Out Time</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    -
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Time</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    -
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Tariff</span>
                  <span>:</span>
                  <span className="text-gray-600 dark:text-gray-400 flex-1 text-right">
                    -
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Input Issue */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Input Issue
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Object
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
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
                    Description
                  </label>
                  <select
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
                  >
                    <option value="">-- Pilih Deskripsi --</option>
                    {description?.map((desc) => (
                      <option key={desc.id} value={desc.id}>
                        {desc.object}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
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
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 bg-gray-50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={endCallFunction}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    End Call
                  </button>
                  <button
                    onClick={handleCreateIssue}
                    disabled={
                      !selectedCategory || !selectedDescription || isCreateIssue
                    }
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
                  >
                    {isCreateIssue ? "Creating..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Photos */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Foto In</p>
                <div className="w-full h-40 bg-gray-600 rounded-md flex items-center justify-center text-white">
                  {!imageErrors.photoIn ? (
                    <Image
                      src={photoInUrl}
                      alt="Foto In"
                      width={200}
                      height={188}
                      className="w-full h-full object-cover rounded-md"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, photoIn: true }));
                      }}
                    />
                  ) : (
                    <span className="text-sm">Foto In</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium mb-2">Foto Out</p>
                <div className="w-full h-40 bg-gray-600 rounded-md flex items-center justify-center text-white">
                  {!imageErrors.photoOut ? (
                    <Image
                      src={photoOutUrl}
                      alt="Foto Out"
                      width={200}
                      height={188}
                      className="w-full h-full object-cover rounded-md"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, photoOut: true }));
                      }}
                    />
                  ) : (
                    <span className="text-sm">Foto Out</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium mb-2">Foto Capture</p>
                <div className="w-full h-40 bg-gray-600 rounded-md flex items-center justify-center text-white">
                  {!imageErrors.photoIn ? (
                    <Image
                      src={photoCaptureurl}
                      alt="Foto Capture"
                      width={200}
                      height={188}
                      className="w-full h-full object-cover rounded-md"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, photoIn: true }));
                      }}
                    />
                  ) : (
                    <span className="text-sm">Foto Capture</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleOpenGate}
              disabled={!selectedCategory || isOpeningGate}
              className="px-8 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {isOpeningGate ? "Opening..." : "Open Gate"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function UserNumberSetup() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userNumber, setUserNumber } = useGlobalSocket();
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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

  // const handleChangeUserNumber = () => {
  //   setShowModal(true);
  //   setInputValue("");
  // };

  const checkLoginStatus = () => {
    const token = localStorage.getItem("id");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();

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

  // return (
  //   <button
  //     onClick={handleChangeUserNumber}
  //     className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-40"
  //     title="Change User Number"
  //   >
  //     👤
  //   </button>
  // );
}
