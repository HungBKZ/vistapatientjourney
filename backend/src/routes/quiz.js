import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get quiz questions
router.get('/questions', async (req, res) => {
  try {
    const { category, difficulty, limit, lang } = req.query;
    const language = (lang === 'en' || lang === 'vi') ? lang : 'vi';
    const limitNum = parseInt(limit) || 10;

    let query = 'SELECT * FROM quiz_questions WHERE is_active = TRUE';
    const params = [];

    // If requesting English, avoid rows that don't have English content
    if (language === 'en') {
      query += ' AND question_en IS NOT NULL AND question_en <> \'\'';
    }

    if (category) {
      query += language === 'en' ? ' AND category_en = ?' : ' AND category = ?';
      params.push(category);
    }

    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY RAND() LIMIT ?';
    params.push(limitNum);

    const [questions] = await pool.query(query, params);

    // Remove correct_answer from response for client-side quiz
    const safeQuestions = questions.map(q => ({
      id: q.id,
      question: language === 'en' ? (q.question_en || q.question) : q.question,
      option_a: language === 'en' ? (q.option_a_en || q.option_a) : q.option_a,
      option_b: language === 'en' ? (q.option_b_en || q.option_b) : q.option_b,
      option_c: language === 'en' ? (q.option_c_en || q.option_c) : q.option_c,
      option_d: language === 'en' ? (q.option_d_en || q.option_d) : q.option_d,
      category: language === 'en' ? (q.category_en || q.category) : q.category,
      difficulty: q.difficulty
    }));

    res.json({
      success: true,
      data: safeQuestions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Check answers
router.post('/check', async (req, res) => {
  try {
    const { answers, lang } = req.body; // Array of { questionId, answer }
    const language = (lang === 'en' || lang === 'vi') ? lang : 'vi';

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
    }

    const questionIds = answers.map(a => a.questionId);
    const [questions] = await pool.query(
      'SELECT id, correct_answer, explanation, explanation_en FROM quiz_questions WHERE id IN (?)',
      [questionIds]
    );

    const questionsMap = questions.reduce((acc, q) => {
      acc[q.id] = q;
      return acc;
    }, {});

    let correctCount = 0;
    const results = answers.map(answer => {
      const question = questionsMap[answer.questionId];
      const isCorrect = question && question.correct_answer === answer.answer;
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        userAnswer: answer.answer,
        correctAnswer: question?.correct_answer,
        isCorrect,
        explanation: language === 'en' ? (question?.explanation_en || question?.explanation) : question?.explanation
      };
    });

    res.json({
      success: true,
      data: {
        results,
        score: {
          correct: correctCount,
          total: answers.length,
          percentage: Math.round((correctCount / answers.length) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Check answers error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const { lang } = req.query;
    const language = (lang === 'en' || lang === 'vi') ? lang : 'vi';
    const categoryColumn = language === 'en' ? 'category_en' : 'category';

    const [categories] = await pool.query(`
      SELECT ${categoryColumn} as category, COUNT(*) as count 
      FROM quiz_questions 
      WHERE is_active = TRUE AND ${categoryColumn} IS NOT NULL
      GROUP BY ${categoryColumn}
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get quiz categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
