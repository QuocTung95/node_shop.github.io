var express = require('express');
const db = require('../models')
const Products = db.products;
const brands = db.brands;
const typeProducts = db.typeProducts
// const TypeProducts = db.TypeProducts;

var cors = require('cors')
var bodyParser = require('body-parser');
var fs = require('fs');
const router = express.Router();
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'image/')
    cb(null, 'images/product')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname )
  }
})
var upload = multer({ storage: storage })






router.get('/products', cors(), async (req, res, next) => {
    try {
        const response = await Products.findAll();
        res.status(200).json({ response})
    } catch (error) {
        throw Error(error.message)
    }
})
// get product by id
router.get('/products/:id', cors(), async (req, res, next) => {
    const {id} = req.params
    try {
        const response = await Products.findOne({ where : {id}});
        res.status(200).json({ response})
    } catch (error) {
        throw Error(error.message)
    }
})

// get product by gender boy
router.get('/products_boy', cors(), async (req, res, next) => {
  try {
      const response = await Products.findAll({where : {gender : "Nam"} || {gender : "nam"}});
      res.status(200).json({ response})
  } catch (error) {
      throw Error(error.message)
  }
})

// get product boy by price DESC
router.get('/sortproducts/:direction', cors(), async (req, res, next) => {
  try {
    const {direction} = req.params
      const response = await Products.findAll( {
      order: [
        ['price' , `${direction}`],
        ],
    });
      res.status(200).json({ response})
  } catch (error) {
      throw Error(error.message)
  }
})

// get product by gender girl
router.get('/products_girl', cors(), async (req, res, next) => {
  try {
      const response = await Products.findAll({where : {gender : "Nữ"} || {gender : "nữ"}});
      res.status(200).json({ response})
  } catch (error) {
      throw Error(error.message)
  }
})

// get hot-product
router.get('/hotProduct', cors(), async (req, res, next) => {


  try {
      const response = await Products.findAll({where : {hot_product : true}});
      res.status(200).json({ response})
  } catch (error) {
      throw Error(error.message)
  }
})

// get by brand
router.get('/productsBrand/:name', cors(), async (req, res, next) => {
  const {name} = req.params
  try {
      const response = await Products.findAll({where : {brand}});
      res.status(200).json({ response})
  } catch (error) {
      throw Error(error.message)
  }
})



router.put('/products/:id', cors() , async (req, res, next) =>{
    const data = req.body;
    const {id} = req.params;
    const test = '';
    // Select * from shipper where id = id;
    try {
      const product = await Products.findOne({ where: { id } })
      if (!product) {
        return res.status(400).json({ httpCode: 400, message: 'product khong ton tai trong he thong', name: "UPDATE_product_ERROR" })
      }
      const response = await Products.update(data, { where: { id }, returning: true });
      if (response)
        res.status(200).json({ response: response, httpCode: 200, status : true })
    } catch (error) {
      throw Error(error.message)
    }
})

router.post('/upload', cors() ,  upload.array('images', 10), async (req, res) => {
    const data = req.body;
    // validation cho data
    try {
      // insert into products values (,);
      const response = await Products.create(data);
      if (response) {
        res.status(200).json({ httpCode: 200, result: response })
      }
    } catch (error) {
      throw Error(error.message)
    }
})

// DELETE PRODUCT BY ID
router.delete('/product/delete/:id', cors(), async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Products.findOne({ where: { id } })
    if(product){
      const response = await Products.destroy({ where: { id } })
      res.status(200).json({ httpCode: 200,product, message: "xoa thanh cong" });
    }
  } catch (error) {
    throw Error(error.message)
  }
})

// DELETE ALL PRODUCT
router.delete('/products', cors(), async (req, res) => {
  try {
      const response = await Products.destroy({ where: {}, truncate: true })
      res.status(200).json({ httpCode: 200, message: "xoa tất cả thanh cong" });
  } catch (error) {
    throw Error(error.message)
  }
})




router.get('/typeProduct/:id', cors(), async (req, res, next) => {
    const {id} = req.params;
    try {
        const response = await Brands.findAll({
            // attributes
            where : {id},
            include : {
                model: TypeProducts,
                as: 'types',
                required: false
            }
        });
        if (response.length > 0) {
            res.json({
                result: 'ok',
                data: response[0],
                message: "query list of type successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find Todo to show"
            });
        }
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `query list of failed. Error: ${error}`
        });
    }
})






module.exports = router;