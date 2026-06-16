const express = require('express');
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const mongoose = require('mongoose');

const router = express.Router();

router.get('/diagnostics', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    let mongoPing = 'unknown';
    let mongoError = null;
    try {
      if (mongoose.connection.db) {
        const pingResult = await mongoose.connection.db.admin().ping();
        mongoPing = pingResult ? 'success' : 'failed';
      } else {
        mongoPing = 'db object not available';
      }
    } catch (e) {
      mongoError = e.message;
    }

    const envInfo = {
      MONGO_URI_SET: !!process.env.MONGO_URI,
      MONGO_URI_PREFIX: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : null,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      GMAIL_USER_SET: !!process.env.GMAIL_USER,
      GMAIL_USER: process.env.GMAIL_USER,
      GMAIL_PASS_SET: !!process.env.GMAIL_PASS,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    };

    res.json({
      success: true,
      message: 'Diagnostics completed',
      database: {
        readyState: dbStatus,
        status: dbStates[dbStatus] || 'unknown',
        ping: mongoPing,
        error: mongoError
      },
      env: envInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Diagnostics failed',
      error: error.message,
      stack: error.stack
    });
  }
});

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
