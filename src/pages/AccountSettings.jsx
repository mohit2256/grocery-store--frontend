// src/pages/AccountSettings.jsx
import React from "react";
import PageTransition from "../components/PageTransition";

export function AccountSettings() {
  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#1c0032] via-[#2d0054] to-[#120021] text-white flex justify-center">
        <div className="max-w-xl w-full">

          <h1 className="text-3xl font-bold text-purple-300 mb-6 drop-shadow-[0_0_10px_#FACC15]">
            Account Settings
          </h1>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-600/40 shadow-[0_0_25px_#a855f733]">

            <div className="flex justify-between items-center mb-6">
              <p className="text-purple-200">Dark Mode</p>
              <button
                className="
                  bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2 
                  rounded-xl hover:shadow-[0_0_20px_#a855f7aa]
                  transition-all
                "
              >
                Toggle
              </button>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-purple-200">Delete Account</p>
              <button
                className="
                  bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 
                  rounded-xl text-white font-semibold
                  hover:shadow-[0_0_25px_#dc2626aa]
                  transition-all
                "
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
