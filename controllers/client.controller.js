const clientModels = require('../models/client.model');
const ObjectID = require("mongoose").Types.ObjectId;
const jwt = require('jsonwebtoken');


const { signInErrors } = require('../utils/errors.utils');


////// authentification User ////

module.exports.signUp = async (req, res) => {
  const { firstName, lastName, phone, email,adress, login, pass,question,reply } = req.body;

  try {
    const client = await clientModels.create({ firstName, lastName, phone, email,adress, login, pass,question,reply });
    res.status(201).json({ client: client._id });
  }
  catch (err) {
    console.log(err);
    res.status(200).send({ err })
  }
}


const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  })
};



module.exports.signIn = async (req, res) => {
  const { login, pass } = req.body;

  try {
    const client = await clientModels.login(login, pass);
    const token = createToken(client._id);
    res.cookie('jwt', token, { httpOnly: false, maxAge });
    res.status(200).json({ client: client._id })
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
}


module.exports.logouttt = (req, res) => {

  console.log("je syis la");
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}



/////////////////////////////////////////


module.exports.getClients = async (req, res) => {
  const clients = await clientModels.find();
  res.status(200).json(clients);
  console.log(req.cookie.jwt);
}

module.exports.getClient = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }

  await clientModels.findById({ _id: req.params.id }, function (err, docs) {
    if (err) {
      return res.status(500).send("user error" + err)
    }
    else {
      return res.status(200).send(docs)
    }
  }
  );

}



module.exports.deleteClient = async (req, res) => {
  console.log(req.params.id);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  try {
    await clientModels.remove({ _id: req.params.id }).exec();
    return res.status(200).json({ message: "Client supprimé" });

  } catch (err) {
    return res.status(500).json({ message: err })
  }
}



module.exports.updateClient = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }

  try {
    await clientModels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
          adress: req.body.adress,
          login: req.body.login,
          pass: req.body.pass,
          question: req.body.question,
          reply: req.body.reply,
        },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send(err);
      }
    );
  } catch (err) {
    //res.status(500).send( "l'erreur est :" + err );
    //console.log(err)
  }

};

