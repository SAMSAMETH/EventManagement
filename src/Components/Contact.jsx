import { motion } from "framer-motion";
import { Phone, Mail, MapPin, CalendarHeart } from "lucide-react";

// OWNER WHATSAPP NUMBER
const WHATSAPP_NUMBER = "917338745684";

export default function Contact() {
  return (
    <div className="relative py-20 px-4 sm:px-6 bg-gradient-to-b from-[#fff0f7] via-white to-[#efe6ff] overflow-hidden">

      {/* Floating Background Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-16 left-6 w-28 h-28 sm:w-48 sm:h-48 bg-pink-300 blur-2xl sm:blur-3xl rounded-full"
      />

      <motion.div
        animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-16 right-6 w-32 h-32 sm:w-56 sm:h-56 bg-purple-300 blur-2xl sm:blur-3xl rounded-full"
      />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="text-center text-3xl sm:text-5xl font-extrabold text-gray-900 mb-12 sm:mb-16"
      >
        Contact <span className="text-pink-600">Zecardia Events</span>
      </motion.h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14">

        {/* Left — Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 sm:space-y-8"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Get In Touch</h3>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">
            Have questions or want to book our services?
            Fill out the form, and our team will reach out shortly.
          </p>

          <div className="space-y-4 sm:space-y-5 text-sm sm:text-lg">

            <div className="flex items-center gap-3">
              <Phone className="text-pink-600" size={24} />
              <p className="text-gray-700">+91 98765 43210</p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-pink-600" size={24} />
              <p className="text-gray-700">contact@zecardiaevents.com</p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-pink-600" size={24} />
              <p className="text-gray-700">Chennai, Tamil Nadu</p>
            </div>

            <div className="flex items-center gap-3">
              <CalendarHeart className="text-pink-600" size={24} />
              <p className="text-gray-700">Wedding Planning · Event Services</p>
            </div>
          </div>
        </motion.div>

        {/* Right — Contact Form */}
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();

            const name = e.target.name.value;
            const location = e.target.location.value;
            const eventType = e.target.eventType.value;
            const phone = e.target.phone.value;
            const email = e.target.email.value;
            const date = e.target.date.value;
            const message = e.target.message.value;

            const whatsappMessage = `
📌 *New Event Enquiry - Zecardia Events*

👤 *Name:* ${name}
📍 *Location:* ${location}
🎉 *Event Type:* ${eventType}
📞 *Phone:* ${phone}
📧 *Email:* ${email}
📅 *Event Date:* ${date}

📝 *Details:*
${message}
            `;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
          }}
          className="
            bg-white/60 backdrop-blur-xl 
            p-6 sm:p-10 rounded-3xl shadow-xl 
            border border-pink-100
          "
        >
          {/* Input Fields */}
          <div className="mb-5">
            <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Your Name"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Location</label>
            <input
              name="location"
              type="text"
              required
              placeholder="City / Venue"
              className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Event Type</label>
            <select
              name="eventType"
              required
              className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
            >
              <option>Engagement</option>
              <option>Reception</option>
              <option>Marriage</option>
              <option>Baby Shower</option>
              <option>Birthday Function</option>
              <option>Corporate Event</option>
              <option>Other</option>
            </select>
          </div>

          {/* Phone + Email */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Phone</label>
              <input
                name="phone"
                type="text"
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          {/* Event Date */}
          <div className="mt-5 mb-5">
            <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Event Date</label>
            <input
              name="date"
              type="date"
              required
              className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-gray-800 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Extra Details</label>
            <textarea
              name="message"
              rows="4"
              placeholder="Your message..."
              className="w-full p-3 rounded-xl border border-gray-300 text-sm sm:text-base focus:border-pink-500 outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              w-full py-3 rounded-xl 
              text-white font-semibold text-base sm:text-lg
              bg-gradient-to-r from-pink-600 to-purple-600 
              shadow-lg hover:shadow-2xl transition
            "
          >
            Submit Request
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}



