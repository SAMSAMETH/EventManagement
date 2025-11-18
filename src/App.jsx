// App.jsx
// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import HomePage from "./Components/HomePage";
import About from "./Components/About";
import Services from "./Components/Services";
import Gallery from "./Components/Gallery";
import Packages from "./Components/Packages";
import Testimonial from "./Components/Testimonial";
import Contact from "./Components/Contact";
import BookDemo from "./Components/BookDemo";
import Payment from "./Components/Payments";
import EventBooking from "./Components/EventBooking";

/* AUTH PAGES */
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Auth/ProtectedRoute";

export default function App() {
  return (
      <div className="relative">

        {/* NAVBAR */}
        <Navbar />

        {/* Floating Book Demo Button */}
        <a
          href="/book-demo"
          className="
            fixed z-30
            bottom-4 right-4
            sm:bottom-6 sm:right-8
            bg-gradient-to-r from-pink-600 to-purple-600
            text-white shadow-xl rounded-full
            flex items-center justify-center
            px-5 py-2.5 text-sm font-semibold
            sm:px-7 sm:py-3 sm:text-base
            hover:scale-105 active:scale-95 transition-all
          "
        >
          Book Demo
        </a>

        {/* ROUTES */}
       <main className="pt-4 sm:pt-6">


          <Routes>
            {/* HOME PAGE WITH ALL SECTIONS */}
            <Route
              path="/"
              element={
                <>
                  <section id="home" className="scroll-mt-20">
                    <HomePage />
                  </section>

                  <section id="about" className="scroll-mt-20">
                    <About />
                  </section>

                  <section id="services" className="scroll-mt-20">
                    <Services />
                  </section>

                  <section id="gallery" className="scroll-mt-20">
                    <Gallery />
                  </section>

                  <section id="package" className="scroll-mt-20">
                    <Packages />
                  </section>

                  <section id="testimonials" className="scroll-mt-20">
                    <Testimonial />
                  </section>

                  <section id="contact" className="scroll-mt-20">
                    <Contact />
                  </section>
                </>
              }
            />

            {/* EVENT BOOKING SYSTEM PAGES */}
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/event-booking" element={<EventBooking />} />

            {/* AUTH PAGES */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            {/* PROTECTED ROUTE EXAMPLE */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>

        </main>
      </div>
  );
}
