import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";

const Premium = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

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

  const handlePayment = async (plan) => {
    try {
      const order = await axios.post(
        `${BASE_URL}/payment/create`,
        { membershipType: plan.id },
        { headers: { contentType: "application/json" }, withCredentials: true }
      );

      const options = {
        key: order?.keyId,
        amount: order.amount / 100,
        currency: order.currency,
        name: order.notes.firstName + " " + order.notes.lastName,
        description: "Test Transaction",
        order_id: order.orderId,
        callback_url: "http://localhost:3000/payment-success", // Your success URL
        prefill: {
          name: "Disha Katiyar",
          email: "disha.katiyar@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // open the dialog box
    } catch (err) {
      toast.error("Something went wrong!.");
      console.error("Failed to create order: ", err);
    }
  };

  return (
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
  );
};

export default Premium;
