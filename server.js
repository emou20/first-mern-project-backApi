const express = require('express');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const productRoutes = require('./routes/product.routes');
const providerRoutes = require('./routes/provider.routes');
const orderRoutes = require('./routes/order.routes');
const stockRoutes = require('./routes/stock.routes');
const clientRoutes = require('./routes/client.routes');

require('dotenv').config({path:'./config/.env'});
require('./config/db');

const {checkUser, requireAuth} = require('./middleware/auth.middleware');

const app = express();
const cors = require('cors');

// cors autorisation
const corsOptions = {
    origin: true,
    credentials: true,
    'Access-Control-Allow-Credentials':true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
  app.use(cors(corsOptions));


//jwt cockie
app.use(cookieParser());

//jwt checkUser Verification
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

//parse Json 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/api/user', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/product', productRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/client', clientRoutes);

//middleware pour acceder a une dossier statique de donnée
//http://localhost:5000/upload/
app.use('/upload', express.static('upload'));

// server
app.listen(process.env.PORT, () => {
    console.log(`Listenin on port ${process.env.PORT}`);
})