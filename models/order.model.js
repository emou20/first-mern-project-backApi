const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ordersSchema = new Schema(
    {
        idProvider: {
            type: String,
            required: true
        },
        idProduct: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        state: {
            type: String,
            required: true,
            default: '0'
        }
    },
    {
        timestamps: true,
    }
);


const orderModels = mongoose.model('order', ordersSchema);
module.exports = orderModels;