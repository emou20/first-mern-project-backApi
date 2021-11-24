const userModels = require('../models/user.model');
const ObjectID = require("mongoose").Types.ObjectId;
const jwt = require('jsonwebtoken');

const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

const { signInErrors } = require('../utils/errors.utils');


////// authentification User ////

module.exports.signUp = async (req, res) => {
  const { firstName, lastName, date, adress, email, phone, role, login, pass } = req.body;

  try {
    if (
      req.file.detectedMimeType !== "image/jpg" &&
      req.file.detectedMimeType !== "image/png" &&
      req.file.detectedMimeType !== "image/jpeg"
    )
      throw Error("Invalid File !");
    if (req.file.size > 500000)
      throw Error("Max Size !");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ err })
  }

  let timestamp = new Date().getUTCMilliseconds();
  const fileName = req.body.firstName + timestamp + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../upload/${fileName}`
    )
  )

  let foto = fileName;

  try {
    const user = await userModels.create({ firstName, lastName, date, adress, email, phone, role, foto, login, pass });
    res.status(201).json({ user: user._id });
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
    const user = await userModels.login(login, pass);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: false, maxAge });
    res.status(200).json({ user: user._id })
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


module.exports.getUsers = async (req, res) => {
  const users = await userModels.find();
  res.status(200).json(users);
  console.log(req.cookie.jwt);
}

module.exports.getUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }

  await userModels.findById({ _id: req.params.id }, function (err, docs) {
    if (err) {
      return res.status(500).send("user error" + err)
    }
    else {
      return res.status(200).send(docs)
    }
  }
  );

}



module.exports.deleteUser = async (req, res) => {
  console.log(req.params.id);
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  try {
    await userModels.remove({ _id: req.params.id }).exec();
    return res.status(200).json({ message: "Utilisateur supprimé" });

  } catch (err) {
    return res.status(500).json({ message: err })
  }
}



module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  let foto = "";

  if (req.file !== null) {

    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      )
        throw Error("Invalid File !");
      if (req.file.size > 500000)
        throw Error("Max Size !");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ err })
    }

    let timestamp = new Date().getUTCMilliseconds();
    const fileName = req.body.firstName + timestamp + ".jpg";

    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../upload/${fileName}`
      )
    )

    foto = fileName;
  } else {
    foto = req.body.file;
  }

  try {
    await userModels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          date: req.body.date,
          email: req.body.email,
          adress: req.body.adress,
          phone: req.body.phone,
          foto: foto,
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


module.exports.updateUserRole = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }

  try {
    await userModels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          role: req.body.nvRole
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.json(docs);
        if (err) return res.status(500).send(err);
      }
    );

  } catch (err) {
    //res.status(500).json( { message: err });
    // console.log(err)
  }
};