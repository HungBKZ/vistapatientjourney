import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// Bảng màu chuẩn y khoa & các tùy chọn đĩa Ishihara
interface IshiharaPlate {
  id: number;
  correctAnswer: string;
  type: 'demonstration' | 'transformation' | 'hidden';
  description: string;
  bgColors: string[];
  numColors: string[];
}

const ishiharaPlates: IshiharaPlate[] = [
  { 
    id: 1, 
    correctAnswer: '12',
    type: 'demonstration',
    description: 'Plate demo - Tất cả mọi người đều đọc được số 12',
    bgColors: ['#7CB342', '#8BC34A', '#9CCC65', '#689F38', '#7CB342', '#AED581'], 
    numColors: ['#E53935', '#F44336', '#EF5350', '#D32F2F', '#C62828', '#FF5252'], 
  },
  { 
    id: 2, 
    correctAnswer: '8',
    type: 'transformation',
    description: 'Người bình thường đọc: 8',
    bgColors: ['#66BB6A', '#81C784', '#A5D6A7', '#4CAF50', '#43A047', '#C8E6C9'],
    numColors: ['#FF7043', '#FF8A65', '#FFAB91', '#F4511E', '#E64A19', '#FF5722'],
  },
  { 
    id: 3, 
    correctAnswer: '6',
    type: 'transformation',
    description: 'Người bình thường đọc: 6',
    bgColors: ['#9CCC65', '#AED581', '#C5E1A5', '#8BC34A', '#7CB342', '#DCEDC8'],
    numColors: ['#FF5722', '#FF7043', '#FF8A65', '#F4511E', '#E64A19', '#BF360C'],
  },
  { 
    id: 4, 
    correctAnswer: '29',
    type: 'transformation', 
    description: 'Người bình thường đọc: 29',
    bgColors: ['#AED581', '#C5E1A5', '#DCEDC8', '#9CCC65', '#8BC34A', '#E8F5E9'],
    numColors: ['#EF6C00', '#F57C00', '#FF9800', '#E65100', '#FB8C00', '#FFA726'],
  },
  { 
    id: 5, 
    correctAnswer: '57',
    type: 'transformation',
    description: 'Người bình thường đọc: 57',
    bgColors: ['#689F38', '#7CB342', '#8BC34A', '#558B2F', '#33691E', '#9CCC65'],
    numColors: ['#FFB300', '#FFC107', '#FFCA28', '#FFA000', '#FF8F00', '#FFD54F'],
  },
  { 
    id: 6, 
    correctAnswer: '5',
    type: 'transformation',
    description: 'Người bình thường đọc: 5',
    bgColors: ['#81C784', '#A5D6A7', '#C8E6C9', '#66BB6A', '#4CAF50', '#E8F5E9'],
    numColors: ['#E91E63', '#EC407A', '#F06292', '#D81B60', '#C2185B', '#F48FB1'],
  },
  { 
    id: 7, 
    correctAnswer: '3',
    type: 'transformation',
    description: 'Người bình thường đọc: 3',
    bgColors: ['#C5E1A5', '#DCEDC8', '#E8F5E9', '#AED581', '#9CCC65', '#F1F8E9'],
    numColors: ['#D32F2F', '#E53935', '#F44336', '#C62828', '#B71C1C', '#EF5350'],
  },
  { 
    id: 8, 
    correctAnswer: '15',
    type: 'transformation',
    description: 'Người bình thường đọc: 15',
    bgColors: ['#AFB42B', '#C0CA33', '#CDDC39', '#9E9D24', '#827717', '#D4E157'],
    numColors: ['#FF5252', '#FF1744', '#F44336', '#D50000', '#E53935', '#FF8A80'],
  },
  { 
    id: 9, 
    correctAnswer: '74',
    type: 'transformation',
    description: 'Người bình thường đọc: 74',
    bgColors: ['#7CB342', '#8BC34A', '#9CCC65', '#689F38', '#558B2F', '#AED581'],
    numColors: ['#FF6F00', '#FF8F00', '#FFA000', '#E65100', '#FFB300', '#FFCA28'],
  },
  { 
    id: 10, 
    correctAnswer: '2',
    type: 'transformation',
    description: 'Người bình thường đọc: 2',
    bgColors: ['#4CAF50', '#66BB6A', '#81C784', '#43A047', '#388E3C', '#A5D6A7'],
    numColors: ['#D50000', '#FF1744', '#F44336', '#B71C1C', '#C62828', '#E53935'],
  },
  { 
    id: 11, 
    correctAnswer: '97',
    type: 'transformation',
    description: 'Người bình thường đọc: 97',
    bgColors: ['#DCEDC8', '#E8F5E9', '#F1F8E9', '#C5E1A5', '#AED581', '#FAFAFA'],
    numColors: ['#AD1457', '#C2185B', '#D81B60', '#880E4F', '#E91E63', '#EC407A'],
  },
  { 
    id: 12, 
    correctAnswer: '45',
    type: 'transformation',
    description: 'Người bình thường đọc: 45',
    bgColors: ['#8BC34A', '#9CCC65', '#AED581', '#7CB342', '#689F38', '#C5E1A5'],
    numColors: ['#E65100', '#EF6C00', '#F57C00', '#BF360C', '#FF9800', '#FF5722'],
  },
  { 
    id: 13, 
    correctAnswer: '2',
    type: 'hidden',
    description: 'Người mù màu nhìn thấy: 2 (Người bình thường không thấy số)',
    bgColors: ['#26A69A', '#4DB6AC', '#80CBC4', '#009688', '#00897B', '#B2DFDB'],
    numColors: ['#FF8A65', '#FFAB91', '#FFCCBC', '#FF7043', '#FF5722', '#FBE9E7'],
  },
  { 
    id: 14, 
    correctAnswer: '5',
    type: 'hidden',
    description: 'Người mù màu nhìn thấy: 5 (Người bình thường không thấy số)',
    bgColors: ['#AB47BC', '#BA68C8', '#CE93D8', '#9C27B0', '#8E24AA', '#E1BEE7'],
    numColors: ['#7986CB', '#9FA8DA', '#C5CAE9', '#5C6BC0', '#3F51B5', '#E8EAF6'],
  },
  { 
    id: 15, 
    correctAnswer: '16',
    type: 'hidden',
    description: 'Người mù màu nhìn thấy: 16 (Người bình thường không thấy số)',
    bgColors: ['#FFCC80', '#FFE0B2', '#FFF3E0', '#FFB74D', '#FFA726', '#FFECB3'],
    numColors: ['#A5D6A7', '#C8E6C9', '#E8F5E9', '#81C784', '#66BB6A', '#DCEDC8'],
  },
  { 
    id: 16, 
    correctAnswer: '42',
    type: 'hidden', 
    description: 'Người mù màu nhìn thấy: 42 (Người bình thường không thấy số)',
    bgColors: ['#EF9A9A', '#FFCDD2', '#FFEBEE', '#E57373', '#EF5350', '#FCE4EC'],
    numColors: ['#80DEEA', '#B2EBF2', '#E0F7FA', '#4DD0E1', '#26C6DA', '#E0F2F1'],
  },
  { 
    id: 17, 
    correctAnswer: '73',
    type: 'transformation',
    description: 'Người bình thường đọc: 73',
    bgColors: ['#66BB6A', '#81C784', '#A5D6A7', '#4CAF50', '#43A047', '#C8E6C9'],
    numColors: ['#FF5722', '#FF7043', '#FF8A65', '#F4511E', '#E64A19', '#FFAB91'],
  },
  { 
    id: 18, 
    correctAnswer: '26',
    type: 'transformation',
    description: 'Người bình thường đọc: 26',
    bgColors: ['#AED581', '#C5E1A5', '#DCEDC8', '#9CCC65', '#8BC34A', '#E8F5E9'],
    numColors: ['#D84315', '#E64A19', '#F4511E', '#BF360C', '#FF5722', '#FF7043'],
  },
];

// Vẽ từng segment của nét chữ số
const getDigitPath = (digit: string, cx: number, cy: number, size: number) => {
  const h = size;
  const w = size * 0.6;
  const t = size * 0.18; // Độ dày nét vẽ

  const segments: Record<string, string[]> = {
    '0': ['top', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'bottom'],
    '1': ['topRight', 'bottomRight'],
    '2': ['top', 'topRight', 'middle', 'bottomLeft', 'bottom'],
    '3': ['top', 'topRight', 'middle', 'bottomRight', 'bottom'],
    '4': ['topLeft', 'topRight', 'middle', 'bottomRight'],
    '5': ['top', 'topLeft', 'middle', 'bottomRight', 'bottom'],
    '6': ['top', 'topLeft', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
    '7': ['top', 'topRight', 'bottomRight'],
    '8': ['top', 'topLeft', 'topRight', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
    '9': ['top', 'topLeft', 'topRight', 'middle', 'bottomRight', 'bottom'],
  };

  const activeSegments = segments[digit] || [];
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  activeSegments.forEach((seg) => {
    switch (seg) {
      case 'top':
        rects.push({ x: cx - w / 2, y: cy - h / 2, w: w, h: t });
        break;
      case 'middle':
        rects.push({ x: cx - w / 2, y: cy - t / 2, w: w, h: t });
        break;
      case 'bottom':
        rects.push({ x: cx - w / 2, y: cy + h / 2 - t, w: w, h: t });
        break;
      case 'topLeft':
        rects.push({ x: cx - w / 2, y: cy - h / 2, w: t, h: h / 2 + t / 2 });
        break;
      case 'bottomLeft':
        rects.push({ x: cx - w / 2, y: cy - t / 2, w: t, h: h / 2 + t / 2 });
        break;
      case 'topRight':
        rects.push({ x: cx + w / 2 - t, y: cy - h / 2, w: t, h: h / 2 + t / 2 });
        break;
      case 'bottomRight':
        rects.push({ x: cx + w / 2 - t, y: cy - t / 2, w: t, h: h / 2 + t / 2 });
        break;
    }
  });

  return rects;
};

const createNumberPath = (numberStr: string, centerX: number, centerY: number, fontSize: number) => {
  const paths: { x: number; y: number; w: number; h: number }[] = [];
  const digits = numberStr.split('');
  const digitWidth = fontSize * 0.7;
  const totalWidth = digits.length * digitWidth;
  let startX = centerX - totalWidth / 2;

  digits.forEach((digit) => {
    const digitPath = getDigitPath(digit, startX + digitWidth / 2, centerY, fontSize);
    paths.push(...digitPath);
    startX += digitWidth;
  });

  return paths;
};

const isPointInNumberPath = (px: number, py: number, rects: { x: number; y: number; w: number; h: number }[]) => {
  for (const rect of rects) {
    if (px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h) {
      return true;
    }
  }
  return false;
};

// Hàm vẽ đĩa Ishihara trên Canvas
const drawIshiharaPlate = (canvas: HTMLCanvasElement, plate: IshiharaPlate) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 5;

  ctx.clearRect(0, 0, size, size);

  // Background off-white chuyên dụng
  ctx.fillStyle = '#f5f5f0';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  const dots: { x: number; y: number; radius: number; color: string }[] = [];
  const minDotRadius = size * 0.012;
  const maxDotRadius = size * 0.028;
  const padding = 1.2;

  const numberPath = createNumberPath(plate.correctAnswer, centerX, centerY, size * 0.5);

  let attempts = 0;
  const maxAttempts = 3500;

  while (attempts < maxAttempts) {
    attempts++;

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (radius - maxDotRadius);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    const dotRadius = minDotRadius + Math.random() * (maxDotRadius - minDotRadius);

    const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distFromCenter + dotRadius > radius) continue;

    let overlapping = false;
    for (const dot of dots) {
      const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      if (dist < dot.radius + dotRadius + padding) {
        overlapping = true;
        break;
      }
    }
    if (overlapping) continue;

    const isOnNumber = isPointInNumberPath(x, y, numberPath);

    let color: string;
    if (isOnNumber) {
      color = plate.numColors[Math.floor(Math.random() * plate.numColors.length)];
    } else {
      color = plate.bgColors[Math.floor(Math.random() * plate.bgColors.length)];
    }

    dots.push({ x, y, radius: dotRadius, color });
  }

  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fill();
  });
};

// Component vẽ Thumbnail đĩa Ishihara trong kết quả
const PlateThumbnail: React.FC<{ plate: IshiharaPlate; size?: number }> = ({ plate, size = 60 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = size;
      canvas.height = size;
      drawIshiharaPlate(canvas, plate);
    }
  }, [plate, size]);

  return <canvas ref={canvasRef} className="rounded-full shadow-inner bg-[#f5f5f0] border border-slate-200/50" />;
};

export default function ColorBlindTestPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Vẽ đĩa kiểm tra khi chuyển câu hỏi
  useEffect(() => {
    if (gameState === 'testing' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 320;
      canvas.height = 320;
      drawIshiharaPlate(canvas, ishiharaPlates[currentPlateIndex]);
    }
  }, [gameState, currentPlateIndex]);

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

              {/* Canvas đĩa mù màu */}
              <div className="relative p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner flex justify-center items-center w-full max-w-[360px] aspect-square mx-auto">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full rounded-full shadow-[0_12px_40px_rgb(0,0,0,0.06)] bg-white"
                  style={{ maxWidth: '320px', maxHeight: '320px' }}
                />
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
