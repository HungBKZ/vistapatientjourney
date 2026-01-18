import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      query += ' AND is_active = ?';
      params.push(active === 'true');
    }

    query += ' ORDER BY display_order ASC, name ASC';

    const [services] = await pool.query(query, params);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get service by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const param = req.params.idOrSlug;
    const isNumeric = /^\d+$/.test(param);
    
    const query = isNumeric 
      ? 'SELECT * FROM services WHERE id = ?' 
      : 'SELECT * FROM services WHERE slug = ?';
    
    const [services] = await pool.query(query, [param]);

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.json({
      success: true,
      data: services[0]
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
