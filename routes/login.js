const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
const cors = require('cors')
const bodyParser = require('body-parser')
const router = express.Router();
var cookieParser = require('cookie-parser')
const CookieStrategy = require('passport-cookie')
const jwt = require('jsonwebtoken')



//Passport
var passport = require('passport');

// const session = require('express-session')
router.use(cookieParser())

// Boydy parser
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Passport khởi tạo
// router.use(session({secret : 'quoctung'}))
// router.use(passport.initialize());
// router.use(passport.session());

const authCheck = (req, res, next) => {
  if(!req.isAuthenticated()){
      res.send('you need to login')
      console.log('req.cookies :', req.cookies); 
  } else {
      next();
  }
};


router.get('/me', authCheck, async (req, res) =>{
  try {
    res.json({userId: req._passport.session.user , status: true})
  } catch (error) {
    throw Error(error.message)
  }

})


// router.get('/current-user', async (req, res) =>{
//   try {
//     if(req.isAuthenticated()){
//       res.json({userId: req._passport.session.user , status: true})
      
//     } else {
//       res.json({message : 'please log in'})
//     }
//   } catch (error) {
//     throw Error(error.message)
//   }
// })

router.get('/current-user', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, 'quoctung', function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.status(200).send(decoded);
  });
});


// auth logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// auth with google+
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

// callback route for google to redirect to
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
});



// auth with google+
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['profile']
}));

// callback route for facebook to redirect to
router.get('/auth/facebook/redirect', (req, res) => {
  res.send('you reached the redirect URI');
});








router.get('/login' ,(req, res)=>{res.sendFile(__dirname + '/index.html')})
router.post('/login', cors(), function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.json({message: 'something wrong  ', status: false}) }
    if (!user) { return  res.json({message: 'user không tồn tại', status: false})}//res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return res.json({message: 'sth wrong', status: false}) }
      console.log('user in cookiefasdf :', user.dataValues.id);
      var token = jwt.sign({ id: user.dataValues.id }, 'quoctung', {expiresIn: 86400 });// expires in 24 hours
      res.json({message: 'log in thanh cong' , id: user.id,  status: true , token})
      // return res.redirect('/user/');
    });
  })(req, res, next);
});

// router.get("/profile",
//   passport.authenticate("cookie", { session: false }),
//   function(req, res) {
//     res.json(req.user);
//   });


// Profile
// router.get('/profile', passport.authenticate('local', { session: true }), (req, res, next) => {
//   res.json({user: req.user});
// });

router.post('/register',  async (req, res) => {
  
    const data = req.body;
    let {email , name , password , age, phone, active} = req.body
  
    const emailUpdate = await User.findOne({ where: { email } });
    
    try {
      // validation cho data
      if (emailUpdate) {
        return res.json({  httpCode: 400, message: 'email đã tồn tại trong hệ thống' , status: false })
      }
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        return res.json({  httpCode: 400, message: 'email không đúng định dạng' , status: false })
      }
      const nameRegex = /^([a-zA-Z ]){2,30}$/;
      if (!nameRegex.test(name)) {
        return res.json({  httpCode: 400, message: 'Tên không đươc chứa ký tự đặc biệt' , status: false })
      }
      var salt = await bcrypt.genSalt(10);
      let hashPass = await bcrypt.hash(password, salt);
        var response = await User.create({
            name,
            age,
            email,
            phone,
            password: hashPass,
            active
        });

        // await sendEmail(email, password)
        
        if (response) {
          return res.json({ httpCode: 200, result: response , message: 'Đăng ký thành công, mở email để kích hoạt', status: true})
        } else
        return res.json({ httpCode: 400, message: 'Lỗi' , status: false})
    } catch (error) {
      throw Error(error.message)
    }
  })



module.exports = router;
