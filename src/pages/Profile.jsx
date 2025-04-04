import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const initialUser = useSelector((state) => state.user);
  const [user, setUser] = useState(initialUser);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8">
      <EditProfileForm user={user} onUpdate={setUser} />
    </div>
  );
};

export default Profile;
