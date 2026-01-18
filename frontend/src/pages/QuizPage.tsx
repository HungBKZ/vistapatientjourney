import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { QuizQuestion } from '../types';
import api from '../services/api';

type State = 'intro' | 'playing' | 'result';

interface Result {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export default function QuizPage() {
  const [state, setState] = useState<State>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; answer: string }[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.getQuizQuestions({ limit: 10 }) as { data: QuizQuestion[] };
      setQuestions(res.data || []);
      setAnswers([]);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setState('playing');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers, { questionId: questions[currentIndex].id, answer }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
      } else {
        submitQuiz(newAnswers);
      }
    }, 500);
  };

  const submitQuiz = async (finalAnswers: { questionId: number; answer: string }[]) => {
    setLoading(true);
    try {
      const res = await api.checkQuizAnswers(finalAnswers) as {
        data: { results: Result[]; score: { correct: number; total: number; percentage: number } };
      };
      setResults(res.data.results);
      setScore(res.data.score);
      setState('result');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {state === 'intro' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kiểm tra kiến thức về mắt</h1>
            <p className="text-gray-600 mb-8">
              Trả lời 10 câu hỏi để kiểm tra hiểu biết của bạn về sức khỏe mắt
            </p>
            <div className="flex justify-center gap-8 mb-8 text-sm text-gray-500">
              <span>10 câu hỏi</span>
              <span>Không giới hạn thời gian</span>
            </div>
            <button onClick={startQuiz} disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50">
              {loading ? 'Đang tải...' : 'Bắt đầu'}
            </button>
          </motion.div>
        )}

        {state === 'playing' && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Câu {currentIndex + 1} / {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              {currentQuestion.category && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded mb-4">
                  {currentQuestion.category}
                </span>
              )}
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                  const text = currentQuestion[`option_${opt}`];
                  const isSelected = selectedAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => !selectedAnswer && handleAnswer(opt)}
                      disabled={!!selectedAnswer}
                      className={`w-full p-4 rounded-lg text-left transition-colors flex items-start gap-3
                        ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}
                        ${selectedAnswer && !isSelected ? 'opacity-50' : ''}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
                        ${isSelected ? 'bg-white/20' : 'bg-white border border-gray-200'}`}>
                        {opt.toUpperCase()}
                      </span>
                      <span className="pt-0.5">{text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm mb-6">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4
                ${score.percentage >= 70 ? 'bg-green-100 text-green-600' : 
                  score.percentage >= 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                <span className="text-3xl font-bold">{score.percentage}%</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {score.percentage >= 70 ? 'Xuất sắc!' : score.percentage >= 50 ? 'Khá tốt!' : 'Cần cải thiện!'}
              </h2>
              <p className="text-gray-600 mb-6">Bạn trả lời đúng {score.correct} / {score.total} câu</p>
              <div className="flex justify-center gap-4">
                <button onClick={startQuiz} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg">
                  Làm lại
                </button>
                <Link to="/" className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg">
                  Về trang chủ
                </Link>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">Chi tiết kết quả</h3>
            <div className="space-y-3">
              {results.map((result, index) => {
                const question = questions.find(q => q.id === result.questionId);
                if (!question) return null;
                return (
                  <div key={result.questionId} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                        ${result.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {result.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900 text-sm mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className={`text-sm ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Đáp án của bạn: {result.userAnswer.toUpperCase()}
                        </p>
                        {!result.isCorrect && (
                          <p className="text-sm text-green-600">Đáp án đúng: {result.correctAnswer.toUpperCase()}</p>
                        )}
                        {result.explanation && (
                          <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">{result.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
