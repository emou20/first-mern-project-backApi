const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const providersSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        adress: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            required: true
        },
        taxNumber: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);


const providerModels = mongoose.model('provider', providersSchema);
module.exports = providerModels;