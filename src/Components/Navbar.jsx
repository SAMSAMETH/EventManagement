import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", to: "#home", type: "scroll" },
  { label: "About", to: "#about", type: "scroll" },
  { label: "Services", to: "#services", type: "scroll" },
  { label: "Package", to: "#package", type: "scroll" },
  { label: "Gallery", to: "#gallery", type: "scroll" },
  { label: "Event Booking", to: "/event-booking", type: "page" },
  { label: "Book Demo", to: "/book-demo", type: "page" },
  { label: "Contact", to: "#contact", type: "scroll" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [shrink, setShrink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Refs
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const underlineRef = useRef(null);

  const scrollToSection = (id) => {
    const sec = document.querySelector(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  const getKey = (item) =>
    item.type === "page" ? item.label.toLowerCase() : item.to.replace("#", "");

  // Track homepage sections
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = navItems
      .filter((i) => i.type === "scroll")
      .map((i) => i.to);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((sec) => {
      const el = document.querySelector(sec);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // On page routes
  useEffect(() => {
    if (location.pathname !== "/") {
      const page = navItems.find((i) => i.type === "page" && i.to === location.pathname);
      if (page) setActive(page.label.toLowerCase());
    }
  }, [location.pathname]);

  // Shrink nav
  useEffect(() => {
    const handle = () => setShrink(window.scrollY > 20);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      if (location.pathname !== "/") navigate("/");
      setTimeout(() => scrollToSection(item.to), 200);
      setActive(item.to.replace("#", ""));
    } else {
      navigate(item.to);
      setActive(item.label.toLowerCase());
    }
    setOpen(false);
  };

  // Sliding underline
  const updateUnderline = () => {
    const bar = underlineRef.current;
    const container = navRef.current;

    if (!bar || !container) return;

    const activeItem = navItems.find((i) => getKey(i) === active);

    if (!activeItem || activeItem.type !== "scroll") {
      bar.style.width = "0px";
      return;
    }

    const el = itemRefs.current[getKey(activeItem)];
    if (!el) return;

    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();

    bar.style.width = `${r.width}px`;
    bar.style.transform = `translateX(${r.left - cRect.left}px)`;
    bar.style.opacity = "1";
  };

  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [active]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        shrink ? "py-2 bg-white shadow-lg" : "py-4 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <motion.h1
          whileHover={{ scale: 1.03 }}
          onClick={() => handleNavClick({ to: "#home", type: "scroll" })}
          className="cursor-pointer text-2xl sm:text-3xl font-bold tracking-tight text-gray-900"
        >
          Zecardia<span className="text-pink-600">.</span>Events
        </motion.h1>

        {/* DESKTOP NAV */}
        <div className="hidden md:block relative" ref={navRef}>
          <ul className="flex gap-6 font-semibold text-gray-700">
            {navItems.map((item) => {
              const key = getKey(item);
              return (
                <button
                  key={item.label}
                  ref={(el) => (itemRefs.current[key] = el)}
                  onClick={() => handleNavClick(item)}
                  className={`relative uppercase text-sm transition ${
                    active === key ? "text-pink-600" : "hover:text-pink-500"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </ul>

          <span
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-[2px] bg-pink-600 rounded-full transition-all duration-300"
            style={{ width: 0, opacity: 0 }}
          />
        </div>

        {/* MOBILE MENU BUTTON */}
        <motion.button
          className="md:hidden text-3xl text-gray-900 font-bold p-1"
          onClick={() => setOpen(true)}
        >
          ☰
        </motion.button>
      </div>

      {/* MOBILE SIDE DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="
              fixed top-0 right-0 h-full w-[80%] max-w-xs 
              bg-white shadow-2xl z-50 
              rounded-l-3xl 
              px-6 py-8
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Menu
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="
                  text-4xl font-semibold text-gray-700 
                  hover:text-pink-600 transition
                "
              >
                ×
              </button>
            </div>

            {/* Menu List */}
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full text-left py-3 px-4 
                    rounded-xl text-lg font-semibold 
                    tracking-wide transition-all
                    ${
                      active === getKey(item)
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                        : "text-gray-800 hover:bg-gray-100"
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


