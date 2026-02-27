const express = require('express');
const router = express.Router();
const { register,login,logout,updateUser,deleteUser,googleSignup, getMe } = require('../controllers/authcontrollers.js');
const { isAuthenticated } = require('../middleware/auth.js');
const multer = require('multer');
// ✅ Multer setup for single image
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/register', register);
router.post('/google',googleSignup );

router.post('/login', login);
router.get('/logout', logout);
router.delete('/delete', isAuthenticated, deleteUser);
router.put('/updateuser', isAuthenticated, upload.single('image') ,updateUser);

router.get('/getme', isAuthenticated, getMe);

module.exports = router;
