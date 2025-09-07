import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";

const Premium = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isUserPremium, setIsUserPremium] = useState(false);

  const plans = [
    {
      id: "monthly",
      name: "Monthly Premium",
      price: 299,
      features: ["Unlimited Swipes", "See Who Likes You", "5 Super Likes/day"],
    },
    {
      id: "yearly",
      name: "Yearly Premium",
      price: 1999,
      originalPrice: 3588,
      features: [
        "Everything in Monthly",
        "Unlimited Super Likes",
        "Profile Boost",
      ],
    },
  ];

  const verifyPremiumUser = async () => {
    const res = await axios.get(`${BASE_URL}/premium/verify`, {
      withCredentials: true,
    });
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handlePayment = async (plan) => {
    try {
      const order = await axios.post(
        `${BASE_URL}/payment/create`,
        { membershipType: plan.id },
        { headers: { contentType: "application/json" }, withCredentials: true }
      );

      const { keyId, amount, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount: amount / 100,
        currency: currency,
        name: notes.firstName + " " + notes.lastName,
        description: "Test Transaction",
        order_id: orderId,
        callback_url: "/payment-success", // Your success URL
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "000",
        },
        theme: {
          color: "#F37254",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // open the dialog box
    } catch (err) {
      toast.error("Something went wrong!.");
      console.error("Failed to create order: ", err);
    }
  };

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  return isUserPremium ? (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Go Premium</h1>
        <p className="text-gray-600">Unlock exclusive features</p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg p-6 shadow-md border-2 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-purple-500 shadow-lg"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                {plan.originalPrice && (
                  <span className="text-gray-500 line-through mr-2">
                    ₹{plan.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold text-purple-600">
                  ₹{plan.price}
                </span>
              </div>
              {plan.originalPrice && (
                <p className="text-green-600 text-sm font-semibold">
                  Save ₹{plan.originalPrice - plan.price}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment(plan)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                selectedPlan === plan.id
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-700 mb-3">
          You are already a Premium Member 🎉
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Premium;
