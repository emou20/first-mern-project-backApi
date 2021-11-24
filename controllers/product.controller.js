const productModels = require('../models/product.model');
const ObjectID = require("mongoose").Types.ObjectId;

const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

const { signInErrors } = require('../utils/errors.utils');



module.exports.addProduct = async (req, res) => {
    const { nom, ref, desc } = req.body;
  
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
    const fileName = req.body.nom + timestamp + ".jpg";
  
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../upload/product/${fileName}`
      )
    )
  
    let foto = fileName;
  
    try {
      const product = await productModels.create({ nom, ref, foto, desc });
      res.status(201).json({ product: product._id });
    }
    catch (err) {
      console.log(err);
      res.status(200).send({ err })
    }
  }

  module.exports.getProducts = async (req, res) => {
    const products = await productModels.find();
    res.status(200).json(products);
  }


  module.exports.getProduct = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID non trouvée")
    }
  
    await productModels.findById({ _id: req.params.id }, function (err, docs) {
      if (err) {
        return res.status(500).send("product error" + err)
      }
      else {
        return res.status(200).send(docs)
      }
    }
    );
  
  }



  module.exports.deleteProduct = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send("ID non trouvée")
    }
    try {
      await productModels.remove({ _id: req.params.id }).exec();
      return res.status(200).json({ message: "produit supprimé" });
  
    } catch (err) {
      return res.status(500).json({ message: err })
    }
  }
  
module.exports.updateProduct = async (req, res) => {
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
      const fileName = req.body.nom + timestamp + ".jpg";
  
      await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../upload/product/${fileName}`
        )
      )
  
      foto = fileName;
    } else {
      foto = req.body.file;
    }
  
    try {
      await productModels.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            nom: req.body.nom,
            ref: req.body.ref,
            desc: req.body.desc,
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
  