const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    console.log('Order creation request payload:', JSON.stringify(req.body, null, 2));

    if (items && items.length === 0) {
      const responseBody = { message: 'No order items' };
      console.log('Order creation response body:', JSON.stringify(responseBody, null, 2));
      return res.status(400).json(responseBody);
    } else {
      const order = new Order({
        userId: req.user._id,
        items,
        totalAmount,
        address,
        paymentId
      });
      const createdOrder = await order.save();

      // Send Order Confirmation Email in the background to prevent SMTP port blockage on Render from halting checkout
      try {
        const message = `
          <h2>Order Confirmation</h2>
          <p>Hello ${req.user.name},</p>
          <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
          <p>Total Amount Paid: ₹${Number(totalAmount || 0).toFixed(2)}</p>
          <p>It will be shipped to: ${address.street}, ${address.city}</p>
          <p>Thank you for shopping with AuraMart!</p>
        `;

        sendEmail({
          email: req.user.email,
          subject: 'AuraMart - Order Confirmation',
          message
        }).catch(emailError => {
          console.error('Order email sending failed (async):', emailError.message);
        });
      } catch (emailError) {
        console.error('Order email initialization failed:', emailError.message);
      }

      console.log('Order creation response body:', JSON.stringify(createdOrder, null, 2));
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    const responseBody = { message: error.message, stack: error.stack };
    console.error('Order creation exception:', error);
    console.log('Order creation response body (error):', JSON.stringify(responseBody, null, 2));
    res.status(500).json(responseBody);
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
