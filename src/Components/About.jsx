// About.jsx
import { motion } from "framer-motion";
import aboutImg from "../assets/g4.jpg";

export default function About() {
  return (
    <div className="relative pt-6 md:pt-10 bg-gradient-to-b from-[#fff0f7] via-white to-[#efe6ff] min-h-screen overflow-hidden">

      {/* Background Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
        className="
          absolute top-10 right-4 
          w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64
          bg-pink-300/30 blur-2xl sm:blur-3xl rounded-full
        "
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.2 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror' }}
        className="
          absolute bottom-10 left-4 
          w-28 h-28 sm:w-48 sm:h-48 md:w-72 md:h-72
          bg-purple-300/30 blur-2xl sm:blur-3xl rounded-full
        "
      />

      {/* Main Content */}
      <div className="
        relative z-10 max-w-7xl mx-auto 
        px-5 sm:px-6 
        py-12 sm:py-16 md:py-20 
        grid md:grid-cols-2 gap-10 sm:gap-16 items-center
      ">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="flex justify-center"
        >
          <motion.img
            src={aboutImg}
            alt="Wedding Decor"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="
              rounded-2xl shadow-md sm:shadow-[0_20px_60px_rgba(255,105,180,0.35)]
              border-[2px] sm:border-[4px] border-white/70 
              w-[82%] max-w-xs sm:max-w-md md:max-w-lg
            "
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="
            text-2xl sm:text-4xl md:text-5xl 
            font-extrabold text-gray-900 
            mb-3 sm:mb-6 leading-snug
            text-center md:text-left
          ">
            About <span className="text-pink-600">Zecardia Events</span>
          </h1>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-3 sm:mb-4 text-center md:text-left">
            <strong>Zecardia Events</strong> was founded in <strong>2025</strong> in
            <strong> Chennai</strong> to deliver luxurious and unforgettable wedding experiences.
          </p>

          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed mb-5 text-center md:text-left">
            From décor to catering and photography to guest management — 
            we ensure every precious moment is elegant, joyful, and seamless.
          </p>

          {/* Mission & Vision */}
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-4 sm:p-5 bg-white shadow-lg sm:shadow-xl rounded-2xl border border-pink-200/50"
            >
              <h3 className="text-lg font-semibold text-pink-600">✨ Our Mission</h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                To deliver premium, heart-touching wedding experiences with innovation and care.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-4 sm:p-5 bg-white shadow-lg sm:shadow-xl rounded-2xl border border-purple-200/50"
            >
              <h3 className="text-lg font-semibold text-purple-600">🌟 Our Vision</h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                To become India’s most admired wedding planning brand known for magical celebrations.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* Journey */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pb-16 mt-6">
        <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-12">
          Our <span className="text-pink-600">Journey</span>
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-10">
          {[
            { year: "2025", text: "Zecardia Events founded in Chennai." },
            { year: "2026", text: "Expanded to premium décor & photography." },
            { year: "2027", text: "Introduced full event planning & digital bookings." }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-pink-100 text-center"
            >
              <h3 className="text-xl sm:text-3xl font-bold text-pink-600">{item.year}</h3>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 pb-14 grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 text-center"
      >
        {[
          { label: "Weddings Completed", value: "150+" },
          { label: "Years of Expertise", value: "5+" },
          { label: "Decor Themes", value: "40+" },
          { label: "Team Members", value: "25+" }
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            className="p-4 sm:p-6 bg-white rounded-2xl shadow-md sm:shadow-lg border border-pink-200/50"
          >
            <h2 className="text-xl sm:text-4xl font-bold text-pink-600">{item.value}</h2>
            <p className="text-gray-700 mt-1 sm:mt-2 text-xs sm:text-base">{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}


