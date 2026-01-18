import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get quiz questions
router.get('/questions', async (req, res) => {
  try {
    const { category, difficulty, limit } = req.query;
    const limitNum = parseInt(limit) || 10;

    let query = 'SELECT * FROM quiz_questions WHERE is_active = TRUE';
    const params = [];

    if (category) {
      query += ' AND category = ?';
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
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      category: q.category,
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
    const { answers } = req.body; // Array of { questionId, answer }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
    }

    const questionIds = answers.map(a => a.questionId);
    const [questions] = await pool.query(
      'SELECT id, correct_answer, explanation FROM quiz_questions WHERE id IN (?)',
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
        explanation: question?.explanation
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
    const [categories] = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM quiz_questions 
      WHERE is_active = TRUE AND category IS NOT NULL
      GROUP BY category
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
