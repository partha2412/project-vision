const Order = require('../models/Order');


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstname lastname email _id')
      .populate('orderItems.product', 'name price');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.placeOrder = async (req, res) => {
  try {
    // Make sure user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0 || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newOrder = new Order({
      user: userId, // get user from token
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null,
      status: 'Processing',
      createdAt: Date.now(),
    });

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


// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {             // Pending, Processing, Shipped, Delivered, Cancelled
      status,          
      isPaid,
      isDelivered,
      trackingNumber,
      notes,
      paidAt,
      deliveredAt
    } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status if provided and valid
    if (status && ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      order.status = status;
    }

    // Update payment
    if (typeof isPaid === 'boolean') {
      order.isPaid = isPaid;
      order.paidAt = isPaid ? paidAt || Date.now() : null;
    }

    // Update delivery
    if (typeof isDelivered === 'boolean') {
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? deliveredAt || Date.now() : null;
    }

    // Update tracking number
    if (trackingNumber) order.trackingNumber = trackingNumber;

    // Update notes
    if (notes) order.notes = notes;

    // Update updatedAt timestamp
    order.updatedAt = Date.now();

    // Save changes
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')                   // include user info
      .populate('orderItems.product', 'title price');   // include product info

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order by ID (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Remove the order
    // await order.remove();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
