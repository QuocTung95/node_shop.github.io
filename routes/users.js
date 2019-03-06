const express = require('express');
const router = express.Router();
const db = require('../models')
const cors = require('cors')
const User = db.users;
const fs = require('fs')
const passport = require('passport');


const bodyParser = require('body-parser')


router.use(express.json());
router.use(express.urlencoded({ extended: true }));
// Boydy parser
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());





const nodemailer = require('nodemailer')
const PORT = 8080
const sendEmail = async (receiverEmail, password) => {	    
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "quoctung.haui@gmail.com", 
                pass: "Hung2011"
            }
        })
        let mailOptions = {
            from: '"Techmaster Test" <quoctung.haui@gmail.com>', //Email người gửi
            to: receiverEmail, 
            subject: 'Activate email',         
            html: `<h1>Please click here to activate your account:</h1>
                   http://${require('os').hostname()}:${PORT}/users/activateUser?password=${password}&email=${receiverEmail}` 
        }
        let info = await transporter.sendMail(mailOptions)
    } catch(error) {
        throw error
    }
}




/* GET user listing. */
router.get('/user',  async (req, res, next) =>{
  try {
    const query = req.query; // Lấy thông tin query trên url
    const id = req.params;
    const response = await User.findAll();
    res.status(200).json({ result: response, httpCode: 200 })
  } catch (error) {
    throw Error(error.message)
  }
});

router.get('/user/:id', async (req, res) =>{
  try {
    // Lấy thông tin params trên url
    const {id} = req.params;
    const user = await User.findOne({ where: { id } })
    // console.log('object :', user.dataValues);
    res.status(200).json({ result: user, httpCode: 200 })
  } catch (error) {
    throw Error(error.message)
  }
})


const activateUser = async (email, password) => {
  try {
      let foundUser = await User.findOne({email, password})
      if (!foundUser) {
          throw "Không tìm thấy User để kích hoạt"
      }    
      if (foundUser.active === false) {
          foundUser.active = true
          await foundUser.save()            
      } else {
          throw "User đã kích hoạt"//foundUser.active = 1
      }
  } catch(error) {        
      throw error       
  }
}

router.get('/activateUser', async (req, res) => {
  const {email, password  } = req.params
  try {
    await activateUser(email, password)
    res.status(200).json({ httpCode: 400, message: 'Kich hoat thanh cong' })
  } catch (error) {
    throw error       
  }
})

router.put('/user/:id', cors(), async (req, res, next ) => {
  const data = req.body;
  let {email , name} = req.body;
  const {id} = req.params;
  name = name.toLowerCase()
  // const validation = validateData(data);

  // Select * from user where id = id;
  const emailUpdate = await User.findOne({ where: { email } });

  try {
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return res.status(400).json({ httpCode: 400, message: 'user khong ton tai trong he thong', name: "UPDATE_user_ERROR" })
    }

    // validation data
    

    if (emailUpdate) {
      return res.status(400).json({  httpCode: 400, message: 'email đã tồn tại trong hệ thống'  })
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({  httpCode: 400, message: 'email không đúng định dạng'  })
    }
    const nameRegex = /^([a-zA-Z ]){2,30}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({  httpCode: 400, message: 'Tên không đươc chứa ký tự đặc biệt'  })
    }
    
    // UPDATE user
    // SET name = data.name, email = data.emai, ...
    // WHERE condition;
    const response = await User.update(data, { where: { id }, returning: true });
    if (response)
      res.status(200).json({ response, httpCode: 200 })
    else next();
  } catch (error) {
    throw Error(error.message)
  }
})


// DELETE USER
router.delete('/deleteuser/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.destroy({ where: { id } })
    res.status(200).json({ httpCode: 200, message: "xoa thanh cong" });
  } catch (error) {
    throw Error(error.message)
  }
})

// DELETE ALL USER
router.delete('/deletealluser', async (req, res) => {
  try {
    const response = await User.destroy({   where: {},
      truncate: true })
    res.status(200).json({ httpCode: 200, message: "xoa tất cả user thanh cong" });
  } catch (error) {
    throw Error(error.message)
  }
})




module.exports = router;
