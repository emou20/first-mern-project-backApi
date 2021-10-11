const roleModels = require('../models/role.model');
const ObjectID = require("mongoose").Types.ObjectId;


module.exports.getRoles = async (req, res) => {
   /* const roles = await roleModels.find();
    res.status(200).json(roles);*/

   /* await roleModels.find().then(response => {
        res.send(response);
    })*/
    roleModels.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log("Error to get data : " + err);
      });
}


module.exports.createRole = async (req, res) => {
    console.log(req.body);
    const nameGroupe = req.body.nameGroupe;
    const coefition =  req.body.coefition;
    try {
      const role = await roleModels.create({nameGroupe:nameGroupe, coefition:coefition});
      res.status(201).json({ roleId: role._id});
    }
    catch(err) {
        console.log(err);
      res.status(200).send({ err })
    }
  }

  module.exports.nameRole = async (req, res) => {
    const coefition= req.body.coefition;
    roleModels.find({coefition:coefition}, (err, data) => {
      !err ? res.send(data) : res.statuts(500).send('error to get data : '+ err );
  })
  }



  
  module.exports.deleteRole = async (req, res) => {
    console.log(req.params.id);
    if(!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID non trouvée")
    }
    try{
      await roleModels.remove({_id: req.params.id}).exec();
      return res.status(200).json({message:"Role supprimé"});

    }catch(err){
      return res.status(500).json({message : err})
    }
  }



  

  module.exports.updateRole = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID non trouvée")
    }
  try {
    await roleModels.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          nameGroupe: req.body.nameGroupe,
          coefition:req.body.coefition
        },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send( err);
      }
    );
  }catch(err){
    //res.status(500).send( "l'erreur est :" + err );
    //console.log(err)
  }
   
  };




  module.exports.getRole = async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(400).send("ID non trouvée")
    }
 
      await roleModels.find({_id: req.params.id}, function (err, docs) {
        if (err){
          return res.status(500).send("Role error" + err)
        }
        else{
          return res.status(200).send(docs)
        }
      }
    );
    
  }