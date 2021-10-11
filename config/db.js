const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://'+ process.env.DB_USER_PASS +'@profil-api.lbb9a.mongodb.net/profil-api',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }
)
    .then(() => console.log('connected to mongoDB'))
    .catch((err) => console.log('connexion failed to mongoDB', err))