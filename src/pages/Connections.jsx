import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Toaster, toast } from "react-hot-toast";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">My Connections</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        {/* No Connections */}
        {!loading && !error && connections?.length === 0 && (
          <p className="text-center text-gray-500">
            You have no connections yet.
          </p>
        )}

        {/* Connections List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections?.map((user) => (
            <div
              key={user?.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <img
                src={user?.photoUrl || "https://via.placeholder.com/50"}
                alt={user?.firstName}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
