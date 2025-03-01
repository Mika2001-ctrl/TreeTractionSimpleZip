"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const appPassword = process.env.APP_PASSWORD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedPassword = appPassword; // Retrieve from .env
    if (password === storedPassword) {
      localStorage.setItem("isAuthenticated", "true"); // Store authentication
      router.push("/home"); // Redirect to home page
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Enter Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            placeholder="Password"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
