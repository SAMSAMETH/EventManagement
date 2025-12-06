import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  IndianRupee,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";

const PACKAGE_AMOUNTS = {
  Standard: 5000,
  Premium: 10000,
  Royal: 15000,
};

export default function EventBooking() {
  const navigate = useNavigate();
  const { user, setRedirectPath } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    eventType: "",
    eventDate: "",
    packageType: "",
    paymentType: "",
    amount: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ------------------------------------
      IF USER NOT LOGGED IN
  -------------------------------------- */
  useEffect(() => {
    if (!user) {
      setRedirectPath("/event-booking");
    }
  }, [user, setRedirectPath]);

  const formDisabled = !user;

  /* ------------------------------------
      SAVE BOOKING (WITHOUT PAYMENT INSERT)
  -------------------------------------- */
  const saveBooking = async () => {
    if (formDisabled) return alert("Please login to continue");

    const fullAmount = PACKAGE_AMOUNTS[form.packageType];

    if (!form.paymentType) return alert("Select payment type");
    if (!form.packageType) return alert("Select a package");
    if (!form.name || !form.phone || !form.location)
      return alert("Please fill all fields");
    if (!form.amount || form.amount <= 0)
      return alert("Enter a valid amount");

    if (form.paymentType === "full" && Number(form.amount) !== fullAmount) {
      return alert(`Full payment must be ₹${fullAmount}`);
    }

    if (form.paymentType === "advance" && Number(form.amount) >= fullAmount) {
      return alert("Advance must be less than full amount");
    }

    // Insert ONLY the booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          name: form.name,
          phone: form.phone,
          location: form.location,
          event_type: form.eventType,
          event_date: form.eventDate,
          package: form.packageType,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return alert("Booking failed");
    }

    return booking.id;
  };

  const handleSubmit = async () => {
    if (formDisabled) return;

    const bookingId = await saveBooking();
    if (!bookingId) return;

    // Now go to Razorpay payment page
    navigate(`/payments?booking_id=${bookingId}&amount=${form.amount}`);
  };

  /* ------------------------------------
      UI
  -------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* SaaS Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-200/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 relative z-10 overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-white/50 border-b border-gray-100 p-6 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Event Booking
            </h2>
            <p className="text-sm text-gray-500">Complete the details to reserve your date</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Auth Warning */}
          {!user && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-red-50/80 border border-red-100 p-5 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
            >
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  Authentication Required
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  You must be logged in to book an event.
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/signin")}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h3>
                <FormInput
                  disabled={formDisabled}
                  label="Full Name"
                  name="name"
                  icon={User}
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <FormInput
                  disabled={formDisabled}
                  label="Phone Number"
                  name="phone"
                  icon={Phone}
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
                <FormInput
                  disabled={formDisabled}
                  label="Location"
                  name="location"
                  icon={MapPin}
                  placeholder="City, Venue or Address"
                  value={form.location}
                  onChange={handleChange}
                />
            </div>

            <div className="space-y-6">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Event Details</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Event Type</label>
                  <select
                    disabled={formDisabled}
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none disabled:opacity-60 text-sm"
                  >
                    <option value="">Select Type</option>
                    <option>Marriage</option>
                    <option>Reception</option>
                    <option>Birthday</option>
                    <option>Corporate Event</option>
                    <option>Other</option>
                  </select>
                </div>

                <FormInput
                  disabled={formDisabled}
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  icon={Calendar}
                  value={form.eventDate}
                  onChange={handleChange}
                />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Package Selection</h3>
             <PackageSelector
              form={form}
              setForm={setForm}
              disabled={formDisabled}
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Preference</h3>
             <PaymentTypeSelector
                form={form}
                setForm={setForm}
                disabled={formDisabled}
              />

              {form.paymentType && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                 >
                    <FormInput
                      disabled={formDisabled}
                      label="Payment Amount (₹)"
                      name="amount"
                      type="number"
                      icon={IndianRupee}
                      placeholder="Enter amount"
                      value={form.amount}
                      onChange={handleChange}
                    />
                 </motion.div>
              )}
          </div>

        </div>

        {/* Footer / Submit Action */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
           <button
            disabled={formDisabled}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-xl font-semibold shadow-lg transform transition-all active:scale-[0.98] ${
              formDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white hover:shadow-xl"
            }`}
          >
            {formDisabled ? "Login Required" : (
              <span className="flex items-center justify-center gap-2">
                 Proceed to Checkout <ArrowLeft className="w-4 h-4 rotate-180" />
              </span>
            )}
          </button>
        </div>

      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------
   SUB COMPONENTS (Professional Styling)
------------------------------------------------------------ */

function FormInput({ label, icon: Icon, disabled, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-pink-600 transition-colors" />
        <input
          {...props}
          disabled={disabled}
          className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

function PackageSelector({ form, setForm, disabled }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(PACKAGE_AMOUNTS).map(([pkg, price]) => {
        const isSelected = form.packageType === pkg;
        return (
          <button
            key={pkg}
            disabled={disabled}
            onClick={() => setForm({ ...form, packageType: pkg })}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${disabled ? "opacity-60 cursor-not-allowed" : "hover:border-pink-200 cursor-pointer"}
              ${isSelected 
                ? "bg-pink-50 border-pink-500 shadow-md ring-1 ring-pink-500" 
                : "bg-white border-gray-100 hover:shadow-md"
              }
            `}
          >
            {isSelected && <div className="absolute top-3 right-3 text-pink-600"><CheckCircle2 className="w-4 h-4"/></div>}
            <div className={`text-sm font-bold ${isSelected ? "text-pink-900" : "text-gray-900"}`}>{pkg}</div>
            <div className={`text-xs mt-1 font-medium ${isSelected ? "text-pink-700" : "text-gray-500"}`}>₹{price.toLocaleString()}</div>
          </button>
        );
      })}
    </div>
  );
}

function PaymentTypeSelector({ form, setForm, disabled }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['advance', 'full'].map((type) => {
         const isSelected = form.paymentType === type;
         return (
          <button
            key={type}
            disabled={disabled}
            onClick={() => setForm({ ...form, paymentType: type })}
            className={`
              p-4 rounded-xl border text-center transition-all duration-200 font-medium text-sm
              ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}
              ${isSelected 
                ? "bg-gray-900 text-white border-gray-900 shadow-lg" 
                : "bg-white text-gray-600 border-gray-200"
              }
            `}
          >
            {type === 'advance' ? "Advance Payment" : "Full Payment"}
          </button>
         )
      })}
    </div>
  );
}
