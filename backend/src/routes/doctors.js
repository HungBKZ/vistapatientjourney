import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, active } = req.query;
    
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (specialization) {
      query += ' AND specialization = ?';
      params.push(specialization);
    }

    if (active !== undefined) {
      query += ' AND is_active = ?';
      params.push(active === 'true');
    }

    query += ' ORDER BY full_name ASC';

    const [doctors] = await pool.query(query, params);

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [doctors] = await pool.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bác sĩ'
      });
    }

    res.json({
      success: true,
      data: doctors[0]
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get doctor's available time slots
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = `
      SELECT ts.*, 
        CASE WHEN a.id IS NOT NULL THEN FALSE ELSE ts.is_available END as is_available
      FROM time_slots ts
      LEFT JOIN appointments a ON ts.id = a.time_slot_id AND a.status != 'cancelled'
      WHERE ts.doctor_id = ?
    `;
    const params = [req.params.id];

    if (date) {
      query += ' AND ts.date = ?';
      params.push(date);
    } else {
      query += ' AND ts.date >= CURDATE()';
    }

    query += ' ORDER BY ts.date ASC, ts.start_time ASC';

    const [slots] = await pool.query(query, params);

    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get specializations list
router.get('/meta/specializations', async (req, res) => {
  try {
    const [specializations] = await pool.query(
      'SELECT DISTINCT specialization FROM doctors WHERE is_active = TRUE ORDER BY specialization'
    );

    res.json({
      success: true,
      data: specializations.map(s => s.specialization)
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

export default router;
