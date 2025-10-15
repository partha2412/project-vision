const express = require('express');
const router = express.Router();
const { register,login,logout,updateUser,deleteUser } = require('../controllers/authcontrollers');
const { isAuthenticated } = require('../middleware/auth');
 
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.delete('/delete', isAuthenticated, deleteUser);
router.put('/update', isAuthenticated, updateUser);


module.exports = router;
