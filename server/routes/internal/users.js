const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const verify = require('../../middlewares/jwt');

// Get all users
router.get('/', verify, async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.json({ message: err });
	}
});

// Simple Pagination
router.get('/paginate', verify, async (req, res) => {
	let query = {};
	// available search keys
	let selectors = ['name', 'email']; 
	if (req.query.selector && req.query.search) {
		if (selectors.indexOf(req.query.selector) == -1) {
			return res.json({error: "bad selector, you can only choose: [ " + selectors.join(' ') + ']'});
		}
		query[req.query.selector] = {
			$regex: req.query.search,
			$options: 'i' // case insensitive
		}
	};

	if (req.query.id) {
		query = {_id: req.query.id};
	}
	
	let pageOptions = {
		page: parseInt(req.query.page) - 1 || 0,
		limit: parseInt(req.query.limit) || 10
	};

	if (req.query.page && req.query.limit) {
		User.paginate(
			query,
			{
				offset: pageOptions.page * pageOptions.limit,
				limit: pageOptions.limit,
				sort: { createdAt: -1 }
			},

			(err, records) => {
				if (err) {
					console.log(err);
					res.json({error: err.toString()});
				} else {
					res.json(records);
				}
			}
		);
	}
});

// Get a specific user
router.get('/:userId', verify, async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

// Delete user
router.delete('/:userId', verify, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.userId });
		if (user.purchased_keys.length > 0) {
			return res.json({error: "remove all your keys first"});
		}
		const removedUser = await User.deleteOne({ _id: req.params.userId });
		res.json(removedUser);
	} catch (err) {
		res.json({ message: err });
	}
});



module.exports = router;