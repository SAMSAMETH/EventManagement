import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IndianRupee, Calendar, User, MapPin, Phone } from "lucide-react";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const name = state?.name || "";
  const phone = state?.phone || "";
  const location = state?.location || "";
  const eventType = state?.eventType || "";
  const date = state?.eventDate || "";
  const paymentType = state?.paymentType || "";
  const amount = state?.amount || 0;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-pink-50 to-purple-50 px-4 py-16 sm:px-6 sm:py-20">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white/80 backdrop-blur-xl 
          w-full max-w-md 
          p-6 sm:p-8 
          rounded-3xl shadow-xl border border-pink-100
        "
      >
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Payment <span className="text-pink-600">Summary</span>
        </h2>

        {/* Display Information */}
        <div className="space-y-4 mb-6">

          <SummaryItem icon={User} label="Name" value={name} />
          <SummaryItem icon={Phone} label="Phone" value={phone} />
          <SummaryItem icon={MapPin} label="Location" value={location} />
          <SummaryItem icon={Calendar} label="Event" value={eventType} />
          <SummaryItem icon={Calendar} label="Event Date" value={date} />
          <SummaryItem
            icon={IndianRupee}
            label="Payment Type"
            value={paymentType === "full" ? "Full Payment" : "Advance Payment"}
          />
        </div>

        {/* Amount Box */}
        <div className="
          p-5 sm:p-6 
          bg-purple-50 rounded-2xl 
          border border-purple-200 shadow-inner 
          text-center mb-6
        ">
          <p className="text-base sm:text-lg font-semibold text-gray-700">
            Amount to Pay
          </p>

          <p className="
            text-3xl sm:text-4xl 
            font-bold text-pink-600 
            flex items-center justify-center gap-1 mt-2
          ">
            <IndianRupee size={26} />
            {amount}
          </p>
        </div>

        {/* NOTE */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-6">
          Your booking will be confirmed after successful payment.
        </p>

        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            w-full mb-4 py-2 
            rounded-xl font-semibold text-sm sm:text-base
            border border-pink-400 text-pink-600 
            bg-white hover:bg-pink-50 
            transition
          "
        >
          ← Previous
        </button>

        {/* PROCEED BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            w-full py-3 rounded-xl text-white 
            font-semibold text-lg sm:text-xl
            bg-gradient-to-r from-pink-600 to-purple-600 
            shadow-lg hover:shadow-2xl transition
          "
          onClick={() => alert("Proceed to Payment Gateway")}
        >
          Proceed to Payment
        </motion.button>

      </motion.div>
    </div>
  );
}

/* Reusable summary item */
function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-gray-700">
      <Icon size={20} className="text-pink-600 flex-shrink-0" />
      <p className="text-sm sm:text-base">
        <span className="font-semibold">{label}:</span> {value}
      </p>
    </div>
  );
}


