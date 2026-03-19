import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../socket/socket";
import { useAuth } from "../../context/AuthContext";
import "./Chat.css";

export default function Chat({ roomId }) {

  const socket = getSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef(null);

  /* ===============================
     RECEIVE MESSAGE
  =============================== */

  useEffect(() => {

    const handleMessage = (msg) => {

      setMessages(prev => [...prev, msg]);

      // 🔥 unread logic
      if (!isOpen) {
        setUnread(prev => prev + 1);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };

  }, [isOpen]);

  /* ===============================
     LOAD HISTORY
  =============================== */

  useEffect(() => {

    socket.emit("get_messages", { roomId });

    const handleHistory = (msgs) => {
      setMessages(msgs || []);
    };

    socket.on("chat_history", handleHistory);

    return () => {
      socket.off("chat_history", handleHistory);
    };

  }, [roomId]);

  /* ===============================
     AUTO SCROLL
  =============================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===============================
     SEND MESSAGE
  =============================== */

  const sendMessage = () => {

    if (!text.trim()) return;

    socket.emit("send_message", {
      roomId,
      userId: user._id,
      text
    });

    setText("");
  };

  /* ===============================
     TOGGLE CHAT
  =============================== */

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setUnread(0); // 🔥 clear unread
  };

  /* ===============================
     UI
  =============================== */

  return (

    <>
      {/* 🔥 CHAT ICON */}
      <div className="chat-icon" onClick={toggleChat}>
        💬

        {unread > 0 && (
          <span className="chat-badge">
            {unread}
          </span>
        )}
      </div>

      {/* 🔥 CHAT BOX */}
      {isOpen && (
        <div className="chat-container">

          <div className="chat-header">
            Chat
            <span className="chat-close" onClick={toggleChat}>✖</span>
          </div>

          <div className="chat-messages">

            {messages.map((msg, i) => {

              const isMe =
                String(msg.userId) === String(user._id);

              return (
                <div
                  key={i}
                  className={`chat-message ${isMe ? "me" : ""}`}
                >
                  <span className="chat-user">
                    {msg.username}
                  </span>

                  <span className="chat-text">
                    {msg.text}
                  </span>
                </div>
              );
            })}

            <div ref={bottomRef} />

          </div>

          <div className="chat-input">

            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type message..."
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}