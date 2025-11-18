import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IndianRupee, Calendar, User, MapPin, Phone } from "lucide-react";

export default function Payment() {
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const bookingId = query.get("booking_id");
  const amount = query.get("amount");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-pink-50 to-purple-50 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl w-full max-w-md p-7 rounded-3xl shadow-xl border"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Payment <span className="text-pink-600">Summary</span>
        </h2>

        <div className="text-center mb-6">
          <p className="text-gray-500">Booking ID</p>
          <p className="text-xl font-bold">{bookingId}</p>
        </div>

        <div className="bg-purple-50 border p-5 rounded-2xl mb-6 text-center">
          <p className="text-gray-700 font-semibold">Amount to Pay</p>
          <p className="text-4xl font-bold text-pink-600 flex justify-center items-center gap-1 mt-2">
            <IndianRupee size={26} />
            {amount}
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mb-6">
          Your booking will be updated after successful payment.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="w-full mb-4 py-2 rounded-xl border border-pink-400 text-pink-600 bg-white hover:bg-pink-50"
        >
          ← Previous
        </button>

        <motion.button
          onClick={() => alert("Integrate Payment Gateway Here")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow-lg"
        >
          Proceed to Pay
        </motion.button>
      </motion.div>
    </div>
  );
}




