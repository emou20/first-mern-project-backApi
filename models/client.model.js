const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt');

const clientsSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        login: {
            type: String,
            required: true,
        },
        pass: {
            type: String,
            required: true
        },
        question: {
            type: String,
            required: true
        },
        reply: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Criptage de mote de passe en brypt algoritme avant la savegarde des données
clientsSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.pass = await bcrypt.hash(this.pass, salt);
    next();
  });

// Vérification de l'authentification (login et mot de passe)
clientsSchema.statics.login = async function(login, pass) {
    console.log(login, pass);
    const client = await this.findOne({login}).exec();
    console.log(client);
    if (client) {
      const auth = await bcrypt.compare(pass, client.pass);
      if (auth) {
        return client;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect login')
  };


const clientModels = mongoose.model('client', clientsSchema);
module.exports = clientModels;