const express = require('express')
const router = express.Router();
const User = require('../models/User')
const passport = require('passport');
router.get('/', (req, res) => {
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/',
    failureFlash: true
}));

router.post('/register', async (req, res, next) => {
    const { email, password, confirm_password } = req.body;
    console.log(req.body);
    const errors = [];
    if (password == confirm_password) {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'The Email is already in use');
            res.redirect('/');
        }
        const newUser = new User({ email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/');
    } else {
        errors.push({ text: 'Password do not match' });
        res.render('index', { errors, password, confirm_password });
    }

});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});




module.exports = router;