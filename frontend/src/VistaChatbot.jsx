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
      threshold: 0.25,
      distance: 40,
      minMatchCharLength: 3
    })
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Xin chào! Mình là trợ lý Vista Eye Care. Bạn có thể hỏi mình các bệnh lý về mắt 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  
  // Anti-spam tracking
  const [messageTimestamps, setMessageTimestamps] = useState([])
  const [lastMessageTime, setLastMessageTime] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  
  const COOLDOWN_MS = 2000
  const MAX_MESSAGES_PER_MINUTE = 10

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
    
    const isGreeting = /^(xin chào|chào|hello|hi|hey|chao)\s*!*$/i.test(t) || 
                       /^(xin chào|chào|hello|hi|hey|chao)\s+(bạn|mình|vista)/i.test(t)
    const isWhoAreYou = /^(bạn là ai|ai vậy|bot là ai|vista ai|care buddy là gì)/i.test(t)
    const isWhatCanYouDo = /^(giúp gì|làm gì được|chức năng|hỗ trợ gì|bạn làm được gì)/i.test(t)
    const isContact = /^(liên hệ|facebook|fanpage|contact)/i.test(t)
    const isAddress = /^(địa chỉ|ở đâu|chỗ nào|address)/i.test(t)

    if (isGreeting) return 'Xin chào! 👋 Chào mừng bạn đến với Vista Eye Care. Mình có thể tư vấn về:\n• Khám mắt tổng quát\n• Đo khúc xạ & cắt kính\n• Phẫu thuật LASIK\n• Điều trị các bệnh về mắt\n\nBạn quan tâm dịch vụ nào nhỉ? 😊'
    if (isWhoAreYou) return 'Mình là trợ lý ảo của Vista Eye Care - Trung tâm nhãn khoa uy tín tại Cần Thơ. Mình có thể giúp bạn:\n✓ Tìm hiểu về bệnh lý mắt\n✓ Tư vấn dịch vụ khám & điều trị\n✓ Hướng dẫn đặt lịch hẹn\n✓ Giải đáp thắc mắc về giá cả'
    if (isWhatCanYouDo) return 'Mình có thể hỗ trợ bạn:\n📋 Tư vấn các dịch vụ nhãn khoa\n👁️ Giải đáp về bệnh lý mắt\n📅 Hướng dẫn đặt lịch khám\n💰 Thông tin giá dịch vụ\n⏰ Giờ làm việc & địa chỉ\n\nBạn cần giúp gì nhỉ?'
    if (isContact) return 'Bạn có thể liên hệ Vista qua Facebook: https://www.facebook.com/profile.php?id=61581889931780 — đội ngũ sẽ phản hồi sớm nhất.'
    if (isAddress) return 'Địa chỉ Vista: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000. Bạn có thể đặt lịch trước để giảm thời gian chờ.'

    return null
  }

  const fallbackAnswer = (text) => {
    const normalized = text.trim().toLowerCase()
    const result = faqFuse.search(normalized)
    
    if (!result.length) return null
    
    const bestMatch = result[0]
    
    if (bestMatch.score && bestMatch.score > 0.4) {
      return null
    }
    
    const queryWords = normalized.split(/\s+/).length
    const matchWords = bestMatch.item.question.toLowerCase().split(/\s+/).length
    const wordDiff = Math.abs(queryWords - matchWords)
    
    if (wordDiff > 3) {
      return null
    }
    
    return bestMatch.item.answer
  }

  // Call Azure Gemini API
  const callGeminiAPI = async (userQuestion) => {
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
        if (response.status === 429) {
          return '⚠️ Hệ thống AI đang quá tải. Vui lòng thử lại sau hoặc sử dụng các câu hỏi thường gặp bên dưới.'
        }
        return null
      }

      const data = await response.json()
      const candidate = data?.candidates?.[0]
      if (!candidate) return null
      
      const parts = candidate?.content?.parts
      const aiText = parts?.[0]?.text
      
      if (!aiText) return null
      
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
    
    if (now - lastMessageTime < COOLDOWN_MS) {
      setMessages((prev) => [...prev, { role: 'assistant', text: '⏱️ Vui lòng chờ 2 giây trước khi gửi tin nhắn tiếp theo để tránh spam hệ thống.' }])
      return
    }
    
    const oneMinuteAgo = now - 60000
    const recentMessages = messageTimestamps.filter(t => t > oneMinuteAgo)
    
    if (recentMessages.length >= MAX_MESSAGES_PER_MINUTE) {
      setIsBlocked(true)
      setMessages((prev) => [...prev, { role: 'assistant', text: '🚫 Bạn đã gửi quá nhiều tin nhắn! Vui lòng chờ 1 phút trước khi tiếp tục. Điều này giúp hệ thống hoạt động ổn định hơn.' }])
      
      setTimeout(() => {
        setIsBlocked(false)
        setMessageTimestamps([])
      }, 60000)
      return
    }
    
    setLastMessageTime(now)
    setMessageTimestamps([...recentMessages, now])

    const userMessage = { role: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const smallTalk = smallTalkAnswer(userMessage.text)
      if (smallTalk) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'assistant', text: smallTalk }])
          setIsLoading(false)
        }, 300)
        return
      }

      const faqResp = fallbackAnswer(userMessage.text)
      if (faqResp) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'assistant', text: faqResp }])
          setIsLoading(false)
        }, 300)
        return
      }

      const aiResponse = await callGeminiAPI(userMessage.text)
      
      if (aiResponse) {
        setMessages((prev) => [...prev, { role: 'assistant', text: aiResponse }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Xin lỗi, mình chưa có thông tin về câu hỏi này. Bạn có thể thử hỏi về:\n• Khám mắt tổng quát\n• Cận thị, viễn thị\n• Đục thủy tinh thể\n• Giá dịch vụ\n• Đặt lịch hẹn\n\nHoặc gọi hotline: 038 883 3157 để được tư vấn trực tiếp nhé! 😊'
          }
        ])
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 🙏' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 max-md:bottom-20 max-md:right-4 font-sans">
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            key="vista-chat-panel"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            // Container trong suốt với hiệu ứng kính mờ nhẹ (glassmorphism)
            className="w-[340px] sm:w-[380px] h-[600px] max-h-[80vh] bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-blue-600/90 backdrop-blur-sm flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner border border-white/20">
                  👁️
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">Vista Eye Care</h3>
                  <p className="text-xs text-blue-50 mt-0.5 flex items-center gap-1 opacity-90">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_4px_#4ade80]"></span>
                    Trợ lý AI đang trực tuyến
                  </p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Đóng Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area - Nền hoàn toàn trong suốt */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-transparent" aria-live="polite">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      message.role === 'assistant'
                        // Message của bot: Nền gradient từ trắng sang xanh dương nhẹ
                        ? 'bg-gradient-to-br from-white to-blue-50/90 border border-white/80 text-gray-800 rounded-2xl rounded-tl-sm'
                        // Message của user: Giữ màu xanh đậm để tạo độ tương phản tốt
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm border border-blue-400/50'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-white to-blue-50/90 border border-white/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <Motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <Motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                      <Motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chips - Nền trong suốt */}
            <div className="px-4 py-3 bg-transparent border-t border-white/40">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 text-[13px] text-gray-700 hover:bg-white/90 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form - Nền trong suốt */}
            <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 bg-transparent flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isBlocked}
                placeholder={isBlocked ? "Chờ một lát nhé..." : "Nhập tin nhắn..."}
                className="flex-1 bg-white/70 backdrop-blur-sm border border-white/80 rounded-full px-4 py-2.5 text-[14px] text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white/95 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 shadow-inner transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || isBlocked}
                className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400/80 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center text-2xl relative"
        aria-label="Mở Chatbot"
      >
        <Motion.span
          animate={isOpen ? { rotate: 90, scale: 0 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </Motion.span>
        
        <Motion.span
          animate={isOpen ? { rotate: 0, scale: 1 } : { rotate: -90, scale: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Motion.span>

        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </Motion.button>
    </div>
  )
}

export default VistaChatbot