// Validation
const Joi = require('@hapi/joi');

// Password Regex
normalPassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])");

// User Validation
const userRegisterValidation = (data) => {
    const schema = Joi.object({
	    name: Joi.string().min(6).max(30).required(),
	    email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).max(100).required().pattern(normalPassword),
        date: Joi.date(),
        purchased_keys: Joi.array()
    });
    return schema.validate(data);
}

const userUpdateValidation = (data) => {
    const schema = Joi.object({
	    name: Joi.string().min(6).max(30),
	    email: Joi.string().min(8).max(255).email(),
        password: Joi.string().min(8).max(100).pattern(normalPassword),
        date: Joi.date(),
        purchased_keys: Joi.array()
    });
    return schema.validate(data);
}

// Product Validation
const productValidation = (data) => {
    const schema = Joi.object({
	    name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3).max(200),
        keys_overall: Joi.number(),
        revenue: Joi.number(),
        sold_keys: {
            num: Joi.number(),
            clients: Joi.number()
        }
    });
    return schema.validate(data);
}

// Admin Validation
const adminRegisterValidation = (data) => {
    const schema = Joi.object({
	    uname: Joi.string().min(6).max(30).required(),
        password: Joi.string().min(8).max(100).required().pattern(normalPassword),
        date: Joi.date(),
        products: Joi.array()
    });
    return schema.validate(data);
}

const adminChangePasswordValidation = (data) => {
    const schema = Joi.object({
        currentPassword: Joi.string().min(8).max(100).pattern(normalPassword),
        newPassword: Joi.string().min(8).max(100).pattern(normalPassword)
    });
    return schema.validate(data);
}


// Key Validation
const keyValidation = (data) => {
    const schema = Joi.object({
        key: Joi.string().min(5).max(255).required(),
        product_id: Joi.string().min(5).max(255).required(),
        product_owner: Joi.string().min(5).max(255).required(),
        date: Joi.date(),
        activation_limit: Joi.number(),
        price: Joi.number().min(0).required(),
        hardware_ids: Joi.array()
    });
    return schema.validate(data);
}

const keyMultiValidation = (data) => {
    const schema = Joi.object({
        product_id: Joi.string().min(5).max(255).required(),
        date: Joi.date(),
        activation_limit: Joi.number(),
        price: Joi.number().min(0).required(),
        count: Joi.number().min(0).max(500).required(),
        key_len: Joi.number().min(16).max(25)
    });
    return schema.validate(data);
}

const keyDeleteValidation = (data) => {
    const schema = Joi.object({
        key: Joi.string().min(5).max(255),
        product_id: Joi.string().min(5).max(255),
        product_owner: Joi.string().min(5).max(255),
        date: Joi.date(),
        activation_limit: Joi.number(),
        price: Joi.number().min(0),
        hardware_ids: Joi.array(),
        _id: Joi.string().min(5).max(255),
        keys: Joi.array()
    });
    return schema.validate(data);
}

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
	    uname: Joi.string().min(5).max(255).required(),
	    password: Joi.string().min(8).max(100).required().pattern(normalPassword),
    });
    return schema.validate(data);
}

// public-api
const activateValidation = (data) => {
    const schema = Joi.object({
        hardware_key: Joi.string().min(6).max(255).required(),
	    key: Joi.string().min(6).max(255).required(),
	    email: Joi.string().min(8).max(255).email().required(),
        password: Joi.string().min(8).max(100).required().pattern(normalPassword),
    });
    return schema.validate(data);
}

// Exports
module.exports.userRegisterValidation = userRegisterValidation;
module.exports.userUpdateValidation = userUpdateValidation;
module.exports.adminChangePasswordValidation = adminChangePasswordValidation;
module.exports.adminRegisterValidation = adminRegisterValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.keyValidation = keyValidation;
module.exports.keyMultiValidation = keyMultiValidation;
module.exports.keyDeleteValidation = keyDeleteValidation;
module.exports.activateValidation = activateValidation;