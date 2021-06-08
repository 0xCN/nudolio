const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const { adminChangePasswordValidation } = require('../../utils/validation');
const bcrypt = require('bcryptjs');
const verify = require('../../middlewares/jwt');
const timecheck = require('../../utils/timecheck');


// Password hash function
async function hash(pwd) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(pwd, salt);
	return hashedPassword;
}


// Get a specific user
router.get('/me', verify, async (req, res) => {
	try {
		let user = await Admin.findById(req.user._id);
		user = await user.toObject();
		const normal_users = await User.countDocuments();
		user.password = "SECRET_PASSWORD"
		user["normal_users"] = normal_users;
		// Updating the dashboard times
		user = timecheck.check(user);
		res.json(user);
	} catch (err) {
		console.log(err)
		res.json({ message: err });
	}
});

// Delete an Admin
router.delete('/:userId', verify, async (req, res) => {
	try {
		const removedAdmin = await Admin.deleteOne({ _id: req.params.userId });
		res.json(removedAdmin);
	} catch (err) {
		res.json({ message: err });
	}
});

// Change admin password
router.patch('/change_password', verify, async (req, res) => {
	const { error } = adminChangePasswordValidation(req.body);
	if (error) return res.status(400).send(error);
	let admin = await Admin.findById(req.user._id);
	const newPassword = await hash(req.body.newPassword);
	const isValid = await bcrypt.compare(req.body.currentPassword, admin.password);
	if (isValid) {
		admin.password = newPassword;
		admin.save();
		res.json({message: 'success'});
	} else {
		res.json({error: 'Incorrect Password'});
	}
})


module.exports = router;