const formidable = require('formidable')
const validator = require('validator')
const registerModel = require('../models/authModel')
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const console = require('console');

module.exports.userRegister = async (req, res, next) => {
     const {
          userName,
          email,
          password,
          confirmPassword
     } = req.body

     console.log("==> reached here");
     // res.cookie('cookieName', '1', {
     //      expires: new Date(Date.now() + 900000),
     //      httpOnly: true
     // }) 

     const error = [];

     if (!userName) {
          error.push('Please provide your user name');
     }
     if (!email) {
          error.push('Please provide your Email');
     }
     if (email && !validator.isEmail(email)) {
          error.push('Please provide your Valid Email');
     }
     if (!password) {
          error.push('Please provide your Password');
     }
     if (!confirmPassword) {
          error.push('Please provide your confirm Password');
     }
     if (password && confirmPassword && password !== confirmPassword) {
          error.push('Your Password and Confirm Password not same');
     }
     if (password && password.length < 6) {
          error.push('Please provide password mush be 6 charecter');
     }
     //   if(Object.keys(files).length === 0){
     //        error.push('Please provide user image');
     //   }
     if (error.length > 0) {
          res.status(400).json({
               error: {
                    errorMessage: error
               }
          })
     } else {
          try {
               const checkUser = await registerModel.findOne({
                    email: email
               });

               if (checkUser) {
                    res.status(404).json({
                         error: {
                              errorMessage: ['Your email already exited']
                         }
                    })
               } else {

                    const userCreate = await registerModel.create({
                         userName,
                         email,
                         password: await bcrypt.hash(password, 10),
                         //image: req.file.filename
                    })

                    const token = jwt.sign({
                         id: userCreate._id,
                         email: userCreate.email,
                         userName: userCreate.userName,
                         //image: userCreate.image,
                         registerTime: userCreate.createdAt
                    }, process.env.SECRET_KEY, {
                         expiresIn: process.env.TOKEN_EXP
                    })

                    console.log(token);

                    const options = {
                         expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)
                    }

                    res.cookie('authToken', JSON.stringify(token), options)
                    res.status(201).json({
                         successMessage: 'Your Register Successful ',
                         token
                    })
                    console.log('cookie created successfully');
               }

          } catch (error) {
               console.log(error);
               res.status(500).json({
                    error: {
                         errorMessage: ['Interanl Server Error']
                    }
               })
          }

     }


}

module.exports.userLogin = async (req, res) => {
     const error = [];
     const {
          email,
          password
     } = req.body;
     if (!email) {
          error.push('Please provide your Email');
     }
     if (!password) {
          error.push('Please provide your Passowrd');
     }
     if (email && !validator.isEmail(email)) {
          error.push('Please provide your Valid Email');
     }
     if (error.length > 0) {
          res.status(400).json({
               error: {
                    errorMessage: error
               }
          })
     } else {
          try {
               const checkUser = await registerModel.findOne({
                    email: email
               }).select('+password');
               

               if (checkUser) {
                    const matchPassword = await bcrypt.compare(password, checkUser.password);
                    console.log("------->",matchPassword);
                    if (matchPassword) {
                         const token = jwt.sign({
                              id: checkUser._id,
                              email: checkUser.email,
                              userName: checkUser.userName,
                              //image: checkUser.image,
                              registerTime: checkUser.createdAt
                         }, process.env.SECRET_KEY, {
                              expiresIn: process.env.TOKEN_EXP
                         });
                         const options = {
                              expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)
                         }

                         res.status(200).cookie('authToken', token, options).json({
                              successMessage: 'Your Login Successful',
                              token
                         })

                    } else {
                         res.status(400).json({
                              error: {
                                   errorMessage: ['Your Password not Valid']
                              }
                         })
                    }
               } else {
                    res.status(400).json({
                         error: {
                              errorMessage: ['Your Email Not Found']
                         }
                    })
               }


          } catch {
               res.status(404).json({
                    error: {
                         errorMessage: ['Internal Sever Error']
                    }
               })

          }
     }

}
