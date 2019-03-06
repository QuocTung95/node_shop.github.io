const express = require('express');
const router = express.Router();
const db = require('../models')
const cors = require('cors')
const Carts = db.carts;
// const { isValidEmail, isValidName } = require('../utils');

/* GET users cart. */
router.get('/cart', cors() , async (req, res, next) =>{
  try {
    const response = await Carts.findAll();
    res.status(200).json({ result: response, httpCode: 200 })
  } catch (error) {
    throw Error(error.message)
  }
});

router.get('/cart/:userId', async (req, res) =>{
  const {userId} = req.params
  try {
    const data = await Carts.findOne({ where: { user_id : userId } })
    res.status(200).json({ result: data, httpCode: 200 })
  } catch (error) {
    throw Error(error.message)
  }
})

router.put('/cart/:user_id' , async (req , res) =>{
  const data = req.body
  const {user_id} = req.params;

  try {
    const cart = await Carts.findOne({ where: { user_id } });
    if(cart) {
      const response = await Carts.update(data, { where: { user_id }, returning: true });
      res.status(200).json({ response, httpCode: 200 })
    }

  } catch (error) {
    throw Error(error.message)
  }
})

router.post('/addcart', async (req, res) => {
  const data = req.body
  try {
    const response = await Carts.create(data)
    if (response) {
      return res.json({ httpCode: 200, result: response , message: 'đã thêm cart', status: true})
    } else
    return res.json({ httpCode: 400, message: 'Lỗi' , status: false})
  } catch (error) {
    throw Error(message.error)
  }
})




module.exports = router;
