import { useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

import faqData from './fallback/faq.json'

// Suggested quick-reply questions
const QUICK_SUGGESTIONS = [
  'Xin chào',
  'Bạn là ai?',
  'Bạn có thể giúp gì?',
  'Studio 360 là gì?',
  'Đặt lịch khám mắt',
  'Quizventure hoạt động ra sao?'
]

const VistaChatbot = () => {
  const faqFuse = useMemo(() => {
    return new Fuse(faqData, {
      keys: ['question'],
      threshold: 0.4,
      distance: 80
    })
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Chào bạn! 👋 Mình là Vista Care Buddy. Bạn có thể hỏi mình về bệnh lý mắt, Studio 360°, Quizventure hoặc các dịch vụ Vista nhé!'
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

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
    const includesAny = (arr) => arr.some((k) => t.includes(k))

    // Greetings
    if (includesAny(['xin chào', 'chào', 'hello', 'hi', 'hey', 'chao'])) {
      return 'Xin chào! 👋 Mình là Vista Care Buddy. Bạn muốn tìm hiểu về Quizventure, Studio 360°, kiến thức nhãn khoa hay đặt lịch khám không?'
    }

    // Who are you
    if (includesAny(['bạn là ai', 'ai vậy', 'bot là ai', 'vista ai', 'care buddy là gì'])) {
      return 'Mình là Vista Care Buddy – trợ lý ảo của Vista Patient Journey. Mình có thể trả lời câu hỏi thường gặp về mắt, hướng dẫn sử dụng app, Studio 360° và Vista Quizventure.'
    }

    // What can you do
    if (includesAny(['giúp gì', 'làm gì được', 'chức năng', 'hỗ trợ gì'])) {
      return 'Mình có thể: trả lời câu hỏi thường gặp, gợi ý nội dung học, giới thiệu Studio 360°, hướng dẫn chơi Quizventure và cách đặt lịch khám. Bạn hỏi mình bất cứ điều gì nhé!'
    }

    // Contact / social
    if (includesAny(['liên hệ', 'facebook', 'fanpage'])) {
      return 'Bạn có thể liên hệ Vista qua Facebook: https://www.facebook.com/profile.php?id=61581889931780 — đội ngũ sẽ phản hồi sớm nhất.'
    }

    // Address / location
    if (includesAny(['địa chỉ', 'ở đâu', 'chỗ nào'])) {
      return 'Địa chỉ Vista: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000. Bạn có thể đặt lịch trước để giảm thời gian chờ.'
    }

    return null
  }

  const fallbackAnswer = (text) => {
    const normalized = text.trim().toLowerCase()
    const result = faqFuse.search(normalized)
    if (!result.length) return null
    return result[0].item.answer
  }

  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

  // Small-talk first, then FAQ
  const smallTalk = smallTalkAnswer(userMessage.text)
  const faqResp = smallTalk || fallbackAnswer(userMessage.text)
    
    setTimeout(() => {
      if (faqResp) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: faqResp }
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Xin lỗi, mình chưa có thông tin về câu hỏi này. Bạn có thể thử hỏi về: đau mắt đỏ, cận thị, Studio 360°, Quizventure, hoặc đặt lịch khám mắt nhé! 😊'
          }
        ])
      }
    }, 300)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            key="vista-chat-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 max-h-[70vh] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 bg-gradient-to-r from-sky-500/20 via-blue-500/10 to-purple-500/20 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-sky-300">Vista AI</p>
                <p className="text-base font-semibold text-white">Care Buddy trực tuyến</p>
              </div>
              <Motion.button
                whileHover={{ rotate: 90 }}
                onClick={toggleChat}
                className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                aria-label="Đóng Vista AI"
              >
                ×
              </Motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                      message.role === 'assistant'
                        ? 'bg-slate-800/80 border border-sky-500/30 text-slate-100'
                        : 'bg-sky-500 text-white shadow-sky-500/40'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chips */}
            <div className="px-5 py-2 border-t border-white/10 bg-slate-900/60">
              <p className="text-xs text-slate-400 mb-2">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <Motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSuggestion(suggestion)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 rounded-full bg-slate-800/60 border border-sky-500/20 text-xs text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/40 transition-colors"
                  >
                    {suggestion}
                  </Motion.button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-white/10 bg-slate-900/80">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Hỏi Vista Care Buddy về mắt, bài học, Studio 360°..."
                className="flex-1 rounded-2xl bg-slate-800/60 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />
              <Motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi
              </Motion.button>
            </form>
          </Motion.div>
        )}
      </AnimatePresence>

  <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 shadow-xl shadow-sky-500/40 border border-white/20 flex items-center justify-center text-2xl"
        aria-label="Mở Vista Care Buddy"
      >
        {isOpen ? '−' : '👁️'}
  </Motion.button>
    </div>
  )
}

export default VistaChatbot
