const userModels = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadImage = async (req, res) => {

    //Vérification de la taille et du format
    try {
        if(
            req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg"
        ) 
         throw Error("Invalid File !");
        if(req.file.size > 500000)
         throw Error("Max Size !");
    }catch(err) {
        const errors = uploadErrors(err);
        return res.status(201).json({errors})
    }

    let timestamp = new Date().getUTCMilliseconds();
    const fileName = req.body.firstName + timestamp + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../upload/${fileName}`
        )
    )

    //insertion de la photo dans la base de données
    try {
        await userModels.findByIdAndUpdate(
          req.body.userId,
          { $set : {foto: fileName}},
          { new: true, upsert: true, setDefaultsOnInsert: true},
          (err, docs) => {
            if (!err) return res.send(docs);
            else return res.status(500).send({ message: err });
          }
        );
      } catch (err) {
       // return res.status(500).send({ message: err });
      }
}