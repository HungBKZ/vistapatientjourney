import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all articles
router.get('/', async (req, res) => {
  try {
    const { category, limit, page } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT 
        a.id, a.title, a.slug, a.excerpt, a.category, a.thumbnail_url, 
        a.view_count, a.published_at, a.created_at,
        d.full_name as author_name
      FROM articles a
      LEFT JOIN doctors d ON a.author_id = d.id
      WHERE a.is_published = TRUE
    `;
    const params = [];

    if (category) {
      query += ' AND a.category = ?';
      params.push(category);
    }

    query += ' ORDER BY a.published_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [articles] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM articles WHERE is_published = TRUE';
    if (category) {
      countQuery += ' AND category = ?';
    }
    const [countResult] = await pool.query(countQuery, category ? [category] : []);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get article by slug
router.get('/:slug', async (req, res) => {
  try {
    const [articles] = await pool.query(`
      SELECT 
        a.*,
        d.full_name as author_name,
        d.avatar_url as author_avatar,
        d.specialization as author_specialization
      FROM articles a
      LEFT JOIN doctors d ON a.author_id = d.id
      WHERE a.slug = ? AND a.is_published = TRUE
    `, [req.params.slug]);

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Increment view count
    await pool.query('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [articles[0].id]);

    res.json({
      success: true,
      data: articles[0]
    });
  } catch (error) {
    console.error('Get article error:', error);
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
      FROM articles 
      WHERE is_published = TRUE AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
