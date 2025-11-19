import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  User,
  MapPin,
  Phone,
  Shield,
  CheckCircle,
  Lock,
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
  const [selectedMethod, setSelectedMethod] = useState("card");

  // Fetch booking details
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
        alert("Booking not found!");
        navigate("/dashboard");
      } else {
        setBooking(data);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId, user, navigate]);

  // Save payment in Supabase
const handlePayment = async () => {
  // 1. Create Razorpay order from backend (serverless or supabase function)
  const { data: orderData, error: orderError } = await supabase.functions.invoke("create-order", {
    body: { amount: amount * 100 }
  });

  if (orderError) {
    alert("Failed to create order");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: orderData.amount,
    currency: "INR",
    name: "Event Booking",
    description: "Event Payment",
    order_id: orderData.id,

    handler: async function (response) {
      // SUCCESSFUL PAYMENT CALLBACK
      const { razorpay_payment_id, razorpay_order_id } = response;

      const { error } = await supabase.from("payments").insert([
        {
          booking_id: bookingId,
          amount,
          user_id: user.id,
          razorpay_payment_id,
          razorpay_order_id,
          status: "success"
        }
      ]);

      if (!error) {
        alert("Payment Successful!");
        navigate("/dashboard");
      } else {
        alert("Payment could not be saved!");
      }
    },

    prefill: {
      name: booking.name,
      contact: booking.phone
    },

    theme: { color: "#4f46e5" }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "upi", name: "UPI Payment", icon: "📱" },
    { id: "netbanking", name: "Net Banking", icon: "🏦" },
    { id: "wallet", name: "Digital Wallet", icon: "👛" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading payment details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-7">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-3"
          >
            Complete Your Payment
          </motion.h1>
          <p className="text-gray-600 text-lg">
            Secure payment processed with bank-level encryption
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Booking Summary
              </h3>

              <div className="space-y-4">
                {/* Customer */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium text-gray-900">
                    {booking.name}
                  </span>
                </div>

                {/* Event Type */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Event</span>
                  <span className="font-medium text-gray-900">
                    {booking.event_type}
                  </span>
                </div>

                {/* Event Date */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium text-gray-900">
                    {booking.event_date}
                  </span>
                </div>

                {/* Location */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">
                    {booking.location}
                  </span>
                </div>

                {/* Package */}
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Package</span>
                  <span className="font-medium text-gray-900">
                    {booking.package}
                  </span>
                </div>

                {/* Amount */}
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Amount to Pay
                    </span>
                    <div className="text-2xl font-bold text-blue-700 flex items-center">
                      <IndianRupee className="w-6 h-6" />
                      {amount}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center gap-4 text-center">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">256-bit SSL encryption</p>
                </div>
                <Lock className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="hidden"
                    />
                    <span className="text-xl mr-3">{method.icon}</span>
                    <span className="font-medium text-gray-900">
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
              >
                <Lock className="w-5 h-5 inline mr-2" />
                Pay ₹{amount} Securely
              </motion.button>

              <p className="text-center text-gray-600 text-sm mt-4">
                Your payment is secure & encrypted
              </p>
            </div>

            {/* Support Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 Call: +91 1800-123-4567</p>
                <p>💬 Live chat 24/7</p>
                <p>📧 Email: support@company.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl"
              >
                Back
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl"
              >
                Cancel Payment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
