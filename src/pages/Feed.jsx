import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchFeed = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      setFeedData(response.data?.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return loading ? (
    <>
      <span className="loading loading-spinner loading-xs"></span>
      <span className="loading loading-spinner loading-sm"></span>
      <span className="loading loading-spinner loading-md"></span>
      <span className="loading loading-spinner loading-lg"></span>
      <span className="loading loading-spinner loading-xl"></span>
    </>
  ) : currentIndex < feedData?.length ? (
    <div className="flex flex-col">
      <UserCard
        user={feedData[currentIndex]}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  ) : (
    <>OOPs! No new users found.</>
  );
};

export default Feed;
