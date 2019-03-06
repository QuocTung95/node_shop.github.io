var express = require('express');
var router = express.Router();
const brandsRouter = require('./brands');
const productRouter = require('./products');
const userRoter = require('./users');
const cartRouter = require('./carts');
const loginRouter = require('./login');



router.use('/', brandsRouter )
router.use('/', productRouter )
router.use('/', userRoter)
router.use('/', cartRouter)
router.use('/', loginRouter)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
