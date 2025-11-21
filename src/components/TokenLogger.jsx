import { useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function TokenLogger() {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log("🔥 Firebase ID Token:", token);
      } else {
        console.log("⚠️ No user logged in");
      }
    });

    return unsubscribe;
  }, []);

  return null; // doesnt render anything visible
}
