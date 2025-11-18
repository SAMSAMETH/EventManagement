import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { galleryItems } from "../data/galleryData";

// ------------------------------------------------------
// LIGHTBOX (Photos Only)
// ------------------------------------------------------
const Lightbox = ({ images, currentIndex, onClose, setIndex }) => {
  const handleNext = () => setIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Swipe gestures
  useEffect(() => {
    let startX = 0;

    const onStart = (e) => (startX = e.touches[0].clientX);
    const onMove = (e) => {
      if (!startX) return;
      const diff = startX - e.touches[0].clientX;

      if (diff > 50) handleNext();
      if (diff < -50) handlePrev();
      startX = 0;
    };

    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);

    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => handleNext(), 2500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[999] p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          key={currentIndex}
          src={images[currentIndex].src}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-h-[75vh] w-auto mx-auto rounded-xl shadow-2xl"
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-8 right-0 text-white text-3xl"
        >
          ✕
        </button>

        {/* Prev */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -left-6 sm:-left-12 text-white text-4xl sm:text-5xl"
        >
          ‹
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 -right-6 sm:-right-12 text-white text-4xl sm:text-5xl"
        >
          ›
        </button>

        {/* Auto slideshow */}
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full text-sm font-semibold"
        >
          {autoPlay ? "Pause" : "Slideshow"}
        </button>
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------
// MAIN GALLERY COMPONENT
// ------------------------------------------------------
export default function Gallery() {
  const categories = ["All", "Decoration", "Photography", "Wedding", "Catering"];

  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setIndex] = useState(0);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  const openLightbox = (i) => {
    setIndex(i);
    setLightboxOpen(true);
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.includes(item.src)
        ? prev.filter((f) => f !== item.src)
        : [...prev, item.src]
    );
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-4xl sm:text-5xl font-extrabold mb-4"
        >
          Our <span className="text-pink-600">Gallery</span>
        </motion.h2>

        <p className="text-center text-sm sm:text-lg text-gray-600 mb-10">
          Explore our beautiful wedding creations & memories.
        </p>

        {/* Filter Buttons */}
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                activeCategory === cat
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 sm:gap-6 [column-fill:_balance] mt-6">

          {filteredItems.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="relative mb-4 break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl"
            >
              {/* Favorite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className="absolute top-2 right-2 z-20 bg-black/40 text-white p-2 rounded-full text-sm"
              >
                {favorites.includes(item.src) ? "❤️" : "🤍"}
              </button>

              {/* SUPER FAST IMAGE */}
              <img
                src={item.src}
                loading="lazy"
                decoding="async"
                className="
                  w-full rounded-xl object-cover 
                  hover:scale-105 transition duration-500
                  blur-sm
                "
                sizes="(max-width: 640px) 50vw,
                       (max-width: 1024px) 33vw,
                       25vw"
                onLoad={(e) => e.target.classList.remove("blur-sm")}
              />
            </motion.div>
          ))}

        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <Lightbox
          images={filteredItems}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          setIndex={setIndex}
        />
      )}
    </div>
  );
}
