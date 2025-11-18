// HomePage.jsx
import { motion } from "framer-motion";
import heroImg from "../assets/Weddings.jpg";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden pt-10 min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">

      {/* Soft Background Blobs */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-14 right-4 w-32 h-32 sm:w-48 sm:h-48 bg-pink-300/30 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1.1, 0.9, 1.2] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-14 left-4 w-36 h-36 sm:w-52 sm:h-52 bg-purple-300/30 blur-3xl rounded-full"
      />

      {/* Hero Section */}
      <div
        className="
          max-w-7xl mx-auto px-5 sm:px-8
          grid grid-cols-1 md:grid-cols-2
          gap-10 md:gap-14 lg:gap-16
          items-center 
          py-12 md:py-14 lg:py-16
          relative z-10
        "
      >

        {/* IMAGE FIRST ON MOBILE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="flex justify-center order-1 md:order-2"
        >
          <motion.img
            src={heroImg}
            alt="Wedding"
            className="
              rounded-2xl shadow-[0_15px_40px_rgba(255,105,180,0.25)]
              w-[100%] sm:w-[80%]
              max-w-sm sm:max-w-md md:max-w-lg
              object-cover
            "
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* TEXT BLOCK */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left order-2 md:order-1"
        >
          <h1
            className="
              text-[26px] sm:text-[32px] md:text-[42px] lg:text-[46px]
              font-bold text-gray-900 leading-snug md:leading-tight
            "
          >
            Stress-Free  
            <span className="text-pink-600 font-extrabold"> Wedding </span>
            Planning Made Simple
          </h1>

          <p
            className="
              mt-4 text-gray-600
              text-[14px] sm:text-[16px]
              leading-relaxed 
              max-w-md mx-auto md:mx-0
            "
          >
            Manage decorations, catering, photography, scheduling, and guest
            coordination — all in one smart wedding management platform.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            
            {/* Book Demo */}
            <motion.a
              href="https://wa.me/919876543210?text=Hi%20Zecardia%20Events,%20I%20want%20to%20book%20a%20demo"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-full sm:w-auto
                px-8 py-3 
                text-base font-semibold 
                bg-gradient-to-r from-pink-600 to-purple-600 
                text-white rounded-full shadow-lg 
                hover:shadow-xl transition-all
              "
            >
              Book a Demo
            </motion.a>

            {/* Explore Packages */}
            <motion.a
              href="/Packages"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-full sm:w-auto
                px-8 py-3 text-base font-semibold
                bg-white border border-pink-600 
                text-pink-600 rounded-full shadow 
                hover:bg-pink-50 transition
              "
            >
              Explore Packages
            </motion.a>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

