// BookDemo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Phone, User } from "lucide-react";

export default function BookDemo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    eventType: "",
    location: "",
    date: "",
    details: "",
  });

  const whatsappNumber = "7338745684";

  const handleSubmit = (e) => {
    e.preventDefault();

    const msg = `
📌 *New Demo Booking Request*
----------------------------------
👤 *Name:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
💒 *Event Type:* ${formData.eventType}
📍 *Location:* ${formData.location}
📅 *Event Date:* ${formData.date}
📝 *Details:* ${formData.details}
----------------------------------
Zecardia Events – Demo Booking Form
`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
  };

  return (
    <div className="relative min-h-screen pb-20 pt-32 bg-gradient-to-b from-pink-50 via-white to-purple-50 overflow-hidden">

      {/* Page Title */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900"
      >
        Book a <span className="text-pink-600">Demo</span>
      </motion.h2>

      {/* FORM */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          max-w-xl mx-auto mt-10 px-6 py-8
          bg-white/70 backdrop-blur-xl
          rounded-3xl shadow-md border border-pink-100
          space-y-6
        "
      >
        {/* Name */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 text-pink-600" size={18} />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="
                w-full pl-10 pr-4 py-3 
                text-sm sm:text-base
                border rounded-xl outline-none 
                focus:ring-2 focus:ring-pink-400
              "
              placeholder="Your full name"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">Mobile Number</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-3 text-pink-600" size={18} />
            <input
              type="tel"
              required
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              className="
                w-full pl-10 pr-4 py-3 
                text-sm sm:text-base
                border rounded-xl outline-none 
                focus:ring-2 focus:ring-pink-400
              "
              placeholder="Your mobile number"
            />
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">Event Type</label>
          <select
            required
            value={formData.eventType}
            onChange={(e) =>
              setFormData({ ...formData, eventType: e.target.value })
            }
            className="
              w-full mt-1 px-4 py-3
              text-sm sm:text-base
              border rounded-xl outline-none 
              focus:ring-2 focus:ring-pink-400
            "
          >
            <option value="">Select Event</option>
            <option>Engagement</option>
            <option>Reception</option>
            <option>Marriage</option>
            <option>Others</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">Location</label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-3 text-pink-600" size={18} />
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="
                w-full pl-10 pr-4 py-3 
                text-sm sm:text-base
                border rounded-xl outline-none 
                focus:ring-2 focus:ring-pink-400
              "
              placeholder="Event location"
            />
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">Event Date</label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-3 text-pink-600" size={18} />
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="
                w-full pl-10 pr-4 py-3
                text-sm sm:text-base 
                border rounded-xl outline-none 
                focus:ring-2 focus:ring-pink-400
              "
            />
          </div>
        </div>

        {/* Extra Details */}
        <div>
          <label className="text-gray-800 text-sm font-semibold">
            Extra Details
          </label>
          <textarea
            rows="4"
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className="
              w-full mt-1 p-3 
              text-sm sm:text-base
              border rounded-xl outline-none 
              focus:ring-2 focus:ring-pink-400
            "
            placeholder="Any additional information..."
          ></textarea>
        </div>

        {/* SUBMIT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="
            w-full py-3.5 text-base sm:text-lg font-semibold 
            bg-gradient-to-r from-pink-600 to-purple-600
            text-white rounded-xl shadow-lg
          "
        >
          Send to WhatsApp
        </motion.button>

        {/* PREVIOUS BUTTON */}
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="
            w-full py-3 mt-2 text-sm sm:text-base font-semibold 
            bg-white border border-pink-300 
            text-pink-600 rounded-xl shadow 
            hover:bg-pink-50 transition
          "
        >
          ← Previous
        </motion.button>
      </motion.form>
    </div>
  );
}


