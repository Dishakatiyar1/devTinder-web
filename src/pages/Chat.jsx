import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { io } from "socket.io-client";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const targetUser = location.state?.targetUser;
  const user = useSelector((state) => state?.user);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([{ text: "", user: "" }]);

  useEffect(() => {
    if (!user?._id || !targetUserId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId: user?._id,
      targetUserId,
    });

    socket.on("messageReceived", ({ text, firstName }) => {
      setMessages((messages) => [...messages, { text, firstName }]);
    });

    // disconnect the socket when the component unloads
    return () => {
      socket.disconnect();
    };
  }, [user, targetUserId]);

  const handleClick = () => {
    // setMessages((messages) => [
    //   ...messages,
    //   { text: newMessage, firstName: user?.firstName },
    // ]);
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId: user?._id,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      handleClick();
    }
  };

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={targetUser?.photoUrl}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {targetUser?.firstName} {targetUser?.lastName}
            </h3>
            {/* <p className="text-sm text-green-500">Online</p> */}
          </div>
        </div>
        <button className="text-gray-600 hover:text-gray-800">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Other person's message */}
        {messages
          ?.filter((item) => item?.text != "")
          ?.map((msg, index) => (
            <div key={index}>
              {msg?.firstName == user?.firstName ? (
                <div className="flex justify-end">
                  <div>
                    <div className="bg-blue-500 text-white rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">{msg?.text}</p>
                    </div>
                    {/* <span className="text-xs text-gray-500 mt-1 block text-right">
                      12:00 PM
                    </span> */}
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <img
                    src={targetUser?.photoUrl}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">{msg?.text}</p>
                    </div>
                    {/* <span className="text-xs text-gray-500 mt-1">12:00 PM</span> */}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            onClick={handleClick}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
