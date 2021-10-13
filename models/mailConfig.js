const { Mongoose } = require('mongoose');

const mongoose = new Mongoose();
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    purpose: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const mailConfigSchema = new Schema({

    host: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    senderEmail: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    secure: {
        type: Boolean,
        required: true
    },
    template: templateSchema
});


module.exports = mailConfigSchema;