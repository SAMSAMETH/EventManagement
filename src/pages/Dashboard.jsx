// Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Package, MapPin, User, IndianRupee } from "lucide-react";

const PACKAGE_PRICES = {
  Standard: 5000,
  Premium: 10000,
  Royal: 15000,
};

export default function Dashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("event_date", { ascending: false });

    if (!error && data) {
      setBookings(data);
      await fetchPayments(data);
    } else {
      setBookings([]);
      setPayments([]);
    }

    setLoading(false);
  };

  const fetchPayments = async (bookingList) => {
    if (!bookingList.length) {
      setPayments([]);
      return;
    }

    const ids = bookingList.map((b) => b.id);

    const { data } = await supabase
      .from("payments")
      .select("*")
      .in("booking_id", ids)
      .order("created_at", { ascending: true });

    setPayments(data || []);
  };

  const paymentSummary = (bookingId, pkg) => {
    const list = payments.filter((p) => p.booking_id === bookingId);

    const totalPaid = list.reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = PACKAGE_PRICES[pkg];
    const remaining = totalAmount - totalPaid;

    return { list, totalPaid, totalAmount, remaining };
  };

  const stats = useMemo(() => {
    let total = bookings.length;
    let fullyPaid = 0;
    let pending = 0;

    bookings.forEach((b) => {
      const s = paymentSummary(b.id, b.package);
      if (s.remaining <= 0) fullyPaid++;
      else pending++;
    });

    return { total, fullyPaid, pending };
  }, [bookings, payments]);

  // Cancel Booking
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) return alert("Failed to cancel booking");

    alert("Booking cancelled successfully");
    fetchBookings();
  };

  const statusTag = (remaining) =>
    remaining <= 0 ? (
      <span className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-sm flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        Fully Paid
      </span>
    ) : (
      <span className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        Partially Paid
      </span>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 pt-4 pb-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Back Button - Fixed spacing */}
        <div className="mb-8 pt-10"> {/* Added pt-4 for top padding */}
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 text-slate-700 hover:text-indigo-600"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent text overflow */}
              <h1 className="text-sm text-slate-600 mt-3 break-words">
                Manage your bookings and payments
              </h1>
              
            </div>
          </div>

          {/* Quick Stats - Mobile First with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-600">Total Bookings</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                  <IndianRupee className="w-4 h-4" /> {/* Changed to IndianRupee icon */}
                </div>
                <span className="text-sm font-medium text-slate-600">Fully Paid</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats.fullyPaid}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-600">Pending</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
            </motion.div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 text-center shadow-lg"
            >
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 text-center shadow-lg"
            >
              <div className="max-w-sm mx-auto">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No bookings found</h3>
                <p className="text-slate-500 text-sm mb-6">Your event bookings will appear here once you make a reservation.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = "/book-demo"}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Demo
                </motion.button>
              </div>
            </motion.div>
          ) : (
            bookings.map((booking) => {
              const s = paymentSummary(booking.id, booking.package);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* LEFT - Booking Details */}
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                          <div className="min-w-0 flex-1"> {/* Added min-w-0 and flex-1 */}
                            <h3 className="text-xl font-bold text-slate-800 mb-2 break-words">
                              {booking.event_type}
                            </h3>
                            {/* Removed ID display as requested */}
                          </div>
                          <div className="flex-shrink-0"> {/* Prevent status tag from shrinking */}
                            {statusTag(s.remaining)}
                          </div>
                        </div>

                        {/* Booking Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <User className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Customer</p>
                              <p className="font-semibold text-slate-800 truncate">{booking.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Package className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Package</p>
                              <p className="font-semibold text-slate-800 truncate">
                                {booking.package} (<IndianRupee className="inline w-3 h-3" />{s.totalAmount})
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Event Date</p>
                              <p className="font-semibold text-slate-800">{booking.event_date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <MapPin className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">Location</p>
                              <p className="font-semibold text-slate-800 truncate">{booking.location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="font-semibold text-slate-800 mb-3">Payment Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Total Amount:</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {s.totalAmount}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600">Total Paid:</span>
                              <span className="font-bold text-emerald-600 flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {s.totalPaid}
                              </span>
                            </div>
                            {s.remaining > 0 ? (
                              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-sm font-semibold text-slate-700">Remaining Balance:</span>
                                <span className="font-bold text-amber-600 flex items-center gap-1">
                                  <IndianRupee className="w-3 h-3" />
                                  {s.remaining}
                                </span>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                <span className="text-sm font-semibold text-slate-700">Status:</span>
                                <span className="font-bold text-emerald-600">Payment Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT - Actions & History */}
                      <div className="w-full lg:w-80 flex flex-col gap-4">
                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {s.remaining > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                (window.location.href = `/payments?amount=${s.remaining}&booking_id=${booking.id}`)
                              }
                              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <IndianRupee className="w-4 h-4" />
                              Pay Remaining {s.remaining}
                            </motion.button>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => cancelBooking(booking.id)}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Cancel Booking
                          </motion.button>
                        </div>

                        {/* Payment History */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            Payment History
                          </h4>

                          {s.list.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-4">No payments recorded yet</p>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {s.list.map((p) => (
                                <div key={p.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                                      <IndianRupee className="w-3 h-3" />
                                      {p.amount}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    {new Date(p.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
