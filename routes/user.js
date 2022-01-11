var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next();
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  let user = req.session.user
    productHelpers.getAllProducts().then((products) => {
      res.render('user/view-products', { products, user })
    })
});

router.get('/login', (req, res) => {
  // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('user/login',{loginErr: req.session.loginErr});
  req.session.loginErr=false;
})

router.get('/signup', (req, res) => {
  res.render('user/signup');
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  })
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    } else {
      req.session.loginErr=true;
      res.redirect('/login');
    }
  })
})
router.get('/logout', (req, res) => {
  // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.destroy();
  res.redirect('/');
})
router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/cart');
})



module.exports = router;
