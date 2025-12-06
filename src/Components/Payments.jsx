import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IndianRupee, 
  ShieldCheck, 
  Lock, 
  CreditCard,
  Calendar,
  MapPin,
  Package,
  User,
  Loader2,
  ArrowLeft // Added ArrowLeft icon for the back button
} from "lucide-react";

import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";

export default function Payment() {
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingId = query.get("booking_id");
  const amount = Number(query.get("amount"));

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL = "https://event-backend-production.up.railway.app";

  /* ------------------------------------------------------------------
      PROTECT PAGE IF USER NOT LOGGED IN
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!user) navigate("/signin?redirect=/payments");
  }, [user]);

  /* ------------------------------------------------------------------
      FETCH BOOKING DETAILS
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        alert("Invalid booking.");
        navigate("/dashboard");
      } else {
        setBooking(data);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId, user, navigate]);

  /* ------------------------------------------------------------------
      PAYMENT HANDLER
  ------------------------------------------------------------------ */
  const handlePayment = async () => {
    if (!booking) return;

    // Create Razorpay Order
    const orderRes = await fetch(`${backendURL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const orderData = await orderRes.json();

    if (!orderData.id) {
      alert("Unable to create payment order.");
      return;
    }

    // Razorpay Popup
    const rzp = new window.Razorpay({
      key: "rzp_test_RhVbsonQwFSMW5",
      amount: orderData.amount,
      currency: "INR",
      name: "Event Booking",
      description: "Event Payment",
      order_id: orderData.id,

      /* ------------------------------------------------------------------
          IMPORTANT: SAVE PAYMENT IN SUPABASE AFTER SUCCESS
      ------------------------------------------------------------------ */
      handler: async function (response) {
        try {
          const { error } = await supabase
            .from("payments")
            .insert([
              {
                booking_id: bookingId,
                user_id: user.id,
                amount: amount,
                status: "success",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              },
            ]);

          if (error) {
            console.error("Supabase insert error:", error);
            alert("Payment completed but failed to save in database.");
          }

          // Redirect to success page
          window.location.href = "/payment-success";

        } catch (err) {
          console.error("Unexpected error:", err);
          alert("Unexpected error. Payment saved but error occurred.");
        }
      },

      modal: {
        ondismiss: function () {
          window.location.href = "/payment-failed";
        },
      },

      prefill: {
        name: booking.name,
        email: user.email,
        contact: booking.phone,
      },

      theme: { color: "#4f46e5" },
    });

    rzp.open();
  };

  /* ------------------------------------------------------------------
      LOADING
  ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="font-medium">Retrieving booking details...</p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
      UI
  ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
      >
        
        {/* LEFT COLUMN: Booking Summary (Invoice Style) */}
        <div className="md:col-span-7 bg-white p-8 md:p-10 border-r border-gray-100">
          {/* ADDED: Back button inside the card header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
          </div>

          <div className="space-y-6">
            <SummaryItem icon={User} label="Customer Name" value={booking.name} />
            <SummaryItem icon={Package} label="Package Selected" value={booking.package} highlight />
            <SummaryItem icon={Calendar} label="Event Date" value={booking.event_date} />
            <SummaryItem icon={MapPin} label="Location" value={booking.location} />
            
            <div className="pt-6 border-t border-gray-100 mt-6">
               <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                 <span>Service Fee</span>
                 <span>₹0.00</span>
               </div>
               <div className="flex justify-between items-center text-sm text-gray-500">
                 <span>Taxes</span>
                 <span>Included</span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Action */}
        <div className="md:col-span-5 bg-gray-50/50 p-8 md:p-10 flex flex-col justify-center relative">
          
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Payable Amount</p>
            <div className="text-5xl font-extrabold text-gray-900 flex items-center justify-center tracking-tight">
              <span className="text-3xl text-gray-400 mr-1">₹</span>
              {amount.toLocaleString()}
            </div>
          </div>

          <motion.button
            onClick={handlePayment}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Pay Securely
          </motion.button>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Bank Level Security</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
                <Lock className="w-4 h-4 text-green-600" />
                <span>256-bit SSL Encrypted</span>
             </div>
          </div>
          
          <p className="text-xs text-center text-gray-400 mt-6">
            Powered by Razorpay. Your payment details are processed securely.
          </p>

        </div>

      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------
   SUB COMPONENT: Styled Row
------------------------------------------------------------------ */
function SummaryItem({ label, value, icon: Icon, highlight = false }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1 ${highlight ? "text-blue-600" : "text-gray-400"}`}>
        <Icon className="w-5 h-5" />
        </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-base font-medium ${highlight ? "text-blue-700" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
