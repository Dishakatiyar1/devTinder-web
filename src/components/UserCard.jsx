import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const UserCard = ({ user, setCurrentIndex }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);

  useEffect(() => {
    if (isRequestSent) {
      setTimeout(() => {
        setIsRequestSent(false);
      }, 3000);
    }
  }, [isRequestSent]);

  const handleAction = async (status) => {
    setIsRequestSent(false);
    try {
      await axios.post(
        BASE_URL + `/request/send/${status}/${user?._id}`,
        {},
        { withCredentials: true }
      );
      if (status === "interested") {
        setIsRequestSent(true);
      }
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
        <div className="relative">
          <img
            className="h-56 w-full object-cover"
            src={user?.photoUrl}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
            <h2 className="text-white text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
          </div>
        </div>
        {user?.age && user?.gender && (
          <div className="p-4">
            <p className="text-gray-700">
              {user?.age}, {user?.gender}
            </p>
          </div>
        )}

        <div className="p-4">
          <p className="text-gray-700">{user?.about}</p>
        </div>
        <div className="card-actions justify-center mb-4">
          <button
            className="btn btn-primary"
            onClick={() => handleAction("ignored")}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleAction("interested")}
          >
            Interested
          </button>
        </div>
      </div>
      {isRequestSent && (
        <>
          <div class="toast toast-end toast-top top-20">
            <div class="alert alert-success">
              <span>Request sent successfully!</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserCard;
