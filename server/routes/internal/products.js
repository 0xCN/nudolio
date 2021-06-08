const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const verify = require('../../middlewares/jwt');
const { productValidation } = require('../../utils/validation');

// get all products related to the admin user
router.get('/', verify, async (req, res) => {
	try {
		let user = await Admin.findById(req.user._id);
		res.json(user.products);
	} catch (err) {
		res.json({ message: err });
	}
});


// add product
router.post('/', verify, async (req, res) => { // this doesn't need verification
    // input validation
	const { error } = productValidation(req.body);
    if (error) return res.json({message: error});
    try {
		const updatedAdmin = await Admin.updateOne(
			{ _id: req.user._id },
			{ $addToSet:{products: req.body} }
		);
		res.json(updatedAdmin.products);
	} catch (err) {
        console.log(err);
		res.json(err);
	}
});


// delete product
router.delete('/', verify, async (req, res) => {
	console.log(req.body);
	try {
		const removedProduct = await Admin.updateOne(
			{ _id: req.user._id },
			{ $pull: { products: { _id: req.body._id } } }
		);
		res.json(removedProduct);
	} catch (err) {
		res.json({ message: err });
	}
});

// update product
router.patch('/', verify, async (req, res) => {
	try {
		const admin = await Admin.findOne({ _id: req.user._id});
		for (var i in admin.products){
			var product = admin.products[i];
			if(product != null && product._id == req.body._id) {
				for(key in req.body){
					if(key in product)
						admin.products[i][key] = req.body[key];
				}
				admin.save();
				break;
			}
		}
		res.json(admin);
	} catch (err) {
		res.json({ message: err.toString() });
		console.log(err)
	}
});




module.exports = router;