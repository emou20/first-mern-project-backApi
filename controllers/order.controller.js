const orderModels = require('../models/order.model');
const userModels = require('../models/user.model');
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.addOrder = async (req, res) => {
    const { idProvider, idProduct, amount, date } = req.body;
    try {
        const order = await orderModels.create({ idProvider, idProduct, amount, date });
        res.status(201).json({ order: order._id });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ err })
    }
}

module.exports.getOrders = async (req, res) => {
    const orders = await orderModels.find();
    res.status(200).json(orders);
}

module.exports.getCurrentOrders = async (req, res) => {
  const orders = await orderModels.find({ state: '0' });
  res.status(200).json(orders);
}

module.exports.getHistoryOrders = async (req, res) => {
  const orders = await orderModels.find({ state: {$ne : '0'} });
  res.status(200).json(orders);
}




module.exports.getOrder = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
    }
    await orderModels.findById({ _id: req.params.id }, function (err, docs) {
        if (err) {
            return res.status(500).send("Order error" + err)
        }
        else {
            return res.status(200).send(docs)
        }
    }
    );
}

module.exports.deleteOrder = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
      }

      
      try {
        await orderModels.remove({ _id: req.params.id }).exec();
        return res.status(200).json({ message: "Order supprimé" });
    
      } catch (err) {
        return res.status(500).json({ message: err })
      }
}

module.exports.updateOrder = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID non trouvée")
      }
      try {
        await orderModels.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              idProvider: req.body.idProvider,
              idProduct: req.body.idProduct,
              amount: req.body.amount,
              date: req.body.date,
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
module.exports.updateStateOrder = async (req, res) => {
  await orderModels.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        state: req.body.choice
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
    (err, docs) => {
      if (!err) return res.json(docs);
      if (err) return res.status(500).send(err);
    }
  );
}