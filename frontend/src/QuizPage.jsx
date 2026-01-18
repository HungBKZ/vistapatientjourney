// Quiz Demo Page - VISTA Patient Journey
import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

const quizData = {
  "questions": [
    {
      "questionNumber": 1,
      "question": "Bộ phận nào là lớp màng trong suốt, ở phía trước nhất của mắt, giúp hội tụ ánh sáng?",
      "answerOptions": [
        {
          "text": "Võng mạc",
          "rationale": "Võng mạc là lớp cảm nhận ánh sáng ở tít phía sau của mắt, không phải ở phía trước."
        },
        {
          "text": "Giác mạc",
          "rationale": "Đây chính là lớp 'cửa sổ' trong suốt ở phía trước mắt, đóng vai trò chính trong việc bẻ cong ánh sáng đi vào.",
          "isCorrect": true
        },
        {
          "text": "Mống mắt",
          "rationale": "Mống mắt là phần có màu (như nâu, đen) của mắt, dùng để điều chỉnh lượng ánh sáng vào."
        },
        {
          "text": "Thủy tinh thể",
          "rationale": "Thủy tinh thể nằm *sau* mống mắt và giác mạc, giúp tinh chỉnh khả năng lấy nét."
        }
      ],
      "hint": "Hãy nghĩ đến bộ phận giống như 'mặt kính đồng hồ' của mắt bạn."
    },
    {
      "questionNumber": 2,
      "question": "Phần có màu của mắt (như đen, nâu, xanh) có chức năng điều khiển lượng ánh sáng đi vào mắt được gọi là gì?",
      "answerOptions": [
        {
          "text": "Lòng trắng (Củng mạc)",
          "rationale": "Củng mạc là lớp vỏ bọc bên ngoài, màu trắng, có chức năng bảo vệ mắt."
        },
        {
          "text": "Con ngươi (Đồng tử)",
          "rationale": "Con ngươi là lỗ tròn màu đen ở giữa, là nơi ánh sáng đi qua. Kích thước của nó *bị* điều khiển bởi bộ phận khác."
        },
        {
          "text": "Mống mắt",
          "rationale": "Chính xác, mống mắt co lại hoặc giãn ra để thay đổi kích thước con ngươi, qua đó kiểm soát lượng ánh sáng.",
          "isCorrect": true
        },
        {
          "text": "Giác mạc",
          "rationale": "Giác mạc là lớp trong suốt phía trước, giúp hội tụ ánh sáng chứ không có màu hay điều khiển ánh sáng."
        }
      ],
      "hint": "Bộ phận này quyết định 'màu mắt' của một người."
    },
    {
      "questionNumber": 3,
      "question": "Tật khúc xạ khiến bạn nhìn rõ vật ở gần nhưng lại mờ vật ở xa được gọi là gì?",
      "answerOptions": [
        {
          "text": "Cận thị",
          "rationale": "Cận thị xảy ra khi ánh sáng hội tụ *trước* võng mạc, làm cho các vật ở xa bị mờ.",
          "isCorrect": true
        },
        {
          "text": "Viễn thị",
          "rationale": "Viễn thị thì ngược lại, thường gây khó khăn khi nhìn gần hơn là nhìn xa."
        },
        {
          "text": "Lão thị",
          "rationale": "Lão thị là tình trạng giảm khả năng nhìn gần do tuổi tác, thường xảy ra ở người lớn tuổi."
        },
        {
          "text": "Loạn thị",
          "rationale": "Loạn thị gây ra hình ảnh bị mờ hoặc méo mó ở cả gần và xa, do giác mạc hoặc thủy tinh thể không đều."
        }
      ],
      "hint": "Đây là tật khúc xạ rất phổ biến ở học sinh, sinh viên."
    },
    {
      "questionNumber": 4,
      "question": "Tình trạng thủy tinh thể của mắt bị mờ đục, gây nhìn mờ giống như 'nhìn qua màn sương', thường gặp ở người lớn tuổi là bệnh gì?",
      "answerOptions": [
        {
          "text": "Tăng nhãn áp (Glôcôm)",
          "rationale": "Bệnh này liên quan đến tổn thương dây thần kinh thị giác, thường do áp lực cao trong mắt."
        },
        {
          "text": "Đục thủy tinh thể (Cườm khô)",
          "rationale": "Chính xác, 'đục' ở đây chính là nói đến thủy tinh thể (ống kính tự nhiên của mắt) mất đi sự trong suốt.",
          "isCorrect": true
        },
        {
          "text": "Thoái hóa hoàng điểm",
          "rationale": "Bệnh này ảnh hưởng đến vùng trung tâm của võng mạc, gây mất thị lực trung tâm."
        },
        {
          "text": "Võng mạc tiểu đường",
          "rationale": "Đây là biến chứng ở mắt do bệnh tiểu đường, gây tổn thương các mạch máu ở võng mạc."
        }
      ],
      "hint": "Phẫu thuật cho bệnh này liên quan đến việc thay thế 'ống kính' tự nhiên của mắt."
    },
    {
      "questionNumber": 5,
      "question": "Tại sao bệnh nhân thường được yêu cầu *không* ăn hoặc uống (nhịn đói) trong vài giờ trước khi phẫu thuật mắt?",
      "answerOptions": [
        {
          "text": "Để giảm áp lực trong mắt xuống mức thấp nhất.",
          "rationale": "Việc ăn uống không ảnh hưởng trực tiếp đến áp lực mắt ngay trước phẫu thuật."
        },
        {
          "text": "Để ngăn ngừa nguy cơ hít sặc nếu cần dùng thuốc an thần hoặc gây mê.",
          "rationale": "Đây là lý do an toàn quan trọng nhất. Dù chỉ là thuốc an thần nhẹ, vẫn có nguy cơ buồn nôn và hít sặc thức ăn vào phổi.",
          "isCorrect": true
        },
        {
          "text": "Để thuốc tê tại chỗ hoạt động hiệu quả hơn.",
          "rationale": "Thức ăn trong dạ dày không ảnh hưởng đến hiệu quả của thuốc tê nhỏ tại mắt."
        },
        {
          "text": "Để bác sĩ dễ dàng quan sát mạch máu trong mắt hơn.",
          "rationale": "Việc nhịn ăn không làm thay đổi sự rõ ràng khi bác sĩ quan sát mắt bạn."
        }
      ],
      "hint": "Điều này liên quan đến sự an toàn của toàn bộ cơ thể, không chỉ riêng con mắt."
    },
    {
      "questionNumber": 6,
      "question": "Sau phẫu thuật mắt (như mổ cườm hoặc LASIK), mục đích chính của việc đeo kính bảo vệ hoặc tấm che mắt, kể cả khi ngủ, là gì?",
      "answerOptions": [
        {
          "text": "Giúp mắt thích nghi với ánh sáng sáng tốt hơn.",
          "rationale": "Kính râm giúp chống chói, nhưng tấm che khi ngủ có mục đích khác."
        },
        {
          "text": "Ngăn ngừa việc vô tình dụi mắt hoặc va chạm vào mắt.",
          "rationale": "Mắt rất nhạy cảm sau mổ, và một cú va chạm hay hành động dụi mắt (kể cả khi đang ngủ) có thể gây tổn thương nghiêm trọng.",
          "isCorrect": true
        },
        {
          "text": "Giữ cho thuốc nhỏ mắt không bị chảy ra ngoài.",
          "rationale": "Thuốc nhỏ mắt vẫn sẽ được hấp thụ, tấm che không có tác dụng giữ thuốc."
        },
        {
          "text": "Giảm sưng tấy cho mí mắt nhanh hơn.",
          "rationale": "Chườm lạnh (nếu được chỉ định) mới giúp giảm sưng, tấm che chủ yếu để bảo vệ cơ học."
        }
      ],
      "hint": "Hãy nghĩ đến một hành động bạn có thể làm trong vô thức, đặc biệt là khi mắt bị cộm hoặc ngứa."
    },
    {
      "questionNumber": 7,
      "question": "Bệnh nào sau đây gây tổn thương *dây thần kinh thị giác* (dây nối mắt với não) và thường liên quan đến áp lực bên trong mắt cao?",
      "answerOptions": [
        {
          "text": "Viêm kết mạc (Đau mắt đỏ)",
          "rationale": "Đây là tình trạng viêm lớp màng ngoài cùng của mắt, thường do vi rút hoặc vi khuẩn, không ảnh hưởng dây thần kinh."
        },
        {
          "text": "Tăng nhãn áp (Glôcôm hay Cườm nước)",
          "rationale": "Bệnh này được mệnh danh là 'kẻ trộm thị lực thầm lặng' vì nó làm tổn thương dây thần kinh thị giác, thường do áp lực cao (nhãn áp).",
          "isCorrect": true
        },
        {
          "text": "Đục thủy tinh thể (Cườm khô)",
          "rationale": "Bệnh này là do thủy tinh thể bị mờ đục, ngăn ánh sáng đi vào, không liên quan đến dây thần kinh."
        },
        {
          "text": "Khô mắt",
          "rationale": "Khô mắt là do thiếu nước mắt hoặc nước mắt kém chất lượng, gây kích ứng bề mặt."
        }
      ],
      "hint": "Bệnh này thường tiến triển âm thầm và ảnh hưởng đến tầm nhìn ngoại vi trước."
    },
    {
      "questionNumber": 8,
      "question": "Lớp mô nhạy cảm với ánh sáng ở phía sau của mắt, nơi hình ảnh được hình thành và gửi tín hiệu lên não, được gọi là gì?",
      "answerOptions": [
        {
          "text": "Dịch kính",
          "rationale": "Đây là chất gel trong suốt lấp đầy bên trong nhãn cầu, giúp giữ hình dạng cho mắt."
        },
        {
          "text": "Thủy tinh thể",
          "rationale": "Thủy tinh thể là 'ống kính' giúp lấy nét hình ảnh *lên* trên lớp mô đó."
        },
        {
          "text": "Võng mạc",
          "rationale": "Chính xác, võng mạc hoạt động giống như 'cuộn phim' trong máy ảnh, thu nhận ánh sáng và chuyển thành tín hiệu thần kinh.",
          "isCorrect": true
        },
        {
          "text": "Hắc mạc",
          "rationale": "Đây là lớp mạch máu nằm giữa võng mạc và củng mạc, cung cấp dinh dưỡng."
        }
      ],
      "hint": "Hãy so sánh mắt với một máy ảnh, đây chính là 'cuộn phim' hoặc 'cảm biến hình ảnh'."
    },
    {
      "questionNumber": 9,
      "question": "Vùng trung tâm nhỏ của võng mạc, chịu trách nhiệm cho thị lực sắc nét, chi tiết nhất (như đọc sách, nhận diện khuôn mặt) là gì?",
      "answerOptions": [
        {
          "text": "Hoàng điểm (Điểm vàng)",
          "rationale": "Đây chính là khu vực quan trọng nhất cho thị lực trung tâm và khả năng nhìn rõ chi tiết.",
          "isCorrect": true
        },
        {
          "text": "Điểm mù",
          "rationale": "Đây là nơi dây thần kinh thị giác rời khỏi mắt, không có tế bào cảm nhận ánh sáng nên không thấy gì tại đó."
        },
        {
          "text": "Con ngươi (Đồng tử)",
          "rationale": "Con ngươi là lỗ mở cho ánh sáng đi vào, không phải là một phần của võng mạc."
        },
        {
          "text": "Võng mạc chu biên",
          "rationale": "Phần võng mạc này giúp chúng ta nhìn thấy xung quanh (tầm nhìn ngoại vi) nhưng không sắc nét bằng."
        }
      ],
      "hint": "Khi bạn 'thoái hóa' bộ phận này theo tuổi tác (bệnh AMD), khả năng đọc sách của bạn sẽ bị ảnh hưởng."
    },
    {
      "questionNumber": 10,
      "question": "Phương pháp phẫu thuật đục thủy tinh thể phổ biến nhất hiện nay, sử dụng sóng siêu âm để tán nhuyễn và hút thủy tinh thể bị đục ra ngoài, được gọi là gì?",
      "answerOptions": [
        {
          "text": "LASIK",
          "rationale": "LASIK là phẫu thuật dùng laser để định hình lại giác mạc, chủ yếu để điều trị cận, viễn, loạn thị."
        },
        {
          "text": "Cắt dịch kính",
          "rationale": "Đây là phẫu thuật để loại bỏ dịch kính (chất gel bên trong mắt), thường dùng cho các bệnh lý võng mạc."
        },
        {
          "text": "Ghép giác mạc",
          "rationale": "Phẫu thuật này thay thế giác mạc bị hỏng (phía trước mắt) bằng giác mạc khỏe mạnh của người hiến tặng."
        },
        {
          "text": "Phaco (Phacoemulsification)",
          "rationale": "'Phaco' chính là viết tắt của kỹ thuật sử dụng năng lượng (thường là siêu âm) để 'nhũ tương hóa' (tán nhuyễn) thủy tinh thể.",
          "isCorrect": true
        }
      ],
      "hint": "Tên của kỹ thuật này có một từ gốc Hy Lạp 'phakos' nghĩa là 'ống kính' (thủy tinh thể)."
    }
  ]
}

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const question = quizData.questions[currentQuestion]
  const totalQuestions = quizData.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return // Prevent changing answer
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    if (question.answerOptions[index].isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowHint(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
    setScore(0)
    setQuizComplete(false)
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-6">
        <Motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center p-12 rounded-3xl bg-white border border-blue-100 shadow-2xl">
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-8xl mb-6"
            >
              {score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}
            </Motion.div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Hoàn thành bài kiểm tra!
            </h2>
            
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-6">
              {score}/{totalQuestions}
            </div>
            
            <p className="text-gray-600 text-lg mb-8">
              {score >= 8 ? 'Xuất sắc! Bạn có kiến thức nhãn khoa vững vàng!' : 
               score >= 5 ? 'Tốt lắm! Kiến thức của bạn ở mức khá.' : 
               'Hãy thử lại để nâng cao kiến thức nhãn khoa!'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Motion.button
                onClick={handleRestart}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Làm lại bài kiểm tra
              </Motion.button>
              
              <Link to="/">
                <Motion.button
                  className="px-8 py-4 rounded-xl border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition-all w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Về trang chủ
                </Motion.button>
              </Link>
            </div>
          </div>
        </Motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6">
      {/* Header */}
      <Motion.div 
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={LOGO_URL}
              alt="VISTA Logo"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400/30 group-hover:ring-blue-400/60 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800">VISTA</span>
              <span className="text-xs text-gray-600">Hành trình chăm sóc mắt</span>
            </div>
          </Link>
          
          <div className="text-right">
            <div className="text-blue-600 font-bold text-lg">
              Điểm: {score}/{totalQuestions}
            </div>
            <div className="text-gray-600 text-sm">
              Phiên bản thử nghiệm
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-blue-100 rounded-full overflow-hidden">
          <Motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-sky-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Câu {currentQuestion + 1}/{totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Dev Notice */}
        <Motion.div
          className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ⚠️ Trang thử nghiệm - Đang phát triển (kết quả chưa được lưu)
        </Motion.div>
      </Motion.div>

      {/* Question Card */}
      <Motion.div
        className="max-w-4xl mx-auto"
        key={currentQuestion}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
      >
        <div className="p-8 rounded-3xl bg-white border border-blue-100 shadow-xl">
          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Hint Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <span>💡</span>
              {showHint ? 'Ẩn gợi ý' : 'Hiển thị gợi ý'}
            </button>
            <AnimatePresence>
              {showHint && (
                <Motion.div
                  className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {question.hint}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {question.answerOptions.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = option.isCorrect
              const showCorrect = showResult && isCorrect
              const showWrong = showResult && isSelected && !isCorrect

              return (
                <Motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-6 rounded-xl text-left transition-all duration-300
                    ${selectedAnswer === null ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed'}
                    ${showCorrect ? 'bg-green-50 border-2 border-green-500' : ''}
                    ${showWrong ? 'bg-red-50 border-2 border-red-500' : ''}
                    ${!showResult && !isSelected ? 'bg-blue-50/50 border border-blue-200 hover:bg-blue-50 hover:border-blue-300' : ''}
                    ${!showResult && isSelected ? 'bg-blue-100 border-2 border-blue-500' : ''}
                  `}
                  whileHover={selectedAnswer === null ? { x: 10 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${showCorrect ? 'bg-green-500 text-white' : ''}
                      ${showWrong ? 'bg-red-500 text-white' : ''}
                      ${!showResult ? 'bg-blue-200 text-blue-700' : ''}
                    `}>
                      {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + index)}
                    </div>
                    
                    <div className="flex-1">
                      <div className={`font-semibold mb-2 ${
                        showCorrect ? 'text-green-700' : 
                        showWrong ? 'text-red-700' : 
                        'text-gray-800'
                      }`}>
                        {option.text}
                      </div>
                      
                      <AnimatePresence>
                        {showResult && (isSelected || isCorrect) && (
                          <Motion.div
                            className={`text-sm mt-2 ${
                              showCorrect ? 'text-green-600' : 
                              showWrong ? 'text-red-600' : 
                              'text-gray-600'
                            }`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {option.rationale}
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Motion.button>
              )
            })}
          </div>

          {/* Next Button */}
          <AnimatePresence>
            {showResult && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Motion.button
                  onClick={handleNext}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuestion < totalQuestions - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
                </Motion.button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Motion.div>
    </div>
  )
}

export default QuizPage
