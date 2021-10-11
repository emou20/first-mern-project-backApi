const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt');

const usersSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: '2'
        },
        foto: {
            type: String
        },
        login: {
            type: String,
            required: true,
        },
        pass: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Criptage de mote de passe en brypt algoritme avant la savegarde des données
usersSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.pass = await bcrypt.hash(this.pass, salt);
    next();
  });

// Vérification de l'authentification (login et mot de passe)
usersSchema.statics.login = async function(login, pass) {
    console.log(login, pass);
    const user = await this.findOne({login}).exec();
    console.log(user);
    if (user) {
        
      const auth = await bcrypt.compare(pass, user.pass);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect login')
  };


const userModels = mongoose.model('user', usersSchema);
module.exports = userModels;