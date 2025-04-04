import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Toaster, toast } from "react-hot-toast";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests. Please try again.");
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Request accepted!");
      setRequests(requests?.filter((req) => req?._id !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Toaster />
      <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Connection Requests
        </h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        {!loading && !error && requests?.length === 0 && (
          <p className="text-center text-gray-500">You have no requests.</p>
        )}

        <div className="space-y-4">
          {requests?.map((user) => (
            <div
              key={user?.fromUserId?.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center">
                <img
                  src={
                    user?.fromUserId?.photoUrl ||
                    "https://via.placeholder.com/50"
                  }
                  alt={user?.fromUserId?.firstName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {user?.fromUserId?.firstName} {user?.fromUserId?.lastName}
                  </h3>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => reviewRequest("accepted", user?._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mx-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => reviewRequest("rejected", user?._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
