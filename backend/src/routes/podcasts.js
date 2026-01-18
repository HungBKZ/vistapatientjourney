import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all podcasts
router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    const limitNum = parseInt(limit) || 20;

    let query = `
      SELECT id, title, slug, description, audio_url, thumbnail_url, 
             duration, category, play_count, published_at, created_at
      FROM podcasts 
      WHERE is_published = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(limitNum);

    const [podcasts] = await pool.query(query, params);

    res.json({
      success: true,
      data: podcasts
    });
  } catch (error) {
    console.error('Get podcasts error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get podcast by slug
router.get('/:slug', async (req, res) => {
  try {
    const [podcasts] = await pool.query(
      `SELECT * FROM podcasts WHERE slug = ? AND is_published = TRUE`,
      [req.params.slug]
    );

    if (podcasts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy podcast'
      });
    }

    // Increment play count
    await pool.query('UPDATE podcasts SET play_count = play_count + 1 WHERE id = ?', [podcasts[0].id]);

    res.json({
      success: true,
      data: podcasts[0]
    });
  } catch (error) {
    console.error('Get podcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM podcasts 
      WHERE is_published = TRUE AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get podcast categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
