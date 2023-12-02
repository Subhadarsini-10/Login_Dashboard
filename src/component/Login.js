import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://stg.dhunjam.in/account/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "DJ@4",
            password: "Dhunjam@2023",
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.data.id;
        console.log(userId);
        navigate(`/dashboard/${userId}`);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-[600px] m-auto">
      <div className="text-center w-full mt-28">
        <h1 className="text-4xl font-bold mb-6">Venue Admin Login</h1>
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Username"
            className="border border-white bg-black rounded-xl p-2 mb-2 w-full h-14 mx-auto my-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-white bg-black rounded-xl p-2 mb-2 w-full h-14 mx-auto my-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          >
          </button>
          <button
            className={`bg-[#6741D9] text-white text-lg font-semibold rounded-xl p-2 w-full h-14 my-8 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          <div>
            <a href="#h" className="text-slate-300 text-base hover:underline">
              New Registration ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
