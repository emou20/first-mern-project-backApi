const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const deletProductAmountSchema = new Schema(
    {
        idProduct: {
            type: String,
            required: true
        },
        idUser: {
            type: String,
            required: true
        },
        deletedAmount: {
            type: Number,
            required: true
        }, 
        pattern: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);


const deletProductsAmountSchema = mongoose.model('ProductAmountDeleted', deletProductAmountSchema);
module.exports = deletProductsAmountSchema;