// TestimonialSection.jsx
import { motion } from "framer-motion";
import { Quote, Heart } from "lucide-react";

export default function Testimonial() {
  const testimonials = [
    {
      name: "Aarav & Diya",
      feedback:
        "Amazing decoration and hospitality! The team made our wedding truly magical.",
      package: "Royal Package",
      img: "https://i.pravatar.cc/150?img=32",
      rating: 5,
    },
    {
      name: "Rajesh & Priya",
      feedback:
        "Catering was delicious, photography was beautiful, highly recommended!",
      package: "Premium Package",
      img: "https://i.pravatar.cc/150?img=45",
      rating: 4,
    },
    {
      name: "Vikram & Sanjana",
      feedback:
        "Professional team, smooth planning, and wonderful execution!",
      package: "Standard Package",
      img: "https://i.pravatar.cc/150?img=12",
      rating: 5,
    },
  ];

  return (
    <div className="relative py-16 sm:py-24 px-5 sm:px-6 bg-gradient-to-b from-white to-pink-50 overflow-hidden">

      {/* Floating Hearts */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-16 left-10 text-pink-400 text-4xl sm:text-5xl opacity-30"
      >
        <Heart size={45} />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-16 right-10 text-purple-400 text-4xl sm:text-5xl opacity-30"
      >
        <Heart size={45} />
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="
          text-center 
          text-3xl sm:text-4xl md:text-5xl 
          font-extrabold text-gray-900 
          mb-12 sm:mb-16
        "
      >
        Client <span className="text-pink-600">Testimonials</span>
      </motion.h2>

      {/* Testimonial Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14">

        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{
              scale: 1.05,
              y: -8,
              boxShadow: "0 25px 60px rgba(255,105,180,0.35)",
            }}
            className="
              relative bg-white/70 backdrop-blur-xl 
              border border-pink-200/50 
              rounded-3xl shadow-xl 
              p-8 sm:p-10 pt-14 
              text-center transition-all
            "
          >
            {/* Quote Icon */}
            <motion.div
              animate={{ rotate: [0, 6, -6, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="
                absolute -top-6 left-1/2 -translate-x-1/2 
                w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                bg-gradient-to-r from-pink-500 to-purple-600
                flex items-center justify-center text-white shadow-lg
              "
            >
              <Quote size={24} />
            </motion.div>

           {/* Profile Image with Instagram Border */}
<div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
  
  {/* Gradient Ring */}
  <div
    className="
      absolute inset-0 rounded-full p-[3px] 
      bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600
      animate-spin-slow
    "
    style={{ animationDuration: "6s" }}
  >
    <div className="w-full h-full bg-white rounded-full"></div>
  </div>

  {/* Actual Image */}
  <img
    src={t.img}
    className="
      absolute inset-[5px] w-[calc(100%-10px)] h-[calc(100%-10px)]
      rounded-full object-cover 
      shadow-lg border-2 border-white
    "
    alt={t.name}
  />
</div>


            {/* Name */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-4">
              {t.name}
            </h3>

            {/* Star Rating */}
            <div className="flex justify-center mt-1 sm:mt-2">
              {Array(t.rating)
                .fill(null)
                .map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg sm:text-xl">★</span>
                ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-700 italic mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed">
              “{t.feedback}”
            </p>

            {/* Package Badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="
                mt-5 sm:mt-6 inline-block px-4 py-1.5 
                rounded-full 
                bg-gradient-to-r from-pink-500 to-purple-600 
                text-white text-xs sm:text-sm font-semibold shadow-md
              "
            >
              {t.package}
            </motion.div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}

