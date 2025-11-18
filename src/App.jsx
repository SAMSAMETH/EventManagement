// App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

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

export default function App() {
  return (
    <div>
      <Navbar />
{/* Floating Book Demo Button */}
<a
  href="/book-demo"
  className="
    fixed z-30
    bottom-4 right-4       /* Mobile position */
    sm:bottom-6 sm:right-8 /* Desktop position */

    bg-gradient-to-r from-pink-600 to-purple-600 
    text-white shadow-xl rounded-full
    flex items-center justify-center

    px-5 py-2.5 text-sm font-semibold   /* Mobile size */
    sm:px-7 sm:py-3 sm:text-base        /* Desktop size */

    hover:scale-105 active:scale-95 transition-all
  "
>
  Book Demo
</a>


      <main>
        <Routes>
          {/* Main Home Page */}
          <Route
            path="/"
            element={
              <>
                <section id="home"><HomePage /></section>
                <section id="about"><About /></section>
                <section id="services"><Services /></section>
                <section id="gallery"><Gallery /></section>
                <section id="package"><Packages /></section>
                <section id="testimonials"><Testimonial /></section>
                <section id="contact"><Contact /></section>
              </>
            }
          />

          {/* Book Demo separate page */}
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path ="/packages" element={<Packages />}/>
          <Route path="/payments" element={<Payment />}/>   
          <Route path="/event-booking" element={<EventBooking />} />    
           </Routes>
      </main>
    </div>
  );
}

