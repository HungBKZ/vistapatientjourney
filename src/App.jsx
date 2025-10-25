// EyeCare Quizzle – Landing Page (React + Tailwind, Enhanced Liquid Glass + Motion)
// Yêu cầu: npm i framer-motion

import { useState } from 'react'
import { motion } from 'framer-motion'

/* ================= Enhanced Shared UI ================= */
const GlassCard = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'glass-morphism',
    strong: 'glass-morphism-strong',
    subtle: 'glass-morphism-subtle'
  }
  
  return (
    <motion.div 
      className={`rounded-2xl ${variants[variant]} hover-lift transition-all-300 ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(31, 38, 135, 0.4)" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const GlassButton = ({ children, href, onClick, variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all-300 relative overflow-hidden'
  const styles = {
    primary: 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-glass-lg hover:shadow-glow-blue shimmer-effect',
    ghost: 'glass-morphism text-slate-800 hover:text-sky-700 border-white/30',
    accent: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white shadow-glass-lg hover:shadow-glow-purple shimmer-effect'
  }
  const Comp = href ? 'a' : 'button'
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Comp 
        href={href} 
        onClick={onClick} 
        className={`${base} ${styles[variant]} ${className}`}
        {...props}
      >
        {children}
      </Comp>
    </motion.div>
  )
}

const SectionTitle = ({ kicker, title, subtitle, className = '' }) => (
  <motion.div 
    className={`text-center max-w-3xl mx-auto ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {kicker && (
      <motion.div 
        className="inline-flex items-center gap-2 rounded-full glass-morphism px-4 py-2 text-sm font-medium text-sky-800 mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"></div>
        {kicker}
      </motion.div>
    )}
    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient mb-4 text-balance letter-spacing-wide">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance letter-spacing-wide">{subtitle}</p>
    )}
  </motion.div>
)

/* ================= Enhanced Navbar ================= */
function Nav() {
  const [open, setOpen] = useState(false)
  const nav = [
    ['#features','Tính năng'],
    ['#journey','Hành trình'],
    ['#rewards','Quà tặng'],
    ['#knowledge','Kiến thức'],
    ['#studio','Studio 360°']
  ]
  return (
    <motion.header 
      className="sticky top-0 z-50 glass-morphism-strong border-b border-white/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.a 
            href="#" 
            className="flex items-center gap-3 font-display font-bold text-slate-800"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-glass text-lg">
                👁️
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-400 opacity-20 blur-sm"></div>
            </div>
            <span className="text-xl">EyeCare Quizzle</span>
          </motion.a>
          
          <nav className="hidden md:flex items-center gap-8">
            {nav.map(([href, label], i) => (
              <motion.a 
                key={href} 
                href={href} 
                className="text-slate-700 hover:text-sky-700 font-medium transition-all-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all-300"></span>
              </motion.a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <GlassButton href="#cta" variant="primary">
              Đăng ký Beta
            </GlassButton>
          </div>
          
          <motion.button 
            className="md:hidden p-2 rounded-lg glass-morphism-subtle"
            onClick={() => setOpen(v=>!v)} 
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 text-slate-800">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </motion.button>
        </div>
      </div>
      
      {open && (
        <motion.div 
          className="md:hidden border-t border-white/30 glass-morphism-strong"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            {nav.map(([href,label]) => (
              <a key={href} href={href} onClick={()=>setOpen(false)} className="block text-slate-700 hover:text-sky-700 font-medium transition-all-300">
                {label}
              </a>
            ))}
            <a href="#cta" className="block font-semibold text-sky-700 pt-2 border-t border-white/20" onClick={()=>setOpen(false)}>
              Nhận bản Beta
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

/* ================= Enhanced Hero Section ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50"></div>
      
      {/* Floating Orbs */}
      <div className="absolute -top-32 -right-20 w-96 h-96 floating-orb opacity-60"></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 floating-orb-delayed opacity-40"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 floating-orb opacity-20"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div 
            className="inline-flex items-center gap-3 rounded-full glass-morphism px-4 py-2 text-sm font-medium text-sky-800 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            Y tế · Nhãn khoa · Gamification
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-gradient mb-6 leading-tight text-balance letter-spacing-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Học về chăm sóc mắt qua trò chơi & kiến thức tương tác
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed text-balance letter-spacing-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Chơi quiz <span className="font-semibold text-gradient">Quizzle</span>, nghe podcast, xem video, tích điểm đổi quà và đặt lịch khám — tất cả trong một ứng dụng.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <GlassButton href="#cta" variant="primary" className="text-lg px-8 py-4">
              Đăng ký trải nghiệm
            </GlassButton>
            <GlassButton href="#features" variant="ghost" className="text-lg px-8 py-4">
              Xem tính năng
            </GlassButton>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative">
            <GlassCard variant="strong" className="p-8">
              <div className="aspect-[9/19] rounded-3xl glass-morphism border border-white/40 shadow-glass-xl grid place-items-center relative overflow-hidden">
                {/* Phone Screen Content */}
                <div className="text-center p-6">
                  <motion.div 
                    className="text-7xl mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    📱
                  </motion.div>
                  <div className="font-display font-bold text-xl text-slate-800 mb-2">EyeCare Quizzle App</div>
                  <div className="text-sm text-slate-600">Quiz · Podcast · Video · Quà tặng · Nhắc nhở</div>
                </div>
                
                {/* Floating UI Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ['🧩','Quizzle','Thử thách tăng dần'],
                  ['🎧','Podcast','Bác sĩ chia sẻ'],
                  ['🎁','Đổi quà','Voucher · Quà']
                ].map(([icon, t, d], i) => (
                  <motion.div 
                    key={t}
                    className="rounded-xl glass-morphism p-4 text-center hover-lift"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-semibold text-sm">{t}</div>
                    <div className="text-xs text-slate-600">{d}</div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
            
            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 opacity-60"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-60"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ================= Enhanced Features Section ================= */
function Features() {
  const items = [
    { 
      icon: '🧩', 
      title: 'Mini Game "Quizzle"', 
      desc: 'Quiz đúng/sai, độ khó tăng dần, huy hiệu & leaderboard. Không cho điểm miễn phí.',
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      icon: '🎁', 
      title: 'Tích điểm đổi quà', 
      desc: 'Đổi điểm lấy voucher dịch vụ, kính và quà thương hiệu trong thư viện.',
      gradient: 'from-violet-400 to-purple-500'
    },
    { 
      icon: '🎧', 
      title: 'Podcast · Video · Bài viết', 
      desc: 'Nội dung cho người trẻ (cận/loạn) và người lớn tuổi (đục thủy tinh thể, phaco).',
      gradient: 'from-orange-400 to-red-500'
    },
    { 
      icon: '⏰', 
      title: 'Nhắc nhở chăm sóc', 
      desc: 'Thông báo định kỳ sau phẫu thuật hoặc trong quá trình điều trị.',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ]
  
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50/30 to-white"></div>
      <div className="absolute top-20 left-10 w-32 h-32 floating-orb opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 floating-orb-delayed opacity-15"></div>
      
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle 
          kicker="Tính năng" 
          title="Tất cả trong một ứng dụng" 
          subtitle="Học – chơi – chăm sóc – gắn bó với trải nghiệm mượt mà và thú vị"
          className="mb-16"
        />
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <GlassCard 
                variant="default" 
                className="p-8 text-center group relative overflow-hidden h-full"
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(31, 38, 135, 0.4)"
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-all-500`}></div>
                
                {/* Icon with Animation */}
                <motion.div 
                  className="relative text-5xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="font-display font-bold text-lg text-slate-800 mb-4 group-hover:text-gradient transition-all-300">
                  {item.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-balance">
                  {item.desc}
                </p>
                
                {/* Decorative Element */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= Journey ================= */
function Journey() {
  const steps = [
    ['Mở App','Đăng nhập, nhận gợi ý nội dung phù hợp hồ sơ.'],
    ['Chơi Quizzle','Quiz đúng/sai, độ khó tăng dần, mở khoá huy hiệu.'],
    ['Nghe Podcast / Xem Video','Kiến thức cô đọng, dễ hiểu, bác sĩ dẫn.'],
    ['Tích điểm','Điểm thưởng theo hành vi học – chơi – chăm sóc.'],
    ['Đổi quà','Voucher dịch vụ, kính, quà sức khỏe, tư vấn.'],
    ['Đặt lịch & Nhắc nhở','Đặt lịch khám; nhắc chăm sóc sau điều trị.']
  ]
  return (
    <section id="journey" className="py-16 lg:py-24 bg-gradient-to-b from-white to-sky-50">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Hành trình" title="Từ chơi đến chăm sóc toàn diện" subtitle="Dòng chảy liền mạch thúc đẩy gắn bó dài hạn" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {steps.map(([t,d], i) => (
              <motion.div key={t} initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4, delay:i*0.04}}>
                <GlassCard className="relative p-6">
                  <div className="absolute -top-3 -left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-bold border border-white/40">{i+1}</div>
                  <h4 className="font-semibold text-slate-900">{t}</h4>
                  <p className="mt-1 text-sm text-slate-600">{d}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Use case điển hình</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Sinh viên cận thị chơi 10 câu Quizzle/ngày để nâng cấp huy hiệu.</li>
              <li>Người nhà bệnh nhân phaco xem video “Quy trình mổ ra sao?”.</li>
              <li>Tích đủ điểm đổi voucher kính → quay lại khám định kỳ.</li>
            </ul>
            <GlassButton href="#rewards" className="mt-4">Khám phá quà tặng</GlassButton>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

/* ================= Rewards ================= */
function Rewards() {
  const items = [
    ['👓','Voucher kính','Ưu đãi tròng & gọng, kiểm tra thị lực.'],
    ['🎟️','Dịch vụ ưu đãi','Giảm phí khám, chẩn đoán, tư vấn trực tuyến.'],
    ['🩺','Buổi tư vấn','Đặt lịch tư vấn 1-1 với bác sĩ.'],
    ['🎁','Quà thương hiệu','Bộ chăm sóc mắt, quà sức khỏe.']
  ]
  return (
    <section id="rewards" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Thư viện quà tặng" title="Học nhiều – quà nhiều – gắn bó lâu" subtitle="Quà gắn chặt với hành vi học – chơi – khám – chăm sóc" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([icon, t, d], i) => (
            <motion.div key={t} initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4, delay:i*0.05}}>
              <GlassCard className="p-6 text-center hover:scale-[1.02] transition-transform">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 font-semibold text-sky-800">{t}</h3>
                <p className="mt-2 text-sm text-slate-600">{d}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">Mục tiêu: tạo vòng lặp thưởng – học – gắn bó, duy trì tương tác dài hạn.</p>
      </div>
    </section>
  )
}

/* ================= Knowledge ================= */
function Knowledge() {
  const [open, setOpen] = useState({ a:false, b:false, c:false })
  const toggle = (k) => setOpen(s => ({...s, [k]: !s[k]}))
  return (
    <section id="knowledge" className="py-16 lg:py-24 bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Kiến thức" title="Podcast · Video · Bài viết" subtitle="Giọng dẫn, độ dài, chủ đề – tham chiếu từ các podcast y tế phổ biến." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Playlist gợi ý</h4>
            <ul className="mt-3 space-y-3 text-sm text-slate-700 list-disc pl-5">
              <li>Người trẻ: cận/loạn – vệ sinh thị giác, thói quen màn hình.</li>
              <li>Người lớn tuổi: đục thủy tinh thể, phaco – trước & sau mổ.</li>
              <li>Hỏi đáp cùng bác sĩ: “Đục thủy tinh thể là gì?”, “Quy trình mổ ra sao?”.</li>
            </ul>
            <div className="mt-4 inline-flex rounded-xl bg-white/30 border border-white/40 px-3 py-1 text-xs text-slate-700 backdrop-blur">🎙️ Podcast · 🎬 Video · 📄 Bài viết</div>
          </GlassCard>
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">FAQ nhanh</h4>
            <div className="mt-3 divide-y divide-white/30">
              {[
                ['a','Phẫu thuật phaco là gì?','Phaco: tán nhuyễn thủy tinh thể đục bằng siêu âm, thay kính nội nhãn, hồi phục nhanh.'],
                ['b','Sau mổ cần lưu ý gì?','Tuân thủ thuốc, hạn chế dụi mắt, tái khám đúng lịch. App sẽ gửi nhắc nhở định kỳ.'],
                ['c','Quiz có khó không?','Độ khó tăng dần, có câu đánh đố. Không cho điểm miễn phí, cần hiểu kiến thức để chinh phục.']
              ].map(([k, q, a]) => (
                <button key={k} className="w-full py-3 text-left" onClick={() => toggle(k)}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{q}</span>
                    <span>{open[k] ? '−' : '+'}</span>
                  </div>
                  {open[k] && <p className="mt-2 text-sm text-slate-600">{a}</p>}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

/* ================= Studio 360° ================= */
function Studio() {
  return (
    <section id="studio" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Studio 360°" title="Trải nghiệm vật lý & online (kỳ tới)" subtitle="Không gian mô phỏng phòng mổ; phiên bản ảo 360° tích hợp vào app." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Yêu cầu kỹ thuật</h4>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-2">
              <li>Khảo sát kiến trúc bệnh viện → thiết kế tour hợp lý.</li>
              <li>Bố cục, điểm chạm, hoạt động tương tác.</li>
              <li>Prototype 360° online tích hợp app.</li>
            </ul>
          </GlassCard>
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Phòng mô phỏng</h4>
            <p className="mt-2 text-sm text-slate-700">Phòng mổ cận cho người trẻ, phòng phaco cho người già – nút tương tác “đục thủy tinh thể là gì?”, “quy trình mổ ra sao?”.</p>
            <div className="mt-4 rounded-xl bg-white/20 border border-white/30 p-4 text-sm">🧭 Coming soon: Prototype 360°</div>
          </GlassCard>
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Lộ trình</h4>
            <GlassButton href="#cta" className="mt-4">Nhận cập nhật</GlassButton>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

/* ================= Team / Industry ================= */
function TeamIndustry() {
  return (
    <section id="team" className="py-16 lg:py-24 bg-gradient-to-b from-white to-sky-50">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle kicker="Định hướng triển khai" title="Gắn với ngành nhãn khoa để đủ tiêu chuẩn đề tài tốt nghiệp" subtitle="Dự án tác động trực tiếp đến hành vi học – khám – chăm sóc trong bối cảnh bệnh viện nhãn khoa." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Nhóm thực hiện</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>Giảng viên hướng dẫn: Thầy Đức</li>
              <li>Nhóm sinh viên: Product · Content · Tech</li>
              <li>Đối tác: Bệnh viện nhãn khoa (dự kiến)</li>
            </ul>
          </GlassCard>
          <GlassCard className="p-6">
            <h4 className="font-semibold text-slate-900">Tiêu chí học kỳ này</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>App hoạt động: Quizzle, thư viện quà, nội dung kiến thức.</li>
              <li>Luồng: play → learn → earn → care → book.</li>
              <li>Đo lường: thời gian học, số quiz/ngày, điểm đổi quà, tỉ lệ đặt lịch.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

/* ================= Enhanced CTA Section ================= */
function CTA() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const ENDPOINT = (import.meta.env.VITE_APPS_SCRIPT_URL ?? '').trim()
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  // Cảnh báo nếu cấu hình sai URL Apps Script (dùng echo thay vì /exec)
  const IS_ECHO = ENDPOINT.includes('script.googleusercontent.com/macros/echo')
  if (IS_ECHO) {
    console.warn('VITE_APPS_SCRIPT_URL đang trỏ tới googleusercontent/macros/echo. Hãy dùng URL Web App kết thúc bằng /exec từ Apps Script Deployments.')
  }

  function loadRecaptcha() {
    return new Promise((resolve, reject) => {
      if (!SITE_KEY) return resolve(null)
      if (window.grecaptcha) return resolve(window.grecaptcha)
      const existing = document.getElementById('recaptcha-v3')
      if (existing) {
        const start = Date.now()
        const check = () => {
          if (window.grecaptcha) return resolve(window.grecaptcha)
          if (Date.now() - start > 2000) return resolve(null) // timeout fallback
          setTimeout(check, 100)
        }
        return check()
      }
      const s = document.createElement('script')
      s.id = 'recaptcha-v3'
      s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
      s.async = true
      s.onload = () => resolve(window.grecaptcha || null)
      s.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
      document.head.appendChild(s)
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!email) return
    if (!ENDPOINT) {
      console.error('Thiếu cấu hình VITE_APPS_SCRIPT_URL. Thêm URL Web App (/exec) vào .env.local hoặc biến môi trường khi deploy.')
      setStatus('error')
      return
    }
    try {
      setStatus('loading')
      let token = null
      if (SITE_KEY) {
        try {
          const grecaptcha = await loadRecaptcha()
          if (grecaptcha && grecaptcha.ready) {
            const tokenPromise = new Promise((resolve) => {
              grecaptcha.ready(() => {
                grecaptcha.execute(SITE_KEY, { action: 'cta_submit' }).then(resolve)
              })
            })
            // Timeout if reCAPTCHA takes too long
            token = await Promise.race([
              tokenPromise,
              new Promise((resolve) => setTimeout(() => resolve(null), 6000))
            ])
          }
        } catch {
          // ignore reCAPTCHA errors; allow submission without token
        }
      }
      // Nếu có cấu hình reCAPTCHA nhưng không lấy được token → dừng submit để tránh lỗi invalid-input-response
      if (SITE_KEY && !token) {
        console.error('Không lấy được reCAPTCHA token (timeout/missing). Kiểm tra domain whitelist trên Admin Console và site key/secret.')
        setStatus('error')
        return
      }
      const ac = new AbortController()
      const to = setTimeout(() => ac.abort(), 8000)
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors', // Apps Script thường không bật CORS → dùng no-cors (opaque)
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ email, name, source: 'landing-beta', ua: navigator.userAgent, token, action: 'cta_submit' }),
        signal: ac.signal
      })
      clearTimeout(to)
      // Với no-cors không đọc được response → coi như thành công
      setStatus('success')
      setName('')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="cta" className="py-20 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-indigo-50/30 to-purple-50/50"></div>
      <div className="absolute top-10 right-20 w-64 h-64 floating-orb opacity-20"></div>
      <div className="absolute bottom-10 left-20 w-48 h-48 floating-orb-delayed opacity-15"></div>
      
      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard variant="strong" className="p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"></div>
            
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-60"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            
            <motion.h3 
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient mb-6 text-balance letter-spacing-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Tham gia trải nghiệm phiên bản thử nghiệm
            </motion.h3>
            
            <motion.p 
              className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed text-balance letter-spacing-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Để lại thông tin, chúng tôi sẽ gửi link bản Beta cùng hướng dẫn cài đặt đầy đủ.
            </motion.p>

            <motion.form
              onSubmit={onSubmit}
              className="max-w-lg mx-auto space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.input 
                  type="text" 
                  name="name" 
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full rounded-2xl glass-morphism px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all-300"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full rounded-2xl glass-morphism px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all-300"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <motion.div className="pt-4">
                <GlassButton 
                  variant="primary" 
                  className={`w-full text-lg px-8 py-4 font-bold ${status==='loading' ? 'opacity-70 pointer-events-none' : ''}`}
                  type="submit"
                >
                  <span className="flex items-center justify-center gap-2">
                    {status==='loading' ? 'Đang gửi…' : 'Nhận link Beta ngay'}
                    {status!=='loading' && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    )}
                  </span>
                </GlassButton>
              </motion.div>
            </motion.form>

            {status==='success' && (
              <p className="mt-4 text-emerald-600 text-sm">Đăng ký thành công! Vui lòng kiểm tra email khi có bản Beta.</p>
            )}
            {status==='error' && (
              <p className="mt-4 text-rose-600 text-sm">Có lỗi kết nối. Bạn vui lòng thử lại giúp mình nhé.</p>
            )}

            <motion.p 
              className="mt-6 text-sm text-slate-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="inline-flex items-center gap-1">
                🔒 Bảo mật thông tin
              </span>
              {' · '}
              Bằng cách đăng ký, bạn đồng ý nhận thông tin về dự án.
            </motion.p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

/* ================= Enhanced Footer ================= */
function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-0 glass-morphism-strong border-t border-white/30"></div>
      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-glass text-lg">
                👁️
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-400 opacity-20 blur-sm"></div>
            </div>
            <div>
              <div className="font-display font-bold text-lg text-slate-800">EyeCare Quizzle</div>
              <div className="text-sm text-slate-600">Chăm sóc mắt thông minh</div>
            </div>
          </motion.div>
          
          {/* Navigation Links */}
          <motion.nav 
            className="flex flex-wrap justify-center gap-6 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {[
              ['#features', 'Tính năng'],
              ['#journey', 'Hành trình'],
              ['#rewards', 'Quà tặng'],
              ['#knowledge', 'Kiến thức'],
              ['#studio', 'Studio 360°']
            ].map(([href, label]) => (
              <a 
                key={href}
                href={href} 
                className="text-slate-600 hover:text-sky-700 transition-all-300 relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all-300"></span>
              </a>
            ))}
          </motion.nav>
          
          {/* Copyright & Credits */}
          <motion.div 
            className="text-center md:text-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-sm text-slate-600 mb-1">
              © {new Date().getFullYear()} Nhóm dự án EyeCare
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-center md:justify-end gap-1">
              Powered by
              <span className="inline-flex items-center gap-1 font-medium text-gradient">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"></span>
                Liquid Glass UI
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

/* ================= Enhanced App Root ================= */
export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50"></div>
      <div className="fixed inset-0 bg-gradient-to-tl from-purple-50/30 via-transparent to-blue-50/30"></div>
      
      {/* Animated Background Orbs */}
      <div className="fixed top-10 right-10 w-96 h-96 floating-orb opacity-30 pointer-events-none"></div>
      <div className="fixed bottom-10 left-10 w-80 h-80 floating-orb-delayed opacity-25 pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] floating-orb opacity-10 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Nav />
        <Hero />
        <Features />
        <Journey />
        <Rewards />
        <Knowledge />
        <Studio />
        <TeamIndustry />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}
