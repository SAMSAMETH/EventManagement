import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import {
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

// The navigation items list remains the same
const navItems = [
  { label: "Home", to: "#home", type: "scroll" },
  { label: "About", to: "#about", type: "scroll" },
  { label: "Services", to: "#services", type: "scroll" },
  { label: "Gallery", to: "#gallery", type: "scroll" },
  { label: "Package", to: "#package", type: "scroll" },
  { label: "Event Booking", to: "/event-booking", type: "page" },
  { label: "Book Demo", to: "/book-demo", type: "page" },
  { label: "Contact", to: "#contact", type: "scroll" },
];

const getKey = (item) =>
  item.type === "page" ? item.label.toLowerCase() : item.to.replace("#", "");

export default function Navbar() {
  const [open, setOpen] = useState(false); // Mobile menu open
  const [active, setActive] = useState("home");
  const [shrink, setShrink] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef(null);
  const itemRefs = useRef({});
  const underlineRef = useRef(null);
  const userMenuRef = useRef(null);

  /* --- SHRINK EFFECT --- */
  useEffect(() => {
    // Ensuring padding is applied to body for fixed navbar
    document.body.style.paddingTop = "60px"; 
    const onScroll = () => setShrink(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- LOAD USER SESSION --- */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_ev, session) => setUser(session?.user || null)
    );
    return () => listener?.subscription?.unsubscribe();
  }, []);

  /* --- CLOSE USER MENU ON CLICK OUTSIDE (DESKTOP) --- */
  useEffect(() => {
    const close = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false); // Close mobile menu
    setUserMenuOpen(false); // Close desktop user menu
    navigate("/");
  };

  /* --- NAVIGATION LOGIC --- */
  const scrollToSection = (id) => {
    const sec = document.querySelector(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      if (location.pathname !== "/") navigate("/");
      // Use requestAnimationFrame for better cross-browser compatibility
      requestAnimationFrame(() => {
        setTimeout(() => scrollToSection(item.to), 180);
      });
    } else {
      navigate(item.to);
    }
    setActive(getKey(item));
    setOpen(false); // Close mobile menu after click
  };

  /* --- DESKTOP UNDERLINE LOGIC --- */
  const updateUnderline = () => {
    const bar = underlineRef.current;
    const container = navRef.current;

    if (!bar || !container) return;

    const activeItem = navItems.find((i) => getKey(i) === active);

    // Only show underline for 'scroll' type links
    if (!activeItem || activeItem.type !== "scroll") {
      bar.style.width = "0px";
      bar.style.opacity = "0";
      return;
    }

    const el = itemRefs.current[getKey(activeItem)];
    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();

    bar.style.width = `${r.width}px`;
    bar.style.transform = `translateX(${r.left - cRect.left}px)`;
    bar.style.opacity = "1";
  };

  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    // Recalculate underline when path changes to handle page navigation
    const pathKey = navItems.find(i => i.to === location.pathname)?.label.toLowerCase();
    if (pathKey) {
      setActive(pathKey);
    } else if (location.pathname === "/") {
      // Default to home on root if not explicitly active
      setActive("home");
    } else {
      // Hide underline on non-navigated pages (like /admin or /dashboard)
      setActive("none");
    }
    return () => window.removeEventListener("resize", updateUnderline);
  }, [active, location.pathname]);


  /* ===========================================================
                      RENDER NAVBAR
  ============================================================ */

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        shrink
          ? "py-2 bg-white shadow-lg border-b border-gray-200"
          : "py-4 bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-[60px]">
        {/* LOGO */}
        <h1
          onClick={() => handleNavClick({ to: "#home", type: "scroll" })}
          className="cursor-pointer text-2xl font-bold text-gray-900"
        >
          Zecardia<span className="text-pink-600">.</span>Events
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6">
          <div ref={navRef} className="relative">
            <ul className="flex gap-6 font-semibold text-gray-600">
              {navItems.map((item) => {
                const key = getKey(item);
                return (
                  <button
                    key={item.label}
                    ref={(el) => (itemRefs.current[key] = el)}
                    onClick={() => handleNavClick(item)}
                    className={`uppercase text-sm transition font-medium ${
                      active === key
                        ? "text-pink-600"
                        : "hover:text-pink-500"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </ul>

            {/* Underline */}
            <span
              ref={underlineRef}
              className="absolute bottom-[-10px] left-0 h-[2px] bg-pink-600 rounded-full transition-all duration-300 ease-out"
            />
          </div>

          {/* ADMIN BUTTON (Desktop) */}
          {user?.app_metadata?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 text-sm"
            >
              Admin Panel
            </button>
          )}

          {/* LOGIN / DROPDOWN (Desktop) */}
          {!user ? (
            <button
              onClick={() => navigate("/signin")}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 text-sm"
            >
              Log In
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    userMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left flex gap-3 items-center text-gray-700 hover:bg-pink-50 transition"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </button>

                    {user?.app_metadata?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left flex gap-3 items-center text-purple-600 hover:bg-purple-50 transition"
                      >
                        <Settings size={16} /> Admin Panel
                      </button>
                    )}

                    <div className="border-t border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 flex gap-3 items-center hover:bg-red-50 transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-2xl lg:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <X />
                </button>
              </div>

              {/* NAV LINKS */}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="w-full py-3 px-4 rounded-xl text-left hover:bg-pink-50 hover:text-pink-600 font-medium transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="border-t my-4" />

              {/* USER ACTIONS (Mobile) - RECTIFIED */}
              <div className="flex flex-col gap-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setOpen(false);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gray-50 text-gray-700 font-semibold flex gap-3 items-center hover:bg-gray-100 transition"
                    >
                      <LayoutDashboard size={20} /> Dashboard
                    </button>

                    {user?.app_metadata?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setOpen(false);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-purple-50 text-purple-700 font-semibold flex gap-3 items-center hover:bg-purple-100 transition"
                      >
                        <Settings size={20} /> Admin Panel
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full py-3 px-4 rounded-xl text-red-600 font-semibold flex gap-3 items-center hover:bg-red-50 transition"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setOpen(false);
                    }}
                    className="w-full py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}