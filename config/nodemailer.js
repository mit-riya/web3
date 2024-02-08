import nodemailer from "nodemailer"

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
export const transporter = nodemailer.createTransport({
service: 'gmail',
auth:{
    user: email,
    pass,
},
})

export const mailOptions = {
    from:email
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});