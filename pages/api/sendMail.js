import {mailOptions, transporter } from "@/config/nodemailer";

const handler = async (req, res) =>{
  if(req.method === "POST"){
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
      console.log(error);
      return res.status(400).json({message: error.message})
    }

  }
  return res.status(400).json({message: "Bad Request"})
};

export default handler;