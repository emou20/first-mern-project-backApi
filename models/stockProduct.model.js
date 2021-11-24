const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stockProductSchema = new Schema(
    {
        idProduct: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        priceTtc:{
            type: Number,
            required: true 
        }
    },
    {
        timestamps: true,
    }
);


const stockProductModels = mongoose.model('stockProduct', stockProductSchema);
module.exports = stockProductModels;