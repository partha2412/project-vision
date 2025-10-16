const express = require('express');
const router = express.Router();
const { register,login,logout,updateUser,deleteUser,googleAuth } = require('../controllers/authcontrollers');
const { isAuthenticated } = require('../middleware/auth');
 
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post("/google", googleAuth);
router.delete('/delete', isAuthenticated, deleteUser);
router.put('/updateuser', isAuthenticated, updateUser);


module.exports = router;
