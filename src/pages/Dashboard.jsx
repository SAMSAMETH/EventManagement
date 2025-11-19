import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Package,
  MapPin,
  User,
  IndianRupee,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Search,
  Filter,
  Download
} from "lucide-react";

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
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("event_date", { ascending: false });
    setBookings(data || []);
    await fetchPayments(data || []);
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

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      alert("Failed to cancel booking");
      return;
    }
    alert("Booking cancelled successfully");
    fetchBookings();
  };

  // Filter bookings based on active filter and search
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.event_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           booking.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "active") return matchesSearch && booking.status !== "cancelled";
      if (activeFilter === "cancelled") return matchesSearch && booking.status === "cancelled";
      
      const s = paymentSummary(booking.id, booking.package);
      if (activeFilter === "paid") return matchesSearch && s.remaining <= 0 && booking.status !== "cancelled";
      if (activeFilter === "pending") return matchesSearch && s.remaining > 0 && booking.status !== "cancelled";
      
      return matchesSearch;
    });
  }, [bookings, activeFilter, searchQuery, payments]);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");
    let total = active.length;
    let fullyPaid = 0;
    let pending = 0;

    active.forEach((b) => {
      const s = paymentSummary(b.id, b.package);
      if (s.remaining <= 0) fullyPaid++;
      else pending++;
    });

    return { total, fullyPaid, pending };
  }, [bookings, payments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 rounded-lg bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div className="mt-10">
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600">Manage your events and payments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User-focused Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            description="Active bookings"
            icon={<FileText className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Completed Payments"
            value={stats.fullyPaid}
            description="Fully paid bookings"
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Pending Payments"
            value={stats.pending}
            description="Require attention"
            icon={<Clock className="w-6 h-6" />}
            color="amber"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Bookings" },
                { key: "active", label: "Active" },
                { key: "pending", label: "Pending Payment" },
                { key: "paid", label: "Paid" },
                { key: "cancelled", label: "Cancelled" }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search my bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking) => {
              const s = paymentSummary(booking.id, booking.package);
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  paymentSummary={s}
                  onCancel={cancelBooking}
                />
              );
            })}
          </AnimatePresence>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------- SUB COMPONENTS ---------------------- */

function StatCard({ title, value, description, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border-2 ${colorClasses[color]} transition-all hover:scale-105 cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs opacity-75 mt-2">{description}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]} bg-opacity-50`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function BookingCard({ booking, paymentSummary: s, onCancel }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = (status, remaining) => {
    if (status === "cancelled") {
      return { 
        color: "red", 
        text: "Cancelled", 
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800"
      };
    }
    if (remaining <= 0) {
      return { 
        color: "green", 
        text: "Fully Paid", 
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        textColor: "text-green-800"
      };
    }
    return { 
      color: "amber", 
      text: "Payment Pending", 
      icon: Clock,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800"
    };
  };

  const statusConfig = getStatusConfig(booking.status, s.remaining);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{booking.event_type}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                <statusConfig.icon className="w-3 h-3 mr-1" />
                {statusConfig.text}
              </span>
            </div>
            <p className="text-gray-600">Booking ID: {booking.id}</p>
          </div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <InfoItem icon={User} label="Customer" value={booking.name} />
          <InfoItem icon={Package} label="Package" value={booking.package} />
          <InfoItem icon={Calendar} label="Event Date" value={booking.event_date} />
          <InfoItem icon={MapPin} label="Location" value={booking.location} />
        </div>

        {/* Payment Progress */}
        {booking.status !== "cancelled" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Payment Progress</span>
              <span>₹{s.totalPaid} of ₹{s.totalAmount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(s.totalPaid / s.totalAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {booking.status !== "cancelled" && s.remaining > 0 && (
            <button
              onClick={() => window.location.href = `/payments?amount=${s.remaining}&booking_id=${booking.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pay ₹{s.remaining}
            </button>
          )}
          {booking.status !== "cancelled" && (
            <button
              onClick={() => onCancel(booking.id)}
              className="px-6 py-3 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Summary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                  <div className="space-y-3 bg-white rounded-lg border p-4">
                    <SummaryRow label="Total Amount" value={s.totalAmount} />
                    <SummaryRow label="Total Paid" value={s.totalPaid} status="paid" />
                    {s.remaining > 0 ? (
                      <SummaryRow label="Remaining Balance" value={s.remaining} status="pending" />
                    ) : (
                      <SummaryRow label="Payment Status" value="Completed" status="completed" />
                    )}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Payment History</h4>
                  {s.list.length === 0 ? (
                    <div className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-gray-500 text-sm">No payments recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {s.list.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="font-medium text-gray-900">₹{payment.amount}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(payment.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-4 h-4 text-gray-600" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, status = "default" }) {
  const statusColors = {
    default: "text-gray-900",
    paid: "text-green-600",
    pending: "text-amber-600",
    completed: "text-green-600"
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${statusColors[status]}`}>
        {typeof value === "number" ? `₹${value}` : value}
      </span>
    </div>
  );
}


