const User = require('../models/authModel');
const messageModel = require('../models/messageModel');
const formidable = require('formidable');
const fs = require('fs');

module.exports.getFriends = async (req, res) => {
     const myId = req.myId;
     let fnd_msg = [];
     try {
          const friendGet = await User.find({
               _id: {
                    $ne: myId
               }
          });

          for (let i = 0; i < friendGet.length; i++) {
               let lmsg = await getLastMessage(myId, friendGet[i].id);
               fnd_msg = [...fnd_msg, {
                    fndInfo: friendGet[i],
                    msgInfo: lmsg
               }]

          }
          res.status(200).json({
               success: true,
               friends: fnd_msg
          })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }
}

module.exports.messageUploadDB = async (req, res) => {

     const {
          senderName,
          reseverId,
          message
     } = req.body
     const senderId = req.myId;


     try {
          const insertMessage = await messageModel.create({
               senderId: senderId,
               senderName: senderName,
               reseverId: reseverId,
               message: {
                    text: message,
                    image: ''
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })

     } catch (error) {
          console.log(error);
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }

     console.log(senderId)
     console.log(req.body);
}

const getLastMessage = async (myId, fdId) => {
     const msg = await messageModel.findOne({
          $or: [{
                    senderId: myId,
                    reseverId: fdId
               },
               {
                    senderId: fdId,
                    reseverId: myId
               }
          ]
     }).sort({
          updatedAt: -1
     }).lean();
     return msg;
}

module.exports.messageGet = async (req, res) => {
     const myId = req.myId;
     const fdId = req.params.id;
console.log("messageget", myId, fdId);
     try {
          let getAllMessage = await messageModel.find({
               $or: [{
                         senderId: myId,
                         reseverId: fdId
                    },
                    {
                         reseverId: myId,
                         senderId: fdId
                    }
               ]
          })

          // getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.reseverId === fdId || m.reseverId ===  myId && m.senderId === fdId );

          res.status(200).json({
               success: true,
               message: getAllMessage
          })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Server error'
               }
          })

     }

}

module.exports.ImageMessageSend = async (req, res) => {
     const senderId = req.myId;
     const {
          senderName,
          reseverId,
          imageName
     } = req.body;
     console.log("-------------------------------------------------", req.body, req.file);

     try {
          const insertMessage = await messageModel.create({
               senderId: senderId,
               senderName: senderName,
               reseverId: reseverId,
               message: {
                    text: '',
                    image: req.file.filename
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })
     } catch (error) {
          console.log(error);
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }


}

module.exports.messageSeen = async (req,res) => {
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
         status : 'seen' 
     })
     .then(() => {
          res.status(200).json({
               success : true
          })
     }).catch(() => {
          res.status(500).json({
               error : {
                    errorMessage : 'Internal Server Error'
               }
          })
     })
}


module.exports.deliveredMessage = async (req,res) => {
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
         status : 'delivered' 
     })
     .then(() => {
          res.status(200).json({
               success : true
          })
     }).catch(() => {
          res.status(500).json({
               error : {
                    errorMessage : 'Internal Server Error'
               }
          })
     })
}