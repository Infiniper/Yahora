// frontend/src/pages/messages/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./Messages.module.css";
import { supabase } from "../../config/supabaseClient";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Messages() {
  const currentUserId = localStorage.getItem("yahora_user_id");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showInboxOnMobile, setShowInboxOnMobile] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Tracks who is online

  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => scrollToBottom(), [messages]);

  /* ── 1. Fetch Inbox & Handle URL Persistence ── */
  useEffect(() => {
    if (!currentUserId) return navigate("/auth");

    const loadInboxAndCheckParams = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/inbox/${currentUserId}`,
        );
        const data = await res.json();
        let fetchedInbox = data.inbox || [];

        const paramUserId = searchParams.get("user");
        const paramProductId = searchParams.get("product");

        if (paramUserId && paramProductId) {
          const existingChat = fetchedInbox.find(
            (chat) =>
              chat.contact_id === paramUserId &&
              chat.product_id === paramProductId,
          );

          if (existingChat) {
            handleSelectChat(existingChat, true); // true = skip URL update to avoid loop
          } else {
            const prodRes = await fetch(
              `${API_BASE_URL}/products/${paramProductId}`,
            );
            const prodData = await prodRes.json();

            if (prodData.product) {
              const newChatData = {
                contact_id: paramUserId,
                product_id: paramProductId,
                contact_name: prodData.product.seller?.full_name || "User",
                contact_avatar: prodData.product.seller?.avatar_url,
                product_title: prodData.product.title,
                product_image:
                  prodData.product.image_urls?.[0] ||
                  "https://via.placeholder.com/20",
                unread_count: 0,
              };
              fetchedInbox = [newChatData, ...fetchedInbox];
              handleSelectChat(newChatData, true);
            }
          }
        }
        setInbox(fetchedInbox);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadInboxAndCheckParams();
  }, [currentUserId]); // Removed searchParams to prevent re-fetching on chat switch

  /* ── 2. Select Chat & Update URL for Persistence ── */
  const handleSelectChat = async (chat, isInitialLoad = false) => {
    setActiveChat(chat);
    setShowInboxOnMobile(false);

    // FIX: Persist chat on refresh by silently updating the URL
    if (!isInitialLoad) {
      navigate(`/messages?user=${chat.contact_id}&product=${chat.product_id}`, {
        replace: true,
      });
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/messages/history?userId=${currentUserId}&contactId=${chat.contact_id}&productId=${chat.product_id}`,
      );
      const data = await res.json();
      setMessages(data.messages || []);

      if (chat.unread_count > 0) {
        await fetch(`${API_BASE_URL}/messages/read`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            contactId: chat.contact_id,
            productId: chat.product_id,
          }),
        });
        setInbox((prev) =>
          prev.map((c) =>
            c.contact_id === chat.contact_id && c.product_id === chat.product_id
              ? { ...c, unread_count: 0 }
              : c,
          ),
        );
      }
    } catch (error) {}
  };

  /* ── 3. Realtime Ticks & Presence ── */

  // A. Listen for the global online-users event broadcasted by Navbar.jsx
  useEffect(() => {
    // NEW: Instantly grab the currently known online users the millisecond the page opens
    if (window.yahoraOnlineUsers) {
      setOnlineUsers(new Set(window.yahoraOnlineUsers));
    }

    // Continue listening for real-time changes (e.g., if they come online while you are staring at the chat)
    const handlePresenceSync = (e) => setOnlineUsers(new Set(e.detail));
    window.addEventListener("yahora-presence", handlePresenceSync);

    return () =>
      window.removeEventListener("yahora-presence", handlePresenceSync);
  }, []);

  // B. Listen for New & Updated Messages (The Ticks!)
  useEffect(() => {
    if (!currentUserId) return;

    const msgChannel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;
          if (
            newMsg.sender_id === currentUserId ||
            newMsg.receiver_id === currentUserId
          ) {
            if (
              activeChat &&
              newMsg.product_id === activeChat.product_id &&
              (newMsg.sender_id === activeChat.contact_id ||
                newMsg.receiver_id === activeChat.contact_id)
            ) {
              setMessages((prev) => [...prev, newMsg]);

              if (newMsg.receiver_id === currentUserId) {
                fetch(`${API_BASE_URL}/messages/read`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: currentUserId,
                    contactId: newMsg.sender_id,
                    productId: newMsg.product_id,
                  }),
                });
              }
            }

            setInbox((prev) => {
              const chatIndex = prev.findIndex(
                (c) =>
                  c.product_id === newMsg.product_id &&
                  (c.contact_id === newMsg.sender_id ||
                    c.contact_id === newMsg.receiver_id),
              );
              let updatedInbox = [...prev];
              let updatedChat = null;

              if (chatIndex > -1) {
                updatedChat = updatedInbox.splice(chatIndex, 1)[0];
                updatedChat.last_message = newMsg.content;
                updatedChat.last_message_time = newMsg.created_at;

                const isChatActive =
                  activeChat &&
                  activeChat.product_id === newMsg.product_id &&
                  activeChat.contact_id === newMsg.sender_id;
                if (newMsg.receiver_id === currentUserId && !isChatActive) {
                  updatedChat.unread_count =
                    Number(updatedChat.unread_count || 0) + 1;
                }
              }
              if (updatedChat) updatedInbox.unshift(updatedChat);
              return updatedInbox;
            });
          }
        },
      )
      // THE TICKS UPDATE: Listens for changes to is_read or is_delivered
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedMsg = payload.new;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, [currentUserId, activeChat]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const tempMessage = newMessage;
    setNewMessage("");

    try {
      await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: activeChat.contact_id,
          product_id: activeChat.product_id,
          content: tempMessage,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className={styles.loading}>Loading messages...</div>;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {/* INBOX */}
        <div
          className={`${styles.inboxSidebar} ${!showInboxOnMobile ? styles.hideOnMobile : ""}`}
        >
          <div className={styles.inboxHeader}>
            <h2>Messages</h2>
          </div>
          <div className={styles.inboxList}>
            {inbox.length === 0 ? (
              <div className={styles.emptyInbox}>
                <MessageSquare size={32} color="#ccc" />
                <p>No messages yet.</p>
              </div>
            ) : (
              inbox.map((chat) => (
                <div
                  key={`${chat.contact_id}-${chat.product_id}`}
                  className={`${styles.inboxItem} ${activeChat?.product_id === chat.product_id && activeChat?.contact_id === chat.contact_id ? styles.inboxItemActive : ""}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <img
                    src={
                      chat?.contact_avatar || "https://via.placeholder.com/40"
                    }
                    alt="User"
                    className={styles.inboxAvatar}
                  />
                  <div className={styles.inboxItemContent}>
                    <div className={styles.inboxItemTop}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <span className={styles.inboxName}>
                          {chat?.contact_name || "Unknown"}
                        </span>

                        {/* NEW: Online presence indicator for the sidebar */}
                        {onlineUsers.has(chat.contact_id) && (
                          <span
                            className={styles.onlineStatus}
                            style={{ fontSize: "0.65rem", gap: "3px" }}
                          >
                            <span
                              className={styles.onlineDot}
                              style={{ width: "6px", height: "6px" }}
                            ></span>
                          </span>
                        )}
                      </div>

                      {chat?.last_message_time && (
                        <span
                          className={styles.inboxTime}
                          style={{ flexShrink: 0, marginLeft: "4px" }}
                        >
                          {formatTime(chat.last_message_time)}
                        </span>
                      )}
                    </div>
                    <div className={styles.inboxItemMiddle}>
                      <span className={styles.inboxProduct}>
                        {chat?.product_title || "Item"}
                      </span>
                    </div>
                    <div className={styles.inboxItemBottom}>
                      <span className={styles.inboxPreview}>
                        {chat?.last_message || "Start the conversation"}
                      </span>
                      {chat?.unread_count > 0 && (
                        <span className={styles.unreadBadge}>
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div
          className={`${styles.chatArea} ${showInboxOnMobile ? styles.hideOnMobile : ""}`}
        >
          {activeChat ? (
            <>
              <div className={styles.chatHeader}>
                <button
                  className={styles.mobileBackBtn}
                  onClick={() => {
                    setShowInboxOnMobile(true);
                    navigate("/messages", { replace: true });
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={
                    activeChat?.contact_avatar ||
                    "https://via.placeholder.com/40"
                  }
                  alt="User"
                  className={styles.chatHeaderAvatar}
                />
                <div className={styles.chatHeaderInfo}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <h3>{activeChat?.contact_name || "Unknown"}</h3>
                    {/* ONLINE PRESENCE INDICATOR */}
                    {onlineUsers.has(activeChat.contact_id) && (
                      <span className={styles.onlineStatus}>
                        <span className={styles.onlineDot}></span>Online
                      </span>
                    )}
                  </div>
                  <div
                    className={styles.chatProductSnippet}
                    onClick={() =>
                      navigate(`/product/${activeChat.product_id}`)
                    }
                  >
                    <img
                      src={
                        activeChat?.product_image ||
                        "https://via.placeholder.com/20"
                      }
                      alt="Product"
                    />
                    <span>{activeChat?.product_title || "Item"}</span>
                  </div>
                </div>
              </div>

              <div
                className={styles.messagesContainer}
                ref={messagesContainerRef}
              >
                {messages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    Say hello to{" "}
                    {activeChat?.contact_name?.split(" ")[0] || "them"}!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMine = msg.sender_id === currentUserId;

                    // WHATSAPP STYLE TICK LOGIC
                    let tickIcon = <Check size={14} color="#a0aec0" />; // Default: Single Gray Tick (Sent)
                    if (msg.is_read) {
                      tickIcon = <CheckCheck size={14} color="#3b82f6" />; // Read: Double Blue Tick
                    } else if (
                      msg.is_delivered ||
                      onlineUsers.has(activeChat.contact_id)
                    ) {
                      tickIcon = <CheckCheck size={14} color="#a0aec0" />; // Delivered: Double Gray Tick
                    }

                    return (
                      <div
                        key={index}
                        className={`${styles.messageWrapper} ${isMine ? styles.messageMine : styles.messageTheirs}`}
                      >
                        <div className={styles.messageBubble}>
                          <p>{msg.content}</p>
                          <div className={styles.messageMeta}>
                            <span>{formatTime(msg.created_at)}</span>
                            {isMine && (
                              <span className={styles.readReceipt}>
                                {tickIcon}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                className={styles.chatInputArea}
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={styles.chatInput}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={styles.sendBtn}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noActiveChat}>
              <div className={styles.noChatIconWrap}>
                <MessageSquare size={48} color="#ccc" />
              </div>
              <h3>Your Messages</h3>
              <p>Select a conversation from the left to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
