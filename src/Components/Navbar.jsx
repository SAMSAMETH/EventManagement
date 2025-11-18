import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
// NOTE: Assuming supabaseClient is correctly configured and imported.
import { supabase } from "../supabase/supabaseClient"; 

// Define the navigation items for the desktop and mobile menus
const navItems = [
  { label: "Home", to: "#home", type: "scroll" },
  { label: "About", to: "#about", type: "scroll" },
  { label: "Services", to: "#services", type: "scroll" },
  { label: "Package", to: "#package", type: "scroll" },
  { label: "Gallery", to: "#gallery", "type": "scroll" },
  { label: "Event Booking", to: "/event-booking", type: "page" },
  { label: "Book Demo", to: "/book-demo", type: "page" },
  { label: "Contact", to: "#contact", type: "scroll" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false); // Mobile drawer state
  const [active, setActive] = useState("home"); // Currently active link/section
  const [shrink, setShrink] = useState(false); // Navbar shrink/shadow state on scroll
  const [user, setUser] = useState(null); // SUPABASE USER object

  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef(null); // Reference for the desktop nav container
  const itemRefs = useRef({}); // References for individual desktop nav items
  const underlineRef = useRef(null); // Reference for the active link underline

  // -------------------------------
  // SUPABASE AUTH SESSION TRACK
  // -------------------------------
  useEffect(() => {
    // Function to load the current user on component mount
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };

    loadUser();

    // Set up a listener for real-time auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Clean up the subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  // LOGOUT handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false); // Close mobile menu if open
    navigate("/"); // Redirect to home page
  };

  // -------------------------------
  // SCROLL & ACTIVE LINK LOGIC
  // -------------------------------
  // Helper to scroll to a section on the current page
  const scrollToSection = (id) => {
    const sec = document.querySelector(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  // Helper to get a consistent key for tracking active state
  const getKey = (item) =>
    item.type === "page" ? item.label.toLowerCase() : item.to.replace("#", "");

  // Effect to determine active link based on scroll position (only on home page)
  useEffect(() => {
    if (location.pathname !== "/") return; // Only observe sections on the root page

    const sections = navItems
      .filter((i) => i.type === "scroll")
      .map((i) => i.to);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    sections.forEach((sec) => {
      const el = document.querySelector(sec);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect(); // Cleanup observer
  }, [location.pathname]);

  // Effect to set the active state when navigating to a page link
  useEffect(() => {
    if (location.pathname !== "/") {
      const page = navItems.find(
        (i) => i.type === "page" && i.to === location.pathname
      );
      if (page) setActive(page.label.toLowerCase());
    }
  }, [location.pathname]);

  // Effect to handle navbar shrinking/shadow on scroll
  useEffect(() => {
    const handle = () => setShrink(window.scrollY > 20);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Main navigation click handler
  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      // Handle scroll links
      if (location.pathname !== "/") navigate("/"); // Go to home page first
      // Scroll after a slight delay to allow navigation to complete
      setTimeout(() => scrollToSection(item.to), 200);
      setActive(item.to.replace("#", ""));
    } else {
      // Handle page links
      navigate(item.to);
      setActive(item.label.toLowerCase());
    }
    setOpen(false); // Close mobile menu
  };

  // -------------------------------
  // UNDERLINE LOGIC
  // -------------------------------
  const updateUnderline = () => {
    const bar = underlineRef.current;
    const container = navRef.current;
    if (!bar || !container) return;

    const activeItem = navItems.find((i) => getKey(i) === active);

    // Hide underline if the active item is a 'page' link
    if (!activeItem || activeItem.type !== "scroll") {
      bar.style.width = "0px";
      bar.style.opacity = "0";
      return;
    }

    // Calculate position and width for the active 'scroll' link
    const el = itemRefs.current[getKey(activeItem)];
    const cRect = container.getBoundingClientRect(); // Nav container position
    const r = el.getBoundingClientRect(); // Active item position

    bar.style.width = `${r.width}px`;
    // Translate the bar relative to the container's left edge
    bar.style.transform = `translateX(${r.left - cRect.left}px)`;
    bar.style.opacity = "1";
  };

  // Update underline on active state change and window resize
  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [active]);

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-inter ${
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

        {/* DESKTOP NAV & AUTH BUTTONS (md and up) */}
        <div className="hidden md:flex items-center gap-6">
          {/* DESKTOP NAV LINKS */}
          <div className="relative" ref={navRef}>
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

            {/* ACTIVE LINK UNDERLINE */}
            <span
              ref={underlineRef}
              className="absolute bottom-0 left-0 h-[2px] bg-pink-600 rounded-full transition-all duration-300"
              style={{ width: 0, opacity: 0 }}
            />
          </div>

          {/* DESKTOP LOGIN / LOGOUT / DASHBOARD */}
          {!user ? (
            <button
              onClick={() => navigate("/signin")}
              className="px-5 py-2 rounded-full bg-pink-600 text-white font-semibold hover:bg-pink-700 transition shadow-md"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition shadow-sm"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON (less than md) */}
        <motion.button
          className="md:hidden text-3xl text-gray-900 font-bold p-1"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </motion.button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          // Drawer Overlay
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />
            {/* Drawer Content - Compacted for mobile view */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              // --- CHANGES HERE ---
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 rounded-l-3xl px-4 py-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6"> {/* Reduced margin-bottom */}
                <h2 className="text-xl font-bold text-gray-900 tracking-tight"> {/* Slightly smaller title */}
                  Menu
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-3xl font-semibold text-gray-700 hover:text-pink-600 transition"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col gap-3"> {/* Reduced gap between items */}
                {/* Mobile Navigation Links */}
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className={`w-full text-left py-2 px-3 rounded-lg text-base font-semibold tracking-wide transition-all ${
                      active === getKey(item)
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* MOBILE LOGIN / LOGOUT / DASHBOARD */}
                {!user ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/signin");
                    }}
                    className="w-full py-2 rounded-lg text-center bg-pink-600 text-white font-semibold mt-3 hover:bg-pink-700 transition shadow-md"
                  >
                    Login
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full py-2 rounded-lg text-center bg-gray-200 text-gray-900 font-semibold mt-3 hover:bg-gray-300 transition shadow-sm"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full py-2 rounded-lg text-center bg-red-500 text-white font-semibold mt-2 hover:bg-red-600 transition shadow-md"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

