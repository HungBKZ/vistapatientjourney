import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// Bảng màu chuẩn y khoa & các tùy chọn đĩa Ishihara
interface IshiharaPlate {
  id: number;
  correctAnswer: string;
  type: 'demonstration' | 'transformation' | 'hidden';
  image: string;
  description: string;
}

const ishiharaPlates: IshiharaPlate[] = [
  {
    id: 1,
    correctAnswer: '7',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376215/Screenshot_2026-07-18_190017_r3bsnz.png',
    description: 'Người bình thường đọc: 7',
  },
  {
    id: 2,
    correctAnswer: '2',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376215/Screenshot_2026-07-18_185958_mum3fn.png',
    description: 'Người bình thường đọc: 2',
  },
  {
    id: 3,
    correctAnswer: '7',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376215/Screenshot_2026-07-18_190008_lpzlyy.png',
    description: 'Người bình thường đọc: 7',
  },
  {
    id: 4,
    correctAnswer: '5',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376215/Screenshot_2026-07-18_190023_ukfblz.png',
    description: 'Người bình thường đọc: 5',
  },
  {
    id: 5,
    correctAnswer: '8',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190035_y2nssk.png',
    description: 'Người bình thường đọc: 8',
  },
  {
    id: 6,
    correctAnswer: '4',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190029_qwrqla.png',
    description: 'Người bình thường đọc: 4',
  },
  {
    id: 7,
    correctAnswer: '2',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190043_zkx1dm.png',
    description: 'Người bình thường đọc: 2',
  },
  {
    id: 8,
    correctAnswer: '6',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190049_hn916c.png',
    description: 'Người bình thường đọc: 6',
  },
  {
    id: 9,
    correctAnswer: '2',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190055_wcx6r1.png',
    description: 'Người bình thường đọc: 2',
  },
  {
    id: 10,
    correctAnswer: '2',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190101_ta6tia.png',
    description: 'Người bình thường đọc: 2',
  },
  {
    id: 11,
    correctAnswer: '7',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190111_ac9ft3.png',
    description: 'Người bình thường đọc: 7',
  },
  {
    id: 12,
    correctAnswer: '6',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376214/Screenshot_2026-07-18_190106_aml94z.png',
    description: 'Người bình thường đọc: 6',
  },
  {
    id: 13,
    correctAnswer: '8',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190117_grhgba.png',
    description: 'Người bình thường đọc: 8',
  },
  {
    id: 14,
    correctAnswer: '6',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190149_iqrhtp.png',
    description: 'Người bình thường đọc: 6',
  },
  {
    id: 15,
    correctAnswer: '6',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190122_plnmft.png',
    description: 'Người bình thường đọc: 6',
  },
  {
    id: 16,
    correctAnswer: '5',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_185934_rhakux.png',
    description: 'Người bình thường đọc: 5',
  },
  {
    id: 17,
    correctAnswer: '2',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190145_gxawtm.png',
    description: 'Người bình thường đọc: 2',
  },
  {
    id: 18,
    correctAnswer: '6',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376213/Screenshot_2026-07-18_190128_yj1mjs.png',
    description: 'Người bình thường đọc: 6',
  },
  {
    id: 19,
    correctAnswer: '8',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376212/Screenshot_2026-07-18_190139_stuwif.png',
    description: 'Người bình thường đọc: 8',
  },
  {
    id: 20,
    correctAnswer: '4',
    type: 'transformation',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784376212/Screenshot_2026-07-18_185946_zoog0i.png',
    description: 'Người bình thường đọc: 4',
  },
];

// Component vẽ Thumbnail đĩa Ishihara trong kết quả
const PlateThumbnail: React.FC<{ plate: IshiharaPlate; size?: number }> = ({ plate, size = 72 }) => {
  return (
    <div 
      className="rounded-full overflow-hidden border border-slate-700/50 shadow-md flex items-center justify-center shrink-0 bg-slate-950"
      style={{ width: size, height: size }}
    >
      <img 
        src={plate.image} 
        alt={`Plate ${plate.id}`} 
        className="w-full h-full object-cover rounded-full select-none"
      />
    </div>
  );
};

export default function ColorBlindTestPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<'intro' | 'testing' | 'result'>('intro');
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [resultSummary, setResultSummary] = useState<{
    correct: number;
    total: number;
    percentage: number;
    severity: 'normal' | 'mild' | 'moderate' | 'severe';
    diagnosis: string;
  } | null>(null);

  const TIME_LIMIT = 10; // 10 seconds per plate

  // Tạo các tùy chọn trả lời nhiễu và tùy chọn "?" (không nhìn thấy)
  const generateOptions = useCallback((index: number) => {
    const plate = ishiharaPlates[index];
    if (plate.type === 'hidden') {
      const fakeNumbers: string[] = [];
      while (fakeNumbers.length < 5) {
        const num = Math.floor(Math.random() * 90) + 1;
        if (!fakeNumbers.includes(String(num))) {
          fakeNumbers.push(String(num));
        }
      }
      const shuffled = fakeNumbers.sort(() => Math.random() - 0.5);
      return [...shuffled, '?']; // '?' đại diện cho "Không thấy số"
    }

    const correctNum = parseInt(plate.correctAnswer);
    const setOpts = new Set<string>([plate.correctAnswer]);

    while (setOpts.size < 6) {
      const variance = Math.floor(Math.random() * 20) - 10;
      const randomNum = Math.max(1, Math.min(99, correctNum + variance));
      if (String(randomNum) !== plate.correctAnswer) {
        setOpts.add(String(randomNum));
      }
    }

    const shuffled = Array.from(setOpts).sort(() => Math.random() - 0.5);
    return [...shuffled, '?'];
  }, []);

  const calculateResult = useCallback((finalAnswers: string[]) => {
    let correct = 0;

    finalAnswers.forEach((ans, idx) => {
      const plate = ishiharaPlates[idx];
      if (plate.type === 'hidden') {
        // Người bình thường không thấy số trong hidden plates (chọn "?")
        if (ans === '?') correct++;
      } else {
        // Người bình thường thấy đúng số
        if (ans === plate.correctAnswer) correct++;
      }
    });

    const total = ishiharaPlates.length;
    const percentage = Math.round((correct / total) * 100);

    let severity: 'normal' | 'mild' | 'moderate' | 'severe' = 'normal';
    let diagnosis = '';

    if (percentage >= 85) {
      severity = 'normal';
      diagnosis = t('ishihara.diagnoses.normal');
    } else if (percentage >= 70) {
      severity = 'mild';
      diagnosis = t('ishihara.diagnoses.mild');
    } else if (percentage >= 45) {
      severity = 'moderate';
      diagnosis = t('ishihara.diagnoses.moderate');
    } else {
      severity = 'severe';
      diagnosis = t('ishihara.diagnoses.severe');
    }

    setResultSummary({
      correct,
      total,
      percentage,
      severity,
      diagnosis,
    });
    setGameState('result');
  }, [t]);

  const handleSkip = useCallback(() => {
    const nextAnswers = [...answers, ''];
    setAnswers(nextAnswers);

    if (currentPlateIndex < ishiharaPlates.length - 1) {
      const nextIndex = currentPlateIndex + 1;
      setCurrentPlateIndex(nextIndex);
      setSelectedAnswer(null);
      setOptions(generateOptions(nextIndex));
      setTimeLeft(TIME_LIMIT);
    } else {
      calculateResult(nextAnswers);
    }
  }, [answers, currentPlateIndex, generateOptions, calculateResult]);

  const handleSelectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);

    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    setTimeout(() => {
      if (currentPlateIndex < ishiharaPlates.length - 1) {
        const nextIndex = currentPlateIndex + 1;
        setCurrentPlateIndex(nextIndex);
        setSelectedAnswer(null);
        setOptions(generateOptions(nextIndex));
        setTimeLeft(TIME_LIMIT);
      } else {
        calculateResult(nextAnswers);
      }
    }, 400);
  }, [answers, currentPlateIndex, generateOptions, calculateResult]);

  const startTest = () => {
    setGameState('testing');
    setCurrentPlateIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setResultSummary(null);
    setOptions(generateOptions(0));
    setTimeLeft(TIME_LIMIT);
  };

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'testing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSkip();
          return TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, currentPlateIndex, handleSkip]);

  const progress = ishiharaPlates.length > 0 ? ((currentPlateIndex + 1) / ishiharaPlates.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 text-slate-800 pt-24 pb-20 selection:bg-sky-600 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Intro Screen */}
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white/85 backdrop-blur-xl rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_20px_60px_-15px_rgba(148,163,184,0.2)] border border-slate-200/60 text-center"
          >
            <div className="w-28 h-28 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-8 shadow-inner">
              <svg className="w-14 h-14 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-6 leading-tight">
              {t('ishihara.title')}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-600 font-semibold leading-relaxed mb-10 max-w-2xl mx-auto">
              {t('ishihara.desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left max-w-2xl mx-auto mb-10 bg-slate-50/70 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-base">1</div>
                <span className="text-sm sm:text-base font-bold text-slate-700">Khoảng cách mắt: ~75cm</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-base">2</div>
                <span className="text-sm sm:text-base font-bold text-slate-700">Ánh sáng phòng đầy đủ</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-base">3</div>
                <span className="text-sm sm:text-base font-bold text-slate-700">Không đeo kính lọc màu</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-extrabold text-base">4</div>
                <span className="text-sm sm:text-base font-bold text-slate-700">Kiểm tra từng mắt một</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={startTest}
                className="w-full sm:w-auto px-10 py-4 sm:py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg sm:text-xl rounded-full transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
              >
                {t('ishihara.start')}
              </button>
              <Link 
                to="/knowledge"
                className="w-full sm:w-auto px-10 py-4 sm:py-4.5 bg-white border border-slate-200 text-slate-700 font-extrabold text-lg sm:text-xl rounded-full hover:bg-slate-50 transition-all text-center"
              >
                {t('ishihara.back')}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Testing Screen */}
        {gameState === 'testing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cột trái: Đĩa Ishihara */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(148,163,184,0.15)] border border-slate-200/50 flex flex-col items-center"
            >
              {/* Header câu hỏi */}
              <div className="w-full flex justify-between items-center text-base sm:text-lg font-extrabold text-slate-500 mb-6">
                <span>{t('ishihara.plate')} <span className="text-slate-800 text-lg sm:text-xl font-black">{currentPlateIndex + 1}</span> / <span className="text-slate-400">{ishiharaPlates.length}</span></span>
                
                {/* Timer Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-mono text-sm sm:text-base font-bold
                  ${timeLeft <= 3 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse shadow-sm shadow-rose-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                  }
                `}>
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${timeLeft <= 3 ? 'text-rose-500 animate-spin' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: timeLeft <= 3 ? '1.5s' : '0s' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeLeft}s</span>
                </div>

                <span className="text-sky-600 font-black">{Math.round(progress)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Ảnh đĩa mù màu */}
              <div className="relative p-4 sm:p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-inner flex justify-center items-center w-full max-w-[360px] aspect-square mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] bg-slate-950 border-4 border-slate-800 flex items-center justify-center">
                  <img 
                    src={ishiharaPlates[currentPlateIndex].image} 
                    alt={`Ishihara Plate ${currentPlateIndex + 1}`}
                    className="w-full h-full object-cover rounded-full select-none"
                  />
                </div>
              </div>
              
              <p className="mt-8 text-sm text-slate-400 font-bold text-center italic">
                * Nhìn thẳng vào đĩa và nhận diện các chữ số ẩn giấu
              </p>
            </motion.div>

            {/* Cột phải: Đáp án và hành động */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }} 
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(148,163,184,0.15)] border border-slate-200/50">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-6 text-center lg:text-left">
                  Chọn số bạn nhìn thấy được:
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const isNotSee = opt === '?';
                    return (
                      <button
                        key={opt}
                        onClick={() => !selectedAnswer && handleSelectAnswer(opt)}
                        disabled={selectedAnswer !== null}
                        className={`py-5 px-4 rounded-2xl text-center font-black text-xl sm:text-2xl transition-all border flex flex-col justify-center items-center gap-1 active:scale-[0.98] shadow-sm min-h-[72px] sm:min-h-[84px]
                          ${isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-[1.02]' 
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                          }
                          ${isNotSee ? 'col-span-2 py-4.5 bg-sky-50 border-sky-100 hover:bg-sky-100/80 text-sky-700 font-extrabold text-base sm:text-lg' : ''}
                        `}
                      >
                        <span>{isNotSee ? t('ishihara.notSee') : opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                  <button
                    onClick={handleSkip}
                    disabled={selectedAnswer !== null}
                    className="flex-1 py-4 text-base font-extrabold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200 text-center active:scale-[0.98]"
                  >
                    {t('ishihara.skip')}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn thoát bài kiểm tra?')) {
                        setGameState('intro');
                      }
                    }}
                    className="py-4 px-6 text-base font-extrabold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all text-center active:scale-[0.98]"
                  >
                    Thoát
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        )}

        {/* Result Screen */}
        {gameState === 'result' && resultSummary && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Khối chính kết quả */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_-15px_rgba(148,163,184,0.15)] border border-slate-200/50 text-center">
              
              {/* Vòng tròn phần trăm điểm số */}
              <div className="relative w-44 h-44 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="stroke-slate-100 fill-none"
                    strokeWidth="12"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className={`fill-none transition-all duration-1000 ease-out
                      ${resultSummary.severity === 'normal' ? 'stroke-emerald-500' : 
                        resultSummary.severity === 'mild' ? 'stroke-amber-400' : 
                        resultSummary.severity === 'moderate' ? 'stroke-orange-500' : 'stroke-rose-600'
                      }
                    `}
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 76}`}
                    strokeDashoffset={`${2 * Math.PI * 76 * (1 - resultSummary.percentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="text-4xl sm:text-5xl font-black text-slate-800">{resultSummary.percentage}%</span>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">Chính xác</span>
                </div>
              </div>

              {/* Tag mức độ chuẩn y khoa */}
              <span className={`inline-block px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-6 shadow-sm
                ${resultSummary.severity === 'normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                  resultSummary.severity === 'mild' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                  resultSummary.severity === 'moderate' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 
                  'bg-rose-50 text-rose-700 border border-rose-100'
                }
              `}>
                {resultSummary.severity === 'normal' && t('ishihara.normal')}
                {resultSummary.severity === 'mild' && t('ishihara.mild')}
                {resultSummary.severity === 'moderate' && t('ishihara.moderate')}
                {resultSummary.severity === 'severe' && t('ishihara.severe')}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                {t('ishihara.result')}
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-600 font-semibold leading-relaxed mb-6 max-w-2xl mx-auto">
                {resultSummary.diagnosis}
              </p>
              
              <p className="text-sm sm:text-base text-slate-400 font-bold mb-10 uppercase tracking-wide">
                Số đĩa đọc đúng: <span className="text-slate-800 text-lg sm:text-xl font-black">{resultSummary.correct}</span> / {resultSummary.total}
              </p>

              {/* Nhóm nút CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={startTest}
                  className="w-full sm:w-auto px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg rounded-full transition-all active:scale-[0.98] shadow-md shadow-emerald-600/10"
                >
                  {t('ishihara.restart')}
                </button>
                <Link
                  to="/knowledge"
                  className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-700 font-extrabold text-lg rounded-full hover:bg-slate-50 transition-all text-center"
                >
                  Trở lại Mắt ảo
                </Link>
              </div>

            </div>

            {/* Chi tiết từng câu kiểm tra */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                Chi tiết bài kiểm tra nhãn khoa:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ishiharaPlates.map((plate, idx) => {
                  const userAnswer = answers[idx];
                  const isHidden = plate.type === 'hidden';
                  
                  // Kiểm tra câu trả lời
                  let isCorrect = false;
                  if (isHidden) {
                    isCorrect = userAnswer === '?';
                  } else {
                    isCorrect = userAnswer === plate.correctAnswer;
                  }

                  const displayUserAnswer = userAnswer === '?' ? t('ishihara.notSee') : (userAnswer || 'Bỏ qua');
                  const displayCorrectAnswer = isHidden ? t('ishihara.notSee') : plate.correctAnswer;

                  return (
                    <div 
                      key={plate.id} 
                      className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-200/50 flex gap-4 items-center"
                    >
                      {/* Ảnh thumbnail canvas đĩa */}
                      <PlateThumbnail plate={plate} size={72} />

                      {/* Thông tin kết quả */}
                      <div className="flex-grow space-y-1.5 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-bold text-slate-400">Đĩa {plate.id}</span>
                          <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full
                            ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                          `}>
                            {isCorrect ? 'Đúng' : 'Sai'}
                          </span>
                        </div>
                        
                        <p className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
                          {plate.type === 'demonstration' ? 'Đĩa Demo (Yêu cầu)' : 
                           plate.type === 'hidden' ? 'Đĩa Ẩn (Nhận dạng mù màu)' : 'Đĩa chuẩn'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm pt-2 border-t border-slate-100 font-bold">
                          <div>
                            <span className="text-slate-400">Bạn trả lời: </span>
                            <span className={isCorrect ? 'text-emerald-600 font-extrabold' : 'text-rose-500 font-extrabold'}>
                              {displayUserAnswer}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Đáp án chuẩn: </span>
                            <span className="text-slate-800 font-extrabold">{displayCorrectAnswer}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
