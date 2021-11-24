const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stockSchema = new Schema(
    {
        idProduct: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        buyingPriceHt: {
            type: String,
            required: true
        },
        taxTva: {
            type: String,
            required: true
        },
        dlc: {
            type: String,
            required: true
        },
        margin: {
            type: String,
            required: true
        },
        public: {
            type: String,
            required: true,
            default: '0'
        }
    },
    {
        timestamps: true,
    }
);


const stockModels = mongoose.model('stock', stockSchema);
module.exports = stockModels;