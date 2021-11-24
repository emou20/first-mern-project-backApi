const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productsSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        ref: {
            type: String,
            required: true
        },
        foto: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);


const productModels = mongoose.model('product', productsSchema);
module.exports = productModels;