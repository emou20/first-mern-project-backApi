const stockModels = require('../models/stock.model');
const stockProductModels = require('../models/stockProduct.model');
const deletProductsAmountSchema = require('../models/deletAmount.model');
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.addStock = (req, res) => {
  const { idProduct, amount, buyingPriceHt, taxTva, dlc, margin } = req.body;
  try {
    const Stock = stockModels.create({ idProduct, amount, buyingPriceHt, taxTva, dlc, margin });
    res.status(201).json({ Stock: Stock._id });
  }
  catch (err) {
    /*console.log(err);
    res.status(501).send({ err })*/
  }

  let priceHt = parseInt(buyingPriceHt) + parseInt(margin);
  let taxValue = (priceHt * parseInt(taxTva)) / 100;
  let priceTtc = priceHt + taxValue;

  stockProductModels.find({ idProduct: idProduct }, function (err, docs) {
    if (err) {
      return res.status(400).send("Stock error" + err)
    }
    else {
      if (docs.length > 0) {
        let lastStockAmount = docs[0].amount;
        let newStockAmount = lastStockAmount + parseInt(amount);
        stockProductModels.findOneAndUpdate(
          { idProduct: idProduct },
          {
            $set: {
              idProduct: idProduct,
              amount: newStockAmount,
              priceTtc: priceTtc
            },
          },
          { new: true, upsert: true },
          (err, docs) => {
            if (!err) console.log(docs);
            if (err) console.log(err);
          }
        );

      } else {
        const StockProduct = stockProductModels.create({ idProduct: idProduct, amount: parseInt(amount), priceTtc: priceTtc });
      }
    }
  }
  );



}

module.exports.deletProductAmount = (req, res) => {
  const { idProduct, idUser, deletedAmount, pattern } = req.body;

  const deletedProduct = deletProductsAmountSchema.create({ idProduct, idUser, deletedAmount: parseInt(deletedAmount), pattern });
  res.status(201).json({ deletedProduct: deletedProduct._id });

  stockProductModels.find({ idProduct: idProduct }, function (err, docs) {
    if (err) {
      return res.status(400).send("Stock error" + err)
    } else {
         if (docs[0].amount > parseInt(deletedAmount)) { 
          
          let priceTtc = docs[0].priceTtc;
          let lastStockAmount = docs[0].amount;
          let newStockAmount = lastStockAmount - parseInt(deletedAmount);
          
          stockProductModels.findOneAndUpdate(
            { idProduct: idProduct },
            {
              $set: {
                idProduct: idProduct,
                amount: newStockAmount,
                priceTtc: priceTtc
              },
            },
            { new: true, upsert: true },
            (err, docs) => {
              if (!err){
                console.log(docs);
              }
              if (err) console.log(err);
            }
          );
        }
      

    }
  })
}

module.exports.getDeletProductAmount = async (req, res) => {
  const deletProductsAmount = await deletProductsAmountSchema.find();
  res.status(200).json(deletProductsAmount);
}

module.exports.getStocksProducts = async (req, res) => {
  const StocksProducts = await stockProductModels.find();
  res.status(200).json(StocksProducts);
}

module.exports.getStocks = async (req, res) => {
  const Stocks = await stockModels.find();
  res.status(200).json(Stocks);
}

module.exports.getPublicStocks = async (req, res) => {
  const Stocks = await stockModels.find({ public: '1' });
  res.status(200).json(Stocks);
}

module.exports.getNoPublicStocks = async (req, res) => {
  const Stocks = await stockModels.find({ public: '0' });
  res.status(200).json(Stocks);
}


module.exports.getStock = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  await stockModels.findById({ _id: req.params.id }, function (err, docs) {
    if (err) {
      return res.status(500).send("Stock error" + err)
    }
    else {
      return res.status(200).send(docs)
    }
  }
  );
}

module.exports.deleteStock = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  try {
    await stockModels.remove({ _id: req.params.id }).exec();
    return res.status(200).json({ message: "Stock supprimé" });

  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

module.exports.updateStock = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID non trouvée")
  }
  try {
    await stockModels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          idProduct: req.body.idProduct,
          amount: req.body.amount,
          buyingPriceHt: req.body.buyingPriceHt,
          taxTva: req.body.taxTva,
          dlc: req.body.dlc,
          margin: req.body.margin,
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