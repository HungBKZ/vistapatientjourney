import { useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

import faqData from './fallback/faq.json'

// API configuration - Azure endpoint
const API_ENDPOINT = 'https://chatbotconversationapi.azurewebsites.net/api/Gemini/ask'

// Suggested quick-reply questions
const QUICK_SUGGESTIONS = [
  'Khám mắt tổng quát là gì?',
  'Triệu chứng cận thị',
  'Phòng ngừa đục thủy tinh thể',
  'Giá dịch vụ khám mắt',
  'Đặt lịch khám như thế nào?',
  'Giờ làm việc của Vista'
]

const VistaChatbot = () => {
  const faqFuse = useMemo(() => {
    return new Fuse(faqData, {
      keys: ['question'],
      threshold: 0.25,  // Stricter matching - lower = more exact
      distance: 40,     // Shorter distance for better accuracy
      minMatchCharLength: 3  // Minimum 3 characters to match
    })
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào! Mình là trợ lý Vista Eye Care. Bạn có thể hỏi mình các bệnh lý về mắt😊'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Anti-spam tracking
  const [messageTimestamps, setMessageTimestamps] = useState([])
  const [lastMessageTime, setLastMessageTime] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  
  const COOLDOWN_MS = 2000 // 2 seconds between messages
  const MAX_MESSAGES_PER_MINUTE = 10 // Max 10 messages per minute

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
  }

  // Small-talk / greeting intents (checked before FAQ search)
  const smallTalkAnswer = (text) => {
    const t = (text || '').toLowerCase().trim()
    
    // More precise matching - must be standalone phrases
    const isGreeting = /^(xin chào|chào|hello|hi|hey|chao)\s*!*$/i.test(t) || 
                       /^(xin chào|chào|hello|hi|hey|chao)\s+(bạn|mình|vista)/i.test(t)
    
    const isWhoAreYou = /^(bạn là ai|ai vậy|bot là ai|vista ai|care buddy là gì)/i.test(t)
    
    const isWhatCanYouDo = /^(giúp gì|làm gì được|chức năng|hỗ trợ gì|bạn làm được gì)/i.test(t)
    
    const isContact = /^(liên hệ|facebook|fanpage|contact)/i.test(t)
    
    const isAddress = /^(địa chỉ|ở đâu|chỗ nào|address)/i.test(t)

    // Greetings
    if (isGreeting) {
      return 'Xin chào! 👋 Chào mừng bạn đến với Vista Eye Care. Mình có thể tư vấn về:\n• Khám mắt tổng quát\n• Đo khúc xạ & cắt kính\n• Phẫu thuật LASIK\n• Điều trị các bệnh về mắt\n\nBạn quan tâm dịch vụ nào nhỉ? 😊'
    }

    // Who are you
    if (isWhoAreYou) {
      return 'Mình là trợ lý ảo của Vista Eye Care - Trung tâm nhãn khoa uy tín tại Cần Thơ. Mình có thể giúp bạn:\n✓ Tìm hiểu về bệnh lý mắt\n✓ Tư vấn dịch vụ khám & điều trị\n✓ Hướng dẫn đặt lịch hẹn\n✓ Giải đáp thắc mắc về giá cả'
    }

    // What can you do
    if (isWhatCanYouDo) {
      return 'Mình có thể hỗ trợ bạn:\n📋 Tư vấn các dịch vụ nhãn khoa\n👁️ Giải đáp về bệnh lý mắt\n📅 Hướng dẫn đặt lịch khám\n💰 Thông tin giá dịch vụ\n⏰ Giờ làm việc & địa chỉ\n\nBạn cần giúp gì nhỉ?'
    }

    // Contact / social
    if (isContact) {
      return 'Bạn có thể liên hệ Vista qua Facebook: https://www.facebook.com/profile.php?id=61581889931780 — đội ngũ sẽ phản hồi sớm nhất.'
    }

    // Address / location
    if (isAddress) {
      return 'Địa chỉ Vista: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000. Bạn có thể đặt lịch trước để giảm thời gian chờ.'
    }

    return null
  }

  const fallbackAnswer = (text) => {
    const normalized = text.trim().toLowerCase()
    const result = faqFuse.search(normalized)
    
    // More strict validation
    if (!result.length) return null
    
    const bestMatch = result[0]
    
    // Only accept if score is good enough (lower score = better match)
    // Fuse.js score ranges from 0 (perfect) to 1 (terrible)
    if (bestMatch.score && bestMatch.score > 0.4) {
      console.log('⚠️ FAQ match score too low:', bestMatch.score, 'for:', normalized)
      return null
    }
    
    // Check if query and matched question have similar length
    const queryWords = normalized.split(/\s+/).length
    const matchWords = bestMatch.item.question.toLowerCase().split(/\s+/).length
    const wordDiff = Math.abs(queryWords - matchWords)
    
    if (wordDiff > 3) {
      console.log('⚠️ FAQ word count too different:', queryWords, 'vs', matchWords)
      return null
    }
    
    console.log('✅ FAQ matched:', bestMatch.item.question, 'Score:', bestMatch.score)
    return bestMatch.item.answer
  }

  // Call Azure Gemini API
  const callGeminiAPI = async (userQuestion) => {
    console.log('🤖 Calling Azure Gemini API for:', userQuestion)

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: userQuestion,
          prompt: userQuestion
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API error:', response.status, errorText)
        
        // Handle quota exceeded error
        if (response.status === 429) {
          return '⚠️ Hệ thống AI đang quá tải. Vui lòng thử lại sau hoặc sử dụng các câu hỏi thường gặp bên dưới.'
        }
        
        return null
      }

      const data = await response.json()
      console.log('✅ API response:', data)
      
      // Parse Gemini format response
      const candidate = data?.candidates?.[0]
      
      if (!candidate) {
        console.warn('⚠️ No candidates in response:', data)
        return null
      }
      
      const parts = candidate?.content?.parts
      const aiText = parts?.[0]?.text
      
      if (!aiText) {
        console.warn('⚠️ No text found in response:', data)
        return null
      }
      
      console.log('📝 Extracted AI text:', aiText)
      return aiText
    } catch (error) {
      console.error('❌ API call failed:', error)
      return null
    }
  }

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const now = Date.now()
    
    // Check cooldown between messages
    if (now - lastMessageTime < COOLDOWN_MS) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⏱️ Vui lòng chờ 2 giây trước khi gửi tin nhắn tiếp theo để tránh spam hệ thống.'
        }
      ])
      return
    }
    
    // Check rate limit (max messages per minute)
    const oneMinuteAgo = now - 60000
    const recentMessages = messageTimestamps.filter(t => t > oneMinuteAgo)
    
    if (recentMessages.length >= MAX_MESSAGES_PER_MINUTE) {
      setIsBlocked(true)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '🚫 Bạn đã gửi quá nhiều tin nhắn! Vui lòng chờ 1 phút trước khi tiếp tục. Điều này giúp hệ thống hoạt động ổn định hơn.'
        }
      ])
      
      // Unblock after 1 minute
      setTimeout(() => {
        setIsBlocked(false)
        setMessageTimestamps([])
      }, 60000)
      
      return
    }
    
    // Update tracking
    setLastMessageTime(now)
    setMessageTimestamps([...recentMessages, now])

    const userMessage = { role: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    console.log('💬 User question:', userMessage.text)

    try {
      // 1. Check small-talk first
      const smallTalk = smallTalkAnswer(userMessage.text)
      if (smallTalk) {
        console.log('✅ Matched small-talk')
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: smallTalk }
          ])
          setIsLoading(false)
        }, 300)
        return
      }

      // 2. Check FAQ
      const faqResp = fallbackAnswer(userMessage.text)
      if (faqResp) {
        console.log('✅ Matched FAQ')
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: faqResp }
          ])
          setIsLoading(false)
        }, 300)
        return
      }

      // 3. Call Azure Gemini AI
      console.log('🔄 No FAQ match, calling Azure API...')
      const aiResponse = await callGeminiAPI(userMessage.text)
      
      if (aiResponse) {
        console.log('✅ Azure API responded')
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: aiResponse }
        ])
      } else {
        // 4. Final fallback
        console.log('⚠️ Azure API failed, using fallback')
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Xin lỗi, mình chưa có thông tin về câu hỏi này. Bạn có thể thử hỏi về:\n• Khám mắt tổng quát\n• Cận thị, viễn thị\n• Đục thủy tinh thể\n• Giá dịch vụ\n• Đặt lịch hẹn\n\nHoặc gọi hotline: 038 883 3157 để được tư vấn trực tiếp nhé! 😊'
          }
        ])
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 🙏'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6 max-md:bottom-20 max-md:right-4">
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            key="vista-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-80 sm:w-96 h-[600px] max-h-[85vh] bg-white/80 backdrop-blur-2xl border border-sky-200/60 rounded-3xl shadow-2xl shadow-sky-500/20 flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)'
            }}
          >
            {/* Header with gradient */}
            <div className="px-6 py-5 bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 relative overflow-hidden">
              {/* Animated glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl">
                    👁️
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/80 font-medium">Vista Eye Care</p>
                    <p className="text-base font-bold text-white">AI Assistant</p>
                  </div>
                </div>
                <Motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleChat}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Đóng Vista AI"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30" aria-live="polite">
              {messages.map((message, index) => (
                <Motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                      message.role === 'assistant'
                        ? 'bg-white/90 backdrop-blur-sm border border-sky-200/60 text-gray-800 shadow-sky-200/50'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/40'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.text}</div>
                  </div>
                </Motion.div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-2xl px-4 py-3 shadow-lg shadow-sky-200/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <Motion.div
                          className="w-2 h-2 bg-sky-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <Motion.div
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                        />
                        <Motion.div
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                        />
                      </div>
                      <span className="text-gray-500 text-xs">Đang soạn câu trả lời...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chips */}
            <div className="px-5 py-3 border-t border-sky-200/40 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <p className="text-xs text-gray-600 font-medium mb-2">💡 Gợi ý câu hỏi:</p>
              
              {/* Container: flex (mặc định là row), overflow-x-auto để cuộn ngang */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar touch-pan-x px-1">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <Motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    // Đã thêm: flex-shrink-0 và whitespace-nowrap
                    className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-sky-300/40 text-xs text-sky-700 hover:bg-sky-50 hover:border-sky-400/60 transition-all shadow-sm hover:shadow-md"
                  >
                    {suggestion}
                  </Motion.button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="px-5 pb-5 pt-3 flex items-center gap-2 border-t border-sky-200/40 bg-white/60 backdrop-blur-sm">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isBlocked}
                placeholder={isBlocked ? "Đang bị chặn do spam..." : "Nhập câu hỏi..."}
                className="flex-1 rounded-full bg-white/80 backdrop-blur-sm border border-sky-300/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Motion.button
                type="submit"
                disabled={!input.trim() || isLoading || isBlocked}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Motion.button>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <Motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-purple-500 shadow-xl shadow-sky-500/40 border-2 border-white/50 flex items-center justify-center text-2xl relative overflow-hidden group"
        aria-label="Mở Vista AI Assistant"
      >
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <Motion.span
          animate={isOpen ? { rotate: 180, scale: 0.9 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          ) : '👁️'}
        </Motion.span>
        
        {/* Pulse effect when closed */}
        {!isOpen && (
          <Motion.div
            className="absolute inset-0 rounded-full bg-sky-400"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Motion.button>
    </div>
  )
}

export default VistaChatbot
