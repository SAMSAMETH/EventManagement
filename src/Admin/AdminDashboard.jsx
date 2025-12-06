import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../Auth/AuthContext";

import {
  FileText,
  Users,
  CreditCard,
  BarChart2,
  ArrowLeft,
  Download,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Menu,
  X, // Added X for closing the mobile menu
  CheckCircle, // Added for fully paid status
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PACKAGE_PRICES = {
  Standard: 5000,
  Premium: 10000,
  Royal: 15000,
};

// --- NEW HELPER FOR PDF EXPORT ---
const handleExportPdf = () => {
  // Placeholder function for PDF generation
  console.log("Generating PDF Report...");
  alert(
    "Report Export initiated. (Actual PDF generation logic is complex and would require a library like jsPDF or a server-side solution)"
  );
  // In a real application, you would use a library like jsPDF or send data to a server
  // to generate and download the PDF file here.
};
// ---------------------------------

// --- NEW MOBILE TAB CONTAINER ---
const MobileTabContainer = ({ children, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tabs = [
    { key: "overview", name: "Overview" },
    { key: "bookings", name: "Bookings" },
    { key: "payments", name: "Payments" },
    { key: "users", name: "Users" },
    { key: "pending", name: "Pending Payments" },
  ];

  const activeTabName = tabs.find((t) => t.key === activeTab)?.name || "Overview";

  const handleTabClick = (key) => {
    setActiveTab(key);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white p-3 rounded-xl shadow border border-gray-200 flex justify-between items-center text-gray-700 font-semibold mb-4"
      >
        <span>{activeTabName}</span>
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-white rounded-xl shadow mb-4"
          >
            <div className="flex flex-col p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`px-3 py-2 text-left rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="md:hidden">{children}</div>
    </div>
  );
};
// ---------------------------------

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user?.app_metadata?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white shadow-lg rounded-xl text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPackage, setFilterPackage] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load all admin data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: b } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: p } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: pr } = await supabase.from("profiles").select("*");

      setBookings(b || []);
      setPayments(p || []);
      setProfiles(pr || []);
      setLoading(false);
    };

    loadData();
  }, []);

  // Attach user details to bookings
  const bookingsWithUser = useMemo(() => {
    return bookings.map((b) => {
      const user = profiles.find((u) => u.id === b.user_id);
      return {
        ...b,
        user_full_name: user?.full_name || b.name,
        user_email: user?.email || "-",
      };
    });
  }, [bookings, profiles]);

  // Attach booking details to payments
  const paymentsWithUser = useMemo(() => {
    return payments.map((p) => {
      const b = bookingsWithUser.find((x) => x.id === p.booking_id);
      return {
        ...p,
        booking_event: b?.event_type,
        customer_name: b?.user_full_name,
        customer_email: b?.user_email,
        customer_phone: b?.phone,
        package: b?.package,
      };
    });
  }, [payments, bookingsWithUser]);

  // Payment calculations
  const paidForBooking = (bookingId) =>
    payments
      .filter((p) => p.booking_id === bookingId)
      .reduce((sum, x) => sum + Number(x.amount), 0);

  const filteredBookings = useMemo(() => {
    return bookingsWithUser.filter((b) => {
      const q = searchQuery.toLowerCase();
      const total = PACKAGE_PRICES[b.package];
      const paid = paidForBooking(b.id);
      const remaining = total - paid;

      const status =
        remaining <= 0
          ? "paid"
          : paid > 0
          ? "partial"
          : "pending";

      const matchesSearch =
        b.user_full_name?.toLowerCase().includes(q) ||
        b.user_email?.toLowerCase().includes(q) ||
        b.event_type?.toLowerCase().includes(q);

      const matchesPackage =
        filterPackage === "all" || b.package === filterPackage;

      const matchesStatus =
        filterStatus === "all" ||
        filterStatus === status;

      return matchesSearch && matchesPackage && matchesStatus;
    });
  }, [bookingsWithUser, searchQuery, filterPackage, filterStatus]);

  const stats = useMemo(() => {
    let totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);

    let fullyPaid = bookingsWithUser.filter(
      (b) => paidForBooking(b.id) >= PACKAGE_PRICES[b.package]
    ).length;

    let pending = bookingsWithUser.filter(
      (b) => paidForBooking(b.id) < PACKAGE_PRICES[b.package]
    ).length;

    return {
      totalBookings: bookings.length,
      totalRevenue,
      fullyPaid,
      pending,
      totalUsers: profiles.length,
    };
  }, [bookings, payments, profiles, bookingsWithUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 sm:py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div>
              <h1 className="text-xl sm:text-3xl font-semibold">
                Admin Dashboard
              </h1>
              <p className="opacity-80 text-xs sm:text-sm">
                Manage bookings, payments, users & analytics
              </p>
            </div>
          </div>
          {/* Export Button - Adjusted for mobile visibility */}
         
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* TABS (Desktop) */}
        <div className="hidden md:flex flex-wrap gap-3 mb-4 overflow-x-auto scrollbar-hide">
          {/* Tabs - Added overflow-x-auto for smaller desktop/tablet views */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === "bookings"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === "payments"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Payments
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Users
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === "pending"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-gray-700 shadow hover:bg-gray-50"
            }`}
          >
            Pending Payments
          </button>
        </div>

        {/* SEARCH & FILTERS - Optimized for mobile stacking */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-between">
          {/* Search - Full width on mobile */}
          <div className="flex items-center bg-gray-100 rounded-lg px-3 w-full sm:w-auto sm:flex-1">
            <Search className="text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers, email, event..."
              className="bg-transparent px-2 py-2 text-sm sm:text-base outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters - Stacked on mobile, side-by-side on tablet/desktop */}
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              className="border p-2 rounded-lg text-sm sm:text-base flex-1"
              value={filterPackage}
              onChange={(e) => setFilterPackage(e.target.value)}
            >
              <option value="all">All Packages</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Royal">Royal</option>
            </select>

            <select
              className="border p-2 rounded-lg text-sm sm:text-base flex-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* Desktop Tab Content */}
            <div className="hidden md:block">
              {activeTab === "overview" && (
                <Overview
                  stats={stats}
                  payments={payments}
                  bookings={bookingsWithUser}
                />
              )}

              {activeTab === "bookings" && (
                <BookingsTab
                  bookings={filteredBookings}
                  paidForBooking={paidForBooking}
                />
              )}

              {activeTab === "payments" && (
                <PaymentsTab payments={paymentsWithUser} />
              )}

              {activeTab === "users" && (
                <UsersTab profiles={profiles} bookings={bookings} payments={payments} />
              )}

              {activeTab === "pending" && (
                <PendingTab
                  bookings={bookingsWithUser}
                  paidForBooking={paidForBooking}
                />
              )}
            </div>

            {/* Mobile Tab Content Wrapper */}
            <MobileTabContainer activeTab={activeTab} setActiveTab={setActiveTab}>
              {activeTab === "overview" && (
                <Overview
                  stats={stats}
                  payments={payments}
                  bookings={bookingsWithUser}
                />
              )}

              {activeTab === "bookings" && (
                <BookingsTab
                  bookings={filteredBookings}
                  paidForBooking={paidForBooking}
                  isMobile
                />
              )}

              {activeTab === "payments" && (
                <PaymentsTab payments={paymentsWithUser} isMobile />
              )}

              {activeTab === "users" && (
                <UsersTab profiles={profiles} bookings={bookings} payments={payments} isMobile />
              )}

              {activeTab === "pending" && (
                <PendingTab
                  bookings={bookingsWithUser}
                  paidForBooking={paidForBooking}
                  isMobile
                />
              )}
            </MobileTabContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
  OVERVIEW SECTION - Adjusted for mobile responsiveness
============================================================== */
function Overview({ stats, payments, bookings }) {
  // Chart: last 10 days revenue
  const chartMap = {};
  payments.forEach((p) => {
    const day = new Date(p.created_at).toISOString().slice(0, 10);
    chartMap[day] = (chartMap[day] || 0) + Number(p.amount);
  });

  const chartData = [];
  for (let i = 9; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    chartData.push({ date: key.slice(5), amount: chartMap[key] || 0 });
  }

  return (
    <>
      {/* STAT CARDS - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}
        />
        <StatCard
          title="Fully Paid"
          value={stats.fullyPaid}
          icon={
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          }
        />
        <StatCard
          title="Pending Payments"
          value={stats.pending}
          icon={<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          }
        />
      </div>

      {/* REVENUE CHART */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-base sm:text-lg text-gray-800">
            Revenue Trend (Last 10 Days)
          </h2>
        </div>

        <div className="w-full h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '10px' }} />
              <YAxis
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                stroke="#6b7280"
                style={{ fontSize: '10px' }}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#9333EA"
                strokeWidth={2} // Slightly thinner line for mobile
                dot={{ stroke: "#9333EA", strokeWidth: 1, r: 3 }} // Smaller dots for mobile
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-pink-600" />
          <h2 className="font-semibold text-base sm:text-lg text-gray-800">
            Recent Bookings
          </h2>
        </div>

        <div className="space-y-3">
          {bookings.slice(0, 6).map((b) => (
            <div
              key={b.id}
              className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 transition duration-150 ease-in-out hover:bg-gray-100 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p className="font-bold text-sm sm:text-base text-gray-800">
                  {b.user_full_name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {b.event_type} •{" "}
                  <span className="text-purple-600 font-medium">
                    {b.package}
                  </span>
                </p>
              </div>

              <p className="text-xs font-medium text-gray-700 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">
                {new Date(b.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
  STAT CARD - Adjusted for mobile
============================================================== */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
        <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1">
          {value}
        </p>
      </div>
      <div className="p-2 sm:p-3 bg-purple-100 rounded-full">{icon}</div>
    </div>
  );
}

/* ============================================================
  BOOKINGS TAB - Optimized for mobile: uses `overflow-x-auto` on table and responsive table rows for mobile views when `isMobile` is passed.
============================================================== */
function BookingsTab({ bookings, paidForBooking, isMobile = false }) {

  if (isMobile) {
    return (
      <div className="space-y-4">
        {bookings.map((b) => {
          const total = PACKAGE_PRICES[b.package];
          const paid = paidForBooking(b.id);
          const remaining = total - paid;
          const status =
            remaining <= 0 ? "Paid" : paid > 0 ? "Partial" : "Pending";

          return (
            <div key={b.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-base text-gray-800">{b.user_full_name}</p>
                  <p className="text-xs text-gray-500">{b.user_email}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium whitespace-nowrap ${
                    status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : status === "Partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Event: <span className="font-semibold text-gray-800">{b.event_type}</span></p>
                  <p className="text-gray-600">Package: <span className="font-semibold text-purple-600">{b.package}</span></p>
                  <p className="text-gray-600">Total: <span className="font-semibold">₹{total}</span></p>
                  <p className="text-gray-600">Paid: <span className="font-semibold text-green-700">₹{paid}</span></p>
                  <p className="text-gray-600">Remaining: <span className="font-semibold text-red-600">₹{remaining}</span></p>
                  <p className="text-gray-600">Booked: <span className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString()}</span></p>
              </div>
            </div>
          );
        })}
        {bookings.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-xl shadow">No bookings found.</p>
        )}
      </div>
    );
  }

  // Desktop View (default)
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      {/* Table is wrapped in overflow-x-auto for horizontal scrolling on smaller screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-2">Customer</th>
              <th>Event</th>
              <th>Package</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const total = PACKAGE_PRICES[b.package];
              const paid = paidForBooking(b.id);
              const remaining = total - paid;
              const status =
                remaining <= 0 ? "Paid" : paid > 0 ? "Partial" : "Pending";

              return (
                <tr key={b.id} className="border-b text-sm">
                  <td className="py-3">
                    <p className="font-semibold">{b.user_full_name}</p>
                    <p className="text-gray-500 text-xs">{b.user_email}</p>
                  </td>
                  <td>{b.event_type}</td>
                  <td>{b.package}</td>
                  <td>₹{total.toLocaleString()}</td>
                  <td className="font-semibold text-green-700">
                    ₹{paid.toLocaleString()}
                  </td>
                  <td className="text-red-600">
                    ₹{remaining.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : status === "Partial"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="text-gray-500">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <p className="text-center text-gray-500 py-6">No bookings found.</p>
      )}
    </div>
  );
}

/* ============================================================
  PAYMENTS TAB - Optimized for mobile
============================================================== */
function PaymentsTab({ payments, isMobile = false }) {

  if (isMobile) {
    return (
      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-base text-gray-800">{p.customer_name}</p>
                <p className="text-xs text-gray-500">{p.customer_email}</p>
              </div>
              <p className="font-bold text-lg text-green-700">₹{Number(p.amount).toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">Event: <span className="font-semibold text-gray-800">{p.booking_event}</span></p>
                <p className="text-gray-600">Package: <span className="font-semibold text-purple-600">{p.package}</span></p>
                <p className="text-gray-600 col-span-2 text-xs truncate">Payment ID: {p.razorpay_payment_id || "-"}</p>
                <p className="text-gray-600 col-span-2 text-xs">Date: {new Date(p.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {payments.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-xl shadow">No payments found.</p>
        )}
      </div>
    );
  }

  // Desktop View (default)
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-2">Customer</th>
              <th>Event</th>
              <th>Package</th>
              <th>Amount</th>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b text-sm">
                <td className="py-3">
                  <p className="font-semibold">{p.customer_name}</p>
                  <p className="text-gray-500 text-xs">{p.customer_email}</p>
                </td>
                <td>{p.booking_event}</td>
                <td>{p.package}</td>
                <td className="font-semibold text-green-700">
                  ₹{Number(p.amount).toLocaleString()}
                </td>
                <td className="text-xs">{p.razorpay_payment_id || "-"}</td>
                <td className="text-xs">{p.razorpay_order_id || "-"}</td>
                <td className="text-gray-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {payments.length === 0 && (
        <p className="text-center text-gray-500 py-6">No payments found.</p>
      )}
    </div>
  );
}

/* ============================================================
  USERS TAB - Optimized for mobile
============================================================== */
function UsersTab({ profiles, bookings, payments, isMobile = false }) {
  const userStats = profiles.map((u) => {
    const userBookings = bookings.filter((b) => b.user_id === u.id);
    const userPayments = payments.filter((p) => p.user_id === u.id);

    const paid = userPayments.reduce((s, p) => s + Number(p.amount), 0);

    return {
      ...u,
      bookingsCount: userBookings.length,
      totalPaid: paid,
      lastBooking: userBookings[0]?.created_at,
    };
  });

  if (isMobile) {
    return (
      <div className="space-y-4">
        {userStats.map((u) => (
          <div key={u.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="mb-2">
              <p className="font-bold text-base text-gray-800">{u.full_name || "N/A"}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">Bookings: <span className="font-semibold text-gray-800">{u.bookingsCount}</span></p>
                <p className="text-gray-600">Total Paid: <span className="font-semibold text-green-700">₹{u.totalPaid.toLocaleString()}</span></p>
                <p className="text-gray-600 col-span-2">Last Booking: <span className="text-xs text-gray-500">{u.lastBooking ? new Date(u.lastBooking).toLocaleDateString() : "-"}</span></p>
            </div>
          </div>
        ))}
        {userStats.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-xl shadow">No users found.</p>
        )}
      </div>
    );
  }

  // Desktop View (default)
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-2">User</th>
              <th>Email</th>
              <th>Bookings</th>
              <th>Total Paid</th>
              <th>Last Booking</th>
            </tr>
          </thead>

          <tbody>
            {userStats.map((u) => (
              <tr key={u.id} className="border-b text-sm">
                <td className="py-3 font-semibold">{u.full_name || "-"}</td>
                <td>{u.email}</td>
                <td>{u.bookingsCount}</td>
                <td className="font-semibold text-green-700">
                  ₹{u.totalPaid.toLocaleString()}
                </td>
                <td className="text-gray-500">
                  {u.lastBooking
                    ? new Date(u.lastBooking).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userStats.length === 0 && (
        <p className="text-center text-gray-500 py-6">No users found.</p>
      )}
    </div>
  );
}

/* ============================================================
  PENDING PAYMENTS TAB - Optimized for mobile
============================================================== */
function PendingTab({ bookings, paidForBooking, isMobile = false }) {
  const pendingList = bookings
    .map((b) => {
      const total = PACKAGE_PRICES[b.package];
      const paid = paidForBooking(b.id);
      const remaining = total - paid;

      return {
        ...b,
        total,
        paid,
        remaining,
      };
    })
    .filter((b) => b.remaining > 0);


  if (isMobile) {
    return (
      <div className="space-y-4">
        {pendingList.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-base text-gray-800">{b.user_full_name}</p>
                <p className="text-xs text-gray-500">{b.user_email}</p>
              </div>
              <p className="font-bold text-lg text-red-600">₹{b.remaining.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-600">Event: <span className="font-semibold text-gray-800">{b.event_type}</span></p>
                <p className="text-gray-600">Package: <span className="font-semibold text-purple-600">{b.package}</span></p>
                <p className="text-gray-600">Total: <span className="font-semibold">₹{b.total}</span></p>
                <p className="text-gray-600">Paid: <span className="font-semibold text-green-700">₹{b.paid}</span></p>
                <p className="text-gray-600 col-span-2">Booked: <span className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString()}</span></p>
            </div>
          </div>
        ))}
        {pendingList.length === 0 && (
          <p className="text-center text-gray-500 py-6 bg-white rounded-xl shadow">No pending payments 🎉</p>
        )}
      </div>
    );
  }

  // Desktop View (default)
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Pending Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-2">Customer</th>
              <th>Email</th>
              <th>Event</th>
              <th>Package</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {pendingList.map((b) => (
              <tr key={b.id} className="border-b text-sm">
                <td className="py-3 font-semibold">{b.user_full_name}</td>
                <td className="text-gray-500">{b.user_email}</td>
                <td>{b.event_type}</td>
                <td>{b.package}</td>
                <td>₹{b.total.toLocaleString()}</td>
                <td className="text-green-700 font-semibold">
                  ₹{b.paid.toLocaleString()}
                </td>
                <td className="text-red-600 font-semibold">
                  ₹{b.remaining.toLocaleString()}
                </td>

                <td className="text-gray-500">
                  {new Date(b.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingList.length === 0 && (
        <p className="text-center text-gray-500 py-6">No pending payments 🎉</p>
      )}
    </div>
  );
}

// ReportsTab component removed as it was not part of the main dashboard logic but was included in the original code.

// Removed the old ReportsTab since it was not used in the main component.