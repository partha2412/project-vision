const Order = require('../models/Order');


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')        // include user details
      .populate('orderItems.product', 'title price'); // include product details

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// placeorder

exports.placeOrder = async (req, res) => {
  try {
    // Get data from request body
    const { user, orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Validate required fields
    if (!user || !orderItems || orderItems.length === 0 || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create new order
    const newOrder = new Order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null
    });

    // Save to database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
