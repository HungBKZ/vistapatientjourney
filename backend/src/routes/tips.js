import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all eye care tips
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM eye_care_tips WHERE is_active = TRUE';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC';

    const [tips] = await pool.query(query, params);

    res.json({
      success: true,
      data: tips
    });
  } catch (error) {
    console.error('Get tips error:', error);
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
      FROM eye_care_tips 
      WHERE is_active = TRUE AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get tip categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
