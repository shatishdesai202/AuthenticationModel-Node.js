const express = require('express');

const route = express.Router();

const chalk = require('chalk');

const {
  userValidation
} = require('../Validation/joiValidation');

const MODEL = require('../Database/user');

const nodemailer = require('nodemailer');

const nodemailerSendgrid = require('nodemailer-sendgrid');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shatpatel000@gmail.com',
    pass: 'Abc@123123'
  }
});



route.post('/signup', async (req, res) => {

  let { error } = userValidation(req.body);

  if (error) { return res.status(400).send(error.details[0].message); }

  const { name, email, gender,password } = req.body;

  let isExist = await MODEL.findOne({ email: email });

  if (isExist) { return res.status(400).send('email is exist'); }

  const token = jwt.sign({ name, email, gender, password }, process.env.JWT_SECURITY_KEY , { expiresIn: '20m' });
  console.log(chalk.redBright.bgCyanBright(token));
  
  // var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'shatpatel000@gmail.com',
  //     pass: 'Abc@123123'
  //   }
  // });

  var mailOptions = {
    from: 'shatpatel000@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    html: `<h1> Activation Email </h1>
           <strong> Welcome ${name} Kindly Activate Your Email </strong>
           ${process.env.CLIENT_URL}/authenticationEmail/${token}`
  };

   transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({
        message : "Email has send successfully kindly check your inbox"
      })
    }
  });

});

route.post('/authenticationEmail/:id' , async (req, res)=>{

  token = req.params.id;
  
  jwt.verify(token, process.env.JWT_SECURITY_KEY , async function (err, decodedToken) {
    
    if (err) {
      console.log(err);
      return res.status(400).json({
            error: "Incorrect or Expire Link"
        });
    }

    let { name, email, gender, password } = decodedToken;

    let isExist = await MODEL.findOne({
            email: email
        });
    
    if (isExist) {
          return res.status(400).send('Your Account is Already Activated');
    }

    // Hash Password
    const salt = await bcrypt.genSalt(1);
    const hashedpassword = await bcrypt.hash(password, salt);
  
    let insertUser = await new MODEL({
      name: name,
      email: email,
      gender: gender,
      password: hashedpassword
    });

    try {

      let saveUser = await insertUser.save();
      res.send(saveUser);

    } catch (error) {

        res.status(400).send(error);
        console.log('saveUSER' + error);

    }

  });

});

route.put('/resetpassword', async(req, res)=>{

  let { email } = req.body;

  await MODEL.findOne({ email }, async(err, user)=>{

    if (err || !user) {
      return res.status(400).json({
          error: "Email Does Not Exist"
      });
    }

    const token = jwt.sign( { _id: user._id }, process.env.JWT_SECURITY_KEY , { expiresIn: '20m' });
    
    return await user.updateOne({ resetPassword : token }, (err, success)=>{

      if(err){
        return res.status(400).json({
          error : "Error in Reset Password Link"
        })
      }else{

        var mailOptions = {
          from: 'shatpatel000@gmail.com',
          to: email,
          subject: 'Sending Email using Node.js',
          html: `<h1> RESET PASSWORD LINK </h1>
                 <strong> Welcome ${success.name} Kindly Activate Your Email </strong>
                 ${process.env.CLIENT_URL}/resetpassword/${token}`
        };
      
         transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.json({
              message : "reset password link send successfully"
            })
          }
        });

      }

    });

  });

});


module.exports = route;