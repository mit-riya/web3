// Importing nodemailer library
import nodemailer from "nodemailer";

// Retrieving email and password from environment variables
const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

// Creating a nodemailer transporter with Gmail service
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass,
    },
});

// Defining mail options (you may need to complete these options based on your use case)
export const mailOptions = {
    from: email, // Sender email address
    // ... Add other options like to, subject, text, html, etc., based on your needs
};

// Sending mail using the transporter and mail options
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        // Log error if sending mail fails
        return console.log(error);
    }
});
