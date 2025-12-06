// BookDemo.jsx (Mobile Responsive & Font Optimized)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Phone, User, MessageSquare } from "lucide-react";

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

  // The business logic is preserved
  const whatsappNumber = "7338745684";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  // Reusable Input Field Component
  const InputField = ({
    label,
    icon: Icon,
    type = "text",
    name,
    value,
    placeholder,
    required = true,
    onChange,
  }) => (
    <div>
      <label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-1">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
        <input
          id={name}
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-4 py-2.5 
            text-sm text-gray-800
            border border-gray-300 rounded-lg outline-none 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150
            placeholder:text-gray-400
          "
        />
      </div>
    </div>
  );

  return (
    // Base container: Added vertical padding for mobile
    <div className="relative min-h-screen py-10 md:py-16 bg-gray-50 overflow-hidden">

      {/* Page Title: Adjusted font sizing for better mobile scale */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Font change: text-3xl on mobile, text-4xl on larger screens
        className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 px-4"
      >
        Schedule Your <span className="text-indigo-600">Free Demo</span>
      </motion.h2>
      
      {/* Subtitle: Added horizontal padding for mobile */}
      <p className="mt-3 text-center text-base sm:text-lg text-gray-600 px-4">
        Fill out the form below and we'll connect with you on WhatsApp.
      </p>

      {/* FORM Container: Responsive padding and margin */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="
          max-w-xl mx-auto mt-8 md:mt-10 p-6 sm:p-8 md:p-10 
          bg-white 
          rounded-xl shadow-2xl shadow-indigo-100/50 border border-gray-200
          space-y-6
          // Added horizontal margin for very small screens
          mx-4 sm:mx-auto
        "
      >
        {/* Name and Mobile: Grid stacks on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            icon={User}
            name="name"
            value={formData.name}
            placeholder="e.g., Jane Doe"
            onChange={handleChange}
          />

          <InputField
            label="Mobile Number"
            icon={Phone}
            type="tel"
            name="mobile"
            value={formData.mobile}
            placeholder="Your 10-digit number"
            onChange={handleChange}
          />
        </div>
        
        {/* Event Type and Event Date: Grid stacks on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Event Type - Select Box */}
          <div>
            <label htmlFor="eventType" className="text-gray-700 text-sm font-medium">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              required
              value={formData.eventType}
              onChange={handleChange}
              className="
                w-full mt-1 px-4 py-2.5
                text-sm text-gray-800
                border border-gray-300 rounded-lg outline-none 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150
              "
            >
              <option value="">Select Event Type</option>
              <option value="Engagement">Engagement</option>
              <option value="Reception">Reception</option>
              <option value="Marriage">Marriage</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Event Date */}
          <InputField
            label="Target Event Date"
            icon={Calendar}
            type="date"
            name="date"
            value={formData.date}
            placeholder=""
            onChange={handleChange}
          />
        </div>

        {/* Location - Full Width */}
        <InputField
          label="Event Location"
          icon={MapPin}
          name="location"
          value={formData.location}
          placeholder="City, Venue name, or region"
          onChange={handleChange}
        />

        {/* Extra Details - Textarea */}
        <div>
          <label htmlFor="details" className="text-gray-700 text-sm font-medium">
            Extra Details / Requirements
          </label>
          <div className="relative mt-1">
            <MessageSquare className="absolute left-3 top-3 text-indigo-500" size={18} />
            <textarea
              id="details"
              name="details"
              rows="4"
              value={formData.details}
              onChange={handleChange}
              placeholder="e.g., Guest count, specific services needed (photography, decor, etc.)"
              className="
                w-full mt-1 p-3 pl-10 
                text-sm text-gray-800
                border border-gray-300 rounded-lg outline-none 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150
                placeholder:text-gray-400
              "
            ></textarea>
          </div>
        </div>

        {/* SUBMIT BUTTON - Primary Action */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.05)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          // Font size adjusted for mobile
          className="
            w-full py-3.5 text-base sm:text-lg font-semibold 
            bg-indigo-600 hover:bg-indigo-700
            text-white rounded-lg shadow-md shadow-indigo-500/50
            transition duration-150 ease-in-out
          "
        >
          <span className="flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.0001 2.0001C6.4801 2.0001 2.0001 6.4801 2.0001 12.0001C2.0001 13.7901 2.4701 15.4501 3.3001 16.9001L2.1701 21.9501L7.4901 20.6501C8.8901 21.3201 10.3901 21.6801 12.0001 21.6801C17.5201 21.6801 22.0001 17.2001 22.0001 12.0001C22.0001 6.4801 17.5201 2.0001 12.0001 2.0001ZM16.4801 15.6801C16.3201 15.9801 14.8801 16.7301 14.3601 16.9201C13.8401 17.1101 13.4301 17.1501 13.0201 17.0201C12.6101 16.8901 12.0001 16.6901 11.2301 16.2901C10.4601 15.8901 9.8001 15.0201 9.2901 14.1601C8.7801 13.3001 8.5201 12.4401 8.6801 11.5801C8.8301 10.7201 9.0001 10.3701 9.2701 10.1201C9.5301 9.8701 9.8901 9.7701 10.2201 9.6501C10.5501 9.5301 10.7401 9.4901 10.9601 9.9001C11.1801 10.3101 11.5201 11.1301 11.5801 11.2401C11.6401 11.3501 11.7501 11.5001 11.6901 11.6201C11.6301 11.7401 11.5801 11.8501 11.4401 12.0001C11.3001 12.1501 11.0501 12.4201 10.8801 12.6901C10.7101 12.9601 10.5701 13.1101 10.6801 13.3101C10.7901 13.5101 11.3101 14.3301 12.0501 14.9701C12.9601 15.7501 13.7101 15.9801 13.9701 16.0901C14.2301 16.2001 14.5001 16.1801 14.6801 15.9801C14.8601 15.7801 15.3401 15.1501 15.5501 14.7701C15.7601 14.3901 15.9401 14.4601 16.2001 14.5501C16.4601 14.6401 17.0001 14.9001 17.2601 15.0301C17.5201 15.1601 17.7001 15.2201 17.6301 15.4201C17.5601 15.6201 16.6401 16.3201 16.4801 15.6801Z"/></svg>
            Send Request via WhatsApp
          </span>
        </motion.button>

        {/* PREVIOUS BUTTON - Secondary Action */}
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.01, backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.99 }}
          // Font size adjusted for mobile
          className="
            w-full py-3 mt-4 text-sm sm:text-base font-medium 
            bg-white border border-gray-300
            text-gray-700 rounded-lg shadow-sm 
            transition duration-150 ease-in-out
          "
        >
          ← Go Back
        </motion.button>
      </motion.form>
    </div>
  );
}


