var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');
var { dummyLogins } = require('../helpers/admin-helpers');
/* GET users listing. */

router.get('/', (req, res) => {
  res.render('admin/admin-login',{admin:true})
})
router.post('/admin-login',(req,res)=>{
  if (dummyLogins.email === req.body.email && dummyLogins.password === req.body.password) {
      req.session.user = req.body;
      req.session.loggedIn=true;
      productHelpers.getAllProducts().then((products) => {
      res.render('admin/view-products', { admin: true, products })
      })
    }else {
      var invalid = "Enter correct username or password"
      res.render('admin/admin-login', { invalid })
    }
})

// router.get('/', function (req, res, next) {
//   productHelpers.getAllProducts().then((products) => {
//     res.render('admin/view-products', { admin: true, products })
//   })
// });
router.get('/view-products', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-products', { admin: true, products })
  })
});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product', { admin: true })
})
router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.image);
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product', { admin: true });
      }
    })
  });
})
router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/');
  })
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  // console.log(product);
  res.render('admin/edit-product', { product });
})

router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id;
  productHelpers.updateProduct(req.params.id, req.body).then(() => {
    res.redirect('/admin');
    if (req.files.image) {
      let image = req.files.image;
      image.mv('./public/product-images/' + id + '.jpg');
    }
  })
})

router.get('/view-users', (req, res) => {
  userHelpers.getAllUsers().then((users) => {
    // console.log(products);
    res.render('admin/view-users', { admin: true, users })
  })
})

router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin/');
  })
})

router.get('/logout', (req, res) => {
  // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.session.destroy();
  res.redirect('/admin');
})
module.exports = router;
