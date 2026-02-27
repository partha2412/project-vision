const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { uploadImagesToCloudinary } = require('./imagecontroller.js');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // ✅ define client here

// Register 
exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;


  try {

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }


    if (!firstname || !lastname || !email || !password) {

      return res.status(400).json({ message: 'All fields are required' });
    }


    //const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ firstname, lastname, email, password });


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    //console.log("done");

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
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
  //console.log(req.body);
  try {
    // ===== ADMIN LOGIN =====
    if (secretkey && secretkey === process.env.ADMIN_SECRET && password === process.env.ADMIN_PASSWORD) {
      // Check if admin exists in DB
      let admin = await User.findOne({ email: email || ADMIN_EMAIL });

      if (!admin) {
        // Admin doesn't exist → create
        admin = await User.create({
          name: 'Admin',
          email: email,
          password: process.env.ADMIN_PASSWORD, // hashed automatically
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
          firstname: admin.firstname,
          lastname: admin.lastname,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar || "default-avatar.jpg"  // ✅ include avatar
        }
      });


    }

    // ===== USER LOGIN =====
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    //console.log(password);
    //console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'Invalid email' });
    }

    const isMatch = await user.comparePassword(password);
    // console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = user.getJwtToken();

    res.status(200).json({
      success: true,
      message: 'User login successful',
      role: 'user',
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "default-avatar.jpg"  // ✅ include avatar
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
  const { firstname, lastname, email, phone, gender, dob, password, newPassword } = req.body;
  try {
    const userId = req.user.id; // From middleware
    const user = await User.findById(userId).select('+password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update text fields
    if (firstname !== undefined) user.firstname = firstname;
    if (lastname !== undefined) user.lastname = lastname;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (dob !== undefined) user.dob = dob;

    // Update password
    if (password && newPassword) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = newPassword; // Hashing handled by schema pre-save
    }

    // Update profile image
    if (req.file) {
      const imageUrls = await uploadImagesToCloudinary([req.file], 'users');
      user.avatar = imageUrls[0]; // Save first uploaded image URL
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        role: user.role,
        id: user._id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: error.message });
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
exports.googleSignup = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !lastname || !email) {
      return res.status(400).json({ message: "All fields are required for Google signup" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d",
    });

    // Return exact structure
    res.status(200).json({
      success: true,
      message: "Google signup/login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google signup error:", error);
    res.status(500).json({ success: false, message: "Google signup failed", error: error.message });
  }
};


exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar || "default-avatar.jpg",
        role: user.role
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data', error: error.message });
  }
};