import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      const data = response.data?.data;
      if (Array.isArray(data)) {
        setFeedData(data);
      } else {
        setFeedData([]);
        console.warn("Feed data is not an array:", data);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load feed"
      );
      setFeedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex space-x-2">
          <span className="loading loading-spinner loading-xs"></span>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-spinner loading-md"></span>
          <span className="loading loading-spinner loading-lg"></span>
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="text-red-500 text-center mb-4">
          <p className="text-lg font-semibold">Error loading feed</p>
          <p className="text-sm">{error}</p>
        </div>
        <button onClick={fetchFeed} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // No users found
  if (!feedData || feedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <p className="text-lg">No new users found.</p>
          <button onClick={fetchFeed} className="btn btn-outline mt-4">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // All users have been viewed
  if (currentIndex >= feedData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <p className="text-lg">You've viewed all available users!</p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              fetchFeed();
            }}
            className="btn btn-primary mt-4"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-sm text-gray-500">
        User {currentIndex + 1} of {feedData.length}
      </div>
      <UserCard
        user={feedData[currentIndex]}
        setCurrentIndex={setCurrentIndex}
        totalUsers={feedData.length}
      />
    </div>
  );
};

export default Feed;
