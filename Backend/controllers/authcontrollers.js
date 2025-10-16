const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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


exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Google token received:", token);  // ✅ log token
    if (!token) return res.status(400).json({ message: "Token missing" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google payload:", payload); // ✅ log payload

    const { email, given_name: firstname, family_name: lastname } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ firstname, lastname, email, password: "" });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: { id: user._id, firstname, lastname, email },
    });
  } catch (err) {
    console.error("Google signup error:", err);
    res.status(500).json({ success: false, message: "Google signup failed" });
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
          role: admin.role
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
    console.log(isMatch);
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
  const { firstname, lastname, email, phone, gender, dob, password, newPassword } = req.body;
console.log(req.body)
  try {
    const userId = req.user.id; // From middleware
const user = await User.findById(userId).select('+password');
console.log(user);

    if (!user) return res.status(404).json({ message: 'User not found' });

 if (firstname !== undefined) user.firstname = firstname;
if (lastname !== undefined) user.lastname = lastname;
if (email !== undefined) user.email = email;
if (phone !== undefined) user.phone = phone;
if (gender !== undefined) user.gender = gender;
if (dob !== undefined) user.dob = dob;
;


    // Update password
    if (password && newPassword) {
      const match = await bcrypt.compare(password, user.password);
          console.log(match);

      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }
console.log(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      
      user: {
        role:user.role,
        id: user._id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
      },
    });
  } catch (error) {
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