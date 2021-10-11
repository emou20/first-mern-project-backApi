const jwt = require('jsonwebtoken');
const userModels = require('../models/user.model');


// vérification de la toneken si elle est valide ou pas 
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, docs) => {
            if(err){
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                next();
            }else{
                let user = await userModels.findById(docs.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user=null;
        next();
    }

}



//vérification de la token pour la connexion automatique (si le cookie exite et valable)
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.send(200).json('no token')
        } else {
          console.log(decodedToken.id);
          next();
        }
      });
    } else {
      console.log('No token');
    }
  };
  