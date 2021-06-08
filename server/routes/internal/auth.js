const express = require('express');
const router = express.Router();
const Admin = require('../../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../../middlewares/jwt');
const { adminRegisterValidation, loginValidation } = require('../../utils/validation');

// Password hash function
async function hash(pwd) {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(pwd, salt);
	return hashedPassword;
}

// Admin Login
router.post('/login', async (req, res) => {
	// input validation
	const { error } = loginValidation(req.body);
	if (error) return res.json({error: "Invalid input format"});
	// checking if there are accounts with this username
	const user = await Admin.findOne({uname: req.body.uname});
	if(!user) return res.json({error: 'Username is not found'});
	// checking if the password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if(!validPass) return res.json({error: 'Invalid password'});
	// create and assign a token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, {expiresIn: Number(process.env.ACCESS_TOKEN_TIME)});
	return res.json({message: "success", displayName: user.uname, token: token, role: "admin"});
});


// Register an Admin
router.post('/register', async (req, res) => {
	const admin = await Admin.find();
	const number_of_admins = admin.length;
	// TODO: ADD MULTI USER SUPPORT
	if(number_of_admins >= 1) {
		return res.json({error: 'can not have more than one admin', current_admin: admin[0].uname});
	}
	// input validation
	const { error } = adminRegisterValidation(req.body);
	if (error) return res.status(400).send(error);
	// checking if there are accounts with this username
	const unameExists = await Admin.findOne({ uname: req.body.uname });
	if (unameExists) return res.status(400).json({ message: 'Username already exists' });
	// hash the password
	hashedPassword = await hash(req.body.password);
	// creating a new user
	const user = new Admin({
		uname: req.body.uname,
		password: hashedPassword,
	});
	try {
		const savedAdmin = await user.save();
		res.json({ _id: savedAdmin._id });
	} catch (err) {
		console.log(err);
		res.json({ error: err });
	}
});


router.post('/checkToken', verify, async (req, res) => {
	return res.json({message: "token is valid", displayName: req.body.uname, token: req.headers["auth-token"], role: "admin"});
});


module.exports = router;