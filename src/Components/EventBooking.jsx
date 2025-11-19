import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  IndianRupee,
  Gift,
  ArrowLeft
} from "lucide-react";

import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";

const PACKAGE_AMOUNTS = {
  Standard: 5000,
  Premium: 10000,
  Royal: 15000
};

export default function EventBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    eventType: "",
    eventDate: "",
    packageType: "",
    paymentType: "",
    amount: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SAVE BOOKING + INITIAL PAYMENT
  const saveBookingAndPayment = async () => {
    if (!form.packageType) return alert("Please select a package");
    if (!form.paymentType) return alert("Please select payment type");
    if (!form.eventType || !form.name || !form.phone || !form.location)
      return alert("Please fill all fields");
    if (!form.amount || form.amount <= 0)
      return alert("Enter a valid payment amount");

    const fullPrice = PACKAGE_AMOUNTS[form.packageType];

    if (form.paymentType === "full" && Number(form.amount) !== fullPrice)
      return alert(`Full payment must be ₹${fullPrice}`);

    if (form.paymentType === "advance" && Number(form.amount) >= fullPrice)
      return alert("Advance cannot be equal or greater than full price");

    // 1️⃣ Create booking
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user?.id,
          name: form.name,
          phone: form.phone,
          location: form.location,
          event_type: form.eventType,
          event_date: form.eventDate,
          package: form.packageType
        }
      ])
      .select()
      .single();

    if (bookingErr) {
      console.error(bookingErr);
      alert("Booking could not be saved!");
      return null;
    }

    const bookingId = booking.id;

    // 2️⃣ Insert FIRST PAYMENT
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        booking_id: bookingId,
        amount: Number(form.amount),
        user_id: user.id
      }
    ]);

    if (paymentError) {
      console.error(paymentError);
      alert("Initial payment could not be saved!");
      return null;
    }

    return bookingId;
  };

  const handleSubmit = async () => {
    const bookingId = await saveBookingAndPayment();
    if (!bookingId) return;

    navigate(`/payments?booking_id=${bookingId}&amount=${form.amount}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl p-7 rounded-3xl shadow-xl border border-pink-200 relative"
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/80 rounded-xl border shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Event <span className="text-pink-600">Booking</span>
        </h2>

        <div className="space-y-5">
          <InputField
            icon={<User size={18} className="text-pink-600" />}
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />

          <InputField
            icon={<Phone size={18} className="text-pink-600" />}
            name="phone"
            label="Phone Number"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <InputField
            icon={<MapPin size={18} className="text-pink-600" />}
            name="location"
            label="Location"
            value={form.location}
            onChange={handleChange}
            placeholder="Event location"
          />

          {/* Event Type */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Event Type</label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="">Select Event Type</option>
              <option>Marriage</option>
              <option>Reception</option>
              <option>Engagement</option>
              <option>Baby Shower</option>
              <option>Birthday</option>
              <option>Corporate Event</option>
              <option>Other</option>
            </select>
          </div>

          {/* Package */}
          <PackageSelector
            form={form}
            setForm={setForm}
            PACKAGE_AMOUNTS={PACKAGE_AMOUNTS}
          />

          {/* Date */}
          <InputField
            icon={<Calendar size={18} className="text-pink-600" />}
            type="date"
            name="eventDate"
            label="Event Date"
            value={form.eventDate}
            onChange={handleChange}
          />

          {/* Payment Type */}
          <PaymentTypeSelector form={form} setForm={setForm} />

          {form.paymentType && (
            <InputField
              icon={<IndianRupee size={18} className="text-pink-600" />}
              name="amount"
              type="number"
              label="Amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl mt-4"
          >
            Proceed to Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({ icon, label, ...props }) {
  return (
    <div>
      <label className="font-semibold text-gray-800 flex items-center gap-2 mb-2 text-sm">
        {icon} {label}
      </label>
      <input
        {...props}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-pink-400 outline-none"
      />
    </div>
  );
}

function PackageSelector({ form, setForm, PACKAGE_AMOUNTS }) {
  return (
    <div>
      <label className="font-semibold text-gray-800 mb-2 block text-sm">
        Package
      </label>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(PACKAGE_AMOUNTS).map(([pkg, price]) => (
          <button
            key={pkg}
            onClick={() => setForm({ ...form, packageType: pkg })}
            className={`p-3 rounded-xl text-center border ${
              form.packageType === pkg
                ? "bg-pink-600 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            {pkg}
            <div className="text-xs mt-1">₹{price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PaymentTypeSelector({ form, setForm }) {
  return (
    <div>
      <label className="font-semibold text-gray-800 mb-2 block text-sm">
        Payment Type
      </label>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setForm({ ...form, paymentType: "advance" })}
          className={`p-3 rounded-xl border ${
            form.paymentType === "advance"
              ? "bg-pink-600 text-white"
              : "bg-white"
          }`}
        >
          Advance
        </button>

        <button
          onClick={() => setForm({ ...form, paymentType: "full" })}
          className={`p-3 rounded-xl border ${
            form.paymentType === "full"
              ? "bg-pink-600 text-white"
              : "bg-white"
          }`}
        >
          Full Payment
        </button>
      </div>
    </div>
  );
}

