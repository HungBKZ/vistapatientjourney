import express from 'express';
import pool from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create appointment
router.post('/', optionalAuth, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      doctor_id,
      service_id,
      time_slot_id,
      appointment_date,
      appointment_time,
      symptoms,
      notes,
      // Guest booking fields
      guest_name,
      guest_email,
      guest_phone
    } = req.body;

    let user_id = req.user?.id;

    // If no logged in user, create a temporary user for guest booking
    if (!user_id && guest_email) {
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [guest_email]
      );

      if (existingUser.length > 0) {
        user_id = existingUser[0].id;
      } else {
        // Create guest user
        const [result] = await connection.query(
          `INSERT INTO users (full_name, email, phone, password)
           VALUES (?, ?, ?, ?)`,
          [guest_name, guest_email, guest_phone, 'GUEST_USER_NO_LOGIN']
        );
        user_id = result.insertId;
      }
    }

    if (!user_id) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng đăng nhập hoặc cung cấp thông tin liên hệ'
      });
    }

    // Get service price
    const [services] = await connection.query('SELECT price FROM services WHERE id = ?', [service_id]);
    const total_price = services.length > 0 ? services[0].price : 0;

    // Check time slot availability
    if (time_slot_id) {
      const [slot] = await connection.query(
        `SELECT * FROM time_slots WHERE id = ? AND is_available = TRUE`,
        [time_slot_id]
      );
      
      if (slot.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Khung giờ này đã được đặt'
        });
      }

      // Mark slot as unavailable
      await connection.query(
        'UPDATE time_slots SET is_available = FALSE WHERE id = ?',
        [time_slot_id]
      );
    }

    // Create appointment
    const [result] = await connection.query(
      `INSERT INTO appointments 
        (user_id, doctor_id, service_id, time_slot_id, appointment_date, appointment_time, symptoms, notes, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id, doctor_id, service_id, time_slot_id, appointment_date, appointment_time, symptoms, notes, total_price]
    );

    await connection.commit();

    // Get full appointment details
    const [appointments] = await pool.query(`
      SELECT 
        a.*,
        u.full_name as patient_name,
        u.email as patient_email,
        u.phone as patient_phone,
        d.full_name as doctor_name,
        d.specialization,
        s.name as service_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Đặt lịch khám thành công',
      data: appointments[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  } finally {
    connection.release();
  }
});

// Get user's appointments
router.get('/my', authenticate, async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        a.*,
        d.full_name as doctor_name,
        d.specialization,
        d.avatar_url as doctor_avatar,
        s.name as service_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN services s ON a.service_id = s.id
      WHERE a.user_id = ?
    `;
    const params = [req.user.id];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const [appointments] = await pool.query(query, params);

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Get appointment by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [appointments] = await pool.query(`
      SELECT 
        a.*,
        u.full_name as patient_name,
        u.email as patient_email,
        u.phone as patient_phone,
        d.full_name as doctor_name,
        d.specialization,
        d.phone as doctor_phone,
        s.name as service_name,
        s.description as service_description
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN services s ON a.service_id = s.id
      WHERE a.id = ? AND a.user_id = ?
    `, [req.params.id, req.user.id]);

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch khám'
      });
    }

    res.json({
      success: true,
      data: appointments[0]
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  }
});

// Cancel appointment
router.put('/:id/cancel', authenticate, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const [appointments] = await connection.query(
      'SELECT * FROM appointments WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (appointments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch khám'
      });
    }

    const appointment = appointments[0];

    if (appointment.status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Lịch khám đã được hủy trước đó'
      });
    }

    // Cancel appointment
    await connection.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', req.params.id]
    );

    // Release time slot
    if (appointment.time_slot_id) {
      await connection.query(
        'UPDATE time_slots SET is_available = TRUE WHERE id = ?',
        [appointment.time_slot_id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Hủy lịch khám thành công'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra'
    });
  } finally {
    connection.release();
  }
});

export default router;
