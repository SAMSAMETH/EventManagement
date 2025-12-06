import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Home, Download } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 text-center"
      >
        {/* Success Header / Icon Area */}
        <div className="pt-10 pb-6 px-8 bg-gradient-to-b from-white to-gray-50/50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Check className="w-10 h-10 text-green-600 stroke-[3]" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Your booking has been officially confirmed.
          </p>
        </div>

        {/* Receipt / Details Box */}
        <div className="px-8 py-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Payment Status</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                Completed
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Confirmation Sent To</span>
              <span className="font-medium text-gray-900">Email & WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/"
            className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
