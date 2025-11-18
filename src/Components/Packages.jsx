// PackagesSection.jsx
import { motion } from "framer-motion";

export default function Packages() {
  const packages = [
    {
      title: "Standard",
      price: "₹29,999",
      offer: "10% OFF",
      offerColor: "bg-green-500",
      features: ["Basic Decoration", "Photography", "Food Catering", "Guest Management"],
      color: "from-pink-300/40 to-purple-300/40",
    },
    {
      title: "Premium",
      price: "₹59,999",
      offer: "BEST SELLER",
      offerColor: "bg-yellow-500",
      features: ["Designer Stage", "Premium Catering", "Drone + Cinematic Video", "Theme Decoration"],
      color: "from-purple-300/40 to-pink-300/40",
    },
    {
      title: "Royal",
      price: "₹99,999",
      offer: "LIMITED OFFER",
      offerColor: "bg-red-500",
      features: ["Grand Stage Setup", "Elite Buffet", "3-Day Full Team", "Luxury Decor + DJ Show"],
      color: "from-pink-400/40 to-yellow-300/40",
    },
  ];

  return (
    <div className="relative py-20 px-5 sm:px-6 bg-gradient-to-b from-white to-pink-50 overflow-hidden">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-12 sm:mb-16"
      >
        Wedding <span className="text-pink-600">Packages</span>
      </motion.h2>

      {/* Packages Grid */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">

        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              y: -8,
              boxShadow: "0px 25px 50px rgba(255,105,180,0.25)",
            }}
            className="
              relative p-8 sm:p-10 rounded-3xl 
              backdrop-blur-xl bg-white/60
              border border-white/40 shadow-lg 
              transition-all
            "
          >
            {/* Discount/Offer Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`
                absolute top-4 left-4 px-4 py-1 rounded-full 
                text-white text-xs sm:text-sm font-bold shadow-lg
                ${pkg.offerColor}
              `}
            >
              {pkg.offer}
            </motion.div>

            {/* Glow Background */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${pkg.color} blur-2xl opacity-40 -z-10`}></div>

            {/* Price Badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="
                absolute -top-6 left-1/2 -translate-x-1/2
                bg-gradient-to-r from-pink-600 to-purple-600 
                text-white px-5 py-2 sm:px-7 sm:py-2.5
                rounded-full font-bold 
                text-base sm:text-lg shadow-lg
              "
            >
              {pkg.price}
            </motion.div>

            {/* Title */}
            <h3 className="mt-8 text-xl sm:text-2xl font-bold text-center text-pink-700">
              {pkg.title}
            </h3>

            {/* Features */}
            <ul className="text-gray-700 space-y-3 mt-6 mb-8 text-sm sm:text-lg">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-pink-600 text-lg sm:text-xl">✔</span> {f}
                </li>
              ))}
            </ul>

            {/* Choose Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="
                w-full bg-gradient-to-r from-pink-600 to-purple-600
                text-white py-3 rounded-xl font-semibold 
                shadow-md hover:shadow-xl transition
                text-sm sm:text-lg
              "
            >
              Choose Package
            </motion.button>
          </motion.div>
        ))}

      </div>
    </div>
  );
}


