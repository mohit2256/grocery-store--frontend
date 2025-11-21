// src/pages/EditProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/Authcontext";
import PageTransition from "../components/PageTransition";

export function EditProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");

  const updateProfile = async () => {
    setMsg("Updating...");
    try {
      await user.updateProfile({ displayName: name });
      setMsg("Profile updated successfully! ✔");
    } catch (e) {
      setMsg("Error updating profile");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-[#1c0032] via-[#2d0054] to-[#120021] text-white flex justify-center">
        <div className="max-w-xl w-full">

          <h1 className="text-3xl font-bold text-purple-300 mb-6 drop-shadow-[0_0_10px_#FACC15]">
            Edit Profile
          </h1>

          <div className="bg-white/10 backdrop-blur-xl border border-purple-600/40 rounded-2xl p-6 shadow-[0_0_25px_#a855f766]">
            
            <label className="block mb-2 text-purple-200">Name</label>
            <input
              className="w-full p-3 mb-4 rounded bg-white/10 border border-yellow-300/40 focus:ring-yellow-300 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="block mb-2 text-purple-200">Phone (Optional)</label>
            <input
              className="w-full p-3 mb-4 rounded bg-white/10 border border-yellow-300/40 focus:ring-yellow-300 text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={updateProfile}
              className="
                w-full mt-2 py-3 rounded-xl
                bg-gradient-to-r from-yellow-400 to-yellow-500
                text-black font-bold
                hover:shadow-[0_0_25px_#facc15cc]
                transition-all duration-300
                active:scale-95
              "
            >
              Save Changes
            </button>

            {msg && <p className="mt-4 text-yellow-300">{msg}</p>}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
