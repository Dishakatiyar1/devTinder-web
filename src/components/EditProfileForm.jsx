import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/userSlice";

const EditProfileForm = ({ user, onUpdate }) => {
  const dispatch = useDispatch();
  const { firstName, lastName, emailId, photoUrl, gender, age, about, skills } =
    user;
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    emailId,
    photoUrl,
    gender,
    age,
    about,
    skills,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //   Note: patch is not working
      const res = await axios.post(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });
      onUpdate(formData);
      dispatch(addUser(res.data?.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mx-auto p-4">
      <Toaster />

      {/* Edit Profile Form */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Preview Card */}
      <div className="w-full lg:w-1/2">
        <UserCard user={formData} />
      </div>
    </div>
  );
};

export default EditProfileForm;
