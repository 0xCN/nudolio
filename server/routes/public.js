const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Keys = require('../models/Keys');
const { userRegisterValidation, activateValidation } = require('../utils/validation');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const md5 = require('md5');
const timecheck = require('../utils/timecheck');


const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/*
    THIS IS THE ONLY FILE YOU NEED TO EDIT IF YOU WANT TO WRITE YOUR OWN KEY ACTIVATION LOGIC
    EDITING ANY FILE WITHIN THE `internal/` DIRECTORY WILL MAKE THE WEB MANAGER GO DOO DOO
*/


// Password hash function
async function hash(pwd) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(pwd, salt);
	return hashedPassword;
}

function generateHardwareId(id, hardware_key){
    // you can change this however you want (before you have any users)
    return md5(id.substr(1) + hardware_key.substr(2));
}


// Register user
router.post('/user/register', async (req, res) => {
	// input validation
	const { error } = userRegisterValidation(req.body);
	if (error) return res.json({error: error});

	// checking if there are accounts with this email
	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists) return res.json({ error: 'Email already exists' });

	// hash the password
	hashedPassword = await hash(req.body.password);

	// creating a new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});
	try {
		const savedUser = await user.save();
		res.json({ _id: savedUser._id });
	} catch (err) {
        console.log(err);
		res.json({ error: err });
	}
});


// Activate software
router.post('/activate', async (req, res) => {
	// input validation
	const { error } = activateValidation(req.body);
	if (error) return res.status(400).send(error);
    var user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "user doesn't exist" });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({message: 'Invalid password'});
    if (!req.body.hardware_key) return res.status(400).json({message: 'need hardware key'});

    // searching for unassigned keys
    var key = await Keys.findOneAndDelete({ key: req.body.key });
    const hardwareId = generateHardwareId(user._id.toString(), req.body.hardware_key);

    let sale = false;
    let activatedBefore = false;
    let date = new Date();

    // if the unassigned key doesn't exist, check the user (maybe it's an assigned key)
    if (!key) {
		for (var i in user.purchased_keys) {
            if (req.body.key == user.purchased_keys[i].key) {
                key = user.purchased_keys[i];
                if (user.purchased_keys[i].hardware_ids.indexOf(hardwareId) > -1) activatedBefore = true;
            }
		}
        if (!key) {
            return res.status(400).json({ error: "key doesn't exist"});
        }
    } else {
        // key = unassigned: user bought the key
        sale = true;
    }
    let admin = await Admin.findById(key.product_owner);
    if(!admin) return res.status(400).json({ error: "product owner doesn't exist" });
    const reachedLimit = (key.activation_limit - key.hardware_ids.length) <= 0;
    if (reachedLimit && !activatedBefore) {
        return res.status(400).json({ message:  'reached activation limit'});
    }

	try {

        let month = monthNames[date.getMonth()]
        let product = await admin.products.id(key.product_id);
        // checking if product does not exist
        if (!product) {
            return res.status(400).json({ message: "this product doesn't exist anymore" });
        }
        // DO NOT REMOVE THIS LINE (UPDATES TIMES ON THE DASHBOARD)
        admin = timecheck.check(admin);
        // adding data to our dashboard
        if (sale) {
            admin.dashboard.sales.week.revenue += key.price;
            admin.dashboard.sales.month.revenue += key.price;
            admin.dashboard.sales.year.revenue += key.price;
            admin.dashboard.sales.all_time += key.price;
            admin.dashboard.graph[month] += 1;
            product.sold_keys.num += 1;
            product.revenue += key.price;
            // assigning the key
            await user.purchased_keys.push(key);
        }

        if (!activatedBefore) {
            product.sold_keys.clients += 1;
            await key.hardware_ids.push(hardwareId);
        }

        product.sold_keys.last_update = Date.now();
        admin.dashboard.traffic.requests += 1;

        await admin.save();
        await user.save();
		res.json({
            message: activatedBefore?"aready activated":"success",
            _id: user._id,
            remaining_activation: (key.activation_limit - key.hardware_ids.length)
        });
	} catch (err) {
		res.json({ message: err.toString() });
        console.log(err);
	}
});


module.exports = router;