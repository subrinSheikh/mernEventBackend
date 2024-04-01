const { Schema, model, default: mongoose } = require('mongoose');
const contactSchema = new Schema({
    username: String,
    email: String,

    message: String

})
const Contact = new model("Contact", contactSchema);
module.exports = Contact;