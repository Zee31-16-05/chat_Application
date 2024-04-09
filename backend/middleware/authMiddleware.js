const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async(req,res,next) => {
     //const {authToken} = req.cookies;
     //console.log("-->",authToken);
     const authToken = req.headers["authorization"].split(" ")[1];
     console.log("validate token",authToken);
     if(authToken){
          const deCodeToken = await jwt.verify(authToken,process.env.SECRET_KEY);
          req.myId = deCodeToken.id;
          next();
     }else{
          res.status(400).json({
               error:{
                    errorMessage: ['Please Login First']
               }
          })
     }
}