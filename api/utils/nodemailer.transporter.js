const nodemailer = require("nodemailer");
const { promisify } = require("util");

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.transport_mail = promisify(this.transporter.sendMail.bind(this.transporter));