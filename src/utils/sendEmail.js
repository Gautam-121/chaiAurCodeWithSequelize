import nodemailer from "nodemailer"

const sendEmail = async ({email , subject , message})=>{

    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        secure: false,
        auth:{
            user: process.env.SMPT_EMAIL,
            pass: process.env.SMPT_PASS
        }
    })

    const emailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        text: message
    }

    await transporter.sendMail(emailOptions)
}

export default sendEmail