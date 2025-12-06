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
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Search,
  Download,
} from "lucide-react";

// ---------------------------------------------------------
// CONSTANTS & UTILS
// ---------------------------------------------------------
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

  // CUSTOM CANCEL POPUP STATE
  const [cancelModal, setCancelModal] = useState({
    open: false,
    booking: null,
  });

  /* ---------------------------------------------------------
      FETCH BOOKINGS
  --------------------------------------------------------- */
  useEffect(() => {
    if (!user?.id) return;
    fetchBookings();
  }, [user?.id]);

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
    const totalAmount = PACKAGE_PRICES[pkg] || 0; // Safety fallback
    const remaining = Math.max(0, totalAmount - totalPaid);

    return { list, totalPaid, totalAmount, remaining };
  };

  const confirmCancel = async (id) => {
    setCancelModal({ open: false, booking: null });

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      alert("Failed to cancel booking");
      return;
    }

    fetchBookings();
  };

  /* ---------------------------------------------------------
      FILTERS & STATS
  --------------------------------------------------------- */
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        booking.event_type?.toLowerCase().includes(q) ||
        booking.name?.toLowerCase().includes(q);

      const s = paymentSummary(booking.id, booking.package);

      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "active")
        return matchesSearch && booking.status !== "cancelled";
      if (activeFilter === "cancelled")
        return matchesSearch && booking.status === "cancelled";
      if (activeFilter === "pending")
        return matchesSearch && s.remaining > 0 && booking.status !== "cancelled";
      if (activeFilter === "paid")
        return matchesSearch && s.remaining <= 0 && booking.status !== "cancelled";

      return matchesSearch;
    });
  }, [bookings, payments, activeFilter, searchQuery]);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "cancelled");

    return {
      total: active.length,
      fullyPaid: active.filter(
        (b) => paymentSummary(b.id, b.package).remaining <= 0
      ).length,
      pending: active.filter(
        (b) => paymentSummary(b.id, b.package).remaining > 0
      ).length,
    };
  }, [bookings, payments]);

  /* ---------------------------------------------------------
      LOADING UI
  --------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
      MAIN UI
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 backdrop-blur-xl bg-white/80 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 leading-none">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Overview of your events and financial status
              </p>
            </div>
          </div>
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Section */}
        <StatsRow stats={stats} />

        {/* Content Section */}
        <div className="space-y-4">
          <Controls
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  paymentSummary={paymentSummary(booking.id, booking.package)}
                  onCancel={() =>
                    setCancelModal({ open: true, booking })
                  }
                />
              ))}
            </AnimatePresence>

            {filteredBookings.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-xl"
              >
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs text-center">
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <CancelModal
        cancelModal={cancelModal}
        setCancelModal={setCancelModal}
        confirmCancel={confirmCancel}
      />
    </div>
  );
}

/* ---------------------------------------------------------
    SUB-COMPONENTS
--------------------------------------------------------- */

function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Active Events"
        value={stats.total}
        icon={FileText}
        trend="neutral"
      />
      <StatCard
        label="Fully Paid"
        value={stats.fullyPaid}
        icon={CheckCircle2}
        trend="positive"
      />
      <StatCard
        label="Pending Payment"
        value={stats.pending}
        icon={Clock}
        trend="warning"
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend }) {
  const styles = {
    neutral: "text-blue-600 bg-blue-50",
    positive: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${styles[trend]}`}>
        <Icon className="w-5 h-5" />
       
      </div>
    </motion.div>
  );
}

function Controls({ activeFilter, setActiveFilter, searchQuery, setSearchQuery }) {
  const filters = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "paid", label: "Paid" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-1 sm:p-2 sm:rounded-lg sm:border sm:border-gray-200">
      {/* Mobile Scrollable Tabs */}
      <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg w-max sm:w-auto sm:bg-transparent sm:p-0">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeFilter === f.key
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200 sm:bg-gray-900 sm:text-white sm:border-transparent"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search events..."
          className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function BookingCard({ booking, paymentSummary: s, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  const isCancelled = booking.status === "cancelled";
  const isPaid = s.remaining <= 0;

  // SAFE ID CONVERSION: Prevents .slice error if id is a number
  const displayId = String(booking.id).slice(0, 8);

  const statusConfig = isCancelled
    ? { color: "bg-red-50 text-red-700 border-red-100", text: "Cancelled", icon: XCircle }
    : isPaid
    ? { color: "bg-emerald-50 text-emerald-700 border-emerald-100", text: "Paid", icon: CheckCircle2 }
    : { color: "bg-amber-50 text-amber-700 border-amber-100", text: "Pending", icon: Clock };

  const StatusIcon = statusConfig.icon;
  const progressPercent = s.totalAmount > 0 ? Math.min((s.totalPaid / s.totalAmount) * 100, 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden group hover:border-blue-300 transition-colors"
    >
      {/* Card Header (Always Visible) */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.text}
              </span>
              <span className="text-xs text-gray-400 font-mono">#{displayId}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{booking.event_type}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <User className="w-4 h-4 text-gray-400" />
              <span>{booking.name}</span>
            </div>
          </div>

          {/* Desktop: Quick Actions */}
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {!isCancelled && s.remaining > 0 && (
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/payments?amount=${s.remaining}&booking_id=${booking.id}`;
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Pay ₹{s.remaining.toLocaleString()}
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
                <span className="text-sm font-medium">{expanded ? "Hide Details" : "Details"}</span> 
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 mt-6 pt-6 border-t border-gray-100">
          <DetailItem icon={Calendar} label="Date" value={new Date(booking.event_date).toLocaleDateString()} />
          <DetailItem icon={Package} label="Package" value={booking.package} />
          <DetailItem icon={MapPin} label="Location" value={booking.location} />
          
          <div className="col-span-2 lg:col-span-1">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                <span>Payment</span>
                <span className={isPaid ? "text-emerald-600" : "text-gray-900"}>
                    {Math.round(progressPercent)}%
                </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                    style={{ width: `${progressPercent}%` }} 
                />
            </div>
            <div className="flex justify-between text-xs mt-1.5 text-gray-400">
                <span>₹{s.totalPaid.toLocaleString()}</span>
                <span>₹{s.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50/50 border-t border-gray-200"
          >
            <div className="p-5 sm:p-6 grid md:grid-cols-2 gap-8">
              {/* Financial Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                  Financial Breakdown
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                  <div className="flex justify-between p-3 text-sm">
                    <span className="text-gray-600">Total Package Cost</span>
                    <span className="font-medium text-gray-900">₹{s.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 text-sm bg-emerald-50/30">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-emerald-700">- ₹{s.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 text-sm font-medium">
                    <span className="text-gray-900">Outstanding Balance</span>
                    <span className={s.remaining > 0 ? "text-amber-600" : "text-gray-400"}>
                        ₹{s.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                  Transaction History
                </h4>
                <div className="space-y-2">
                  {s.list.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No transactions recorded yet.</p>
                  ) : (
                    s.list.map((p) => (
                      <div key={p.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Payment Received</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(p.created_at).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <span className="font-mono font-medium text-gray-900">₹{p.amount.toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Mobile/Action Footer */}
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {!isCancelled && s.remaining > 0 && (
                    <button
                        onClick={() => (window.location.href = `/payments?amount=${s.remaining}&booking_id=${booking.id}`)}
                        className="sm:hidden flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium"
                    >
                        <CreditCard className="w-4 h-4" />
                        Pay Balance
                    </button>
                )}
                
                {!isCancelled && (
                  <button
                    onClick={onCancel}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
     
    </div>
  );
}

function CancelModal({ cancelModal, setCancelModal, confirmCancel }) {
  if (!cancelModal.open) return null;

  const booking = cancelModal.booking;
  
  // SAFE ID CONVERSION: Prevents error
  const displayId = String(booking.id).slice(0, 8);

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            Cancel Booking?
          </h2>
          
          <p className="text-center text-gray-500 mb-6">
            You are about to cancel <strong>{booking.event_type}</strong>. This action might be subject to cancellation fees as per our policy.
          </p>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-mono text-gray-900">#{displayId}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-500">Refund Status</span>
                <span className="text-amber-600 font-medium">Manual Review</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCancelModal({ open: false, booking: null })}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={() => confirmCancel(booking.id)}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 shadow-sm transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}