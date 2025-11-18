// ServicesSection.jsx
import { motion } from "framer-motion";
import { Sparkles, Camera, Utensils, Flower } from "lucide-react";
import decoImg from "../assets/s-deco.jpg";
import cateringImg from "../assets/s-catering.jpg";
import photoImg from "../assets/s-photo.jpg";
import planningImg from "../assets/s-planning.jpg";

export default function Services() {
  const services = [
    {
      title: "Wedding Decoration",
      icon: <Flower size={34} />,
      desc: "Premium stage decor, mandap setups, floral installations & theme-based luxury designs.",
      img: decoImg,
    },
    {
      title: "Catering Services",
      icon: <Utensils size={34} />,
      desc: "Elite multi-cuisine catering with high-quality presentation.",
      img: cateringImg,
    },
    {
      title: "Photography & Videography",
      icon: <Camera size={34} />,
      desc: "Candid photos, cinematic films, drone shots & premium wedding albums.",
      img: photoImg,
    },
    {
      title: "Full Event Planning",
      icon: <Sparkles size={34} />,
      desc: "End-to-end planning: decor, hospitality, logistics & complete coordination.",
      img: planningImg,
    },
  ];

  return (
    <div className="relative py-20 px-5 sm:px-6">

      {/* SECTION TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          text-center text-3xl sm:text-5xl 
          font-extrabold text-gray-900 mb-12
        "
      >
        Our <span className="text-pink-600">Premium Services</span>
      </motion.h2>

      {/* INSTAGRAM GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            whileHover={{ scale: 1.04 }}

            className="
              bg-white rounded-2xl shadow-md 
              hover:shadow-xl transition-all duration-300
              overflow-hidden cursor-pointer group
            "
          >
            {/* IMAGE (Square like IG) */}
            <div className="relative w-full aspect-square overflow-hidden">
              <img
                src={service.img}
                alt={service.title}
                className="
                  w-full h-full object-cover 
                  transition-all duration-500 
                  group-hover:scale-110
                "
              />

              {/* Overlay fade */}
              <div
                className="
                  absolute inset-0 bg-black/0 
                  group-hover:bg-black/15
                  transition-all duration-300
                "
              ></div>
            </div>

            {/* TEXT CONTENT */}
            <div className="p-4 sm:p-5 text-center">
              
              {/* Icon */}
              <div className="text-pink-600 mb-1 flex justify-center">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
                {service.desc}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
