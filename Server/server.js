import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// ----------------------------
// Express Setup
// ----------------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ----------------------------
// External Services
// ----------------------------

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Supabase (requires SERVICE KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Resend (for email receipts)
const resend = new Resend(process.env.RESEND_API_KEY);

// ----------------------------
// Health Check Route
// ----------------------------
app.get("/", (req, res) => {
  res.send("Razorpay Backend Running 🚀");
});

// ----------------------------
// Create Razorpay Order
// ----------------------------
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Order Create Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Razorpay Webhook (Production-Grade)
// ----------------------------
app.post("/razorpay-webhook", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Validate signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    console.log("❌ Invalid webhook signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  console.log("✔ Webhook Verified");

  const event = req.body;

  // If payment was captured
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    console.log("💰 Payment Captured:", payment.id);

    // 1️⃣ Update payments table
    await supabase
      .from("payments")
      .update({ status: "success" })
      .eq("razorpay_payment_id", payment.id);

    // 2️⃣ Update booking as paid
    if (payment.notes?.booking_id) {
      await supabase
        .from("bookings")
        .update({ payment_status: "Paid" })
        .eq("id", payment.notes.booking_id);
    }

    // 3️⃣ Send email receipt
    try {
      await resend.emails.send({
        from: "Zecardia <noreply@yourdomain.com>",
        to: payment.email || "customer@example.com",
        subject: "Payment Receipt",
        html: `
          <h2>Payment Successful</h2>
          <p>Amount: ₹${payment.amount / 100}</p>
          <p>Payment ID: ${payment.id}</p>
          <p>Thank you for booking with us!</p>
        `,
      });

      console.log("📧 Email Sent");
    } catch (emailErr) {
      console.error("Email Error:", emailErr);
    }
  }

  res.json({ status: "ok" });
});

// ----------------------------
// Server Start
// ----------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
