"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
// import { AuthService } from '@/services/auth.service';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await LoginAuth({
        identifier: formData.username,
        password: formData.password,
        remember: true,
      });
      // Simpan di cookies
      // document.cookie = `id=${response.user.id}; path=/;`
      // Simpan juga di localStorage jika diperlukan
      localStorage.setItem("id", response.user.id);
      if (response.user.agent_number) {
        localStorage.setItem(
          "admin_user_number",
          response.user.agent_number.toString()
        );
      } else if (response.user.user_number) {
        localStorage.setItem(
          "admin_user_number",
          response.user.user_number.toString()
        );
      } else if (response.user.role_id) {
        // If you use role_id to determine agent number
        // Example mapping: role_id 1 = agent 1, role_id 2 = agent 2, etc.
        const agentNumber = response.user.role_id;
        if ([1, 2, 3].includes(agentNumber)) {
          localStorage.setItem("admin_user_number", agentNumber.toString());
        }
      }

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      router.push("/?loginSuccess=1");
      window.dispatchEvent(new Event("loginSuccess"));
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Terjadi kesalahan saat login";

      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // Mapping error berdasarkan message dari API
        if (message.includes("credential")) {
          errorMessage = "Username atau kata sandi salah";
        } else if (message.includes("server")) {
          errorMessage = "Terjadi kesalahan saat menghubungi server";
        } else {
          errorMessage = "Terjadi kesalahan saat menghubungi server";
        }
      } else {
        errorMessage = "Terjadi kesalahan saat menghubungi server";

      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {isLoading ? (
        <div className="text-center py-4 p-6">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 blink-smooth">
            Memproses Login...
          </p>
        </div>
      ) : (
        <div
        id="card-login"
        className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto w-auto dark:invert"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Command Center Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Masuk ke Dashboard OCC
          </p>
        </div>
        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
