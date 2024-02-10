import {mailOptions, transporter } from "@/config/nodemailer";

const handler = async (req, res) =>{
    const {to, subject, text} = req.body;
    try {
      await transporter.sendMail({
        ...mailOptions,
        to: to,
        subject : subject,
        text : text
      })
      
      return res.status(200).json({message: "Email Sent"})
    } catch (error) {
      console.log(data)
      console.log(error);
      return res.status(400).json({message: error.message})
    }
};

export default handler;