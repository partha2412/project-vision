const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register 
exports.register = async (req, res) => {
  const { firstname,lastname, email, password } = req.body;
  

  try {
    
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

     
    if (!firstname ||!lastname|| !email || !password) {
      
      return res.status(400).json({ message: 'All fields are required' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstname,lastname, email, password: hashedPassword });

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    
res.status(201).json({
  success: true,
  message: 'User registered successfully',
  token,
  user,
  user: {
    id: user._id,
    firstname: firstname,
    lastname: lastname,
    email: user.email
  }
});

  } 
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};






// ---------------- LOGIN -----------------
exports.login = async (req, res) => {
  const { email, password, secretkey } = req.body;

  try {
    // ===== ADMIN LOGIN =====
    if (secretkey && secretkey === process.env.ADMIN_SECRET && password ===process.env. ADMIN_PASSWORD) {
      // Check if admin exists in DB
        let admin = await User.findOne({ email: email || ADMIN_EMAIL });

      if (!admin) {
        // Admin doesn't exist → create
        admin = await User.create({
          name: 'Admin',
          email: email ,
          password:process.env. ADMIN_PASSWORD, // hashed automatically
          role: 'admin',
          secretkey: process.env.ADMIN_SECRET
        });
      } else {
        // Admin exists → ensure role is 'admin' and secretkey is set
        email;
        admin.role = 'admin';
        admin.secretkey = process.env.ADMIN_SECRET;
        await admin.save();
      }

      // Generate token
      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        process.env.JWT_SECRET || 'jwtsecret',
        { expiresIn: '2h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        role: 'admin',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    }

    // ===== USER LOGIN =====
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      message: 'User login successful',
      role: 'user',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};






// Logout
exports.logout = async (req, res) => {
  try {
    // If you're using cookies to store JWT
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
};
// Update User
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userId = req.user.id; // You must get user from middleware (decoded token)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during update',
      error: error.message
    });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const useremail = req.user.email; // Must come from auth middleware

    const user = await User.findById(useremail);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne(); // Remove user from DB

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during deletion',
      error: error.message
    });
  }
};


