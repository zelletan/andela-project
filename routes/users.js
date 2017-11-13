var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
    res.render('register');
});

// Login
router.get('/login', function(req, res){
    res.render('login');
});

// home
router.get('/home', function(req, res){
    res.render('home');
});

// Register User
router.post('/register', function(req, res){
    var parentname = req.body.parentname;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var username = req.body.username;
    var password = req.body.password;
    var address = req.body.address;
    var password2 = req.body.password2;
    var parentphonenumber = req.body.parentphonenumber;
    var parentcontact = req.body.parentcontact;
    var studentphoneNumber = req.body.studentphoneNumber;

    // Validation
    req.checkBody('parentname', 'Parent name is required').notEmpty();
    req.checkBody('fullname', 'full name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('parentcontact', 'parent contact is required').notEmpty();
    req.checkBody('parentphonenumber', 'Parent phone number is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    } else {
        var newUser = new User({
            _id: id,
            fullname: fullname,
            email:email,
            username: username,
            password: password,
            address: address,
            parentname: parentname,
            studentphoneNumber: studentphoneNumber,
            parentcontact: parentcontact,
            parentphonenumber: parentphonenumber
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/home');
});
//all registered users
router.get('/student', function(req, res, next){
    User.find({}, function (err, docs) {
         res.render('student', {
        title: 'student app',
             User: docs,
         });
    });

});

// //deleting student
// router.route('/student/:id').delete( function(req, res) {
//
//     User.remove({_id: req.params.id},(function (err, student) {
//         if (err) {
//             return res.send(err);
//         }
//         req.flash('success_msg', 'Student successfully deleted');
//         res.render('student', student);
//     });
// });



module.exports = router;