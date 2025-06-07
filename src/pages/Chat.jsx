import React from "react";
import { useParams } from "react-router";

const Chat = () => {
  const { targetUserId } = useParams();
  return <div>Chat</div>;
};

export default Chat;
