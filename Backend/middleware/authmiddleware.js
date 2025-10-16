const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    //console.log(token)
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Check Admin role
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied: Admins only' });
};
