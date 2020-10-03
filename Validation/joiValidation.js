const Joi = require('joi');

const userValidation = data => {

    const schema = Joi.object({

        name: Joi.string().max(20).required(),
        email: Joi.string().email(),
        gender : Joi.string(),
        password : Joi.string().min(3).required(),
        resetpassword : Joi.string()

    });

    return schema.validate(data)

};

const loginValidation = data => {

    const schema = Joi.object({

        email: Joi.string().email(),
        password : Joi.string().min(3).required(),

    });

    return schema.validate(data)

};


module.exports.userValidation = userValidation;
module.exports.loginValidation = loginValidation;