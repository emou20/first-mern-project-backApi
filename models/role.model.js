const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolesSchema = new Schema(
    {
        nameGroupe: {
            type: String
        },
        coefition: {
            type: String
        }
    }
);

const roleModels = mongoose.model('groupe', rolesSchema);
module.exports = roleModels;