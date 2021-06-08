const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const Keys = require('../../models/Keys');
const verify = require('../../middlewares/jwt');

const { keyDeleteValidation, keyMultiValidation } = require('../../utils/validation');

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Randomly generates keys
function keyGen(length = 16) {
	if(length == undefined || length < 10 || length > 25) length = 16;
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
	for (var i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
    return result.match(/.{1,4}/g).join('-');
}


/*
	UNASSIGNED KEYS
*/

// Get last generated keys
router.get('/', verify, async (req, res) => {
	try {
		let keys = await Keys.find().sort('-date').limit(req.query.limit ? parseInt(req.query.limit): 10);
		res.json(keys);
	} catch (err) {
		res.json({ message: err });
	}
});

// Paginate unassigned keys
router.get('/paginate', verify, async (req, res) => {
	let query = {};
	let selectors = ['product_id', 'key'];
	if (req.query.selector && req.query.search) {
		if (selectors.indexOf(req.query.selector) == -1) {
			return res.json({ error: "bad selector, you can only choose: [" + selectors.join(', ') + ']' });
		}
		query[req.query.selector] = {
			$regex: req.query.search,
			$options: 'i'
		}
	};

	if (req.query.product_id) {
		query = { product_id: req.query.product_id };
	}

	let pageOptions = {
		page: parseInt(req.query.page) - 1 || 0,
		limit: parseInt(req.query.limit) || 10
	};

	if (req.query.page && req.query.limit) {
		Keys.paginate(
			query,
			{
				offset: pageOptions.page * pageOptions.limit,
				limit: pageOptions.limit,
				sort: { createdAt: -1 }
			},
			(err, records) => {
				if (err) {
					res.json({ error: err.toString() });
				} else {
					res.json(records);
				}
			}
		);
	}
});



// Add multiple unassigned keys
router.post('/multi', verify, async (req, res) => {
	const { error } = keyMultiValidation(req.body);
	if (error) return res.json({error: error});
	// confusion: 100
	try {
		var body = JSON.parse(JSON.stringify(req.body));
		delete body["count"];
		delete body["key_len"];
		body["product_owner"] = req.user._id;
		// they all have the same product_id		
		for (var i = 0; i < req.body.count; i++){
			body["key"] = ("key_len" in req.body) ? keyGen(req.body.key_len):keyGen();
			let key = new Keys(body);
			await key.save();
		}
		let admin = await Admin.findById(req.user._id);
		let product = await admin.products.id(req.body.product_id);
		product.keys_overall += req.body.count;
		await admin.save();
		res.json({ message: "done" });
	} catch (err) {
      res.json({ error: err.toString() });
	}
});


// Delete unassigned keys
router.delete('/', verify, async (req, res) => {
	const { error } = keyDeleteValidation(req.body);
    if (error) return res.json({message: error});
	try {
		let key;
		if ("_id" in req.body){
			// delete one key
			key = await Keys.findOneAndDelete({_id: req.body._id});
			let admin = await Admin.findById(key.product_owner);
			let product = await admin.products.id(key.product_id);
			product.keys_overall -= 1;
			await admin.save();
		} else if ("product_id" in req.body) {
			// delete many keys by product_id
			let keys = await Keys.find(req.body);
			let admin = await Admin.findById(keys[0].product_owner);
			for (var i in keys) {
				let product = await admin.products.id(keys[i].product_id);
				product.keys_overall -= 1;
			}
			key = await Keys.deleteMany(req.body);
			await admin.save();
		} else if ("keys" in req.body) {
			// delete many by id
			let keys = req.body.keys;
			let admin = await Admin.findById(keys[0].product_owner);
			let key_ids = [];
			for (var i in keys) {
				let product = await admin.products.id(keys[i].product_id);
				if (product) product.keys_overall -= 1;
				key_ids.push(keys[i]._id);
			}
			key = await Keys.deleteMany({ 
				_id: {
					$in: key_ids
				}
			})
			await admin.save();
		}
		res.json(key);
	} catch (err) {
		res.json({ message: err.toString() });
	}
});


// Update an unassigned key
router.patch('/', verify, async (req, res) => {
	try {
		const admin = await Admin.findOne({ _id: req.user._id});
		for (var i in admin.products){
			var product = admin.products[i];
			if(product != null && product._id == req.body._id) {
				for(key in req.body){
					if(key in product) {
						admin.products[i][key] = req.body[key];
					}
				}
				admin.save();
				break;
			}
		}
		res.json(admin);
	} catch (err) {
		res.json({ message: err.toString() });
	}
});


// Assign multiple keys
router.patch('/assign', verify, async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		if (!user) return res.json({ error: "user doesn't exist" });

		let admin = await Admin.findById(req.user._id);
		if (!admin) return res.json({ error: "product owner doesn't exist" });

		let keyList = req.body.keys;
		let date = new Date();
		let month = monthNames[date.getMonth()]

		for (let i = 0; i < keyList.length; i++) {
			var key = await Keys.findOneAndDelete({ key: keyList[i].key });
			if (key) {
				let product = await admin.products.id(key.product_id);
				if (product) {
					// assigning key
					await user.purchased_keys.push(key);
					// updating the dashboard
					admin.dashboard.sales.week.revenue += key.price;
					admin.dashboard.sales.month.revenue += key.price;
					admin.dashboard.sales.year.revenue += key.price;
					admin.dashboard.sales.all_time += key.price;
					admin.dashboard.graph[month] += 1;
					product.sold_keys.num += 1;
					product.revenue += key.price;
				}
			}
		}

		await admin.save();
		await user.save()

		res.json({ message: "keys assigned" });
	} catch (err) {
		res.json({ error: err.toString() });
	}
});



/*
	ASSIGNED KEYS
*/

// Pagination made for the data table
router.get('/assigned/paginate', verify, async (req, res) => {
	try {
		let keyList = [];
		let users = await User.find();
		for (i in users) {
			if (users[i].purchased_keys && users[i].purchased_keys.length ) {
				for (kindex in users[i].purchased_keys){
					const key = users[i].purchased_keys[kindex];
					if (key.product_owner == req.user._id) {
						keyList.push({
							"name": users[i].name,
							"user_id": users[i]._id,
							"email": users[i].email,
							"date": key.date,
							"activation_limit": key.activation_limit - key.hardware_ids.length,
							"price": key.price,
							"key": key.key,
							"product_id": key.product_id,
							"hardware_ids": key.hardware_ids,
							"_id": key._id
						});
					}
				}
			}
		}
		const selectors = ["key", "email", "product_id"];
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit)
		const offset = (page-1) * limit
		if (req.query.selector && req.query.search && selectors.indexOf(req.query.selector) > -1) {
			let temp = [];
			keyList.forEach( key => {
				if (key[req.query.selector] == req.query.search) {
					temp.push(key);
				}
			})
			keyList = temp;
		}
		const docs = keyList.slice(offset, offset+limit);
		var data = {
			"limit": limit,
			"page": page,
			"docs": docs,
			"offset": offset,
			"totalDocs": keyList.length,
			"totalPages": Math.ceil(keyList.length / limit),
			"hasNextPage": Math.ceil(keyList.length / limit) - page > 0 ? true : false,
			"hasPrevPage": req.query.page > 1 ? true : false,
			"prevPage": page > 1 ? page - 1 : null,
			"nextPage": Math.ceil(keyList.length / limit) - page > 0 ? page + 1 : null,
			"pagingCounter": (page - 1) * 10 + 1
		}
		res.json(data);
	} catch (err) {
		res.status(400).json({ message: err.toString() });
	}
});


// Search for an assigned key
router.post('/assigned/', verify, async (req, res) => {
	try {
		var keyList = []; 
		let rkey = Object.keys(req.body)[0];
		let stri = `purchased_keys.${rkey}`;
		let query = {};
		query[stri] = req.body[rkey];
		let users = await User.find(query);
		for (i in users) {
			let doc = { name: users[i].name, _id: users[i]._id, keys: [] };
			for (n in users[i].purchased_keys) {
				if (users[i].purchased_keys[n][rkey] == req.body[rkey]) {
					doc["keys"].push(users[i].purchased_keys[n])
				}
			}
			keyList.push(doc);
		}

		res.json(keyList);
	} catch (err) {
		res.status(400).json({ message: err.toString() });
	}
});


// Delete key from user purchased_key
router.delete('/assigned/', verify, async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).json({ message: "user doesn't exist" });

	let key = await user.purchased_keys.id(req.body._id);
	if (!key) return res.status(400).json({ message:  "key doesn't exist" });

	let admin = await Admin.findOne({ _id: key.product_owner });
	if (!admin) return res.status(400).json({ message: "product owner doesn't exist" });

	 let product = await admin.products.id(key.product_id);
	// if (!product) return res.status(400).json({ message:  "this product doesn't exist anymore" });

	try {
		let date = new Date();
		let month = monthNames[date.getMonth()];

		admin.dashboard.sales.week.revenue -= key.price;
		admin.dashboard.sales.month.revenue -= key.price;
		admin.dashboard.sales.year.revenue -= key.price;
		admin.dashboard.sales.all_time -= key.price;
		admin.dashboard.graph[month] -= 1;
		if(product){
			product.sold_keys.num -= 1;
			product.revenue -= key.price;
			product.keys_overall -= 1;
		}
		if (key.hardware_ids && product) {
			product.sold_keys.clients -= key.hardware_ids.length;
		}
		await user.purchased_keys.pull({_id: req.body._id});

		await admin.save();
		await user.save();

		res.json({ message: "key deleted" });
	} catch (err) {
		res.status(400).json({ message: err.toString() });
	}
});


module.exports = router;