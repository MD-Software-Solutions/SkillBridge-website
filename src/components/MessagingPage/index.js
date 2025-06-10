import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Send,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Bot,
  User,
  Clock,
  Settings,
  Plus,
  Pin,
  Trash2,
  MessageSquare,
  CheckCheck,
  Check,
  AlertCircle,
} from 'lucide-react'
import './index.scss'
import MenuInterior from '../MenuInterior'
import { authUtils } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'

const MessagingPage = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const [userData, setUserData] = useState(null)
  const [userList, setUserList] = useState([])
  const [messageStatus, setMessageStatus] = useState({})

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize component
  useEffect(() => {
    initializeComponent()
  }, [navigate])

  const initializeComponent = async () => {
    try {
      setLoading(true)
      setError('')

      // Get user info
      const user = JSON.parse(localStorage.getItem('user'))
      const username = user?.username

      if (!username) {
        navigate('/sign-in')
        return
      }

      const result = await authUtils.getUserInfo(username)

      if (result.success) {
        setUserData(result.data)
        
        // Initialize AI conversation first
        await initializeAIConversation(result.data.user_id)
        
        // Load conversations and users
        await Promise.all([
          loadConversations(result.data.user_id),
          loadUsers()
        ])
      } else if (result.error.includes('Authentication failed')) {
        navigate('/sign-in')
      }
    } catch (error) {
      console.error('Initialization error:', error)
      if (error.message.includes('Authentication failed')) {
        navigate('/sign-in')
      } else {
        setError('Failed to initialize messaging. Please refresh the page.')
      }
    } finally {
      setLoading(false)
    }
  }

  const initializeAIConversation = async (userId) => {
    try {
      await authUtils.authenticatedRequest(
        'http://localhost:4000/conversations/ai/initialize',
        'POST',
        { user_id: userId }
      )
    } catch (error) {
      console.error('Error initializing AI conversation:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await authUtils.authenticatedRequest(
        'http://localhost:4000/users'
      )
      setUserList(response || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const loadConversations = async (userId) => {
    try {
      const response = await authUtils.authenticatedRequest(
        `http://localhost:4000/conversations/${userId}`
      )

      if (!Array.isArray(response)) {
        console.error('Invalid response format:', response)
        setConversations([])
        return
      }

      // Transform the data to match your existing structure
      const transformedConversations = response.map((conv) => ({
        id: conv.conversation_id,
        name:
          conv.conversation_type === 'ai_assistant'
            ? 'AI Personal Assistant'
            : conv.participant_name || 'Unknown User',
        lastMessage: conv.last_message || 'No messages yet',
        timestamp: formatTimestamp(conv.last_message_time || conv.created_at),
        avatar:
          conv.conversation_type === 'ai_assistant' ? (
            <Bot className="icon-avatar ai" />
          ) : (
            <User className="icon-avatar user" />
          ),
        isOnline: conv.conversation_type === 'ai_assistant' ? true : Math.random() > 0.5, // Random for demo
        type: conv.conversation_type,
        unreadCount: parseInt(conv.unread_count) || 0,
        isPinned: conv.is_pinned || false,
        profileImage: conv.profile_img_url,
      }))

      // Sort by pinned status and then by timestamp
      transformedConversations.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.timestamp) - new Date(a.timestamp)
      })

      setConversations(transformedConversations)

      // Auto-select AI assistant conversation if no chat is selected
      if (!selectedChat) {
        const aiConversation = transformedConversations.find(
          (c) => c.type === 'ai_assistant'
        )
        if (aiConversation) {
          setSelectedChat(aiConversation.id)
          loadMessages(aiConversation.id)
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      setError('Failed to load conversations')
      setConversations([])
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      setError('')
      const response = await authUtils.authenticatedRequest(
        `http://localhost:4000/conversations/${conversationId}/messages`
      )

      if (!Array.isArray(response)) {
        console.error('Invalid messages response:', response)
        setMessages([])
        return
      }

      // Transform messages to match your existing structure
      const transformedMessages = response.map((msg) => ({
        id: msg.message_id,
        sender: msg.sender_name,
        content: msg.content,
        timestamp: formatTimestamp(msg.sent_at),
        isUser: msg.sender_type === 'user' && msg.sender_id === userData?.user_id,
        isAI: msg.sender_type === 'ai_assistant',
        messageType: msg.message_type,
        senderId: msg.sender_id,
        senderType: msg.sender_type,
        isRead: msg.is_read,
      }))

      setMessages(transformedMessages)

      // Mark messages as read
      if (userData?.user_id) {
        await markConversationAsRead(conversationId, userData.user_id)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setError('Failed to load messages')
      setMessages([])
    }
  }

  const markConversationAsRead = async (conversationId, userId) => {
    try {
      await authUtils.authenticatedRequest(
        `http://localhost:4000/conversations/${conversationId}/mark-read`,
        'POST',
        { user_id: userId }
      )
      
      // Update local state to reset unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Now'
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sendingMessage || !userData) return

    setSendingMessage(true)
    setError('')

    try {
      const selectedConversation = conversations.find(
        (c) => c.id === selectedChat
      )

      if (selectedConversation?.type === 'ai_assistant') {
        // Handle AI conversation
        await handleAIMessage()
      } else {
        // Handle regular user message
        const response = await authUtils.authenticatedRequest(
          `http://localhost:4000/conversations/${selectedChat}/messages`,
          'POST',
          {
            content: newMessage,
            sender_id: userData.user_id,
            sender_name: userData.account_username,
            sender_type: 'user',
          }
        )

        // Add message to local state immediately
        const newMsg = {
          id: response.data.message_id,
          sender: userData.account_username,
          content: newMessage,
          timestamp: formatTimestamp(new Date()),
          isUser: true,
          isAI: false,
          messageType: 'text',
          senderId: userData.user_id,
          senderType: 'user',
          isRead: false,
        }

        setMessages((prev) => [...prev, newMsg])
        setNewMessage('')

        // Update conversation list
        updateConversationLastMessage(selectedChat, newMessage)
        setSuccess('Message sent successfully')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleAIMessage = async () => {
    try {
      // Add user message first
      const userMessage = {
        id: Date.now(),
        sender: userData.account_username,
        content: newMessage,
        timestamp: formatTimestamp(new Date()),
        isUser: true,
        isAI: false,
        messageType: 'text',
        senderId: userData.user_id,
        senderType: 'user',
        isRead: true,
      }

      setMessages((prev) => [...prev, userMessage])
      const messageContent = newMessage
      setNewMessage('')

      // Send to AI endpoint
      const response = await authUtils.authenticatedRequest(
        'http://localhost:4000/ai/chat',
        'POST',
        {
          message: messageContent,
          conversation_id: selectedChat,
          user_id: userData.user_id,
          user_name: userData.account_username,
        }
      )

      // Add AI response
      const aiMessage = {
        id: response.message_id,
        sender: 'AI Personal Assistant',
        content: response.response,
        timestamp: formatTimestamp(new Date()),
        isUser: false,
        isAI: true,
        messageType: 'text',
        senderId: null,
        senderType: 'ai_assistant',
        isRead: true,
      }

      setMessages((prev) => [...prev, aiMessage])
      updateConversationLastMessage(selectedChat, response.response)
      setSuccess('AI response received')
    } catch (error) {
      console.error('Error with AI message:', error)
      setError('Failed to get AI response')
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'AI Personal Assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: formatTimestamp(new Date()),
        isUser: false,
        isAI: true,
        messageType: 'text',
        senderId: null,
        senderType: 'ai_assistant',
        isRead: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const updateConversationLastMessage = (conversationId, lastMessage) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage, timestamp: formatTimestamp(new Date()) }
          : conv
      )
    )
  }

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId)
    loadMessages(chatId)
    setShowUserSearch(false)
    setSearchTerm('')
    setError('')
    setSuccess('')
  }

  const handleStartConversation = async (targetUser) => {
    try {
      setError('')
      // Create new conversation with selected user
      const response = await authUtils.authenticatedRequest(
        'http://localhost:4000/conversations',
        'POST',
        {
          user_id: userData.user_id,
          target_user_id: targetUser.user_id,
          conversation_type: 'direct'
        }
      )

      // Check if conversation already exists
      if (response.conversation_id) {
        // Add new conversation to local state if it doesn't exist
        const existingConv = conversations.find(c => c.id === response.conversation_id)
        
        if (!existingConv) {
          const newConversation = {
            id: response.conversation_id,
            name: targetUser.account_username || targetUser.full_name || 'Unknown User',
            lastMessage: 'No messages yet',
            timestamp: formatTimestamp(new Date()),
            avatar: <User className="icon-avatar user" />,
            isOnline: Math.random() > 0.5, // Random for demo
            type: 'direct',
            unreadCount: 0,
            isPinned: false,
            profileImage: targetUser.profile_img_url,
          }

          setConversations(prev => [newConversation, ...prev])
        }

        setSelectedChat(response.conversation_id)
        setMessages([])
        setShowUserSearch(false)
        setSearchTerm('')
        setSuccess('Conversation started successfully')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      setError('Failed to start conversation')
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowUserSearch(value.length > 0)
  }

  const handleSearchFocus = () => {
    if (searchTerm.length > 0) {
      setShowUserSearch(true)
    }
  }

  const handleSearchBlur = () => {
    // Delay hiding to allow click on user items
    setTimeout(() => setShowUserSearch(false), 200)
  }

  const handlePinConversation = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId)
      const newPinStatus = !conversation.isPinned
      
      await authUtils.authenticatedRequest(
        `http://localhost:4000/conversations/${conversationId}/pin`,
        'PUT',
        { is_pinned: newPinStatus }
      )

      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, isPinned: newPinStatus }
            : conv
        ).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return new Date(b.timestamp) - new Date(a.timestamp)
        })
      )
      
      setSuccess(`Conversation ${newPinStatus ? 'pinned' : 'unpinned'} successfully`)
    } catch (error) {
      console.error('Error pinning conversation:', error)
      setError('Failed to update pin status')
    }
  }

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return

    try {
      await authUtils.authenticatedRequest(
        `http://localhost:4000/conversations/${conversationId}`,
        'DELETE'
      )

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))
      
      // If deleted conversation was selected, clear selection
      if (selectedChat === conversationId) {
        setSelectedChat(null)
        setMessages([])
      }
      
      setSuccess('Conversation deleted successfully')
    } catch (error) {
      console.error('Error deleting conversation:', error)
      setError('Failed to delete conversation')
    }
  }

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter users for search (exclude current user and existing conversations)
  const filteredUsers = userList.filter(user => {
    if (user.user_id === userData?.user_id) return false // Exclude current user
    
    const searchMatch = searchTerm.length === 0 || 
      user.account_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.personal_email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.name === user.account_username || conv.name === user.full_name
    )
    
    return searchMatch && !existingConversation
  })

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedChat
  )

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  if (loading) {
    return (
      <div className="messaging-page-wrapper">
        <MenuInterior />
        <div className="messaging-container">
          <div className="loading-state">
            <MessageSquare className="loading-icon" />
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="messaging-page-wrapper">
      <MenuInterior />
      <div className="messaging-container">
        {/* Error/Success Messages */}
        {error && (
          <div className="message-banner error">
            <AlertCircle className="banner-icon" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="message-banner success">
            <Check className="banner-icon" />
            <span>{success}</span>
          </div>
        )}

        {/* Sidebar */}
        <div className="sidebar">
          {/* User Info Section */}
          <div className="user-info-section">
            <div className="user-info">
              <Avatar
                image={
                  userData?.profile_img_url ||
                  'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png'
                }
                className="mr-2"
                size="xlarge"
                shape="circle"
              />
              <div className="user-details">
                <h3 className="user-name">{userData?.account_username}</h3>
                <p className="user-email">{userData?.personal_email}</p>
              </div>
            </div>
            <button className="user-settings-button">
              <Settings />
            </button>
          </div>

          {/* Header */}
          <div className="sidebar-header">
            <h1 className="sidebar-title">Messages</h1>

            {/* Search */}
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations or start new chat..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="search-input"
              />
              {showUserSearch && filteredUsers.length > 0 && (
                <div className="user-search-dropdown">
                  <div className="dropdown-header">
                    <Plus className="plus-icon" />
                    <span>Start new conversation</span>
                  </div>
                  {filteredUsers.slice(0, 5).map(user => (
                    <div
                      key={user.user_id}
                      className="user-search-item"
                      onClick={() => handleStartConversation(user)}
                    >
                      <div className="avatar">
                        <User className="icon-avatar" />
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.account_username || user.full_name}
                        </div>
                        <div className="user-email">{user.personal_email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="conversations-list">
            <div className="conversation-section">
              <div className="section-header">
                <span>All Conversations</span>
              </div>
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedChat === conversation.id ? 'selected' : ''
                  }`}
                >
                  <div 
                    className="conversation-main"
                    onClick={() => handleChatSelect(conversation.id)}
                  >
                    <div className="avatar-container">
                      <div
                        className={`avatar ${
                          conversation.type === 'ai_assistant' ? 'ai' : 'user'
                        }`}
                      >
                        {conversation.profileImage ? (
                          <img src={conversation.profileImage} alt={conversation.name} />
                        ) : (
                          conversation.avatar
                        )}
                      </div>
                      {conversation.isOnline && (
                        <div className="online-indicator"></div>
                      )}
                    </div>
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <h3 className="conversation-name">
                          {conversation.isPinned && <Pin className="pin-icon" />}
                          {conversation.name}
                        </h3>
                        <span className="conversation-timestamp">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="conversation-preview">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="unread-badge">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  {/* Conversation Actions */}
                  <div className="conversation-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePinConversation(conversation.id)
                      }}
                      title={conversation.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className={conversation.isPinned ? 'pinned' : ''} />
                    </button>
                    {conversation.type !== 'ai_assistant' && (
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conversation.id)
                        }}
                        title="Delete conversation"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="avatar-container">
                    <div
                      className={`avatar ${
                        selectedConversation.type === 'ai_assistant'
                          ? 'ai'
                          : 'user'
                      }`}
                    >
                      {selectedConversation.profileImage ? (
                        <img src={selectedConversation.profileImage} alt={selectedConversation.name} />
                      ) : (
                        selectedConversation.avatar
                      )}
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="online-indicator"></div>
                    )}
                  </div>
                  <div className="chat-user-details">
                    <h2 className="chat-user-name">
                      {selectedConversation.name}
                    </h2>
                    <p className="chat-user-status">
                      {selectedConversation.isOnline
                        ? 'Online'
                        : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="chat-actions">
                  {selectedConversation.type !== 'ai_assistant' && (
                    <>
                      <button className="action-button">
                        <Phone />
                      </button>
                      <button className="action-button">
                        <Video />
                      </button>
                    </>
                  )}
                  <button className="action-button">
                    <Info />
                  </button>
                  <button className="action-button">
                    <MoreHorizontal />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.isUser
                        ? 'message-sent'
                        : message.isAI
                        ? 'message-ai'
                        : 'message-received'
                    }`}
                  >
                    <div className="message-bubble">
                      <p className="message-content">{message.content}</p>
                      <div className="message-meta">
                        <Clock className="message-time-icon" />
                        <span className="message-timestamp">
                          {message.timestamp}
                        </span>
                        {message.isUser && (
                          <div className="message-status">
                            {message.isRead ? (
                              <CheckCheck className="read-icon" />
                            ) : (
                              <Check className="sent-icon" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <div className="message-input-wrapper">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="message-input"
                    disabled={sendingMessage}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="send-button"
                  >
                    <Send />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <MessageSquare />
                </div>
                <h3 className="empty-state-title">No conversation selected</h3>
                <p className="empty-state-description">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagingPage