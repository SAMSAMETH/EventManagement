export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
        <p className="text-gray-600 mt-2">Something went wrong. Please try again.</p>

        <a
          href="/payment"
          className="mt-6 inline-block px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
