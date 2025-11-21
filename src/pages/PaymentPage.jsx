import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressSteps from "../components/ProgressSteps";
import qrImage from "../assets/paymentQR.jpg";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [utr, setUtr] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleUTRSubmit = () => {
    if (utr.trim() === "") {
      alert("⚠️ Please enter your UTR number before submitting.");
      return;
    }
    setSubmitted(true);
    localStorage.setItem("utrNumber", utr);
    alert(`✅ UTR ${utr} submitted successfully!`);
  };

  return (
    <div className="p-6 text-center">
      <ProgressSteps currentStep={2} />

      <h2 className="text-2xl font-bold text-purple-600 mb-4">
        Scan & Pay via PhonePe 📱
      </h2>
      <p className="text-gray-600 mb-6">
        Scan the QR code below using your PhonePe app to complete your payment.
      </p>

      {/* QR Section */}
      <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 shadow-md w-60 mx-auto mt-4">
        <img
          src={qrImage}
          alt="PhonePe QR"
          className="w-48 h-48 object-contain rounded-lg"
        />
        <p className="mt-2 text-gray-700 text-sm">Scan to Pay via PhonePe</p>
      </div>

      <p className="text-gray-700 font-medium mb-4 mt-3">
        Mohit Kushwaha – PhonePe UPI
      </p>

      {/* UTR Input Section */}
      <div className="mt-4 flex flex-col items-center">
        <label
          htmlFor="utr"
          className="text-sm text-gray-700 font-medium mb-1"
        >
          Enter UTR Number (Transaction ID)
        </label>
        <input
          type="text"
          id="utr"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="e.g. 234567890123 or TXN12345XXXX"
          className="border border-gray-300 rounded-md px-4 py-2 w-64 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleUTRSubmit}
          className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Submit UTR
        </button>

        {submitted && (
          <p className="text-green-600 mt-2 text-sm font-medium">
            ✅ UTR Submitted: {utr}
          </p>
        )}
      </div>

      {/* Payment Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/success")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all"
        >
          ✅ Payment Completed
        </button>
      </div>

      {/* Go Back */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/checkout")}
          className="text-purple-600 hover:underline text-sm"
        >
          ← Go back to Checkout
        </button>
      </div>
    </div>
  );
}
