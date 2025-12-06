// HomePage.jsx
import { motion } from "framer-motion";
import heroImg from "../assets/wedding_optimized.webp"

export default function HomePage() {
  return (
    <div className="relative w-full  overflow-hidden bg-gradient-to-b from-pink-50 via-white to-purple-50">
      
      {/* Soft Background Blobs - Adjusted to not interfere with text */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.9, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-0 right-0  w-32 h-32 md:w-72 md:h-72 bg-pink-300/30 blur-3xl rounded-full pointer-events-none"
      />

      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1.1, 0.9, 1.2] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-40 h-40 md:w-80 md:h-80 bg-purple-300/30 blur-3xl rounded-full pointer-events-none"
      />

      {/* HERO SECTION */}
      {/* Changed min-h-screen to min-h-fit on mobile to avoid forcing scroll if content is short */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12 lg:min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center w-full">
          
          {/* IMAGE BLOCK */}
          {/* Mobile: Fixed Height (h-48) to save space. Desktop: Auto height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center md:justify-end order-first md:order-last mt-15"
          >
            <motion.div
                className="relative w-full max-w-md md:max-w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
            >
                <img
                  src={heroImg}
                  alt="Wedding"
                  className="
                    w-full 
                    h-48 sm:h-64 md:h-auto 
                    object-cover rounded-xl md:rounded-2xl 
                    shadow-[0_10px_30px_rgba(255,105,180,0.25)]
                  "
                />
            </motion.div>
          </motion.div>

          {/* TEXT BLOCK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center text-center md:text-left order-last md:order-first"
          >
            {/* Compact Heading for Mobile */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Stress-Free{" "}
              <span className="text-pink-600 font-extrabold inline">
                Wedding
              </span>{" "}
              <span className="block sm:inline">Planning Made Simple</span>
            </h1>

            {/* Compact Paragraph for Mobile */}
            <p className="mt-2 md:mt-6 text-gray-600 text-sm sm:text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
              Manage decorations, catering, photography, and guests — all in one platform.
            </p>

            {/* BUTTONS */}
            {/* Reduced gap and margin for mobile */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-8 justify-center md:justify-start w-full">
              <motion.a
                href="https://wa.me/919876543210?text=Hi%20Zecardia%20Events,%20I%20want%20to%20book%20a%20demo"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full sm:w-auto
                  px-6 py-3 
                  text-sm md:text-lg font-semibold
                  bg-gradient-to-r from-pink-600 to-purple-600 
                  text-white rounded-full shadow-md 
                  hover:shadow-xl transition-all
                  flex justify-center items-center
                "
              >
                Book a Demo
              </motion.a>

              <motion.a
                href="/Packages"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full sm:w-auto
                  px-6 py-3 
                  text-sm md:text-lg font-semibold
                  bg-white border border-pink-600 
                  text-pink-600 rounded-full shadow-sm
                  hover:bg-pink-50 transition-all
                  flex justify-center items-center
                "
              >
                Explore Packages
              </motion.a>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}




