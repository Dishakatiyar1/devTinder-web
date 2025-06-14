import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Toaster, toast } from "react-hot-toast";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchConnections = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      setConnections(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to load connections. Please try again.");
      toast.error("Failed to load connections.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (user) => {
    const userId = user?._id;
    navigate(`/chat/${userId}`, { state: { targetUser: user } });
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Connections
          </h1>
          <p className="text-gray-600">Connect and chat with your network</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading connections...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        {!loading && !error && connections?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No connections yet
            </h3>
            <p className="text-gray-500">
              Start connecting with people to see them here
            </p>
          </div>
        )}

        {!loading && !error && connections?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                All Connections
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {connections?.filter((item) => item != null)?.length} people
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {connections
                ?.filter((item) => item != null)
                ?.map((user) => (
                  <div
                    key={user?._id}
                    className="p-4 hover:bg-gray-50 transition-colors min-w-[360px]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={
                              user?.photoUrl ||
                              "https://via.placeholder.com/48/3B82F6/FFFFFF?text=" +
                                (user?.firstName?.[0] || "U")
                            }
                            alt={user?.firstName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div> */}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {user?.about || "Connected user"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleChatClick(user)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
