const providerModels = require('../models/provider.model');
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.addProvider = async (req, res) => {
    const { name, phone, adress, mail, taxNumber } = req.body;
    try {
        const product = await providerModels.create({ name, phone, adress, mail, taxNumber });
        res.status(201).json({ product: product._id });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ err })
    }
}

module.exports.getProviders = async (req, res) => {
    const providers = await providerModels.find();
    res.status(200).json(providers);
}

module.exports.getProvider = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
    }
    await providerModels.findById({ _id: req.params.id }, function (err, docs) {
        if (err) {
            return res.status(500).send("product error" + err)
        }
        else {
            return res.status(200).send(docs)
        }
    }
    );
}

module.exports.deleteProvider = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
      }
      try {
        await providerModels.remove({ _id: req.params.id }).exec();
        return res.status(200).json({ message: "Fournisseur supprimé" });
    
      } catch (err) {
        return res.status(500).json({ message: err })
      }
}

module.exports.updateProvider = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
      }
      try {
        await providerModels.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              phone: req.body.phone,
              adress: req.body.adress,
              mail: req.body.mail,
              taxNumber: req.body.taxNumber,
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
}