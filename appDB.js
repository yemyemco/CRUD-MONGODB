const mongoose = require("mongoose");
const db = "recoveryDB";
const dbschema = new mongoose.Schema(
    {
        //Items in the DB structure
        itemName: {type: String, require: true},
        description: {type: String, require: true},
        locationFound: {type: String, require: true},
        dateFound: {type: Date, require: true},
        claimed: {type: Boolean, require: true}
    },
    {
        timestamps: true
    }
);

const exportDB = new mongoose.model(db, dbschema);
module.exports = exportDB;