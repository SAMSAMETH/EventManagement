import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Phone, User, IndianRupee, Gift } from "lucide-react";

export default function EventBooking() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    eventType: "",
    eventDate: "",
    packageType: "",
    paymentType: "",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.packageType) {
      alert("Please select a package");
      return;
    }

    if (!form.paymentType) {
      alert("Please select Advance or Full Payment");
      return;
    }

    if (!form.amount || form.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    navigate("/payments", { state: form });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-lg 
          bg-white/80 backdrop-blur-xl 
          p-6 sm:p-10 
          rounded-3xl shadow-xl border border-pink-100
        "
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
          Event <span className="text-pink-600">Booking</span>
        </h2>

        <div className="space-y-6">

          {/* Name */}
          <div>
            <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <User size={20} className="text-pink-600" /> Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-xl 
                focus:border-pink-500 text-sm sm:text-base
              "
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <Phone size={20} className="text-pink-600" /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-xl 
                focus:border-pink-500 text-sm sm:text-base
              "
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <MapPin size={20} className="text-pink-600" /> Location / Venue
            </label>
            <input
              type="text"
              name="location"
              placeholder="Enter venue location"
              value={form.location}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-xl 
                focus:border-pink-500 text-sm sm:text-base
              "
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="font-semibold text-gray-800 mb-1 block text-sm sm:text-base">
              Event Type
            </label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-xl
                focus:border-pink-500 text-sm sm:text-base
              "
            >
              <option value="">Select Event</option>
              <option>Marriage</option>
              <option>Engagement</option>
              <option>Reception</option>
              <option>Baby Shower</option>
              <option>Birthday</option>
              <option>Corporate Event</option>
              <option>Other</option>
            </select>
          </div>

          {/* Package Selection */}
          <div>
            <label className="font-semibold text-gray-800 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <Gift size={20} className="text-pink-600" /> Select Package
            </label>

            <div className="grid grid-cols-3 gap-3">
              {["Standard", "Premium", "Royal"].map((pkg) => (
                <button
                  key={pkg}
                  onClick={() => setForm({ ...form, packageType: pkg })}
                  className={`
                    p-3 rounded-xl border text-center font-semibold text-xs sm:text-sm transition
                    ${
                      form.packageType === pkg
                        ? "bg-pink-600 text-white"
                        : "bg-white hover:bg-pink-50"
                    }
                  `}
                >
                  {pkg}
                </button>
              ))}
            </div>
          </div>

          {/* Event Date */}
          <div>
            <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <Calendar size={20} className="text-pink-600" /> Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              className="
                w-full p-3 border rounded-xl 
                focus:border-pink-500 text-sm sm:text-base
              "
            />
          </div>

          {/* Payment Type */}
          <div>
            <label className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
              Select Payment Type
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setForm({ ...form, paymentType: "advance" })}
                className={`
                  p-3 rounded-xl border text-center font-semibold transition text-sm sm:text-base 
                  ${
                    form.paymentType === "advance"
                      ? "bg-pink-600 text-white"
                      : "bg-white hover:bg-pink-50"
                  }
                `}
              >
                Advance
              </button>

              <button
                onClick={() => setForm({ ...form, paymentType: "full" })}
                className={`
                  p-3 rounded-xl border text-center font-semibold transition text-sm sm:text-base
                  ${
                    form.paymentType === "full"
                      ? "bg-pink-600 text-white"
                      : "bg-white hover:bg-pink-50"
                  }
                `}
              >
                Full Payment
              </button>
            </div>
          </div>

          {/* Amount Input */}
          {form.paymentType && (
            <div className="mt-2">
              <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm sm:text-base">
                <IndianRupee size={20} className="text-pink-600" /> Enter Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                placeholder="Enter amount to pay"
                onChange={handleChange}
                className="
                  w-full p-3 border rounded-xl 
                  focus:border-pink-500 text-sm sm:text-base
                "
              />
            </div>
          )}

          {/* Previous Button */}
          <button
            onClick={() => navigate(-1)}
            className="
              text-sm text-gray-700 underline mb-2 
              hover:text-pink-600 transition self-start
            "
          >
            ← Previous
          </button>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full py-3 rounded-xl 
              text-white font-semibold text-lg sm:text-xl
              bg-gradient-to-r from-pink-600 to-purple-600 
              shadow-lg hover:shadow-2xl transition
            "
          >
            Proceed to Payment
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


