// frontend/src/pages/messages/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Messages.module.css";
import { supabase } from "../../config/supabaseClient";
import { ArrowLeft, Send, MessageSquare, Check, CheckCheck, Clock } from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export default function Messages() {
  const currentUserId = localStorage.getItem("yahora_user_id");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State
  const [inbox, setInbox] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { contactId, productId, contactName, productTitle, ... }
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Mobile responsive toggle
  const [showInboxOnMobile, setShowInboxOnMobile] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ── 1. Fetch Inbox & Handle URL Params ── */
  useEffect(() => {
    if (!currentUserId) {
      navigate("/auth");
      return;
    }

    const loadInboxAndCheckParams = async () => {
      try {
        // Fetch Inbox
        const res = await fetch(`${API_BASE_URL}/messages/inbox/${currentUserId}`);
        const data = await res.json();
        let fetchedInbox = data.inbox || [];
        
        // Did the user click "Message Seller" from a Product Page?
        const paramUserId = searchParams.get("user");
        const paramProductId = searchParams.get("product");

        if (paramUserId && paramProductId) {
          // Check if this chat already exists in the inbox
          const existingChat = fetchedInbox.find(
            chat => chat.contact_id === paramUserId && chat.product_id === paramProductId
          );

          if (existingChat) {
            handleSelectChat(existingChat);
          } else {
            // It's a brand new chat! We need to fetch the product details to show the header
            const prodRes = await fetch(`${API_BASE_URL}/products/${paramProductId}`);
            const prodData = await prodRes.json();
            
            if (prodData.product) {
              const newChatData = {
                contact_id: paramUserId,
                product_id: paramProductId,
                contact_name: prodData.product.seller.full_name,
                contact_avatar: prodData.product.seller.avatar_url,
                product_title: prodData.product.title,
                product_image: prodData.product.image_urls[0],
                unread_count: 0
              };
              
              // Push this new empty chat to the top of the inbox visually
              fetchedInbox = [newChatData, ...fetchedInbox];
              handleSelectChat(newChatData);
            }
          }
        }
        
        setInbox(fetchedInbox);
      } catch (error) {
        console.error("Failed to load inbox:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInboxAndCheckParams();
  }, [currentUserId, searchParams]);

  /* ── 2. Select a Chat & Mark as Read ── */
  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    setShowInboxOnMobile(false); // Switch to chat view on mobile

    try {
      // Fetch History
      const res = await fetch(
        `${API_BASE_URL}/messages/history?userId=${currentUserId}&contactId=${chat.contact_id}&productId=${chat.product_id}`
      );
      const data = await res.json();
      setMessages(data.messages || []);

      // If there are unread messages, mark them as read in DB
      if (chat.unread_count > 0) {
        await fetch(`${API_BASE_URL}/messages/read`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            contactId: chat.contact_id,
            productId: chat.product_id
          })
        });

        // Update local inbox state to remove the notification badge
        setInbox(prev => prev.map(c => 
          c.contact_id === chat.contact_id && c.product_id === chat.product_id 
            ? { ...c, unread_count: 0 } 
            : c
        ));
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  /* ── 3. The WebSockets Engine (Realtime Updates) ── */
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('realtime:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new;

          // 1. Are we involved in this message?
          if (newMsg.sender_id === currentUserId || newMsg.receiver_id === currentUserId) {
            
            // 2. Is this message for the chat we currently have OPEN?
            if (activeChat && newMsg.product_id === activeChat.product_id && 
                (newMsg.sender_id === activeChat.contact_id || newMsg.receiver_id === activeChat.contact_id)) {
              
              // Add to current chat window
              setMessages(prev => [...prev, newMsg]);

              // If we received it while the window is open, automatically mark it as read!
              if (newMsg.receiver_id === currentUserId) {
                fetch(`${API_BASE_URL}/messages/read`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: currentUserId, contactId: newMsg.sender_id, productId: newMsg.product_id
                  })
                });
              }
            }

            // 3. Update the Inbox List instantly (move to top, update preview text)
            setInbox(prevInbox => {
              const chatIndex = prevInbox.findIndex(
                c => c.product_id === newMsg.product_id && 
                     (c.contact_id === newMsg.sender_id || c.contact_id === newMsg.receiver_id)
              );

              let updatedInbox = [...prevInbox];
              let updatedChat = null;

              if (chatIndex > -1) {
                // Chat exists in inbox, extract it
                updatedChat = updatedInbox.splice(chatIndex, 1)[0];
                updatedChat.last_message = newMsg.content;
                updatedChat.last_message_time = newMsg.created_at;
                
                // Increment unread count ONLY if we are the receiver AND we don't have this chat actively open
                const isChatActive = activeChat && activeChat.product_id === newMsg.product_id && activeChat.contact_id === newMsg.sender_id;
                if (newMsg.receiver_id === currentUserId && !isChatActive) {
                  updatedChat.unread_count = Number(updatedChat.unread_count || 0) + 1;
                }
              }

              // If it's a new chat, we'd ideally fetch details, but for MVP we rely on a page refresh for entirely new inbound chats 
              // Put the updated chat at the top of the inbox
              if (updatedChat) {
                updatedInbox.unshift(updatedChat);
              }

              return updatedInbox;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeChat]);

  /* ── 4. Send Message ── */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const tempMessage = newMessage;
    setNewMessage(""); // Clear input instantly for snappy UX

    try {
      await fetch(`${API_BASE_URL}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: activeChat.contact_id,
          product_id: activeChat.product_id,
          content: tempMessage
        })
      });
      // We do NOT manually update the `messages` array here! 
      // Our Supabase WebSocket listener will catch the INSERT and automatically add it.
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className={styles.loading}>Loading messages...</div>;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        
        {/* ════ INBOX SIDEBAR ════ */}
        <div className={`${styles.inboxSidebar} ${!showInboxOnMobile ? styles.hideOnMobile : ""}`}>
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
                  <img src={chat.contact_avatar || "https://via.placeholder.com/40"} alt="User" className={styles.inboxAvatar} />
                  
                  <div className={styles.inboxItemContent}>
                    <div className={styles.inboxItemTop}>
                      <span className={styles.inboxName}>{chat.contact_name}</span>
                      {chat.last_message_time && <span className={styles.inboxTime}>{formatTime(chat.last_message_time)}</span>}
                    </div>
                    
                    <div className={styles.inboxItemMiddle}>
                      <span className={styles.inboxProduct}>{chat.product_title}</span>
                    </div>

                    <div className={styles.inboxItemBottom}>
                      <span className={styles.inboxPreview}>{chat.last_message || "Start the conversation"}</span>
                      {chat.unread_count > 0 && (
                        <span className={styles.unreadBadge}>{chat.unread_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ════ ACTIVE CHAT WINDOW ════ */}
        <div className={`${styles.chatArea} ${showInboxOnMobile ? styles.hideOnMobile : ""}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className={styles.chatHeader}>
                <button className={styles.mobileBackBtn} onClick={() => setShowInboxOnMobile(true)}>
                  <ArrowLeft size={20} />
                </button>
                
                <img src={activeChat.contact_avatar || "https://via.placeholder.com/40"} alt="User" className={styles.chatHeaderAvatar} />
                <div className={styles.chatHeaderInfo}>
                  <h3>{activeChat.contact_name}</h3>
                  <div 
                    className={styles.chatProductSnippet}
                    onClick={() => navigate(`/product/${activeChat.product_id}`)}
                  >
                    <img src={activeChat.product_image || "https://via.placeholder.com/20"} alt="Product" />
                    <span>{activeChat.product_title}</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    Say hello to {activeChat.contact_name.split(' ')[0]}!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                      <div key={index} className={`${styles.messageWrapper} ${isMine ? styles.messageMine : styles.messageTheirs}`}>
                        <div className={styles.messageBubble}>
                          <p>{msg.content}</p>
                          <div className={styles.messageMeta}>
                            <span>{formatTime(msg.created_at)}</span>
                            {isMine && (
                              <span className={styles.readReceipt}>
                                {msg.is_read ? <CheckCheck size={14} color="#4ade80" /> : <Check size={14} color="#aaa" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form className={styles.chatInputArea} onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={styles.chatInput}
                />
                <button type="submit" disabled={!newMessage.trim()} className={styles.sendBtn}>
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
              <p>Select a conversation from the left to start chatting, or go to the marketplace to message a seller.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}